import { SymbolInfo, CallEdge } from '../lib/types';
export function rankSymbols(symbols: SymbolInfo[], edges: CallEdge[]) {
  const scores: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  symbols.forEach(s => { scores[s.id] = 1.0; outDegree[s.id] = 0; });
  edges.forEach(e => { if (outDegree[e.sourceId] !== undefined) outDegree[e.sourceId]++; });

  for (let i = 0; i < 10; i++) {
    const nextScores: Record<string, number> = {};
    symbols.forEach(s => nextScores[s.id] = 0.15);
    edges.forEach(e => {
      if (scores[e.sourceId] && outDegree[e.sourceId] > 0) nextScores[e.targetId] = (nextScores[e.targetId] || 0) + (scores[e.sourceId] * 0.85 / outDegree[e.sourceId]);
    });
    Object.assign(scores, nextScores);
  }
  const rankedSymbols = symbols.map(s => ({ symbol: s, score: scores[s.id] || 0 })).sort((a, b) => b.score - a.score).slice(0, 80);
  const repoMapText = rankedSymbols.map(rs => `${rs.symbol.id} [${rs.symbol.kind}] - ${rs.symbol.file}:${rs.symbol.line} (score: ${rs.score.toFixed(2)})\nCode:\n${rs.symbol.text}`).join('\n\n');
  return { rankedSymbols, repoMapText };
}
