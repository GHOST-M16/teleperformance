'use client';
import { useState, useRef } from 'react';

const SAMPLES = {
  legal: `Dear ConnectHub,\n\nI am writing to formally dispute the $340 early termination fee applied to my account. When I signed up in March 2025, your sales agent explicitly told me I was on a 12-month contract. I have now completed 15 months and am therefore out of contract.\n\nI am currently consulting with a consumer rights advisor and if this fee is not waived within 5 business days I will be escalating this matter to the relevant regulatory authority and exploring all legal avenues available to me.\n\nPriya Nambiar\nAccount #: 3302-PN-8812`,
  outage: `To whoever handles this,\n\nI have had ZERO signal on my phone since Tuesday morning. That is now 48 hours without any mobile service. I cannot make calls, send texts, or use data. I called your support line FOUR TIMES and each time I was told "our engineers are working on it." No ETA, no update, nothing.\n\nI need this fixed TODAY or I will be cancelling my contract and disputing the charges for this month. I am not paying for a service that does not work.\n\nDaniel Reyes\nAccount #: 7823-DR-4401`,
  billing: `Hi ConnectHub,\n\nI noticed my June bill shows two separate charges of $49.99 each. I am on a single line plan and there is absolutely no reason I should be billed twice. I have called three times over the past two weeks and each time I am told it is being looked into, but nothing has been resolved.\n\nI want this refunded immediately. If I do not hear back by end of this week I am calling my bank and disputing both charges.\n\nTeresa Wainwright\nAccount #: 7712-TW-3341`,
  rude: `Dear Customer Relations,\n\nI am writing to formally log a complaint about the behaviour of a ConnectHub support agent I spoke with on June 14th at approximately 2:45 PM. The agent's name was given as "Kyle." He was dismissive, spoke over me repeatedly, and ended the call before I could finish explaining my issue.\n\nI have been a ConnectHub customer for six years and have never experienced such poor service. I expect a formal apology and a proper investigation into both the agent's conduct and the unresolved $14.99 charge.\n\nLinda Zhao\nAccount #: 5567-LZ-2201`,
  low: `Hello,\n\nI just wanted to check when my current contract ends. I have been with ConnectHub for about 18 months and I think it might be coming up soon but I am not 100% sure. I do not want to be auto-renewed without realising. Nothing urgent, just want to know where I stand.\n\nOmar Farouk\nPhone: 07XXX XXXXXX`,
};

const TIER_CONFIG = {
  CRITICAL: { color: '#C0392B', bg: '#FADBD8', border: '#E8A49A', icon: 'ti-alert-triangle', label: 'Tier 1' },
  STANDARD: { color: '#D35400', bg: '#FAE5D3', border: '#EDB98A', icon: 'ti-clock', label: 'Tier 2' },
  LOW:      { color: '#1E8449', bg: '#D5F5E3', border: '#8ED9A8', icon: 'ti-check',  label: 'Tier 3' },
};

export default function Home() {
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [counts, setCounts] = useState({ CRITICAL: 0, STANDARD: 0, LOW: 0 });
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('triage');
  const intervalRef = useRef(null);

  const handleTriage = async () => {
    if (!complaint.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadStep(0);

    intervalRef.current = setInterval(() => {
      setLoadStep(s => Math.min(s + 1, 4));
    }, 700);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Triage failed');
      setResult(data);
      setCounts(c => ({ ...c, [data.tier]: (c[data.tier] || 0) + 1 }));
      setHistory(h => [{ id: Date.now(), tier: data.tier, category: data.primaryCategory, snippet: complaint.slice(0, 60) + '...' }, ...h.slice(0, 9)]);
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(intervalRef.current);
      setLoadStep(4);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tc = result ? TIER_CONFIG[result.tier] : null;

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.logo}>
            <div style={S.logoMark}>CH</div>
            <div>
              <div style={S.logoName}>ConnectHub</div>
              <div style={S.logoSub}>AI Triage System v1.4</div>
            </div>
          </div>

          <nav style={S.nav}>
            <div style={S.navLabel}>Workspace</div>
            {[
              { key: 'triage', icon: 'ti-bolt', label: 'Triage complaint' },
              { key: 'history', icon: 'ti-history', label: 'Recent cases' },
              { key: 'framework', icon: 'ti-list-check', label: 'Framework' },
            ].map(item => (
              <button key={item.key} style={{ ...S.navItem, ...(activeTab === item.key ? S.navItemActive : {}) }} onClick={() => setActiveTab(item.key)}>
                <i className={`ti ${item.icon}`} style={S.navIcon} aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={S.sidebarBottom}>
          <div style={S.navLabel}>Today's queue</div>
          {[['CRITICAL', '#F5A8A8'], ['STANDARD', '#FAC97A'], ['LOW', '#7ED8A0']].map(([tier, color]) => (
            <div key={tier} style={S.statRow}>
              <span style={S.statLabel}>{tier}</span>
              <span style={{ ...S.statVal, color }}>{counts[tier]}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>
              {activeTab === 'triage' ? 'Triage a complaint' : activeTab === 'history' ? 'Recent cases' : 'Triage framework'}
            </div>
            <div style={S.topbarSub}>
              {activeTab === 'triage' ? 'Paste any complaint — get tier, category, routing, and a ready-to-send response' : activeTab === 'history' ? 'Your last 10 triaged complaints' : 'ConnectHub triage classification framework v1.4'}
            </div>
          </div>
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            Claude powered
          </div>
        </div>

        <div style={S.content}>
          {/* Triage tab */}
          {activeTab === 'triage' && (
            <>
              {/* Input */}
              <div style={S.inputCard}>
                <div style={S.inputHeader}>
                  <div style={S.inputHeaderLabel}><i className="ti ti-message-2" style={{ fontSize: 14, marginRight: 6, color: '#888' }} aria-hidden="true" />Customer complaint</div>
                  <span style={S.charCount}>{complaint.length} characters</span>
                </div>
                <textarea
                  style={S.textarea}
                  value={complaint}
                  onChange={e => setComplaint(e.target.value)}
                  placeholder="Paste the full customer complaint here — email, chat transcript, or web form submission..."
                  rows={6}
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleTriage(); }}
                />
                <div style={S.inputFooter}>
                  <div style={S.sampleRow}>
                    <span style={S.sampleLabel}>Samples:</span>
                    {Object.keys(SAMPLES).map(k => (
                      <button key={k} style={S.sampleBtn} onClick={() => setComplaint(SAMPLES[k])}>
                        {k === 'legal' ? 'Legal threat' : k === 'outage' ? '48hr outage' : k === 'billing' ? 'Billing' : k === 'rude' ? 'Rude agent' : 'Low tier'}
                      </button>
                    ))}
                  </div>
                  <button style={{ ...S.triageBtn, opacity: complaint.trim().length < 20 || loading ? 0.5 : 1 }} onClick={handleTriage} disabled={complaint.trim().length < 20 || loading}>
                    <i className={`ti ${loading ? 'ti-loader-2' : 'ti-bolt'}`} style={{ fontSize: 14, ...(loading ? { animation: 'spin 1s linear infinite' } : {}) }} aria-hidden="true" />
                    {loading ? 'Triaging...' : 'Run triage'}
                  </button>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div style={S.loadingCard}>
                  <div style={S.loadingSteps}>
                    {['Checking for Critical triggers', 'Assigning complaint category', 'Determining routing action', 'Drafting agent response'].map((step, i) => (
                      <div key={i} style={{ ...S.loadStep, ...(loadStep > i ? S.loadStepDone : loadStep === i ? S.loadStepActive : {}) }}>
                        <i className={`ti ${loadStep > i ? 'ti-check' : loadStep === i ? 'ti-loader-2' : 'ti-circle'}`} style={{ fontSize: 14, ...(loadStep === i ? { animation: 'spin 1s linear infinite' } : {}) }} aria-hidden="true" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={S.errorCard}>
                  <i className="ti ti-alert-circle" style={{ fontSize: 16, marginRight: 8, color: '#C0392B' }} aria-hidden="true" />
                  {error}
                </div>
              )}

              {/* Result */}
              {result && tc && (
                <div style={S.resultArea}>
                  {/* Tier banner */}
                  <div style={{ ...S.tierBanner, background: tc.bg, borderColor: tc.border, color: tc.color }}>
                    <div style={S.tierLeft}>
                      <div style={{ ...S.tierIcon, background: tc.color }}>
                        <i className={`ti ${tc.icon}`} style={{ fontSize: 18, color: '#fff' }} aria-hidden="true" />
                      </div>
                      <div>
                        <div style={S.tierLabel}>{tc.label} — Urgency tier</div>
                        <div style={{ ...S.tierName, color: tc.color }}>{result.tier}</div>
                      </div>
                    </div>
                    <div style={S.tierRight}>
                      <div style={S.slaLabel}>Response SLA</div>
                      <div style={{ ...S.slaVal, color: tc.color }}>{result.sla}</div>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div style={S.infoGrid}>
                    <InfoCard icon="ti-tag" label="Category" value={result.primaryCategory} sub={result.secondaryCategory ? `Secondary: ${result.secondaryCategory}` : null} />
                    <InfoCard icon="ti-route" label="Route to" value={result.routeTo} sub={`Priority: ${result.priority}`} />
                    <InfoCard icon="ti-player-play" label="First action" value={result.firstAction} small />
                    <InfoCard icon="ti-bell" label="TL notification" value={null}
                      custom={
                        <div>
                          <span style={{ ...S.tlBadge, ...(result.tlNotification ? S.tlBadgeYes : S.tlBadgeNo) }}>
                            <i className={`ti ${result.tlNotification ? 'ti-bell-ringing' : 'ti-bell-off'}`} style={{ fontSize: 12, marginRight: 4 }} aria-hidden="true" />
                            {result.tlNotification ? 'Required' : 'Not required'}
                          </span>
                          {result.specialFlags && result.specialFlags.length > 0 && (
                            <div style={S.flagsRow}>
                              {result.specialFlags.map((f, i) => <span key={i} style={S.flagPill}>{f}</span>)}
                            </div>
                          )}
                          {result.ambiguityFlag && (
                            <div style={{ ...S.flagPill, background: '#FEF3CD', color: '#B7770D', marginTop: 6 }}>{result.ambiguityFlag}</div>
                          )}
                        </div>
                      }
                    />
                  </div>

                  {/* Rationale */}
                  <div style={S.rationaleCard}>
                    <div style={S.rationaleLabel}><i className="ti ti-brain" style={{ fontSize: 13, marginRight: 6 }} aria-hidden="true" />Triage rationale</div>
                    <div style={S.rationaleText}>{result.rationale}</div>
                  </div>

                  {/* Response */}
                  <div style={S.responseCard}>
                    <div style={S.responseHeader}>
                      <div style={S.responseHeaderLeft}><i className="ti ti-mail" style={{ fontSize: 14, marginRight: 6, color: '#888' }} aria-hidden="true" />Ready-to-send response draft</div>
                      <button style={S.copyBtn} onClick={handleCopy}>
                        <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} style={{ fontSize: 13, marginRight: 5 }} aria-hidden="true" />
                        {copied ? 'Copied!' : 'Copy response'}
                      </button>
                    </div>
                    <div style={S.responseBody}>{result.response}</div>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && !result && !error && (
                <div style={S.emptyState}>
                  <i className="ti ti-bolt" style={{ fontSize: 36, color: '#ccc', marginBottom: 12 }} aria-hidden="true" />
                  <div style={{ fontSize: 14, color: '#888', marginBottom: 6 }}>Paste a complaint and hit <strong>Run triage</strong></div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>Or try one of the sample complaints above</div>
                </div>
              )}
            </>
          )}

          {/* History tab */}
          {activeTab === 'history' && (
            <div style={S.historyArea}>
              {history.length === 0 ? (
                <div style={S.emptyState}>
                  <i className="ti ti-history" style={{ fontSize: 36, color: '#ccc', marginBottom: 12 }} aria-hidden="true" />
                  <div style={{ fontSize: 14, color: '#888' }}>No cases triaged yet in this session</div>
                </div>
              ) : history.map(h => (
                <div key={h.id} style={S.historyItem}>
                  <div style={{ ...S.historyTier, background: TIER_CONFIG[h.tier].bg, color: TIER_CONFIG[h.tier].color, borderColor: TIER_CONFIG[h.tier].border }}>
                    {h.tier}
                  </div>
                  <div style={S.historyMeta}>
                    <div style={S.historyCat}>{h.category}</div>
                    <div style={S.historySnippet}>{h.snippet}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Framework tab */}
          {activeTab === 'framework' && (
            <div style={S.frameworkArea}>
              {[
                { tier: 'CRITICAL', label: 'Tier 1 — Critical', sla: '2 hours', color: '#C0392B', bg: '#FADBD8', border: '#E8A49A',
                  triggers: ['Legal/regulatory threat or solicitor mentioned', 'Media or social media threat', 'Complete service outage 24+ hours', 'Disputed charge over $100 or fraud suspected', 'Explicit intent to cancel, port, or switch provider', 'Agent misconduct alleged'],
                  routing: 'Senior agent + Team Leader notification within 15 minutes' },
                { tier: 'STANDARD', label: 'Tier 2 — Standard', sla: '24 hours', color: '#D35400', bg: '#FAE5D3', border: '#EDB98A',
                  triggers: ['Frustrated tone (caps, exclamations, repeat contact)', 'Partial service degradation (intermittent, not total)', 'Billing discrepancy $25–$100', 'Device fault: customer without device 3–13 days', 'Repeat contact: 2+ times without resolution'],
                  routing: 'Standard agent queue — assigned within 4 hours' },
                { tier: 'LOW', label: 'Tier 3 — Low', sla: '72 hours', color: '#1E8449', bg: '#D5F5E3', border: '#8ED9A8',
                  triggers: ['Calm tone, no frustration signals', 'No service degradation present', 'Financial impact under $25 or unconfirmed', 'First contact on this issue', 'No churn risk indicators'],
                  routing: 'General queue — self-service encouraged' },
              ].map(t => (
                <div key={t.tier} style={{ ...S.frameworkCard, borderColor: t.border }}>
                  <div style={{ ...S.frameworkHeader, background: t.bg, borderColor: t.border }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: t.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: 13, color: '#444' }}>SLA: <strong style={{ color: t.color }}>{t.sla}</strong> &nbsp;·&nbsp; {t.routing}</div>
                    </div>
                  </div>
                  <div style={S.frameworkBody}>
                    <div style={S.frameworkTriggersLabel}>Trigger conditions</div>
                    {t.triggers.map((trigger, i) => (
                      <div key={i} style={S.frameworkTrigger}>
                        <i className="ti ti-chevron-right" style={{ fontSize: 12, color: t.color, marginRight: 6, flexShrink: 0 }} aria-hidden="true" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={S.frameworkNote}>
                <i className="ti ti-info-circle" style={{ fontSize: 14, marginRight: 8, color: '#1B3A6B' }} aria-hidden="true" />
                <span>Highest applicable tier always wins. If a complaint triggers both Standard and Critical conditions, assign Critical. Multi-category tickets: highest-tier category is primary.</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button { cursor: pointer; font-family: inherit; }
        textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
      `}</style>
    </div>
  );
}

function InfoCard({ icon, label, value, sub, small, custom }) {
  return (
    <div style={S.infoCard}>
      <div style={S.infoLabel}><i className={`ti ${icon}`} style={{ fontSize: 13, marginRight: 5, color: '#aaa' }} aria-hidden="true" />{label}</div>
      {value && <div style={{ ...S.infoVal, ...(small ? { fontSize: 12.5, fontWeight: 400 } : {}) }}>{value}</div>}
      {sub && <div style={S.infoSub}>{sub}</div>}
      {custom && <div style={{ marginTop: 6 }}>{custom}</div>}
    </div>
  );
}

const S = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" },
  sidebar: { width: 220, background: '#1B3A6B', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem 1rem', flexShrink: 0, overflowY: 'auto' },
  sidebarTop: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoMark: { width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff', flexShrink: 0 },
  logoName: { fontSize: 14, fontWeight: 600, color: '#fff' },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1, letterSpacing: '0.02em' },
  nav: { display: 'flex', flexDirection: 'column', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4, marginTop: 4 },
  navItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13, background: 'transparent', border: 'none', textAlign: 'left', width: '100%', transition: 'all 0.15s' },
  navItemActive: { background: 'rgba(255,255,255,0.14)', color: '#fff' },
  navIcon: { fontSize: 15, flexShrink: 0 },
  sidebarBottom: { display: 'flex', flexDirection: 'column', gap: 6, paddingTop: '1rem', borderTop: '0.5px solid rgba(255,255,255,0.1)', marginTop: '1rem' },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  statVal: { fontSize: 13, fontWeight: 500 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F0F2F5' },
  topbar: { padding: '0.85rem 1.5rem', background: '#fff', borderBottom: '1px solid #E8EAF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarTitle: { fontSize: 15, fontWeight: 600, color: '#1A1A2E' },
  topbarSub: { fontSize: 12, color: '#888', marginTop: 2 },
  liveBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#D5F5E3', color: '#1E8449', fontWeight: 500 },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: '#1E8449', display: 'inline-block', animation: 'pulse 2s infinite' },
  content: { flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputCard: { background: '#fff', border: '1px solid #E8EAF0', borderRadius: 10, overflow: 'hidden' },
  inputHeader: { padding: '0.65rem 1rem', borderBottom: '1px solid #E8EAF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  inputHeaderLabel: { fontSize: 12, fontWeight: 500, color: '#666', display: 'flex', alignItems: 'center' },
  charCount: { fontSize: 11, color: '#aaa' },
  textarea: { width: '100%', padding: '0.85rem 1rem', fontSize: 13, color: '#1A1A2E', background: 'transparent', border: 'none', outline: 'none', resize: 'none', lineHeight: 1.65 },
  inputFooter: { padding: '0.65rem 1rem', borderTop: '1px solid #E8EAF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  sampleRow: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  sampleLabel: { fontSize: 11, color: '#aaa' },
  sampleBtn: { fontSize: 11, padding: '3px 9px', borderRadius: 4, border: '1px solid #ddd', background: 'transparent', color: '#666', transition: 'all 0.15s' },
  triageBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, transition: 'all 0.15s', flexShrink: 0 },
  loadingCard: { background: '#fff', border: '1px solid #E8EAF0', borderRadius: 10, padding: '1.5rem' },
  loadingSteps: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto' },
  loadStep: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#bbb' },
  loadStepDone: { color: '#1E8449' },
  loadStepActive: { color: '#1B3A6B', fontWeight: 500 },
  errorCard: { background: '#FADBD8', border: '1px solid #E8A49A', borderRadius: 8, padding: '0.85rem 1rem', fontSize: 13, color: '#C0392B', display: 'flex', alignItems: 'center' },
  resultArea: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  tierBanner: { borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid' },
  tierLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  tierIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tierLabel: { fontSize: 11, fontWeight: 500, opacity: 0.65, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 },
  tierName: { fontSize: 20, fontWeight: 600 },
  tierRight: { textAlign: 'right' },
  slaLabel: { fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 },
  slaVal: { fontSize: 22, fontWeight: 600 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  infoCard: { background: '#fff', border: '1px solid #E8EAF0', borderRadius: 8, padding: '0.85rem 1rem' },
  infoLabel: { fontSize: 10, fontWeight: 500, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'flex', alignItems: 'center' },
  infoVal: { fontSize: 13, fontWeight: 500, color: '#1A1A2E', lineHeight: 1.5 },
  infoSub: { fontSize: 12, color: '#888', marginTop: 3 },
  tlBadge: { display: 'inline-flex', alignItems: 'center', fontSize: 12, padding: '3px 9px', borderRadius: 5, fontWeight: 500 },
  tlBadgeYes: { background: '#FADBD8', color: '#C0392B' },
  tlBadgeNo: { background: '#F0F2F5', color: '#888' },
  flagsRow: { display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  flagPill: { fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#FEF3CD', color: '#B7770D', border: '1px solid #F0D080', display: 'inline-block' },
  rationaleCard: { background: '#fff', border: '1px solid #E8EAF0', borderRadius: 8, padding: '0.85rem 1rem' },
  rationaleLabel: { fontSize: 10, fontWeight: 500, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'flex', alignItems: 'center' },
  rationaleText: { fontSize: 13, color: '#555', lineHeight: 1.7 },
  responseCard: { background: '#fff', border: '1px solid #E8EAF0', borderRadius: 8, overflow: 'hidden' },
  responseHeader: { padding: '0.65rem 1rem', borderBottom: '1px solid #E8EAF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA' },
  responseHeaderLeft: { fontSize: 12, fontWeight: 500, color: '#666', display: 'flex', alignItems: 'center' },
  copyBtn: { display: 'flex', alignItems: 'center', fontSize: 12, padding: '4px 12px', borderRadius: 5, border: '1px solid #ddd', background: '#fff', color: '#555', transition: 'all 0.15s' },
  responseBody: { padding: '1rem 1.25rem', fontSize: 13, color: '#1A1A2E', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', minHeight: 250 },
  historyArea: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  historyItem: { display: 'flex', alignItems: 'flex-start', gap: 12, background: '#fff', border: '1px solid #E8EAF0', borderRadius: 8, padding: '0.85rem 1rem' },
  historyTier: { fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5, border: '1px solid', flexShrink: 0, letterSpacing: '0.04em' },
  historyMeta: { flex: 1, minWidth: 0 },
  historyCat: { fontSize: 13, fontWeight: 500, color: '#1A1A2E', marginBottom: 3 },
  historySnippet: { fontSize: 12, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  frameworkArea: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  frameworkCard: { background: '#fff', borderRadius: 8, border: '1px solid', overflow: 'hidden' },
  frameworkHeader: { padding: '0.85rem 1.1rem', borderBottom: '1px solid' },
  frameworkBody: { padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: 6 },
  frameworkTriggersLabel: { fontSize: 10, fontWeight: 500, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 },
  frameworkTrigger: { display: 'flex', alignItems: 'flex-start', fontSize: 13, color: '#444', lineHeight: 1.5 },
  frameworkNote: { background: '#EEF2FB', border: '1px solid #C5D3F0', borderRadius: 8, padding: '0.85rem 1rem', fontSize: 13, color: '#1B3A6B', display: 'flex', alignItems: 'flex-start', lineHeight: 1.6 },
};
