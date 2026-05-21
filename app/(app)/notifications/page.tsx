'use client';
import { useState } from 'react';
import { FileText, Megaphone, Star, Bell, Users } from 'lucide-react';

type NotifType = 'Assignment' | 'Announcement' | 'Grade' | 'System' | 'Collaboration';
type Filter    = 'All' | NotifType;

interface Notif {
  id: number; type: NotifType; title: string; body: string;
  course: string; time: string; read: boolean;
  icon: React.ReactNode;
}

const INITIAL_NOTIFS: Notif[] = [
  { id:1,  type:'Assignment',    title:'Assignment Due Soon',    body:'Double Integration Project is due in 5 days',           course:'Calculus II',    time:'2h ago',  read:false, icon:<FileText  size={15} strokeWidth={1.5}/> },
  { id:2,  type:'Announcement',  title:'New Announcement',       body:'Prof. Martinez posted: "Office Hours Moved This Week"', course:'Calculus II',    time:'3h ago',  read:false, icon:<Megaphone size={15} strokeWidth={1.5}/> },
  { id:3,  type:'Grade',         title:'Grade Posted',           body:'You received 92/100 on Normalization to 3NF',           course:'COSC-3312',      time:'5h ago',  read:false, icon:<Star      size={15} strokeWidth={1.5}/> },
  { id:4,  type:'Assignment',    title:'Overdue Assignment',     body:'PO Ch. 4 was due Apr 20 at 10am',                      course:'HIST-1301',      time:'6h ago',  read:false, icon:<FileText  size={15} strokeWidth={1.5}/> },
  { id:5,  type:'Announcement',  title:'Quiz Reminder',          body:'Week Fourteen Quiz is live — closes Friday 11:59pm',   course:'COSC-3312',      time:'1d ago',  read:true,  icon:<Megaphone size={15} strokeWidth={1.5}/> },
  { id:6,  type:'System',        title:'Welcome to Nous',        body:'Your Spring 2026 courses are now available',           course:'Nous Platform',  time:'2d ago',  read:true,  icon:<Bell      size={15} strokeWidth={1.5}/> },
  { id:7,  type:'Grade',         title:'Grade Posted',           body:'You received 88/100 on SQL Queries – Joins',           course:'COSC-3312',      time:'3d ago',  read:true,  icon:<Star      size={15} strokeWidth={1.5}/> },
  { id:8,  type:'Assignment',    title:'New Assignment Added',   body:'Midterm Oral Exam Preparation has been posted',        course:'FREN-1311',      time:'4d ago',  read:true,  icon:<FileText  size={15} strokeWidth={1.5}/> },
  { id:9,  type:'Collaboration', title:'Peer Match Available',   body:'Sarah J. is available to help with Limits & Continuity', course:'Collaboration', time:'5d ago',  read:true,  icon:<Users     size={15} strokeWidth={1.5}/> },
  { id:10, type:'Grade',         title:'Grade Posted',           body:'You received 95/100 on HTML Structure – Personal Page', course:'COSC-2327',     time:'1w ago',  read:true,  icon:<Star      size={15} strokeWidth={1.5}/> },
];

const FILTERS: Filter[] = ['All','Assignment','Announcement','Grade','System','Collaboration'];

export default function Notifications() {
  const [notifs,       setNotifs]      = useState(INITIAL_NOTIFS);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const markRead    = (id: number) => setNotifs(p => p.map(n => n.id === id ? {...n, read:true} : n));
  const markAllRead = () => setNotifs(p => p.map(n => ({...n, read:true})));

  const filtered    = activeFilter === 'All' ? notifs : notifs.filter(n => n.type === activeFilter);
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="w-full" style={{ maxWidth:'700px' }}>
      <style>{`
        .notif-card {
          background: #fff;
          border: 1px solid #E2E2E2;
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.15s;
          cursor: pointer;
        }
        .notif-card:hover { border-color: #888888; }
        .notif-card.unread { border-left: 3px solid #000000; }
        .filter-btn { cursor:pointer; transition: color 0.12s, border-color 0.12s; background:none; border:none; }
        .mark-all-btn:hover { border-color: #888888 !important; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
        <div>
          <h1 style={{ fontSize:'26px', fontWeight:800, color:'#000000',
            letterSpacing:'-0.04em', margin:'0 0 6px' }}>Notifications</h1>
          {unreadCount > 0 && (
            <div style={{ fontSize:'14px', color:'#888888', fontWeight:500 }}>
              {unreadCount} unread
            </div>
          )}
        </div>
        <button className="mark-all-btn" onClick={markAllRead}
          style={{ background:'#fff', border:'1px solid #E2E2E2', borderRadius:'8px',
            padding:'8px 16px', fontSize:'13px', color:'#000000', fontWeight:600,
            cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
            transition:'border-color 0.15s', letterSpacing:'-0.01em' }}>
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0', marginBottom:'22px', borderBottom:'1px solid #E2E2E2' }}>
        {FILTERS.map(f => (
          <button key={f} className="filter-btn" onClick={() => setActiveFilter(f)}
            style={{ padding:'9px 16px', fontSize:'13px', fontWeight: f === activeFilter ? 700 : 500,
              color: f === activeFilter ? '#000000' : '#AAAAAA',
              borderBottom: f === activeFilter ? '2.5px solid #000000' : '2.5px solid transparent',
              marginBottom:'-1px', letterSpacing:'-0.01em' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'56px 20px' }}>
            <Bell size={36} stroke="#DDDDDD" strokeWidth={1.5} style={{ margin:'0 auto 14px', display:'block' }}/>
            <div style={{ fontSize:'15px', color:'#AAAAAA', fontWeight:600 }}>
              No {activeFilter.toLowerCase()} notifications
            </div>
          </div>
        ) : filtered.map(n => (
          <div key={n.id} className={`notif-card${!n.read ? ' unread' : ''}`}
            onClick={() => markRead(n.id)}
            style={{ padding:'16px 18px', display:'flex', alignItems:'flex-start', gap:'13px',
              opacity: n.read ? 0.60 : 1 }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'7px',
              background:'#F5F5F5', border:'1px solid #E8E8E8',
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, color:'#444444' }}>
              {n.icon}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'14px', fontWeight: n.read ? 500 : 700,
                color:'#000000', marginBottom:'3px', letterSpacing:'-0.01em' }}>
                {n.title}
              </div>
              <div style={{ fontSize:'13px', color:'#555555', fontWeight:500, marginBottom:'4px', lineHeight:1.5 }}>
                {n.body}
              </div>
              <div style={{ fontSize:'12px', color:'#AAAAAA', fontWeight:500 }}>{n.course}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px', flexShrink:0 }}>
              <span style={{ fontSize:'12px', color:'#AAAAAA', fontWeight:500, whiteSpace:'nowrap' }}>
                {n.time}
              </span>
              {!n.read && (
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#000000' }}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
