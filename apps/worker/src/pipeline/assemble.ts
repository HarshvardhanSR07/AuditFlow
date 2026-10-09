import { AuditFlowIR, gradeFromScore } from '@auditflow/ir';
import { classifySymbol } from './classify';

export function assembleIR({ repoUrl, commitSha, branch, parseResult, rankedSymbols }: any): AuditFlowIR {
  const nodes: any[] = [];
  const edges: any[] = [];
  let penaltyPoints = parseResult.parseErrors.length * 5;
  const rankedIds = new Set(rankedSymbols.map((r: any) => r.symbol.id));

  rankedSymbols.forEach(({ symbol }: any) => {
    const { swimlane, type } = classifySymbol(symbol);
    nodes.push({ id: symbol.id, type, label: symbol.name, symbol: symbol.name, loc: { file: symbol.file, line: symbol.line }, swimlane, riskLevel: 'none', intentSummary: 'Pending...', assumptions: [], complexity: { kind: 'cyclomatic', value: symbol.complexity }, signature: { algorithm: 'sha256', normalization: 'ast-v1', digest: `sha256-${symbol.text.length}` }, verification: 'unchecked', origin: 'static' });
  });

  parseResult.edges.forEach((edge: any) => {
    if (rankedIds.has(edge.sourceId) && rankedIds.has(edge.targetId)) edges.push({ id: `e-${edge.sourceId}-${edge.targetId}`, source: edge.sourceId, target: edge.targetId, type: 'call', weight: 1, isCriticalPath: false });
  });
  
  const score = Math.max(0, 100 - penaltyPoints);
  return {
    meta: { schemaVersion: "1.1", repoUrl, repoName: repoUrl.split('/').pop() || '', commitSha, branch, analyzedAt: new Date().toISOString(), languages: ['typescript'], health: { score, grade: gradeFromScore(score), formulaVersion: '1.0', penalties: [] }, coverage: { filesDiscovered: parseResult.filesDiscovered, filesAnalyzed: parseResult.filesDiscovered - parseResult.filesSkipped, filesSkipped: parseResult.filesSkipped, totalSymbols: parseResult.symbols.length, truncated: false, parseErrors: parseResult.parseErrors }, analyzer: { name: 'auditflow', version: '1.0' }, analysisDurationMs: 0 },
    nodes, edges, risks: [], assumptions: [], topComplexFiles: [],
    summary: { oneLiner: 'Static assembly', architectureStyle: 'Unknown', criticalRiskIds: [] },
    layout: {}
  };
}
