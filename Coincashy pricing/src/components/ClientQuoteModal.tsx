import React from 'react';
import { X, Copy, Check, MessageSquare } from 'lucide-react';
import { PricingQuote } from '../domain/types';

interface ClientQuoteModalProps {
  isOpen: boolean;
  quote: PricingQuote;
  copyFeedback: string | null;
  onClose: () => void;
  onCopy: () => void;
}

export const ClientQuoteModal: React.FC<ClientQuoteModalProps> = ({
  isOpen, quote, copyFeedback, onClose, onCopy
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '24px', background: 'var(--vault-2)', border: '1px solid var(--line-strong)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Client Quoting Summary</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="font-mono" style={{ background: 'var(--vault-3)', padding: '16px', borderRadius: '10px', fontSize: '0.82rem', lineHeight: 1.6, color: '#FFFFFF', border: '1px solid var(--line)', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
          {`🏛️ COINCASHY OTC QUOTE\n━━━━━━━━━━━━━━━━━━━━━━━━\nPair: ${quote.sourceCurrency} → ${quote.targetCurrency}\nYou Send: ${quote.sourceAmount.toLocaleString()} ${quote.sourceCurrency}\nYou Receive: ${quote.netTargetAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${quote.targetCurrency}\nEffective Rate: 1 ${quote.sourceCurrency} = ${quote.effectiveExchangeRate.toFixed(6)} ${quote.targetCurrency}\nAll-In Fee: ${quote.effectiveFeePercent.toFixed(2)}% (Tier: ${quote.tierLabel})\nSettlement Rail: ${quote.rail}\nDelivery Time: ${quote.settlementTime}\n━━━━━━━━━━━━━━━━━━━━━━━━\nValid for immediate execution.`}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCopy}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: copyFeedback ? 'var(--emerald)' : 'var(--blue)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
          >
            {copyFeedback ? <Check size={18} /> : <Copy size={18} />}
            {copyFeedback ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={onClose}
            style={{ padding: '12px 18px', background: 'var(--vault-4)', color: 'var(--dim)', border: '1px solid var(--line)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
