'use client';

import React, { useState } from 'react';

export default function GuestDepositView() {
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'EUR' | 'USDT'>('EUR');
  const [purpose, setPurpose] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const guestDeposits = [
    { id: 'GST-94821', client: 'LGT Bank Counterparty Ltd', amount: '€50,000.00', status: 'Settled & Cleared', date: '18 Oct 2026', origin: 'Liechtenstein' },
    { id: 'GST-94822', client: 'Nexus Trading Partners', amount: '25,000.00 USDT', status: 'In Escrow (AML Screening)', date: 'Today, 11:30', origin: 'Switzerland' },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !amount) return;
    const randomCode = Math.random().toString(36).substring(2, 9);
    setGeneratedLink(`https://pay.coincashy.io/guest/${randomCode}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ============ TITLE ============ */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--hi)' }}>Guest &amp; Counterparty Clearing Escrow</h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--fg-dim)', marginTop: '4px' }}>
          Issue single-use deposit links for institutional third parties with automated AML compliance origin screening.
        </p>
      </div>

      {/* ============ GENERATOR CARD ============ */}
      <div
        style={{
          borderRadius: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          padding: 'clamp(1rem, 3vw, 2rem)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--hi)', marginBottom: '1.25rem' }}>
          Generate Inbound Counterparty Payment Link
        </h3>

        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.4rem' }}>
              Counterparty Legal Name
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Zurich Treasury AG"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--ground)',
                color: 'var(--hi)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.4rem' }}>
              Settlement Amount &amp; Currency
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: 'var(--ground)',
                  color: 'var(--hi)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--f-mono)',
                }}
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-2)',
                  color: 'var(--hi)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                <option value="EUR">EUR</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.4rem' }}>
              Invoice / Trade Purpose (Optional)
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Settlement for OTC Trade #9482 or Service Agreement"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--ground)',
                color: 'var(--hi)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-solid btn-sm"
              style={{ background: 'var(--gold, #E2B866)', color: '#000', fontWeight: 600, border: 'none' }}
            >
              Generate Single-Use Settlement Link
            </button>
          </div>
        </form>

        {generatedLink && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'var(--ground)', border: '1px solid var(--gold, #E2B866)' }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--gold, #E2B866)', fontWeight: 600 }}>
              Generated Link (Valid 48 Hours)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <code style={{ fontSize: '0.85rem', fontFamily: 'var(--f-mono)', color: 'var(--hi)', wordBreak: 'break-all', minWidth: 0 }}>{generatedLink}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedLink);
                  alert('Copied link to clipboard!');
                }}
                className="btn btn-solid btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.74rem', flexShrink: 0 }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============ ACTIVE ESCROW LEDGER ============ */}
      <div style={{ borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--line)', padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--hi)', marginBottom: '1.25rem' }}>
          Recent Counterparty Deposit Inflows
        </h3>

        {/* Desktop Table View */}
        <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--fg-faint)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem' }}>Receipt ID</th>
                <th style={{ padding: '0.75rem' }}>Counterparty</th>
                <th style={{ padding: '0.75rem' }}>Origin Jurisdiction</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {guestDeposits.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '0.85rem 0.75rem', fontFamily: 'var(--f-mono)', color: 'var(--fg-dim)' }}>{item.id}</td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: 'var(--hi)' }}>{item.client}</td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--fg-dim)' }}>{item.origin}</td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, fontFamily: 'var(--f-mono)', color: 'var(--coin-usdt)' }}>{item.amount}</td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '99px', background: item.status.includes('Settled') ? 'rgba(39, 161, 127, 0.12)' : 'rgba(245, 166, 35, 0.12)', color: item.status.includes('Settled') ? 'var(--coin-usdt)' : 'var(--pending)', fontSize: '0.72rem', fontWeight: 600 }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--fg-dim)', fontSize: '0.8rem' }}>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Stacked Cards */}
        <div className="mobile-cards-view" style={{ flexDirection: 'column', gap: '0.75rem' }}>
          {guestDeposits.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'var(--ground)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--hi)' }}>{item.client}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--fg-dim)', marginTop: '2px' }}>
                    {item.origin} · <span style={{ fontFamily: 'var(--f-mono)' }}>{item.id}</span>
                  </div>
                </div>

                <span style={{ padding: '2px 8px', borderRadius: '99px', background: item.status.includes('Settled') ? 'rgba(39, 161, 127, 0.12)' : 'rgba(245, 166, 35, 0.12)', color: item.status.includes('Settled') ? 'var(--coin-usdt)' : 'var(--pending)', fontSize: '0.7rem', fontWeight: 600, flexShrink: 0 }}>
                  {item.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid var(--line)', paddingTop: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--fg-faint)' }}>{item.date}</span>
                <span style={{ fontWeight: 650, fontFamily: 'var(--f-mono)', color: 'var(--coin-usdt)', fontSize: '0.92rem' }}>{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
