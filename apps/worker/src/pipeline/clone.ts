import simpleGit from 'simple-git';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function cloneRepo(repoUrl: string) {
  if (!repoUrl.startsWith('https://github.com/')) throw new Error('Only https://github.com URLs are allowed for security.');
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'auditflow-'));
  const git = simpleGit();
  try {
    await git.clone(repoUrl, workDir, ['--depth', '1', '--single-branch', '--no-tags']);
    const commitSha = await git.cwd(workDir).revparse(['HEAD']);
    const branch = await git.cwd(workDir).revparse(['--abbrev-ref', 'HEAD']);
    return { workDir, commitSha, branch };
  } catch (err) {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  }
}
