import { z } from 'zod';

export const IRNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['service', 'database', 'external', 'client', 'module', 'function']),
  label: z.string(),
  symbol: z.string().optional(),
  loc: z.object({ file: z.string(), line: z.number() }),
  swimlane: z.string(),
  riskLevel: z.enum(['none', 'low', 'medium', 'high', 'critical']),
  intentSummary: z.string(),
  assumptions: z.array(z.string()),
  complexity: z.object({ kind: z.string(), value: z.number() }),
  signature: z.object({ algorithm: z.string(), normalization: z.string(), digest: z.string() }),
  verification: z.enum(['unchecked', 'verified', 'drifted']),
  origin: z.enum(['static', 'hybrid', 'manual']),
});

export const IREdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.enum(['call', 'import', 'data', 'trigger']),
  weight: z.number(),
  isCriticalPath: z.boolean().default(false),
});

export const IRRiskSchema = z.object({
  id: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  citations: z.array(z.object({ file: z.string(), line: z.number() })),
});

export const AuditFlowIRSchema = z.object({
  meta: z.object({
    schemaVersion: z.string(),
    repoUrl: z.string(),
    repoName: z.string(),
    commitSha: z.string(),
    branch: z.string(),
    analyzedAt: z.string(),
    languages: z.array(z.string()),
    health: z.object({
      score: z.number(),
      grade: z.string(),
      formulaVersion: z.string(),
      penalties: z.array(z.object({ reason: z.string(), points: z.number() })),
    }),
    coverage: z.object({
      filesDiscovered: z.number(),
      filesAnalyzed: z.number(),
      filesSkipped: z.number(),
      totalSymbols: z.number(),
      truncated: z.boolean(),
      parseErrors: z.array(z.object({ file: z.string(), message: z.string() })),
    }),
    analyzer: z.object({ name: z.string(), version: z.string() }),
    analysisDurationMs: z.number(),
  }),
  nodes: z.array(IRNodeSchema),
  edges: z.array(IREdgeSchema),
  risks: z.array(IRRiskSchema),
  assumptions: z.array(z.string()),
  topComplexFiles: z.array(z.string()),
  summary: z.object({
    oneLiner: z.string(),
    architectureStyle: z.string(),
    criticalRiskIds: z.array(z.string()),
  }),
  layout: z.record(z.object({ x: z.number(), y: z.number() })).optional(),
}).superRefine((data, ctx) => {
  const nodeIds = new Set(data.nodes.map(n => n.id));
  data.edges.forEach((edge, i) => {
    if (!nodeIds.has(edge.source)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Edge source missing: ${edge.source}`, path: ['edges', i, 'source'] });
    if (!nodeIds.has(edge.target)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Edge target missing: ${edge.target}`, path: ['edges', i, 'target'] });
  });
});

export type AuditFlowIR = z.infer<typeof AuditFlowIRSchema>;
export type IRNode = z.infer<typeof IRNodeSchema>;
export type IREdge = z.infer<typeof IREdgeSchema>;
export type IRRisk = z.infer<typeof IRRiskSchema>;

export function makeNodeId(file: string, symbol: string) { return `${file}::${symbol}`; }
export function signNode(content: string) { return `sha256-${content.length}`; }
export function gradeFromScore(score: number) { return score > 90 ? 'A' : score > 80 ? 'B' : score > 70 ? 'C' : score > 60 ? 'D' : 'F'; }
export function redactSnippet(code: string) { return code.replace(/secret|password|key/gi, '[REDACTED]'); }
export const parseAuditFlowIR = (data: unknown) => AuditFlowIRSchema.parse(data);
