import { useState } from 'react';
import { Settings, LogOut, Sun, Moon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { updateProfile } from '../lib/api';

export default function AccountMenu() {
  const { user, loggedIn, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [className, setClassName] = useState(user?.className || 'Class 6');
  const [section, setSection] = useState(user?.section || 'A');
  const [board, setBoard] = useState(user?.board || 'CBSE');
  const [emailNotif, setEmailNotif] = useState(user?.preferences?.emailNotifications ?? true);

  if (!loggedIn || !user) return null;

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const body: any = {
      name,
      preferences: { language: 'en', theme: isDark ? 'dark' : 'light', emailNotifications: emailNotif },
    };
    if (user!.role === 'student') {
      body.className = className;
      body.section = section;
      body.board = board;
    }
    try {
      await updateProfile(body);
      setMsg({ text: 'Saved! Your changes have been updated.', ok: true });
      setTimeout(() => { setOpen(false); setMsg(null); }, 1100);
    } catch (e: any) {
      setMsg({ text: e.message || 'Could not save.', ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* FAB buttons */}
      <div className="fixed top-[18px] right-[18px] z-[9000] flex gap-2">
        <button
          onClick={toggle}
          className="w-11 h-11 rounded-xl border border-line bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg hover:-translate-y-0.5 hover:shadow-teal/20 transition-all ease-smooth"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>
        <button
          onClick={() => setOpen(true)}
          className="w-11 h-11 rounded-xl border border-line bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg hover:-translate-y-0.5 hover:shadow-teal/20 transition-all ease-smooth"
          title="Settings"
        >
          <Settings className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={logout}
          className="w-11 h-11 rounded-xl border border-line bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg hover:-translate-y-0.5 hover:shadow-teal/20 transition-all ease-smooth"
          title="Logout"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-[9100]" onClick={() => setOpen(false)} />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[92vw] bg-white dark:bg-slate-dark z-[9200] shadow-[-16px_0_50px_rgba(15,23,42,0.22)] overflow-y-auto transition-transform duration-300 ease-smooth ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 pt-7 pb-5 bg-cream dark:bg-slate-mid border-b border-line relative">
          <div className="absolute left-0 right-0 bottom-0 h-0.5 aurora-gradient" />
          <div className="flex items-center justify-between">
            <h2 className="font-display font-medium text-2xl">Settings</h2>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-1.5 text-muted text-xs font-mono tracking-wider">
            {user.name} &middot; {user.role.toUpperCase()}
          </div>
        </div>

        {msg && (
          <div className={`mx-6 mt-3.5 text-sm p-2.5 rounded-lg ${msg.ok ? 'text-teal bg-teal/10' : 'text-danger bg-danger/10'}`}>
            {msg.text}
          </div>
        )}

        {/* Profile */}
        <div className="px-6 py-5 border-b border-line">
          <h3 className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted mb-3.5">Profile</h3>
          <Field label="Full Name" value={name} onChange={setName} />
          <Field label="Email (read-only)" value={user.email} disabled />
          {user.role === 'student' && (
            <>
              <SelectField label="Class" value={className} onChange={setClassName} options={['Class 6','Class 7','Class 8','Class 9']} />
              <SelectField label="Section" value={section} onChange={setSection} options={['A','B','C']} />
              <SelectField label="Board" value={board} onChange={setBoard} options={['CBSE','ICSE','State']} />
              <Field label="Roll Number (read-only)" value={user.rollNumber || ''} disabled />
            </>
          )}
          {user.role === 'teacher' && (
            <Field label="Teacher ID (read-only)" value={user.teacherId || ''} disabled />
          )}
        </div>

        {/* Preferences */}
        <div className="px-6 py-5 border-b border-line">
          <h3 className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted mb-3.5">Preferences</h3>
          <SelectField label="Theme" value={isDark ? 'dark' : 'light'} onChange={() => toggle()} options={['light', 'dark']} />
          <div className="flex items-center justify-between text-sm mb-2.5">
            <span>Email notifications</span>
            <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mx-6 mt-4 w-[calc(100%-48px)] py-3 rounded-xl aurora-gradient text-navy font-bold text-[15px] hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-default"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        <button
          onClick={logout}
          className="mx-6 mt-3 mb-7 w-[calc(100%-48px)] py-3 rounded-xl border border-danger/40 text-danger font-bold text-sm hover:bg-danger/5 transition-colors"
        >
          Log out
        </button>
      </aside>
    </>
  );
}

function Field({ label, value, onChange, disabled }: {
  label: string; value: string; onChange?: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <input
        className="w-full px-3 py-2.5 rounded-xl border border-line bg-cream dark:bg-slate-mid text-sm disabled:opacity-55 disabled:cursor-not-allowed focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="mb-3.5">
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <select
        className="w-full px-3 py-2.5 rounded-xl border border-line bg-cream dark:bg-slate-mid text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
