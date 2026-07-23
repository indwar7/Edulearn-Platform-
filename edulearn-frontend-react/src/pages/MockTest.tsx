import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBJECTS, CURRICULUM } from '../lib/curriculum';
import { startMockTest, getMockHistory } from '../lib/api';
import { Trophy, BookOpen, Clock, ChevronRight } from 'lucide-react';

export default function MockTest() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [count, setCount] = useState(10);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMockHistory()
      .then(data => setHistory(data.attempts || []))
      .catch(() => {});
  }, []);

  async function handleStart() {
    if (!selectedSubject) return;
    setLoading(true);
    setError('');
    try {
      const data = await startMockTest(selectedSubject, selectedChapter || undefined, count);
      navigate(`/take-test/${data.attemptId}`);
    } catch (err: any) {
      setError(err.message || 'Could not start test');
    } finally {
      setLoading(false);
    }
  }

  const chapters = selectedSubject ? (CURRICULUM[7]?.[selectedSubject] || []) : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-peri mb-2">
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-mono tracking-wider uppercase">Mock Tests</span>
        </div>
        <h1 className="font-display text-4xl font-medium mb-2">
          Progressive <span className="aurora-text">mock tests</span>
        </h1>
        <p className="text-muted">Adaptive questions that match your level. Pick a subject to begin.</p>
      </div>

      {!selectedSubject ? (
        /* Subject picker */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {SUBJECTS.map(s => (
            <button
              key={s.key}
              onClick={() => setSelectedSubject(s.key)}
              className="p-6 rounded-2xl bg-white/80 border border-line hover:shadow-lg hover:-translate-y-1 transition-all ease-smooth text-left"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: s.accent + '22' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: s.accent }} />
              </div>
              <h3 className="font-semibold text-lg">{s.en}</h3>
              <p className="text-sm text-muted mt-1">{(CURRICULUM[7]?.[s.key] || []).length} chapters</p>
            </button>
          ))}
        </div>
      ) : (
        /* Setup */
        <div className="max-w-lg mb-8 space-y-4">
          <button onClick={() => setSelectedSubject(null)} className="text-sm text-teal mb-2">
            &larr; Back to subjects
          </button>
          <div className="p-6 rounded-2xl bg-white/80 border border-line space-y-4">
            <h2 className="font-display text-xl font-medium">
              {SUBJECTS.find(s => s.key === selectedSubject)?.en} Test
            </h2>

            <div>
              <label className="block text-sm text-muted mb-1.5">Chapter (optional)</label>
              <select
                value={selectedChapter}
                onChange={e => setSelectedChapter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal"
              >
                <option value="">All chapters</option>
                {chapters.map(ch => (
                  <option key={ch[0]} value={ch[0]}>{ch[1]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Number of questions</label>
              <select
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal"
              >
                {[5, 10, 15, 20].map(n => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full py-3.5 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
            >
              {loading ? 'Starting...' : 'Start test'}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-medium mb-4">Past attempts</h2>
          <div className="space-y-2">
            {history.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-line">
                <div className="w-10 h-10 rounded-lg bg-peri/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-peri" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{a.subject || a.testName}</div>
                  <div className="text-xs text-muted flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {a.finishedAt ? new Date(a.finishedAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{a.score}/{a.total}</div>
                  <div className="text-xs text-muted">{Math.round((a.score / a.total) * 100)}%</div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
