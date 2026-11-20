'use client';

import React, { useState } from 'react';

interface WhitelistItem {
  id: string;
  label: string;
  asset: string;
  network: string;
  address: string;
  dateAdded: string;
  status: 'Active' | 'Cooling Off';
}

export default function AddressBookView() {
  const [addresses, setAddresses] = useState<WhitelistItem[]>([
    {
      id: 'ADDR-1',
      label: 'Binance Corporate Desk Vault',
      asset: 'USDT',
      network: 'ERC-20',
      address: '0x8a1948210482Bce84CC94821a8f9b2047D1Bce84',
      dateAdded: '14 Jan 2026',
      status: 'Active',
    },
    {
      id: 'ADDR-2',
      label: 'BitGo Institutional Cold Storage',
      asset: 'USDT / USDC',
      network: 'ERC-20',
      address: '0x3f99482019481bce94821a8f9b2047D1Bce84821',
      dateAdded: '22 Feb 2026',
      status: 'Active',
    },
    {
      id: 'ADDR-3',
      label: 'Kraken Treasury Primary',
      asset: 'USDT',
      network: 'TRC-20',
      address: 'TWhitelistedKrakenDeskAlpha8492018492',
      dateAdded: '10 Mar 2026',
      status: 'Active',
    },
    {
      id: 'ADDR-4',
      label: 'Founding Partner Multisig',
      asset: 'BTC',
      network: 'Bitcoin Native',
      address: 'bc1q948201partnerdeskalpha8920184920',
      dateAdded: 'Today',
      status: 'Cooling Off',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAsset, setNewAsset] = useState('USDT');
  const [newNetwork, setNewNetwork] = useState('ERC-20');
  const [newAddress, setNewAddress] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;
    const newItem: WhitelistItem = {
      id: `ADDR-${addresses.length + 1}`,
      label: newLabel,
      asset: newAsset,
      network: newNetwork,
      address: newAddress,
      dateAdded: 'Just now',
      status: 'Cooling Off',
    };
    setAddresses([newItem, ...addresses]);
    setShowAddModal(false);
    setNewLabel('');
    setNewAddress('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* ============ TITLE & ADD BUTTON ============ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--hi)' }}>Whitelisted Address Book</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', marginTop: '2px' }}>
            Pre-approved crypto withdrawal destinations governed by MPC multi-signature policies and 24-hour time-locks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn btn-solid btn-sm"
          style={{ background: 'var(--gold, #E2B866)', color: '#000', fontWeight: 600, border: 'none' }}
        >
          + Add Whitelist Address
        </button>
      </div>

      {/* ============ ADDRESSES TABLE ============ */}
      <div style={{ borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        {/* Desktop Table View */}
        <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left', color: 'var(--fg-faint)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--surface-2)' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Wallet Label</th>
                <th style={{ padding: '0.85rem 1rem' }}>Asset &amp; Network</th>
                <th style={{ padding: '0.85rem 1rem' }}>Destination Address</th>
                <th style={{ padding: '0.85rem 1rem' }}>Added Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Security Status</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }} className="hover:bg-[var(--surface-2)]">
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--hi)' }}>
                    {item.label}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600 }}>{item.asset}</span>
                      <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg-dim)' }}>
                        {item.network}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--f-mono)', fontSize: '0.82rem', color: 'var(--fg-dim)' }}>
                    {item.address}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--fg-dim)', fontSize: '0.8rem' }}>
                    {item.dateAdded}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '99px', background: item.status === 'Active' ? 'rgba(0, 0, 255, 0.12)' : 'rgba(245, 166, 35, 0.12)', color: item.status === 'Active' ? 'var(--jade-text-d)' : 'var(--pending)', fontSize: '0.74rem', fontWeight: 600 }}>
                      {item.status === 'Active' ? '✓ Whitelisted' : '⏳ 24h Cooling Off'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.address);
                        alert('Address copied to clipboard!');
                      }}
                      className="btn btn-line btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Touch-Friendly Stacked Cards */}
        <div className="mobile-cards-view" style={{ flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
          {addresses.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'var(--ground)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--hi)' }}>{item.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--hi)' }}>{item.asset}</span>
                    <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg-dim)' }}>
                      {item.network}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: item.status === 'Active' ? 'rgba(0, 0, 255, 0.12)' : 'rgba(245, 166, 35, 0.12)', color: item.status === 'Active' ? 'var(--jade-text-d)' : 'var(--pending)', fontWeight: 600, flexShrink: 0 }}>
                  {item.status === 'Active' ? '✓ Whitelisted' : '⏳ Cooling Off'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 10px', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.76rem', color: 'var(--fg-dim)', wordBreak: 'break-all', minWidth: 0 }}>
                  {item.address}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(item.address);
                    alert('Address copied to clipboard!');
                  }}
                  className="btn btn-solid btn-sm"
                  style={{ flexShrink: 0, padding: '3px 8px', fontSize: '0.72rem' }}
                >
                  Copy
                </button>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--fg-faint)' }}>
                Added {item.dateAdded}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ ADD MODAL ============ */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              boxShadow: 'var(--shadow)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--hi)' }}>Add Whitelisted Address</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(245, 166, 35, 0.1)', border: '1px solid rgba(245, 166, 35, 0.25)', color: 'var(--pending)', fontSize: '0.78rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              <strong>Notice:</strong> For your treasury security, newly whitelisted addresses undergo a <strong>24-hour cooling-off period</strong> before outbound withdrawals can be dispatched.
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--fg-faint)', display: 'block', marginBottom: '4px' }}>
                  Wallet Nickname / Label
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Copper ClearLoop Primary"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--fg-faint)', display: 'block', marginBottom: '4px' }}>Asset</label>
                  <select
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--hi)', fontSize: '0.85rem' }}
                  >
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--fg-faint)', display: 'block', marginBottom: '4px' }}>Network</label>
                  <select
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--hi)', fontSize: '0.85rem' }}
                  >
                    <option value="ERC-20">ERC-20</option>
                    <option value="TRC-20">TRC-20</option>
                    <option value="Arbitrum">Arbitrum</option>
                    <option value="Bitcoin Native">Bitcoin Native</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--fg-faint)', display: 'block', marginBottom: '4px' }}>
                  Destination Address
                </label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="0x... or T... or bc1..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.85rem', fontFamily: 'var(--f-mono)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-solid btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Submit for MPC Whitelist
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-line btn-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
