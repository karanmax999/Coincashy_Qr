import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export interface DraftRequest {
  goal: string;
  audience_description: string;
  tone: string;
  consent_origin: 'registered' | 'event';
}

export interface DraftResponse {
  subject_lines: string[];
  preheader: string;
  markdown_body: string;
  spam_trigger_audit: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Partial<DraftRequest> | null;

    if (!body || !body.goal) {
      return NextResponse.json(
        { error: 'Missing required field: goal is mandatory' },
        { status: 400 }
      );
    }

    const {
      goal,
      audience_description = 'Institutional OTC partners, web3 founders, and family offices',
      tone = 'Crisp, institutional, authoritative fintech tone without hype',
      consent_origin = 'registered',
    } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL;

    if (!model) {
      return NextResponse.json(
        { error: 'ANTHROPIC_MODEL environment variable is not configured' },
        { status: 500 }
      );
    }

    // If API key is missing in local environment, provide deterministic structured draft
    if (!apiKey || apiKey.startsWith('sk-ant-api03-your')) {
      return NextResponse.json({
        subject_lines: [
          `Institutional Update: ${goal.slice(0, 30)}`,
          `Coincashy Treasury Brief: ${goal.slice(0, 28)}`,
          `Market Notice: Settlement & Liquidity Update`,
        ],
        preheader: `Important operational update regarding ${goal.slice(0, 50)}.`,
        markdown_body: `Dear {{first_name | "there"}},\n\nWe are pleased to provide an update for {{company | "your team"}} regarding our continued enhancements to European liquidity and OTC settlement rails.\n\n### Overview\n\n${goal}\n\nOur institutional desk operates with deep liquidity and dedicated relationship managers to ensure frictionless execution for European entities.\n\nIf you have any questions or require custom settlement arrangements, reply directly to this notice or contact our desk.`,
        spam_trigger_audit: [
          'No aggressive sales triggers identified',
          'Token personalization {{first_name}} and {{company}} verified',
          'Free of exclamation marks and speculative financial terminology',
        ],
      } satisfies DraftResponse);
    }

    // Call Anthropic API with strict inputs (NEVER pass recipient lists or emails)
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are the lead institutional communications editor for Coincashy, a licensed European crypto OTC and liquidity provider.
Your task is to write high-converting, compliant email copy for institutional clients and partners.

Rules:
1. No hype, no rocket emojis, no financial advice, no exaggerated guarantees.
2. Tone: Financial Times meets institutional European fintech.
3. You MUST use personalization tokens exactly as:
   - {{first_name | "there"}}
   - {{company | "your team"}}
4. Return ONLY a valid JSON object with EXACTLY the following structure (do not wrap in codeblocks or include extra text):
{
  "subject_lines": ["<Subject 1 under 50 chars>", "<Subject 2 under 50 chars>", "<Subject 3 under 50 chars>"],
  "preheader": "<Preheader snippet under 90 chars>",
  "markdown_body": "<Full body in markdown format using the personalization tokens>",
  "spam_trigger_audit": ["<Risk assessment item 1>", "<Risk assessment item 2>", "<Risk assessment item 3>"]
}`;

    const userPrompt = `Campaign Goal: ${goal}
Target Audience: ${audience_description}
Desired Tone: ${tone}
Consent Origin: ${consent_origin === 'event' ? 'Industry Event Connection' : 'Registered on coincashy.io'}

Draft the institutional copy now in strict JSON format.`;

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const firstBlock = response.content[0];
    const text = firstBlock.type === 'text' ? firstBlock.text : '';

    // Clean JSON markdown codeblocks if returned
    const cleanedText = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanedText) as DraftResponse;
      return NextResponse.json(parsed);
    } catch {
      console.warn('[Draft API] JSON parsing failed, returning fallback wrapper');
      return NextResponse.json({
        subject_lines: [
          `Coincashy Brief: ${goal.slice(0, 32)}`,
          `Operational Notice: OTC Liquidity Update`,
          `Treasury Announcement for Partners`,
        ],
        preheader: `Update regarding ${goal.slice(0, 60)}.`,
        markdown_body: text || `Hello {{first_name | "there"}},\n\nUpdate regarding ${goal} for {{company | "your team"}}.`,
        spam_trigger_audit: ['Generated via Anthropic raw response stream'],
      } satisfies DraftResponse);
    }
  } catch (error) {
    console.error('[Draft API Exception]', error);
    return NextResponse.json(
      { error: 'Failed to generate email draft', details: String(error) },
      { status: 500 }
    );
  }
}
