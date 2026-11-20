'use client';

import React, { useState, useMemo } from 'react';
import CryptoLogo from '@/components/CryptoLogo';
import CurrencySelectModal from '@/components/CurrencySelectModal';

interface BuyCryptoTx {
  id: string;
  provider: 'MERCURYO' | 'YELLOW CARD';
  guest: string;
  expectedSpend: string;
  cryptoReceived: string;
  status: 'Completed' | 'Pending' | 'Processing';
  date: string;
}

export default function BuyCryptoView() {
  const [fiatAmount, setFiatAmount] = useState('100');
  const [fiatCurrency, setFiatCurrency] = useState<string>('EUR');
  const [cryptoAsset, setCryptoAsset] = useState<string>('ETH');
  const [provider, setProvider] = useState<'Mercuryo' | 'Yellow Card'>('Mercuryo');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [modalType, setModalType] = useState<'fiat' | 'crypto' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination & filter state for transactions table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [transactions, setTransactions] = useState<BuyCryptoTx[]>([
    {
      id: '8fb9e4f2-b65f-432b-981d-1cf23202a184',
      provider: 'MERCURYO',
      guest: '—',
      expectedSpend: '100 EUR',
      cryptoReceived: '0.0458 ETH',
      status: 'Completed',
      date: 'Today, 11:24',
    },
    {
      id: '43965ca5-2d98-40a2-b555-2f533e013117',
      provider: 'MERCURYO',
      guest: '—',
      expectedSpend: '250 EUR',
      cryptoReceived: '0.1145 ETH',
      status: 'Completed',
      date: 'Yesterday, 16:40',
    },
    {
      id: '73a4d484-be83-4bd1-ad52-2dc4e5c0f768',
      provider: 'MERCURYO',
      guest: '—',
      expectedSpend: '500 EUR',
      cryptoReceived: '0.2291 ETH',
      status: 'Completed',
      date: 'Oct 22, 2026',
    },
    {
      id: '4ec9020c-bdb1-4b96-b09f-3722a31dc597',
      provider: 'MERCURYO',
      guest: '—',
      expectedSpend: '1,200 EUR',
      cryptoReceived: '0.5501 ETH',
      status: 'Completed',
      date: 'Oct 19, 2026',
    },
  ]);

  // Indicative asset rates in EUR
  const assetRatesEur: Record<string, number> = {
    ETH: 2181.39,
    BTC: 78120.4,
    USDT: 0.9259,
    USDC: 0.9259,
    SOL: 158.4,
    BNB: 545.2,
    TRX: 0.152,
  };

  const rate = assetRatesEur[cryptoAsset] || 2181.39;
  const numSpend = parseFloat(fiatAmount) || 0;
  // Precision calculation matching screenshot: 0.04584214389020506
  const calculatedCrypto = numSpend > 0 ? (numSpend / rate).toFixed(cryptoAsset === 'BTC' || cryptoAsset === 'ETH' ? 8 : 2) : '0.00';

  const handleBuy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newTx: BuyCryptoTx = {
        id: crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}`,
        provider: provider.toUpperCase() as any,
        guest: '—',
        expectedSpend: `${numSpend.toLocaleString()} ${fiatCurrency}`,
        cryptoReceived: `${calculatedCrypto} ${cryptoAsset}`,
        status: 'Completed',
        date: 'Just now',
      };
      setTransactions([newTx, ...transactions]);
      alert(`Card onramp of ${fiatAmount} ${fiatCurrency} processed via ${provider}. Credited ${calculatedCrypto} ${cryptoAsset}.`);
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ['Transaction id', 'Provider', 'Guest', 'Expected spend amount', 'Crypto Received', 'Status', 'Date'];
    const rows = transactions.map((t) => [t.id, t.provider, t.guest, t.expectedSpend, t.cryptoReceived, t.status, t.date]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coincashy_buy_crypto_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* ============ TWO-COLUMN SPLIT CONTAINER ============ */}
      <div
        className="buy-crypto-split-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 420px) 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ================================================================= */}
        {/* LEFT COLUMN: BUY CRYPTO CARD (EXACT MATCH TO REFERENCE)          */}
        {/* ================================================================= */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Card Top Brand Badge */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* VISA text in bold italic font */}
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#1A1F71',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                VISA
              </span>
              {/* Mastercard circles */}
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#EB001B', display: 'inline-block' }} />
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#F79E1B',
                    marginLeft: '-7px',
                    display: 'inline-block',
                    opacity: 0.9,
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--fg-dim)', fontWeight: 500 }}>Coincashy</span>
          </div>

          {/* YOU SPEND BOX */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
            }}
          >
            <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '6px' }}>
              You spend
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <input
                type="number"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                placeholder="100"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.6rem',
                  fontWeight: 650,
                  fontFamily: 'var(--f-display)',
                  fontVariantNumeric: 'tabular-nums lining-nums',
                  color: 'var(--hi)',
                  minWidth: 0,
                }}
              />
              <button
                type="button"
                onClick={() => setModalType('fiat')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '6px 12px 6px 10px',
                  cursor: 'pointer',
                  color: 'var(--hi)',
                  fontWeight: 650,
                  fontSize: '0.92rem',
                  flexShrink: 0,
                }}
              >
                <CryptoLogo symbol={fiatCurrency} size={22} />
                <span>{fiatCurrency}</span>
                <svg style={{ width: 14, height: 14, color: 'var(--fg-dim)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* YOU GET BOX */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
            }}
          >
            <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '6px' }}>
              You get
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div
                style={{
                  flex: 1,
                  fontSize: '1.25rem',
                  fontWeight: 650,
                  fontFamily: 'var(--f-display)',
                  fontVariantNumeric: 'tabular-nums lining-nums',
                  color: 'var(--hi)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                ≈ {calculatedCrypto}
              </div>
              <button
                type="button"
                onClick={() => setModalType('crypto')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '6px 12px 6px 10px',
                  cursor: 'pointer',
                  color: 'var(--hi)',
                  fontWeight: 650,
                  fontSize: '0.92rem',
                  flexShrink: 0,
                }}
              >
                <CryptoLogo symbol={cryptoAsset} size={22} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                  <span>{cryptoAsset}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--fg-dim)', fontWeight: 500 }}>
                    {cryptoAsset === 'ETH' ? 'Ethereum' : cryptoAsset === 'BTC' ? 'Bitcoin' : cryptoAsset}
                  </span>
                </div>
                <svg style={{ width: 14, height: 14, color: 'var(--fg-dim)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Subtitle Notice */}
          <div style={{ fontSize: '0.76rem', color: 'var(--fg-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>ⓘ Final amount calculated after processing fees</span>
          </div>

          {/* RATE & VENDOR ROW */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--line)',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', fontFamily: 'var(--f-mono)' }}>
              1 {cryptoAsset} ≈ {rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiatCurrency}
            </span>

            <button
              type="button"
              onClick={() => setShowVendorModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                padding: '5px 10px',
                cursor: 'pointer',
                color: 'var(--hi)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <span style={{ color: 'var(--fg-dim)' }}>Pay with</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 650 }}>
                {provider === 'Mercuryo' ? (
                  <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                ) : (
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
                )}
                {provider}
              </span>
              <svg style={{ width: 12, height: 12, color: 'var(--fg-dim)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* ACTION BUTTON */}
          <button
            type="button"
            onClick={handleBuy}
            disabled={isProcessing || numSpend <= 0}
            className="btn btn-solid"
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.98rem',
              fontWeight: 700,
              justifyContent: 'center',
              background: '#0B1120',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              cursor: isProcessing || numSpend <= 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '0.5rem',
            }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span>{isProcessing ? 'Connecting Gateway...' : `Buy ${cryptoAsset}`}</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: BUY CRYPTO TRANSACTION HISTORY TABLE               */}
        {/* ================================================================= */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Top Actions: Export CSV */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: '#1D4ED8',
                color: '#ffffff',
                border: 'none',
                fontWeight: 650,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)',
              }}
            >
              <svg style={{ width: 15, height: 15 }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L18.5 9H15z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--ground)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>Transaction id</th>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>Provider</th>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>Guest</th>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>Expected spend amount</th>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice((page - 1) * pageSize, page * pageSize).map((tx) => (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--f-mono)', color: 'var(--hi)', fontSize: '0.78rem' }}>
                      {tx.id}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--fg-dim)', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                      {tx.provider}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--fg-faint)' }}>{tx.guest}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-mono)' }}>
                      {tx.expectedSpend}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'rgba(59, 130, 246, 0.12)',
                          color: '#60A5FA',
                          fontWeight: 600,
                        }}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Institutional Pagination Footer (Matching Reference) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--fg-dim)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setPage(1)}
                disabled={page === 1}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-2)',
                  color: 'var(--hi)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >
                |‹
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-2)',
                  color: 'var(--hi)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.4 : 1,
                }}
              >
                ‹
              </button>
              <span style={{ margin: '0 4px' }}>Page {page} of {Math.ceil(transactions.length / pageSize) || 1}</span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(transactions.length / pageSize)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-2)',
                  color: 'var(--hi)',
                  cursor: page >= Math.ceil(transactions.length / pageSize) ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(transactions.length / pageSize) ? 0.4 : 1,
                }}
              >
                ›
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.ceil(transactions.length / pageSize))}
                disabled={page >= Math.ceil(transactions.length / pageSize)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-2)',
                  color: 'var(--hi)',
                  cursor: page >= Math.ceil(transactions.length / pageSize) ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(transactions.length / pageSize) ? 0.4 : 1,
                }}
              >
                ›|
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Results per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface-2)',
                    color: 'var(--hi)',
                    fontSize: '0.78rem',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <span>Showing 1 - {transactions.length} of {transactions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* "CHOOSE VENDOR" MODAL (EXACT MATCH TO media_1792917346803_8e827c15)*/}
      {/* ================================================================= */}
      {showVendorModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose vendor"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 14, 0.72)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowVendorModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              borderRadius: '20px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hi)', margin: 0 }}>Choose vendor</h3>
              <button
                type="button"
                onClick={() => setShowVendorModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--fg-dim)',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {/* Vendor List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  id: 'Mercuryo' as const,
                  name: 'Mercuryo',
                  icon: (
                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                      </svg>
                    </div>
                  ),
                },
                {
                  id: 'Yellow Card' as const,
                  name: 'Yellow Card',
                  icon: (
                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: '3px solid #F59E0B', display: 'inline-block' }} />
                    </div>
                  ),
                },
              ].map((v) => {
                const isSel = provider === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setProvider(v.id);
                      setShowVendorModal(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '1rem',
                      borderRadius: '14px',
                      border: isSel ? '1px solid #3B82F6' : '1px solid var(--line)',
                      background: isSel ? 'rgba(59, 130, 246, 0.08)' : 'var(--ground)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {v.icon}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 650, color: 'var(--hi)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--fg-dim)' }}>
                        {v.id === 'Mercuryo' ? 'Instant card onramp across Europe & UK' : 'Direct African & Global banking rails'}
                      </div>
                    </div>
                    {isSel && (
                      <span style={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 700 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CURRENCY SELECT MODAL */}
      <CurrencySelectModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        onSelect={(item) => {
          if (modalType === 'fiat') setFiatCurrency(item.symbol);
          if (modalType === 'crypto') setCryptoAsset(item.symbol);
          setModalType(null);
        }}
        selectedCurrency={modalType === 'fiat' ? fiatCurrency : cryptoAsset}
        allowedCategory={modalType === 'fiat' ? 'fiat' : 'crypto'}
        title={modalType === 'fiat' ? 'Select Fiat Currency' : 'Select Crypto Asset'}
      />

      <style jsx>{`
        @media (max-width: 900px) {
          .buy-crypto-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
