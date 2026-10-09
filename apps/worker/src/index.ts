import { Worker } from 'bullmq';
import { runAuditPipeline } from './pipeline/run';
import 'dotenv/config';

const worker = new Worker('audit', async (job) => { await runAuditPipeline(job.data.auditId, job.data.repoUrl); }, { connection: { url: process.env.REDIS_URL }, concurrency: 2 });
const shutdown = async () => { console.log('Shutting down...'); await worker.close(); process.exit(0); };
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
console.log('Worker listening...');
