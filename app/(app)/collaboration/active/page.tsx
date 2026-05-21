'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Send, Lock, CheckCircle2 } from 'lucide-react';

const TOPIC  = { name: 'Limits and Continuity', gap: 'Conceptual Gap', course: 'MATH-2414' };
const MASTER = { name: 'Sarah J.', initials: 'SJ', mastery: 91 };

const MASTER_CONTENT = `When lim(x→2) (x²−4)/(x−2) gives 0/0 on substitution:

This is an INDETERMINATE FORM — not "no limit exists."
It means: direct substitution won't work. Use a different method.

━━ STEP 1 · Factor the numerator ━━━━━━━━━━━━━━━━━━━━
  x²−4  is a difference of squares:
  x²−4 = (x+2)(x−2)

  So the expression becomes:

        (x+2)(x−2)
        ──────────
           (x−2)

━━ STEP 2 · Cancel (x−2) — here's the KEY ━━━━━━━━━━━

  We're taking a limit as x → 2.
  That means x is CLOSE to 2, but never equal to 2.
  So (x−2) ≠ 0.  ← this is what makes cancellation legal.

  Result after cancel:  (x+2)

━━ STEP 3 · Now substitute safely ━━━━━━━━━━━━━━━━━━━

  lim(x→2) (x+2)  =  2+2  =  4

━━ THE INSIGHT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  f(2) is undefined  ←  there's a hole at x=2
  lim(x→2) = 4      ←  limit still EXISTS

  Limit asks about APPROACH, not the point itself.
  A hole in the graph never blocks a limit.`;

const SEED_MESSAGES = [
  { id: 1, from: 'master' as const, text: 'Hey! I can see you\'re stuck on the 0/0 form. Watch my blackboard — I\'m walking through it step by step.' },
  { id: 2, from: 'me'     as const, text: 'I understand factoring, but why can we cancel (x−2) if x=2 makes it zero?' },
  { id: 3, from: 'master' as const, text: 'That\'s exactly the right question. The answer is in Step 2 above — x approaches 2, it never equals 2.' },
];

export default function ActiveSession() {
  const [myContent,   setMyContent]   = useState('');
  const [masterShown, setMasterShown] = useState('');
  const [typingDone,  setTypingDone]  = useState(false);
  const [messages,    setMessages]    = useState(SEED_MESSAGES);
  const [input,       setInput]       = useState('');

  const charIdx    = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (charIdx.current >= MASTER_CONTENT.length) {
        clearInterval(id);
        setTypingDone(true);
        return;
      }
      charIdx.current += 3;
      setMasterShown(MASTER_CONTENT.slice(0, charIdx.current));
    }, 14);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'me' as const, text }]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 82px)', fontFamily:'inherit' }}>
      <style>{`
        .chat-input:focus { border-color: #111111 !important; }
        .end-btn:hover { background: #F0F0F0 !important; }
      `}</style>

      {/* ── SESSION HEADER ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px',
        paddingBottom:'16px', marginBottom:'16px', borderBottom:'1px solid #E8E8E8', flexShrink:0 }}>
        <Link href="/collaboration"
          style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'13px',
            color:'#888888', textDecoration:'none', flexShrink:0, fontWeight:500,
            transition:'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#000000')}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#888888')}>
          <ChevronLeft size={14} strokeWidth={2}/> Collaboration
        </Link>

        <div style={{ flex:1, textAlign:'center' }}>
          <div style={{ fontSize:'15px', fontWeight:700, color:'#000000', letterSpacing:'-0.02em', lineHeight:1.3 }}>
            {TOPIC.name}
          </div>
          <div style={{ fontSize:'12px', color:'#888888', fontWeight:500, marginTop:'1px' }}>
            {TOPIC.course} · Peer session with {MASTER.name}
          </div>
        </div>

        <button className="end-btn"
          style={{ fontSize:'12px', fontWeight:600, color:'#444444',
            background:'#F5F5F5', border:'1px solid #E2E2E2',
            borderRadius:'6px', padding:'6px 14px', cursor:'pointer', flexShrink:0,
            fontFamily:'inherit', transition:'background 0.15s' }}>
          End Session
        </button>
      </div>

      {/* ── DUAL BLACKBOARDS ── */}
      <div style={{ display:'flex', gap:'10px', flex:1, minHeight:0, marginBottom:'10px' }}>

        {/* LEFT — student's workspace */}
        <div style={{ flex:1, display:'flex', flexDirection:'column',
          background:'#000000', borderRadius:'10px', overflow:'hidden',
          boxShadow:'0 4px 24px rgba(0,0,0,0.24)' }}>

          <div style={{ padding:'12px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)',
            display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'rgba(255,255,255,0.25)' }}/>
            <span style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.28)',
              textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Your Workspace
            </span>
          </div>

          <div style={{ flex:1, padding:'16px 20px', overflow:'hidden' }}>
            <textarea
              value={myContent}
              onChange={e => setMyContent(e.target.value)}
              style={{ width:'100%', height:'100%', background:'transparent', border:'none', outline:'none',
                resize:'none', color:'rgba(255,255,255,0.88)', caretColor:'rgba(255,255,255,0.50)',
                fontSize:'14px', lineHeight:'1.9', fontFamily:'inherit', boxSizing:'border-box' }}
            />
          </div>
        </div>

        {/* RIGHT — master's workspace */}
        <div style={{ flex:1, display:'flex', flexDirection:'column',
          background:'#000000', borderRadius:'10px', overflow:'hidden',
          boxShadow:'0 4px 24px rgba(0,0,0,0.24)' }}>

          <div style={{ padding:'12px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:'#222222',
                border:'1px solid rgba(255,255,255,0.12)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'9px', fontWeight:700, color:'rgba(255,255,255,0.75)', flexShrink:0 }}>
                {MASTER.initials}
              </div>
              <span style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.28)',
                textTransform:'uppercase', letterSpacing:'0.08em' }}>
                {MASTER.name} · Master&apos;s Workspace
              </span>
            </div>
            {!typingDone ? (
              <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'rgba(255,255,255,0.50)' }}/>
                <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.45)', fontWeight:600 }}>Writing</span>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                <CheckCircle2 size={11} stroke="rgba(255,255,255,0.50)" strokeWidth={2.5}/>
                <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.45)', fontWeight:600 }}>Done</span>
              </div>
            )}
          </div>

          <div style={{ flex:1, padding:'16px 20px', overflow:'auto' }}>
            <pre style={{ margin:0, color:'rgba(255,255,255,0.82)', fontSize:'13px',
              lineHeight:'1.9', fontFamily:'inherit', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
              {masterShown}
              {!typingDone && (
                <span style={{ display:'inline-block', width:'1.5px', height:'14px',
                  background:'rgba(255,255,255,0.50)', marginLeft:'1px', verticalAlign:'middle' }}/>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* ── RESTRICTED CHAT ── */}
      <div style={{ height:'230px', display:'flex', flexDirection:'column',
        background:'#fff', border:'1px solid #E2E2E2', borderRadius:'10px',
        overflow:'hidden', flexShrink:0 }}>

        {/* Topic lock strip */}
        <div style={{ padding:'9px 16px', borderBottom:'1px solid #F0F0F0',
          display:'flex', alignItems:'center', gap:'7px', background:'#FAFAFA', flexShrink:0 }}>
          <Lock size={10} stroke="#BBBBBB" strokeWidth={2.5}/>
          <span style={{ fontSize:'10px', color:'#AAAAAA', fontWeight:700,
            textTransform:'uppercase', letterSpacing:'0.06em' }}>
            Discussion restricted to
          </span>
          <span style={{ fontSize:'12px', fontWeight:700, color:'#000000' }}>
            {TOPIC.name}
          </span>
          <span style={{ fontSize:'11px', fontWeight:700, padding:'1px 7px', borderRadius:'3px',
            background:'#F0F0F0', border:'1px solid #E0E0E0', color:'#555555' }}>
            {TOPIC.gap}
          </span>
          <span style={{ marginLeft:'auto', fontSize:'11px', color:'#AAAAAA', fontWeight:500 }}>
            {TOPIC.course}
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'10px 14px',
          display:'flex', flexDirection:'column', gap:'8px' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display:'flex',
              justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
              alignItems:'flex-end', gap:'6px' }}>
              {msg.from === 'master' && (
                <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#222222',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'8px', fontWeight:700, color:'#fff', flexShrink:0 }}>
                  {MASTER.initials}
                </div>
              )}
              <div style={{
                maxWidth:'68%', padding:'8px 12px', borderRadius:'10px',
                fontSize:'13px', lineHeight:1.55, fontWeight:500,
                borderBottomRightRadius: msg.from === 'me'     ? '3px' : '10px',
                borderBottomLeftRadius:  msg.from === 'master' ? '3px' : '10px',
                background: msg.from === 'me' ? '#000000' : '#F2F2F2',
                color:      msg.from === 'me' ? '#ffffff'  : '#000000',
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}/>
        </div>

        {/* Input bar */}
        <div style={{ padding:'9px 12px', borderTop:'1px solid #F0F0F0',
          display:'flex', gap:'7px', flexShrink:0, background:'#fff' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask about ${TOPIC.name}…`}
            className="chat-input"
            style={{ flex:1, height:'36px', borderRadius:'7px', border:'1px solid #E2E2E2',
              padding:'0 12px', fontSize:'13px', outline:'none', fontFamily:'inherit',
              transition:'border-color 0.12s', fontWeight:500 }}
            onBlur={e => (e.currentTarget.style.borderColor = '#E2E2E2')}
          />
          <button onClick={sendMessage}
            style={{ width:'36px', height:'36px', borderRadius:'7px', background:'#000000',
              border:'none', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', flexShrink:0 }}>
            <Send size={13} stroke="#ffffff" strokeWidth={2.5}/>
          </button>
        </div>
      </div>
    </div>
  );
}
