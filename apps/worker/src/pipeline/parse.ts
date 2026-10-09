import { Project, SyntaxKind, Node } from 'ts-morph';
import { ParseResult, SymbolInfo, CallEdge } from '../lib/types';

export async function parseRepo(workDir: string): Promise<ParseResult> {
  const project = new Project({ allowJs: true, skipLibCheck: true, noEmit: true });
  project.addSourceFilesAtPaths([`${workDir}/**/*.{ts,tsx,js,jsx}`, `!${workDir}/**/node_modules/**`, `!${workDir}/**/dist/**`, `!${workDir}/**/.next/**`]);
  const files = project.getSourceFiles();
  const symbols: SymbolInfo[] = [];
  const edges: CallEdge[] = [];
  const parseErrors: { file: string; message: string }[] = [];
  let filesDiscovered = files.length;
  let filesSkipped = 0;

  for (const sourceFile of files) {
    try {
      const filePath = sourceFile.getFilePath().replace(workDir, '');
      const addSymbol = (node: Node, name: string, kind: SymbolInfo['kind']) => {
        symbols.push({ id: `${filePath}::${name}`, file: filePath, name, kind, line: node.getStartLineNumber(), complexity: calculateComplexity(node), text: node.getText().slice(0, 2000) });
      };

      sourceFile.getFunctions().forEach(fn => { if (fn.getName()) addSymbol(fn, fn.getName()!, 'function'); });
      sourceFile.getClasses().forEach(cls => {
        if (cls.getName()) addSymbol(cls, cls.getName()!, 'class');
        cls.getMethods().forEach(m => { if (m.getName()) addSymbol(m, `${cls.getName()}::${m.getName()}`, 'method'); });
      });
      sourceFile.getVariableDeclarations().forEach(vd => {
        const init = vd.getInitializer();
        if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) addSymbol(vd, vd.getName(), 'function');
      });

      sourceFile.forEachDescendant(node => {
        if (Node.isCallExpression(node)) {
          const callee = node.getExpression().getText();
          const parentFn = node.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) || node.getFirstAncestorByKind(SyntaxKind.MethodDeclaration) || node.getFirstAncestorByKind(SyntaxKind.ArrowFunction);
          if (parentFn) {
            const parentName = Node.isFunctionDeclaration(parentFn) ? parentFn.getName() : Node.isMethodDeclaration(parentFn) ? parentFn.getName() : 'anonymous';
            if (parentName) edges.push({ sourceId: `${filePath}::${parentName}`, targetId: `${filePath}::${callee}`, type: 'call', weight: 1 });
          }
        }
      });
    } catch (e: any) { parseErrors.push({ file: sourceFile.getFilePath(), message: e.message }); filesSkipped++; }
  }
  return { files: [], symbols, edges, parseErrors, filesDiscovered, filesSkipped };
}

function calculateComplexity(node: Node): number {
  const matches = node.getText().match(/\b(if|for|while|case|catch)\b|\?|&&|\|\|/g);
  return matches ? matches.length + 1 : 1;
}
