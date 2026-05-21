'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Download, FileText, Presentation, Archive } from 'lucide-react';
import { getCourse } from '@/lib/data';
import type { FileType } from '@/lib/data';

const FILE_STYLES: Record<FileType, { color: string; label: string }> = {
  PDF:  { color:'#DC2626', label:'PDF'  },
  DOCX: { color:'#2563EB', label:'DOC'  },
  PPTX: { color:'#D97706', label:'PPT'  },
  ZIP:  { color:'#6B7280', label:'ZIP'  },
};

function FileIcon({ type }: { type: FileType }) {
  const { color } = FILE_STYLES[type];
  const icons = {
    PDF:  <FileText    size={18} stroke={color} strokeWidth={1.5}/>,
    DOCX: <FileText    size={18} stroke={color} strokeWidth={1.5}/>,
    PPTX: <Presentation size={18} stroke={color} strokeWidth={1.5}/>,
    ZIP:  <Archive     size={18} stroke={color} strokeWidth={1.5}/>,
  };
  return (
    <div style={{ width:'38px', height:'38px', borderRadius:'5px',
      background:'#F9FAFB', border:'1px solid #E5E7EB',
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {icons[type]}
    </div>
  );
}

export default function FilesPage() {
  const { 'course-id': courseId } = useParams<{ 'course-id': string }>();
  const course = getCourse(courseId);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (filename: string) => {
    setToast(`Download started — ${filename}`);
    setTimeout(() => setToast(null), 3000);
  };

  if (!course) {
    return (
      <div className="w-full flex items-center justify-center min-h-[40vh]">
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>📁</div>
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
    <div className="w-full">
      <style>{`
        .file-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: border-color 0.15s, box-shadow 0.15s;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .file-card:hover { border-color: #9CA3AF; box-shadow: 0 3px 8px rgba(0,0,0,0.10); }
        .dl-btn { transition: border-color 0.15s, color 0.15s; }
        .dl-btn:hover { border-color: #2563EB !important; color: #2563EB !important; }
      `}</style>

      <Link href="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:'5px',
        fontSize:'13px', color:'#6B7280', textDecoration:'none', marginBottom:'20px' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
        <ChevronLeft size={14} strokeWidth={2}/> Dashboard
      </Link>

      <h1 style={{ fontSize:'22px', fontWeight:700, color:'#111827',
        letterSpacing:'-0.02em', margin:'0 0 4px' }}>
        {course.name} — Files
      </h1>
      <div style={{ fontSize:'13px', color:'#9CA3AF', marginBottom:'24px' }}>
        {course.code} · {course.files.length} files
      </div>

      {course.files.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>📂</div>
          <div style={{ fontSize:'16px', fontWeight:600, color:'#111827', marginBottom:'6px' }}>
            No files uploaded yet
          </div>
          <div style={{ fontSize:'14px', color:'#9CA3AF' }}>Check back soon.</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
          {course.files.map(file => (
            <div key={file.id} className="file-card">
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <FileIcon type={file.type}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px', fontWeight:600, color:'#111827',
                    lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize:'11px', color:'#9CA3AF', marginTop:'2px' }}>
                    {file.size} · {file.date}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:'11px', fontWeight:600,
                  color: FILE_STYLES[file.type].color,
                  border:`1px solid ${FILE_STYLES[file.type].color}`,
                  padding:'1px 7px', borderRadius:'3px', opacity:0.9 }}>
                  {FILE_STYLES[file.type].label}
                </span>
                <button className="dl-btn" onClick={() => showToast(file.name)}
                  style={{ display:'flex', alignItems:'center', gap:'4px',
                    background:'#fff', border:'1px solid #E5E7EB', borderRadius:'5px',
                    padding:'5px 10px', fontSize:'12px', fontWeight:500,
                    color:'#6B7280', cursor:'pointer' }}>
                  <Download size={12} strokeWidth={2}/> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div style={{ position:'fixed', bottom:'24px', right:'24px', background:'#111827',
          color:'white', padding:'10px 16px', borderRadius:'6px', fontSize:'13px',
          fontWeight:500, boxShadow:'0 4px 12px rgba(0,0,0,0.15)', zIndex:9999 }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
