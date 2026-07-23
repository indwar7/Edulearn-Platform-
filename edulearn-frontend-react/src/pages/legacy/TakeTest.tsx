import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { answerMockQuestion, submitMockTest } from '../lib/api';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function TakeTest() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState<Record<number, any>>({});
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The attempt data should be passed via navigation state or fetched
    // For now, we try to get it from sessionStorage
    const stored = sessionStorage.getItem(`test_${attemptId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setQuestions(data.questions || []);
      setAnswers(new Array(data.questions?.length || 0).fill(null));
      setTimer((data.questions?.length || 10) * 60); // 1 min per question
    }
    setLoading(false);
  }, [attemptId]);

  useEffect(() => {
    if (finished || timer <= 0 || loading) return;
    const t = setInterval(() => setTimer(s => {
      if (s <= 1) { handleFinish(); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [finished, timer, loading]);

  async function handleAnswer(chosenIndex: number) {
    if (!attemptId) return;
    const newAnswers = [...answers];
    newAnswers[current] = chosenIndex;
    setAnswers(newAnswers);

    try {
      const data = await answerMockQuestion(attemptId, current, chosenIndex);
      setRevealed(prev => ({ ...prev, [current]: data }));
    } catch {}
  }

  async function handleFinish() {
    if (!attemptId || finished) return;
    setFinished(true);
    try {
      const data = await submitMockTest(attemptId, answers as any[]);
      setResult(data);
    } catch {
      setResult({ score: 0, total: questions.length });
    }
  }

  const LETTERS = ['A', 'B', 'C', 'D'];
  const mins = Math.floor(timer / 60);
  const secs = timer % 60;
  const q = questions[current];
  const rev = revealed[current];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="text-muted mb-4">No test data found. Please start a new test.</p>
        <button onClick={() => navigate('/mocktest')} className="text-teal font-semibold">
          Back to Mock Tests
        </button>
      </div>
    );
  }

  if (finished && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="p-10 rounded-2xl bg-white/80 border border-line">
          {pct >= 70 ? (
            <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-amber mx-auto mb-4" />
          )}
          <div className="text-6xl font-bold aurora-text mb-2">{result.score}/{result.total}</div>
          <div className="text-2xl font-semibold mb-1">{pct}%</div>
          <p className="text-muted mb-6">
            {pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/mocktest')}
              className="px-6 py-3 rounded-xl border border-line text-sm font-semibold hover:bg-black/5 transition-colors"
            >
              Back to tests
            </button>
            <button
              onClick={() => navigate('/mocktest')}
              className="px-6 py-3 rounded-xl aurora-gradient text-navy text-sm font-bold hover:scale-105 transition-transform"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/mocktest')} className="flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <div className="text-sm font-medium">
          Question {current + 1} of {questions.length}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-sm ${
          timer < 60 ? 'bg-danger/10 text-danger' : 'bg-teal/10 text-teal'
        }`}>
          <Clock className="w-4 h-4" /> {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-8">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-teal' : answers[i] !== null ? 'w-2 bg-teal/40' : 'w-2 bg-line'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      {q && (
        <div className="p-8 rounded-2xl bg-white/80 border border-line mb-6">
          <h2 className="text-xl font-semibold mb-6 leading-relaxed">{q.text}</h2>
          <div className="grid grid-cols-2 gap-3">
            {(q.options || []).map((opt: string, i: number) => {
              const isChosen = answers[current] === i;
              const isCorrect = rev && rev.correctIndex === i;
              const isWrong = rev && isChosen && !isCorrect;
              return (
                <button
                  key={i}
                  onClick={() => !rev && handleAnswer(i)}
                  disabled={!!rev}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isCorrect ? 'border-teal bg-teal/10' :
                    isWrong ? 'border-danger bg-danger/10' :
                    isChosen ? 'border-teal bg-teal/5' :
                    'border-line bg-white/60 hover:border-teal hover:shadow-md'
                  } disabled:cursor-default`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cream text-xs font-bold mr-3">
                    {LETTERS[i]}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {rev?.explanation && (
            <div className="mt-4 p-4 rounded-xl bg-peri/5 border-l-4 border-peri text-sm text-muted">
              {rev.explanation}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl border border-line text-sm disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl aurora-gradient text-navy text-sm font-bold"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="px-6 py-2 rounded-xl aurora-gradient text-navy text-sm font-bold hover:scale-105 transition-transform"
          >
            Finish test
          </button>
        )}
      </div>
    </div>
  );
}
