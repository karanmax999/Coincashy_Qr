'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CryptoLogo from '@/components/CryptoLogo';
import CurrencySelectModal, { DEFAULT_CURRENCIES } from '@/components/CurrencySelectModal';

// Base rates in EUR for RFQ calculation
const BASE_RATES_IN_EUR: Record<string, number> = {
  EUR: 1.0,
  USD: 0.9259,
  USDT: 0.9259,
  USDC: 0.9259,
  BTC: 78120.4,
  ETH: 2445.8,
  SOL: 158.4,
  BNB: 545.2,
  TRX: 0.152,
  AED: 0.252,
  PLN: 0.234,
};

// User holdings lookup for Available balance & MAX
const USER_BALANCES: Record<string, { balanceStr: string; raw: number }> = {
  EUR: { balanceStr: '42,100.00 EUR', raw: 42100.0 },
  BTC: { balanceStr: '1.0245 BTC', raw: 1.0245 },
  USDT: { balanceStr: '5,030.00 USDT', raw: 5030.0 },
  USDC: { balanceStr: '2,500.00 USDC', raw: 2500.0 },
  ETH: { balanceStr: '1.4500 ETH', raw: 1.45 },
  AED: { balanceStr: '0 AED', raw: 0 },
  BNB: { balanceStr: '0 BNB', raw: 0 },
  TRX: { balanceStr: '0 TRX', raw: 0 },
  USD: { balanceStr: '0.00 USD', raw: 0 },
  SOL: { balanceStr: '0 SOL', raw: 0 },
  PLN: { balanceStr: '0.00 PLN', raw: 0 },
};

export default function ConvertView() {
  const [fromAsset, setFromAsset] = useState<string>('BTC');
  const [toAsset, setToAsset] = useState<string>('USDT');
  const [fromAmount, setFromAmount] = useState('0.5');
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRotating, setIsRotating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalTarget, setModalTarget] = useState<'from' | 'to' | null>(null);

  // Dynamic institutional RFQ rate
  const rate = useMemo(() => {
    const fromBase = BASE_RATES_IN_EUR[fromAsset] || 1;
    const toBase = BASE_RATES_IN_EUR[toAsset] || 1;
    return fromBase / toBase;
  }, [fromAsset, toAsset]);

  const numFrom = parseFloat(fromAmount) || 0;
  const numTo = numFrom * rate;

  // Format calculated receive amount
  const calculatedTo = useMemo(() => {
    if (numTo <= 0 || isNaN(numTo)) return '0.00';
    if (toAsset === 'BTC') return numTo.toFixed(6);
    if (toAsset === 'ETH' || toAsset === 'SOL' || toAsset === 'BNB') return numTo.toFixed(5);
    if (toAsset === 'TRX') return numTo.toFixed(2);
    return numTo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [numTo, toAsset]);

  // Available balance for current fromAsset
  const availableInfo = USER_BALANCES[fromAsset] || {
    balanceStr: `0.00 ${fromAsset}`,
    raw: 0,
  };

  // 15-second guaranteed quote countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFlip = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const handleMax = () => {
    if (availableInfo.raw > 0) {
      setFromAmount(String(availableInfo.raw));
    }
  };

  const handleCurrencySelect = (symbol: string) => {
    if (modalTarget === 'from') {
      if (symbol === toAsset) {
        setToAsset(fromAsset);
      }
      setFromAsset(symbol);
    } else if (modalTarget === 'to') {
      if (symbol === fromAsset) {
        setFromAsset(toAsset);
      }
      setToAsset(symbol);
    }
    setModalTarget(null);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setShowSuccess(true);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ============ TITLE ============ */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--hi)' }}>Instant RFQ Conversion Desk</h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--fg-dim)', marginTop: '4px' }}>
          0% slippage institutional swaps executed at real-time institutional liquidity rates.
        </p>
      </div>

      {/* ============ SWAP CARD ============ */}
      <div
        style={{
          borderRadius: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          padding: 'clamp(1rem, 3vw, 2rem)',
          boxShadow: 'var(--shadow)',
          position: 'relative',
        }}
      >
        {/* Quote Lock Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
              color: 'var(--coin-usdt)',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--coin-usdt)',
                boxShadow: '0 0 8px var(--coin-usdt)',
              }}
            />
            <span>Guaranteed Quote Locked</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.76rem',
              color: 'var(--fg-dim)',
            }}
          >
            <span>Refreshes in:</span>
            <span
              style={{
                fontFamily: 'var(--f-display)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                color: 'var(--hi)',
                fontWeight: 600,
              }}
            >
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* FROM BOX */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            background: 'var(--ground)',
            border: '1px solid var(--line)',
            marginBottom: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: 'var(--fg-faint)',
              marginBottom: '0.5rem',
            }}
          >
            <span>YOU PAY</span>
            <span style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}>
              Available: {availableInfo.balanceStr}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                minWidth: '80px',
                background: 'none',
                border: 'none',
                color: 'var(--hi)',
                fontSize: 'clamp(1.35rem, 4.5vw, 1.75rem)',
                fontWeight: 650,
                fontFamily: 'var(--f-display)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                letterSpacing: '-0.02em',
                outline: 'none',
              }}
            />

            <button
              type="button"
              onClick={handleMax}
              style={{
                padding: '4px 9px',
                borderRadius: '6px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                fontSize: '0.72rem',
                color: 'var(--gold, #E2B866)',
                fontWeight: 650,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              MAX
            </button>

            {/* CURRENCY SELECTOR PILL BUTTON */}
            <button
              type="button"
              onClick={() => setModalTarget('from')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '6px 12px 6px 10px',
                cursor: 'pointer',
                color: 'var(--hi)',
                fontWeight: 650,
                fontSize: '0.92rem',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              aria-label={`Select source currency, currently ${fromAsset}`}
            >
              <CryptoLogo symbol={fromAsset} size={24} />
              <span>{fromAsset}</span>
              <svg
                style={{ width: 14, height: 14, color: 'var(--fg-dim)', marginLeft: '2px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* FLIP BUTTON */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '-14px 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            type="button"
            onClick={handleFlip}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1px solid var(--line-2)',
              color: 'var(--hi)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              transform: isRotating ? 'rotate(180deg)' : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            title="Invert Conversion Pair"
          >
            <svg className="ic" style={{ width: 16, height: 16 }}>
              <use href="#i-repeat" />
            </svg>
          </button>
        </div>

        {/* TO BOX */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            background: 'var(--ground)',
            border: '1px solid var(--line)',
            marginTop: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: 'var(--fg-faint)',
              marginBottom: '0.5rem',
            }}
          >
            <span>YOU RECEIVE (ESTIMATED)</span>
            <span>0% Slippage Guaranteed</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                flex: 1,
                minWidth: '80px',
                color: 'var(--hi)',
                fontSize: 'clamp(1.35rem, 4.5vw, 1.75rem)',
                fontWeight: 650,
                fontFamily: 'var(--f-display)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                letterSpacing: '-0.02em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {calculatedTo}
            </div>

            {/* CURRENCY SELECTOR PILL BUTTON */}
            <button
              type="button"
              onClick={() => setModalTarget('to')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '6px 12px 6px 10px',
                cursor: 'pointer',
                color: 'var(--hi)',
                fontWeight: 650,
                fontSize: '0.92rem',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              aria-label={`Select destination currency, currently ${toAsset}`}
            >
              <CryptoLogo symbol={toAsset} size={24} />
              <span>{toAsset}</span>
              <svg
                style={{ width: 14, height: 14, color: 'var(--fg-dim)', marginLeft: '2px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* SUMMARY DETAILS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.8rem',
            color: 'var(--fg-dim)',
            borderTop: '1px solid var(--line)',
            paddingTop: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Indicative Rate</span>
            <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--hi)', fontWeight: 600 }}>
              1 {fromAsset} ≈{' '}
              {rate < 0.001
                ? rate.toFixed(6)
                : rate.toLocaleString('en-US', { maximumFractionDigits: rate < 1 ? 5 : 4 })}{' '}
              {toAsset}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Execution Fee</span>
            <span style={{ color: 'var(--coin-usdt)', fontWeight: 600 }}>0.00% (Zero Slippage)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Settlement Destination</span>
            <span style={{ color: 'var(--hi)' }}>Instant Credit to Coincashy Custody</span>
          </div>
        </div>

        {/* EXECUTE BUTTON */}
        <button
          type="button"
          onClick={handleExecute}
          disabled={isExecuting || numFrom <= 0}
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
            cursor: isExecuting || numFrom <= 0 ? 'not-allowed' : 'pointer',
            opacity: isExecuting || numFrom <= 0 ? 0.6 : 1,
          }}
        >
          {isExecuting ? 'Locking Rate & Executing...' : `Convert ${fromAsset} to ${toAsset}`}
        </button>
      </div>

      {/* CURRENCY SELECT MODAL */}
      <CurrencySelectModal
        isOpen={modalTarget !== null}
        onClose={() => setModalTarget(null)}
        onSelect={(item) => handleCurrencySelect(item.symbol)}
        selectedCurrency={modalTarget === 'from' ? fromAsset : toAsset}
        title="Select Currency"
      />

      {/* SUCCESS MODAL */}
      {showSuccess && (
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
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: '24px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              padding: '2rem',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(0, 0, 255, 0.15)',
                color: 'var(--jade-text-d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <svg className="ic" style={{ width: 28, height: 28 }}>
                <use href="#i-check" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--hi)' }}>Conversion Completed</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--fg-dim)', marginTop: '6px', lineHeight: 1.5 }}>
              Successfully converted <strong>{fromAmount} {fromAsset}</strong> into{' '}
              <strong>
                {calculatedTo} {toAsset}
              </strong>{' '}
              at locked rate.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="btn btn-solid btn-sm"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
