'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, ChevronRight } from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface PeerMaster {
  id: string;
  initials: string;
  name: string;
  topic: string;
  topicType: 'Conceptual' | 'Procedural' | 'Calculation';
  course: string;
  courseCode: string;
  mastery: number;
  sessionsGiven: number;
}

const GAP_TOPICS = [ 
  { id: 'limits',       label: 'Limits and Continuity',       courseCode: 'MATH-2414', type: 'Conceptual' as const, gapType: 'Conceptual Gap'  },
  { id: 'double-int',   label: 'Double and Triple Integrals',  courseCode: 'MATH-2414', type: 'Procedural' as const, gapType: 'Procedural Gap'  },
  { id: 'transactions', label: 'Transactions and Concurrency', courseCode: 'COSC-3312', type: 'Conceptual' as const, gapType: 'Conceptual Gap'  },

  // added topic
  { id: 'web-programming', label: 'Intro to Web Programming', courseCode: 'COSC-2327', type: 'Conceptual' as const, gapType: 'Conceptual Gap' },
];

const PEER_MASTERS: PeerMaster[] = [
  { id: '1', initials:'SJ', name:'Sarah J.',  topic:'Limits and Continuity',        topicType:'Conceptual', course:'Calculus II',      courseCode:'MATH-2414', mastery:91, sessionsGiven:12 },
  { id: '2', initials:'MR', name:'Marcus R.', topic:'Limits and Continuity',        topicType:'Conceptual', course:'Calculus II',      courseCode:'MATH-2414', mastery:88, sessionsGiven:7  },
  { id: '3', initials:'PK', name:'Priya K.',  topic:'Double and Triple Integrals',  topicType:'Procedural', course:'Calculus II',      courseCode:'MATH-2414', mastery:85, sessionsGiven:9  },
  { id: '4', initials:'AL', name:'Alex L.',   topic:'Transactions and Concurrency', topicType:'Conceptual', course:'Database Systems', courseCode:'COSC-3312', mastery:90, sessionsGiven:5  },
  { id: '5', initials:'ZH', name:'Zoe H.',    topic:'Double and Triple Integrals',  topicType:'Procedural', course:'Calculus II',      courseCode:'MATH-2414', mastery:82, sessionsGiven:4  },

  // added peers for new topic
  { id: '6', initials:'DM', name:'Daniel M.', topic:'Intro to Web Programming', topicType:'Conceptual', course:'Intro to Web Programming', courseCode:'COSC-2327', mastery:87, sessionsGiven:6 },
  { id: '7', initials:'AR', name:'Aisha R.',  topic:'Intro to Web Programming', topicType:'Conceptual', course:'Intro to Web Programming', courseCode:'COSC-2327', mastery:84, sessionsGiven:3 },
];

// ─── AVATAR ───────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div style={{ width:`${size}px`, height:`${size}px`, borderRadius:'50%', background:'#111111',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:`${Math.round(size * 0.33)}px`, fontWeight:700, color:'#FFFFFF', flexShrink:0 }}>
      {initials}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CollaborationPage() {
  const [activeGap, setActiveGap] = useState(GAP_TOPICS[0].id);

  const gap     = GAP_TOPICS.find(g => g.id === activeGap) ?? GAP_TOPICS[0];
  const masters = PEER_MASTERS.filter(p => p.topic === gap.label);

  return (
    <div style={{ width:'100%', maxWidth:'820px' }}>
      <style>{`
        .gap-tab        { transition: border-color 0.12s, background 0.12s; }
        .gap-tab:hover  { border-color: #888888 !important; }
        .master-card    { transition: border-color 0.15s, box-shadow 0.15s; }
        .master-card:hover { border-color: #888888 !important; box-shadow: 0 3px 10px rgba(0,0,0,0.09) !important; }
        .connect-btn:hover { background: #333333 !important; }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ margin:'0 0 6px', fontSize:'26px', fontWeight:800, color:'#000000', letterSpacing:'-0.04em' }}>
          Collaboration
        </h1>
        <p style={{ margin:0, fontSize:'15px', color:'#666666', fontWeight:500 }}>
          Connect with a Peer Master for your current gap — shared workspace, no calls.
        </p>
      </div>

      {/* ── GAP TOPICS ── */}
      <div style={{ marginBottom:'8px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase',
          letterSpacing:'0.07em', marginBottom:'12px' }}>
          Your Gap Topics
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {GAP_TOPICS.map(g => {
            const active = g.id === activeGap;
            return (
              <button key={g.id} className="gap-tab"
                onClick={() => setActiveGap(g.id)}
                style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px',
                  borderRadius:'10px', background:'#FFFFFF',
                  border: active ? '1.5px solid #000000' : '1px solid #E2E2E2',
                  boxShadow: active ? '0 0 0 3px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
                  cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                  background: active ? '#000000' : '#CCCCCC', flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'#000000', lineHeight:1.3, letterSpacing:'-0.01em' }}>
                    {g.label}
                  </div>
                  <div style={{ fontSize:'12px', color:'#888888', fontWeight:500, marginTop:'2px' }}>
                    {g.courseCode} · {g.gapType}
                  </div>
                </div>
                <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 9px',
                  borderRadius:'4px', background: active ? '#F0F0F0' : '#F7F7F7',
                  border: active ? '1px solid #CCCCCC' : '1px solid #EEEEEE',
                  color:'#555555', flexShrink:0 }}>
                  {g.type}
                </span>
                {active && <ChevronRight size={14} stroke="#888888" strokeWidth={2}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── AVAILABLE MASTERS ── */}
      <div style={{ marginTop:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#AAAAAA',
            textTransform:'uppercase', letterSpacing:'0.07em' }}>
            Available Peer Masters · {gap.label}
          </div>
          <div style={{ fontSize:'12px', color:'#AAAAAA', fontWeight:500 }}>
            {masters.length} available
          </div>
        </div>

        {masters.length === 0 ? (
          <div style={{ background:'#fff', border:'1px solid #E2E2E2', borderRadius:'10px',
            padding:'36px', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            <Users size={24} stroke="#CCCCCC" strokeWidth={1.5} style={{ margin:'0 auto 12px', display:'block' }}/>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#000000', marginBottom:'5px', letterSpacing:'-0.01em' }}>
              No masters available right now
            </div>
            <div style={{ fontSize:'13px', color:'#888888', fontWeight:500 }}>
              Check back later or try a different gap topic.
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {masters.map(m => (
              <div key={m.id} className="master-card"
                style={{ background:'#fff', border:'1px solid #E2E2E2', borderRadius:'10px',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.04)', padding:'18px 20px',
                  display:'flex', alignItems:'center', gap:'14px' }}>
                <Avatar initials={m.initials}/>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                    <span style={{ fontSize:'15px', fontWeight:700, color:'#000000', letterSpacing:'-0.01em' }}>
                      {m.name}
                    </span>
                    <span style={{ fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius:'4px',
                      background:'#F0F0F0', border:'1px solid #E0E0E0', color:'#333333' }}>
                      {m.mastery}% mastery
                    </span>
                  </div>
                  <div style={{ fontSize:'13px', color:'#888888', fontWeight:500, display:'flex', alignItems:'center', gap:'6px' }}>
                    <BookOpen size={11} stroke="#CCCCCC" strokeWidth={2}/>
                    <span>{m.courseCode} · {m.course}</span>
                    <span style={{ color:'#DDDDDD' }}>·</span>
                    <span>{m.sessionsGiven} sessions given</span>
                  </div>
                </div>

                <Link href="/collaboration/active" className="connect-btn"
                  style={{ fontSize:'13px', fontWeight:700, color:'#fff', background:'#000000',
                    border:'none', borderRadius:'7px', padding:'8px 18px', cursor:'pointer',
                    textDecoration:'none', flexShrink:0, display:'flex', alignItems:'center', gap:'5px',
                    transition:'background 0.15s', letterSpacing:'-0.01em' }}>
                  Connect
                  <ChevronRight size={12} strokeWidth={2.5}/>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ marginTop:'36px', padding:'20px 24px', background:'#FAFAFA',
        border:'1px solid #E8E8E8', borderRadius:'10px' }}>
        <div style={{ fontSize:'11px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase',
          letterSpacing:'0.07em', marginBottom:'14px' }}>
          How Peer Sessions Work
        </div>
        <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
          {[
            { step:'1', text:'You write your work on your blackboard' },
            { step:'2', text:'The Peer Master writes their explanation on theirs' },
            { step:'3', text:'Chat is locked to your specific gap topic only' },
          ].map(s => (
            <div key={s.step} style={{ display:'flex', alignItems:'flex-start', gap:'10px', flex:'1', minWidth:'180px' }}>
              <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:'#111111',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'11px', fontWeight:700, color:'#fff', flexShrink:0, marginTop:'1px' }}>
                {s.step}
              </div>
              <span style={{ fontSize:'13px', color:'#444444', lineHeight:1.6, fontWeight:500 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
