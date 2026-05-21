'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { COURSES } from '@/lib/data';
import { CourseBanner } from '@/components/CourseBanner';

export default function AllAssignments() {
  return (
    <div className="w-full">
      <style>{`
        .ac-card {
          background: #fff;
          border: 1px solid #E2E2E2;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: border-color 0.15s, box-shadow 0.15s;
          text-decoration: none;
          display: block;
        }
        .ac-card:hover {
          border-color: #888888;
          box-shadow: 0 3px 10px rgba(0,0,0,0.09);
        }
      `}</style>

      <div style={{ marginBottom:'32px' }}>
        <h1 style={{ fontSize:'26px', fontWeight:800, color:'#000000',
          letterSpacing:'-0.04em', margin:'0 0 6px' }}>My Courses</h1>
        <p style={{ margin:0, fontSize:'15px', color:'#666666', fontWeight:500 }}>
          {COURSES.length} active courses · Spring 2026
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
        {COURSES.map(c => (
          <Link key={c.id} href={`/assignments/${c.id}`} className="ac-card">
            <div style={{ height:'96px', position:'relative' }}>
              <CourseBanner id={c.id}/>
              {c.complete && (
                <span style={{ position:'absolute', top:'8px', left:'10px',
                  background:'rgba(0,0,0,0.65)', color:'rgba(255,255,255,0.85)',
                  fontSize:'10px', fontWeight:700, padding:'2px 8px',
                  borderRadius:'3px', letterSpacing:'0.03em' }}>
                  Complete
                </span>
              )}
            </div>
            <div style={{ padding:'14px 16px 16px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, color:'#AAAAAA',
                textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'4px' }}>
                {c.code}
              </div>
              <div style={{ fontSize:'15px', fontWeight:700, color:'#000000',
                lineHeight:1.3, marginBottom:'4px', letterSpacing:'-0.01em' }}>
                {c.name}
              </div>
              <div style={{ fontSize:'13px', color:'#777777', fontWeight:500, marginBottom:'12px' }}>
                {c.instructor}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'13px', color:'#888888', fontWeight:500 }}>
                  {c.done}/{c.total} assignments
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:'2px',
                  fontSize:'13px', color:'#000000', fontWeight:600 }}>
                  Open <ChevronRight size={13} strokeWidth={2.5}/>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
