import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../lib/api';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

const ROLES = ['student', 'teacher', 'parent'] as const;
const ROLE_COLORS: Record<string, string> = { student: 'bg-teal', teacher: 'bg-peri', parent: 'bg-amber' };

export default function Signup() {
  const { signup, loggedIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<string>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Student fields
  const [rollNumber, setRollNumber] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [className, setClassName] = useState('Class 7');
  const [section, setSection] = useState('A');

  // Teacher fields
  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [tClass, setTClass] = useState('Class 7');
  const [tSection, setTSection] = useState('A');

  // Parent fields
  const [childRoll, setChildRoll] = useState('');
  const [childName, setChildName] = useState('');
  const [childClass, setChildClass] = useState('Class 7');

  // OTP
  const [otpMode, setOtpMode] = useState(false);
  const [otpUserId, setOtpUserId] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (loggedIn && !otpMode) navigate('/dashboard', { replace: true });
  }, [loggedIn, navigate, otpMode]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { setError('Please agree to the terms.'); return; }
    setError('');
    setLoading(true);

    const fields: Record<string, any> = { name, email, password };
    if (role === 'student') Object.assign(fields, { rollNumber, board, className, section });
    if (role === 'teacher') Object.assign(fields, { teacherId, subject, className: tClass, section: tSection });
    if (role === 'parent') Object.assign(fields, { childRollNumber: childRoll, childName, childClass });

    try {
      await signup(role, fields);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'VERIFY_REQUIRED') {
        setOtpUserId(err.userId);
        setOtpMode(true);
        await sendOtp('email', undefined, err.userId);
        setResendTimer(60);
      } else {
        setError(err.message || 'Signup failed');
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

  async function handleVerifyOtp() {
    setError('');
    setLoading(true);
    try {
      await verifyOtp('email', otpDigits.join(''), undefined, otpUserId);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-navy via-slate-dark to-[#162040] relative overflow-hidden px-12">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-teal/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-amber/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 text-center">
          <BookOpen className="w-16 h-16 text-teal mx-auto mb-6" />
          <h1 className="font-display text-4xl text-white font-medium mb-3">Join EduLearn</h1>
          <p className="text-white/60 max-w-sm">Start your learning journey today. Free for students.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12 bg-cream overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <h2 className="font-display text-3xl font-medium mb-2">Sign up</h2>
          <p className="text-muted mb-6">
            Already have an account? <Link to="/login" className="text-teal font-semibold no-underline">Log in</Link>
          </p>

          {!otpMode ? (
            <form onSubmit={handleSignup} className="space-y-4">
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

              <Input placeholder="Full name" value={name} onChange={setName} />
              <Input placeholder="Email address" type="email" value={email} onChange={setEmail} />
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Student fields */}
              {role === 'student' && (
                <>
                  <Input placeholder="Roll number" value={rollNumber} onChange={setRollNumber} />
                  <Select value={board} onChange={setBoard} options={['CBSE', 'ICSE', 'State']} />
                  <Select value={className} onChange={setClassName} options={['Class 6', 'Class 7', 'Class 8', 'Class 9']} />
                  <Select value={section} onChange={setSection} options={['A', 'B', 'C']} />
                </>
              )}

              {/* Teacher fields */}
              {role === 'teacher' && (
                <>
                  <Input placeholder="Teacher ID" value={teacherId} onChange={setTeacherId} />
                  <Input placeholder="Subject" value={subject} onChange={setSubject} />
                  <Select value={tClass} onChange={setTClass} options={['Class 6', 'Class 7', 'Class 8', 'Class 9']} />
                  <Select value={tSection} onChange={setTSection} options={['A', 'B', 'C']} />
                </>
              )}

              {/* Parent fields */}
              {role === 'parent' && (
                <>
                  <Input placeholder="Child's roll number" value={childRoll} onChange={setChildRoll} />
                  <Input placeholder="Child's name" value={childName} onChange={setChildName} />
                  <Select value={childClass} onChange={setChildClass} options={['Class 6', 'Class 7', 'Class 8', 'Class 9']} />
                </>
              )}

              <label className="flex items-start gap-2 text-sm text-muted cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5" />
                I agree to the Terms of Service and Privacy Policy
              </label>

              {error && <p className="text-danger text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted">Enter the 6-digit code sent to your email.</p>
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
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
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
                onClick={async () => { if (resendTimer <= 0) { await sendOtp('email', undefined, otpUserId); setResendTimer(60); } }}
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

function Input({ placeholder, value, onChange, type = 'text' }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required
      className="w-full px-4 py-3 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
