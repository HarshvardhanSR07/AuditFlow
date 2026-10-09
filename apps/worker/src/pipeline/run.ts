import { prisma } from '../lib/prisma';
import { cloneRepo } from './clone';
import { parseRepo } from './parse';
import { rankSymbols } from './repomap';
import { assembleIR } from './assemble';
import { enrichIR } from './enrich';
import fs from 'node:fs/promises';

export async function runAuditPipeline(auditId: string, repoUrl: string) {
  let workDir = '';
  try {
    await prisma.audit.update({ where: { id: auditId }, data: { status: 'CLONING', progress: 10 }});
    const clone = await cloneRepo(repoUrl); workDir = clone.workDir;
    await prisma.audit.update({ where: { id: auditId }, data: { status: 'PARSING', progress: 30 }});
    const parseRes = await parseRepo(workDir);
    await prisma.audit.update({ where: { id: auditId }, data: { status: 'RANKING', progress: 50 }});
    const { rankedSymbols, repoMapText } = rankSymbols(parseRes.symbols, parseRes.edges);
    await prisma.audit.update({ where: { id: auditId }, data: { status: 'ASSEMBLE', progress: 70 }});
    let ir = assembleIR({ repoUrl, commitSha: clone.commitSha, branch: clone.branch, parseResult: parseRes, rankedSymbols });
    if (process.env.ANTHROPIC_API_KEY) {
      await prisma.audit.update({ where: { id: auditId }, data: { status: 'ENRICH', progress: 85 }});
      ir = await enrichIR(ir, repoMapText);
    }
    await prisma.audit.update({ where: { id: auditId }, data: { status: 'COMPLETED', progress: 100, ir: ir as any, healthScore: ir.meta.health.score, healthGrade: ir.meta.health.grade, commitSha: clone.commitSha, branch: clone.branch, completedAt: new Date() }});
  } catch (e: any) { await prisma.audit.update({ where: { id: auditId }, data: { status: 'FAILED', errorMessage: e.message }}); }
  finally { if (workDir) await fs.rm(workDir, { recursive: true, force: true }).catch(() => {}); }
}
