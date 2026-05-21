'use client';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, X, CheckCircle2, Lock, Play, Users } from 'lucide-react';
import { getAssignment } from '@/lib/data';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type StepType  = 'Conceptual' | 'Procedural' | 'Calculation';
type ModalView = 'none' | 'mcq' | 'hint' | 'video' | 'peer' | 'confirmed' | 'locked' | 'exit';
type ErrorType = 'correct' | 'conceptual' | 'calculation' | 'misconception';

interface ArrowPair { exampleTerm: string; problemTerm: string; color: string; }

interface StepHint {
  title: string;
  explanation: string;
  exampleContext: string;
  arrows: ArrowPair[];
  videoTitle: string;
  videoDesc: string;
}

interface MCQOption { id: string; text: string; type: ErrorType; }

interface Step {
  title: string;
  prompt: string;
  type: StepType;
  mcq: { question: string; variants: string[]; options: MCQOption[]; };
  hints: { conceptual: StepHint; calculation: StepHint; misconception: StepHint; };
  hint: string;
  analogy: string;
}

// ─── ARROW MAP ────────────────────────────────────────────────────────────────

const ARROW_MONO = ['#111111', '#555555', '#888888', '#BBBBBB'];

function ArrowMap({ pairs }: { pairs: ArrowPair[] }) {
  const fromRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const toRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Array<{ x1:number; y1:number; x2:number; y2:number; color:string }>>([]);

  useLayoutEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const computed = pairs.map((_, i) => {
      const f = fromRefs.current[i];
      const t = toRefs.current[i];
      if (!f || !t) return null;
      const fr = f.getBoundingClientRect();
      const tr = t.getBoundingClientRect();
      const color = ARROW_MONO[i % ARROW_MONO.length];
      return { x1: fr.right - cr.left, y1: fr.top + fr.height / 2 - cr.top,
               x2: tr.left  - cr.left, y2: tr.top + tr.height / 2 - cr.top, color };
    }).filter(Boolean) as typeof lines;
    setLines(computed);
  }, [pairs]);

  const svgH = pairs.length * 40 + 8;

  return (
    <div ref={containerRef} style={{ position:'relative', display:'flex', alignItems:'flex-start' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-end', paddingRight:'48px' }}>
        {pairs.map((p, i) => {
          const c = ARROW_MONO[i % ARROW_MONO.length];
          return (
            <div key={i} ref={el => { fromRefs.current[i] = el; }}
              style={{ padding:'4px 10px', borderRadius:'4px', background:`${c}14`,
                border:`1px solid ${c}44`, fontSize:'12px', fontWeight:700,
                color:c, fontFamily:'monospace', whiteSpace:'nowrap' }}>
              {p.exampleTerm}
            </div>
          );
        })}
      </div>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:`${svgH}px`, pointerEvents:'none', overflow:'visible' }}>
        <defs>
          {pairs.map((_, i) => {
            const c = ARROW_MONO[i % ARROW_MONO.length];
            return (
              <marker key={i} id={`arh-${i}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 z" fill={c} opacity={0.7}/>
              </marker>
            );
          })}
        </defs>
        {lines.map((l, i) => {
          const mx = (l.x1 + l.x2) / 2;
          return (
            <path key={i} d={`M${l.x1},${l.y1} C${mx},${l.y1} ${mx},${l.y2} ${l.x2},${l.y2}`}
              stroke={l.color} strokeWidth="1.5" fill="none" opacity={0.65}
              strokeDasharray="5,3" markerEnd={`url(#arh-${i})`}/>
          );
        })}
      </svg>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-start', paddingLeft:'48px' }}>
        {pairs.map((p, i) => {
          const c = ARROW_MONO[i % ARROW_MONO.length];
          return (
            <div key={i} ref={el => { toRefs.current[i] = el; }}
              style={{ padding:'4px 10px', borderRadius:'4px', background:`${c}14`,
                border:`1px solid ${c}44`, fontSize:'12px', fontWeight:700,
                color:c, fontFamily:'monospace', whiteSpace:'nowrap' }}>
              {p.problemTerm}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TIMER BAR ────────────────────────────────────────────────────────────────

function TimerBar({ seconds, total }: { seconds: number; total: number }) {
  const pct   = (seconds / total) * 100;
  const color = seconds <= 3 ? '#000000' : seconds <= 6 ? '#555555' : '#AAAAAA';
  return (
    <div style={{ marginBottom:'16px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px' }}>
        <span style={{ fontSize:'10px', fontWeight:600, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.06em' }}>
          Answer before time runs out
        </span>
        <span style={{ fontSize:'22px', fontWeight:700, color, fontFamily:'monospace', lineHeight:1 }}>
          {seconds}s
        </span>
      </div>
      <div style={{ height:'4px', background:'#F0F0F0', borderRadius:'2px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:color,
          borderRadius:'2px', transition:'width 1s linear, background 0.3s' }}/>
      </div>
    </div>
  );
}

// ─── STEP DATA ────────────────────────────────────────────────────────────────

const STEPS: Record<string, Step[]> = {
  'math-2414-3': [
    {
      title: 'Identify the form',
      prompt: '',
      type: 'Conceptual',
      hint: 'When you substitute x = 2 into the denominator, what value do you get? What does that tell you about using direct substitution?',
      analogy: 'A locked door doesn\'t mean the room is empty — it means you need a different key. 0/0 doesn\'t mean no limit exists; it signals a different approach is needed.',
      mcq: {
        question: 'x = 2 gives 0/0. What does that mean?',
        variants: [
          '0/0 from substitution — what\'s next?',
          'Direct substitution fails. Why?',
        ],
        options: [
          { id: 'a', text: 'Indeterminate — try a different technique', type: 'correct' },
          { id: 'b', text: 'Limit doesn\'t exist at x = 2', type: 'misconception' },
          { id: 'c', text: 'Denominator is 4, not 0', type: 'calculation' },
          { id: 'd', text: 'Only valid for continuous functions', type: 'conceptual' },
        ],
      },
      hints: {
        conceptual: {
          title: 'Logic gap: limits vs. continuity',
          explanation: 'A limit asks what value the function approaches near a point — it does NOT require the function to be continuous or defined there. 0/0 is indeterminate: it means "direct substitution failed — try factoring, L\'Hôpital, or conjugate."',
          exampleContext: 'Same structure: lim(x→3) (x²−9)/(x−3)',
          arrows: [
            { exampleTerm: 'x → 3', problemTerm: 'x → 2', color: '' },
            { exampleTerm: 'x²−9', problemTerm: 'x²−4', color: '' },
            { exampleTerm: 'x−3',  problemTerm: 'x−2',   color: '' },
          ],
          videoTitle: 'Limits at Holes — Why 0/0 ≠ "No Limit"',
          videoDesc: 'The difference between a function being undefined at a point and a limit not existing there',
        },
        calculation: {
          title: 'Substitution check: what does x = 2 actually give?',
          explanation: 'Substitute carefully: Numerator 2²−4 = 0. Denominator 2−2 = 0. Result: 0/0. Not 4 — specifically the indeterminate form 0/0.',
          exampleContext: 'Same check: lim(x→3) (x²−9)/(x−3)',
          arrows: [
            { exampleTerm: '3²−9 = 0', problemTerm: '2²−4 = 0', color: '' },
            { exampleTerm: '3−3 = 0',  problemTerm: '2−2 = 0',  color: '' },
            { exampleTerm: '→ 0/0',    problemTerm: '→ 0/0',    color: '' },
          ],
          videoTitle: 'Substitution Check for Indeterminate Forms',
          videoDesc: 'How to evaluate numerator and denominator separately before choosing your limit technique',
        },
        misconception: {
          title: 'Undefined at a point ≠ limit doesn\'t exist',
          explanation: 'f(2) being undefined creates a hole in the graph — but the limit asks about behavior as x gets close to 2, not at x = 2. A hole doesn\'t prevent a limit from existing.',
          exampleContext: 'Visual parallel: lim(x→3) (x²−9)/(x−3)',
          arrows: [
            { exampleTerm: 'hole at x=3', problemTerm: 'hole at x=2', color: '' },
            { exampleTerm: 'limit = 6 ✓', problemTerm: 'limit exists ✓', color: '' },
          ],
          videoTitle: 'Holes, Continuity, and Limits — The Key Distinction',
          videoDesc: 'Why removable discontinuities (holes) still have well-defined limits',
        },
      },
    },
    {
      title: 'Factor and simplify',
      prompt: 'Factor the numerator x²−4 using difference of squares. Then identify what cancels with the denominator, and explain why cancellation is valid here.',
      type: 'Procedural',
      hint: 'Apply the difference of squares: a²−b² = (a+b)(a−b). What does x²−4 factor into? What cancels with (x−2)?',
      analogy: 'Simplifying 6/4 to 3/2 — you divide out the shared factor. The limit does the same, removing the term that caused 0/0.',
      mcq: {
        question: 'Why can (x−2) be cancelled here?',
        variants: [
          'Cancelling (x−2) — what makes this legal?',
          'What justifies removing (x−2) from both sides?',
        ],
        options: [
          { id: 'a', text: 'x→2, not x=2, so (x−2) ≠ 0', type: 'correct' },
          { id: 'b', text: 'Same factor appears top and bottom', type: 'conceptual' },
          { id: 'c', text: '(x−2) appears twice in the numerator', type: 'calculation' },
          { id: 'd', text: 'Identical terms always cancel in fractions', type: 'misconception' },
        ],
      },
      hints: {
        conceptual: {
          title: 'Logic gap: appearance ≠ cancellable',
          explanation: 'Cancellation requires the factor to be non-zero. Since x → 2 (not x = 2), we know x ≠ 2, so x−2 ≠ 0. That\'s what makes cancellation valid — not simply that it appears in both places.',
          exampleContext: 'Same reasoning: lim(x→3) (x+3)(x−3)/(x−3)',
          arrows: [
            { exampleTerm: '(x−3)≠0 as x→3', problemTerm: '(x−2)≠0 as x→2', color: '' },
            { exampleTerm: 'cancel → (x+3)', problemTerm: 'cancel → (x+2)', color: '' },
          ],
          videoTitle: 'When Can You Cancel Factors in a Limit?',
          videoDesc: 'The precise condition that makes factor cancellation valid in limit problems',
        },
        calculation: {
          title: 'Factoring check: x²−4 has one (x−2)',
          explanation: 'x²−4 = (x+2)(x−2) by difference of squares. There is only ONE (x−2). After factoring: (x+2)(x−2)/(x−2) → (x+2).',
          exampleContext: 'Parallel: (x²−9)/(x−3) = (x+3)(x−3)/(x−3)',
          arrows: [
            { exampleTerm: 'x²−9=(x+3)(x−3)', problemTerm: 'x²−4=(x+2)(x−2)', color: '' },
            { exampleTerm: 'cancel (x−3)',      problemTerm: 'cancel (x−2)',      color: '' },
            { exampleTerm: '→ (x+3)',           problemTerm: '→ (x+2)',           color: '' },
          ],
          videoTitle: 'Difference of Squares Factoring — Step by Step',
          videoDesc: 'How to factor a²−b² and apply it to limit simplification',
        },
        misconception: {
          title: 'Factors vs. terms — cancellation has conditions',
          explanation: 'You cannot always cancel matching expressions. (x+2)/2 ≠ (x+1) — the 2 is a term, not a factor. Cancellation only applies to common factors, and only when non-zero.',
          exampleContext: 'Why (x+2)(x−2)/(x−2) works but (x+2−2)/2 doesn\'t',
          arrows: [
            { exampleTerm: '(x−2)/(x−2)=1 ✓', problemTerm: 'term: not cancellable', color: '' },
            { exampleTerm: 'valid cancel',       problemTerm: 'would be wrong ✗',     color: '' },
          ],
          videoTitle: 'Factors vs. Terms — The Cancellation Rule',
          videoDesc: 'The most common algebra mistake in calculus: when you can and cannot cancel',
        },
      },
    },
    {
      title: 'Evaluate the limit',
      prompt: 'Substitute x = 2 into your simplified expression. State the limit value clearly and explain why direct substitution is now valid — when it wasn\'t before.',
      type: 'Calculation',
      hint: 'After cancellation you should have (x+2). What is its value at x = 2? Why is it now safe to substitute directly?',
      analogy: 'Once the obstacle is cleared, the path is open. The limit is just the value of the cleaned-up expression.',
      mcq: {
        question: 'Simplified to (x+2) — why does substitution work now?',
        variants: [
          '(x+2) at x=2: why is this safe, but (x²−4)/(x−2) wasn\'t?',
          'What changed that makes x=2 work in (x+2)?',
        ],
        options: [
          { id: 'a', text: 'The 0/0 factor is gone — (x+2) is continuous at 2', type: 'correct' },
          { id: 'b', text: 'Simplified form equals original everywhere', type: 'conceptual' },
          { id: 'c', text: 'Simplification always unlocks substitution', type: 'misconception' },
          { id: 'd', text: 'Just add the constants: 2+2=4', type: 'calculation' },
        ],
      },
      hints: {
        conceptual: {
          title: 'f(2) vs. lim(x→2) after simplification',
          explanation: 'The original f(x) and (x+2) agree for all x ≠ 2, so they have the same limit. But (x+2) is also defined AT x = 2, which is why substitution now works.',
          exampleContext: 'Parallel: lim(x→3)(x+3)(x−3)/(x−3) = lim(x→3)(x+3) = 6',
          arrows: [
            { exampleTerm: 'simplified: x+3', problemTerm: 'simplified: x+2', color: '' },
            { exampleTerm: 'sub x=3 → 6',     problemTerm: 'sub x=2 → 4',     color: '' },
          ],
          videoTitle: 'Why Simplification Changes Substitutability',
          videoDesc: 'How removing the problematic factor restores direct substitution as a valid technique',
        },
        calculation: {
          title: 'Arithmetic: (x+2) at x=2',
          explanation: 'Substitute directly into the SIMPLIFIED form: (2)+2 = 4. The limit is 4. Do not substitute back into the original fraction.',
          exampleContext: 'Same final step: lim(x→3)(x+3) → 3+3 = 6',
          arrows: [
            { exampleTerm: 'x+3, sub x=3', problemTerm: 'x+2, sub x=2', color: '' },
            { exampleTerm: '3+3 = 6',       problemTerm: '2+2 = 4',       color: '' },
          ],
          videoTitle: 'Final Substitution — From Simplified Form to Answer',
          videoDesc: 'How to correctly substitute into a simplified limit expression',
        },
        misconception: {
          title: 'The limit = 4, but f(2) is still undefined',
          explanation: 'The original f(x) = (x²−4)/(x−2) still has a hole at x = 2. What we proved is that the LIMIT equals 4. The function value f(2) does not exist. These are distinct concepts.',
          exampleContext: 'Contrast: f(3) undefined vs. lim(x→3) f(x) = 6',
          arrows: [
            { exampleTerm: 'f(3) = undefined', problemTerm: 'f(2) = undefined', color: '' },
            { exampleTerm: 'lim = 6 ✓',        problemTerm: 'lim = 4 ✓',        color: '' },
          ],
          videoTitle: 'The Difference: f(a) vs. lim(x→a) f(x)',
          videoDesc: 'Why a function\'s value at a point and its limit there are two separate questions',
        },
      },
    },
  ],
};

const DEFAULT_STEPS: Step[] = [
  {
  title: 'Cross Question: Flex Property Understanding',
  prompt: '',
  type: 'Conceptual',
  hint: 'Think about how flex distributes available space among items. What does making flex values equal do inside a flex container?',
  analogy: 'Imagine splitting a pizza equally among friends. If everyone has the same share rule, each person gets the same size slice.',
  mcq: {
    question: 'Why is flex: 1 used for .box instead of flex: 2?',
    variants: [
      'What does flex: 1 control in a flex container?',
      'How does flex value affect width distribution?',
    ],
    options: [
      { id: 'a', text: 'To make all boxes take equal width inside the container', type: 'correct' },
      { id: 'b', text: 'To make one box twice as large as others', type: 'misconception' },
      { id: 'c', text: 'To fix the box width to a specific pixel value', type: 'calculation' },
      { id: 'd', text: 'To disable flex behavior completely', type: 'conceptual' },
    ],
  },
  hints: {
    conceptual: {
      title: 'Flex distributes space proportionally',
      explanation: 'flex: 1 means each item gets an equal share of available space. If all items have flex: 1, they all grow equally.',
      exampleContext: '3 boxes with flex: 1 each will divide the container width equally.',
      arrows: [
        { exampleTerm: 'flex: 1', problemTerm: 'equal share of space', color: '' },
        { exampleTerm: 'same value', problemTerm: 'equal width distribution', color: '' },
      ],
      videoTitle: 'How Flexbox Distributes Space',
      videoDesc: 'Understanding flex grow and proportional sizing in CSS flexbox',
    },
    calculation: {
      title: 'Flex is not fixed width',
      explanation: 'flex does not set exact width; it decides how remaining space is shared between items.',
      exampleContext: 'Container width is divided based on flex ratios.',
      arrows: [
        { exampleTerm: 'flex value', problemTerm: 'space ratio', color: '' },
        { exampleTerm: 'not pixels', problemTerm: 'relative sizing', color: '' },
      ],
      videoTitle: 'Flex vs Width in CSS',
      videoDesc: 'Why flex controls distribution instead of fixed sizing',
    },
    misconception: {
      title: 'Higher flex does not mean fixed doubling behavior',
      explanation: 'flex: 2 does not mean “double size always”; it means double share relative to siblings.',
      exampleContext: 'flex: 1, 1, 2 → last item gets twice the space of others.',
      arrows: [
        { exampleTerm: 'flex: 2', problemTerm: 'relative growth factor', color: '' },
        { exampleTerm: 'not absolute size', problemTerm: 'ratio-based sizing', color: '' },
      ],
      videoTitle: 'Flex Ratios Explained',
      videoDesc: 'Understanding proportional layout behavior in CSS flexbox',
    },
  },
},
  {
    title: 'Plan your approach',
    prompt: 'Identify the specific method, formula, or framework that applies here. Write your plan before executing it.',
    type: 'Procedural',
    hint: 'Think about which chapter or concept this problem belongs to. What tools did you learn for this type of problem?',
    analogy: 'A doctor diagnoses before prescribing — you name the problem category before applying the right method.',
    mcq: {
      question: 'What makes a method right for this problem?',
      variants: [
        'How do you choose which technique to use?',
        'What should guide your method selection here?',
      ],
      options: [
        { id: 'a', text: 'It fits the problem\'s structure', type: 'correct' },
        { id: 'b', text: 'It was covered most recently in class', type: 'conceptual' },
        { id: 'c', text: 'It gives an answer fastest', type: 'misconception' },
        { id: 'd', text: 'It\'s the most advanced technique available', type: 'calculation' },
      ],
    },
    hints: {
      conceptual: {
        title: 'Method selection: structure first',
        explanation: 'The right method follows from the problem\'s structure — not from recency or familiarity. Ask: what type of relationship does this problem describe?',
        exampleContext: 'Example: optimization problems need a derivative and a domain check',
        arrows: [
          { exampleTerm: 'problem type',      problemTerm: 'correct method',      color: '' },
          { exampleTerm: 'maximize/minimize', problemTerm: 'derivative = 0 + check', color: '' },
        ],
        videoTitle: 'Problem Type → Method Selection',
        videoDesc: 'A systematic framework for choosing the right technique every time',
      },
      calculation: {
        title: 'Speed vs. correctness',
        explanation: 'A fast wrong approach wastes more time than a careful correct one. Plan before calculating, especially on multi-step problems where early errors propagate.',
        exampleContext: 'Planning: identify method → write setup → then execute',
        arrows: [
          { exampleTerm: 'identify structure', problemTerm: 'write plan',      color: '' },
          { exampleTerm: 'then calculate',     problemTerm: 'don\'t skip ahead', color: '' },
        ],
        videoTitle: 'The Planning Step in Problem Solving',
        videoDesc: 'Why writing your approach before calculating improves accuracy',
      },
      misconception: {
        title: 'Advanced ≠ correct',
        explanation: 'The most advanced technique is not always the right one. Match the method to the problem — elegance comes from appropriateness, not complexity.',
        exampleContext: 'Simpler example: factoring before reaching for L\'Hôpital',
        arrows: [
          { exampleTerm: 'right method',     problemTerm: 'fits the structure', color: '' },
          { exampleTerm: 'not hardest method', problemTerm: 'but clearest path', color: '' },
        ],
        videoTitle: 'Choosing the Right Tool, Not the Hardest One',
        videoDesc: 'How to match problem types to the most appropriate technique',
      },
    },
  },
  {
    title: 'Work through the solution',
    prompt: 'Execute your plan step by step. Show all working. Verify your answer makes sense in context of the original problem.',
    type: 'Calculation',
    hint: 'Break the calculation into smaller pieces. Verify each intermediate result before moving on.',
    analogy: 'Building floor by floor — each layer must be solid before the next goes up.',
    mcq: {
      question: 'After getting your answer, what\'s the key check?',
      variants: [
        'You have a result. What must you verify?',
        'Answer in hand — what separates done from verified?',
      ],
      options: [
        { id: 'a', text: 'Verify it satisfies the original constraints', type: 'correct' },
        { id: 'b', text: 'Re-read the problem for typos', type: 'conceptual' },
        { id: 'c', text: 'Only check if the number looks unusual', type: 'misconception' },
        { id: 'd', text: 'Recheck arithmetic on the last step only', type: 'calculation' },
      ],
    },
    hints: {
      conceptual: {
        title: 'Verification vs. re-reading',
        explanation: 'Real verification means asking: does this answer satisfy the original equation or constraint? Re-reading only catches typos — not errors in reasoning.',
        exampleContext: 'Example: plug answer back into original equation to verify',
        arrows: [
          { exampleTerm: 'found: x = 3',          problemTerm: 'verify: sub back in',          color: '' },
          { exampleTerm: 'does 3 satisfy eq?', problemTerm: 'does your answer satisfy?', color: '' },
        ],
        videoTitle: 'How to Verify Your Answer, Not Just Re-Check It',
        videoDesc: 'The difference between checking your arithmetic and verifying your solution',
      },
      calculation: {
        title: 'Partial verification misses most errors',
        explanation: 'Errors in step 2 that propagate to step 5 cannot be caught by only checking step 5. Spot-check intermediate results: right sign, right units, right magnitude.',
        exampleContext: 'Check: does your factored form multiply back to the original?',
        arrows: [
          { exampleTerm: 'check each step',         problemTerm: 'not just the final',   color: '' },
          { exampleTerm: 'sign / units / magnitude', problemTerm: 'at each stage',        color: '' },
        ],
        videoTitle: 'Intermediate Result Checking in Multi-Step Problems',
        videoDesc: 'How to catch propagated errors before they reach your final answer',
      },
      misconception: {
        title: 'Round numbers aren\'t inherently more correct',
        explanation: 'Many correct answers are non-integer or irrational. Trusting "clean" answers without verification leads to systematic errors. Always verify against original constraints.',
        exampleContext: 'Many limits are non-integer; many integrals are irrational',
        arrows: [
          { exampleTerm: 'clean ≠ correct', problemTerm: 'verify always',        color: '' },
          { exampleTerm: 'check constraints', problemTerm: 'not just "looks right"', color: '' },
        ],
        videoTitle: 'The Rounding Bias — Why Clean Answers Need Verification Too',
        videoDesc: 'How the preference for clean answers creates systematic errors',
      },
    },
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const TIMER_TOTAL = 10;

export default function Workspace() {
  const router = useRouter();
  const params = useParams();
  const id     = params.id as string;
  const result = getAssignment(id);
  const assignment = result?.assignment;
  const course     = result?.course;

  const steps = STEPS[id] ?? DEFAULT_STEPS;

  const [currentStep,   setCurrentStep]   = useState(0);
  const [stepContents,  setStepContents]  = useState<string[]>(() => steps.map(() => ''));
  const [masteredSteps, setMasteredSteps] = useState<Set<number>>(new Set());
  const [modal,         setModal]         = useState<ModalView>('none');

  const [timer,        setTimer]        = useState(TIMER_TOTAL);
  const [timerActive,  setTimerActive]  = useState(false);
  const [stepFailures, setStepFailures] = useState(0);
  const [variantIdx,   setVariantIdx]   = useState(0);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [errorType,    setErrorType]    = useState<Exclude<ErrorType,'correct'> | null>(null);

  const [hintStage, setHintStage] = useState<'hint' | 'video' | 'peer'>('hint');

  const autoTriggerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [triggeredSteps, setTriggeredSteps] = useState<Set<number>>(new Set());

  const step           = steps[currentStep];
  const isCompleted    = assignment?.status === 'Completed';
  const isAllMastered  = masteredSteps.size === steps.length;
  const currentContent = stepContents[currentStep] ?? '';

  const backHref  = course ? `/assignments/${course.id}` : '/assignments';
  const backLabel = course?.name ?? 'Assignments';

  useEffect(() => {
    const lines = currentContent.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2 || triggeredSteps.has(currentStep) || modal !== 'none') return;
    if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current);
    autoTriggerRef.current = setTimeout(() => {
      setTriggeredSteps(prev => new Set([...prev, currentStep]));
      setSelectedId(null);
      setErrorType(null);
      setTimer(TIMER_TOTAL);
      setTimerActive(true);
      setModal('mcq');
    }, 1500);
    return () => { if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current); };
  }, [currentContent, currentStep, modal, triggeredSteps]);

  useEffect(() => {
    if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current);
  }, [currentStep]);

  useEffect(() => {
    if (!timerActive || modal !== 'mcq') return;
    if (timer <= 0) { handleTimerExpire(); return; }
    const t = setTimeout(() => setTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, timerActive, modal]);

  const openMCQ = () => {
    setSelectedId(null);
    setErrorType(null);
    setTimer(TIMER_TOTAL);
    setTimerActive(true);
    setModal('mcq');
  };

  const handleTimerExpire = () => {
    setTimerActive(false);
    const next = stepFailures + 1;
    setStepFailures(next);
    if (next >= 3) {
      setModal('locked');
    } else {
      setVariantIdx(p => (p + 1) % (1 + step.mcq.variants.length));
      setModal('none');
      setTimeout(openMCQ, 800);
    }
  };

  // Non-linear: mark mastered but do NOT auto-advance to next step
  const handleSelectOption = (opt: MCQOption) => {
    if (selectedId) return;
    setTimerActive(false);
    setSelectedId(opt.id);
    if (opt.type === 'correct') {
      setMasteredSteps(prev => new Set([...prev, currentStep]));
      setModal('confirmed');
      setTimeout(() => {
        setModal('none');
        setStepFailures(0);
        setVariantIdx(0);
      }, 1800);
    } else {
      setErrorType(opt.type as Exclude<ErrorType,'correct'>);
    }
  };

  const goToHint = () => { setModal('hint'); setHintStage('hint'); };

  const updateContent = (val: string) => {
    const next = [...stepContents];
    next[currentStep] = val;
    setStepContents(next);
  };

  const mcqQuestion = variantIdx === 0
    ? step.mcq.question
    : step.mcq.variants[variantIdx - 1] ?? step.mcq.question;

  const activeHint = errorType ? step.hints[errorType] : null;

  if (!assignment || !course) {
    return (
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'40px', marginBottom:'16px' }}>❓</div>
          <h2 style={{ fontSize:'20px', fontWeight:700, color:'#000000', marginBottom:'8px' }}>Assignment not found</h2>
          <button onClick={() => router.push('/assignments')}
            style={{ color:'#555555', fontSize:'14px', background:'none', border:'none', cursor:'pointer' }}>
            ← Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <style>{`
        .ws-hint-btn:hover { border-color: rgba(255,255,255,0.22) !important; background: rgba(255,255,255,0.08) !important; }
        .mcq-opt { transition: border-color 0.1s, background 0.1s; }
        .mcq-opt:hover:not([data-selected]) { border-color: #111111 !important; }
        .esc-btn:hover { background: #F5F5F5 !important; }
        .step-dot:hover { opacity: 0.75; }
        .back-btn:hover { color: #000000 !important; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', paddingBottom:'18px', marginBottom:'18px', borderBottom:'1px solid #E8E8E8' }}>
        <button className="back-btn"
          onClick={() => { if (stepContents.some(c => c.trim().length > 0)) setModal('exit'); else router.push(backHref); }}
          style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:500,
            color:'#888888', background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0 }}>
          <ChevronLeft size={15} strokeWidth={2}/>{backLabel}
        </button>
        <h1 style={{ flex:1, textAlign:'center', fontSize:'15px', fontWeight:700, color:'#000000',
          letterSpacing:'-0.01em', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {assignment.title}
        </h1>
        {!isCompleted && (
          <div style={{ fontSize:'11px', color:'#AAAAAA', whiteSpace:'nowrap', fontWeight:500, flexShrink:0 }}>
            {masteredSteps.size}/{steps.length} confirmed
          </div>
        )}
      </div>

      {/* ── ALL MASTERED BANNER ── */}
      {isAllMastered && !isCompleted && (
        <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'#F5F5F5',
          border:'1px solid #D8D8D8', borderRadius:'8px', padding:'11px 16px', marginBottom:'16px' }}>
          <CheckCircle2 size={16} stroke="#000000" strokeWidth={2}/>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:'12px', fontWeight:700, color:'#000000' }}>All steps confirmed</span>
            <span style={{ fontSize:'12px', color:'#666666', marginLeft:'8px' }}>
              Nous verified your understanding across all {steps.length} steps.
            </span>
          </div>
          <button style={{ background:'#000000', color:'#fff', border:'none', borderRadius:'5px',
            padding:'6px 14px', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
            Submit
          </button>
        </div>
      )}

      {/* ── PROBLEM CARD ── */}
      <div style={{ background:'#fff', border:'1px solid #E8E8E8', borderRadius:'8px',
        boxShadow:'0 1px 3px rgba(0,0,0,0.04)', padding:'16px 20px', marginBottom:'14px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#444444', flexShrink:0, marginTop:'6px' }}/>
          <div>
            <div style={{ fontSize:'10px', fontWeight:700, color:'#888888', textTransform:'uppercase',
              letterSpacing:'0.08em', marginBottom:'6px' }}>
              {course.code}
            </div>
            <p style={{ fontSize:'14px', color:'#000000', lineHeight:'1.7', whiteSpace:'pre-line', margin:0, fontWeight:500 }}>
              {assignment.problem}
            </p>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <div style={{ background:'#000000', borderRadius:'12px', padding:'32px',
          minHeight:'180px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center' }}>
            <CheckCircle2 size={28} stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} style={{ marginBottom:'12px' }}/>
            <div style={{ fontSize:'14px', color:'rgba(255,255,255,0.35)', lineHeight:'1.7', fontStyle:'italic' }}>
              Your submission is on record. View the full understanding breakdown in your Learning Map.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── STEP NAVIGATION ── */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'14px' }}>
            {steps.map((_, i) => {
              const mastered = masteredSteps.has(i);
              const active   = i === currentStep;
              return (
                <button key={i} className="step-dot"
                  onClick={() => setCurrentStep(i)}
                  title={`Part ${i + 1}${mastered ? ' — confirmed' : ''}`}
                  style={{ flex:1, height:'3px', borderRadius:'2px', border:'none', cursor:'pointer', padding:0,
                    background: mastered ? '#000000' : active ? '#555555' : '#DEDEDE',
                    transition:'background 0.2s, opacity 0.15s' }}/>
              );
            })}
            <span style={{ fontSize:'10px', fontWeight:600, color:'#BBBBBB', marginLeft:'8px',
              whiteSpace:'nowrap', letterSpacing:'0.02em' }}>
              {masteredSteps.has(currentStep) ? '✓' : `${Array.from(masteredSteps).length + 1}/${steps.length}`}
            </span>
          </div>

          {/* ── BLACK CANVAS ── */}
          <div style={{ background:'#000000', borderRadius:'12px', overflow:'hidden',
            boxShadow:'0 8px 40px rgba(0,0,0,0.28)' }}>

            {/* Prompt + hint button — no step labels, no type badge, no title */}
            <div style={{ padding:'24px 28px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'20px' }}>
                <p style={{ flex:1, fontSize:'14px', color:'rgba(255,255,255,0.80)', lineHeight:'1.75',
                  margin:0, maxWidth:'580px', fontWeight:400, letterSpacing:'0.01em' }}>
                  {step.prompt}
                </p>
                <button className="ws-hint-btn"
                  onClick={() => { setHintStage('hint'); setModal('hint'); setErrorType(null); }}
                  style={{ flexShrink:0, display:'flex', alignItems:'center', gap:'6px',
                    fontSize:'12px', fontWeight:500, color:'rgba(255,255,255,0.38)',
                    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
                    borderRadius:'6px', padding:'8px 14px', cursor:'pointer', whiteSpace:'nowrap',
                    transition:'border-color 0.15s, background 0.15s' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Hint
                </button>
              </div>
            </div>

            {/* Writing area */}
            <div style={{ padding:'24px 28px 28px' }}>
              <textarea
                value={currentContent}
                onChange={e => updateContent(e.target.value)}
                placeholder=""
                style={{ width:'100%', minHeight:'340px', background:'transparent', resize:'none',
                  outline:'none', border:'none', color:'rgba(255,255,255,0.88)',
                  caretColor:'rgba(255,255,255,0.55)', fontSize:'15px', lineHeight:'1.9',
                  letterSpacing:'0.01em', fontFamily:'inherit', boxSizing:'border-box' }}
              />
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODALS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {modal !== 'none' && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.60)', display:'flex',
          alignItems:'center', justifyContent:'center', zIndex:50, padding:'20px' }}>

          {/* ── MCQ CHECK ── */}
          {modal === 'mcq' && (
            <div className="modal-card modal-in" style={{ width:'440px', maxWidth:'100%', padding:'26px' }}>
              <TimerBar seconds={timer} total={TIMER_TOTAL}/>

              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'18px' }}>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA',
                    textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    Comprehension Check
                  </div>
                  <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#000000', lineHeight:1.35 }}>
                    {mcqQuestion}
                  </h2>
                </div>
                <button onClick={() => { setTimerActive(false); setModal('none'); }}
                  style={{ width:'26px', height:'26px', borderRadius:'50%', background:'#F5F5F5',
                    border:'none', cursor:'pointer', display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0 }}>
                  <X size={12} strokeWidth={2} stroke="#888888"/>
                </button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                {step.mcq.options.map(opt => {
                  const isSelected = selectedId === opt.id;
                  const isCorrect  = isSelected && opt.type === 'correct';
                  const isWrong    = isSelected && opt.type !== 'correct';
                  const bg     = isCorrect ? '#000000' : isWrong ? '#F7F7F7' : '#ffffff';
                  const border = isCorrect ? '#000000' : isWrong ? '#BBBBBB' : '#E2E2E2';
                  const textClr= isCorrect ? '#ffffff' : '#000000';
                  const circBg  = isCorrect ? '#ffffff' : isWrong ? '#888888' : '#F0F0F0';
                  const circBrd = isCorrect ? '#ffffff' : isWrong ? '#888888' : '#CCCCCC';
                  const circTxt = isCorrect ? '#000000' : isWrong ? '#ffffff' : '#AAAAAA';
                  return (
                    <button key={opt.id} data-selected={isSelected || undefined}
                      className={isSelected ? '' : 'mcq-opt'}
                      onClick={() => handleSelectOption(opt)}
                      style={{ width:'100%', textAlign:'left', padding:'10px 13px', borderRadius:'7px',
                        border:`1.5px solid ${border}`, background:bg,
                        cursor: selectedId ? 'default' : 'pointer',
                        fontSize:'13px', color:textClr, lineHeight:1.45, fontFamily:'inherit',
                        display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ width:'22px', height:'22px', borderRadius:'50%', flexShrink:0,
                        background:circBg, border:`1.5px solid ${circBrd}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'10px', fontWeight:700, color:circTxt }}>
                        {opt.id.toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {selectedId && errorType && (
                <div style={{ marginTop:'14px', padding:'12px 14px', borderRadius:'7px',
                  background:'#F5F5F5', border:'1px solid #E0E0E0' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, color:'#555555', marginBottom:'5px',
                    textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Gap detected · {errorType === 'conceptual' ? 'Logic' : errorType === 'calculation' ? 'Calculation' : 'Misconception'}
                  </div>
                  <p style={{ margin:'0 0 10px', fontSize:'13px', color:'#333333', lineHeight:1.55 }}>
                    {step.hints[errorType].title}
                  </p>
                  <button onClick={goToHint}
                    style={{ background:'#111111', color:'#fff', border:'none', borderRadius:'5px',
                      padding:'7px 14px', fontSize:'12px', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                    Show me the hint →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ADAPTIVE HINT ── */}
          {modal === 'hint' && activeHint && hintStage === 'hint' && (
            <div className="modal-card modal-in" style={{ width:'500px', maxWidth:'100%', padding:'28px', maxHeight:'88vh', overflowY:'auto' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'20px' }}>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA',
                    textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    Gap Analysis
                  </div>
                  <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#000000' }}>{activeHint.title}</h2>
                </div>
                <button onClick={() => setModal('none')}
                  style={{ width:'26px', height:'26px', borderRadius:'50%', background:'#F5F5F5',
                    border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <X size={12} strokeWidth={2} stroke="#888888"/>
                </button>
              </div>

              <div style={{ borderLeft:'3px solid #111111', paddingLeft:'14px', marginBottom:'18px' }}>
                <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Explanation</div>
                <p style={{ margin:0, fontSize:'14px', color:'#000000', lineHeight:'1.7', fontWeight:500 }}>{activeHint.explanation}</p>
              </div>

              <div style={{ background:'#FAFAFA', border:'1px solid #E8E8E8', borderRadius:'8px', padding:'14px 16px', marginBottom:'16px' }}>
                <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>
                  Map this to your problem
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'11px', color:'#888888', fontWeight:600 }}>Example</span>
                  <span style={{ fontSize:'11px', color:'#888888', fontWeight:600 }}>Your problem</span>
                </div>
                <div style={{ fontSize:'12px', color:'#AAAAAA', marginBottom:'8px', fontStyle:'italic' }}>{activeHint.exampleContext}</div>
                <ArrowMap pairs={activeHint.arrows}/>
              </div>

              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setModal('mcq')} className="esc-btn"
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#fff', border:'1px solid #E2E2E2',
                    fontSize:'13px', fontWeight:500, color:'#333333', cursor:'pointer', fontFamily:'inherit' }}>
                  Try the check again
                </button>
                <button onClick={() => setHintStage('video')}
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#000000', border:'none',
                    fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer', fontFamily:'inherit' }}>
                  Still confused →
                </button>
              </div>
            </div>
          )}

          {/* ── VIDEO SUPPORT ── */}
          {modal === 'hint' && activeHint && hintStage === 'video' && (
            <div className="modal-card modal-in" style={{ width:'440px', maxWidth:'100%', padding:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'22px' }}>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    Support · Concept Video
                  </div>
                  <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#000000' }}>Watch the concept</h2>
                </div>
                <button onClick={() => setModal('none')}
                  style={{ width:'26px', height:'26px', borderRadius:'50%', background:'#F5F5F5',
                    border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={12} strokeWidth={2} stroke="#888888"/>
                </button>
              </div>

              <div style={{ background:'#000000', borderRadius:'10px',
                padding:'24px 20px', marginBottom:'18px', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'50%',
                  background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Play size={18} fill="rgba(255,255,255,0.85)" stroke="none"/>
                </div>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:600, color:'#ffffff', marginBottom:'4px' }}>{activeHint.videoTitle}</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.38)', lineHeight:1.5 }}>{activeHint.videoDesc}</div>
                </div>
              </div>

              <div style={{ background:'#F5F5F5', border:'1px solid #E2E2E2', borderRadius:'7px',
                padding:'11px 14px', marginBottom:'18px', fontSize:'13px', color:'#333333', lineHeight:1.55 }}>
                After watching, return here and try the check again.
              </div>

              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setHintStage('hint')} className="esc-btn"
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#fff', border:'1px solid #E2E2E2',
                    fontSize:'13px', fontWeight:500, color:'#333333', cursor:'pointer', fontFamily:'inherit' }}>
                  ← Back to hint
                </button>
                <button onClick={() => setHintStage('peer')}
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#000000', border:'none',
                    fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer', fontFamily:'inherit' }}>
                  Still confused →
                </button>
              </div>
            </div>
          )}

          {/* ── PEER LEARNING ── */}
          {modal === 'hint' && hintStage === 'peer' && (
            <div className="modal-card modal-in" style={{ width:'420px', maxWidth:'100%', padding:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'22px' }}>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    Support · Peer Learning
                  </div>
                  <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#000000' }}>Connect with a Peer Master</h2>
                </div>
                <button onClick={() => setModal('none')}
                  style={{ width:'26px', height:'26px', borderRadius:'50%', background:'#F5F5F5',
                    border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={12} strokeWidth={2} stroke="#888888"/>
                </button>
              </div>

              <div style={{ background:'#F5F5F5', border:'1px solid #E2E2E2', borderRadius:'8px',
                padding:'16px', marginBottom:'16px', display:'flex', alignItems:'flex-start', gap:'14px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#E2E2E2',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Users size={18} stroke="#555555" strokeWidth={1.8}/>
                </div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'#000000', marginBottom:'3px' }}>
                    Peer Masters available in {course.name}
                  </div>
                  <div style={{ fontSize:'12px', color:'#555555', lineHeight:1.6 }}>
                    Students who mastered this topic earn credit by tutoring peers.
                  </div>
                </div>
              </div>

              <p style={{ margin:'0 0 20px', fontSize:'13px', color:'#666666', lineHeight:1.65 }}>
                Opens Collaboration filtered to peers who mastered this concept in <strong style={{ color:'#000000' }}>{course.code}</strong>.
              </p>

              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setHintStage('video')} className="esc-btn"
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#fff', border:'1px solid #E2E2E2',
                    fontSize:'13px', fontWeight:500, color:'#333333', cursor:'pointer', fontFamily:'inherit' }}>
                  ← Back
                </button>
                <button onClick={() => { setModal('none'); router.push('/collaboration'); }}
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#000000', border:'none',
                    fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer', fontFamily:'inherit' }}>
                  Open Collaboration →
                </button>
              </div>
            </div>
          )}

          {/* ── GENERAL HINT (no error context) ── */}
          {modal === 'hint' && !activeHint && (
            <div className="modal-card modal-in" style={{ width:'420px', maxWidth:'100%', padding:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA',
                    textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>
                    Guidance
                  </div>
                  <h2 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#000000' }}>Step Hint</h2>
                </div>
                <button onClick={() => setModal('none')}
                  style={{ width:'26px', height:'26px', borderRadius:'50%', background:'#F5F5F5',
                    border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={12} strokeWidth={2} stroke="#888888"/>
                </button>
              </div>
              <div style={{ borderLeft:'3px solid #111111', paddingLeft:'14px', marginBottom:'18px' }}>
                <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Hint</div>
                <p style={{ margin:0, fontSize:'14px', color:'#000000', lineHeight:'1.65', fontWeight:500 }}>{step.hint}</p>
              </div>
              <div style={{ height:'1px', background:'#F0F0F0', marginBottom:'18px' }}/>
              <div style={{ borderLeft:'3px solid #888888', paddingLeft:'14px', marginBottom:'22px' }}>
                <div style={{ fontSize:'10px', fontWeight:700, color:'#AAAAAA', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Analogy</div>
                <p style={{ margin:0, fontSize:'14px', color:'#444444', lineHeight:'1.65', fontStyle:'italic' }}>{step.analogy}</p>
              </div>
              <button onClick={() => setModal('none')}
                style={{ width:'100%', padding:'11px', borderRadius:'6px', background:'#000000',
                  border:'none', fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer' }}>
                Back to work →
              </button>
            </div>
          )}

          {/* ── CONFIRMED ── */}
          {modal === 'confirmed' && (
            <div className="modal-card modal-in" style={{ padding:'36px 32px', width:'300px', textAlign:'center' }}>
              <CheckCircle2 size={36} stroke="#000000" strokeWidth={1.5} style={{ margin:'0 auto 14px', display:'block' }}/>
              <div style={{ fontSize:'15px', fontWeight:700, color:'#000000', marginBottom:'6px', letterSpacing:'-0.01em' }}>
                Understanding Confirmed
              </div>
              <div style={{ fontSize:'13px', color:'#666666', lineHeight:1.65 }}>
                {steps.every((_, i) => masteredSteps.has(i) || i === currentStep)
                  ? 'All steps complete — you can submit when ready.'
                  : 'Continue at your own pace. Navigate steps using the bar above.'}
              </div>
            </div>
          )}

          {/* ── LOCKED ── */}
          {modal === 'locked' && (
            <div className="modal-card modal-in" style={{ padding:'40px 32px', width:'360px', textAlign:'center' }}>
              <div style={{ width:'52px', height:'52px', borderRadius:'50%',
                background:'#F0F0F0', border:'1px solid #DDDDDD',
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Lock size={22} stroke="#444444" strokeWidth={1.8}/>
              </div>
              <div style={{ fontSize:'16px', fontWeight:700, color:'#000000', marginBottom:'8px', letterSpacing:'-0.01em' }}>
                Take a break and try again later
              </div>
              <p style={{ margin:'0 0 22px', fontSize:'13px', color:'#666666', lineHeight:1.7 }}>
                This step has been attempted multiple times without a response. Stepping away often clarifies things. Your work is saved.
              </p>
              <button onClick={() => router.push(backHref)}
                style={{ width:'100%', padding:'11px', borderRadius:'6px', background:'#000000',
                  border:'none', fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer' }}>
                Return to assignments
              </button>
            </div>
          )}

          {/* ── EXIT WARNING ── */}
          {modal === 'exit' && (
            <div className="modal-card modal-in" style={{ padding:'28px 32px', width:'340px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'#000000', textAlign:'center',
                letterSpacing:'-0.01em', margin:'0 0 10px' }}>
                Leave this assignment?
              </h2>
              <p style={{ fontSize:'13px', color:'#666666', textAlign:'center', margin:'0 0 24px', lineHeight:1.65 }}>
                Your progress is saved. You can return at any time.
              </p>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setModal('none')}
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#fff', border:'1px solid #E2E2E2',
                    fontSize:'13px', fontWeight:500, color:'#000000', cursor:'pointer' }}>
                  Stay
                </button>
                <button onClick={() => router.push(backHref)}
                  style={{ flex:1, padding:'10px', borderRadius:'6px', background:'#000000', border:'none',
                    fontSize:'13px', fontWeight:600, color:'#fff', cursor:'pointer' }}>
                  Leave
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
