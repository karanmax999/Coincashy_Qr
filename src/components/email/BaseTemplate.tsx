import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components';

export type ConsentOriginVariant = 'registered' | 'event';

export interface BaseTemplateProps {
  previewText?: string;
  recipientEmail?: string;
  unsubscribeToken?: string;
  consentVariant?: ConsentOriginVariant;
  children?: React.ReactNode;
}

export function BaseTemplate({
  previewText,
  recipientEmail,
  unsubscribeToken,
  consentVariant = 'registered',
  children,
}: BaseTemplateProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coincashy.io';

  // Read legal entities strictly from config/env with VERIFY_BEFORE_PROD placeholders
  const entityName = process.env.COINCASHY_LEGAL_ENTITY_NAME || 'Coincashy Sp. z o.o.';
  const krs = process.env.COINCASHY_LEGAL_KRS || 'VERIFY_BEFORE_PROD';
  const nip = process.env.COINCASHY_LEGAL_NIP || 'VERIFY_BEFORE_PROD';
  const vasp = process.env.COINCASHY_LEGAL_VASP_REG || 'VERIFY_BEFORE_PROD';
  const address = process.env.COINCASHY_LEGAL_ADDRESS || 'Warsaw, Poland (VERIFY_BEFORE_PROD)';

  const unsubscribeUrl = unsubscribeToken
    ? `${siteUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
    : `${siteUrl}/unsubscribe`;

  const consentNotice =
    consentVariant === 'event'
      ? 'You received this email because we connected at an industry event.'
      : 'You received this email because you registered on coincashy.io.';

  return (
    <Html lang="en">
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body
        style={{
          backgroundColor: '#000000', // --vault
          color: '#F2F2F2', // --chalk
          fontFamily:
            "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: '24px 0',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#0A0A0A', // --vault-2
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '36px 32px',
          }}
        >
          {/* Header Bar */}
          <Section style={{ marginBottom: '32px' }}>
            <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td>
                  <Link
                    href={siteUrl}
                    style={{
                      textDecoration: 'none',
                      color: '#F2F2F2',
                      fontSize: '20px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      display: 'inline-block',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#0000FF', // --jade
                        borderRadius: '50%',
                        marginRight: '8px',
                        verticalAlign: 'middle',
                      }}
                    />
                    COINCASHY
                  </Link>
                </td>
                <td align="right">
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#0000FF', // --jade
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(0, 0, 255, 0.4)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Institutional OTC
                  </span>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Body Content */}
          <Section
            style={{
              color: '#F2F2F2',
              fontSize: '15px',
              lineHeight: '1.65',
            }}
          >
            {children}
          </Section>

          {/* Divider */}
          <Hr
            style={{
              borderColor: 'rgba(255, 255, 255, 0.12)',
              margin: '36px 0 24px 0',
            }}
          />

          {/* Mandatory Compliance Footer */}
          <Section
            style={{
              color: '#8E8E93',
              fontSize: '12px',
              lineHeight: '1.6',
            }}
          >
            {/* Consent Basis Notice */}
            <Text style={{ margin: '0 0 10px 0', color: '#B0B0B5' }}>
              {consentNotice}
            </Text>

            {/* Entity Disclosures */}
            <Text style={{ margin: '0 0 8px 0', color: '#8E8E93' }}>
              {entityName} · KRS: {krs} · NIP: {nip} · VASP Registry: {vasp}
            </Text>
            <Text style={{ margin: '0 0 16px 0', color: '#8E8E93' }}>
              Registered Office: {address}
            </Text>

            {/* Unsubscribe & Manage Preferences */}
            <Text style={{ margin: '0' }}>
              Don&apos;t want to receive these emails?{' '}
              <Link
                href={unsubscribeUrl}
                style={{
                  color: '#6B6BFF',
                  textDecoration: 'underline',
                  fontWeight: 500,
                }}
              >
                Unsubscribe here
              </Link>
              {recipientEmail && (
                <span style={{ color: '#555555' }}>
                  {' '}(sent to {recipientEmail})
                </span>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
