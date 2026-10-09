import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: Request) {
  try {
    const { ir, messages } = await req.json();
    const system = `You are a Code Auditor. Use this IR: ${JSON.stringify(ir.summary)}. Context: ${ir.nodes.length} nodes.`;
    const response = await anthropic.messages.create({ model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest', max_tokens: 1024, system, messages });
    return NextResponse.json({ reply: response.content[0].type === 'text' ? response.content[0].text : '' });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
