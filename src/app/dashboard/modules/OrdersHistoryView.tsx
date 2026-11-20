'use client';

import React, { useState } from 'react';
import CryptoLogo from '@/components/CryptoLogo';

export default function OrdersHistoryView() {
  const [filterPair, setFilterPair] = useState('ALL');

  const orders = [
    { id: 'RFQ-CC-84297', pair: 'BTC / USDT', side: 'SELL BTC', rate: '84,297.67 USDT', pay: '0.2500 BTC', receive: '21,074.42 USDT', slippage: '0.00%', date: 'Yesterday, 09:41', status: 'Filled' },
    { id: 'RFQ-CC-84298', pair: 'EUR / USDT', side: 'BUY USDT', rate: '1.0820 USD', pay: '€10,000.00', receive: '10,820.00 USDT', slippage: '0.00%', date: '21 Oct, 14:15', status: 'Filled' },
    { id: 'RFQ-CC-84299', pair: 'ETH / EUR', side: 'SELL ETH', rate: '2,445.80 EUR', pay: '2.5000 ETH', receive: '€6,114.50', slippage: '0.00%', date: '19 Oct, 11:32', status: 'Filled' },
    { id: 'RFQ-CC-84300', pair: 'USDT / BTC', side: 'BUY BTC', rate: '82,100.00 USDT', pay: '15,000.00 USDT', receive: '0.1827 BTC', slippage: '0.00%', date: '17 Oct, 16:55', status: 'Filled' },
  ];

  const filtered = filterPair === 'ALL' ? orders : orders.filter(o => o.pair.includes(filterPair));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* ============ TITLE & CONTROLS ============ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--hi)' }}>Conversions &amp; RFQ Trade History</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', marginTop: '2px' }}>
            Historical record of all institutional OTC RFQ trades executed at 0% slippage.
          </p>
        </div>

        {/* Pair Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--surface-2)', padding: '4px', borderRadius: '10px', border: '1px solid var(--line)' }}>
          {['ALL', 'BTC', 'ETH', 'EUR'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilterPair(p)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filterPair === p ? 'var(--surface)' : 'transparent',
                color: filterPair === p ? 'var(--hi)' : 'var(--fg-dim)',
                fontWeight: filterPair === p ? 600 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ============ TABLE ============ */}
      <div style={{ borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        {/* Desktop Table */}
        <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--fg-faint)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--surface-2)' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>RFQ Order ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Market Pair</th>
                <th style={{ padding: '0.85rem 1rem' }}>Side</th>
                <th style={{ padding: '0.85rem 1rem' }}>Execution Rate</th>
                <th style={{ padding: '0.85rem 1rem' }}>Sold</th>
                <th style={{ padding: '0.85rem 1rem' }}>Received</th>
                <th style={{ padding: '0.85rem 1rem' }}>Slippage</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date &amp; Time</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--line)' }} className="hover:bg-[var(--surface-2)]">
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'var(--f-mono)', color: 'var(--fg-dim)', fontSize: '0.78rem' }}>
                    {order.id}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 650, color: 'var(--hi)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CryptoLogo symbol={order.pair.split('/')[0].trim()} size={20} />
                      <span>{order.pair}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.74rem', padding: '2px 7px', borderRadius: '4px', background: order.side.includes('BUY') ? 'rgba(0, 0, 255, 0.12)' : 'rgba(235, 87, 87, 0.12)', color: order.side.includes('BUY') ? 'var(--jade-text-d)' : 'var(--coral)', fontWeight: 600 }}>
                      {order.side}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums', color: 'var(--fg)' }}>
                    {order.rate}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--coral)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    -{order.pay}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--jade-text-d)', fontWeight: 600, fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    +{order.receive}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--jade-text-d)', fontWeight: 600 }}>
                    {order.slippage}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--fg-dim)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {order.date}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', fontSize: '0.74rem', fontWeight: 600 }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile View: Clean Stacked Cards */}
        <div className="mobile-cards-view" style={{ flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
          {filtered.map((order) => (
            <div
              key={order.id}
              style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'var(--ground)',
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CryptoLogo symbol={order.pair.split('/')[0].trim()} size={28} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 650, color: 'var(--hi)' }}>{order.pair}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: order.side.includes('BUY') ? 'rgba(0, 0, 255, 0.12)' : 'rgba(235, 87, 87, 0.12)', color: order.side.includes('BUY') ? 'var(--jade-text-d)' : 'var(--coral)', fontWeight: 600 }}>
                      {order.side}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--fg-dim)', marginTop: '3px' }}>
                    {order.date} · Rate: {order.rate}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', color: '#3B82F6', fontWeight: 650, fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                  +{order.receive}
                </div>
                <span style={{ display: 'inline-block', marginTop: '3px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', fontSize: '0.7rem', fontWeight: 600 }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
