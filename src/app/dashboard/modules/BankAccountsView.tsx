'use client';

import React, { useState } from 'react';

interface BankAccount {
  id: string;
  label: string;
  bankName: string;
  holder: string;
  holderType: 'Individual' | 'Business';
  ownership: 'First party' | 'Third party';
  iban: string;
  bic: string;
  currency: string;
  paymentMethod: string;
  status: 'Verified' | 'Pending Review';
  isDefault: boolean;
  country: string;
}

export default function BankAccountsView() {
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 'BANK-1',
      label: 'Primary Operations Account',
      bankName: 'mBank S.A.',
      holder: 'Alpha Treasury Partners Sp. z o.o.',
      holderType: 'Business',
      ownership: 'First party',
      iban: 'PL89 1140 2004 0000 3821 9482 1029',
      bic: 'BREXPLPW',
      currency: 'EUR',
      paymentMethod: 'SEPA Instant',
      status: 'Verified',
      isDefault: true,
      country: 'Poland',
    },
    {
      id: 'BANK-2',
      label: 'Secondary EUR Treasury',
      bankName: 'Santander Bank Polska S.A.',
      holder: 'Alpha Treasury Partners Sp. z o.o.',
      holderType: 'Business',
      ownership: 'First party',
      iban: 'PL12 1090 2402 0000 9921 4820 1938',
      bic: 'WBKAPLPW',
      currency: 'EUR',
      paymentMethod: 'SEPA Instant',
      status: 'Verified',
      isDefault: false,
      country: 'Poland',
    },
    {
      id: 'BANK-3',
      label: 'Local Polish Tax & Payroll',
      bankName: 'PKO Bank Polski (Corporate PLN)',
      holder: 'Alpha Treasury Partners Sp. z o.o.',
      holderType: 'Business',
      ownership: 'First party',
      iban: 'PL50 1020 1013 0000 4820 9182 3019',
      bic: 'BPKOPLPW',
      currency: 'PLN',
      paymentMethod: 'Express Elixir',
      status: 'Verified',
      isDefault: false,
      country: 'Poland',
    },
  ]);

  // Form State matching the exact reference
  const [accountLabel, setAccountLabel] = useState('');
  const [ownership, setOwnership] = useState<'First party (me / my company)' | 'Third party'>(
    'First party (me / my company)'
  );
  const [currency, setCurrency] = useState('USD');

  // Account Holder Information
  const [holderType, setHolderType] = useState<'Individual' | 'Business'>('Individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [dob, setDob] = useState('');
  const [idDocType, setIdDocType] = useState('Passport');
  const [idDocNumber, setIdDocNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [stateProvince, setStateProvince] = useState('');

  // Bank Information
  const [bankName, setBankName] = useState('');
  const [bankStreetAddress, setBankStreetAddress] = useState('');
  const [bankCity, setBankCity] = useState('');
  const [bankStateProvince, setBankStateProvince] = useState('');
  const [bankZipCode, setBankZipCode] = useState('');
  const [bankCountry, setBankCountry] = useState('United States');

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('ACH');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingBic, setRoutingBic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Fill with my details (Verified KYC profile auto-fill)
  const handleFillMyDetails = () => {
    if (holderType === 'Individual') {
      setFirstName('John');
      setLastName('Doe');
      setDob('1988-04-18');
      setIdDocType('Passport');
      setIdDocNumber('X1234567');
      setStreetAddress('ul. Prosta 32 / 14');
      setCity('Warsaw');
      setZipCode('00-838');
      setCountry('Poland');
      setStateProvince('Mazowieckie');
    } else {
      setCompanyName('Alpha Treasury Partners Sp. z o.o.');
      setStreetAddress('ul. Prosta 32 / 14');
      setCity('Warsaw');
      setZipCode('00-838');
      setCountry('Poland');
      setStateProvince('Mazowieckie');
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newAcc: BankAccount = {
        id: `BANK-${accounts.length + 1}`,
        label: accountLabel || `${bankName} (${currency})`,
        bankName,
        holder:
          holderType === 'Individual'
            ? `${firstName || 'John'} ${lastName || 'Doe'}`.trim()
            : companyName || 'Alpha Treasury Partners Sp. z o.o.',
        holderType,
        ownership: ownership.includes('First party') ? 'First party' : 'Third party',
        iban: accountNumber,
        bic: routingBic || 'FEDWIRE',
        currency,
        paymentMethod,
        status: 'Pending Review',
        isDefault: accounts.length === 0,
        country: bankCountry,
      };

      setAccounts([newAcc, ...accounts]);
      setIsSubmitting(false);
      setViewMode('list');
      setSuccessBanner(`Bank account "${newAcc.label}" has been submitted for instant verification.`);
      setTimeout(() => setSuccessBanner(null), 5000);

      // Reset Form
      setAccountLabel('');
      setBankName('');
      setAccountNumber('');
      setRoutingBic('');
      setFirstName('');
      setLastName('');
      setCompanyName('');
    }, 800);
  };

  // =========================================================================
  // RENDER: SET UP YOUR BANK ACCOUNT VIEW
  // =========================================================================
  if (viewMode === 'add') {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Back Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--primary, #3B82F6)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Bank Accounts</span>
          </button>
        </div>

        {/* Page Title & Subtitle */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hi)', margin: 0, letterSpacing: '-0.02em' }}>
            Set Up Your Bank Account
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dim)', marginTop: '4px', lineHeight: 1.45 }}>
            To withdraw funds, please enter your bank account details. You can save multiple accounts for future use.
          </p>
        </div>

        {/* Full Form Card */}
        <form
          onSubmit={handleAddAccount}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '20px',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* ============ SECTION 1: ACCOUNT BASICS ============ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--hi)', display: 'block', marginBottom: '6px' }}>
                Account Label
              </label>
              <input
                type="text"
                value={accountLabel}
                onChange={(e) => setAccountLabel(e.target.value)}
                placeholder="e.g., My Primary Account, Business Account"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  background: 'var(--ground)',
                  color: 'var(--hi)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--hi)', display: 'block', marginBottom: '6px' }}>
                This account belongs to
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'First party (me / my company)' as const, label: 'First party (me / my company)' },
                  { id: 'Third party' as const, label: 'Third party' },
                ].map((item) => {
                  const isSelected = ownership === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setOwnership(item.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isSelected ? '1px solid #3B82F6' : '1px solid var(--line)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--ground)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #3B82F6' : '2px solid var(--fg-faint)',
                          background: '#fff',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 600 : 500, color: isSelected ? 'var(--hi)' : 'var(--fg-dim)' }}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--hi)', display: 'block', marginBottom: '6px' }}>
                Currency
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={currency}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCurrency(c);
                    if (c === 'USD') setPaymentMethod('ACH');
                    else if (c === 'EUR') setPaymentMethod('SEPA Instant');
                    else if (c === 'PLN') setPaymentMethod('ELIXIR');
                    else setPaymentMethod('SWIFT');
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                    background: 'var(--ground)',
                    color: 'var(--hi)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="USD">USD - United States Dollar</option>
                  <option value="EUR">EUR - Euro (SEPA)</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="PLN">PLN - Polish Zloty</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--line)' }} />

          {/* ============ SECTION 2: ACCOUNT HOLDER INFORMATION ============ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--hi)', margin: 0 }}>
                Account Holder Information
              </h3>
              <button
                type="button"
                onClick={handleFillMyDetails}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--primary, #3B82F6)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <span>⚡ Fill with my details</span>
              </button>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg-dim)', display: 'block', marginBottom: '6px' }}>
                Account holder type
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['Individual', 'Business'] as const).map((type) => {
                  const isSel = holderType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setHolderType(type)}
                      style={{
                        padding: '7px 18px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: isSel ? 600 : 500,
                        border: isSel ? '1px solid #3B82F6' : '1px solid var(--line)',
                        background: isSel ? 'var(--surface-2)' : 'transparent',
                        color: isSel ? 'var(--hi)' : 'var(--fg-dim)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {holderType === 'Individual' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                      Date of birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="mm/dd/yyyy"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                      ID document type
                    </label>
                    <select
                      value={idDocType}
                      onChange={(e) => setIdDocType(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                    >
                      <option value="Passport">Passport</option>
                      <option value="National ID">National ID</option>
                      <option value="Driver License">Driver License</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                      ID document number
                    </label>
                    <input
                      type="text"
                      value={idDocNumber}
                      onChange={(e) => setIdDocNumber(e.target.value)}
                      placeholder="e.g. X1234567"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Company Legal Entity Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Alpha Treasury Partners Sp. z o.o."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
            )}

            {/* Address */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                Street Address
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="Enter street address"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter zip or postal code"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                >
                  <option value="United States">United States</option>
                  <option value="Poland">Poland</option>
                  <option value="Germany">Germany</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="France">France</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  State / Province
                </label>
                <input
                  type="text"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  placeholder="Enter state or province"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--line)' }} />

          {/* ============ SECTION 3: BANK INFORMATION ============ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--hi)', margin: 0 }}>
              Bank Information
            </h3>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                Bank Name
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Please enter your bank name"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                Bank Street Address
              </label>
              <input
                type="text"
                value={bankStreetAddress}
                onChange={(e) => setBankStreetAddress(e.target.value)}
                placeholder="Enter bank street address"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Bank City
                </label>
                <input
                  type="text"
                  value={bankCity}
                  onChange={(e) => setBankCity(e.target.value)}
                  placeholder="Enter bank city"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Bank State/Province (Optional)
                </label>
                <input
                  type="text"
                  value={bankStateProvince}
                  onChange={(e) => setBankStateProvince(e.target.value)}
                  placeholder="Enter state or province"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Bank Zip/Postal Code
                </label>
                <input
                  type="text"
                  value={bankZipCode}
                  onChange={(e) => setBankZipCode(e.target.value)}
                  placeholder="Enter bank zip or postal code"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  Bank Country
                </label>
                <select
                  value={bankCountry}
                  onChange={(e) => setBankCountry(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem' }}
                >
                  <option value="United States">United States</option>
                  <option value="Poland">Poland</option>
                  <option value="Germany">Germany</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="France">France</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--line)' }} />

          {/* ============ SECTION 4: PAYMENT DETAILS ============ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--hi)', margin: 0 }}>
              Payment Details
            </h3>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem', fontWeight: 600 }}
              >
                {currency === 'USD' && (
                  <>
                    <option value="ACH">ACH</option>
                    <option value="Fedwire">Fedwire / Wire Transfer</option>
                    <option value="SWIFT">SWIFT International</option>
                  </>
                )}
                {currency === 'EUR' && (
                  <>
                    <option value="SEPA Instant">SEPA Instant (&lt; 10 seconds)</option>
                    <option value="SEPA Core">SEPA Core</option>
                    <option value="SWIFT">SWIFT International</option>
                  </>
                )}
                {currency === 'PLN' && (
                  <>
                    <option value="ELIXIR">ELIXIR</option>
                    <option value="Express Elixir">Express Elixir</option>
                    <option value="SWIFT">SWIFT International</option>
                  </>
                )}
                {currency !== 'USD' && currency !== 'EUR' && currency !== 'PLN' && (
                  <>
                    <option value="Local Clearing">Local Clearing</option>
                    <option value="SWIFT">SWIFT International Wire</option>
                  </>
                )}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  {currency === 'EUR' || currency === 'PLN' ? 'IBAN' : 'Account Number'}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={currency === 'EUR' ? 'PL00 0000 0000 0000 0000 0000 0000' : 'Enter account number'}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem', fontFamily: 'var(--f-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', display: 'block', marginBottom: '4px' }}>
                  {currency === 'USD' ? 'Routing Number (ABA)' : 'BIC / SWIFT Code'}
                </label>
                <input
                  type="text"
                  value={routingBic}
                  onChange={(e) => setRoutingBic(e.target.value)}
                  placeholder={currency === 'USD' ? '021000021' : 'BNPAFFRPW'}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--ground)', color: 'var(--hi)', fontSize: '0.86rem', fontFamily: 'var(--f-mono)' }}
                />
              </div>
            </div>
          </div>

          {/* ============ ACTION BUTTONS ============ */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-solid"
              style={{
                flex: 1,
                padding: '13px',
                fontSize: '0.95rem',
                fontWeight: 700,
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0000FF, #3B82F6)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Linking & Encrypting...' : 'Add Bank Account'}
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="btn btn-line"
              style={{
                padding: '13px 24px',
                fontSize: '0.92rem',
                fontWeight: 600,
                borderRadius: '12px',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // RENDER: BANK ACCOUNTS LIST VIEW
  // =========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Success Notification */}
      {successBanner && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60A5FA',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>✓ {successBanner}</span>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ============ TITLE & CONTROLS ============ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 650, color: 'var(--hi)' }}>Bank Accounts</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', marginTop: '2px' }}>
            Verified accounts authorized for SEPA Instant, ACH, and SWIFT wire payouts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('add')}
          className="btn btn-solid btn-sm"
          style={{
            background: 'linear-gradient(135deg, #0000FF, #3B82F6)',
            color: '#fff',
            fontWeight: 650,
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            boxShadow: '0 4px 14px rgba(0, 0, 255, 0.25)',
          }}
        >
          + Add Bank Account
        </button>
      </div>

      {/* ============ BANK CARDS GRID ============ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
        {accounts.map((acc) => (
          <div
            key={acc.id}
            style={{
              padding: 'clamp(1.15rem, 3vw, 1.5rem)',
              borderRadius: '18px',
              background: 'var(--surface)',
              border: acc.isDefault ? '1px solid #3B82F6' : '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              position: 'relative',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg className="ic" style={{ width: 18, height: 18, color: '#3B82F6' }}>
                      <use href="#i-landmark" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--hi)' }}>{acc.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--fg-dim)' }}>
                      {acc.bankName} · {acc.currency}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: acc.status === 'Verified' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(245, 166, 35, 0.12)',
                    color: acc.status === 'Verified' ? '#60A5FA' : 'var(--pending)',
                    fontWeight: 600,
                  }}
                >
                  {acc.status}
                </span>
              </div>

              <div style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: '10px', background: 'var(--ground)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: '3px' }}>
                  {acc.paymentMethod} · {acc.iban.includes('PL') || acc.iban.length > 20 ? 'IBAN' : 'Account Number'}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 650, fontFamily: 'var(--f-mono)', color: 'var(--hi)', wordBreak: 'break-all' }}>
                  {acc.iban}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--fg-dim)', marginTop: '0.75rem' }}>
                <span>Beneficiary:</span>
                <span style={{ color: 'var(--hi)', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {acc.holder}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--fg-dim)', marginTop: '0.4rem' }}>
                <span>Routing / BIC:</span>
                <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--hi)', fontWeight: 600 }}>{acc.bic}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '0.75rem' }}>
              {acc.isDefault ? (
                <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg className="ic" style={{ width: 12, height: 12 }}>
                    <use href="#i-check" />
                  </svg>
                  Default Account
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAccounts(accounts.map((a) => ({ ...a, isDefault: a.id === acc.id })));
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--fg-dim)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Set as Default
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(acc.iban.replace(/\s/g, ''));
                  alert('Account details copied to clipboard!');
                }}
                className="btn btn-line btn-sm"
                style={{ padding: '3px 9px', fontSize: '0.74rem' }}
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
