'use client';

import React, { useState } from 'react';
import CryptoLogo from '@/components/CryptoLogo';
import CurrencySelectModal from '@/components/CurrencySelectModal';

interface DepositTx {
  id: string;
  provider: 'BCB Group' | 'Manual bank transfer' | 'Kingdom Bank';
  expectedSpend: string;
  currency: string;
  status: 'Completed' | 'Pending';
  date: string;
}

export default function FiatDepositView() {
  const [spendAmount, setSpendAmount] = useState('100');
  const [currency, setCurrency] = useState('EUR');
  const [paymentMethod, setPaymentMethod] = useState<'Wire Transfer' | 'SEPA Instant' | 'SWIFT'>('Wire Transfer');
  const [provider, setProvider] = useState<'BCB Group' | 'Manual bank transfer' | 'Kingdom Bank'>('BCB Group');
  const [feeOpen, setFeeOpen] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Pagination for transactions table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [transactions, setTransactions] = useState<DepositTx[]>([
    {
      id: '24s5jw2fno3r',
      provider: 'BCB Group',
      expectedSpend: '100 EUR',
      currency: 'EUR',
      status: 'Completed',
      date: 'Today, 09:15',
    },
    {
      id: 'obvq9r7k0n8t',
      provider: 'Manual bank transfer',
      expectedSpend: '100 USD',
      currency: 'USD',
      status: 'Completed',
      date: 'Yesterday, 14:20',
    },
    {
      id: 't9tunz3so18j',
      provider: 'BCB Group',
      expectedSpend: '100 EUR',
      currency: 'EUR',
      status: 'Completed',
      date: 'Oct 23, 2026',
    },
    {
      id: '5e3df05f-e0e2-4ea8-a0f3-eb20e7ee899d',
      provider: 'Kingdom Bank',
      expectedSpend: '1,500 EUR',
      currency: 'EUR',
      status: 'Completed',
      date: 'Oct 18, 2026',
    },
  ]);

  const bankDetails = {
    beneficiary: 'Alpha Treasury Partners Sp. z o.o.',
    iban: 'PL82 1020 4900 0000 9482 1029 3847',
    bic: 'BPKOPLPW',
    bankName: provider === 'BCB Group' ? 'BCB Clear / ClearBank UK' : provider === 'Kingdom Bank' ? 'The Kingdom Bank' : 'PKO Bank Polski S.A.',
    reference: `CC-${Math.floor(10000 + Math.random() * 90000)}-${currency}`,
  };

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInstructions(true);

    const newTx: DepositTx = {
      id: Math.random().toString(36).substring(2, 14),
      provider,
      expectedSpend: `${parseFloat(spendAmount || '100').toLocaleString()} ${currency}`,
      currency,
      status: 'Pending',
      date: 'Just now',
    };
    setTransactions([newTx, ...transactions]);
  };

  const handleExportCSV = () => {
    const headers = ['Transaction id', 'Provider', 'Expected spend amount', 'Status', 'Date'];
    const rows = transactions.map((t) => [t.id, t.provider, t.expectedSpend, t.status, t.date]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coincashy_add_funds_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* ============ TWO-COLUMN SPLIT CONTAINER ============ */}
      <div
        className="add-funds-split-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 420px) 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ================================================================= */}
        {/* LEFT COLUMN: ADD FUNDS CARD (EXACT MATCH TO SCREENSHOT)           */}
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
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
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
                onClick={() => setShowCurrencyModal(true)}
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
                <CryptoLogo symbol={currency} size={22} />
                <span>{currency}</span>
                <svg style={{ width: 14, height: 14, color: 'var(--fg-dim)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTOR */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '6px' }}>
              Payment method
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--ground)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg className="ic" style={{ width: 16, height: 16, color: 'var(--fg-dim)' }}>
                  <use href="#i-landmark" />
                </svg>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--hi)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="SEPA Instant">SEPA Instant (&lt; 10s)</option>
                  <option value="SWIFT">SWIFT International</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROVIDER SELECTOR */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '6px' }}>
              Provider
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--ground)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                {/* Provider Logo Icon */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '6px',
                    background: provider === 'BCB Group' ? '#582CD3' : provider === 'Kingdom Bank' ? '#D97706' : '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {provider === 'BCB Group' ? '◆' : provider === 'Kingdom Bank' ? '♔' : '🏦'}
                </div>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--hi)',
                    fontSize: '0.88rem',
                    fontWeight: 650,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <option value="BCB Group">BCB Group</option>
                  <option value="Manual bank transfer">Manual bank transfer</option>
                  <option value="Kingdom Bank">Kingdom Bank</option>
                </select>
              </div>
            </div>
          </div>

          {/* FEE COLLAPSIBLE */}
          <div>
            <button
              type="button"
              onClick={() => setFeeOpen(!feeOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--fg-dim)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
              }}
            >
              <span>Fee</span>
              <svg
                style={{ width: 12, height: 12, transform: feeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {feeOpen && (
              <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#60A5FA', background: 'var(--surface-2)', padding: '6px 10px', borderRadius: '8px' }}>
                ✓ 0.00% Deposit Fee · Institutional Direct Settlement
              </div>
            )}
          </div>

          {/* DEPOSIT ACTION BUTTON */}
          <button
            type="button"
            onClick={handleDepositSubmit}
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
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Deposit
          </button>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: ADD FUNDS TRANSACTION HISTORY TABLE                 */}
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
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Transaction id</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-faint)' }}>▼</span>
                    </div>
                  </th>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Provider</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-faint)' }}>▼</span>
                    </div>
                  </th>
                  <th style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)' }}>Expected spend amount</th>
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
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--f-mono)', color: 'var(--hi)', fontSize: '0.82rem' }}>
                      {tx.id}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--fg-dim)', fontSize: '0.82rem' }}>
                      {tx.provider}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-mono)' }}>
                      {tx.expectedSpend}
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
      {/* INSTRUCTIONS MODAL (ONCE USER CLICKS DEPOSIT)                     */}
      {/* ================================================================= */}
      {showInstructions && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Wire Transfer Instructions"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowInstructions(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '20px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--hi)', margin: 0 }}>
                Wire Transfer Details ({provider})
              </h3>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                style={{ background: 'none', border: 'none', color: 'var(--fg-dim)', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#60A5FA', fontWeight: 700 }}>
                MANDATORY PAYMENT REFERENCE
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--f-mono)', color: 'var(--hi)' }}>
                  {bankDetails.reference}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('ref', bankDetails.reference)}
                  className="btn btn-solid btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {copiedField === 'ref' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem' }}>
              {[
                { label: 'Beneficiary Name', val: bankDetails.beneficiary, field: 'name' },
                { label: 'IBAN / Account Number', val: bankDetails.iban, field: 'iban' },
                { label: 'BIC / SWIFT', val: bankDetails.bic, field: 'bic' },
                { label: 'Bank Name', val: bankDetails.bankName, field: 'bank' },
              ].map((row) => (
                <div key={row.field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.6rem', borderBottom: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fg-dim)' }}>{row.label}</div>
                    <div style={{ fontWeight: 650, color: 'var(--hi)', fontFamily: row.field === 'iban' || row.field === 'bic' ? 'var(--f-mono)' : 'inherit' }}>
                      {row.val}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(row.field, row.val)}
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--hi)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    {copiedField === row.field ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="btn btn-solid"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '12px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* CURRENCY SELECT MODAL */}
      <CurrencySelectModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        onSelect={(item) => {
          setCurrency(item.symbol);
          setShowCurrencyModal(false);
        }}
        selectedCurrency={currency}
        allowedCategory="fiat"
        title="Select Deposit Currency"
      />

      <style jsx>{`
        @media (max-width: 900px) {
          .add-funds-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
