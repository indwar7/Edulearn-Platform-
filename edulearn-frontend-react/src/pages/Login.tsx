import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../lib/api';
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const ROLES = ['student', 'teacher', 'parent'] as const;
const ROLE_COLORS: Record<string, string> = { student: 'bg-teal', teacher: 'bg-peri', parent: 'bg-amber' };

export default function Login() {
  const { login, loggedIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<string>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP state
  const [otpMode, setOtpMode] = useState(false);
  const [otpUserId, setOtpUserId] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpChannel] = useState('email');
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (loggedIn) navigate('/dashboard', { replace: true });
  }, [loggedIn, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'VERIFY_REQUIRED') {
        setOtpUserId(err.userId);
        setOtpMode(true);
        await sendOtp(otpChannel, undefined, err.userId);
        setResendTimer(60);
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val;
    setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  async function handleVerifyOtp() {
    setError('');
    setLoading(true);
    try {
      const code = otpDigits.join('');
      await verifyOtp(otpChannel, code, undefined, otpUserId);
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    await sendOtp(otpChannel, undefined, otpUserId);
    setResendTimer(60);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-navy via-slate-dark to-[#162040] relative overflow-hidden px-12">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-teal/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-peri/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 text-center">
          <BookOpen className="w-16 h-16 text-teal mx-auto mb-6" />
          <h1 className="font-display text-4xl text-white font-medium mb-3">Welcome back</h1>
          <p className="text-white/60 max-w-sm">Continue your learning journey on EduLearn.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12 bg-cream">
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-display text-3xl font-medium mb-2">Log in</h2>
          <p className="text-muted mb-8">
            Don't have an account? <Link to="/signup" className="text-teal font-semibold no-underline">Sign up</Link>
          </p>

          {!otpMode ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role tabs */}
              <div className="flex gap-2 p-1 bg-white/60 rounded-xl border border-line">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                      role === r ? `${ROLE_COLORS[r]} text-navy shadow-sm` : 'text-muted hover:text-ink'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && <p className="text-danger text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted">Enter the 6-digit code sent to your {otpChannel}.</p>
              <div className="flex gap-3 justify-center">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-line bg-white/80 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                  />
                ))}
              </div>
              {error && <p className="text-danger text-sm text-center">{error}</p>}
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpDigits.some(d => !d)}
                className="w-full py-3.5 rounded-xl aurora-gradient text-navy font-bold text-sm disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0}
                className="w-full text-sm text-muted hover:text-teal disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
