/**
 * Course & Assignment Data
 * 
 * This module exports the primary data structures and mock dataset
 * for the Nous learning platform:
 * - CourseData: Complete course information with metadata
 * - Assignment: Individual assignment details and status tracking
 * - Announcement: Course announcements with timestamps
 * - CourseFile: Resource files (PDFs, presentations, etc.)
 * 
 * Contains mock data for demo courses (Calculus II, Database, French I, etc.)
 * with realistic assignments, announcements, and progress tracking.
 * In production, replace with API calls to a database.
 */

export type Status = 'Completed' | 'In Progress' | 'Not Started';
export type FileType = 'PDF' | 'DOCX' | 'PPTX' | 'ZIP';

export interface Assignment {
  id: string; courseId: string; num: number; title: string; desc: string;
  due: string; points: number; status: Status; progress: number; problem: string;
}
export interface Announcement { id: string; instructor: string; date: string; title: string; body: string; }
export interface CourseFile { id: string; type: FileType; name: string; size: string; date: string; }
export interface CourseData {
  id: string; code: string; name: string; sem: string; grad: string; symbol: string;
  color: string; done: number; total: number; pct: number; ann: number; doc: number;
  complete?: boolean; instructor: string;
  assignments: Assignment[]; announcements: Announcement[]; files: CourseFile[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const a = (courseId: string, num: number, title: string, desc: string, due: string,
  pts: number, status: Status, pct: number, problem: string): Assignment =>
  ({ id: `${courseId}-${num}`, courseId, num, title, desc, due, points: pts, status, progress: pct, problem });

const ann = (courseId: string, num: number, instructor: string, date: string,
  title: string, body: string): Announcement =>
  ({ id: `${courseId}-ann-${num}`, instructor, date, title, body });

const f = (courseId: string, num: number, type: FileType, name: string,
  size: string, date: string): CourseFile =>
  ({ id: `${courseId}-f-${num}`, type, name, size, date });

// ─── courses ──────────────────────────────────────────────────────────────────
export const COURSES: CourseData[] = [
  {
    id: 'math-2414', code: 'MATH-2414', name: 'Calculus II',
    sem: 'MATH-2414-1.2026SP · Spring 2026',
    grad: 'linear-gradient(135deg,#1a1a4e 0%,#3730a3 50%,#4338ca 100%)',
    symbol: '∫', color: '#7C6AED', done: 5, total: 8, pct: 62, ann: 5, doc: 0,
    instructor: 'Prof. Martinez',
    assignments: [
      a('math-2414',1,'Limits and Continuity – Problem Set 1','Evaluate one-sided limits and determine continuity at given points','Oct 5',100,'Completed',100,'Evaluate one-sided limits: find lim(x→3⁻) f(x) and lim(x→3⁺) f(x) for the piecewise function f(x) = {x²−1 if x<3, 2x if x≥3}. Determine if f(x) is continuous at x=3.'),
      a('math-2414',2,'Limits and Continuity – Problem Set 2','Apply L\'Hôpital\'s Rule to indeterminate forms','Oct 12',100,'Completed',100,"Apply L'Hôpital's Rule: Evaluate lim(x→0) (sin x)/x and lim(x→∞) (3x²−2x)/(5x²+1). Show all differentiation steps and verify the indeterminate form before applying the rule."),
      a('math-2414',3,'Limits and Continuity – Problem Set 3','Evaluate limits using factoring and direct substitution','Nov 15',100,'In Progress',75,'Problem 3: Evaluate the limit, if it exists: lim(x→2) (x²−4)/(x−2). Show all steps including factoring, cancellation, and direct substitution. If the limit does not exist, explain why.'),
      a('math-2414',4,'Derivatives – Chain Rule Practice','Differentiate composite functions using the chain rule','Nov 18',75,'Not Started',0,'Differentiate each composite function using the chain rule. Show the outer and inner function identification, then apply d/dx[f(g(x))] = f\'(g(x))·g\'(x):\n(a) h(x) = (3x²+1)⁵\n(b) h(x) = sin(x³−2x)\n(c) h(x) = e^(cos x)'),
      a('math-2414',5,'Derivatives – Implicit Differentiation','Find dy/dx for implicitly defined curves','Nov 22',75,'Not Started',0,'Find dy/dx using implicit differentiation:\n(a) x² + y² = 25 (at the point (3, 4))\n(b) x³ + y³ = 6xy\n(c) sin(xy) = x\nFor each, show the full differentiation step and isolate dy/dx.'),
      a('math-2414',6,'Volume and Surface Area Quiz','Timed quiz on solids of revolution using disk and shell methods','Nov 12',50,'Not Started',0,'Quiz Topic: Solids of Revolution\nFind the volume of the solid formed by rotating the region bounded by y = √x, y = 0, and x = 4 about the x-axis. Use BOTH the disk method and the shell method. Show all integrals and verify your answers match.'),
      a('math-2414',7,'Double Integration Project','Evaluate double integrals over rectangular and general regions','Nov 20',150,'In Progress',30,'Problem 1: Evaluate ∬_R (2x + 3y) dA where R is the region bounded by x=0, x=2, y=0, y=3. Set up the iterated integral and solve completely.\n\nProblem 2: Evaluate ∬_R x·e^(xy) dA over R=[0,1]×[0,2]. Switch the order of integration if necessary.'),
      a('math-2414',8,'Review Problems for Midterm','Complete practice set and post 3 questions to discussion board','Nov 20',50,'In Progress',30,'Review: Complete problems 1–15 from the Practice Midterm (see Course Files). After working through them, post at least 3 questions to the Discussion Board where you need clarification. Respond to at least 2 classmates\' questions.'),
    ],
    announcements: [
      ann('math-2414',1,'Prof. Martinez','Nov 10, 2024','Office Hours Moved This Week','Due to the faculty senate meeting on Thursday, my office hours are moved to Wednesday 2–4pm this week. Please plan accordingly if you need help with Problem Set 3.'),
      ann('math-2414',2,'Prof. Martinez','Nov 8, 2024','Reminder: Double Integration Project Due Nov 20','Please remember that the Double Integration Project is due on November 20th at 11:59pm. Submit through Nous. Late submissions will receive a 10% deduction per day.'),
      ann('math-2414',3,'Prof. Martinez','Nov 5, 2024','Midterm Grades Posted','Midterm grades have been posted to your Nous grade report. The class average was 74%. Please review your feedback and visit office hours if you have questions.'),
      ann('math-2414',4,'Prof. Martinez','Nov 1, 2024','Week Fourteen Quiz Format','The upcoming quiz will be 20 multiple choice questions, 50 minutes. Topics: limits, derivatives, and the fundamental theorem of calculus. No notes permitted.'),
      ann('math-2414',5,'Prof. Martinez','Oct 28, 2024','Homework Extension Granted','Due to the campus-wide power outage last Tuesday, Problem Set 2 deadline has been extended to Oct 14. Please use the extra time to review L\'Hôpital\'s Rule examples in the lecture notes.'),
    ],
    files: [
      f('math-2414',1,'PDF','Syllabus_MATH2414_Fall2024.pdf','245 KB','Aug 20'),
      f('math-2414',2,'PDF','Lecture_Notes_Limits.pdf','1.2 MB','Sep 15'),
      f('math-2414',3,'PDF','Lecture_Notes_Derivatives.pdf','980 KB','Oct 1'),
      f('math-2414',4,'PPTX','Week8_Integration_Slides.pptx','3.4 MB','Oct 28'),
      f('math-2414',5,'PDF','Practice_Midterm.pdf','560 KB','Nov 1'),
      f('math-2414',6,'DOCX','Double_Integration_Project_Guidelines.docx','128 KB','Nov 5'),
      f('math-2414',7,'ZIP','Formula_Sheet_Pack.zip','890 KB','Nov 8'),
    ],
  },
  {
    id: 'cosc-3312', code: 'COSC-3312', name: 'Database and Info Retrieval',
    sem: 'COSC-3312-50.2026SP · Spring 2026',
    grad: 'linear-gradient(135deg,#7c3517 0%,#b45309 50%,#d97706 100%)',
    symbol: 'DB', color: '#D97706', done: 4, total: 8, pct: 52, ann: 4, doc: 0,
    instructor: 'Prof. Okonkwo',
    assignments: [
      a('cosc-3312',1,'ER Diagram Design','Design an entity-relationship diagram for a hospital management system','Sep 20',100,'Completed',100,'Design a complete ER diagram for a hospital management system. Include entities for: Patient, Doctor, Nurse, Department, Room, Treatment, and Insurance. Show all relationships, cardinalities (1:1, 1:N, M:N), and mark all primary keys and foreign keys.'),
      a('cosc-3312',2,'SQL Queries – Basic SELECT','Write SELECT statements with WHERE, ORDER BY, and GROUP BY clauses','Sep 28',100,'Completed',100,'Write SQL queries for the hospital database:\n(a) List all patients admitted after Jan 1, 2024, ordered by admission date DESC\n(b) Count the number of patients per department\n(c) Find doctors with more than 10 active patients using HAVING\n(d) List the top 5 most common diagnoses'),
      a('cosc-3312',3,'SQL Queries – Joins and Subqueries','Write INNER JOIN, LEFT JOIN, and nested subquery statements','Oct 10',100,'Completed',100,'Write JOIN and subquery SQL:\n(a) INNER JOIN: List all patients with their assigned doctor\'s name\n(b) LEFT JOIN: Find patients who have NOT been assigned a room\n(c) Subquery: Find all doctors whose average patient age is above the hospital average\n(d) Correlated subquery: List patients whose last treatment was more than 30 days ago'),
      a('cosc-3312',4,'Normalization to 3NF','Normalize a given schema from 1NF through 3NF with justification','Oct 25',100,'Completed',100,'Normalize the following unnormalized table to 1NF, 2NF, and 3NF:\nORDERS(OrderID, CustomerName, CustomerCity, ProductID, ProductName, ProductPrice, Qty, TotalPrice)\nFor each step, identify the functional dependencies, explain the violation, and show the resulting normalized tables with primary keys.'),
      a('cosc-3312',5,'Indexing and Query Optimization','Analyze query execution plans and propose index strategies','Nov 8',75,'In Progress',60,'Task: Given the following slow-running SQL query on a 500,000-row employees table, analyze the execution plan and write an optimized version using appropriate indexes. Explain your reasoning.\n\nSELECT * FROM employees\nWHERE department = \'Engineering\'\nAND salary > 75000\nORDER BY hire_date DESC;\n\nSubmit: (1) Your EXPLAIN ANALYZE output analysis, (2) CREATE INDEX statements, (3) the optimized query, (4) a brief explanation of your indexing strategy.'),
      a('cosc-3312',6,'Week Fourteen Announcement – Quiz is UP!','Timed quiz covering transactions, ACID properties, and concurrency','Nov 14',50,'Not Started',0,'Quiz: Transactions and Concurrency Control\nThis timed quiz covers: ACID properties, transaction isolation levels (READ UNCOMMITTED through SERIALIZABLE), deadlock detection and prevention, two-phase locking, and timestamp-based concurrency. 20 questions, 50 minutes. No resources permitted.'),
      a('cosc-3312',7,'NoSQL vs Relational Comparison','Write a 500-word technical comparison of MongoDB vs PostgreSQL','Nov 20',75,'Not Started',0,'Write a 500-word technical comparison of MongoDB vs PostgreSQL. Structure your response with these headings:\n1. Data Model Differences\n2. Query Language\n3. Scalability Approach\n4. ACID Compliance\n5. Best Use Cases\nCite at least 2 technical sources. Submit as a PDF.'),
      a('cosc-3312',8,'Final Database Project','Design, build, and document a full relational database with 5 tables','Dec 1',200,'Not Started',0,'Final Project: Design and implement a fully functional relational database of your choice (not the hospital system). Requirements:\n– Minimum 5 tables with proper relationships\n– At least 2 M:N relationships resolved with junction tables\n– Complex queries demonstrating JOINs, subqueries, and aggregation\n– Indexes on high-frequency query columns\n– 1-page technical documentation\nSubmit your .sql file and documentation PDF through Nous.'),
    ],
    announcements: [
      ann('cosc-3312',1,'Prof. Okonkwo','Nov 14, 2024','Week Fourteen Quiz is NOW LIVE','The Week 14 quiz on transactions and ACID properties is now open on Nous. You have 50 minutes once you start. The quiz closes Friday at 11:59pm. Good luck!'),
      ann('cosc-3312',2,'Prof. Okonkwo','Nov 9, 2024','Indexing Assignment – Common Mistakes','After reviewing early submissions, many students are skipping the EXPLAIN ANALYZE step. Please run the query with EXPLAIN ANALYZE before and after your optimizations, and include the output in your submission.'),
      ann('cosc-3312',3,'Prof. Okonkwo','Oct 27, 2024','Midterm Grades Available','Midterm scores are posted. Class average was 81%. Strong performance on normalization. Weakest area was correlated subqueries — we will review in class Thursday.'),
      ann('cosc-3312',4,'Prof. Okonkwo','Oct 10, 2024','Final Project Topic Approval Required','All final project database topics must be approved by Nov 1. Email me your proposed domain and 3-sentence description. Topics like e-commerce, library, or university systems need a unique angle to be approved.'),
    ],
    files: [
      f('cosc-3312',1,'PDF','Syllabus_COSC3312_Spring2026.pdf','198 KB','Aug 22'),
      f('cosc-3312',2,'PDF','ER_Diagram_Notation_Guide.pdf','540 KB','Sep 10'),
      f('cosc-3312',3,'PPTX','Week6_Joins_and_Subqueries.pptx','2.1 MB','Oct 5'),
      f('cosc-3312',4,'PDF','Normalization_Examples.pdf','760 KB','Oct 20'),
      f('cosc-3312',5,'DOCX','Final_Project_Requirements.docx','95 KB','Nov 6'),
      f('cosc-3312',6,'ZIP','Sample_Databases.zip','4.2 MB','Sep 1'),
    ],
  },
  {
    id: 'fren-1311', code: 'FREN-1311', name: 'Elementary French I',
    sem: 'FREN-1311-2.2026SP · Spring 2026',
    grad: 'linear-gradient(135deg,#701a75 0%,#a21caf 50%,#c026d3 100%)',
    symbol: 'Fr', color: '#C026D3', done: 2, total: 8, pct: 28, ann: 2, doc: 0,
    instructor: 'Prof. Beaumont',
    assignments: [
      a('fren-1311',1,'Greetings and Introductions','Record a 60-second audio introducing yourself in French','Sep 15',50,'Completed',100,'Record a 60-second audio in French introducing yourself. Include: your name, age, where you are from, your major, and one hobby. Use vocabulary from Chapter 1. Upload your .mp3 or .m4a file to Nous.'),
      a('fren-1311',2,'Numbers and Dates','Written exercises: write dates, times, and phone numbers in French','Sep 22',50,'Completed',100,'Complete exercises 1–20 from the Numbers and Dates worksheet:\n– Write the following dates in French: September 15, March 3, July 4, December 25\n– Spell out the numbers: 17, 42, 85, 100, 1,500\n– Write the following times: 3:15pm, 8:30am, 12:00pm, 11:45pm\nSubmit your handwritten or typed responses as a PDF.'),
      a('fren-1311',3,'Definite and Indefinite Articles','Complete fill-in-the-blank exercises with le, la, les, un, une, des','Oct 5',75,'Not Started',0,'Fill in the correct article (le, la, l\', les, un, une, des) for each blank:\n(a) _____ professeur parle français.\n(b) J\'ai _____ livre intéressant.\n(c) _____ étudiantes sont intelligentes.\n(d) Nous mangeons _____ pain avec _____ beurre.\n(e) Il y a _____ chats dans _____ jardin.\nExplain your choices for 5 of the answers in English.'),
      a('fren-1311',4,'Present Tense – Regular Verbs','Conjugate -er, -ir, and -re verbs in present tense with sentences','Oct 18',75,'Not Started',0,'Conjugate the following verbs for all subject pronouns (je, tu, il/elle, nous, vous, ils/elles) and write one original sentence using each:\n-er: parler (to speak), manger (to eat)\n-ir: finir (to finish), choisir (to choose)\n-re: vendre (to sell), entendre (to hear)'),
      a('fren-1311',5,'Vocabulary – Family and Home','Label family member illustrations and write 5 sentences about your home','Oct 30',50,'Not Started',0,'Part A: Using the Family Tree diagram (see Course Files), label all 12 family members in French.\nPart B: Write 5 complete French sentences describing your home or living space using vocabulary from Chapter 4 (bedroom, kitchen, living room, etc.). Use at least 3 different adjectives.'),
      a('fren-1311',6,'Dialogue – At the Café','Write and record a 2-minute café ordering dialogue with a partner','Nov 10',100,'Not Started',0,'With a partner, write and record a 2-minute dialogue set in a French café. One person plays the server (le serveur), one plays the customer (le client). Include: greeting, ordering food and drinks from the menu (see files), asking for the bill, and saying goodbye. Submit both the written script (PDF) and audio recording (MP3).'),
      a('fren-1311',7,'Upload on Nous – Listening Comprehension','Listen to audio clip and answer 10 comprehension questions in French','Apr 21',75,'Not Started',0,'Instructions: Listen to the provided audio clip (Dialogue: Au restaurant). Answer the following 10 questions in French using complete sentences. Focus on vocabulary from Units 3 and 4.\n\nAudio: Available in Course Files → Week12_Audio_Restaurant.mp3\n\nAnswer all 10 questions in complete French sentences. Partial credit given for correct vocabulary with grammar errors.'),
      a('fren-1311',8,'Midterm Oral Exam Preparation','Prepare 3 topics for spoken exam: family, daily routine, preferences','Nov 20',100,'Not Started',0,'Prepare to speak for 2–3 minutes on EACH of the following topics for your upcoming oral exam:\n1. Ma famille – describe 4 family members using adjectives and relationship vocabulary\n2. Ma routine quotidienne – describe your typical weekday using reflexive verbs and time expressions\n3. Mes préférences – discuss your likes and dislikes using "j\'aime", "je préfère", "je n\'aime pas"\nPractice speaking without notes. You will be asked follow-up questions.'),
    ],
    announcements: [
      ann('fren-1311',1,'Prof. Beaumont','Apr 20, 2024','Audio Assignment Due Tonight at 11:59PM','Friendly reminder: the Listening Comprehension assignment is due tonight. Upload your response document to Nous before midnight. Email me if you have technical difficulties.'),
      ann('fren-1311',2,'Prof. Beaumont','Nov 3, 2024','Oral Exam Schedule Posted','The Midterm Oral Exam schedule is now posted on Nous. Sign up for your 10-minute time slot by November 8. Exams will be held in Room 204. Bring your preparation notes but you cannot use them during the exam.'),
    ],
    files: [
      f('fren-1311',1,'PDF','Syllabus_FREN1311_Spring2026.pdf','156 KB','Aug 21'),
      f('fren-1311',2,'PDF','Chapter1_Vocabulary_Greetings.pdf','280 KB','Sep 5'),
      f('fren-1311',3,'PDF','Famille_Tree_Diagram.pdf','420 KB','Oct 25'),
      f('fren-1311',4,'PDF','Cafe_Menu_French.pdf','310 KB','Nov 1'),
      f('fren-1311',5,'ZIP','Week12_Audio_Restaurant.zip','8.4 MB','Nov 8'),
    ],
  },
  {
    id: 'cosc-2327', code: 'COSC-2327', name: 'Intro to Web Programming',
    sem: 'COSC-2327-1.2026SP · Spring 2026',
    grad: 'linear-gradient(135deg,#134e4a 0%,#0f766e 50%,#14b8a6 100%)',
    symbol: '</>', color: '#0D9488', done: 3, total: 8, pct: 44, ann: 9, doc: 2,
    instructor: 'Prof. Chen',
    assignments: [
      a('cosc-2327',1,'HTML Structure – Personal Page','Build a valid HTML5 page with semantic tags','Sep 10',75,'Completed',100,'Build a valid HTML5 personal portfolio page using semantic tags: <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>. Include: your name, a bio paragraph, a skills list, and placeholder sections for projects and contact. Validate your HTML using the W3C validator and include the validation result screenshot.'),
      a('cosc-2327',2,'CSS Styling – Layout and Typography','Style your HTML page using Flexbox, Google Fonts, and CSS variables','Sep 20',75,'Completed',100,'Style your HTML page from Assignment 1 with:\n– A CSS custom properties (variables) section defining your color palette\n– Flexbox for the navigation and main layout\n– Google Fonts (choose 2 complementary fonts)\n– A hover effect on your navigation links\n– A card component for your "Projects" section using Flexbox\nSubmit the updated HTML and CSS files.'),
      a('cosc-2327',3,'JavaScript – DOM Manipulation','Write JS to dynamically add, remove, and update DOM elements on click','Oct 5',100,'Completed',100,'Add JavaScript to your personal page to:\n(a) Dynamically add a new "skill tag" to your skills list when the user types in a text input and clicks "Add"\n(b) Remove a skill tag when the user clicks the × button on it\n(c) Update a "Projects count" display when items are added/removed from a projects array\n(d) Implement a dark mode toggle button\nSubmit your updated JS file with comments.'),
      a('cosc-2327',4,'Responsive Design with Media Queries','Make your personal page fully responsive for mobile, tablet, and desktop','Oct 18',75,'Not Started',0,'Responsive CSS Assignment\n\nGiven HTML\n\n<div class="container">\n  <div class="box">Box 1</div>\n  <div class="box">Box 2</div>\n  <div class="box">Box 3</div>\n</div> \n Write CSS for the .container and .box classes to make the layout responsive. On desktop, display the boxes side by side using the parent .container, add space between them, and give each box a background color, padding, and centered text. On mobile screens (600px or less), stack the boxes vertically and make each box take full width. Also, add rounded corners to each box.'),
      a('cosc-2327',5,'Scripting Frameworks Survey','Research React, Vue, and Angular. Submit 400-word comparison report','Apr 27',50,'Not Started',0,'Task: Research React.js, Vue.js, and Angular. Write a 400-word technical comparison covering the following sections:\n1. Component Model – how each framework handles UI components\n2. Learning Curve – beginner-friendliness and documentation quality\n3. Performance – virtual DOM, change detection, rendering strategy\n4. Best Use Case – what type of project each framework is best suited for\n\nFormat your report with clear headings. Cite at least 2 sources per framework. Submit as a structured PDF report.'),
      a('cosc-2327',6,'React – Component Basics','Build 3 reusable React components: Navbar, Card, and Footer','Nov 5',100,'Not Started',0,'Build 3 reusable React functional components:\n(a) <Navbar> – accepts a "links" array prop, renders a horizontal nav with active state\n(b) <Card> – accepts title, description, imageUrl, and tags props, renders a styled card\n(c) <Footer> – accepts copyright and socialLinks props\n\nAll components must use PropTypes for type checking. Write a brief README explaining props for each component. Submit the project folder as a ZIP.'),
      a('cosc-2327',7,'React – State and Events','Build an interactive to-do list app using useState and event handlers','Nov 15',100,'Not Started',0,'Build a React to-do list application using useState. Features required:\n– Add a new task (input + button)\n– Mark a task as complete (checkbox toggles strikethrough)\n– Delete a task\n– Filter: All / Active / Completed tabs\n– Task count display ("3 of 7 tasks completed")\n– Local state only (no backend needed)\nSubmit the project folder. Include screenshots in your README.'),
      a('cosc-2327',8,'Final Web App Project','Design and build a 3-page React app with routing and API integration','Dec 5',200,'Not Started',0,'Final Project: Build a 3-page React application on a topic of your choice. Requirements:\n– React Router for navigation between pages\n– At least 1 real API integration (weather, movies, recipes, etc.)\n– useState and useEffect hooks\n– Custom CSS or a UI library (Tailwind, MUI, etc.)\n– Responsive design (mobile + desktop)\n– Deployed on Vercel or Netlify (include live URL)\nSubmit GitHub repo link + live demo link + 1-page reflection.'),
    ],
    announcements: [
      ann('cosc-2327',1,'Prof. Chen','Apr 25, 2024','Scripting Frameworks Survey – Clarification','Several students asked about length. The 400-word minimum applies to the comparison body only — your intro and conclusion can add ~100 more words. Please use clear section headings exactly as listed in the assignment prompt.'),
      ann('cosc-2327',2,'Prof. Chen','Nov 10, 2024','React Assignment Office Hours','I\'m holding extra office hours Mon/Wed 3–5pm this week to help with the React Component Basics assignment. Bring your code and specific questions. Drop-ins welcome in Room 412.'),
      ann('cosc-2327',3,'Prof. Chen','Nov 4, 2024','Responsive Design – Common Mistake','Many submissions for Assignment 4 are missing the tablet breakpoint (481–768px). Please review the requirements carefully. I\'ve posted a reference example in the Course Files folder.'),
      ann('cosc-2327',4,'Prof. Chen','Oct 20, 2024','Final Project Teams Optional','The final web app project can be done solo or in pairs. If working in pairs, both students submit the same repo link but each writes their own individual reflection. Indicate your partner\'s name in your README.'),
    ],
    files: [
      f('cosc-2327',1,'PDF','Syllabus_COSC2327_Spring2026.pdf','178 KB','Aug 20'),
      f('cosc-2327',2,'PDF','HTML5_Semantic_Elements_Reference.pdf','320 KB','Sep 5'),
      f('cosc-2327',3,'PPTX','Week5_CSS_Flexbox_Grid.pptx','1.8 MB','Sep 22'),
      f('cosc-2327',4,'PDF','Media_Queries_Breakpoints_Guide.pdf','290 KB','Oct 12'),
      f('cosc-2327',5,'PDF','React_Getting_Started.pdf','445 KB','Oct 30'),
      f('cosc-2327',6,'ZIP','Assignment2_Reference_Example.zip','2.1 MB','Nov 4'),
    ],
  },
  {
    id: 'hist-1301', code: 'HIST-1301', name: 'United States History I',
    sem: 'HIST-1301-1.2026SP · Spring 2026',
    grad: 'linear-gradient(135deg,#450a0a 0%,#991b1b 50%,#dc2626 100%)',
    symbol: '★', color: '#DC2626', done: 5, total: 8, pct: 67, ann: 1, doc: 1,
    instructor: 'Prof. Washington',
    assignments: [
      a('hist-1301',1,'Colonial America Reading Response','Read Ch. 2 and write a 300-word response on colonial economic systems','Sep 12',75,'Completed',100,'Read Chapter 2 of your textbook ("Colonial Economic Systems") and write a 300-word response addressing: What were the dominant economic models in the Northern, Middle, and Southern colonies? How did geography shape each? What role did indentured servitude and slavery play in the colonial economy? Cite at least 2 specific examples from the chapter.'),
      a('hist-1301',2,'Revolutionary War Timeline','Create an annotated timeline of 10 key events from 1770–1783','Sep 25',75,'Completed',100,'Create an annotated timeline with at least 10 key events between 1770 and 1783. For each event: include the date, a 2-sentence description, and explain its significance to the outcome of the Revolutionary War. Events must span the full period (include both early tensions and the peace treaty). Submit as a PDF with visual timeline design.'),
      a('hist-1301',3,'Constitution Analysis Essay','Analyze the balance of power in the original Constitution. 500 words.','Oct 8',100,'Completed',100,'Write a 500-word analytical essay on the separation of powers in the original 1787 Constitution. Address: (a) the three branches and their checks on each other, (b) why the Framers feared centralized power, (c) one compromise that shaped the document\'s structure (e.g., the Great Compromise or Three-Fifths Compromise). Cite the Constitution directly.'),
      a('hist-1301',4,'Federalist Papers Discussion','Post a 200-word analysis of Federalist No. 10 to the discussion board','Oct 20',50,'Completed',100,'Post a 200-word analysis of Federalist No. 10 (Madison) to the Discussion Board. Your post must: summarize Madison\'s argument about factions, explain why he believes a large republic controls factions better than a small one, and connect his argument to a modern political issue. Respond to at least 2 classmates\' posts.'),
      a('hist-1301',5,'Manifest Destiny Map Activity','Label and annotate a US expansion map from 1800 to 1860','Nov 1',75,'Completed',100,'Using the blank US map (see Course Files), label and annotate the following:\n– The Louisiana Purchase (1803) and its approximate borders\n– Texas Annexation (1845)\n– Oregon Territory (1846)\n– Mexican Cession (1848)\nFor each territory, add a 1-sentence annotation explaining how it was acquired and one consequence for Native American populations.'),
      a('hist-1301',6,'PO Ch. 4: "Global Visions"','Read and respond to Political Orders Ch. 4 on US foreign policy origins','Apr 20',100,'Not Started',0,'Prompt: After reading Political Orders Chapter 4, write a 300-word response answering: How did early American foreign policy decisions reflect the tension between isolationism and expansionism? Use at least 2 specific examples from the chapter.\n\nFormat: Introduction (2–3 sentences), Body (evidence + analysis), Conclusion (1–2 sentences). Submit as a PDF or Word document through Nous by 10am on Apr 20.'),
      a('hist-1301',7,'Civil War Causes – Comparative Essay','Compare economic and moral arguments for/against secession. 600 words.','Nov 18',100,'Not Started',0,'Prompt: In 600 words, compare the economic arguments (King Cotton, tariff disputes) with the moral arguments (abolitionism, popular sovereignty) as causes of Southern secession. Use evidence from at least 3 primary sources.\n\nSources available in Course Files:\n– South Carolina Declaration of Secession (1860)\n– Lincoln\'s "House Divided" Speech (1858)\n– John C. Calhoun\'s "The Southern Address" (1849)\n\nStructure: Intro → Economic Arguments → Moral Arguments → Synthesis → Conclusion'),
      a('hist-1301',8,'Reconstruction Era Quiz','Timed 20-question quiz on the Reconstruction period 1865–1877','Nov 25',50,'Not Started',0,'Quiz: The Reconstruction Era (1865–1877)\nTopics covered:\n– Lincoln\'s 10% Plan vs. the Wade-Davis Bill\n– The 13th, 14th, and 15th Amendments\n– The Freedmen\'s Bureau: goals and limitations\n– Radical Republican policies and opposition\n– The Compromise of 1877 and end of Reconstruction\n20 questions, mixed format (multiple choice + short answer). 40 minutes. Open immediately on Nous.'),
    ],
    announcements: [
      ann('hist-1301',1,'Prof. Washington','Apr 18, 2024','PO Ch. 4 Assignment – Important Tips','As you read Chapter 4, pay close attention to pp. 87–102 on the Monroe Doctrine and Westward Expansion. These are the most likely topics you\'ll use as examples. Remember: the response is due Apr 20 at 10am — not midnight.'),
    ],
    files: [
      f('hist-1301',1,'PDF','Syllabus_HIST1301_Spring2026.pdf','220 KB','Aug 20'),
      f('hist-1301',2,'PDF','Political_Orders_Ch4_GlobalVisions.pdf','1.4 MB','Apr 14'),
      f('hist-1301',3,'PDF','SC_Declaration_of_Secession_1860.pdf','340 KB','Nov 2'),
      f('hist-1301',4,'PDF','Lincoln_House_Divided_Speech.pdf','180 KB','Nov 2'),
      f('hist-1301',5,'PDF','Calhoun_Southern_Address_1849.pdf','260 KB','Nov 2'),
      f('hist-1301',6,'PDF','Blank_US_Expansion_Map.pdf','890 KB','Oct 28'),
    ],
  },
  {
    id: 'orientation', code: 'ORIENTATION', name: 'Nous Platform Orientation',
    sem: 'Nous Platform Orientation · Ongoing',
    grad: 'linear-gradient(135deg,#14532d 0%,#15803d 50%,#22c55e 100%)',
    symbol: '✦', color: '#22C55E', done: 8, total: 8, pct: 100, ann: 0, doc: 0,
    complete: true, instructor: 'Nous Platform Team',
    assignments: [
      a('orientation',1,'Welcome to Nous','Watch the 3-minute platform introduction video','Aug 25',10,'Completed',100,'Watch the 3-minute Nous Platform Introduction video. This video covers the core features you\'ll use throughout your courses: the Dashboard, Assignments workspace, Collaboration tools, and Growth Analytics. After watching, confirm completion by clicking "Mark as Watched" below.'),
      a('orientation',2,'Setting Up Your Profile','Upload a profile photo and complete your academic bio','Aug 26',10,'Completed',100,'Complete your Nous student profile:\n(a) Upload a profile photo (JPG or PNG, at least 200×200px)\n(b) Fill in your full name, major, year of study, and campus\n(c) Write a 2–3 sentence academic bio\n(d) Set your notification preferences\nYour profile will be visible to peers in Collaboration mode.'),
      a('orientation',3,'Navigating Your Dashboard','Complete the interactive dashboard tour','Aug 27',10,'Completed',100,'Launch the interactive Dashboard Tour by clicking the "?" icon in the top right of your Dashboard. The tour has 8 stops covering: Course Cards, Progress Rings, The To Do panel, Growth Analytics, Collaboration, Notifications, Settings, and Help. Complete all 8 stops to earn full marks.'),
      a('orientation',4,'Submitting Your First Assignment','Follow the guide to submit a test file through Nous','Aug 28',10,'Completed',100,'Follow the step-by-step guide to submit a test file:\n(1) Open any assignment from your Dashboard\n(2) Type at least 3 sentences in the workspace\n(3) Click "Submit Draft"\n(4) Verify your submission appears in your Assignment History\nThis is a practice submission — it won\'t count toward any course grade.'),
      a('orientation',5,'Using the Collaboration Feature','Connect with one peer from your Calculus II course','Aug 29',10,'Completed',100,'Explore the Collaboration feature:\n(1) Navigate to the Collaboration page from the sidebar\n(2) Find at least 1 peer from your Calculus II course who is available for peer learning\n(3) Send them a connection request with a brief message\n(4) Accept any incoming connection requests you\'ve received\nYour connection activity is tracked for this assignment.'),
      a('orientation',6,'Growth & Analytics Overview','Review your first Growth report after completing an assignment','Aug 30',10,'Completed',100,'After completing at least one assignment workspace session, navigate to the Growth & Analytics page. Review your:\n– Accuracy rate on any attempted questions\n– Time spent in the workspace\n– Progress against course benchmarks\nWrite 2 sentences in the text box below describing one insight from your Growth report.'),
      a('orientation',7,'Notifications and Preferences','Set your notification preferences for assignments and announcements','Sep 1',10,'Completed',100,'Configure your Nous notification settings:\n(1) Go to Settings → Notifications\n(2) Enable email notifications for "Assignment Due Reminders" (3 days before, 1 day before)\n(3) Enable in-app notifications for "New Announcements"\n(4) Set your preferred daily digest time\n(5) Save your preferences\nConfirm your settings are saved before submitting.'),
      a('orientation',8,'Orientation Completion Quiz','10-question quiz confirming platform knowledge','Sep 2',10,'Completed',100,'Final orientation quiz: 10 questions covering everything from this orientation module. Questions cover: platform navigation, assignment submission, collaboration features, Growth analytics, and notification settings. You must score 80% or higher to complete orientation. You may retake the quiz once if needed.'),
    ],
    announcements: [],
    files: [
      f('orientation',1,'PDF','Nous_Platform_Guide_2026.pdf','2.1 MB','Aug 20'),
      f('orientation',2,'PDF','Student_Quick_Start.pdf','450 KB','Aug 20'),
    ],
  },
];

export function getCourse(id: string) { return COURSES.find(c => c.id === id); }

export function getAssignment(id: string) {
  for (const c of COURSES) {
    const asgn = c.assignments.find(a => a.id === id);
    if (asgn) return { assignment: asgn, course: c };
  }
  return null;
}
