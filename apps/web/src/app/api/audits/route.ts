import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Queue } from 'bullmq';
import { nanoid } from 'nanoid';

let auditQueue: Queue;
try { auditQueue = new Queue('audit', { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } }); } catch (e) {}

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl?.startsWith('https://github.com/')) return NextResponse.json({ error: 'Only github.com URLs allowed' }, { status: 400 });
    const slug = nanoid(10);
    const audit = await prisma.audit.create({ data: { slug, repoUrl, status: 'QUEUED', commitSha: 'pending', branch: 'pending' }});
    if (auditQueue) await auditQueue.add('analyze', { auditId: audit.id, repoUrl });
    return NextResponse.json({ id: audit.id, slug: audit.slug });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
