'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Circle } from 'lucide-react';
import { getCourse } from '@/lib/data';
import type { Assignment } from '@/lib/data';
import { CourseBanner } from '@/components/CourseBanner';

function StatusBadge({ status }: { status: Assignment['status'] }) {
  const map: Record<Assignment['status'], { color: string; bg: string; border: string; borderStyle: string }> = {
    'Completed':   { color:'#FFFFFF', bg:'#111111', border:'#111111', borderStyle:'solid'  },
    'In Progress': { color:'#111111', bg:'#FFFFFF', border:'#111111', borderStyle:'solid'  },
    'Not Started': { color:'#888888', bg:'#F5F5F5', border:'#DDDDDD', borderStyle:'solid'  },
  };
  const s = map[status];
  return (
    <span style={{ fontSize:'11px', fontWeight:700, color:s.color,
      background:s.bg, border:`1px ${s.borderStyle} ${s.border}`,
      padding:'3px 9px', borderRadius:'4px', flexShrink:0, whiteSpace:'nowrap' }}>
      {status}
    </span>
  );
}

function StatusIcon({ status }: { status: Assignment['status'] }) {
  if (status === 'Completed')   return <CheckCircle2 size={17} stroke="#000000" strokeWidth={2}/>;
  if (status === 'In Progress') return <Clock size={17} stroke="#555555" strokeWidth={2}/>;
  return <Circle size={17} stroke="#CCCCCC" strokeWidth={1.5}/>;
}

export default function CourseAssignments() {
  const { 'course-id': courseId } = useParams<{ 'course-id': string }>();
  const course = getCourse(courseId);

  if (!course) {
    return (
      <div className="w-full flex items-center justify-center min-h-[40vh]">
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>📚</div>
          <h2 style={{ fontSize:'20px', fontWeight:700, color:'#000000', marginBottom:'8px' }}>Course not found</h2>
          <Link href="/assignments" style={{ color:'#555555', fontSize:'14px', textDecoration:'none', fontWeight:500 }}>
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .asgn-row {
          background: #fff;
          border: 1px solid #E2E2E2;
          border-radius: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .asgn-row-active:hover {
          border-color: #888888;
          box-shadow: 0 3px 10px rgba(0,0,0,0.09);
        }
      `}</style>

      {/* Back link */}
      <Link href="/assignments"
        style={{ display:'inline-flex', alignItems:'center', gap:'5px',
          fontSize:'13px', color:'#888888', textDecoration:'none', marginBottom:'24px',
          fontWeight:500, transition:'color 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#000000')}
        onMouseLeave={e => (e.currentTarget.style.color = '#888888')}>
        <ChevronLeft size={14} strokeWidth={2}/> All Courses
      </Link>

      {/* Course header */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'8px' }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'8px', overflow:'hidden',
          flexShrink:0, border:'1px solid #E2E2E2', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <CourseBanner id={course.id}/>
        </div>
        <div>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#AAAAAA',
            textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'4px' }}>
            {course.code}
          </div>
          <h1 style={{ fontSize:'24px', fontWeight:800, color:'#000000',
            letterSpacing:'-0.03em', margin:0, lineHeight:1.2 }}>
            {course.name}
          </h1>
        </div>
      </div>
      <div style={{ fontSize:'14px', color:'#777777', fontWeight:500, marginBottom:'28px' }}>
        {course.instructor} · {course.sem}
      </div>

      {/* Progress summary */}
      <div style={{ background:'#fff', border:'1px solid #E2E2E2', borderRadius:'10px',
        boxShadow:'0 1px 4px rgba(0,0,0,0.04)', padding:'16px 22px',
        display:'flex', gap:'36px', marginBottom:'22px', flexWrap:'wrap' }}>
        {[
          { label:'Completed', val:`${course.done} of ${course.total}` },
          { label:'Progress',  val:`${course.pct}%` },
          { label:'Instructor', val:course.instructor },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'#AAAAAA', marginBottom:'3px',
              textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {s.label}
            </div>
            <div style={{ fontSize:'16px', fontWeight:700, color:'#000000', letterSpacing:'-0.02em' }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {course.assignments.map(a => {
          const isClickable = a.status !== 'Completed';
          const inner = (
            <div className={`asgn-row${isClickable ? ' asgn-row-active' : ''}`}
              style={{ padding:'18px 20px', display:'flex', alignItems:'center', gap:'14px',
                opacity: a.status === 'Completed' ? 0.70 : 1,
                cursor: isClickable ? 'pointer' : 'default' }}>
              <StatusIcon status={a.status}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', gap:'12px', flexWrap:'wrap', marginBottom:'4px' }}>
                  <div style={{ fontSize:'15px', fontWeight:600, color:'#000000', lineHeight:1.3, letterSpacing:'-0.01em' }}>
                    {a.title}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                    <span style={{ fontSize:'12px', color:'#AAAAAA', fontWeight:500 }}>{a.points} pts</span>
                    <StatusBadge status={a.status}/>
                  </div>
                </div>
                <div style={{ fontSize:'13px', color:'#777777', lineHeight:1.5 }}>
                  {a.desc}
                </div>
                <div style={{ fontSize:'12px', color:'#AAAAAA', fontWeight:500, marginTop:'5px' }}>
                  Due: {a.due}
                </div>
              </div>
              {isClickable && <ChevronRight size={16} stroke="#CCCCCC" strokeWidth={2} style={{ flexShrink:0 }}/>}
            </div>
          );

          return isClickable ? (
            <Link key={a.id} href={`/workspace/${a.id}`} style={{ textDecoration:'none' }}>
              {inner}
            </Link>
          ) : (
            <div key={a.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
