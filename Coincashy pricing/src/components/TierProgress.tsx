import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { PricingQuote } from '../domain/types';

interface TierProgressProps {
  quote: PricingQuote;
}

export const TierProgress: React.FC<TierProgressProps> = ({ quote }) => {
  const { tierLabel, effectiveFeePercent, governingClass, nextTier, notionalUsd } = quote;
  const progressPercent = nextTier ? Math.min(100, Math.max(10, (notionalUsd / nextTier.thresholdUsd) * 100)) : 100;

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px', background: 'linear-gradient(180deg, rgba(226,184,102,0.04) 0%, var(--vault-2) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="var(--gold)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Active Tier:</span>
          <span className="font-mono" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>{tierLabel}</span>
          <span className={`badge badge-${governingClass.toLowerCase()}`}>{governingClass}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--dim)' }}>
          <span>Spread Fee:</span>
          <strong className="font-mono" style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{effectiveFeePercent.toFixed(2)}%</strong>
        </div>
      </div>

      <div style={{ width: '100%', height: '6px', background: 'var(--vault-4)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #3E63DD 0%, var(--gold) 100%)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>

      {nextTier ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--dim)' }}>
          <TrendingUp size={13} color="var(--gold)" />
          <span>Add <strong>${Math.round(nextTier.amountNeededUsd).toLocaleString()} USD</strong> more to unlock <strong>{nextTier.label}</strong> at <strong>{nextTier.potentialFeePercent.toFixed(2)}%</strong></span>
        </div>
      ) : (
        <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>
          Maximum institutional volume tier unlocked (Over $10M)
        </div>
      )}
    </div>
  );
};
