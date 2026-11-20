import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FlowType, CountryConfig, CryptoAsset } from '../domain/types';

interface CurrencyPairProps {
  flow: FlowType;
  sourceCode: string;
  targetCode: string;
  countries: CountryConfig[];
  cryptoAssets: CryptoAsset[];
  onSourceChange: (code: string) => void;
  onTargetChange: (code: string) => void;
}

export const CurrencyPair: React.FC<CurrencyPairProps> = ({
  flow, sourceCode, targetCode, countries, cryptoAssets, onSourceChange, onTargetChange
}) => {
  const isSourceCrypto = flow === 'crypto_to_fiat';
  const isTargetCrypto = flow === 'fiat_to_crypto';

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Source Currency ({isSourceCrypto ? 'Crypto' : 'Fiat / Country'})
          </label>
          <select
            value={sourceCode}
            onChange={e => onSourceChange(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'var(--vault-3)', border: '1px solid var(--line-strong)', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, outline: 'none' }}
          >
            {isSourceCrypto ? (
              cryptoAssets.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol} - {c.name}</option>)
            ) : (
              countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.country} ({c.code}) - {c.class}</option>)
            )}
          </select>
        </div>

        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--vault-4)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '18px' }}>
          <ArrowRight size={16} color="var(--gold)" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Target Currency ({isTargetCrypto ? 'Crypto' : 'Fiat / Country'})
          </label>
          <select
            value={targetCode}
            onChange={e => onTargetChange(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', background: 'var(--vault-3)', border: '1px solid var(--line-strong)', borderRadius: '10px', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, outline: 'none' }}
          >
            {isTargetCrypto ? (
              cryptoAssets.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol} - {c.name}</option>)
            ) : (
              countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.country} ({c.code}) - {c.class}</option>)
            )}
          </select>
        </div>
      </div>
    </div>
  );
};
