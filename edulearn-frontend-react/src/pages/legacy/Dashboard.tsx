import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getProgress } from '../lib/api';
import { SUBJECTS, CURRICULUM } from '../lib/curriculum';
import {
  BookOpen, Play, PenLine, Bot, Swords, Video,
  Upload, Users, BarChart3, Calendar,
  TrendingUp, Clock, Flame, ChevronRight,
  Award, Star, Zap, Target, Shield,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface DashData {
  streak?: number;
  minutes?: number[];
  mastery?: {
    subjects?: { key: string; pct: number }[];
    badges?: { id: string; label: string; sub?: string; earned: boolean }[];
  };
  teacher?: {
    className?: string;
    avg?: number;
    avgDelta?: number;
    weakTopics?: { name: string; pct: number; color: string }[];
    students?: any[];
  };
  parent?: {
    childName?: string;
    childClass?: string;
    streak?: number;
    weekHours?: string;
    allTime?: string;
    lastActive?: string;
    weekMinutes?: number[];
    alerts?: { color: string; text: string; time: string }[];
    attention?: any;
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function greetingWord(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function todayStr(): string {
  return new Date()
    .toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FeatCard({
  href,
  icon: Icon,
  title,
  sub,
}: {
  href: string;
  icon: any;
  title: string;
  sub: string;
}) {
  return (
    <Link
      to={href}
      className="group relative flex flex-col gap-2 p-5 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-transparent no-underline"
    >
      <span className="absolute top-0 left-0 right-0 h-[3px] aurora-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cream dark:bg-slate-700 text-teal group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </span>
      <span className="font-bold text-[15px] text-ink">{title}</span>
      <span className="text-xs text-muted leading-snug">{sub}</span>
    </Link>
  );
}

function WeekTile({
  icon: Icon,
  value,
  unit,
  caption,
  color,
}: {
  icon: any;
  value: string | number;
  unit: string;
  caption: string;
  color: string;
}) {
  return (
    <div
      className="relative rounded-2xl border-2 border-ink/10 p-4 pt-6 overflow-hidden"
      style={{ background: `color-mix(in srgb, ${color} 12%, white)` }}
    >
      <span
        className="absolute top-0 left-0 right-0 h-2.5 border-b-2 border-ink/10"
        style={{ background: color }}
      />
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-2 text-white"
        style={{ background: color }}
      >
        <Icon size={18} />
      </span>
      <span className="block font-display text-4xl font-extrabold leading-none text-ink">
        {value}
      </span>
      <span className="block font-mono text-[11px] tracking-widest uppercase text-ink/70 mt-1">
        {unit}
      </span>
      <p className="text-sm font-bold leading-snug mt-2 text-ink/90">{caption}</p>
    </div>
  );
}

function Donut({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2 w-20">
      <svg width="78" height="78" viewBox="0 0 78 78">
        <circle
          cx="39"
          cy="39"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-line"
        />
        <circle
          cx="39"
          cy="39"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)',
          }}
        />
        <text
          x="39"
          y="39"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink font-mono text-[15px]"
        >
          {pct}%
        </text>
      </svg>
      <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
        {label}
      </span>
    </div>
  );
}

function Badge({
  label,
  sub,
  earned,
}: {
  label: string;
  sub?: string;
  earned: boolean;
}) {
  const icons = [Star, Award, Zap, Target, Shield, Flame];
  const Icon = icons[Math.abs(label.length) % icons.length];
  return (
    <div
      className={`flex flex-col items-center gap-2 w-28 ${
        !earned ? 'opacity-40 grayscale' : ''
      }`}
    >
      <div className="w-20 h-20 rounded-full aurora-gradient flex items-center justify-center text-navy">
        <Icon size={32} />
      </div>
      <span className="text-xs font-semibold text-center leading-snug">{label}</span>
      {sub && (
        <span className="font-mono text-[9px] tracking-widest uppercase text-muted text-center">
          {sub}
        </span>
      )}
    </div>
  );
}

function SubjectMapCard({
  subjectKey,
  accent,
  cls,
}: {
  subjectKey: string;
  accent: string;
  cls: number;
}) {
  const subj = SUBJECTS.find((s) => s.key === subjectKey);
  if (!subj) return null;
  const chapters = CURRICULUM[cls]?.[subjectKey] || [];
  return (
    <Link
      to={`/learn?class=${cls}&subject=${subjectKey}`}
      className="block rounded-2xl border-2 border-ink/10 overflow-hidden no-underline text-ink transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: `color-mix(in srgb, ${accent} 14%, white)`,
        boxShadow: `4px 4px 0 ${accent}`,
      }}
    >
      <div
        className="w-full h-12 border-b-2 border-ink/10"
        style={{ background: accent }}
      />
      <div className="px-4 pt-3 pb-4">
        <span className="block text-base font-extrabold">{subj.en}</span>
        <span className="block text-xs font-bold opacity-75 mt-0.5">
          {chapters.length} chapters
        </span>
        <div className="h-2.5 border-2 border-ink/10 rounded-full bg-white mt-2.5 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: '0%', background: accent }}
          />
        </div>
        <span className="block font-mono text-[10px] font-bold tracking-widest uppercase mt-2">
          Start learning
        </span>
      </div>
    </Link>
  );
}

function HBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr_44px] items-center gap-3">
      <span className="text-sm font-semibold truncate">{label}</span>
      <div className="h-2.5 rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-smooth"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="font-mono text-xs text-muted text-right">{pct}%</span>
    </div>
  );
}

function RosterRow({ student }: { student: any }) {
  const mastery = student.mastery ?? 0;
  const barColor =
    mastery >= 70 ? '#3DE8C5' : mastery >= 40 ? '#FFB454' : '#FF7AA2';
  return (
    <tr className="border-b border-line/50 hover:bg-black/[.02] transition-colors">
      <td className="py-3 px-3 text-sm font-semibold whitespace-nowrap">
        {student.name || 'Student'}
      </td>
      <td className="py-3 px-3 text-sm text-muted whitespace-nowrap">
        {student.weekTime || '--'}
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="inline-flex items-center gap-2">
          <div className="w-28 h-1.5 rounded-full bg-line overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${mastery}%`, background: barColor }}
            />
          </div>
          <span className="font-mono text-xs text-muted">{mastery}%</span>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="font-mono text-[10px] tracking-wider uppercase text-muted border border-line rounded-full px-2.5 py-1">
          {student.weakTopic || '--'}
        </span>
      </td>
      <td className="py-3 px-3">
        {student.status === 'help' ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose">
            <span className="w-2 h-2 rounded-full bg-rose shadow-[0_0_6px] shadow-rose" />
            Needs help
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal">
            <span className="w-2 h-2 rounded-full bg-teal shadow-[0_0_6px] shadow-teal" />
            On track
          </span>
        )}
      </td>
    </tr>
  );
}

function AlertRow({
  color,
  text,
  time,
}: {
  color: string;
  text: string;
  time: string;
}) {
  const dotColors: Record<string, string> = {
    teal: 'bg-teal',
    rose: 'bg-rose',
    peri: 'bg-peri',
    amber: 'bg-amber',
  };
  return (
    <div className="flex items-start gap-3.5 py-3.5 px-1 border-b border-line/30 last:border-0 hover:bg-black/[.01] transition-colors">
      <span
        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
          dotColors[color] || 'bg-teal'
        }`}
      />
      <div className="flex-1">
        <p className="text-sm font-medium leading-snug">{text}</p>
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted mt-0.5 block">
          {time}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Charts                                                             */
/* ------------------------------------------------------------------ */

function BarChart({ minutes }: { minutes: number[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...minutes, 1);
  const barW = 32;
  const gap = (380 - 7 * barW) / 8;
  const chartH = 150;

  return (
    <svg viewBox="0 0 380 188" className="w-full h-auto">
      <defs>
        <linearGradient id="barAur" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3DE8C5" />
          <stop offset="60%" stopColor="#7C9BFF" />
          <stop offset="100%" stopColor="#FFB454" />
        </linearGradient>
      </defs>
      {minutes.map((m, i) => {
        const x = gap + i * (barW + gap);
        const h = (m / max) * chartH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={20}
              width={barW}
              height={chartH}
              rx={6}
              fill="currentColor"
              className="text-line"
            />
            <rect
              x={x}
              y={20 + chartH - h}
              width={barW}
              height={h}
              rx={6}
              fill="url(#barAur)"
            />
            <text
              x={x + barW / 2}
              y={chartH + 36}
              textAnchor="middle"
              className="fill-muted font-mono text-[10px]"
            >
              {days[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AreaChart({ minutes }: { minutes: number[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...minutes, 1);
  const w = 380;
  const h = 140;
  const padX = 10;
  const padY = 10;
  const step = (w - 2 * padX) / (minutes.length - 1 || 1);

  const points = minutes.map((m, i) => ({
    x: padX + i * step,
    y: padY + h - (m / max) * h,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${padY + h} L${points[0].x},${padY + h} Z`;

  return (
    <svg viewBox={`0 0 ${w} 175`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3DE8C5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7C9BFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="areaLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3DE8C5" />
          <stop offset="100%" stopColor="#7C9BFF" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="url(#areaLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle
          key={`dot-${i}`}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#3DE8C5"
          stroke="white"
          strokeWidth="2"
        />
      ))}
      {points.map((p, i) => (
        <text
          key={`lbl-${i}`}
          x={p.x}
          y={padY + h + 20}
          textAnchor="middle"
          className="fill-muted font-mono text-[10px]"
        >
          {days[i]}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  STUDENT VIEW                                                       */
/* ------------------------------------------------------------------ */
function StudentView({
  data,
  user: _user,
  cls,
}: {
  data: DashData;
  user: any;
  cls: number;
}) {
  const streak = data.streak ?? 0;
  const minutes = data.minutes ?? [0, 0, 0, 0, 0, 0, 0];
  const weekTotal = minutes.reduce((a, b) => a + b, 0);
  const masterySubjects = data.mastery?.subjects ?? [];
  const badges = data.mastery?.badges ?? [];
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-6">
      {/* Feature menu */}
      <div>
        <span className="block font-mono text-[10px] tracking-[.18em] uppercase text-muted mb-3">
          My Learning
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <FeatCard href="/learn" icon={BookOpen} title="Learn" sub="Browse chapters & video lessons" />
          <FeatCard href="/videos" icon={Play} title="Video Lectures" sub="Watch lectures for your class" />
          <FeatCard href="/mocktest" icon={PenLine} title="Mock Tests" sub="Practice & track your scores" />
          <FeatCard href="/pal" icon={Bot} title="PAL AI Tutor" sub="Ask doubts, get step-by-step help" />
          <FeatCard href="/challenge" icon={Swords} title="Arena" sub="Challenges & leaderboards" />
          <FeatCard href="/live" icon={Video} title="Join Live Class" sub="Attend your scheduled classes" />
        </div>
      </div>

      {/* Subject map */}
      <div>
        <span className="block font-mono text-[10px] tracking-[.18em] uppercase text-muted mb-3">
          My subjects
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SUBJECTS.map((s) => (
            <SubjectMapCard key={s.key} subjectKey={s.key} accent={s.accent} cls={cls} />
          ))}
        </div>
      </div>

      {/* Your week */}
      <div>
        <span className="block font-mono text-[10px] tracking-[.18em] uppercase text-muted mb-3">
          Your week
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <WeekTile icon={Clock} value={weekTotal} unit="minutes" caption="Total study time this week" color="#7C9BFF" />
          <WeekTile icon={Flame} value={streak} unit="day streak" caption="Keep your streak alive!" color="#FFB454" />
          <WeekTile icon={BookOpen} value={SUBJECTS.length} unit="subjects" caption="Subjects you're covering" color="#3DE8C5" />
          <WeekTile icon={Target} value={earnedCount} unit="badges" caption="Achievements earned so far" color="#FF7AA2" />
        </div>
      </div>

      {/* Weekly minutes + mastery donuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-display text-xl font-medium">Weekly minutes</h3>
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
              Last 7 days
            </span>
          </div>
          <BarChart minutes={minutes} />
          <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-line">
            <div>
              <span className="font-display text-3xl font-medium">{weekTotal}</span>
              <span className="text-sm text-muted ml-1.5">min this week</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-display text-xl font-medium">Subject mastery</h3>
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">NCERT</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center pt-1">
            {SUBJECTS.map((s) => {
              const found = masterySubjects.find((ms) => ms.key === s.key);
              return (
                <Donut
                  key={s.key}
                  pct={found?.pct ?? 0}
                  color={s.accent}
                  label={s.en.slice(0, 5)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Badge shelf */}
      <div className="border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl font-medium">Badge shelf</h3>
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
            {earnedCount} of {badges.length || 6} earned
          </span>
        </div>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-5">
            {badges.map((b, i) => (
              <Badge key={i} label={b.label} sub={b.sub} earned={b.earned} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Complete chapters and tests to earn badges.
          </p>
        )}
        <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent mt-5" />
      </div>

      {/* AI recommends + learning rhythm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <div className="flex items-center gap-4 mb-5">
            <Bot className="w-10 h-10 text-peri" />
            <div>
              <h3 className="font-display text-xl font-medium">AI recommends</h3>
              <p className="text-sm text-muted mt-0.5">
                Personalised gap analysis appears here as you practise.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted px-0.5">
            No gaps flagged yet -- take a mock test or complete a chapter and Tokky
            will point out exactly what to revise.
          </p>
        </div>

        <div className="lg:col-span-4 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <h3 className="font-display text-lg font-medium mb-3">Learning rhythm</h3>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-2">
            This month
          </p>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, i) => {
              // placeholder heatmap cells
              const level = ((i * 7 + 3) % 11) / 10;
              const bg =
                level > 0.8
                  ? 'bg-teal'
                  : level > 0.5
                  ? 'bg-teal/60'
                  : level > 0.3
                  ? 'bg-teal/30'
                  : 'bg-line';
              return <div key={i} className={`w-full aspect-square rounded-sm ${bg}`} />;
            })}
          </div>
        </div>
      </div>

      {/* Continue learning */}
      <div className="border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl font-medium">Continue learning</h3>
          <Link
            to="/learn"
            className="font-mono text-[10px] tracking-widest uppercase text-muted hover:text-ink transition-colors no-underline"
          >
            All chapters &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.slice(0, 3).map((s) => {
            const chapters = CURRICULUM[cls]?.[s.key];
            if (!chapters || chapters.length === 0) return null;
            const ch = chapters[0];
            const chId = `c${cls}-${s.code}-${ch[0]}`;
            return (
              <Link
                key={chId}
                to={`/lesson/${chId}`}
                className="block border border-line rounded-2xl p-5 bg-cream/30 dark:bg-slate-700/30 hover:-translate-y-0.5 hover:shadow-md transition-all no-underline"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border"
                    style={{
                      color: s.accent,
                      borderColor: `${s.accent}60`,
                      background: `${s.accent}12`,
                    }}
                  >
                    Class {cls}
                  </span>
                  <ChevronRight size={14} className="text-muted" />
                </div>
                <h4 className="font-display text-lg font-medium mb-1 truncate">
                  {ch[1]}
                </h4>
                <p className="text-xs text-muted mb-4">
                  {s.en} &middot; {ch[2]} min
                </p>
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full aurora-gradient"
                    style={{ width: '0%' }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
                    Progress
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-teal">
                    0%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TEACHER VIEW                                                       */
/* ------------------------------------------------------------------ */
function TeacherView({ data }: { data: DashData }) {
  const t = data.teacher ?? {};
  const avg = t.avg ?? 0;
  const weakTopics = t.weakTopics ?? [];
  const students = t.students ?? [];

  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (avg / 100) * c;

  return (
    <div className="space-y-6">
      {/* Feature menu */}
      <div>
        <span className="block font-mono text-[10px] tracking-[.18em] uppercase text-muted mb-3">
          Teaching Tools
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <FeatCard href="/upload" icon={Upload} title="Upload Lecture" sub="Add an animated video lecture" />
          <FeatCard href="/videos" icon={Play} title="Video Library" sub="All lectures on the platform" />
          <FeatCard href="/live" icon={Video} title="Start Live Class" sub="Host a class for your section" />
          <FeatCard href="/create-test" icon={PenLine} title="Create a Test" sub="Timed, auto-graded -- get a link" />
          <FeatCard href="/dashboard#roster" icon={Users} title="Class Roster" sub="View students & performance" />
          <FeatCard href="/pal" icon={Bot} title="PAL for Teachers" sub="Lesson planning & insights" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-medium">
          Your class &middot;{' '}
          <em className="text-amber italic">{t.className || 'loading...'}</em>
        </h2>
        <Link
          to="/create-test"
          className="inline-flex items-center gap-2 aurora-gradient text-navy font-bold text-sm px-5 py-2.5 rounded-full no-underline hover:-translate-y-0.5 transition-transform shadow-lg shadow-teal/25"
        >
          Create a test
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Class average ring */}
        <div className="lg:col-span-4 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <h3 className="font-display text-xl font-medium mb-5">Class average</h3>
          <svg viewBox="0 0 130 130" className="w-40 h-40 mx-auto">
            <defs>
              <linearGradient id="auroraRingT" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3DE8C5" />
                <stop offset="55%" stopColor="#7C9BFF" />
                <stop offset="100%" stopColor="#FFB454" />
              </linearGradient>
            </defs>
            <circle
              cx="65" cy="65" r={r} fill="none"
              stroke="currentColor" strokeWidth="9" className="text-line"
            />
            <circle
              cx="65" cy="65" r={r} fill="none"
              stroke="url(#auroraRingT)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={offset}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)',
              }}
            />
            <text x="65" y="68" textAnchor="middle" className="fill-ink font-display text-[40px] font-medium">
              {avg}%
            </text>
            <text x="65" y="86" textAnchor="middle" className="fill-muted font-mono text-[9px] tracking-[.14em]">
              MASTERY
            </text>
          </svg>
          {t.avgDelta != null && (
            <div className="flex justify-center mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/10 border border-teal/30 font-mono text-xs text-teal">
                <TrendingUp size={12} /> +{t.avgDelta}% this week
              </span>
            </div>
          )}
        </div>

        {/* Weak topics */}
        <div className="lg:col-span-8 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-display text-xl font-medium">Weak topics this week</h3>
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
              AVG CORRECT %
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {weakTopics.length > 0 ? (
              weakTopics.map((wt, i) => (
                <HBar key={i} label={wt.name} pct={wt.pct} color={wt.color || '#FF7AA2'} />
              ))
            ) : (
              <p className="text-sm text-muted">
                No weak topics identified yet. Students need to take more assessments.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Student roster */}
      <div className="border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6" id="roster">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl font-medium">Students</h3>
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
            Click mastery to sort
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                {['Student', 'Time this week', 'Mastery', 'Weak topic', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      className="font-mono text-[10px] tracking-[.14em] uppercase text-muted font-normal text-left pb-3 px-3 border-b border-line"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s: any, i: number) => (
                  <RosterRow key={i} student={s} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted">
                    No students found. Students will appear here once they join your
                    class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PARENT VIEW                                                        */
/* ------------------------------------------------------------------ */
function ParentView({ data, user }: { data: DashData; user: any }) {
  const p = data.parent ?? {};
  const childName = p.childName || user?.childName || 'Your child';
  const initials = childName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Feature menu */}
      <div>
        <span className="block font-mono text-[10px] tracking-[.18em] uppercase text-muted mb-3">
          Parent Tools
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <FeatCard href="/dashboard#child" icon={BarChart3} title="Child's Progress" sub="Streak, minutes & chapters" />
          <FeatCard href="/dashboard#attention" icon={Calendar} title="Attendance" sub="Class attendance & activity" />
          <FeatCard href="/pal" icon={Bot} title="PAL for Parents" sub="Guidance to support learning" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Child summary */}
        <div
          className="lg:col-span-5 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6 space-y-4"
          id="child"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full aurora-gradient flex items-center justify-center text-navy font-display text-xl font-semibold shrink-0">
              {initials}
            </div>
            <div>
              <div className="font-display text-2xl font-medium">{childName}</div>
              <div className="font-mono text-xs tracking-widest uppercase text-amber">
                {p.childClass || user?.childClass || ''}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: p.streak ?? '--', lbl: 'day streak' },
              { val: p.weekHours ?? '--', lbl: 'this week' },
              { val: p.allTime ?? '--', lbl: 'all-time' },
            ].map((s) => (
              <div
                key={s.lbl}
                className="border border-line rounded-xl p-3 bg-cream/30 dark:bg-slate-700/30"
              >
                <span className="block font-display text-2xl font-medium">{s.val}</span>
                <span className="font-mono text-[9px] tracking-widest uppercase text-muted">
                  {s.lbl}
                </span>
              </div>
            ))}
          </div>
          {p.lastActive && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-teal" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
                {p.lastActive}
              </span>
            </div>
          )}
        </div>

        {/* Area chart */}
        <div className="lg:col-span-7 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-display text-xl font-medium">Learning time this week</h3>
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
              MIN / DAY
            </span>
          </div>
          <AreaChart minutes={p.weekMinutes ?? [0, 0, 0, 0, 0, 0, 0]} />
        </div>
      </div>

      {/* Alerts + reassurance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-display text-xl font-medium">Alerts</h3>
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
              THIS WEEK
            </span>
          </div>
          {p.alerts && p.alerts.length > 0 ? (
            <div className="flex flex-col">
              {p.alerts.map((a, i) => (
                <AlertRow key={i} color={a.color} text={a.text} time={a.time} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              No activity yet this week -- alerts about your child's tests, streaks and
              gaps will appear here.
            </p>
          )}
        </div>

        <div className="lg:col-span-5 border border-line rounded-2xl p-6 bg-gradient-to-br from-teal/5 to-peri/5">
          <h4 className="font-display text-lg font-medium mb-2">
            Built to never block learning
          </h4>
          <p className="text-sm text-muted leading-relaxed">
            All learning works offline -- videos, practice and tests run without
            internet, and usage syncs automatically when you are back online.
          </p>
          <div className="h-px bg-line my-4" />
          <div className="flex gap-3 items-start text-sm leading-snug">
            <BookOpen size={16} className="text-teal shrink-0 mt-0.5" />
            <span>
              <b>Multi-grade access:</b> your child can revisit any earlier-class
              chapter anytime -- quietly, stigma-free.
            </span>
          </div>
        </div>
      </div>

      {/* Live class attention */}
      <div
        className="border border-line rounded-2xl bg-white/60 dark:bg-slate-800/40 p-6"
        id="attention"
      >
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl font-medium">Live class attention</h3>
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
            CAMERA-MONITORED
          </span>
        </div>
        <p className="text-sm text-muted">
          Attention data will appear here after your child attends live classes.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN DASHBOARD COMPONENT                                           */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const { user, role, loggedIn } = useAuth();
  const [data, setData] = useState<DashData>({});
  const [activeRole, setActiveRole] = useState(role);
  const [loading, setLoading] = useState(true);

  const cls = useMemo(() => {
    const cn = user?.className || '';
    const match = cn.match(/\d+/);
    return match ? parseInt(match[0], 10) : 7;
  }, [user]);

  useEffect(() => {
    setActiveRole(role);
  }, [role]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [dash] = await Promise.allSettled([getDashboard(), getProgress()]);
        if (!mounted) return;
        const d = dash.status === 'fulfilled' ? dash.value : {};
        setData(d);
      } catch {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (loggedIn) load();
    else setLoading(false);
    return () => {
      mounted = false;
    };
  }, [loggedIn]);

  const roles = ['student', 'teacher', 'parent'] as const;

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-8 pb-24 relative z-10">
      {/* Top strip */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-12 pb-7">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-light leading-tight tracking-tight">
            Good{' '}
            <em className="aurora-text italic font-medium">{greetingWord()}</em>,{' '}
            {user?.name?.split(' ')[0] || 'Learner'}.
          </h1>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="font-mono text-xs tracking-widest uppercase text-muted">
              {todayStr()}
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-amber/30 rounded-full bg-amber/5">
              <Flame size={14} className="text-amber" />
              <b className="font-mono text-sm text-amber">{data.streak ?? 0}</b>
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
                day streak
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <div className="relative flex border border-line rounded-full p-1 bg-navy/5 dark:bg-white/5">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`relative z-10 px-5 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeRole === r
                    ? 'aurora-gradient text-navy'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
            One platform &middot; three views
          </span>
        </div>
      </header>

      {/* View content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeRole === 'student' && (
            <StudentView data={data} user={user} cls={cls} />
          )}
          {activeRole === 'teacher' && <TeacherView data={data} />}
          {activeRole === 'parent' && <ParentView data={data} user={user} />}
        </>
      )}
    </main>
  );
}
