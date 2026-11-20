import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { CountryConfig, LiquidityClass } from '../domain/types';

interface MatrixTableProps {
  countries: CountryConfig[];
  onSelectCountry?: (code: string) => void;
}

export const MatrixTable: React.FC<MatrixTableProps> = ({ countries, onSelectCountry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return countries.filter(c => {
      const matchSearch = c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'ALL' || c.class === selectedClass;
      return matchSearch && matchClass;
    });
  }, [countries, searchTerm, selectedClass]);

  const classes: Array<'ALL' | LiquidityClass> = ['ALL', 'Major', 'Liquid', 'Emerging', 'Restricted'];

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="var(--dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search country or currency..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'var(--vault-3)', border: '1px solid var(--line)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={15} color="var(--dim)" />
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: selectedClass === cls ? 'var(--blue)' : 'var(--vault-3)', color: '#FFF', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line-strong)', color: 'var(--dim)', background: 'var(--vault-3)' }}>
              <th style={{ padding: '12px 10px' }}>Country</th>
              <th style={{ padding: '12px 10px' }}>Code</th>
              <th style={{ padding: '12px 10px' }}>Class</th>
              <th style={{ padding: '12px 10px' }}>Rate / USD</th>
              <th style={{ padding: '12px 10px' }}>&lt;$100K</th>
              <th style={{ padding: '12px 10px' }}>$100K–500K</th>
              <th style={{ padding: '12px 10px' }}>$500K–1M</th>
              <th style={{ padding: '12px 10px' }}>$1M–10M</th>
              <th style={{ padding: '12px 10px' }}>&gt;$10M</th>
              <th style={{ padding: '12px 10px' }}>Rail & Settlement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr
                key={c.code}
                onClick={() => onSelectCountry && onSelectCountry(c.code)}
                style={{ borderBottom: '1px solid var(--line)', cursor: onSelectCountry ? 'pointer' : 'default', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 10px', fontWeight: 600, color: '#FFF' }}>
                  <span style={{ marginRight: '8px' }}>{c.flag}</span>
                  {c.country}
                </td>
                <td className="font-mono" style={{ padding: '12px 10px', color: 'var(--gold)', fontWeight: 600 }}>{c.code}</td>
                <td style={{ padding: '12px 10px' }}>
                  <span className={`badge badge-${c.class.toLowerCase()}`}>{c.class}</span>
                </td>
                <td className="font-mono" style={{ padding: '12px 10px' }}>
                  {c.perUsd !== null ? c.perUsd.toFixed(4) : <span style={{ color: 'var(--amber)' }}>LP Rate</span>}
                </td>
                {c.fiatToCryptoTiers.map((t, idx) => (
                  <td key={idx} className="font-mono" style={{ padding: '12px 10px', color: idx === 4 ? 'var(--emerald)' : 'var(--chalk)' }}>
                    {t.toFixed(2)}%
                  </td>
                ))}
                <td style={{ padding: '12px 10px', color: 'var(--dim)', fontSize: '0.78rem' }}>
                  <strong>{c.rail}</strong>
                  <div style={{ color: 'var(--faint)' }}>{c.settlementTime}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
