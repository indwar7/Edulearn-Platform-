import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  SUBJECTS,
  CLASS_COLORS,
  CURRICULUM,
  chapterCount,
  totalChapters,
  type Subject,
} from '../lib/curriculum';
import {
  Search,
  ChevronRight,
  BookOpen,
  FlaskConical,
  Globe2,
  Languages,
  Type,
  Trophy,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const CLASSES = [6, 7, 8, 9] as const;

const SUBJECT_ICONS: Record<string, any> = {
  maths: BookOpen,
  science: FlaskConical,
  social: Globe2,
  english: Type,
  hindi: Languages,
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/* Class pill tab */
function ClassTab({
  cls,
  active,
  onClick,
}: {
  cls: number;
  active: boolean;
  onClick: () => void;
}) {
  const color = CLASS_COLORS[cls];
  const total = totalChapters(cls);
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3.5 border rounded-full px-6 py-3.5 text-left transition-all duration-[450ms] ease-smooth overflow-hidden min-w-0 ${
        active
          ? 'border-transparent shadow-lg'
          : 'border-line bg-white/60 dark:bg-slate-800/40 hover:-translate-y-0.5 hover:shadow-md'
      }`}
      style={
        active
          ? { background: color, borderColor: color, boxShadow: `0 12px 42px ${color}55` }
          : undefined
      }
    >
      <span
        className="font-display font-semibold text-[34px] leading-none transition-colors duration-[450ms]"
        style={{ color: active ? '#0B1224' : color }}
      >
        {cls}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={`text-sm font-semibold transition-colors duration-[450ms] ${
            active ? 'text-navy' : 'text-ink'
          }`}
        >
          Class {cls}
        </span>
        <span
          className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-[450ms] ${
            active ? 'text-navy/65' : 'text-muted'
          }`}
        >
          {total} chapters
        </span>
      </div>
    </button>
  );
}

/* Subject rail button */
function SubjectPill({
  subject,
  count,
  active,
  onClick,
}: {
  subject: Subject;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = SUBJECT_ICONS[subject.key] || BookOpen;
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col gap-2.5 border rounded-2xl p-4 pt-4 text-left transition-all duration-[450ms] ease-smooth overflow-hidden ${
        active
          ? 'bg-cream/80 dark:bg-slate-700/60 shadow-md'
          : 'bg-white/60 dark:bg-slate-800/40 border-line hover:-translate-y-1 hover:shadow-sm'
      }`}
      style={
        active
          ? {
              borderColor: `color-mix(in srgb, ${subject.accent} 55%, transparent)`,
              boxShadow: `0 10px 30px ${subject.accent}15, 0 0 0 1px ${subject.accent}30 inset`,
            }
          : undefined
      }
    >
      {/* Bottom accent bar */}
      <span
        className={`absolute left-4 right-4 bottom-0 h-0.5 rounded-t transition-transform duration-500 ease-smooth origin-left ${
          active ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ background: subject.accent }}
      />
      <Icon size={22} style={{ color: subject.accent }} />
      <span className="text-sm font-semibold leading-snug">{subject.en}</span>
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
        {count} chapters
      </span>
    </button>
  );
}

/* Highlight matching text in chapter name */
function HighlightName({ name, query }: { name: string; query: string }) {
  if (!query) return <>{name}</>;
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="bg-transparent text-teal border-b-2 border-teal/50 pb-px">
        {name.slice(idx, idx + query.length)}
      </mark>
      {name.slice(idx + query.length)}
    </>
  );
}

/* Chapter row */
function ChapterRow({
  idx,
  name,
  slug: _slug,
  mins,
  subject,
  cls,
  search,
  onClick,
}: {
  idx: number;
  name: string;
  slug: string;
  mins: number;
  subject: Subject;
  cls: number;
  search: string;
  onClick: () => void;
}) {
  const color = CLASS_COLORS[cls];
  return (
    <button
      onClick={onClick}
      className="group relative w-full grid grid-cols-[64px_minmax(0,1fr)_auto] gap-4 items-center border border-line rounded-2xl p-4 sm:p-[18px_22px_18px_18px] bg-white/60 dark:bg-slate-800/40 text-left transition-all duration-[400ms] ease-smooth overflow-hidden hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-md"
    >
      {/* Left accent bar */}
      <span className="absolute left-0 top-3.5 bottom-3.5 w-[3px] rounded-r aurora-gradient scale-y-0 origin-center transition-transform duration-[450ms] ease-smooth group-hover:scale-y-100" />

      {/* Number */}
      <span
        className="font-display font-light italic text-[34px] leading-none text-center"
        style={{ color }}
      >
        {idx}
      </span>

      {/* Body */}
      <div className="flex flex-col gap-2 min-w-0">
        <span className="text-[16.5px] font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
          <span
            className="font-mono text-[9.5px] tracking-[.14em] uppercase py-0.5 px-1.5 rounded mr-2.5 inline-block align-[2px]"
            style={{
              color: '#0B1224',
              background: subject.accent,
            }}
          >
            {subject.en}
          </span>
          <HighlightName name={name} query={search} />
        </span>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-[200px] min-w-[90px] h-1 rounded bg-line overflow-hidden">
            <div
              className="h-full rounded"
              style={{ width: '0%', background: color }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-wider text-muted">0%</span>
        </div>
      </div>

      {/* Right: duration + arrow */}
      <div className="hidden sm:flex flex-col items-end gap-2">
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-muted">
          {mins} min
        </span>
        <ChevronRight
          size={16}
          className="text-muted transition-all duration-300 ease-smooth group-hover:translate-x-1 group-hover:text-teal"
        />
      </div>
    </button>
  );
}

/* Empty state */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-5 border border-dashed border-line rounded-3xl text-center">
      <Sparkles className="w-12 h-12 text-peri" />
      <h3 className="font-display text-2xl font-medium">No chapters found</h3>
      <p className="text-muted text-sm">
        Tokky suggests --{' '}
        <button
          onClick={onReset}
          className="text-teal font-semibold border-b border-teal/50 hover:opacity-75 transition-opacity"
        >
          clear your search
        </button>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar cards                                                      */
/* ------------------------------------------------------------------ */

function ContinueCard({ cls }: { cls: number }) {
  const navigate = useNavigate();
  // Show the first chapter of maths as a continue placeholder
  const chapters = CURRICULUM[cls]?.maths;
  if (!chapters || chapters.length === 0) return null;
  const ch = chapters[0];
  const subj = SUBJECTS.find((s) => s.key === 'maths')!;
  const chId = `c${cls}-${subj.code}-${ch[0]}`;

  return (
    <div className="border border-line rounded-3xl bg-white/60 dark:bg-slate-800/40 p-6 overflow-hidden">
      <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[.14em] uppercase text-muted mb-4">
        <span className="w-2 h-2 rounded-full aurora-gradient" />
        Continue learning
      </div>
      <div className="flex items-center gap-4">
        {/* Progress ring */}
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 84 84" className="w-full h-full -rotate-90">
            <circle cx="42" cy="42" r="36" fill="none" stroke="currentColor" strokeWidth="6" className="text-line" />
            <circle
              cx="42" cy="42" r="36" fill="none"
              stroke="url(#continueGrad)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={2 * Math.PI * 36}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold">
            0%
          </span>
          <defs>
            <linearGradient id="continueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3DE8C5" />
              <stop offset="100%" stopColor="#7C9BFF" />
            </linearGradient>
          </defs>
        </div>
        <div className="min-w-0">
          <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-amber block mb-1">
            Class {cls}
          </span>
          <span className="font-display text-lg font-semibold leading-snug block mb-3 truncate">
            {ch[1]}
          </span>
          <button
            onClick={() => navigate(`/lesson/${chId}`)}
            className="inline-flex items-center gap-1.5 aurora-gradient text-navy font-bold text-sm px-4 py-2 rounded-full shadow-lg shadow-teal/25 hover:-translate-y-0.5 transition-transform"
          >
            Resume
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BeyondCard() {
  const items = [
    { icon: Swords, label: 'Daily Challenge', href: '/challenge' },
    { icon: Trophy, label: 'Leaderboard', href: '/challenge' },
    { icon: Zap, label: 'Mock Tests', href: '/mocktest' },
  ];
  return (
    <div className="border border-line rounded-3xl bg-white/60 dark:bg-slate-800/40 p-6">
      <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[.14em] uppercase text-muted mb-4">
        <span className="w-2 h-2 rounded-full aurora-gradient" />
        Beyond academics
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3.5 py-3 px-1.5 border-b border-line last:border-0 rounded-xl transition-all duration-300 ease-smooth hover:bg-cream/50 dark:hover:bg-slate-700/40 hover:translate-x-0.5 no-underline group"
          >
            <span className="w-8 h-8 rounded-lg bg-cream dark:bg-slate-700 flex items-center justify-center text-muted shrink-0">
              <item.icon size={16} />
            </span>
            <span className="flex-1 text-sm font-semibold">{item.label}</span>
            <ChevronRight
              size={14}
              className="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

function StreakCard() {
  return (
    <div className="border border-line rounded-3xl p-6 bg-gradient-to-br from-teal/5 to-peri/5 flex items-center gap-4">
      <Sparkles className="w-10 h-10 text-peri shrink-0" />
      <p className="text-sm text-muted leading-snug">
        <strong className="text-ink">Tokky says:</strong> Pick any chapter and start.
        Even 10 minutes a day builds a real streak!
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN LEARN COMPONENT                                               */
/* ------------------------------------------------------------------ */
export default function Learn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialClass = Number(searchParams.get('class')) || 7;
  const initialSubject = searchParams.get('subject') || 'maths';

  const [cls, setCls] = useState(initialClass);
  const [subjectKey, setSubjectKey] = useState(initialSubject);
  const [search, setSearch] = useState('');

  // Reset subject if it doesn't exist for the selected class
  useEffect(() => {
    if (!CURRICULUM[cls]?.[subjectKey]) {
      setSubjectKey('maths');
    }
  }, [cls, subjectKey]);

  const activeSubject = SUBJECTS.find((s) => s.key === subjectKey) || SUBJECTS[0];

  const chapters = useMemo(() => {
    const list = CURRICULUM[cls]?.[subjectKey] || [];
    return list
      .map((ch, i) => ({
        id: `c${cls}-${activeSubject.code}-${ch[0]}`,
        slug: ch[0],
        name: ch[1],
        mins: ch[2],
        idx: i + 1,
        subject: activeSubject,
      }))
      .filter(
        (ch) => !search || ch.name.toLowerCase().includes(search.toLowerCase()),
      );
  }, [cls, subjectKey, search, activeSubject]);

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-10 relative z-10">
      {/* Hero */}
      <section className="pt-14 pb-4">
        <p className="font-mono text-[10.5px] tracking-[.14em] uppercase text-muted mb-5">
          Learn
        </p>
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 flex-wrap">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-none tracking-tight max-w-xl">
            Choose your <em className="aurora-text italic font-semibold">battlefield.</em>
          </h1>
          <div className="flex flex-col gap-2.5 items-start pb-2">
            <div className="flex items-center gap-2.5 border border-line rounded-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/40 text-sm font-medium">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber"
              >
                <rect x="3" y="11" width="18" height="10" rx="2.5" />
                <path d="M7 11 V7 a5 5 0 0 1 9.9 -1" />
                <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
              </svg>
              One subscription -- all classes unlocked
            </div>
            <div className="flex items-center gap-2.5 border border-line rounded-full px-4 py-2.5 bg-white/60 dark:bg-slate-800/40 text-sm font-medium text-muted">
              <Sparkles size={17} className="text-peri" />
              Study ahead or revisit any class -- no stigma
            </div>
          </div>
        </div>

        {/* Class switcher */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-10">
          {CLASSES.map((c) => (
            <ClassTab key={c} cls={c} active={cls === c} onClick={() => setCls(c)} />
          ))}
        </div>
      </section>

      {/* Main split: browser + panel */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_332px] gap-9 items-start pt-6 pb-24">
        {/* Left: subject rail, search, chapters */}
        <div>
          {/* Subject rail */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {SUBJECTS.map((s) => (
              <SubjectPill
                key={s.key}
                subject={s}
                count={chapterCount(cls, s.key)}
                active={subjectKey === s.key}
                onClick={() => {
                  setSubjectKey(s.key);
                  setSearch('');
                }}
              />
            ))}
          </div>

          {/* List head + search */}
          <div className="flex items-center justify-between gap-5 mb-4 flex-wrap">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              <span className="italic" style={{ color: activeSubject.accent }}>
                {activeSubject.en}
              </span>
            </h2>
            <div className="relative flex-1 max-w-sm min-w-[240px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none transition-colors"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search Class ${cls} chapters...`}
                aria-label="Search chapters"
                autoComplete="off"
                className="w-full bg-white/60 dark:bg-slate-800/40 border border-line rounded-full py-3 pl-11 pr-5 font-mono text-xs tracking-wider text-ink placeholder:text-muted placeholder:uppercase placeholder:tracking-widest placeholder:text-[11px] outline-none transition-all duration-300 ease-smooth focus:border-teal/45 focus:ring-4 focus:ring-teal/8"
              />
            </div>
          </div>

          {/* Chapter rows */}
          <div className="flex flex-col gap-2.5 min-h-[320px]">
            {chapters.length === 0 ? (
              <EmptyState onReset={() => setSearch('')} />
            ) : (
              chapters.map((ch) => (
                <ChapterRow
                  key={ch.id}
                  idx={ch.idx}
                  name={ch.name}
                  slug={ch.slug}
                  mins={ch.mins}
                  subject={ch.subject}
                  cls={cls}
                  search={search}
                  onClick={() => navigate(`/lesson/${ch.id}`)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: sticky panel */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-24">
          <ContinueCard cls={cls} />
          <BeyondCard />
          <StreakCard />
        </aside>
      </section>
    </main>
  );
}
