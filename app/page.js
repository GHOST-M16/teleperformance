'use client';
import { useState } from 'react';

const SAMPLES = {
  legal: `Dear ConnectHub,\n\nI am writing to formally dispute the $340 early termination fee applied to my account. When I signed up in March 2025, your sales agent explicitly told me I was on a 12-month contract. I have now completed 15 months and am therefore out of contract.\n\nI am currently consulting with a consumer rights advisor and if this fee is not waived within 5 business days I will be escalating this matter to the relevant regulatory authority.\n\nPriya Nambiar\nAccount #: 3302-PN-8812`,
  outage: `To whoever handles this,\n\nI have had ZERO signal on my phone since Tuesday morning. That is now 48 hours without any mobile service. I cannot make calls, send texts, or use data. I called your support line FOUR TIMES and each time I was told "our engineers are working on it." No ETA, no update, nothing.\n\nI need this fixed TODAY or I will be cancelling my contract and disputing the charges for this month. I am not paying for a service that does not work.\n\nDaniel Reyes\nAccount #: 7823-DR-4401`,
  billing: `Hi ConnectHub,\n\nI noticed my June bill shows two separate charges of $49.99 each. I am on a single line plan and there is absolutely no reason I should be billed twice. I have called three times over the past two weeks and nobody has resolved it.\n\nI want this refunded immediately. If I do not hear back by end of this week I am calling my bank and disputing both charges.\n\nTeresa Wainwright\nAccount #: 7712-TW-3341`,
  rude: `Dear Customer Relations,\n\nI am writing to formally complain about a support agent named Kyle I spoke with on June 14th at approximately 2:45 PM. He was dismissive, spoke over me repeatedly, and ended the call before I could finish explaining my issue.\n\nI have been a ConnectHub customer for six years and have never experienced such poor service. I expect a formal apology and a proper investigation.\n\nLinda Zhao\nAccount #: 5567-LZ-2201`,
  low: `Hello,\n\nI just wanted to check when my current contract ends. I have been with ConnectHub for about 18 months and I think it might be coming up soon but I am not sure. Nothing urgent, just want to know where I stand.\n\nOmar Farouk\nPhone: 07XXX XXXXXX`,
};

const DEMO_RESULTS = {
  legal: {
    tier: 'CRITICAL', sla: '2 hours',
    primaryCategory: 'Contract Dispute (Category 4)',
    secondaryCategory: 'Churn Risk (Category 3)',
    routeTo: 'Contract Review Team + Retention Specialist',
    priority: 'URGENT', tlNotification: true,
    firstAction: 'Suspend the $340 ETF immediately pending investigation. Pull the March 2025 sign-up call recording.',
    specialFlags: ['Regulatory escalation threatened', 'Compliance review required', 'Do NOT enforce ETF'],
    rationale: 'Two Critical triggers are present: (1) "consulting with a consumer rights advisor" satisfies the legal action trigger; (2) "escalating to the relevant regulatory authority" satisfies the regulator trigger. Contract Dispute defaults to Critical. The customer has set a hard 5-day deadline which must be beaten, not matched.',
    response: `Dear Ms Nambiar,\n\nThank you for writing to us and for setting out your concerns so clearly. I want to address this directly: the allegation that the contract duration was not accurately communicated to you at the point of sale is a serious one, and we are treating it as such.\n\nEffective immediately, the $340 early termination fee has been suspended on your account. It will not be processed while our investigation is underway. I have raised a formal case with our Contract Review Team and requested that the call recording from your March 2025 sign-up call be retrieved and reviewed as a priority.\n\nI will personally ensure that you receive a written outcome within 3 business days — ahead of your stated deadline. If our review confirms that the 24-month term was not clearly communicated at the point of sale, the ETF will be waived in full.\n\nYours sincerely,\nSarah Mitchell — Senior Customer Relations, ConnectHub\nCase reference: CHT-003 | Account: 3302-PN-8812`,
  },
  outage: {
    tier: 'CRITICAL', sla: '2 hours',
    primaryCategory: 'Service Outage (Category 2)',
    secondaryCategory: 'Churn Risk (Category 3)',
    routeTo: 'Technical Team (Urgent) + Retention Specialist',
    priority: 'URGENT', tlNotification: true,
    firstAction: 'Check network status for customer area. Issue proactive 7-day service credit immediately. Log 4 failed contact attempts.',
    specialFlags: ['48hr+ total outage — Critical threshold exceeded', 'Cancellation threatened', '4 prior contacts with no resolution'],
    rationale: 'Critical trigger: complete service loss exceeding 24 hours ("48 hours without any mobile service"). Secondary Critical trigger: explicit cancellation intent ("I will be cancelling my contract"). Four failed support contacts constitute a serious repeat-contact flag. Proactive credit must be issued without the customer requesting it.',
    response: `Dear Mr Reyes,\n\nI want to start with a direct apology — not only for the 48 hours you have been without signal, but for the four times you contacted us and left without a useful answer. That is not acceptable, and I am sorry.\n\nI have checked the network status for your area and can confirm there is an active fault logged (Fault Reference: NW-2026-0617). Our engineering team has been on-site since this morning and the estimated restoration time is today by 6 PM. I will send you a direct update at 5 PM whether the fault is resolved or not.\n\nBecause of the impact this outage has had, I have applied a 7-day service credit to your account automatically. You do not need to request this.\n\nI have also noted your concern about cancellation. I would genuinely like the opportunity to resolve this before you make that decision. Please reply to this email directly if you have not heard from us by 6 PM.\n\nYours sincerely,\nTom Fitzgerald — Technical Customer Relations, ConnectHub\nCase reference: CHT-002 | Fault ref: NW-2026-0617`,
  },
  billing: {
    tier: 'CRITICAL', sla: '2 hours',
    primaryCategory: 'Churn Risk (Category 3)',
    secondaryCategory: 'Billing Dispute (Category 1)',
    routeTo: 'Retention Specialist + Billing Team',
    priority: 'URGENT', tlNotification: true,
    firstAction: 'Verify duplicate charge on account 7712-TW-3341 and initiate immediate refund before customer contacts bank.',
    specialFlags: ['Bank dispute threatened — time-critical', 'Total disputed amount $99.98 exceeds $100 Critical threshold', '3 prior contacts with no resolution'],
    rationale: 'Critical triggers: (1) bank dispute threat is equivalent to a financial/legal escalation; (2) total disputed amount of $99.98 approaches and effectively reaches the $100 Critical billing threshold. Three prior unresolved contacts make this a high-priority repeat-contact case. If the customer initiates a chargeback before the refund is processed, the account will be flagged.',
    response: `Dear Teresa,\n\nThank you for writing to us — and I am sorry that three contacts over two weeks have not produced a result. That is not acceptable.\n\nI have pulled up account 7712-TW-3341 and can see the two $49.99 charges on your June bill. I have flagged this as a duplicate billing error and a refund of $49.99 will be processed to your original payment method within 24 hours. You will receive a confirmation email once it has been issued.\n\nI would ask that you give us until Thursday to confirm the refund before contacting your bank — it will be quicker for both of us to resolve this directly.\n\nI am the named owner of this case and you will not need to call again.\n\nYours sincerely,\nRachel Obi — Customer Relations, ConnectHub\nCase reference: CHT-011 | Account: 7712-TW-3341`,
  },
  rude: {
    tier: 'CRITICAL', sla: '2 hours',
    primaryCategory: 'Agent Conduct (Category 6)',
    secondaryCategory: null,
    routeTo: 'Quality Assurance Team',
    priority: 'URGENT', tlNotification: true,
    firstAction: 'Pull call recording from June 14th ~14:45. Send formal acknowledgement to customer within 2 hours.',
    specialFlags: ['Agent identity refusal', 'Call terminated prematurely', 'HR notification may be required pending recording review'],
    rationale: 'Agent Conduct always defaults to Critical. The complaint names specific failures: the agent spoke over the customer repeatedly and terminated the call before the customer could finish — both are policy violations. The agent is named (Kyle) which allows the call recording to be located precisely. Six-year customer tenure increases retention risk.',
    response: `Dear Ms Zhao,\n\nThank you for taking the time to write to us. I want to apologise sincerely for the experience you had on June 14th. The behaviour you have described — being spoken over, and having the call ended before you could finish — falls well below the standard we hold our team to.\n\nI have raised a formal conduct review and our Quality Assurance team will pull the call recording from that interaction before close of business today. You will receive written confirmation of the outcome.\n\nSeparately, I would like to resolve the $14.99 charge you originally called about. Could you reply to this email with the details and I will investigate it personally?\n\nYours sincerely,\nJames Okafor — Customer Relations Manager, ConnectHub\nCase reference: CHT-005 | Account: 5567-LZ-2201`,
  },
  low: {
    tier: 'LOW', sla: '72 hours',
    primaryCategory: 'Contract Dispute (Category 4)',
    secondaryCategory: null,
    routeTo: 'General queue — any available agent',
    priority: 'LOW', tlNotification: false,
    firstAction: 'Look up contract end date on account linked to provided phone number. Check auto-renewal status and flag proactively.',
    specialFlags: ['Check auto-renewal status — flag if within 30 days of end date'],
    rationale: 'No Critical or Standard triggers present. Customer explicitly states "nothing urgent" with calm tone, first contact, no churn language, no service degradation, and no financial dispute. Contract Dispute defaults to Critical but the override applies here — no Critical conditions (legal action, misrepresentation) are present. This is a routine informational query that maps cleanly to Low.',
    response: `Dear Omar,\n\nThanks for getting in touch — happy to help with this.\n\nI have looked up your account and can confirm the following:\n\n- Your current contract end date is: [CONTRACT END DATE]\n- Auto-renewal status: [ACTIVE / INACTIVE]\n- If active, your contract would roll into a monthly rolling agreement unless you give notice before [NOTICE DEADLINE]\n\nIf you would like to make any changes — upgrade, downgrade, or move to a rolling monthly plan — just reply to this email and I will get that sorted for you.\n\nKind regards,\nLiam Tranter — ConnectHub Customer Support\nCase reference: CHT-012`,
  },
};

const TIER_CONFIG = {
  CRITICAL: { color: '#C0392B', bg: '#FADBD8', border: '#E8A49A', icon: '⚠' },
  STANDARD: { color: '#D35400', bg: '#FAE5D3', border: '#EDB98A', icon: '🕐' },
  LOW:      { color: '#1E8449', bg: '#D5F5E3', border: '#8ED9A8', icon: '✓' },
};

function detectSample(text) {
  const t = text.toLowerCase();
  if (t.includes('consumer rights') || t.includes('regulatory') || t.includes('solicitor') || t.includes('early termination fee') || t.includes('3302')) return 'legal';
  if (t.includes('zero signal') || t.includes('48 hours') || t.includes('four times') || t.includes('7823')) return 'outage';
  if (t.includes('two separate charges') || t.includes('billed twice') || t.includes('7712')) return 'billing';
  if (t.includes('kyle') || t.includes('spoke over') || t.includes('5567') || t.includes('agent named')) return 'rude';
  if (t.includes('contract ends') || t.includes('18 months') || t.includes('auto-renewed') || t.includes('omar')) return 'low';
  return null;
}

export default function Home() {
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [counts, setCounts] = useState({ CRITICAL: 0, STANDARD: 0, LOW: 0 });
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('triage');

  const handleTriage = () => {
    if (!complaint.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setLoadStep(0);

    const steps = [1, 2, 3, 4];
    steps.forEach((s, i) => setTimeout(() => setLoadStep(s), (i + 1) * 600));

    setTimeout(() => {
      const key = detectSample(complaint);
      const data = key ? DEMO_RESULTS[key] : DEMO_RESULTS.billing;
      setResult(data);
      setCounts(c => ({ ...c, [data.tier]: c[data.tier] + 1 }));
      setHistory(h => [{ id: Date.now(), tier: data.tier, category: data.primaryCategory, snippet: complaint.slice(0, 60) + '...' }, ...h.slice(0, 9)]);
      setLoading(false);
    }, 2800);
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
            {[['triage','⚡','Triage complaint'],['history','🕐','Recent cases'],['framework','☰','Framework']].map(([key,icon,label]) => (
              <button key={key} style={{...S.navItem,...(activeTab===key?S.navItemActive:{})}} onClick={()=>setActiveTab(key)}>
                <span style={{fontSize:14}}>{icon}</span>{label}
              </button>
            ))}
          </nav>
        </div>
        <div style={S.sidebarBottom}>
          <div style={S.navLabel}>Today's queue</div>
          {[['CRITICAL','#F5A8A8'],['STANDARD','#FAC97A'],['LOW','#7ED8A0']].map(([tier,color])=>(
            <div key={tier} style={S.statRow}>
              <span style={S.statLabel}>{tier}</span>
              <span style={{...S.statVal,color}}>{counts[tier]}</span>
            </div>
          ))}
        </div>
      </aside>

      <main style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>{activeTab==='triage'?'Triage a complaint':activeTab==='history'?'Recent cases':'Triage framework'}</div>
            <div style={S.topbarSub}>{activeTab==='triage'?'Paste any complaint — get tier, category, routing, and a ready-to-send response':activeTab==='history'?'Your last 10 triaged complaints':'ConnectHub triage classification framework v1.4'}</div>
          </div>
          <div style={S.liveBadge}><span style={S.liveDot}/>Demo mode</div>
        </div>

        <div style={S.content}>
          {activeTab === 'triage' && (<>
            <div style={S.inputCard}>
              <div style={S.inputHeader}>
                <div style={S.inputHeaderLabel}>✉ Customer complaint</div>
                <span style={S.charCount}>{complaint.length} characters</span>
              </div>
              <textarea style={S.textarea} value={complaint} onChange={e=>setComplaint(e.target.value)}
                placeholder="Paste the full customer complaint here — or try one of the samples below..." rows={6} />
              <div style={S.inputFooter}>
                <div style={S.sampleRow}>
                  <span style={S.sampleLabel}>Samples:</span>
                  {Object.entries({legal:'Legal threat',outage:'48hr outage',billing:'Billing',rude:'Rude agent',low:'Low tier'}).map(([k,label])=>(
                    <button key={k} style={S.sampleBtn} onClick={()=>setComplaint(SAMPLES[k])}>{label}</button>
                  ))}
                </div>
                <button style={{...S.triageBtn,opacity:complaint.trim().length<10||loading?0.5:1}}
                  onClick={handleTriage} disabled={complaint.trim().length<10||loading}>
                  ⚡ {loading?'Triaging...':'Run triage'}
                </button>
              </div>
            </div>

            {loading && (
              <div style={S.loadingCard}>
                <div style={S.loadingSteps}>
                  {['Checking for Critical triggers','Assigning complaint category','Determining routing action','Drafting agent response'].map((step,i)=>(
                    <div key={i} style={{...S.loadStep,...(loadStep>i?S.loadStepDone:loadStep===i?S.loadStepActive:{})}}>
                      <span style={{fontSize:14}}>{loadStep>i?'✓':'○'}</span>{step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && tc && (
              <div style={S.resultArea}>
                <div style={{...S.tierBanner,background:tc.bg,borderColor:tc.border,color:tc.color}}>
                  <div style={S.tierLeft}>
                    <div style={{...S.tierIcon,background:tc.color}}>
                      <span style={{fontSize:18,color:'#fff'}}>{tc.icon}</span>
                    </div>
                    <div>
                      <div style={S.tierLabel}>Urgency tier</div>
                      <div style={{...S.tierName,color:tc.color}}>{result.tier === 'CRITICAL' ? 'Tier 1' : result.tier === 'STANDARD' ? 'Tier 2' : 'Tier 3'} — {result.tier}</div>
                    </div>
                  </div>
                  <div style={S.tierRight}>
                    <div style={S.slaLabel}>Response SLA</div>
                    <div style={{...S.slaVal,color:tc.color}}>{result.sla}</div>
                  </div>
                </div>

                <div style={S.infoGrid}>
                  <InfoCard label="📋 Category" value={result.primaryCategory} sub={result.secondaryCategory?`Secondary: ${result.secondaryCategory}`:null}/>
                  <InfoCard label="→ Route to" value={result.routeTo} sub={`Priority: ${result.priority}`}/>
                  <InfoCard label="▶ First action" value={result.firstAction} small/>
                  <div style={S.infoCard}>
                    <div style={S.infoLabel}>🔔 TL notification</div>
                    <div style={{marginTop:6}}>
                      <span style={{...S.tlBadge,...(result.tlNotification?S.tlBadgeYes:S.tlBadgeNo)}}>
                        {result.tlNotification?'🔔 Required':'🔕 Not required'}
                      </span>
                    </div>
                    {result.specialFlags?.length>0 && (
                      <div style={S.flagsRow}>
                        {result.specialFlags.map((f,i)=><span key={i} style={S.flagPill}>{f}</span>)}
                      </div>
                    )}
                  </div>
                </div>

                <div style={S.rationaleCard}>
                  <div style={S.rationaleLabel}>🧠 Triage rationale</div>
                  <div style={S.rationaleText}>{result.rationale}</div>
                </div>

                <div style={S.responseCard}>
                  <div style={S.responseHeader}>
                    <div style={S.responseHeaderLeft}>✉ Ready-to-send response draft</div>
                    <button style={S.copyBtn} onClick={handleCopy}>{copied?'✓ Copied!':'⎘ Copy response'}</button>
                  </div>
                  <div style={S.responseBody}>{result.response}</div>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div style={S.emptyState}>
                <div style={{fontSize:36,marginBottom:12}}>⚡</div>
                <div style={{fontSize:14,color:'#888',marginBottom:6}}>Paste a complaint and hit <strong>Run triage</strong></div>
                <div style={{fontSize:12,color:'#aaa'}}>Or try one of the sample complaints above</div>
              </div>
            )}
          </>)}

          {activeTab === 'history' && (
            <div style={S.historyArea}>
              {history.length===0?(
                <div style={S.emptyState}><div style={{fontSize:36,marginBottom:12}}>🕐</div><div style={{fontSize:14,color:'#888'}}>No cases triaged yet in this session</div></div>
              ):history.map(h=>(
                <div key={h.id} style={S.historyItem}>
                  <div style={{...S.historyTier,background:TIER_CONFIG[h.tier].bg,color:TIER_CONFIG[h.tier].color,borderColor:TIER_CONFIG[h.tier].border}}>{h.tier}</div>
                  <div style={S.historyMeta}>
                    <div style={S.historyCat}>{h.category}</div>
                    <div style={S.historySnippet}>{h.snippet}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'framework' && (
            <div style={S.frameworkArea}>
              {[
                {tier:'CRITICAL',label:'Tier 1 — Critical',sla:'2 hours',color:'#C0392B',bg:'#FADBD8',border:'#E8A49A',routing:'Senior agent + Team Leader notified within 15 mins',
                  triggers:['Legal/regulatory threat or solicitor mentioned','Media or social media threat','Complete service outage 24+ hours','Disputed charge over $100 or fraud suspected','Explicit intent to cancel, port, or switch provider','Agent misconduct alleged']},
                {tier:'STANDARD',label:'Tier 2 — Standard',sla:'24 hours',color:'#D35400',bg:'#FAE5D3',border:'#EDB98A',routing:'Standard agent queue — assigned within 4 hours',
                  triggers:['Frustrated tone (caps, exclamations, repeat contact)','Partial service degradation (not total outage)','Billing discrepancy $25–$100','Device fault: without device 3–13 days','Repeat contact: 2+ times without resolution']},
                {tier:'LOW',label:'Tier 3 — Low',sla:'72 hours',color:'#1E8449',bg:'#D5F5E3',border:'#8ED9A8',routing:'General queue — self-service encouraged',
                  triggers:['Calm tone, no frustration signals','No service degradation present','Financial impact under $25 or unconfirmed','First contact on this issue','No churn risk indicators']},
              ].map(t=>(
                <div key={t.tier} style={{...S.frameworkCard,borderColor:t.border}}>
                  <div style={{...S.frameworkHeader,background:t.bg,borderBottomColor:t.border}}>
                    <div style={{fontSize:11,fontWeight:500,color:t.color,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:2}}>{t.label}</div>
                    <div style={{fontSize:13,color:'#444'}}>SLA: <strong style={{color:t.color}}>{t.sla}</strong> · {t.routing}</div>
                  </div>
                  <div style={S.frameworkBody}>
                    <div style={S.frameworkTriggersLabel}>Trigger conditions</div>
                    {t.triggers.map((tr,i)=>(
                      <div key={i} style={S.frameworkTrigger}><span style={{color:t.color,marginRight:6,flexShrink:0}}>›</span>{tr}</div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={S.frameworkNote}>ℹ Highest applicable tier always wins. Multi-category tickets: highest-tier category is primary. $25 billing threshold determines Low vs Standard for billing disputes.</div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;font-family:inherit}
        textarea{font-family:inherit}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:#ddd;border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>
    </div>
  );
}

function InfoCard({label,value,sub,small,custom}){
  return(
    <div style={S.infoCard}>
      <div style={S.infoLabel}>{label}</div>
      {value&&<div style={{...S.infoVal,...(small?{fontSize:12.5,fontWeight:400}:{})}}>{value}</div>}
      {sub&&<div style={S.infoSub}>{sub}</div>}
      {custom&&<div style={{marginTop:6}}>{custom}</div>}
    </div>
  );
}

const S = {
  root:{display:'flex',height:'100vh',overflow:'hidden',fontFamily:"'Inter',system-ui,sans-serif",background:'#F0F2F5'},
  sidebar:{width:220,background:'#1B3A6B',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'1.25rem 1rem',flexShrink:0,overflowY:'auto'},
  sidebarTop:{display:'flex',flexDirection:'column',gap:'1.5rem'},
  logo:{display:'flex',alignItems:'center',gap:10},
  logoMark:{width:34,height:34,borderRadius:8,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,color:'#fff',flexShrink:0},
  logoName:{fontSize:14,fontWeight:600,color:'#fff'},
  logoSub:{fontSize:10,color:'rgba(255,255,255,0.4)',marginTop:1},
  nav:{display:'flex',flexDirection:'column',gap:3},
  navLabel:{fontSize:10,fontWeight:500,color:'rgba(255,255,255,0.35)',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0 8px',marginBottom:4,marginTop:4},
  navItem:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:6,color:'rgba(255,255,255,0.6)',fontSize:13,background:'transparent',border:'none',textAlign:'left',width:'100%'},
  navItemActive:{background:'rgba(255,255,255,0.14)',color:'#fff'},
  sidebarBottom:{display:'flex',flexDirection:'column',gap:6,paddingTop:'1rem',borderTop:'0.5px solid rgba(255,255,255,0.1)',marginTop:'1rem'},
  statRow:{display:'flex',justifyContent:'space-between',alignItems:'center'},
  statLabel:{fontSize:11,color:'rgba(255,255,255,0.4)'},
  statVal:{fontSize:13,fontWeight:500},
  main:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:'#F0F2F5'},
  topbar:{padding:'0.85rem 1.5rem',background:'#fff',borderBottom:'1px solid #E8EAF0',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0},
  topbarTitle:{fontSize:15,fontWeight:600,color:'#1A1A2E'},
  topbarSub:{fontSize:12,color:'#888',marginTop:2},
  liveBadge:{display:'inline-flex',alignItems:'center',gap:6,fontSize:11,padding:'4px 10px',borderRadius:20,background:'#E8F4FD',color:'#1B3A6B',fontWeight:500,border:'1px solid #C5D8F0'},
  liveDot:{width:6,height:6,borderRadius:'50%',background:'#1B3A6B',display:'inline-block'},
  content:{flex:1,overflowY:'auto',padding:'1.25rem 1.5rem',display:'flex',flexDirection:'column',gap:'1rem'},
  inputCard:{background:'#fff',border:'1px solid #E8EAF0',borderRadius:10,overflow:'hidden'},
  inputHeader:{padding:'0.65rem 1rem',borderBottom:'1px solid #E8EAF0',display:'flex',alignItems:'center',justifyContent:'space-between'},
  inputHeaderLabel:{fontSize:12,fontWeight:500,color:'#666'},
  charCount:{fontSize:11,color:'#aaa'},
  textarea:{width:'100%',padding:'0.85rem 1rem',fontSize:13,color:'#1A1A2E',background:'transparent',border:'none',outline:'none',resize:'none',lineHeight:1.65},
  inputFooter:{padding:'0.65rem 1rem',borderTop:'1px solid #E8EAF0',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'},
  sampleRow:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'},
  sampleLabel:{fontSize:11,color:'#aaa'},
  sampleBtn:{fontSize:11,padding:'3px 9px',borderRadius:4,border:'1px solid #ddd',background:'transparent',color:'#666'},
  triageBtn:{display:'flex',alignItems:'center',gap:6,padding:'8px 18px',background:'#1B3A6B',color:'#fff',border:'none',borderRadius:7,fontSize:13,fontWeight:500,flexShrink:0},
  loadingCard:{background:'#fff',border:'1px solid #E8EAF0',borderRadius:10,padding:'1.5rem'},
  loadingSteps:{display:'flex',flexDirection:'column',gap:10,maxWidth:300,margin:'0 auto'},
  loadStep:{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'#bbb'},
  loadStepDone:{color:'#1E8449'},
  loadStepActive:{color:'#1B3A6B',fontWeight:500},
  resultArea:{display:'flex',flexDirection:'column',gap:'0.85rem'},
  tierBanner:{borderRadius:10,padding:'1rem 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',border:'1px solid'},
  tierLeft:{display:'flex',alignItems:'center',gap:12},
  tierIcon:{width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0},
  tierLabel:{fontSize:11,fontWeight:500,opacity:0.65,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:2},
  tierName:{fontSize:20,fontWeight:600},
  tierRight:{textAlign:'right'},
  slaLabel:{fontSize:10,opacity:0.6,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2},
  slaVal:{fontSize:22,fontWeight:600},
  infoGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'},
  infoCard:{background:'#fff',border:'1px solid #E8EAF0',borderRadius:8,padding:'0.85rem 1rem'},
  infoLabel:{fontSize:10,fontWeight:500,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:6},
  infoVal:{fontSize:13,fontWeight:500,color:'#1A1A2E',lineHeight:1.5},
  infoSub:{fontSize:12,color:'#888',marginTop:3},
  tlBadge:{display:'inline-flex',alignItems:'center',fontSize:12,padding:'3px 9px',borderRadius:5,fontWeight:500},
  tlBadgeYes:{background:'#FADBD8',color:'#C0392B'},
  tlBadgeNo:{background:'#F0F2F5',color:'#888'},
  flagsRow:{display:'flex',flexWrap:'wrap',gap:4,marginTop:6},
  flagPill:{fontSize:11,padding:'2px 8px',borderRadius:20,background:'#FEF3CD',color:'#B7770D',border:'1px solid #F0D080',display:'inline-block'},
  rationaleCard:{background:'#fff',border:'1px solid #E8EAF0',borderRadius:8,padding:'0.85rem 1rem'},
  rationaleLabel:{fontSize:10,fontWeight:500,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8},
  rationaleText:{fontSize:13,color:'#555',lineHeight:1.7},
  responseCard:{background:'#fff',border:'1px solid #E8EAF0',borderRadius:8,overflow:'hidden'},
  responseHeader:{padding:'0.65rem 1rem',borderBottom:'1px solid #E8EAF0',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#FAFAFA'},
  responseHeaderLeft:{fontSize:12,fontWeight:500,color:'#666'},
  copyBtn:{display:'flex',alignItems:'center',fontSize:12,padding:'4px 12px',borderRadius:5,border:'1px solid #ddd',background:'#fff',color:'#555'},
  responseBody:{padding:'1rem 1.25rem',fontSize:13,color:'#1A1A2E',lineHeight:1.8,whiteSpace:'pre-wrap'},
  emptyState:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'3rem',textAlign:'center',minHeight:250},
  historyArea:{display:'flex',flexDirection:'column',gap:'0.6rem'},
  historyItem:{display:'flex',alignItems:'flex-start',gap:12,background:'#fff',border:'1px solid #E8EAF0',borderRadius:8,padding:'0.85rem 1rem'},
  historyTier:{fontSize:11,fontWeight:600,padding:'3px 9px',borderRadius:5,border:'1px solid',flexShrink:0,letterSpacing:'0.04em'},
  historyMeta:{flex:1,minWidth:0},
  historyCat:{fontSize:13,fontWeight:500,color:'#1A1A2E',marginBottom:3},
  historySnippet:{fontSize:12,color:'#888',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},
  frameworkArea:{display:'flex',flexDirection:'column',gap:'0.85rem'},
  frameworkCard:{background:'#fff',borderRadius:8,border:'1px solid',overflow:'hidden'},
  frameworkHeader:{padding:'0.85rem 1.1rem',borderBottom:'1px solid'},
  frameworkBody:{padding:'0.85rem 1.1rem',display:'flex',flexDirection:'column',gap:6},
  frameworkTriggersLabel:{fontSize:10,fontWeight:500,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:4},
  frameworkTrigger:{display:'flex',alignItems:'flex-start',fontSize:13,color:'#444',lineHeight:1.5},
  frameworkNote:{background:'#EEF2FB',border:'1px solid #C5D3F0',borderRadius:8,padding:'0.85rem 1rem',fontSize:13,color:'#1B3A6B',lineHeight:1.6},
};
