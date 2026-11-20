import React from 'react';
import { Layers, Table2, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'matrix';
  onTabChange: (tab: 'calculator' | 'matrix') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--line)', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'radial-gradient(circle, #3E63DD 0%, #0000FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(62,99,221,0.4)' }}>
          <Zap size={22} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF' }}>COINCASHY</h1>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(226,184,102,0.15)', color: 'var(--gold)', border: '1px solid rgba(226,184,102,0.3)', borderRadius: '4px', fontWeight: 600 }}>PRICING DESK</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--dim)', margin: 0 }}>Institutional OTC & Cross-Border Matrix v2.1</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--vault-3)', padding: '4px', borderRadius: '10px', border: '1px solid var(--line)' }}>
        <button
          onClick={() => onTabChange('calculator')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '7px', border: 'none', background: activeTab === 'calculator' ? 'var(--vault-card)' : 'transparent', color: activeTab === 'calculator' ? '#FFFFFF' : 'var(--dim)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.15s ease', boxShadow: activeTab === 'calculator' ? '0 2px 8px rgba(0,0,0,0.5)' : 'none' }}
        >
          <Layers size={16} color={activeTab === 'calculator' ? 'var(--gold)' : 'currentColor'} />
          Live Calculator
        </button>
        <button
          onClick={() => onTabChange('matrix')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '7px', border: 'none', background: activeTab === 'matrix' ? 'var(--vault-card)' : 'transparent', color: activeTab === 'matrix' ? '#FFFFFF' : 'var(--dim)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.15s ease', boxShadow: activeTab === 'matrix' ? '0 2px 8px rgba(0,0,0,0.5)' : 'none' }}
        >
          <Table2 size={16} color={activeTab === 'matrix' ? 'var(--gold)' : 'currentColor'} />
          54-Country Matrix
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--dim)', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--line)' }}>
        <ShieldCheck size={15} color="var(--emerald)" />
        <span>ECB Mid Anchor: <strong className="font-mono" style={{ color: '#FFFFFF' }}>1.1150</strong> (EUR/USD)</span>
      </div>
    </header>
  );
};
