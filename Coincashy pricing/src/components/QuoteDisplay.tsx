import React from 'react';
import { Copy, Check, Send } from 'lucide-react';
import { PricingQuote } from '../domain/types';

interface QuoteDisplayProps {
  quote: PricingQuote;
  copyFeedback: string | null;
  onCopyQuote: () => void;
  onOpenModal: () => void;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, copyFeedback, onCopyQuote, onOpenModal }) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px', border: '1px solid rgba(226,184,102,0.3)', background: 'radial-gradient(ellipse at top, rgba(226,184,102,0.08) 0%, var(--vault-2) 70%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Client Net Payout
          </span>
          <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#FFFFFF', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {quote.netTargetAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            <span style={{ fontSize: '1.2rem', color: 'var(--dim)', marginLeft: '10px' }}>{quote.targetCurrency}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCopyQuote}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: copyFeedback ? 'var(--emerald)' : 'var(--blue)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            {copyFeedback ? <Check size={16} /> : <Copy size={16} />}
            {copyFeedback ? 'Copied!' : 'Copy Quote'}
          </button>
          <button
            onClick={onOpenModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: 'var(--vault-4)', color: 'var(--chalk)', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Send size={15} />
            Details
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Effective Rate</div>
          <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
            1 {quote.sourceCurrency} = {quote.effectiveExchangeRate.toFixed(6)} {quote.targetCurrency}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Mid Exchange Rate</div>
          <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--dim)' }}>
            1 {quote.sourceCurrency} = {quote.midExchangeRate.toFixed(6)} {quote.targetCurrency}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Spread Fee Amount</div>
          <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gold)' }}>
            {quote.feeAmountTarget.toLocaleString(undefined, { maximumFractionDigits: 2 })} {quote.targetCurrency} (${Math.round(quote.feeAmountUsd).toLocaleString()})
          </div>
        </div>
      </div>
    </div>
  );
};
