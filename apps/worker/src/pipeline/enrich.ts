import Anthropic from '@anthropic-ai/sdk';
import { AuditFlowIR, parseAuditFlowIR } from '@auditflow/ir';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function enrichIR(ir: AuditFlowIR, repoMapText: string): Promise<AuditFlowIR> {
  const priorityNodes = [...ir.nodes].sort((a, b) => b.complexity.value - a.complexity.value).slice(0, 25);
  const prompt = `Role: Senior Systems Architect. Task: Reverse-engineer intent and risks. Context: \n${repoMapText}\nOutput strict JSON: { "nodes": [{ "id": "...", "intentSummary": "...", "assumptions": [], "riskLevel": "none|low|medium|high|critical" }], "risks": [{ "id": "...", "severity": "low|medium|high|critical", "title": "...", "description": "...", "category": "...", "citations": [{ "file": "...", "line": 0 }] }], "summary": { "oneLiner": "...", "architectureStyle": "...", "criticalRiskIds": [] } }`;

  try {
    const response = await anthropic.messages.create({ model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest", max_tokens: 4096, messages: [{ role: "user", content: prompt }] });
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return ir;
    const enrichedData = JSON.parse(match[0]);
    enrichedData.nodes?.forEach((en: any) => { const node = ir.nodes.find(n => n.id === en.id); if (node) { node.intentSummary = en.intentSummary || node.intentSummary; node.assumptions = en.assumptions || []; node.riskLevel = en.riskLevel || node.riskLevel; node.origin = 'hybrid'; }});
    if (enrichedData.risks) ir.risks.push(...enrichedData.risks);
    if (enrichedData.summary) ir.summary = { ...ir.summary, ...enrichedData.summary };
    return parseAuditFlowIR(ir);
  } catch (err) { return ir; }
}
