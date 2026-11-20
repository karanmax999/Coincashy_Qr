import React from 'react';
import { Sliders, RefreshCw } from 'lucide-react';
import { PricingQuote } from '../domain/types';

interface DeskControlsProps {
  quote: PricingQuote;
  basisPointsAdj: number;
  onBasisPointsChange: (val: number) => void;
  onCustomRateChange: (code: string, rate: number) => void;
}

export const DeskControls: React.FC<DeskControlsProps> = ({
  quote, basisPointsAdj, onBasisPointsChange, onCustomRateChange
}) => {
  const isCustomRateNeeded = quote.sourceCountry?.perUsd === null || quote.targetCountry?.perUsd === null;

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={16} color="var(--gold)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
            Desk Trader Adjustments
          </span>
        </div>
        {isCustomRateNeeded && (
          <span style={{ fontSize: '0.72rem', color: 'var(--amber)', background: 'rgba(247,107,21,0.12)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
            LP Rate Required
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dim)', marginBottom: '6px' }}>
            Spread Adjustment: <strong className="font-mono" style={{ color: basisPointsAdj === 0 ? '#FFF' : basisPointsAdj > 0 ? 'var(--amber)' : 'var(--emerald)' }}>
              {basisPointsAdj > 0 ? `+${basisPointsAdj}` : basisPointsAdj} bps
            </strong>
          </label>
          <input
            type="range"
            min="-20"
            max="50"
            step="1"
            value={basisPointsAdj}
            onChange={e => onBasisPointsChange(parseInt(e.target.value) || 0)}
            style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
          />
        </div>

        {quote.sourceCountry && (
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--dim)', marginBottom: '6px' }}>
              Override LP Rate: {quote.sourceCountry.code}/USD
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                step="any"
                value={quote.sourceRateUsd || ''}
                onChange={e => onCustomRateChange(quote.sourceCountry!.code, parseFloat(e.target.value) || 0)}
                className="font-mono"
                style={{ width: '100%', padding: '6px 10px', background: 'var(--vault-3)', border: '1px solid var(--line)', borderRadius: '6px', color: '#FFF', fontSize: '0.85rem' }}
              />
              <button
                onClick={() => onCustomRateChange(quote.sourceCountry!.code, quote.sourceCountry?.perUsd ?? quote.sourceCountry?.defaultLpRate ?? 1.0)}
                title="Reset to default rate"
                style={{ padding: '6px 10px', background: 'var(--vault-4)', border: '1px solid var(--line)', borderRadius: '6px', color: 'var(--dim)', cursor: 'pointer' }}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
