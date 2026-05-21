'use client';
import { useState } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type TopicStatus = 'Mastered' | 'Building' | 'Gap Detected';
type DipCause    = 'hint_overuse' | 'skipped' | 'fewer_attempts' | 'inactive' | 'normal';

interface ProgressPoint {
  label:          string;
  mastery:        number;
  cause:          DipCause;
  hints:          number;
  examples:       number;
  tries:          number;
  timeSpent:      string;
  connectedTopics: string[];
  narrative:      string;
}

interface Topic {
  id:      string;
  title:   string;
  mastery: number;
  status:  TopicStatus;
  history: ProgressPoint[];
}

interface Subject {
  id:         string;
  name:       string;
  code:       string;
  instructor: string;
  topics:     Topic[];
}

interface InsightPoint {
  topicTitle: string;
  point:      ProgressPoint;
}

// ─── DATASET ──────────────────────────────────────────────────────────────────

const SUBJECTS: Subject[] = [
  {
    id: 'math-2414', name: 'Calculus II', code: 'MATH-2414',
    instructor: 'Prof. Martinez',
    topics: [
      {
        id: 'limits', title: 'Limits & Continuity',
        mastery: 84, status: 'Mastered',
        history: [
          { label: 'Wk 1', mastery: 22, cause: 'normal',         hints: 1, examples: 2, tries: 3, timeSpent: '18 min', connectedTopics: ['Sequences'],              narrative: 'Strong start. Consistent attempts with minimal hints.' },
          { label: 'Wk 2', mastery: 38, cause: 'normal',         hints: 2, examples: 3, tries: 5, timeSpent: '32 min', connectedTopics: ['Sequences','Functions'],  narrative: 'Steady progress. Examples helped bridge early gaps.' },
          { label: 'Wk 3', mastery: 51, cause: 'normal',         hints: 3, examples: 2, tries: 4, timeSpent: '28 min', connectedTopics: ['Derivatives'],            narrative: 'Building toward threshold. Teaching loop not yet needed.' },
          { label: 'Wk 4', mastery: 44, cause: 'inactive',       hints: 6, examples: 1, tries: 2, timeSpent: '9 min',  connectedTopics: ['Sequences'],              narrative: 'Level dropped. Topic was not opened for 9 days — recall decay is the primary cause.' },
          { label: 'Wk 5', mastery: 60, cause: 'normal',         hints: 2, examples: 4, tries: 6, timeSpent: '45 min', connectedTopics: ['Derivatives','Continuity'], narrative: 'Recovery session. More examples reviewed, strong re-engagement pattern.' },
          { label: 'Wk 6', mastery: 84, cause: 'normal',         hints: 1, examples: 2, tries: 7, timeSpent: '51 min', connectedTopics: ['Derivatives'],            narrative: 'Mastery confirmed. High attempt count with near-zero hint usage — genuine understanding.' },
        ],
      },
      {
        id: 'derivatives', title: 'Derivatives & Differentiation',
        mastery: 91, status: 'Mastered',
        history: [
          { label: 'Wk 4', mastery: 30, cause: 'normal',      hints: 2, examples: 3, tries: 4, timeSpent: '24 min', connectedTopics: ['Limits'],                  narrative: 'Initial exposure. Limits knowledge is providing a solid conceptual base.' },
          { label: 'Wk 5', mastery: 55, cause: 'normal',      hints: 3, examples: 4, tries: 6, timeSpent: '38 min', connectedTopics: ['Limits','Chain Rule'],     narrative: 'Good progress. Chain rule connections beginning to form.' },
          { label: 'Wk 6', mastery: 48, cause: 'hint_overuse',hints: 9, examples: 1, tries: 3, timeSpent: '22 min', connectedTopics: ['Chain Rule'],              narrative: 'Level dropped due to heavy hint reliance on chain rule applications. Understanding was surface-level.' },
          { label: 'Wk 7', mastery: 63, cause: 'normal',      hints: 3, examples: 5, tries: 7, timeSpent: '44 min', connectedTopics: ['Chain Rule','Product Rule'],narrative: 'Teaching loop activated. Switched to worked examples over hints — noticeably effective.' },
          { label: 'Wk 8', mastery: 78, cause: 'normal',      hints: 1, examples: 3, tries: 8, timeSpent: '58 min', connectedTopics: ['Integration'],             narrative: 'Strong session. Self-sufficient solving; integration connections starting to form.' },
          { label: 'Wk 9', mastery: 91, cause: 'normal',      hints: 0, examples: 2, tries: 9, timeSpent: '62 min', connectedTopics: ['Integration','Optimization'],narrative: 'Full mastery. Zero hint usage across maximum attempt count — deep understanding.' },
        ],
      },
      {
        id: 'integration', title: 'Integration Techniques',
        mastery: 69, status: 'Building',
        history: [
          { label: 'Wk 7',  mastery: 18, cause: 'normal',  hints: 2, examples: 4, tries: 3, timeSpent: '20 min', connectedTopics: ['Derivatives'],              narrative: 'First session. Derivatives knowledge is transferring well.' },
          { label: 'Wk 8',  mastery: 34, cause: 'normal',  hints: 4, examples: 3, tries: 5, timeSpent: '35 min', connectedTopics: ['Derivatives','Substitution'], narrative: 'Consistent growth. Substitution method starting to click.' },
          { label: 'Wk 9',  mastery: 42, cause: 'normal',  hints: 3, examples: 4, tries: 5, timeSpent: '40 min', connectedTopics: ['Substitution','By Parts'],   narrative: 'Steady progress. Integration by parts newly introduced.' },
          { label: 'Wk 10', mastery: 36, cause: 'skipped', hints: 5, examples: 0, tries: 2, timeSpent: '11 min', connectedTopics: ['By Parts'],                  narrative: 'Level dropped. Several problems were skipped before completion, blocking consolidation.' },
          { label: 'Wk 11', mastery: 52, cause: 'normal',  hints: 3, examples: 5, tries: 6, timeSpent: '48 min', connectedTopics: ['By Parts','Trig Sub'],        narrative: 'Recovered with a focused session. Examples bridged the skipped concepts effectively.' },
          { label: 'Wk 12', mastery: 69, cause: 'normal',  hints: 2, examples: 3, tries: 7, timeSpent: '54 min', connectedTopics: ['Trig Sub','Partial Fractions'],narrative: 'Good momentum. Complex technique connections building.' },
        ],
      },
      {
        id: 'double-integrals', title: 'Double & Triple Integrals',
        mastery: 58, status: 'Gap Detected',
        history: [
          { label: 'Wk 9',  mastery: 14, cause: 'normal',         hints: 3, examples: 5, tries: 3, timeSpent: '22 min', connectedTopics: ['Integration'],                    narrative: 'First contact. Heavy example reliance is expected at this stage.' },
          { label: 'Wk 10', mastery: 30, cause: 'normal',         hints: 4, examples: 4, tries: 4, timeSpent: '33 min', connectedTopics: ['Integration','Coordinate Systems'], narrative: 'Progress noted. Coordinate system dependencies are challenging.' },
          { label: 'Wk 11', mastery: 23, cause: 'fewer_attempts', hints: 7, examples: 2, tries: 1, timeSpent: '12 min', connectedTopics: ['Coordinate Systems'],              narrative: 'Level dropped. Only one attempt per problem — far fewer than the prior session. Confidence may be declining.' },
          { label: 'Wk 12', mastery: 40, cause: 'normal',         hints: 5, examples: 4, tries: 4, timeSpent: '38 min', connectedTopics: ['Coordinate Systems','Vector Fields'],narrative: 'Recovery beginning. Teaching loop provided scaffolded path through coordinate transforms.' },
          { label: 'Wk 13', mastery: 58, cause: 'normal',         hints: 4, examples: 3, tries: 5, timeSpent: '46 min', connectedTopics: ['Vector Fields','Integration'],     narrative: 'Steadily building. Gap is narrowing but complex problems still need structured support.' },
        ],
      },
    ],
  },
  {
    id: 'cosc-3312', name: 'Database Systems', code: 'COSC-3312',
    instructor: 'Prof. Okonkwo',
    topics: [
      {
        id: 'relational', title: 'Relational Model & SQL',
        mastery: 84, status: 'Mastered',
        history: [
          { label: 'Wk 1', mastery: 30, cause: 'normal', hints: 1, examples: 3, tries: 4, timeSpent: '28 min', connectedTopics: ['Data Models'],              narrative: 'Solid start. Prior programming background accelerates SQL comprehension.' },
          { label: 'Wk 2', mastery: 56, cause: 'normal', hints: 2, examples: 2, tries: 6, timeSpent: '42 min', connectedTopics: ['Normalization'],             narrative: 'Strong progress. Normalization concepts beginning to connect.' },
          { label: 'Wk 3', mastery: 72, cause: 'normal', hints: 1, examples: 2, tries: 7, timeSpent: '50 min', connectedTopics: ['Joins','Normalization'],     narrative: 'Approaching mastery. Complex JOINs being attempted independently.' },
          { label: 'Wk 4', mastery: 84, cause: 'normal', hints: 0, examples: 1, tries: 8, timeSpent: '55 min', connectedTopics: ['Joins','Indexes'],           narrative: 'Mastery confirmed. Zero hint usage across the full problem set.' },
        ],
      },
      {
        id: 'normalization', title: 'Normalization to 3NF',
        mastery: 62, status: 'Building',
        history: [
          { label: 'Wk 5', mastery: 18, cause: 'normal',      hints: 3, examples: 5, tries: 3, timeSpent: '25 min', connectedTopics: ['Relational Model'],             narrative: 'Conceptual introduction. Abstract rules require heavy worked-example support.' },
          { label: 'Wk 6', mastery: 35, cause: 'normal',      hints: 4, examples: 4, tries: 5, timeSpent: '38 min', connectedTopics: ['Functional Dependencies'],       narrative: 'Progress. Functional dependencies becoming clearer session by session.' },
          { label: 'Wk 7', mastery: 29, cause: 'hint_overuse',hints:10, examples: 1, tries: 3, timeSpent: '20 min', connectedTopics: ['Functional Dependencies'],       narrative: 'Level dropped. Near-maximum hint usage on 3NF decomposition — conceptual shortcut taken, not genuine reasoning.' },
          { label: 'Wk 8', mastery: 48, cause: 'normal',      hints: 3, examples: 5, tries: 6, timeSpent: '45 min', connectedTopics: ['Functional Dependencies','Transactions'], narrative: 'Teaching loop intervened. Stepped through decomposition algorithm from first principles.' },
          { label: 'Wk 9', mastery: 62, cause: 'normal',      hints: 2, examples: 3, tries: 7, timeSpent: '52 min', connectedTopics: ['Transactions'],                 narrative: 'Building well. Understanding now grounded in process, not shortcuts.' },
        ],
      },
      {
        id: 'transactions', title: 'Transactions & Concurrency',
        mastery: 52, status: 'Gap Detected',
        history: [
          { label: 'Wk 8',  mastery: 14, cause: 'normal',   hints: 2, examples: 5, tries: 3, timeSpent: '22 min', connectedTopics: ['Normalization'],            narrative: 'First session. Concurrency is abstract — worked examples are essential here.' },
          { label: 'Wk 9',  mastery: 28, cause: 'normal',   hints: 4, examples: 4, tries: 4, timeSpent: '34 min', connectedTopics: ['ACID Properties'],          narrative: 'Growing. ACID properties starting to solidify with repetition.' },
          { label: 'Wk 10', mastery: 20, cause: 'inactive', hints: 7, examples: 1, tries: 2, timeSpent: '10 min', connectedTopics: ['ACID Properties'],          narrative: 'Level dropped. 11 days without engagement caused significant recall decay on concurrency rules.' },
          { label: 'Wk 11', mastery: 38, cause: 'normal',   hints: 4, examples: 5, tries: 5, timeSpent: '42 min', connectedTopics: ['ACID Properties','Locking'], narrative: 'Recovering. Structured re-exposure is rebuilding the mental model.' },
          { label: 'Wk 12', mastery: 52, cause: 'normal',   hints: 3, examples: 3, tries: 6, timeSpent: '48 min', connectedTopics: ['Locking','Deadlocks'],       narrative: 'Steady recovery. Locking mechanisms understood at a functional level.' },
        ],
      },
    ],
  },
  {
    id: 'fren-1311', name: 'Elementary French', code: 'FREN-1311',
    instructor: 'Prof. Beaumont',
    topics: [
      {
        id: 'greetings', title: 'Greetings & Introductions',
        mastery: 90, status: 'Mastered',
        history: [
          { label: 'Wk 1', mastery: 38, cause: 'normal', hints: 1, examples: 3, tries: 4, timeSpent: '20 min', connectedTopics: ['Pronunciation'],          narrative: 'Comfortable start. Pronunciation patterns clicked quickly.' },
          { label: 'Wk 2', mastery: 62, cause: 'normal', hints: 2, examples: 2, tries: 6, timeSpent: '30 min', connectedTopics: ['Pronunciation','Vocab'],   narrative: 'Vocabulary expanding. Conversational patterns becoming natural.' },
          { label: 'Wk 3', mastery: 78, cause: 'normal', hints: 1, examples: 2, tries: 7, timeSpent: '38 min', connectedTopics: ['Present Tense'],           narrative: 'Near mastery. Present tense connections helping retention.' },
          { label: 'Wk 4', mastery: 90, cause: 'normal', hints: 0, examples: 1, tries: 8, timeSpent: '42 min', connectedTopics: ['Present Tense','Pronouns'], narrative: 'Mastered. Fully independent production with zero hints.' },
        ],
      },
      {
        id: 'present-tense', title: 'Present Tense Conjugation',
        mastery: 62, status: 'Building',
        history: [
          { label: 'Wk 4', mastery: 20, cause: 'normal',         hints: 3, examples: 5, tries: 3, timeSpent: '22 min', connectedTopics: ['Greetings'],           narrative: 'Early stage. Irregular verbs require significant scaffolding.' },
          { label: 'Wk 5', mastery: 36, cause: 'normal',         hints: 4, examples: 4, tries: 5, timeSpent: '35 min', connectedTopics: ['Pronouns'],            narrative: 'Progress. Subject-verb agreement patterns forming.' },
          { label: 'Wk 6', mastery: 30, cause: 'fewer_attempts', hints: 8, examples: 1, tries: 2, timeSpent: '14 min', connectedTopics: ['Pronouns'],            narrative: 'Level dropped. Fewer attempts than prior session — engagement dropped on irregular forms.' },
          { label: 'Wk 7', mastery: 50, cause: 'normal',         hints: 3, examples: 5, tries: 6, timeSpent: '44 min', connectedTopics: ['Pronouns','Vocab'],    narrative: 'Teaching loop re-introduced high-frequency irregular verbs. Strong recovery.' },
          { label: 'Wk 8', mastery: 62, cause: 'normal',         hints: 2, examples: 3, tries: 7, timeSpent: '48 min', connectedTopics: ['Vocab','Past Tense'],  narrative: 'Building well. Past tense connections beginning to emerge.' },
        ],
      },
    ],
  },
  {
    id: 'cosc-2327', name: 'Web Programming', code: 'COSC-2327',
    instructor: 'Prof. Chen',
    topics: [
      {
        id: 'html', title: 'HTML Structure & Semantics',
        mastery: 89, status: 'Mastered',
        history: [
          { label: 'Wk 1', mastery: 42, cause: 'normal', hints: 1, examples: 2, tries: 5, timeSpent: '25 min', connectedTopics: ['Document Structure'],     narrative: 'Confident start. Semantic element purposes understood quickly.' },
          { label: 'Wk 2', mastery: 65, cause: 'normal', hints: 2, examples: 2, tries: 6, timeSpent: '35 min', connectedTopics: ['Accessibility'],           narrative: 'Good progress. Accessibility implications of semantics now being considered.' },
          { label: 'Wk 3', mastery: 80, cause: 'normal', hints: 1, examples: 2, tries: 7, timeSpent: '42 min', connectedTopics: ['CSS Layout'],              narrative: 'Near mastery. CSS layout dependencies are being actively connected.' },
          { label: 'Wk 4', mastery: 89, cause: 'normal', hints: 0, examples: 1, tries: 8, timeSpent: '50 min', connectedTopics: ['CSS Layout','Forms'],      narrative: 'Mastered. Fully independent, zero hints, strong cross-topic connections.' },
        ],
      },
      {
        id: 'css-layout', title: 'CSS Layout — Flexbox & Grid',
        mastery: 72, status: 'Building',
        history: [
          { label: 'Wk 4', mastery: 22, cause: 'normal',      hints: 3, examples: 5, tries: 3, timeSpent: '28 min', connectedTopics: ['HTML'],               narrative: 'First session. Box model must be solid before layout patterns click.' },
          { label: 'Wk 5', mastery: 40, cause: 'normal',      hints: 4, examples: 4, tries: 5, timeSpent: '40 min', connectedTopics: ['Box Model'],           narrative: 'Progress. Flexbox alignment starting to feel intuitive.' },
          { label: 'Wk 6', mastery: 34, cause: 'hint_overuse',hints: 9, examples: 1, tries: 3, timeSpent: '18 min', connectedTopics: ['Box Model'],           narrative: 'Level dropped. Relied heavily on hints for Grid template syntax — pattern not internalized.' },
          { label: 'Wk 7', mastery: 55, cause: 'normal',      hints: 3, examples: 5, tries: 7, timeSpent: '52 min', connectedTopics: ['Box Model','Responsive'],narrative: 'Teaching loop stepped through Grid from first principles — significant recovery.' },
          { label: 'Wk 8', mastery: 72, cause: 'normal',      hints: 2, examples: 3, tries: 8, timeSpent: '58 min', connectedTopics: ['Responsive','JavaScript'],narrative: 'Strong session. Responsive layout patterns becoming fluent.' },
        ],
      },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const f = (n: number) => n.toFixed(1);

function cubicBezierPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const d: string[] = [`M ${f(pts[0].x)} ${f(pts[0].y)}`];
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i];
    const cp = (c.x - p.x) * 0.42;
    d.push(`C ${f(p.x + cp)} ${f(p.y)}, ${f(c.x - cp)} ${f(c.y)}, ${f(c.x)} ${f(c.y)}`);
  }
  return d.join(' ');
}

const DIP_LABEL: Record<DipCause, string> = {
  hint_overuse:    'Heavy hint reliance',
  skipped:         'Problems skipped',
  fewer_attempts:  'Fewer attempts than prior session',
  inactive:        'Extended inactivity',
  normal:          'Normal session',
};

const STATUS_STYLE: Record<TopicStatus, { color: string; bg: string; border: string; borderStyle: string }> = {
  'Mastered':     { color: '#FFFFFF', bg: '#111111', border: '#111111', borderStyle: 'solid'  },
  'Building':     { color: '#111111', bg: '#FFFFFF', border: '#111111', borderStyle: 'solid'  },
  'Gap Detected': { color: '#444444', bg: '#F2F2F2', border: '#AAAAAA', borderStyle: 'dashed' },
};

// ─── TOPIC GRAPH ──────────────────────────────────────────────────────────────

function TopicGraph({
  history, selectedIdx, topicId, onPointClick,
}: {
  history:      ProgressPoint[];
  selectedIdx:  number | null;
  topicId:      string;
  onPointClick: (idx: number) => void;
}) {
  const VW = 300, VH = 96;
  const PL = 6, PR = 6, PT = 14, PB = 24;
  const GW = VW - PL - PR;
  const GH = VH - PT - PB;
  const n  = history.length;
  const gradId = `grad-${topicId}`;

  const toX = (i: number) => PL + (i / (n - 1)) * GW;
  const toY = (m: number) => PT + (1 - m / 100) * GH;

  const pts     = history.map((p, i) => ({ x: toX(i), y: toY(p.mastery) }));
  const linePath = cubicBezierPath(pts);
  const bottomY  = PT + GH;
  const areaPath = `${linePath} L ${f(pts[n-1].x)} ${f(bottomY)} L ${f(pts[0].x)} ${f(bottomY)} Z`;

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#000000" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0.00"/>
        </linearGradient>
      </defs>

      {/* Baseline */}
      <line x1={PL} y1={bottomY} x2={VW - PR} y2={bottomY} stroke="#E4E4E4" strokeWidth="1"/>

      {/* Area */}
      <path d={areaPath} fill={`url(#${gradId})`}/>

      {/* Line */}
      <path d={linePath} fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Points */}
      {pts.map((p, i) => {
        const isDip    = history[i].cause !== 'normal';
        const selected = selectedIdx === i;
        return (
          <g key={i} style={{ cursor: 'pointer' }} onClick={() => onPointClick(i)}>
            {/* Invisible large hit area */}
            <circle cx={p.x} cy={p.y} r="16" fill="transparent"/>

            {/* Selection ring */}
            {selected && (
              <circle cx={p.x} cy={p.y} r="10" fill="none"
                stroke="#000000" strokeWidth="1.5" strokeDasharray="3 2.5"/>
            )}

            {/* Dip → filled black square; Normal → hollow circle */}
            {isDip ? (
              <rect x={p.x - 4.5} y={p.y - 4.5} width="9" height="9"
                fill={selected ? '#000000' : '#444444'}
                stroke="#000000" strokeWidth="1.5"
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <circle cx={p.x} cy={p.y} r="4"
                fill={selected ? '#000000' : '#FFFFFF'}
                stroke="#000000" strokeWidth="2"
              />
            )}

            {/* X-axis label */}
            <text x={p.x} y={VH - 4} textAnchor="middle"
              fontSize="9" fill="#BBBBBB" fontFamily="inherit">
              {history[i].label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── TOPIC CARD ────────────────────────────────────────────────────────────────

function TopicCard({
  topic, selectedIdx, onPointClick,
}: {
  topic:        Topic;
  selectedIdx:  number | null;
  onPointClick: (topicId: string, idx: number) => void;
}) {
  const ss = STATUS_STYLE[topic.status];
  const isActive = selectedIdx !== null;

  return (
    <div
      className="topic-card"
      style={{
        border:       `1px solid ${isActive ? '#111111' : '#E2E2E2'}`,
        borderRadius: '12px',
        background:   '#FFFFFF',
        padding:      '26px 24px 20px',
        display:      'flex',
        flexDirection:'column',
        gap:          '20px',
        boxShadow:    isActive
          ? '0 0 0 3px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        minHeight:    '260px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '16px', fontWeight: 700, color: '#000000',
            lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '10px',
          }}>
            {topic.title}
          </div>
          <div style={{
            fontSize: '42px', fontWeight: 900, color: '#000000',
            letterSpacing: '-0.05em', lineHeight: 1,
          }}>
            {topic.mastery}<span style={{ fontSize: '22px', fontWeight: 700, color: '#444444' }}>%</span>
          </div>
        </div>
        <span style={{
          fontSize:    '11px',
          fontWeight:  700,
          color:       ss.color,
          background:  ss.bg,
          border:      `1px ${ss.borderStyle} ${ss.border}`,
          padding:     '4px 10px',
          borderRadius:'4px',
          whiteSpace:  'nowrap',
          letterSpacing: '0.01em',
          flexShrink:  0,
          marginTop:   '2px',
        }}>
          {topic.status}
        </span>
      </div>

      {/* Graph section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 600, color: '#CCCCCC',
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>
          Understanding over time — click a point
        </div>
        <div style={{ borderTop: '1px solid #F2F2F2', paddingTop: '12px' }}>
          <TopicGraph
            history={topic.history}
            selectedIdx={selectedIdx}
            topicId={topic.id}
            onPointClick={(idx) => onPointClick(topic.id, idx)}
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="3.5" fill="#fff" stroke="#000" strokeWidth="2"/>
          </svg>
          <span style={{ fontSize: '10px', color: '#BBBBBB', fontWeight: 500 }}>Session</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1" y="1" width="8" height="8" fill="#444" stroke="#000" strokeWidth="1.5"/>
          </svg>
          <span style={{ fontSize: '10px', color: '#BBBBBB', fontWeight: 500 }}>Dip</span>
        </div>
      </div>
    </div>
  );
}

// ─── INSIGHT PANEL ────────────────────────────────────────────────────────────

function InsightPanel({ insight }: { insight: InsightPoint | null }) {
  if (!insight) {
    return (
      <div style={{
        position:       'sticky',
        top:            '40px',
        border:         '1px solid #E8E8E8',
        borderRadius:   '12px',
        background:     '#FAFAFA',
        padding:        '40px 28px',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '360px',
        gap:            '12px',
      }}>
        <div style={{
          width: '44px', height: '44px',
          border: '1.5px solid #DDDDDD', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 4v5" stroke="#CCCCCC" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="9" cy="13" r="1" fill="#CCCCCC"/>
            <circle cx="9" cy="9" r="7" stroke="#DDDDDD" strokeWidth="1.4"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#BBBBBB', marginBottom: '6px' }}>
            No session selected
          </div>
          <div style={{ fontSize: '12px', color: '#CCCCCC', lineHeight: 1.7, maxWidth: '200px' }}>
            Click any data point on a topic graph to view the full session breakdown.
          </div>
        </div>
      </div>
    );
  }

  const { topicTitle, point } = insight;
  const isDip = point.cause !== 'normal';

  return (
    <div style={{
      position:     'sticky',
      top:          '40px',
      border:       '1px solid #111111',
      borderRadius: '12px',
      background:   '#FFFFFF',
      overflow:     'hidden',
    }}>
      {/* Top accent bar */}
      <div style={{ height: '3px', background: isDip ? '#888888' : '#000000' }}/>

      <div style={{ padding: '24px 24px 28px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #F0F0F0' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700, color: '#BBBBBB',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px',
          }}>
            Session Insight · {point.label}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
            {topicTitle}
          </div>
        </div>

        {/* Understanding Level */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#BBBBBB', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Understanding Level
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '58px', fontWeight: 900, color: '#000000', letterSpacing: '-0.06em', lineHeight: 1 }}>
              {point.mastery}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#444444', lineHeight: 1 }}>%</span>
              {isDip && (
                <span style={{
                  fontSize: '10px', fontWeight: 700, color: '#555555',
                  background: '#EEEEEE', padding: '2px 7px', borderRadius: '3px',
                  letterSpacing: '0.04em',
                }}>
                  ↓ DECLINED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Teaching Loop Stats */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#BBBBBB', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Teaching Loop Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ border: '1px solid #EEEEEE', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#111111', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {point.hints}
              </div>
              <div style={{ fontSize: '11px', color: '#AAAAAA', fontWeight: 500, marginTop: '4px' }}>Hints Used</div>
            </div>
            <div style={{ border: '1px solid #EEEEEE', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#111111', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {point.examples}
              </div>
              <div style={{ fontSize: '11px', color: '#AAAAAA', fontWeight: 500, marginTop: '4px' }}>Examples Viewed</div>
            </div>
          </div>
        </div>

        {/* Effort Metrics */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#BBBBBB', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Effort Metrics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ border: '1px solid #EEEEEE', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#111111', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {point.tries}
              </div>
              <div style={{ fontSize: '11px', color: '#AAAAAA', fontWeight: 500, marginTop: '4px' }}>Attempts</div>
            </div>
            <div style={{ border: '1px solid #EEEEEE', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#111111', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {point.timeSpent}
              </div>
              <div style={{ fontSize: '11px', color: '#AAAAAA', fontWeight: 500, marginTop: '4px' }}>Time Spent</div>
            </div>
          </div>
        </div>

        {/* Conceptual Connections */}
        {point.connectedTopics.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#BBBBBB', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Connected With
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {point.connectedTopics.map(t => (
                <span key={t} style={{
                  fontSize: '12px', fontWeight: 600, color: '#333333',
                  background: '#F5F5F5', border: '1px solid #E4E4E4',
                  padding: '5px 10px', borderRadius: '5px',
                  letterSpacing: '-0.01em',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Narrative */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#BBBBBB', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Teaching Loop Result
          </div>
          <div style={{
            fontSize:   '13px',
            lineHeight: 1.7,
            color:      '#222222',
            background: isDip ? '#F7F7F7' : '#FAFAFA',
            borderLeft: `3px solid ${isDip ? '#999999' : '#111111'}`,
            borderRadius: '0 6px 6px 0',
            padding:    '12px 14px',
          }}>
            {point.narrative}
          </div>
          {isDip && (
            <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#999999', letterSpacing: '0.02em' }}>
              Cause: {DIP_LABEL[point.cause]}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function GrowthPage() {
  const [activeSubjectId, setActiveSubjectId] = useState(SUBJECTS[0].id);
  const [selectedPoint,   setSelectedPoint]   = useState<{ topicId: string; pointIdx: number } | null>(null);

  const subject      = SUBJECTS.find(s => s.id === activeSubjectId) ?? SUBJECTS[0];
  const avgMastery   = Math.round(subject.topics.reduce((a, t) => a + t.mastery, 0) / subject.topics.length);
  const masteredCount = subject.topics.filter(t => t.status === 'Mastered').length;
  const gapCount     = subject.topics.filter(t => t.status === 'Gap Detected').length;

  const handlePointClick = (topicId: string, pointIdx: number) => {
    if (selectedPoint?.topicId === topicId && selectedPoint.pointIdx === pointIdx) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint({ topicId, pointIdx });
    }
  };

  const insightData: InsightPoint | null = (() => {
    if (!selectedPoint) return null;
    const t = subject.topics.find(t => t.id === selectedPoint.topicId);
    if (!t) return null;
    return { topicTitle: t.title, point: t.history[selectedPoint.pointIdx] };
  })();

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        .subj-tab       { transition: color 0.15s, border-color 0.15s; }
        .subj-tab:hover { color: #000000 !important; border-bottom-color: #888888 !important; }
        .topic-card     { transition: border-color 0.15s, box-shadow 0.15s; }
        .topic-card:hover { border-color: #888888 !important; }

        .growth-layout {
          display: flex;
          align-items: flex-start;
          gap: 40px;
        }
        .growth-left  { flex: 1; min-width: 0; }
        .growth-right { flex-shrink: 0; width: 340px; }
        .growth-grid  {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        @media (max-width: 1200px) {
          .growth-grid  { grid-template-columns: 1fr; }
        }
        @media (max-width: 1024px) {
          .growth-layout { flex-direction: column; }
          .growth-right  { width: 100% !important; }
        }
      `}</style>

      <div className="growth-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="growth-left">

          {/* Page title */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 800, color: '#000000', letterSpacing: '-0.04em' }}>
              Learning Mastery
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#666666', fontWeight: 500 }}>
              How much do you actually know — topic by topic, confirmed by Nous.
            </p>
          </div>

          {/* Subject tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E2E2', marginBottom: '32px', overflowX: 'auto' }}>
            {SUBJECTS.map(s => {
              const active = s.id === activeSubjectId;
              return (
                <button key={s.id}
                  className="subj-tab"
                  onClick={() => { setActiveSubjectId(s.id); setSelectedPoint(null); }}
                  style={{
                    padding:         '10px 22px 12px',
                    background:      'none',
                    border:          'none',
                    borderBottom:    active ? '2.5px solid #000000' : '2.5px solid transparent',
                    fontSize:        '14px',
                    fontWeight:      active ? 700 : 500,
                    color:           active ? '#000000' : '#AAAAAA',
                    cursor:          'pointer',
                    whiteSpace:      'nowrap',
                    letterSpacing:   '-0.01em',
                    fontFamily:      'inherit',
                    marginBottom:    '-1px',
                  }}>
                  {s.name}
                </button>
              );
            })}
          </div>

          {/* Subject header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#000000', letterSpacing: '-0.03em', marginBottom: '2px' }}>
              {subject.name}
            </div>
            <div style={{ fontSize: '13px', color: '#999999', fontWeight: 500, marginBottom: '22px' }}>
              {subject.code} · {subject.instructor}
            </div>

            {/* Stats row */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '32px',
              padding:      '20px 0',
              borderTop:    '1px solid #EBEBEB',
              borderBottom: '1px solid #EBEBEB',
            }}>
              <div>
                <div style={{ fontSize: '52px', fontWeight: 900, color: '#000000', letterSpacing: '-0.06em', lineHeight: 1 }}>
                  {avgMastery}%
                </div>
                <div style={{ fontSize: '11px', color: '#AAAAAA', fontWeight: 700, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Overall Mastery
                </div>
              </div>
              <div style={{ width: '1px', height: '52px', background: '#E2E2E2' }}/>
              <div style={{ display: 'flex', gap: '28px' }}>
                {[
                  { value: masteredCount, label: 'Mastered'  },
                  { value: gapCount,      label: 'Gaps'       },
                  { value: subject.topics.length, label: 'Topics' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#000000', lineHeight: 1, letterSpacing: '-0.04em' }}>
                      {value}
                    </div>
                    <div style={{ fontSize: '11px', color: '#AAAAAA', fontWeight: 500, marginTop: '5px' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2-col topic grid */}
          <div className="growth-grid">
            {subject.topics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                selectedIdx={selectedPoint?.topicId === topic.id ? selectedPoint.pointIdx : null}
                onPointClick={handlePointClick}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: INSIGHT PANEL ── */}
        <div className="growth-right">
          <InsightPanel insight={insightData}/>
        </div>

      </div>
    </div>
  );
}
