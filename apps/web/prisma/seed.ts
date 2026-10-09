import { PrismaClient } from '@prisma/client';
import { demoIR } from '../src/lib/demo/ai-chatbot-ir';
const prisma = new PrismaClient();
async function main() {
  await prisma.audit.upsert({ where: { slug: 'demo' }, update: {}, create: { slug: 'demo', repoUrl: 'https://github.com/demo/chatbot', commitSha: 'demo', branch: 'main', status: 'COMPLETED', ir: demoIR as any, healthScore: 85, healthGrade: 'B' } });
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
