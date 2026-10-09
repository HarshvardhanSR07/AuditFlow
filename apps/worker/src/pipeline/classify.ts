import { SymbolInfo } from '../lib/types';

export function classifySymbol(symbol: SymbolInfo): { swimlane: string; type: string } {
  const swimlane = symbol.file.includes('/api/') || symbol.file.includes('route') ? 'ingress' : 
                   symbol.file.includes('db') || symbol.file.includes('prisma') ? 'data' : 'core';
                   
  const type = swimlane === 'data' ? 'database' : 
               symbol.kind === 'class' ? 'module' : 'function';
               
  return { swimlane, type };
}
