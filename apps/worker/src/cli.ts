import { cloneRepo } from './pipeline/clone';
import { parseRepo } from './pipeline/parse';
import { rankSymbols } from './pipeline/repomap';
import { assembleIR } from './pipeline/assemble';
import { enrichIR } from './pipeline/enrich';
import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const repoUrl = process.argv[2];
  if (!repoUrl) process.exit(1);
  let workDir = '';
  try {
    const clone = await cloneRepo(repoUrl); workDir = clone.workDir;
    const parseRes = await parseRepo(workDir);
    const { rankedSymbols, repoMapText } = rankSymbols(parseRes.symbols, parseRes.edges);
    let ir = assembleIR({ repoUrl, commitSha: clone.commitSha, branch: clone.branch, parseResult: parseRes, rankedSymbols });
    if (process.env.ANTHROPIC_API_KEY) ir = await enrichIR(ir, repoMapText);
    const outPath = path.join(process.cwd(), `ir-${Date.now()}.json`);
    await fs.writeFile(outPath, JSON.stringify(ir, null, 2));
    console.log(`Saved to ${outPath}`);
  } catch (e) { console.error(e); }
  finally { if (workDir) await fs.rm(workDir, { recursive: true, force: true }).catch(() => {}); }
}
main();
