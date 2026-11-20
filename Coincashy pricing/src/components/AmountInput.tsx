import React from 'react';
import { DollarSign } from 'lucide-react';

interface AmountInputProps {
  amount: number;
  sourceCurrency: string;
  notionalUsd: number;
  onChange: (val: number) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({ amount, sourceCurrency, notionalUsd, onChange }) => {
  const quickPills = [50_000, 100_000, 250_000, 500_000, 1_000_000, 5_000_000];

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase' }}>
          Enter Trade Amount ({sourceCurrency})
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--gold)', background: 'var(--gold-glow)', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
          <DollarSign size={13} />
          <span>USD Notional: <strong className="font-mono">${Math.round(notionalUsd).toLocaleString()}</strong></span>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
        <input
          type="number"
          min="1"
          step="any"
          value={amount || ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="font-mono"
          style={{ width: '100%', padding: '14px 18px', fontSize: '1.5rem', fontWeight: 700, background: 'var(--vault-3)', border: '1px solid var(--line-strong)', borderRadius: '12px', color: '#FFFFFF', outline: 'none' }}
          placeholder="0.00"
        />
        <div style={{ position: 'absolute', right: '16px', fontWeight: 700, color: 'var(--dim)', fontSize: '1.1rem' }}>
          {sourceCurrency}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {quickPills.map(val => (
          <button
            key={val}
            onClick={() => onChange(val)}
            style={{ padding: '6px 12px', background: amount === val ? 'var(--blue)' : 'var(--vault-3)', border: '1px solid var(--line)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            {val >= 1_000_000 ? `${val / 1_000_000}M` : `${val / 1_000}K`}
          </button>
        ))}
      </div>
    </div>
  );
};
