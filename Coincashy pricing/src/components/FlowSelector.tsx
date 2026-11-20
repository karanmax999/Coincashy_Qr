import React from 'react';
import { ArrowRightLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { FlowType } from '../domain/types';

interface FlowSelectorProps {
  flow: FlowType;
  onSelect: (flow: FlowType) => void;
}

export const FlowSelector: React.FC<FlowSelectorProps> = ({ flow, onSelect }) => {
  const options = [
    { id: 'fiat_to_crypto' as FlowType, label: 'Fiat → Crypto', desc: 'On-ramp client fiat to stablecoins / BTC', icon: ArrowUpRight, color: '#3E63DD' },
    { id: 'crypto_to_fiat' as FlowType, label: 'Crypto → Fiat', desc: 'Off-ramp stablecoins to local bank rails', icon: ArrowDownRight, color: 'var(--emerald)' },
    { id: 'fiat_to_fiat' as FlowType, label: 'Fiat → Fiat', desc: 'Cross-border FX with liquidity matrix rule', icon: ArrowRightLeft, color: 'var(--gold)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
      {options.map(opt => {
        const isSelected = flow === opt.id;
        const IconComponent = opt.icon;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              border: isSelected ? `1.5px solid ${opt.color}` : '1px solid var(--line)',
              background: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'var(--vault-2)',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: isSelected ? `0 0 20px -5px ${opt.color}40` : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${opt.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconComponent size={20} color={opt.color} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : 'var(--chalk)' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--dim)', marginTop: '2px' }}>
                {opt.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
