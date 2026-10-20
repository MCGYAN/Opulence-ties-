import { NextResponse } from 'next/server';
import {
  AssistantOrder,
  AssistantTurn,
  assistantSystemPrompt,
  localAssistantReply,
  readAssistantReply,
} from '@/lib/assistant';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages = (Array.isArray(body?.messages) ? body.messages : []) as AssistantTurn[];
  const orders = (Array.isArray(body?.orders) ? body.orders : []) as AssistantOrder[];
  const origin = new URL(request.url).origin;
  const history = messages.filter((turn) => turn && typeof turn.text === 'string').slice(-12);

  const key = process.env.GROQ_API_KEY;
  const model = process.env.ASSISTANT_MODEL;
  if (!key || !model) {
    return NextResponse.json({ ...localAssistantReply(history, orders, origin), live: false });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: assistantSystemPrompt(orders) },
          ...history.map((turn) => ({
            role: turn.role === 'customer' ? 'user' : 'assistant',
            content: turn.text,
          })),
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ...localAssistantReply(history, orders, origin), live: false });
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) {
      return NextResponse.json({ ...localAssistantReply(history, orders, origin), live: false });
    }

    return NextResponse.json({ ...readAssistantReply(raw), live: true });
  } catch {
    return NextResponse.json({ ...localAssistantReply(history, orders, origin), live: false });
  }
}
