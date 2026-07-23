import { useState } from 'react';
import { SUBJECTS, CURRICULUM } from '../lib/curriculum';
import { createQuestion } from '../lib/api';
import { Plus, CheckCircle } from 'lucide-react';

export default function CreateTest() {
  const [subject, setSubject] = useState('maths');
  const [cls, setCls] = useState(7);
  const [chapterSlug, setChapterSlug] = useState('');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [explanation, setExplanation] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  const chapters = CURRICULUM[cls]?.[subject] || [];
  const LETTERS = ['A', 'B', 'C', 'D'];

  async function handleSave() {
    if (!text.trim() || options.some(o => !o.trim())) {
      setMsg({ text: 'Fill in all fields.', ok: false });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await createQuestion({
        subject,
        className: `Class ${cls}`,
        chapterSlug: chapterSlug || undefined,
        text: text.trim(),
        options: options.map(o => o.trim()),
        correctIndex: correct,
        difficulty,
        explanation: explanation.trim() || undefined,
      });
      setMsg({ text: 'Question saved!', ok: true });
      setSavedCount(c => c + 1);
      // Reset form
      setText('');
      setOptions(['', '', '', '']);
      setCorrect(0);
      setExplanation('');
    } catch (err: any) {
      setMsg({ text: err.message || 'Failed to save.', ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium mb-2">Create Test Questions</h1>
        <p className="text-muted">Author MCQ questions for your students. {savedCount > 0 && `(${savedCount} saved this session)`}</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/80 border border-line space-y-5">
        {/* Class & Subject */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Class</label>
            <select value={cls} onChange={e => setCls(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal">
              {[6,7,8,9].map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal">
              {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.en}</option>)}
            </select>
          </div>
        </div>

        {/* Chapter */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Chapter</label>
          <select value={chapterSlug} onChange={e => setChapterSlug(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal">
            <option value="">General (no chapter)</option>
            {chapters.map(ch => <option key={ch[0]} value={ch[0]}>{ch[1]}</option>)}
          </select>
        </div>

        {/* Question text */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Question</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            placeholder="Enter the question text..."
            className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal resize-none"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Options (click to mark correct)</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorrect(i)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    correct === i ? 'bg-teal text-navy' : 'bg-cream border border-line text-muted'
                  }`}
                >
                  {LETTERS[i]}
                </button>
                <input
                  value={opt}
                  onChange={e => {
                    const n = [...options];
                    n[i] = e.target.value;
                    setOptions(n);
                  }}
                  placeholder={`Option ${LETTERS[i]}`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal"
                />
                {correct === i && <CheckCircle className="w-5 h-5 text-teal shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm text-muted mb-1.5">Explanation (optional)</label>
          <textarea
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            rows={2}
            placeholder="Explain why the correct answer is right..."
            className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal resize-none"
          />
        </div>

        {msg && (
          <p className={`text-sm ${msg.ok ? 'text-teal' : 'text-danger'}`}>{msg.text}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> {saving ? 'Saving...' : 'Save question'}
        </button>
      </div>
    </div>
  );
}
