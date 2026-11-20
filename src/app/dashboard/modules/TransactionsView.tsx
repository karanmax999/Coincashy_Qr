'use client';

import React, { useState, useMemo } from 'react';
import CryptoLogo from '@/components/CryptoLogo';

export interface TransactionItem {
  id: string;
  createdAt: string;
  dateFormatted: string;
  type: 'Deposit' | 'Withdrawal' | 'Conversion' | 'Transfer' | 'Guest Wire';
  assetClass: 'Fiat' | 'Crypto';
  currency: 'EUR' | 'USD' | 'BTC' | 'ETH' | 'USDT' | 'USDC';
  amount: string;
  fee: string;
  netReceived: string;
  status: 'Completed' | 'Settled' | 'Pending' | 'Declined';
  counterparty: string;
  reference: string;
  network?: string;
  isPositive: boolean;
}

export default function TransactionsView() {
  // Dropdown filter states (Directly matching original website)
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterAssetClass, setFilterAssetClass] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Column visibility
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [visibleCols, setVisibleCols] = useState({
    createdAt: true,
    type: true,
    assetClass: true,
    amount: true,
    fee: true,
    netReceived: true,
    status: true,
    counterparty: true,
  });

  // Receipt Modal
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Realistic institutional transaction data (incorporating original website records)
  const allTransactions: TransactionItem[] = [
    {
      id: 'TX-9482101',
      createdAt: '10/24/2026, 02:22:15 PM',
      dateFormatted: 'Today, 14:22',
      type: 'Deposit',
      assetClass: 'Fiat',
      currency: 'EUR',
      amount: '16,820.00 EUR',
      fee: '0.00 EUR',
      netReceived: '16,820.00 EUR',
      status: 'Settled',
      counterparty: 'mBank S.A. (Warsaw)',
      reference: 'SEPA-PL-849201948',
      network: 'SEPA Instant',
      isPositive: true,
    },
    {
      id: 'TX-9482102',
      createdAt: '10/23/2026, 09:41:20 AM',
      dateFormatted: 'Yesterday, 09:41',
      type: 'Conversion',
      assetClass: 'Crypto',
      currency: 'BTC',
      amount: '0.2500 BTC',
      fee: '0.00 USDT',
      netReceived: '21,074.42 USDT',
      status: 'Completed',
      counterparty: 'Coincashy RFQ Desk',
      reference: 'RFQ-CC-84297',
      isPositive: true,
    },
    {
      id: 'TX-9482103',
      createdAt: '10/21/2026, 06:05:44 PM',
      dateFormatted: '21 Oct, 18:05',
      type: 'Withdrawal',
      assetClass: 'Crypto',
      currency: 'USDT',
      amount: '5,000.00 USDT',
      fee: '3.50 USDT',
      netReceived: '4,996.50 USDT',
      status: 'Settled',
      counterparty: 'Whitelisted Vault (BitGo 0x8a...3f)',
      reference: '0x9482...a8fe10b',
      network: 'ERC-20',
      isPositive: false,
    },
    {
      id: 'TX-9482104',
      createdAt: '10/20/2026, 11:15:02 AM',
      dateFormatted: '20 Oct, 11:15',
      type: 'Withdrawal',
      assetClass: 'Fiat',
      currency: 'EUR',
      amount: '25,000.00 EUR',
      fee: '1.50 EUR',
      netReceived: '24,998.50 EUR',
      status: 'Settled',
      counterparty: 'Santander Corporate IBAN (...3847)',
      reference: 'SEPA-OUT-994820',
      network: 'SEPA Instant',
      isPositive: false,
    },
    {
      id: 'TX-9482105',
      createdAt: '10/19/2026, 04:30:18 PM',
      dateFormatted: '19 Oct, 16:30',
      type: 'Deposit',
      assetClass: 'Crypto',
      currency: 'BTC',
      amount: '0.5000 BTC',
      fee: '0.0001 BTC',
      netReceived: '0.4999 BTC',
      status: 'Settled',
      counterparty: 'Whitelisted External Desk',
      reference: 'b948a7...31cc90',
      network: 'Bitcoin Native',
      isPositive: true,
    },
    {
      id: 'TX-9482106',
      createdAt: '10/18/2026, 10:02:51 AM',
      dateFormatted: '18 Oct, 10:02',
      type: 'Guest Wire',
      assetClass: 'Fiat',
      currency: 'EUR',
      amount: '50,000.00 EUR',
      fee: '12.00 EUR',
      netReceived: '49,988.00 EUR',
      status: 'Settled',
      counterparty: 'LGT Bank Liechtenstein',
      reference: 'SWIFT-IN-492019',
      network: 'SWIFT',
      isPositive: true,
    },
    {
      id: 'TX-9482107',
      createdAt: '10/16/2026, 11:21:24 PM',
      dateFormatted: '16 Oct, 23:21',
      type: 'Deposit',
      assetClass: 'Fiat',
      currency: 'EUR',
      amount: '10,000.00 EUR',
      fee: '0.00 EUR',
      netReceived: '10,000.00 EUR',
      status: 'Declined',
      counterparty: 'Unverified Entity Rail',
      reference: 'REJ-AML-38102',
      isPositive: false,
    },
    {
      id: 'TX-9482108',
      createdAt: '09/27/2026, 12:18:35 PM',
      dateFormatted: '27 Sep, 12:18',
      type: 'Conversion',
      assetClass: 'Fiat',
      currency: 'ETH',
      amount: '0.0100 ETH',
      fee: '0.80 USD',
      netReceived: '39.38 USD',
      status: 'Completed',
      counterparty: 'Coincashy RFQ Desk',
      reference: 'RFQ-CC-73918',
      isPositive: true,
    },
    {
      id: 'TX-9482109',
      createdAt: '09/27/2026, 12:15:56 PM',
      dateFormatted: '27 Sep, 12:15',
      type: 'Conversion',
      assetClass: 'Fiat',
      currency: 'USD',
      amount: '200.00 USD',
      fee: '4.00 USD',
      netReceived: '0.04876163 ETH',
      status: 'Completed',
      counterparty: 'Coincashy RFQ Desk',
      reference: 'RFQ-CC-73912',
      isPositive: true,
    },
    {
      id: 'TX-9482110',
      createdAt: '09/02/2026, 11:09:29 PM',
      dateFormatted: '02 Sep, 23:09',
      type: 'Transfer',
      assetClass: 'Crypto',
      currency: 'USDC',
      amount: '50.00 USDC',
      fee: '0.00 USDC',
      netReceived: '50.00 USDC',
      status: 'Pending',
      counterparty: 'Treasury Sub-Account 02',
      reference: 'INT-XFER-2849',
      network: 'Internal Ledger',
      isPositive: false,
    },
    {
      id: 'TX-9482111',
      createdAt: '09/02/2026, 11:03:52 PM',
      dateFormatted: '02 Sep, 23:03',
      type: 'Conversion',
      assetClass: 'Crypto',
      currency: 'USD',
      amount: '100.00 USD',
      fee: '2.00 USD',
      netReceived: '97.979 USDC',
      status: 'Completed',
      counterparty: 'Coincashy RFQ Desk',
      reference: 'RFQ-CC-71029',
      isPositive: true,
    },
    {
      id: 'TX-9482112',
      createdAt: '09/02/2026, 11:02:35 PM',
      dateFormatted: '02 Sep, 23:02',
      type: 'Deposit',
      assetClass: 'Fiat',
      currency: 'USD',
      amount: '1,000.00 USD',
      fee: '0.00 USD',
      netReceived: '1,000.00 USD',
      status: 'Completed',
      counterparty: 'JP Morgan Chase Wire',
      reference: 'FEDWIRE-849102',
      isPositive: true,
    },
  ];

  // Filtered & Sorted list
  const filtered = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (filterType !== 'ALL' && tx.type !== filterType) return false;
      if (filterAssetClass !== 'ALL' && tx.assetClass !== filterAssetClass) return false;
      if (filterStatus !== 'ALL' && tx.status !== filterStatus) return false;
      if (filterCurrency !== 'ALL' && tx.currency !== filterCurrency) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          tx.id.toLowerCase().includes(q) ||
          tx.type.toLowerCase().includes(q) ||
          tx.currency.toLowerCase().includes(q) ||
          tx.amount.toLowerCase().includes(q) ||
          tx.counterparty.toLowerCase().includes(q) ||
          tx.reference.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [allTransactions, filterType, filterAssetClass, filterStatus, filterCurrency, searchQuery, sortOrder]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Export CSV Handler
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Transaction ID', 'Created At', 'Type', 'Asset Class', 'Currency', 'Amount', 'Fee', 'Net Received', 'Status', 'Counterparty', 'Reference'];
      const rows = filtered.map((t) => [
        t.id,
        `"${t.createdAt}"`,
        t.type,
        t.assetClass,
        t.currency,
        `"${t.amount}"`,
        `"${t.fee}"`,
        `"${t.netReceived}"`,
        t.status,
        `"${t.counterparty}"`,
        `"${t.reference}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `coincashy_statement_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  // Export PDF Handler (Simulation)
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 500);
  };

  // Render Status Badge
  const renderStatusBadge = (status: TransactionItem['status']) => {
    if (status === 'Completed' || status === 'Settled') {
      return (
        <span
          style={{
            padding: '3px 9px',
            borderRadius: '999px',
            background: 'rgba(38, 161, 123, 0.12)',
            color: 'var(--jade-text-d)',
            border: '1px solid rgba(38, 161, 123, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
          {status}
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span
          style={{
            padding: '3px 9px',
            borderRadius: '999px',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#F59E0B',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F59E0B' }} />
          Pending
        </span>
      );
    }
    return (
      <span
        style={{
          padding: '3px 9px',
          borderRadius: '999px',
          background: 'rgba(235, 87, 87, 0.12)',
          color: 'var(--coral)',
          border: '1px solid rgba(235, 87, 87, 0.25)',
          fontSize: '0.72rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--coral)' }} />
        Declined
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ============ HEADER & CONTROLS ============ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 650, color: 'var(--hi)', margin: 0 }}>Transaction History</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', marginTop: '3px', margin: 0 }}>
            Auditable records of all SEPA Instant wires, OTC RFQ swaps, and MPC crypto transfers.
          </p>
        </div>

        {/* Action Buttons: Columns, Export CSV, Export PDF (Directly matching original site) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Columns Toggle Button */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="btn btn-line btn-sm"
              style={{
                borderRadius: '8px',
                fontSize: '0.78rem',
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: showColumnMenu ? 'var(--surface-2)' : 'var(--surface)',
              }}
              title="Configure visible table columns"
            >
              <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-layers" /></svg>
              <span>Columns</span>
              <svg className="ic" style={{ width: 12, height: 12 }}><use href="#i-chevron-down" /></svg>
            </button>

            {/* Columns Dropdown Panel */}
            {showColumnMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '200px',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  boxShadow: 'var(--shadow)',
                  zIndex: 40,
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Toggle Columns
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'createdAt', label: 'Created At' },
                    { key: 'type', label: 'Type' },
                    { key: 'assetClass', label: 'Asset Class' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'fee', label: 'Fee' },
                    { key: 'netReceived', label: 'Net / Received' },
                    { key: 'status', label: 'Status' },
                    { key: 'counterparty', label: 'Counterparty' },
                  ].map((col) => (
                    <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--fg)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={visibleCols[col.key as keyof typeof visibleCols]}
                        onChange={(e) =>
                          setVisibleCols({
                            ...visibleCols,
                            [col.key]: e.target.checked,
                          })
                        }
                        style={{ accentColor: '#3B82F6' }}
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="btn btn-solid btn-sm"
            style={{
              borderRadius: '8px',
              fontSize: '0.78rem',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0000FF',
            }}
            title="Download CSV export"
          >
            <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-download" /></svg>
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn btn-line btn-sm"
            style={{
              borderRadius: '8px',
              fontSize: '0.78rem',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Print or export statement as PDF"
          >
            <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-file-text" /></svg>
            <span>Export PDF</span>
          </button>

        </div>
      </div>

      {/* ============ 4-DROPDOWN FILTER BAR (MATCHING ORIGINAL WEBSITE) ============ */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderRadius: '16px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Dropdown 1: Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '1 1 140px', minWidth: '120px' }}>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', fontWeight: 600 }}>
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--hi)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
            }}
          >
            <option value="ALL">All Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Conversion">Conversion</option>
            <option value="Transfer">Transfer</option>
            <option value="Guest Wire">Guest Wire</option>
          </select>
        </div>

        {/* Dropdown 2: Asset Class */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '1 1 130px', minWidth: '110px' }}>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', fontWeight: 600 }}>
            Asset Class
          </label>
          <select
            value={filterAssetClass}
            onChange={(e) => {
              setFilterAssetClass(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--hi)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
            }}
          >
            <option value="ALL">All Classes</option>
            <option value="Fiat">Fiat</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>

        {/* Dropdown 3: Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '1 1 130px', minWidth: '110px' }}>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', fontWeight: 600 }}>
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--hi)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Settled">Settled</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        {/* Dropdown 4: Currency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '1 1 130px', minWidth: '110px' }}>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', fontWeight: 600 }}>
            Currency
          </label>
          <select
            value={filterCurrency}
            onChange={(e) => {
              setFilterCurrency(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--hi)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
            }}
          >
            <option value="ALL">All Currencies</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="BTC">BTC (₿)</option>
            <option value="ETH">ETH (Ξ)</option>
            <option value="USDT">USDT (₮)</option>
            <option value="USDC">USDC ($)</option>
          </select>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '2 1 220px', minWidth: '180px' }}>
          <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', fontWeight: 600 }}>
            Search Ledger
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by reference, counterparty..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 30px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--surface-2)',
                color: 'var(--fg)',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
            <svg className="ic" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--fg-faint)' }}>
              <use href="#i-search" />
            </svg>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filterType !== 'ALL' || filterAssetClass !== 'ALL' || filterStatus !== 'ALL' || filterCurrency !== 'ALL' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setFilterType('ALL');
              setFilterAssetClass('ALL');
              setFilterStatus('ALL');
              setFilterCurrency('ALL');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              background: 'transparent',
              color: 'var(--fg-dim)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              alignSelf: 'flex-end',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* ============ DATA TABLE (INSTITUTIONAL HIGH-CONTRAST NEUTRAL AMOUNTS) ============ */}
      <div
        style={{
          borderRadius: '20px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Desktop View Table */}
        <div className="tx-desktop-table-container" style={{ overflowX: 'auto', width: '100%' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.82rem',
              textAlign: 'left',
              minWidth: '940px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--line)',
                  color: 'var(--fg-faint)',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-2)',
                  fontWeight: 600,
                }}
              >
                {/* Eye icon column */}
                <th style={{ width: '42px', padding: '0.85rem 0.6rem 0.85rem 1rem', textAlign: 'center' }}>
                  <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-eye" /></svg>
                </th>

                {/* Created at */}
                {visibleCols.createdAt && (
                  <th
                    style={{ padding: '0.85rem 0.85rem', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    title="Toggle Sort Order"
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>Created at</span>
                      <svg className="ic" style={{ width: 12, height: 12 }}>
                        <use href={sortOrder === 'desc' ? '#i-chevron-down' : '#i-chevron-up'} />
                      </svg>
                    </div>
                  </th>
                )}

                {/* Type */}
                {visibleCols.type && <th style={{ padding: '0.85rem 0.85rem' }}>Type</th>}

                {/* Asset Class */}
                {visibleCols.assetClass && <th style={{ padding: '0.85rem 0.85rem' }}>Asset Class</th>}

                {/* Amount (HIGH-CONTRAST NEUTRAL TEXT, NOT HARSH COLORS) */}
                {visibleCols.amount && <th style={{ padding: '0.85rem 0.85rem' }}>Amount</th>}

                {/* Fee */}
                {visibleCols.fee && <th style={{ padding: '0.85rem 0.85rem' }}>Fee</th>}

                {/* Net / received */}
                {visibleCols.netReceived && <th style={{ padding: '0.85rem 0.85rem' }}>Net / Received</th>}

                {/* Status */}
                {visibleCols.status && <th style={{ padding: '0.85rem 0.85rem' }}>Status</th>}

                {/* Counterparty / Ref */}
                {visibleCols.counterparty && <th style={{ padding: '0.85rem 1rem' }}>Counterparty / Ref</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--fg-dim)' }}>
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    className="hover:bg-[var(--surface-2)]"
                  >
                    {/* View Eye Action */}
                    <td style={{ padding: '0.9rem 0.6rem 0.9rem 1rem', textAlign: 'center', color: 'var(--fg-dim)' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--fg-dim)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="View certified receipt"
                      >
                        <svg className="ic hover:text-[var(--hi)]" style={{ width: 15, height: 15 }}>
                          <use href="#i-eye" />
                        </svg>
                      </button>
                    </td>

                    {/* Created at */}
                    {visibleCols.createdAt && (
                      <td style={{ padding: '0.9rem 0.85rem', color: 'var(--fg-dim)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {tx.createdAt}
                      </td>
                    )}

                    {/* Type */}
                    {visibleCols.type && (
                      <td style={{ padding: '0.9rem 0.85rem', fontWeight: 600, color: 'var(--hi)' }}>
                        {tx.type}
                      </td>
                    )}

                    {/* Asset Class */}
                    {visibleCols.assetClass && (
                      <td style={{ padding: '0.9rem 0.85rem', color: 'var(--fg-dim)' }}>
                        <span
                          style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: 'var(--surface-2)',
                            border: '1px solid var(--line)',
                            fontSize: '0.72rem',
                            fontWeight: 500,
                          }}
                        >
                          {tx.assetClass}
                        </span>
                      </td>
                    )}

                    {/* Amount: ZERO AGGRESSIVE COLOR - CLEAN HIGH-CONTRAST INSTITUTIONAL NEUTRAL TEXT */}
                    {visibleCols.amount && (
                      <td style={{ padding: '0.9rem 0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CryptoLogo symbol={tx.currency} size={22} />
                          <span
                            style={{
                              fontWeight: 650,
                              color: 'var(--hi)',
                              fontFamily: 'var(--f-display)',
                              fontVariantNumeric: 'tabular-nums lining-nums',
                              letterSpacing: '-0.015em',
                              fontSize: '0.86rem',
                            }}
                          >
                            {tx.amount}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Fee: Neutral Subtle Font */}
                    {visibleCols.fee && (
                      <td style={{ padding: '0.9rem 0.85rem', color: 'var(--fg-dim)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {tx.fee}
                      </td>
                    )}

                    {/* Net / received: Neutral Bold Font */}
                    {visibleCols.netReceived && (
                      <td style={{ padding: '0.9rem 0.85rem', fontWeight: 600, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {tx.netReceived}
                      </td>
                    )}

                    {/* Status Pill */}
                    {visibleCols.status && (
                      <td style={{ padding: '0.9rem 0.85rem' }}>
                        {renderStatusBadge(tx.status)}
                      </td>
                    )}

                    {/* Counterparty / Ref */}
                    {visibleCols.counterparty && (
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--fg-dim)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div>{tx.counterparty}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--fg-faint)', marginTop: '2px' }}>{tx.reference}</div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Touch-Friendly Clean Cards (< 768px) */}
        <div className="tx-mobile-cards-container" style={{ display: 'none', flexDirection: 'column', gap: '0.65rem', padding: '0.85rem' }}>
          {paginatedTransactions.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--fg-dim)', fontSize: '0.84rem' }}>
              No transactions match the selected filters.
            </div>
          ) : (
            paginatedTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  background: 'var(--ground)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <CryptoLogo symbol={tx.currency} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 650, color: 'var(--hi)' }}>{tx.type}</span>
                      <span style={{ fontSize: '0.66rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg-dim)' }}>
                        {tx.assetClass}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fg-dim)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.counterparty}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {/* Clean neutral amount */}
                  <div style={{ fontSize: '0.92rem', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    {tx.amount}
                  </div>
                  <div style={{ marginTop: '3px' }}>
                    {renderStatusBadge(tx.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ============ PAGINATION CONTROLS (DIRECTLY MATCHING ORIGINAL WEBSITE) ============ */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--line)',
            background: 'var(--surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'var(--fg-dim)',
          }}
        >
          {/* Left: Pagination Jumpers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* First Page */}
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: currentPage === 1 ? 'var(--fg-faint)' : 'var(--fg)',
                cursor: currentPage === 1 ? 'default' : 'pointer',
              }}
              title="First Page"
            >
              |‹
            </button>

            {/* Prev Page */}
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: currentPage === 1 ? 'var(--fg-faint)' : 'var(--fg)',
                cursor: currentPage === 1 ? 'default' : 'pointer',
              }}
              title="Previous Page"
            >
              ‹
            </button>

            {/* Current Page Indicator */}
            <span style={{ margin: '0 4px', color: 'var(--hi)' }}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            {/* Next Page */}
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: currentPage === totalPages ? 'var(--fg-faint)' : 'var(--fg)',
                cursor: currentPage === totalPages ? 'default' : 'pointer',
              }}
              title="Next Page"
            >
              ›
            </button>

            {/* Last Page */}
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: currentPage === totalPages ? 'var(--fg-faint)' : 'var(--fg)',
                cursor: currentPage === totalPages ? 'default' : 'pointer',
              }}
              title="Last Page"
            >
              ›|
            </button>
          </div>

          {/* Right: Results Per Page & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Results per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  color: 'var(--hi)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div>
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
            </div>
          </div>
        </div>

      </div>

      {/* ============ RECEIPT MODAL (CERTIFIED PROOF OF EXECUTION) ============ */}
      {selectedTx && (
        <div
          className="receipt-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="receipt-modal-container"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '24px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              boxShadow: 'var(--shadow)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CryptoLogo symbol={selectedTx.currency} size={36} />
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#3B82F6', fontWeight: 600, letterSpacing: '0.08em' }}>
                    CERTIFIED SETTLEMENT RECEIPT
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 650, color: 'var(--hi)', marginTop: '2px', margin: 0 }}>
                    {selectedTx.type} · {selectedTx.currency}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.84rem' }}>
              
              {/* Neutral High-Contrast Primary Figure */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: '12px', background: 'var(--ground)', border: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)', fontWeight: 500 }}>Settled Principal</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: 'var(--hi)',
                    fontSize: '1.15rem',
                    fontFamily: 'var(--f-display)',
                    fontVariantNumeric: 'tabular-nums lining-nums',
                  }}
                >
                  {selectedTx.amount}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Status</span>
                <div>{renderStatusBadge(selectedTx.status)}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Transaction ID</span>
                <span style={{ color: 'var(--hi)', fontWeight: 600 }}>{selectedTx.id}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Audit Reference / Hash</span>
                <span style={{ color: 'var(--hi)', wordBreak: 'break-all' }}>{selectedTx.reference}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Counterparty Entity</span>
                <span style={{ color: 'var(--hi)', fontWeight: 500 }}>{selectedTx.counterparty}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Processing &amp; Gas Fee</span>
                <span style={{ color: 'var(--hi)', fontVariantNumeric: 'tabular-nums lining-nums' }}>{selectedTx.fee}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Net Received</span>
                <span style={{ color: 'var(--hi)', fontWeight: 600, fontVariantNumeric: 'tabular-nums lining-nums' }}>{selectedTx.netReceived}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span style={{ color: 'var(--fg-dim)' }}>Timestamp</span>
                <span style={{ color: 'var(--hi)' }}>{selectedTx.createdAt}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="btn btn-solid btn-sm"
                style={{ flex: 1, justifyContent: 'center', background: '#0000FF' }}
              >
                Download PDF Statement
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="btn btn-line btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .tx-desktop-table-container {
            display: none !important;
          }
          .tx-mobile-cards-container {
            display: flex !important;
          }
          :global(.receipt-modal-overlay) {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          :global(.receipt-modal-container) {
            border-radius: 24px 24px 0 0 !important;
            max-height: 85vh !important;
          }
        }
      `}</style>
    </div>
  );
}
