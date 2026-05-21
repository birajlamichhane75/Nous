'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Megaphone } from 'lucide-react';
import { getCourse } from '@/lib/data';

export default function AnnouncementsPage() {
  const { 'course-id': courseId } = useParams<{ 'course-id': string }>();
  const course = getCourse(courseId);

  if (!course) {
    return (
      <div className="w-full flex items-center justify-center min-h-[40vh]">
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>📢</div>
          <h2 style={{ fontSize:'18px', fontWeight:600, color:'#111827', marginBottom:'8px' }}>
            Course not found
          </h2>
          <Link href="/dashboard" style={{ color:'#2563EB', fontSize:'14px', textDecoration:'none' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ maxWidth:'680px' }}>
      <style>{`
        .ann-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          padding: 18px 20px;
        }
      `}</style>

      <Link href="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:'5px',
        fontSize:'13px', color:'#6B7280', textDecoration:'none', marginBottom:'20px' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
        <ChevronLeft size={14} strokeWidth={2}/> Dashboard
      </Link>

      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
        <Megaphone size={20} stroke="#9CA3AF" strokeWidth={1.5}/>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'#111827',
          letterSpacing:'-0.02em', margin:0 }}>
          {course.name} — Announcements
        </h1>
      </div>
      <div style={{ fontSize:'13px', color:'#9CA3AF', marginBottom:'24px' }}>
        {course.code} · {course.instructor}
      </div>

      {course.announcements.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
          <div style={{ fontSize:'16px', fontWeight:600, color:'#111827', marginBottom:'6px' }}>
            No announcements yet
          </div>
          <div style={{ fontSize:'14px', color:'#9CA3AF' }}>Check back soon.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {course.announcements.map(a => (
            <div key={a.id} className="ann-card">
              <div style={{ display:'flex', alignItems:'center',
                justifyContent:'space-between', marginBottom:'10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <Megaphone size={14} stroke="#6B7280" strokeWidth={1.5}/>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#111827' }}>
                    {a.instructor}
                  </span>
                </div>
                <span style={{ fontSize:'12px', color:'#9CA3AF' }}>{a.date}</span>
              </div>
              <div style={{ fontSize:'15px', fontWeight:600, color:'#111827',
                marginBottom:'8px', letterSpacing:'-0.01em' }}>
                {a.title}
              </div>
              <div style={{ fontSize:'13px', color:'#6B7280', lineHeight:'1.6',
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical',
                overflow:'hidden' } as React.CSSProperties}>
                {a.body}
              </div>
              <button style={{ marginTop:'10px', background:'none', border:'none',
                cursor:'pointer', fontSize:'13px', color:'#2563EB', padding:0, fontWeight:500 }}>
                Read more
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
