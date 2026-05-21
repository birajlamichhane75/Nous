'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Megaphone, FileText, Folder, MoreHorizontal, ChevronRight,
  X, BookOpen, Upload, CheckCircle2,
} from 'lucide-react';
import { COURSES } from '@/lib/data';
import { CourseBanner } from '@/components/CourseBanner';

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const UPCOMING = [
  { id:'math-2414-7',  code:'MATH-2414', title:'Double Integration Project',    due:'Nov 15', status:'In Session'  as const, pts:'100 pts' },
  { id:'hist-1301-6',  code:'HIST-1301', title:'PO Ch. 4: Global Visions',      due:'Apr 20', status:'Due Soon'    as const, pts:'100 pts' },
  { id:'cosc-2327-5',  code:'COSC-2327', title:'Scripting Frameworks Survey',   due:'Apr 27', status:'Not Started' as const, pts:'50 pts'  },
  { id:'fren-1311-7',  code:'FREN-1311', title:'Assignment to be Uploaded',     due:'Apr 21', status:'Not Started' as const, pts:'75 pts'  },
];

const TODO_DATA = [
  { key:0, icon:<FileText size={15} strokeWidth={1.5}/>,  title:'PO Ch. 4: "Global Visions"',              course:'HIST-1301', due:'Apr 20 · 10:00 am', overdue:true,  workspaceId:'hist-1301-6'  },
  { key:1, icon:<Megaphone size={15} strokeWidth={1.5}/>, title:'Week Fourteen — Quiz Announcement',        course:'COSC-3312', due:'Apr 20 · 11:05 am', overdue:true,  workspaceId:'cosc-3312-6'  },
  { key:2, icon:<Upload size={15} strokeWidth={1.5}/>,    title:'Assignment to be uploaded on Nous',        course:'FREN-1311', due:'Apr 21 · 10:44 am', overdue:false, workspaceId:'fren-1311-7'  },
  { key:3, icon:<FileText size={15} strokeWidth={1.5}/>,  title:'Scripting Frameworks survey',              course:'COSC-2327', due:'Apr 27 · 1:15 pm',  overdue:false, workspaceId:'cosc-2327-5'  },
  { key:4, icon:<BookOpen size={15} strokeWidth={1.5}/>,  title:'Final Exam Preparation Quiz',              course:'MATH-2414', due:'Apr 28 · 11:59 pm', overdue:false, workspaceId:'math-2414-6'  },
];

const MENU_ITEMS = (id: string) => [
  { label:'View Assignments', href:`/assignments/${id}` },
  { label:'Course Files',     href:`/files/${id}` },
  { label:'Announcements',    href:`/announcements/${id}` },
  { label:'Mark as Favorite', href:null },
  { label:'Mute Notifications', href:null },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [openMenu, setOpenMenu]  = useState<string | null>(null);
  const [todos, setTodos]        = useState(TODO_DATA);
  const [dismissing, setDismiss] = useState<Set<number>>(new Set());
  const [toast, setToast]        = useState<string | null>(null);
  const upcomingRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setOpenMenu(null);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const dismissTodo = (key: number) => {
    setDismiss(p => new Set([...p, key]));
    setTimeout(() => {
      setTodos(p => p.filter(t => t.key !== key));
      setDismiss(p => { const s = new Set(p); s.delete(key); return s; });
    }, 280);
  };

  const activeCourses = COURSES.length;
  const dueCount      = UPCOMING.filter(a => a.status === 'Due Soon' || a.status === 'In Session').length;

  return (
    <div style={{ width:'100%' }}>
      <style>{`
        @keyframes dismissRow {
          from { opacity:1; max-height:90px; padding-top:12px; padding-bottom:12px; }
          to   { opacity:0; max-height:0;    padding-top:0;    padding-bottom:0; overflow:hidden; }
        }
        .dash-layout {
          display: grid;
          grid-template-columns: 1fr 264px;
          gap: 0;
        }
        .dash-main  { min-width:0; padding-right:36px; }
        .dash-aside {
          border-left: 1px solid #E5E7EB;
          padding-left: 28px;
          position: sticky;
          top: 0;
          max-height: 100vh;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .dash-aside::-webkit-scrollbar { display:none; }

        /* Course grid — 3 col default, collapses on smaller screens */
        .course-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }

        /* Course card */
        .c-card {
          border: 1px solid #999999;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        .c-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.14); }
        .c-card .c-menu { opacity:0; transition:opacity 0.15s; }
        .c-card:hover .c-menu { opacity:1; }
        .c-icon:hover { background:#EBEBEB !important; }

        /* Sectional nav pills */
        .nav-pill { transition: background 0.12s, border-color 0.12s; }
        .nav-pill:hover { background:#F3F4F6 !important; border-color:#9CA3AF !important; }

        /* Upcoming rows */
        .up-row { transition:background 0.12s; }
        .up-row:hover { background:#F9FAFB; }

        /* Sidebar to-do */
        .td-row { transition:background 0.12s; cursor:pointer; }
        .td-row:hover { background:#F9FAFB; border-radius:5px; }
        .td-dismiss { animation:dismissRow 0.28s ease forwards; }

        /* Dropdown */
        .dd { background:#fff; border:1px solid #E5E7EB; border-radius:8px; box-shadow:0 6px 16px rgba(0,0,0,0.10); overflow:hidden; min-width:178px; }
        .dd-item { display:block; padding:10px 15px; font-size:14px; color:#111827; cursor:pointer; text-decoration:none; white-space:nowrap; font-weight:500; }
        .dd-item:hover { background:#F3F4F6; }

        /* Responsive */
        @media (max-width:1080px) {
          .dash-layout { grid-template-columns:1fr; }
          .dash-main { padding-right:0; }
          .dash-aside { border-left:none; border-top:1px solid #E5E7EB; padding-left:0; padding-top:28px; margin-top:28px; position:static; max-height:none; }
        }
        @media (max-width:840px) { .course-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media (max-width:500px) { .course-grid { grid-template-columns:1fr !important; } .up-meta { display:none; } }
      `}</style>

      {/* ── SECTIONAL NAV ───────────────────────────────────────────────────── */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'28px' }}>
        {[
          { label:'ASSIGNMENTS',   active:true,  action:() => router.push('/assignments')   },
          { label:'ANNOUNCEMENTS', active:false, action:() => router.push('/notifications') }
        ].map(({ label, active, action }) => (
          <button key={label}
            className={active ? '' : 'nav-pill'}
            onClick={action}
            style={{
              padding: '11px 26px',
              borderRadius: '50px',
              border: active ? 'none' : '1.5px solid #D1D5DB',
              background: active ? '#111827' : '#FFFFFF',
              color: active ? '#FFFFFF' : '#4B5563',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              boxShadow: active ? '0 3px 10px rgba(0,0,0,0.22)' : 'none',
              fontFamily: 'inherit',
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="dash-layout">

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <div className="dash-main" style={{ display:'flex', flexDirection:'column', gap:'40px' }}>

          {/* MY COURSES */}
          <section>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
              <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#111827' }}>My Courses</h2>
              <Link href="/assignments" style={{ fontSize:'14px', color:'#2563EB', display:'flex', alignItems:'center', gap:'3px', textDecoration:'none', fontWeight:600 }}>
                All courses <ChevronRight size={14} strokeWidth={2.5}/>
              </Link>
            </div>

            <div className="course-grid">
              {COURSES.map((c, idx) => (
                <div key={c.id} className="c-card" onClick={() => router.push(`/assignments/${c.id}`)}>

                  {/* ── Banner with course name overlay ── */}
                  <div style={{ height:'170px', position:'relative' }}>
                    <CourseBanner id={c.id}/>

                    {/* Gradient fade-to-bottom + course name */}
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)', display:'flex', alignItems:'flex-end', padding:'14px 14px 12px' }}>
                      <div style={{ fontSize:'18px', fontWeight:800, color:'#FFFFFF', lineHeight:1.15, letterSpacing:'-0.02em', textShadow:'0 1px 6px rgba(0,0,0,0.45)' }}>
                        {c.name}
                      </div>
                    </div>

                    {/* Complete badge */}
                    {c.complete && (
                      <span style={{ position:'absolute', top:'10px', left:'11px', background:'rgba(0,0,0,0.65)', color:'#86EFAC', fontSize:'11px', fontWeight:700, padding:'3px 9px', borderRadius:'4px', letterSpacing:'0.04em' }}>
                        Complete
                      </span>
                    )}

                    {/* Three-dot menu */}
                    <div className="c-menu" style={{ position:'absolute', top:'10px', right:'10px', zIndex:10 }}
                      onMouseDown={e => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }}>
                      <div style={{ width:'28px', height:'28px', borderRadius:'6px', background:'rgba(0,0,0,0.50)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <MoreHorizontal size={15} stroke="rgba(255,255,255,0.90)" strokeWidth={2}/>
                      </div>
                      {openMenu === c.id && (
                        <div className="dd" style={{ position:'absolute', top:'32px', right:0, zIndex:50 }}>
                          {MENU_ITEMS(c.id).map(item => (
                            item.href
                              ? <Link key={item.label} href={item.href} className="dd-item" onClick={e => e.stopPropagation()}>{item.label}</Link>
                              : <div key={item.label} className="dd-item" onClick={e => { e.stopPropagation(); setOpenMenu(null); showToast(`${item.label} updated`); }}>{item.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div style={{ padding:'11px 14px 0' }}>
                    <div style={{ fontSize:'12px', fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'3px' }}>
                      {c.code}
                    </div>
                    <div style={{ fontSize:'14px', fontWeight:500, color:'#374151' }}>
                      {c.instructor}
                    </div>
                  </div>

                  {/* ── Card footer ── */}
                  <div style={{ margin:'10px 14px 12px', paddingTop:'10px', borderTop:'1px solid #EBEBEB', display:'flex', justifyContent:'space-between', alignItems:'center' }}
                    onClick={e => e.stopPropagation()}>
                    <div style={{ display:'flex', gap:'5px' }}>
                      {[
                        {
                          icon: <Megaphone size={14} stroke="#6B7280" strokeWidth={1.5}/>,
                          // only first course shows the count number; others get a dot
                          badge: idx === 0 ? (c.ann || undefined) : undefined,
                          dot:   idx > 0 && c.ann > 0,
                          href: `/announcements/${c.id}`,
                        },
                        { icon:<FileText size={14} stroke="#6B7280" strokeWidth={1.5}/>, badge:undefined, dot:false, href:`/assignments/${c.id}` },
                        { icon:<Folder   size={14} stroke="#6B7280" strokeWidth={1.5}/>, badge:undefined, dot:false, href:`/files/${c.id}`        },
                      ].map(({ icon, badge, dot, href }, i) => (
                        <div key={i} className="c-icon"
                          style={{ position:'relative', width:'30px', height:'30px', borderRadius:'6px', background:'#F4F4F5', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                          onClick={() => router.push(href)}>
                          {icon}
                          {badge ? (
                            <div style={{ position:'absolute', top:'-4px', right:'-4px', width:'16px', height:'16px', borderRadius:'50%', background:'#DC2626', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:800, color:'#fff' }}>
                              {badge > 9 ? '9+' : badge}
                            </div>
                          ) : dot ? (
                            <div style={{ position:'absolute', top:'-2px', right:'-2px', width:'8px', height:'8px', borderRadius:'50%', background:'#DC2626', border:'2px solid #fff' }}/>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:600, color:'#374151' }}>
                      {c.done}/{c.total} mastered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* UPCOMING */}
          <section ref={upcomingRef}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
              <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#111827' }}>Upcoming</h2>
              <Link href="/assignments" style={{ fontSize:'14px', color:'#2563EB', display:'flex', alignItems:'center', gap:'3px', textDecoration:'none', fontWeight:600 }}>
                View all <ChevronRight size={14} strokeWidth={2.5}/>
              </Link>
            </div>

            <div style={{ border:'1.5px solid #E5E7EB', borderRadius:'8px', overflow:'hidden' }}>
              {UPCOMING.map((a, i) => {
                const statusColor =
                  a.status === 'In Session' ? '#2563EB' :
                  a.status === 'Due Soon'   ? '#DC2626' : '#6B7280';
                return (
                  <Link key={i} href={`/workspace/${a.id}`} style={{ textDecoration:'none' }}>
                    <div className="up-row" style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 18px', background:'#fff', borderBottom: i < UPCOMING.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'15px', fontWeight:600, color:'#111827', lineHeight:1.35, marginBottom:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {a.title}
                        </div>
                        <div style={{ fontSize:'13px', color:'#6B7280', fontWeight:500 }}>{a.code}</div>
                      </div>
                      <div className="up-meta" style={{ display:'flex', alignItems:'center', gap:'20px', flexShrink:0 }}>
                        <span style={{ fontSize:'13px', color:'#4B5563', fontWeight:500 }}>{a.pts}</span>
                        <span style={{ fontSize:'13px', color:'#4B5563', fontWeight:500, minWidth:'46px', textAlign:'right' }}>{a.due}</span>
                        <span style={{ fontSize:'12px', fontWeight:700, color:statusColor, border:`1.5px solid ${statusColor}`, padding:'3px 10px', borderRadius:'4px', whiteSpace:'nowrap', minWidth:'84px', textAlign:'center', letterSpacing:'0.02em' }}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside className="dash-aside">

          {/* Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'#E5E7EB', border:'1.5px solid #E5E7EB', borderRadius:'8px', overflow:'hidden', marginBottom:'24px' }}>
            {[
              { val: String(activeCourses), label:'Active Courses', action: () => router.push('/assignments') },
              { val: String(dueCount),      label:'Due This Week',  action: () => upcomingRef.current?.scrollIntoView({ behavior:'smooth' }) },
            ].map((s, i) => (
              <button key={i} onClick={s.action} style={{ background:'#fff', border:'none', cursor:'pointer', padding:'18px 16px', textAlign:'left', display:'block', fontFamily:'inherit' }}>
                <div style={{ fontSize:'28px', fontWeight:800, color:'#111827', lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:'13px', color:'#6B7280', marginTop:'5px', lineHeight:1.3, fontWeight:500 }}>{s.label}</div>
              </button>
            ))}
          </div>

          {/* University branding — clean text only, no shield */}
          <div style={{ paddingBottom:'20px', marginBottom:'20px', borderBottom:'1px solid #EBEBEB' }}>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#111827', letterSpacing:'-0.02em' }}>
              Huston-Tillotson University
            </div>
            
          </div>

          {/* To Do */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
            <div>
              <h2 style={{ margin:0, fontSize:'15px', fontWeight:700, color:'#111827' }}>To Do</h2>
              <div style={{ fontSize:'12px', color:'#9CA3AF', marginTop:'2px', fontWeight:500 }}>learning sessions</div>
            </div>
            <span style={{ fontSize:'13px', color:'#6B7280', fontWeight:600, marginTop:'2px' }}>{todos.length}</span>
          </div>

          <div>
            {todos.map(item => (
              <div key={item.key}
                className={`td-row${dismissing.has(item.key) ? ' td-dismiss' : ''}`}
                style={{ display:'flex', gap:'10px', padding:'12px 4px', borderBottom:'1px solid #F3F4F6', position:'relative' }}
                onClick={() => router.push(`/workspace/${item.workspaceId}`)}>
                <div style={{ color:'#6B7280', flexShrink:0, marginTop:'2px' }}>{item.icon}</div>
                <div style={{ flex:1, minWidth:0, paddingRight:'18px' }}>
                  <div style={{ fontSize:'14px', fontWeight:600, color:'#111827', lineHeight:1.35, marginBottom:'3px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' } as React.CSSProperties}>
                    {item.title}
                  </div>
                  <div style={{ fontSize:'13px', color:'#6B7280', marginBottom:'2px', fontWeight:500 }}>{item.course}</div>
                  <div style={{ fontSize:'13px', fontWeight:600, color: item.overdue ? '#DC2626' : '#4B5563' }}>
                    {item.due}
                  </div>
                </div>
                <button
                  style={{ position:'absolute', top:'12px', right:'2px', background:'none', border:'none', cursor:'pointer', color:'#D1D5DB', padding:0 }}
                  onClick={e => { e.stopPropagation(); dismissTodo(item.key); }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#9CA3AF')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#D1D5DB')}>
                  <X size={13} strokeWidth={2}/>
                </button>
              </div>
            ))}

            {todos.length === 0 && (
              <div style={{ paddingTop:'28px', textAlign:'center', color:'#6B7280', fontSize:'14px' }}>
                <CheckCircle2 size={24} stroke="#22C55E" strokeWidth={1.5} style={{ margin:'0 auto 8px', display:'block' }}/>
                All caught up!
              </div>
            )}
          </div>

          <div style={{ paddingTop:'16px' }}>
            <Link href="/assignments" style={{ fontSize:'14px', color:'#2563EB', display:'flex', alignItems:'center', gap:'3px', textDecoration:'none', fontWeight:600 }}>
              View all <ChevronRight size={14} strokeWidth={2.5}/>
            </Link>
          </div>
        </aside>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position:'fixed', bottom:'24px', right:'24px', background:'#111827', color:'#fff', padding:'12px 18px', borderRadius:'8px', fontSize:'14px', fontWeight:500, boxShadow:'0 4px 16px rgba(0,0,0,0.18)', zIndex:9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
