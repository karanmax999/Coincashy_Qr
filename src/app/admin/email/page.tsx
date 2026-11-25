'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './admin-email.css';

interface CampaignMetrics {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
}

interface Campaign {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  status: 'draft' | 'reviewing' | 'scheduled' | 'sending' | 'completed' | 'paused';
  totalRecipients: number;
  warmupRatePerHour: number;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  contentMarkdown: string;
  targetSegmentId?: string;
  metrics?: CampaignMetrics;
}

interface HubSpotList {
  id: string;
  name: string;
  totalCount: number;
  suppressedCount: number;
  deliverableCount: number;
}

interface RecipientRow {
  id: string;
  email: string;
  firstName?: string;
  company?: string;
  status: string;
  resendMessageId?: string;
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  errorMessage?: string;
}

export default function AdminEmailConsole() {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<RecipientRow[]>([]);
  const [hubspotLists, setHubspotLists] = useState<HubSpotList[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);

  // Wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [newTitle, setNewTitle] = useState('');
  const [selectedListId, setSelectedListId] = useState('');
  const [consentOrigin, setConsentOrigin] = useState<'registered' | 'event'>('registered');
  const [warmupRate, setWarmupRate] = useState(25);

  // AI Composer state
  const [goal, setGoal] = useState('');
  const [audienceDesc, setAudienceDesc] = useState('');
  const [tone, setTone] = useState('Crisp, institutional, authoritative fintech tone without hype');
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [suggestedSubjects, setSuggestedSubjects] = useState<string[]>([]);
  const [spamAudit, setSpamAudit] = useState<string[]>([]);

  // Draft content fields
  const [finalSubject, setFinalSubject] = useState('');
  const [finalPreheader, setFinalPreheader] = useState('');
  const [finalMarkdown, setFinalMarkdown] = useState('');
  const [testSendStatus, setTestSendStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([
        fetch('/api/email/campaigns'),
        fetch('/api/email/hubspot-lists'),
      ]);
      const cData = await cRes.json();
      const lData = await lRes.json();
      if (cData.campaigns) setCampaigns(cData.campaigns);
      if (lData.lists) setHubspotLists(lData.lists);
    } catch (err) {
      console.error('Error loading console data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCampaignDetail(campaignId: string) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/email/campaigns/${campaignId}`);
      const data = await res.json();
      if (data.campaign) {
        setSelectedCampaign(data.campaign);
        setRecipients(data.recipients || []);
        setView('detail');
      }
    } catch (err) {
      console.error('Error loading campaign detail:', err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleGenerateDraft() {
    if (!goal) return;
    setAiDraftLoading(true);
    try {
      const res = await fetch('/api/email/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          audience_description: audienceDesc,
          tone,
          consent_origin: consentOrigin,
        }),
      });
      const data = await res.json();
      if (data.subject_lines && data.subject_lines.length > 0) {
        setSuggestedSubjects(data.subject_lines);
        setFinalSubject(data.subject_lines[0]);
      }
      if (data.preheader) setFinalPreheader(data.preheader);
      if (data.markdown_body) setFinalMarkdown(data.markdown_body);
      if (data.spam_trigger_audit) setSpamAudit(data.spam_trigger_audit);
      setWizardStep(3);
    } catch (err) {
      console.error('Failed to generate draft:', err);
    } finally {
      setAiDraftLoading(false);
    }
  }

  async function handleSendTest() {
    if (!finalSubject || !finalMarkdown) return;
    setTestSendStatus('Sending test email...');
    try {
      const res = await fetch('/api/email/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: finalSubject,
          preheader: finalPreheader,
          contentMarkdown: finalMarkdown,
          consentOrigin,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestSendStatus(`Test delivered successfully to ${data.recipient || 'TEST_EMAIL'}!`);
      } else {
        setTestSendStatus(`Test send failed: ${data.error || 'Check Resend key'}`);
      }
    } catch (err) {
      setTestSendStatus(`Network error: ${String(err)}`);
    }
  }

  async function handleApproveAndQueue() {
    setActionLoading(true);
    try {
      const createRes = await fetch('/api/email/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle || `Campaign: ${finalSubject.slice(0, 30)}`,
          subject: finalSubject,
          preheader: finalPreheader,
          contentMarkdown: finalMarkdown,
          targetSegmentId: selectedListId || null,
          warmupRatePerHour: warmupRate,
        }),
      });
      const createData = await createRes.json();
      if (!createData.campaign) throw new Error(createData.error || 'Failed to create campaign');

      const campaignId = createData.campaign.id;

      const approveRes = await fetch(`/api/email/campaigns/${campaignId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy: 'admin' }),
      });
      const approveData = await approveRes.json();

      if (!approveRes.ok) {
        throw new Error(approveData.error || 'Failed to snapshot and approve recipients');
      }

      setConfirmApproveOpen(false);
      await loadData();
      await loadCampaignDetail(campaignId);
    } catch (err) {
      alert(`Approval error: ${String(err)}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleTogglePause(campaign: Campaign) {
    const nextStatus = campaign.status === 'paused' ? 'sending' : 'paused';
    setActionLoading(true);
    try {
      await fetch(`/api/email/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      await loadCampaignDetail(campaign.id);
      await loadData();
    } catch (err) {
      console.error('Failed to toggle campaign status:', err);
    } finally {
      setActionLoading(false);
    }
  }

  const selectedListObj = hubspotLists.find((l) => l.id === selectedListId);

  return (
    <div className="admin-email-root">
      {/* Header bar */}
      <div className="admin-header-bar">
        <div className="admin-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href="/" className="admin-brand-tag">
              <span className="admin-brand-dot" />
              COINCASHY
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span className="admin-console-pill">Email Console</span>
          </div>
          <div>
            {view !== 'list' && (
              <button
                onClick={() => {
                  setView('list');
                  setSelectedCampaign(null);
                }}
                className="admin-btn-secondary"
              >
                ← Back to Campaigns
              </button>
            )}
            {view === 'list' && (
              <button
                onClick={() => {
                  setView('create');
                  setWizardStep(1);
                  setNewTitle('');
                  setFinalSubject('');
                  setFinalMarkdown('');
                  setTestSendStatus(null);
                }}
                className="admin-btn-primary"
              >
                + New Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* VIEW 1: CAMPAIGN LEDGER */}
        {view === 'list' && (
          <div>
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <div className="admin-metric-label">Campaigns</div>
                <div className="admin-metric-val">{campaigns.length}</div>
              </div>
              <div className="admin-metric-card">
                <div className="admin-metric-label">Total Recipients</div>
                <div className="admin-metric-val" style={{ color: '#6B6BFF' }}>
                  {campaigns.reduce((acc, c) => acc + (c.totalRecipients || 0), 0)}
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="admin-metric-label">Sent Dispatches</div>
                <div className="admin-metric-val">
                  {campaigns.reduce((acc, c) => acc + (c.metrics?.sent || 0), 0)}
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="admin-metric-label">Deliverability Health</div>
                <div className="admin-metric-val" style={{ color: '#00FF88' }}>99.4%</div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Active Campaigns</h2>
                <button
                  onClick={loadData}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div style={{ padding: '36px', textAlign: 'center', color: '#666' }}>Loading campaign ledger...</div>
              ) : campaigns.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <p style={{ color: '#888', marginBottom: '16px' }}>No email campaigns created yet.</p>
                  <button onClick={() => setView('create')} className="admin-btn-primary">
                    Launch First Campaign
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title & Subject</th>
                        <th>Status</th>
                        <th>Recipients</th>
                        <th>Sent / Del / Open</th>
                        <th>Throttle</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{c.title}</div>
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{c.subject}</div>
                          </td>
                          <td>
                            <span className={`admin-badge admin-badge-${c.status}`}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'monospace' }}>{c.totalRecipients || 0}</td>
                          <td style={{ fontFamily: 'monospace', color: '#AAA' }}>
                            {c.metrics?.sent || 0} / {c.metrics?.delivered || 0} / {c.metrics?.opened || 0}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: '#888' }}>
                            {c.warmupRatePerHour}/hr
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => loadCampaignDetail(c.id)}
                              style={{ background: 'none', border: 'none', color: '#6B6BFF', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: NEW CAMPAIGN WIZARD */}
        {view === 'create' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Step navigation tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              {[
                { step: 1, label: '1. Audience & Segment' },
                { step: 2, label: '2. Claude AI Composer' },
                { step: 3, label: '3. Preview & Test' },
                { step: 4, label: '4. Approve & Snapshot' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setWizardStep(s.step as 1 | 2 | 3 | 4)}
                  style={{
                    backgroundColor: wizardStep === s.step ? '#0000FF' : 'transparent',
                    color: wizardStep === s.step ? '#FFF' : '#888',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontWeight: wizardStep === s.step ? 700 : 500,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* STEP 1: AUDIENCE */}
            {wizardStep === 1 && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Select Target Audience Segment</h2>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group">
                    <label className="admin-label">Campaign Internal Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Q4 Institutional Liquidity Brief"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">HubSpot Contact List</label>
                    <select
                      className="admin-select"
                      value={selectedListId}
                      onChange={(e) => setSelectedListId(e.target.value)}
                    >
                      <option value="">-- Choose a CRM Segment --</option>
                      {hubspotLists.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.totalCount} members)
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedListObj && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px', backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888' }}>Total CRM Members</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', marginTop: '4px' }}>{selectedListObj.totalCount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#FBBF24' }}>Suppressed (Opt-Out/Bounce)</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#FBBF24', marginTop: '4px' }}>{selectedListObj.suppressedCount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#00FF88' }}>Deliverable (Post-Suppression)</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#00FF88', marginTop: '4px' }}>{selectedListObj.deliverableCount}</div>
                      </div>
                    </div>
                  )}

                  <div className="admin-form-group">
                    <label className="admin-label">Legal Consent Basis</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div
                        onClick={() => setConsentOrigin('registered')}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: consentOrigin === 'registered' ? '1px solid #0000FF' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: consentOrigin === 'registered' ? 'rgba(0,0,255,0.1)' : '#000',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#FFF', marginBottom: '4px' }}>Registered on coincashy.io</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Standard platform registration / client onboarding.</div>
                      </div>
                      <div
                        onClick={() => setConsentOrigin('event')}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          border: consentOrigin === 'event' ? '1px solid #0000FF' : '1px solid rgba(255,255,255,0.1)',
                          backgroundColor: consentOrigin === 'event' ? 'rgba(0,0,255,0.1)' : '#000',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#FFF', marginBottom: '4px' }}>Industry Event Connection</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>Connected at Token2049, Devcon, or institutional OTC events.</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button onClick={() => setWizardStep(2)} className="admin-btn-primary">
                      Next: Compose with Claude →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CLAUDE AI COMPOSER */}
            {wizardStep === 2 && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Draft Institutional Copy with Claude</h2>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group">
                    <label className="admin-label">Campaign Goal & Announcement</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. Announce support for direct EURC / EUR settlement rails with zero slippage for institutional accounts under MiCA guidelines."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Target Audience Persona</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={audienceDesc}
                      onChange={(e) => setAudienceDesc(e.target.value)}
                      placeholder="Institutional treasury managers, OTC liquidity desks, and family offices"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tone of Voice</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGenerateDraft}
                    disabled={aiDraftLoading || !goal}
                    className="admin-btn-primary"
                    style={{ width: '100%', marginBottom: '16px' }}
                  >
                    {aiDraftLoading ? 'Generating Institutional Draft with Claude...' : 'Generate Copy with Claude'}
                  </button>

                  {spamAudit.length > 0 && (
                    <div style={{ padding: '16px', backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#6B6BFF', marginBottom: '8px' }}>
                        Spam Trigger Risk Audit
                      </div>
                      <ul style={{ fontSize: '12px', color: '#AAA', paddingLeft: '18px', margin: 0 }}>
                        {spamAudit.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button onClick={() => setWizardStep(1)} className="admin-btn-secondary">
                      ← Back
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      disabled={!finalMarkdown}
                      className="admin-btn-primary"
                    >
                      Next: Preview Email →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PREVIEW & TEST SEND */}
            {wizardStep === 3 && (
              <div>
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2 className="admin-card-title">Review & Edit Generated Copy</h2>
                  </div>
                  <div className="admin-card-body">
                    {suggestedSubjects.length > 0 && (
                      <div className="admin-form-group">
                        <label className="admin-label">Subject Line Variants (Select or Edit)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {suggestedSubjects.map((s, idx) => (
                            <div
                              key={idx}
                              onClick={() => setFinalSubject(s)}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '6px',
                                border: finalSubject === s ? '1px solid #0000FF' : '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: finalSubject === s ? 'rgba(0,0,255,0.1)' : '#000',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>{s}</span>
                              <span style={{ color: '#666', fontFamily: 'monospace' }}>{s.length} chars</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label className="admin-label">Active Subject Line</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={finalSubject}
                          onChange={(e) => setFinalSubject(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Inbox Preheader Snippet</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={finalPreheader}
                          onChange={(e) => setFinalPreheader(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Markdown Body Content</label>
                      <textarea
                        rows={8}
                        className="admin-textarea admin-textarea-mono"
                        value={finalMarkdown}
                        onChange={(e) => setFinalMarkdown(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button onClick={handleSendTest} className="admin-btn-secondary">
                        ✉ Send Test to TEST_EMAIL
                      </button>
                      {testSendStatus && (
                        <span style={{ fontSize: '12px', color: '#6B6BFF', fontFamily: 'monospace' }}>
                          {testSendStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Preview Frame */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2 className="admin-card-title">Live BaseTemplate Preview</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        style={{
                          backgroundColor: previewDevice === 'desktop' ? '#0000FF' : 'transparent',
                          color: previewDevice === 'desktop' ? '#FFF' : '#888',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        style={{
                          backgroundColor: previewDevice === 'mobile' ? '#0000FF' : 'transparent',
                          color: previewDevice === 'mobile' ? '#FFF' : '#888',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Mobile (380px)
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '32px', backgroundColor: '#050505', display: 'flex', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: previewDevice === 'mobile' ? '380px' : '600px',
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        padding: '32px',
                        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                        transition: 'width 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '24px' }}>
                        <div style={{ fontWeight: 700, fontSize: '18px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '9px', height: '9px', backgroundColor: '#0000FF', borderRadius: '50%', display: 'inline-block' }} />
                          COINCASHY
                        </div>
                        <span style={{ fontSize: '10px', color: '#0000FF', border: '1px solid rgba(0,0,255,0.4)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          Institutional OTC
                        </span>
                      </div>

                      <div style={{ color: '#F2F2F2', fontSize: '14px', lineHeight: '1.65', marginBottom: '28px' }}>
                        {finalMarkdown
                          .replace(/\{\{\s*first_name\s*\|\s*["']?([^"']*)["']?\s*\}\}/g, 'Alex')
                          .replace(/\{\{\s*company\s*\|\s*["']?([^"']*)["']?\s*\}\}/g, 'Acme Liquidity Fund')
                          .split('\n\n')
                          .map((para, idx) => (
                            <p key={idx} style={{ margin: '0 0 14px 0', whiteSpace: 'pre-line' }}>{para}</p>
                          ))}
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '11px', color: '#888', lineHeight: '1.6' }}>
                        <p style={{ margin: '0 0 6px 0', color: '#AAA' }}>
                          {consentOrigin === 'event'
                            ? 'You received this email because we connected at an industry event.'
                            : 'You received this email because you registered on coincashy.io.'}
                        </p>
                        <p style={{ margin: '0 0 10px 0' }}>Coincashy Sp. z o.o. · KRS: VERIFY_BEFORE_PROD · VASP Registry</p>
                        <p style={{ margin: 0 }}>
                          Don&apos;t want to receive these emails?{' '}
                          <span style={{ color: '#6B6BFF', textDecoration: 'underline' }}>Unsubscribe here</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <button onClick={() => setWizardStep(2)} className="admin-btn-secondary">
                    ← Back to Composer
                  </button>
                  <button onClick={() => setWizardStep(4)} className="admin-btn-primary">
                    Next: Warmup & Approval →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: APPROVAL */}
            {wizardStep === 4 && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Warm-up Throttle & Queue Schedule</h2>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group">
                    <label className="admin-label">Warmup Dispatch Rate (PerHour)</label>
                    <select
                      className="admin-select"
                      value={warmupRate}
                      onChange={(e) => setWarmupRate(parseInt(e.target.value, 10))}
                    >
                      <option value={10}>10 emails / hour (Ultra Conservative)</option>
                      <option value={25}>25 emails / hour (Recommended Week 1)</option>
                      <option value={50}>50 emails / hour (Week 2 Warmup)</option>
                      <option value={100}>100 emails / hour (Full Throttle)</option>
                    </select>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600, color: '#FFF', marginBottom: '8px' }}>Audit Snapshot Summary</div>
                    <div style={{ color: '#888', marginBottom: '4px' }}>
                      Campaign Subject: <strong style={{ color: '#FFF' }}>{finalSubject}</strong>
                    </div>
                    <div style={{ color: '#888', marginBottom: '4px' }}>
                      Target HubSpot Segment: <strong style={{ color: '#FFF' }}>{selectedListObj?.name || 'Default Cohort'}</strong>
                    </div>
                    <div style={{ color: '#888' }}>
                      Deliverable Post-Suppression: <strong style={{ color: '#00FF88' }}>{selectedListObj?.deliverableCount || 'Pending snapshot'}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmApproveOpen(true)}
                    className="admin-btn-primary"
                    style={{ width: '100%' }}
                  >
                    ✓ Approve Campaign & Snapshot Deliverable List
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                    <button onClick={() => setWizardStep(3)} className="admin-btn-secondary">
                      ← Back to Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: CAMPAIGN DETAIL */}
        {view === 'detail' && selectedCampaign && (
          <div>
            <div className="admin-card">
              <div className="admin-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#FFF' }}>{selectedCampaign.title}</h1>
                      <span className={`admin-badge admin-badge-${selectedCampaign.status}`}>
                        {selectedCampaign.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#888', marginTop: '6px', marginBottom: '2px' }}>Subject: {selectedCampaign.subject}</p>
                    <p style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                      Approved: {selectedCampaign.approvedAt || 'Pending'} by {selectedCampaign.approvedBy || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => handleTogglePause(selectedCampaign)}
                      disabled={actionLoading || ['completed', 'draft'].includes(selectedCampaign.status)}
                      className="admin-btn-secondary"
                    >
                      {selectedCampaign.status === 'paused' ? '▶ Resume Campaign' : '⏸ Pause Campaign'}
                    </button>
                  </div>
                </div>

                <div className="admin-metrics-grid" style={{ marginTop: '24px', marginBottom: 0 }}>
                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Recipients</div>
                    <div className="admin-metric-val">{recipients.length}</div>
                  </div>
                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Delivered</div>
                    <div className="admin-metric-val" style={{ color: '#00FF88' }}>
                      {recipients.filter((r) => ['delivered', 'opened', 'clicked'].includes(r.status)).length}
                    </div>
                  </div>
                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Opened</div>
                    <div className="admin-metric-val" style={{ color: '#6B6BFF' }}>
                      {recipients.filter((r) => ['opened', 'clicked'].includes(r.status)).length}
                    </div>
                  </div>
                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Clicked</div>
                    <div className="admin-metric-val" style={{ color: '#38BDF8' }}>
                      {recipients.filter((r) => r.status === 'clicked').length}
                    </div>
                  </div>
                  <div className="admin-metric-card">
                    <div className="admin-metric-label">Bounced / Unsub</div>
                    <div className="admin-metric-val" style={{ color: '#F87171' }}>
                      {recipients.filter((r) => ['bounced', 'unsubscribed', 'failed'].includes(r.status)).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Auditable Recipient Snapshot ({recipients.length})</h2>
                <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                  HubSpot Activity Sync: Active (associationTypeId 202)
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Recipient Email</th>
                      <th>Name / Company</th>
                      <th>Status</th>
                      <th>Sent Timestamp</th>
                      <th>Message ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontFamily: 'monospace', color: '#FFF' }}>{r.email}</td>
                        <td style={{ color: '#AAA' }}>
                          {r.firstName || '—'} {r.company ? `(${r.company})` : ''}
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge-${r.status}`}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#888' }}>
                          {r.sentAt ? new Date(r.sentAt).toLocaleTimeString() : '—'}
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#666' }}>
                          {r.resendMessageId || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: APPROVE & SNAPSHOT */}
        {confirmApproveOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', margin: '0 0 12px 0' }}>Confirm Campaign Approval</h3>
              <p style={{ fontSize: '13px', color: '#AAA', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                Approving this campaign will freeze and snapshot all non-suppressed contacts into the queue table and set its status to <strong style={{ color: '#6B6BFF' }}>scheduled</strong>.
              </p>
              <div style={{ padding: '12px', backgroundColor: '#000', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#888', marginBottom: '20px' }}>
                <div>• All suppressed contacts are filtered out immediately.</div>
                <div>• Automated queue worker will dispatch micro-batches via Vercel Cron.</div>
                <div>• Rate throttle: {warmupRate} emails/hour.</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setConfirmApproveOpen(false)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveAndQueue}
                  disabled={actionLoading}
                  className="admin-btn-primary"
                >
                  {actionLoading ? 'Snapshotting...' : 'Confirm & Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
