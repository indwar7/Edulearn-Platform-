import { useState, useEffect, useCallback } from 'react';
import { getChallenge, answerChallenge, getChallengeLeaderboard } from '../lib/api';
import { Zap, Clock, Trophy, Flame, Target, CheckCircle, XCircle } from 'lucide-react';

type State = 'loading' | 'waiting' | 'playing' | 'result' | 'already';

export default function Challenge() {
  const [state, setState] = useState<State>('loading');
  const [question, setQuestion] = useState<any>(null);
  const [timer, setTimer] = useState(45);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [nextDrop, setNextDrop] = useState('');

  const loadChallenge = useCallback(async () => {
    try {
      const data = await getChallenge();
      if (data.alreadyPlayed) {
        setResult({ points: data.points, correct: data.correct });
        setState('already');
      } else if (data.question) {
        setQuestion(data.question);
        setTimer(45);
        setState('playing');
      } else {
        setState('waiting');
      }
    } catch {
      setState('waiting');
    }
  }, []);

  useEffect(() => { loadChallenge(); }, [loadChallenge]);

  useEffect(() => {
    getChallengeLeaderboard()
      .then(data => { setLeaderboard(data.leaderboard || []); setMyRank(data.you); })
      .catch(() => {});
  }, [state]);

  // Timer countdown
  useEffect(() => {
    if (state !== 'playing' || timer <= 0) return;
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [state, timer]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (state === 'playing' && timer <= 0 && selected === null) {
      handleAnswer(-1);
    }
  }, [timer, state, selected]);

  // Next hour countdown
  useEffect(() => {
    if (state !== 'waiting' && state !== 'already') return;
    const updateNext = () => {
      const now = new Date();
      const mins = 59 - now.getMinutes();
      const secs = 59 - now.getSeconds();
      setNextDrop(`${mins}m ${secs}s`);
    };
    updateNext();
    const t = setInterval(updateNext, 1000);
    return () => clearInterval(t);
  }, [state]);

  async function handleAnswer(chosenIndex: number) {
    if (selected !== null) return;
    setSelected(chosenIndex);
    const msTaken = (45 - timer) * 1000;
    try {
      const data = await answerChallenge(question._id || question.questionId, chosenIndex, msTaken);
      setResult(data);
      setState('result');
    } catch {
      setState('result');
      setResult({ points: 0, correct: false });
    }
  }

  const LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main area */}
        <div className="lg:col-span-2">
          {/* Hero */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-amber mb-2">
              <Zap className="w-5 h-5" />
              <span className="text-xs font-mono tracking-wider uppercase">Arena</span>
            </div>
            <h1 className="font-display text-4xl font-medium mb-2">
              One question. <span className="aurora-text">Every hour.</span>
            </h1>
            <p className="text-muted">Compete, build your streak, and climb the leaderboard.</p>
          </div>

          {/* States */}
          {state === 'loading' && (
            <div className="p-12 rounded-2xl bg-white/80 border border-line text-center">
              <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {(state === 'waiting' || state === 'already') && (
            <div className="p-12 rounded-2xl bg-white/80 border border-line text-center">
              <Clock className="w-12 h-12 text-peri mx-auto mb-4" />
              <h2 className="font-display text-2xl font-medium mb-2">
                {state === 'already' ? 'Already played this hour!' : 'Next drop coming...'}
              </h2>
              <p className="text-muted mb-4">Next question in <span className="font-bold text-teal">{nextDrop}</span></p>
              {state === 'already' && result && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10">
                  <Trophy className="w-4 h-4 text-teal" />
                  <span className="font-bold text-teal">+{result.points} points</span>
                </div>
              )}
            </div>
          )}

          {state === 'playing' && question && (
            <div className="p-8 rounded-2xl bg-white/80 border border-line">
              {/* Timer */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted">Answer within 45 seconds</span>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold ${
                  timer <= 10 ? 'bg-danger/10 text-danger animate-pulse' : 'bg-amber/10 text-amber'
                }`}>
                  <Clock className="w-4 h-4" /> {timer}s
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold mb-6 leading-relaxed">{question.text}</h2>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {(question.options || []).map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selected === i
                        ? 'border-teal bg-teal/10 ring-2 ring-teal/30'
                        : 'border-line bg-white/60 hover:border-teal hover:shadow-md'
                    } disabled:cursor-default`}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cream text-xs font-bold mr-3">
                      {LETTERS[i]}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {state === 'result' && result && (
            <div className="p-12 rounded-2xl bg-white/80 border border-line text-center">
              {result.correct ? (
                <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
              )}
              <div className="text-5xl font-bold aurora-text mb-2">+{result.points || 0}</div>
              <p className="text-muted mb-4">{result.correct ? 'Correct!' : 'Better luck next hour!'}</p>
              <p className="text-sm text-muted">Next question in <span className="font-bold text-teal">{nextDrop}</span></p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="p-5 rounded-2xl bg-white/80 border border-line">
            <h3 className="text-xs font-mono tracking-wider uppercase text-muted mb-3">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><Target className="w-4 h-4 text-teal" /> This hour</span>
                <span className="font-bold">{result?.points || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><Trophy className="w-4 h-4 text-peri" /> Best</span>
                <span className="font-bold">{myRank?.best || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><Flame className="w-4 h-4 text-amber" /> Streak</span>
                <span className="font-bold">{myRank?.streak || 0}</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="p-5 rounded-2xl bg-white/80 border border-line">
            <h3 className="text-xs font-mono tracking-wider uppercase text-muted mb-3">Leaderboard</h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  entry.isYou ? 'bg-teal/10 font-semibold' : ''
                }`}>
                  <span className={`w-6 text-center font-bold ${i < 3 ? 'text-amber' : 'text-muted'}`}>
                    {entry.rank || i + 1}
                  </span>
                  <span className="flex-1 truncate">{entry.name}</span>
                  <span className="font-mono text-xs">{entry.points}</span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-sm text-muted text-center py-4">No data yet this hour.</p>
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="p-5 rounded-2xl bg-white/80 border border-line">
            <h3 className="text-xs font-mono tracking-wider uppercase text-muted mb-3">How it works</h3>
            <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
              <li>A new question drops every hour</li>
              <li>Answer within 45 seconds to earn points</li>
              <li>Faster answers earn more points</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
