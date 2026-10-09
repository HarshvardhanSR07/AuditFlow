import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const audit = await prisma.audit.findUnique({ where: { slug: params.slug } });
  if (!audit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(audit);
}
