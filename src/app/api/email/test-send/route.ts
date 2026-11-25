import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { BaseTemplate } from '@/components/email/BaseTemplate';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.subject || !body.contentMarkdown) {
      return NextResponse.json(
        { error: 'Subject and contentMarkdown are required' },
        { status: 400 }
      );
    }

    const testRecipient =
      body.to || process.env.TEST_EMAIL || 'test@coincashy.io';

    const { subject, preheader, contentMarkdown, consentOrigin = 'registered' } = body;

    // Replace personalization tokens with sample data for preview
    const renderedBody = contentMarkdown
      .replace(/\{\{\s*first_name\s*\|\s*["']?([^"']*)["']?\s*\}\}/g, 'Alex')
      .replace(/\{\{\s*first_name\s*\}\}/g, 'Alex')
      .replace(/\{\{\s*company\s*\|\s*["']?([^"']*)["']?\s*\}\}/g, 'Acme Liquidity Fund')
      .replace(/\{\{\s*company\s*\}\}/g, 'Acme Liquidity Fund');

    // Split markdown into simple paragraphs for React rendering
    const paragraphs = renderedBody
      .split('\n\n')
      .filter((p: string) => p.trim().length > 0);

    const emailComponent = React.createElement(
      BaseTemplate,
      {
        previewText: preheader,
        recipientEmail: testRecipient,
        unsubscribeToken: 'test-preview-token',
        consentVariant: consentOrigin,
      },
      paragraphs.map((p: string, idx: number) => {
        if (p.startsWith('### ')) {
          return React.createElement(
            'h3',
            {
              key: idx,
              style: {
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                marginTop: '20px',
                marginBottom: '8px',
              },
            },
            p.replace('### ', '')
          );
        }
        return React.createElement(
          'p',
          {
            key: idx,
            style: {
              color: '#F2F2F2',
              fontSize: '15px',
              lineHeight: '1.65',
              margin: '0 0 16px 0',
            },
          },
          p
        );
      })
    );

    const result = await sendEmail({
      to: testRecipient,
      subject: `[TEST PREVIEW] ${subject}`,
      react: emailComponent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to dispatch test email', skipped: result.skipped },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      recipient: testRecipient,
    });
  } catch (error) {
    console.error('[Test Send Error]', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: String(error) },
      { status: 500 }
    );
  }
}
