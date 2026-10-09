export interface SourceFileInfo { path: string; language: 'typescript' | 'javascript'; lineCount: number; content: string; }
export interface SymbolInfo { id: string; file: string; name: string; kind: 'function' | 'class' | 'method' | 'variable'; line: number; complexity: number; text: string; }
export interface CallEdge { sourceId: string; targetId: string; type: 'call' | 'import'; weight: number; id?: string; }
export interface ParseResult { files: SourceFileInfo[]; symbols: SymbolInfo[]; edges: CallEdge[]; parseErrors: { file: string; message: string }[]; filesDiscovered: number; filesSkipped: number; }
