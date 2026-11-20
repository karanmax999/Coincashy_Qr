'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Modular Views
import DashboardOverview from './modules/DashboardOverview';
import TransactionsView from './modules/TransactionsView';
import ConvertView from './modules/ConvertView';
import BuyCryptoView from './modules/BuyCryptoView';
import CryptoDepositView from './modules/CryptoDepositView';
import CryptoWithdrawView from './modules/CryptoWithdrawView';
import FiatDepositView from './modules/FiatDepositView';
import FiatWithdrawView from './modules/FiatWithdrawView';
import GuestDepositView from './modules/GuestDepositView';
import OrdersHistoryView from './modules/OrdersHistoryView';
import AddressBookView from './modules/AddressBookView';
import BankAccountsView from './modules/BankAccountsView';
import ProfileView from './modules/ProfileView';

export type DashboardTab = 
  | 'overview' 
  | 'transactions' 
  | 'convert' 
  | 'buy' 
  | 'crypto-deposit' 
  | 'crypto-withdraw' 
  | 'fiat-deposit' 
  | 'fiat-withdraw' 
  | 'guest-deposit' 
  | 'orders' 
  | 'wallets' 
  | 'bank-accounts' 
  | 'profile';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 12 operational menu items (Profile is accessed via the bottom user card)
  const menuItems = [
    { id: 'overview' as DashboardTab, label: 'Dashboard', icon: '#i-store' },
    { id: 'transactions' as DashboardTab, label: 'Transaction history', icon: '#i-receipt' },
    { id: 'convert' as DashboardTab, label: 'Convert', icon: '#i-repeat' },
    { id: 'buy' as DashboardTab, label: 'Buy Crypto', icon: '#i-credit-card' },
    { id: 'crypto-deposit' as DashboardTab, label: 'Crypto Deposit', icon: '#i-arrow-down-left' },
    { id: 'crypto-withdraw' as DashboardTab, label: 'Crypto Withdrawals', icon: '#i-arrow-up-right' },
    { id: 'fiat-deposit' as DashboardTab, label: 'Add Funds', icon: '#i-landmark' },
    { id: 'fiat-withdraw' as DashboardTab, label: 'Fiat Withdrawals', icon: '#i-banknote' },
    { id: 'guest-deposit' as DashboardTab, label: 'Guests Deposits', icon: '#i-users' },
    { id: 'orders' as DashboardTab, label: 'Conversions History', icon: '#i-chart-candlestick' },
    { id: 'wallets' as DashboardTab, label: 'Address Book', icon: '#i-wallet' },
    { id: 'bank-accounts' as DashboardTab, label: 'Bank Accounts', icon: '#i-landmark' },
  ];

  const handleToggleTheme = () => {
    if (typeof window !== 'undefined' && window.__toggleTheme) {
      window.__toggleTheme();
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'profile') return 'Corporate Profile & Treasury Command';
    const found = menuItems.find((m) => m.id === activeTab);
    return found ? found.label : 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ground)', color: 'var(--fg)', fontFamily: 'var(--f-body)' }}>
      
      {/* ============ SIDEBAR (DESKTOP) ============ */}
      <aside
        style={{
          width: '280px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div>
          {/* Logo & Portal Badge */}
          <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                  src="/media/logo-white.png"
                  alt="Coincashy"
                  width={125}
                  height={28}
                  style={{ height: '28px', width: 'auto' }}
                  className="logo-on-dark"
                  priority
                />
                <Image
                  src="/media/logo-black.png"
                  alt="Coincashy"
                  width={125}
                  height={28}
                  style={{ height: '28px', width: 'auto' }}
                  className="logo-on-paper"
                  priority
                />
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="mobile-only"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--jade-text-d)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span className="dot live" style={{ width: 6, height: 6 }} />
              <span>Trading &amp; Treasury Portal</span>
            </div>
          </div>

          {/* Navigation Links (12 Operational Modules) */}
          <nav style={{ padding: '0.75rem', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--hi)' : 'var(--fg-dim)',
                        background: isActive ? 'rgba(0, 0, 255, 0.08)' : 'transparent',
                        border: isActive ? '1px solid rgba(107, 107, 255, 0.3)' : '1px solid transparent',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <svg className="ic" style={{ width: 16, height: 16, color: isActive ? 'var(--jade-text-d)' : 'currentColor' }}>
                        <use href={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User Account / Profile Navigation Trigger (Clickable) */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--line)', background: 'var(--surface-2)' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setSidebarOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '12px',
              background: activeTab === 'profile' ? 'var(--surface)' : 'transparent',
              border: activeTab === 'profile' ? '1px solid var(--jade-text-d)' : '1px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              boxShadow: activeTab === 'profile' ? '0 2px 12px rgba(0, 0, 255, 0.25)' : 'none',
            }}
            title="Open Corporate Profile & Organization Command"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0000FF, #3B82F6)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  boxShadow: activeTab === 'profile' ? '0 0 0 2px var(--jade-text-d)' : 'none',
                }}
              >
                CC
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--hi)' }}>Corporate Desk</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--jade-text-d)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6' }} />
                  <span>Verified KYB Tier-2</span>
                </div>
              </div>
            </div>
            <svg
              className="ic"
              style={{
                width: 16,
                height: 16,
                color: activeTab === 'profile' ? 'var(--jade-text-d)' : 'var(--fg-faint)',
                transform: activeTab === 'profile' ? 'translateX(2px)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            >
              <use href="#i-chevron-right" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 35,
          }}
          className="mobile-only"
        />
      )}

      {/* ============ MAIN CONTENT AREA ============ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
        <header
          style={{
            height: '60px',
            borderBottom: '1px solid var(--line)',
            background: 'var(--surface)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(1rem, 2.5vw, 2rem)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* ============ DESKTOP HEADER (>= 1024px) ============ */}
          <div className="desktop-only" style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '1.25rem',
                  fontWeight: 650,
                  fontStyle: 'normal',
                  color: 'var(--hi)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {getHeaderTitle()}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Institutional Balance Strip (Matching Original Platform) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Crypto balance
                  </span>
                  <span style={{ fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    €84,200.00
                  </span>
                </div>

                <div style={{ width: '1px', height: '20px', background: 'var(--line)' }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Fiat balance
                  </span>
                  <span style={{ fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    €42,100.00
                  </span>
                </div>

                <div style={{ width: '1px', height: '20px', background: 'var(--line)' }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Portfolio value
                  </span>
                  <span style={{ fontWeight: 700, color: '#3B82F6', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    €126,300.00
                  </span>
                </div>
              </div>

              {/* Crypto Pay Action Button */}
              <button
                type="button"
                onClick={() => setActiveTab('convert')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: '#2563EB',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 650,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(37, 99, 235, 0.28)',
                  transition: 'opacity 0.15s',
                }}
              >
                Crypto Pay
              </button>

              {/* Theme Toggle Button */}
              <button
                className="theme-btn"
                type="button"
                data-theme-toggle
                aria-label="Switch to light mode"
                title="Switch theme"
                onClick={handleToggleTheme}
              >
                <svg className="ic ic-sun" aria-hidden="true"><use href="#i-sun" /></svg>
                <svg className="ic ic-moon" aria-hidden="true"><use href="#i-moon" /></svg>
              </button>
            </div>
          </div>

          {/* ============ MOBILE HEADER (< 1024px) ============ */}
          <div className="mobile-only" style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left: Coincashy Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/media/logo-white.png"
                alt="Coincashy"
                width={110}
                height={24}
                style={{ height: '24px', width: 'auto' }}
                className="logo-on-dark"
                priority
              />
              <Image
                src="/media/logo-black.png"
                alt="Coincashy"
                width={110}
                height={24}
                style={{ height: '24px', width: 'auto' }}
                className="logo-on-paper"
                priority
              />
            </Link>

            {/* Right: Theme Toggle & Modules Drawer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="theme-btn"
                type="button"
                data-theme-toggle
                aria-label="Switch theme"
                title="Switch theme"
                onClick={handleToggleTheme}
                style={{ width: 34, height: 34 }}
              >
                <svg className="ic ic-sun" aria-hidden="true"><use href="#i-sun" /></svg>
                <svg className="ic ic-moon" aria-hidden="true"><use href="#i-moon" /></svg>
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '8px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--fg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="All 12 Treasury Modules"
                aria-label="Toggle All Modules"
              >
                <svg className="ic" style={{ width: 16, height: 16 }}><use href="#i-layers" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main View Container */}
        <main className="dashboard-main-content" style={{ padding: 'clamp(0.85rem, 2.5vw, 2.5rem)', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          
          {/* Module 1: Dashboard Overview */}
          {activeTab === 'overview' && (
            <DashboardOverview onNavigate={(tab) => setActiveTab(tab as DashboardTab)} />
          )}

          {/* Module 2: Transaction History */}
          {activeTab === 'transactions' && (
            <TransactionsView />
          )}

          {/* Module 3: Convert (RFQ 0% Slippage) */}
          {activeTab === 'convert' && (
            <ConvertView />
          )}

          {/* Module 4: Buy Crypto (Onramp) */}
          {activeTab === 'buy' && (
            <BuyCryptoView />
          )}

          {/* Module 5: Crypto Deposit */}
          {activeTab === 'crypto-deposit' && (
            <CryptoDepositView />
          )}

          {/* Module 6: Crypto Withdrawals */}
          {activeTab === 'crypto-withdraw' && (
            <CryptoWithdrawView />
          )}

          {/* Module 7: Add Funds (vIBAN Fiat Deposit) */}
          {activeTab === 'fiat-deposit' && (
            <FiatDepositView />
          )}

          {/* Module 8: Fiat Withdrawals */}
          {activeTab === 'fiat-withdraw' && (
            <FiatWithdrawView />
          )}

          {/* Module 9: Guests Deposits */}
          {activeTab === 'guest-deposit' && (
            <GuestDepositView />
          )}

          {/* Module 10: Conversions History */}
          {activeTab === 'orders' && (
            <OrdersHistoryView />
          )}

          {/* Module 11: Address Book */}
          {activeTab === 'wallets' && (
            <AddressBookView />
          )}

          {/* Module 12: Bank Accounts */}
          {activeTab === 'bank-accounts' && (
            <BankAccountsView />
          )}

          {/* Module 13: Corporate Profile */}
          {activeTab === 'profile' && (
            <ProfileView />
          )}

        </main>
      </div>

      {/* ============ FIXED MOBILE BOTTOM NAVIGATION DOCK (ETHER.FI PATTERN) ============ */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`dock-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <svg className="ic"><use href="#i-store" /></svg>
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`dock-tab ${activeTab === 'transactions' ? 'active' : ''}`}
        >
          <svg className="ic"><use href="#i-receipt" /></svg>
          <span>Portfolio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('convert')}
          className={`dock-tab ${activeTab === 'convert' ? 'active' : ''}`}
        >
          <svg className="ic"><use href="#i-repeat" /></svg>
          <span>Swap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fiat-deposit')}
          className={`dock-tab ${activeTab === 'fiat-deposit' ? 'active' : ''}`}
        >
          <svg className="ic"><use href="#i-landmark" /></svg>
          <span>Cash</span>
        </button>
      </nav>

      <style jsx>{`
        .mobile-bottom-dock {
          display: none;
        }

        @media (max-width: 1023px) {
          .dashboard-sidebar {
            position: fixed !important;
            left: -300px;
            transition: left 0.3s ease;
          }
          .dashboard-sidebar.open {
            left: 0 !important;
          }

          .mobile-bottom-dock {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: var(--surface);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid var(--line);
            z-index: 50;
            align-items: center;
            justify-content: space-around;
            padding: 0 4px;
            padding-bottom: env(safe-area-inset-bottom, 0px);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          }

          .dock-tab {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            background: transparent;
            border: none;
            color: var(--fg-dim);
            font-size: 0.72rem;
            font-weight: 500;
            padding: 6px 0;
            cursor: pointer;
            transition: all 0.15s ease;
            text-decoration: none;
          }

          .dock-tab .ic {
            width: 20px;
            height: 20px;
            transition: transform 0.15s ease, color 0.15s ease;
          }

          .dock-tab.active {
            color: var(--hi);
            font-weight: 600;
          }

          .dock-tab.active .ic {
            color: #3B82F6;
            transform: translateY(-1px);
          }

          .dashboard-main-content {
            padding-bottom: 96px !important;
          }
        }
      `}</style>
    </div>
  );
}
