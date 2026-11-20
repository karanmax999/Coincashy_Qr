'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import CryptoLogo from '@/components/CryptoLogo';

export interface CurrencyItem {
  symbol: string;
  name: string;
  network: string;
  subtitle: string;
  category: 'crypto' | 'fiat';
  balance: string;
  rawBalance: number;
}

export const DEFAULT_CURRENCIES: CurrencyItem[] = [
  {
    symbol: 'AED',
    name: 'United Arab Emirates Dirham',
    network: 'LOCAL_CLEARING',
    subtitle: 'United Arab Emirates Dirham',
    category: 'fiat',
    balance: '0 AED',
    rawBalance: 0,
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    network: 'BINANCE_SMART_CHAIN',
    subtitle: 'Bnb on BINANCE_SMART_CHAIN',
    category: 'crypto',
    balance: '0 BNB',
    rawBalance: 0,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'BITCOIN',
    subtitle: 'Bitcoin on BITCOIN',
    category: 'crypto',
    balance: '1.0245 BTC',
    rawBalance: 1.0245,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ETHEREUM',
    subtitle: 'Ethereum on ETHEREUM',
    category: 'crypto',
    balance: '1.4500 ETH',
    rawBalance: 1.45,
  },
  {
    symbol: 'TRX',
    name: 'Tron',
    network: 'TRON',
    subtitle: 'Tron on TRON',
    category: 'crypto',
    balance: '0 TRX',
    rawBalance: 0,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    network: 'TRC-20 / ERC-20',
    subtitle: 'Tether on TRC-20',
    category: 'crypto',
    balance: '5,030.00 USDT',
    rawBalance: 5030.0,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    network: 'ERC-20',
    subtitle: 'USD Coin on ERC-20',
    category: 'crypto',
    balance: '2,500.00 USDC',
    rawBalance: 2500.0,
  },
  {
    symbol: 'EUR',
    name: 'Euro',
    network: 'SEPA_INSTANT',
    subtitle: 'Euro on SEPA INSTANT',
    category: 'fiat',
    balance: '42,100.00 EUR',
    rawBalance: 42100.0,
  },
  {
    symbol: 'USD',
    name: 'US Dollar',
    network: 'FEDWIRE / SWIFT',
    subtitle: 'US Dollar on FEDWIRE / SWIFT',
    category: 'fiat',
    balance: '0.00 USD',
    rawBalance: 0,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    network: 'SOLANA',
    subtitle: 'Solana on SOLANA',
    category: 'crypto',
    balance: '0 SOL',
    rawBalance: 0,
  },
  {
    symbol: 'PLN',
    name: 'Polish Zloty',
    network: 'ELIXIR',
    subtitle: 'Polish Zloty on ELIXIR',
    category: 'fiat',
    balance: '0.00 PLN',
    rawBalance: 0,
  },
];

export interface CurrencySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: CurrencyItem) => void;
  selectedCurrency?: string;
  currencies?: CurrencyItem[];
  allowedCategory?: 'all' | 'crypto' | 'fiat';
  title?: string;
  excludeSymbol?: string;
}

export default function CurrencySelectModal({
  isOpen,
  onClose,
  onSelect,
  selectedCurrency,
  currencies = DEFAULT_CURRENCIES,
  allowedCategory = 'all',
  title = 'Select Currency',
  excludeSymbol,
}: CurrencySelectModalProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'crypto' | 'fiat'>(allowedCategory);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync category if prop changes or on open
  useEffect(() => {
    if (isOpen) {
      setActiveCategory(allowedCategory);
      setSearch('');
      // Autofocus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, allowedCategory]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered list
  const filteredCurrencies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return currencies.filter((item) => {
      if (excludeSymbol && item.symbol.toUpperCase() === excludeSymbol.toUpperCase()) {
        return false;
      }
      if (allowedCategory !== 'all' && item.category !== allowedCategory) {
        return false;
      }
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (!q) return true;

      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.network.toLowerCase().includes(q)
      );
    });
  }, [currencies, search, activeCategory, allowedCategory, excludeSymbol]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(5, 7, 14, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--surface)',
          borderRadius: '20px',
          border: '1px solid var(--line-2)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
          animation: 'scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============ HEADER ============ */}
        <div
          style={{
            padding: '1.25rem 1.25rem 0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--hi)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: 'var(--fg-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.color = 'var(--hi)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--fg-dim)';
            }}
          >
            ✕
          </button>
        </div>

        {/* ============ SEARCH BAR ============ */}
        <div style={{ padding: '1rem 1.25rem 0.5rem 1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--ground)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.65rem 0.9rem',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          >
            <svg
              style={{ width: 18, height: 18, color: 'var(--fg-dim)', flexShrink: 0 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--hi)',
                fontSize: '0.92rem',
                fontFamily: 'inherit',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--fg-dim)',
                  cursor: 'pointer',
                  padding: 2,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ============ CATEGORY PILLS ============ */}
        {allowedCategory === 'all' && (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '0.4rem 1.25rem 0.75rem 1.25rem',
            }}
          >
            {(
              [
                { key: 'all', label: 'All currencies' },
                { key: 'crypto', label: 'Crypto currencies' },
                { key: 'fiat', label: 'Fiat currencies' },
              ] as const
            ).map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isActive ? '1px solid var(--line-2)' : '1px solid transparent',
                    background: isActive ? 'var(--surface-2)' : 'transparent',
                    color: isActive ? 'var(--hi)' : 'var(--fg-dim)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--hi)';
                      e.currentTarget.style.background = 'var(--ground)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--fg-dim)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ============ CURRENCIES LIST ============ */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 0.65rem 0.75rem 0.65rem',
            maxHeight: '380px',
          }}
        >
          {filteredCurrencies.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--fg-dim)',
                fontSize: '0.88rem',
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem', opacity: 0.6 }}>🔍</div>
              No currencies found matching &ldquo;{search}&rdquo;
            </div>
          ) : (
            filteredCurrencies.map((item) => {
              const isSelected = selectedCurrency?.toUpperCase() === item.symbol.toUpperCase();
              return (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid var(--primary, #3B82F6)' : '1px solid transparent',
                    background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s, border-color 0.12s',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'var(--surface-2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* Left: Logo & Names */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CryptoLogo symbol={item.symbol} size={36} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--hi)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{item.symbol}</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.76rem',
                          color: 'var(--fg-dim)',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Right: Balance */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--hi)',
                        fontFamily: 'var(--f-display)',
                        fontVariantNumeric: 'tabular-nums lining-nums',
                      }}
                    >
                      {item.balance}
                    </div>
                    {isSelected && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--primary, #3B82F6)', fontWeight: 600 }}>
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
