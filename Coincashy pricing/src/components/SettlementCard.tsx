import React from 'react';
import { Landmark, Clock, AlertCircle } from 'lucide-react';
import { PricingQuote } from '../domain/types';

interface SettlementCardProps {
  quote: PricingQuote;
}

export const SettlementCard: React.FC<SettlementCardProps> = ({ quote }) => {
  return (
    <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(62,99,221,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={20} color="#7090FF" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase', fontWeight: 600 }}>Settlement Rail</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{quote.rail || 'Direct Bank Rails'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(48,164,108,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="var(--emerald)" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase', fontWeight: 600 }}>Delivery Speed</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{quote.settlementTime || 'Same Day'}</div>
          </div>
        </div>
      </div>

      {quote.notes && (
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--dim)' }}>
          <AlertCircle size={15} color="var(--gold)" style={{ flexShrink: 0 }} />
          <span><strong>Desk Note:</strong> {quote.notes}</span>
        </div>
      )}
    </div>
  );
};
