'use client';

import React, { useState } from 'react';

export default function FiatWithdrawView() {
  const [amount, setAmount] = useState('10000');
  const [selectedBank, setSelectedBank] = useState('mbank');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bankAccounts = [
    { id: 'mbank', name: 'mBank S.A. Corporate Primary', iban: 'PL89 1140 2004 0000 3821 9482 1029', curr: 'EUR' },
    { id: 'santander', name: 'Santander Bank Polska S.A.', iban: 'PL12 1090 2402 0000 9921 4820 1938', curr: 'EUR' },
  ];

  const numAmount = parseFloat(amount) || 0;
  const fee = 1.50;
  const netReceived = (numAmount - fee).toFixed(2);

  const handleWithdraw = () => {
    if (!twoFactorCode || twoFactorCode.length < 6) {
      alert('Please enter your 6-digit Authenticator code to authorize wire.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Outbound SEPA Instant wire of €${amount} dispatched. Funds will arrive within 10 seconds.`);
      setTwoFactorCode('');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ============ TITLE ============ */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--hi)' }}>Outbound SEPA Instant Wire Desk</h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--fg-dim)', marginTop: '4px' }}>
          Withdraw EUR directly from your dedicated virtual IBAN into your verified corporate bank account.
        </p>
      </div>

      {/* ============ WITHDRAWAL CARD ============ */}
      <div
        style={{
          borderRadius: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          padding: 'clamp(1rem, 3vw, 2rem)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* BENEFICIARY BANK ACCOUNT SELECTOR */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.5rem' }}>
            Select Destination Bank Account
          </label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
              color: 'var(--hi)',
              fontSize: '0.86rem',
              cursor: 'pointer',
            }}
          >
            {bankAccounts.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.curr}) - {b.iban}
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--ground)', border: '1px solid var(--line)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--fg-faint)', marginBottom: '0.5rem' }}>
            <span>WITHDRAWAL AMOUNT</span>
            <span>Available vIBAN: €42,100.00</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                flex: '1 1 140px',
                minWidth: '120px',
                background: 'none',
                border: 'none',
                color: 'var(--hi)',
                fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
                fontWeight: 600,
                fontFamily: 'var(--f-mono)',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {['25%', '50%', '100%'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    const factor = pct === '25%' ? 0.25 : pct === '50%' ? 0.5 : 1;
                    setAmount((42100 * factor).toFixed(2));
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    fontSize: '0.72rem',
                    color: 'var(--fg-dim)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {pct}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--hi)', flexShrink: 0 }}>EUR (€)</span>
          </div>
        </div>

        {/* 2FA AUTHORIZATION CODE */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.5rem' }}>
            Two-Factor Authenticator (TOTP) Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit code"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
              color: 'var(--hi)',
              fontSize: '1.1rem',
              letterSpacing: '0.2em',
              fontFamily: 'var(--f-mono)',
              textAlign: 'center',
            }}
          />
        </div>

        {/* SUMMARY DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--fg-dim)', borderTop: '1px solid var(--line)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Clearing Rail</span>
            <span style={{ color: 'var(--jade-text-d)', fontWeight: 600 }}>SEPA Instant (&lt; 10 seconds)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Fixed Banking Clearing Fee</span>
            <span style={{ color: 'var(--hi)', fontFamily: 'var(--f-mono)' }}>€1.50</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Net Credited to Beneficiary</span>
            <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--hi)', fontWeight: 700 }}>
              €{netReceived} EUR
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={isProcessing || numAmount <= 0}
          className="btn btn-solid"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 700,
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0000FF, #3B82F6)',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 255, 0.35)',
            border: 'none',
            borderRadius: '12px',
            cursor: isProcessing || numAmount <= 0 ? 'not-allowed' : 'pointer',
            opacity: isProcessing || numAmount <= 0 ? 0.6 : 1,
          }}
        >
          {isProcessing ? 'Dispatched to SEPA Instant...' : `Authorize Outbound Wire of €${amount}`}
        </button>

      </div>

    </div>
  );
}
