import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Queue } from 'bullmq';
import { nanoid } from 'nanoid';

let auditQueue: Queue;
try {
  auditQueue = new Queue('audit', { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } });
} catch (e) {}

const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+(?:\.git)?\/?$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const repoUrl = typeof body?.repoUrl === 'string' ? body.repoUrl.trim() : '';

    if (!repoUrl || !GITHUB_REPO_REGEX.test(repoUrl)) {
      return NextResponse.json({ error: 'A valid https://github.com/owner/repo URL is required.' }, { status: 400 });
    }

    const slug = nanoid(10);
    const audit = await prisma.audit.create({
      data: {
        slug,
        repoUrl,
        status: 'QUEUED',
        commitSha: 'pending',
        branch: 'pending'
      }
    });

    if (auditQueue) {
      await auditQueue.add('analyze', { auditId: audit.id, repoUrl });
    }

    return NextResponse.json({ id: audit.id, slug: audit.slug });
  } catch (e: any) {
    console.error('[Audit Submission Error]:', e?.message || e);
    return NextResponse.json({ error: 'Failed to queue repository audit.' }, { status: 500 });
  }
}
