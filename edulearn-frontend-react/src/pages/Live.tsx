import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listLive, createLive, joinLive, endLive } from '../lib/api';
import { SUBJECTS } from '../lib/curriculum';
import { Video, Users, Plus, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

export default function Live() {
  const { role } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [showComposer, setShowComposer] = useState(false);

  // Composer fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('maths');
  const [targetClass, setTargetClass] = useState('Class 7');
  const [targetSection, setTargetSection] = useState('A');
  const [creating, setCreating] = useState(false);

  // Classroom controls
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const data = await listLive();
      setSessions(data);
    } catch {}
    setLoading(false);
  }

  async function handleCreate() {
    setCreating(true);
    try {
      await createLive({ title, subject, className: targetClass, section: targetSection });
      setShowComposer(false);
      setTitle('');
      loadSessions();
    } catch {}
    setCreating(false);
  }

  async function handleJoin(session: any) {
    try {
      const data = await joinLive(session._id);
      setActiveSession({ ...session, ...data });
    } catch (err: any) {
      alert(err.message || 'Could not join');
    }
  }

  async function handleEnd() {
    if (!activeSession) return;
    try {
      await endLive(activeSession._id);
      setActiveSession(null);
      loadSessions();
    } catch {}
  }

  function handleLeave() {
    setActiveSession(null);
  }

  // Classroom view
  if (activeSession) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col bg-navy">
        {/* Stage */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="aspect-video max-h-[70vh] w-full max-w-5xl bg-slate-dark rounded-2xl flex items-center justify-center mx-6">
            <div className="text-center text-white/40">
              <Video className="w-16 h-16 mx-auto mb-3" />
              <p className="text-sm">{role === 'teacher' ? 'Your camera feed' : "Waiting for teacher's video..."}</p>
            </div>
          </div>

          {/* Self tile */}
          <div className="absolute bottom-4 right-8 w-40 aspect-video bg-slate-mid rounded-xl border border-white/10 flex items-center justify-center">
            <span className="text-white/40 text-xs">You</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 py-4 bg-slate-dark/80">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${muted ? 'bg-danger text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setCameraOff(!cameraOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${cameraOff ? 'bg-danger text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {cameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </button>
          <button
            onClick={role === 'teacher' ? handleEnd : handleLeave}
            className="w-12 h-12 rounded-full bg-danger text-white flex items-center justify-center hover:bg-danger/80"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Session info */}
        <div className="text-center py-2 text-white/60 text-xs">
          {activeSession.title} &middot; {activeSession.code || 'Live'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-peri mb-2">
          <Video className="w-5 h-5" />
          <span className="text-xs font-mono tracking-wider uppercase">Live Classes</span>
        </div>
        <h1 className="font-display text-4xl font-medium mb-2">
          Small-group <span className="aurora-text">live classes</span>
        </h1>
        <p className="text-muted">Real teachers, real-time interaction, attention tracking.</p>
      </div>

      {/* Teacher composer */}
      {role === 'teacher' && (
        <div className="mb-8">
          {!showComposer ? (
            <button
              onClick={() => setShowComposer(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Start a live class
            </button>
          ) : (
            <div className="p-6 rounded-2xl bg-white/80 border border-line space-y-4">
              <h3 className="font-semibold">Start a new live class</h3>
              <input
                placeholder="Class title (e.g. 'Triangles Review')"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal"
              />
              <div className="grid grid-cols-3 gap-3">
                <select value={subject} onChange={e => setSubject(e.target.value)} className="px-3 py-2.5 rounded-xl border border-line bg-cream text-sm">
                  {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.en}</option>)}
                </select>
                <select value={targetClass} onChange={e => setTargetClass(e.target.value)} className="px-3 py-2.5 rounded-xl border border-line bg-cream text-sm">
                  {['Class 6','Class 7','Class 8','Class 9'].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={targetSection} onChange={e => setTargetSection(e.target.value)} className="px-3 py-2.5 rounded-xl border border-line bg-cream text-sm">
                  {['A','B','C'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreate} disabled={creating || !title.trim()} className="px-5 py-2.5 rounded-xl aurora-gradient text-navy font-bold text-sm disabled:opacity-60">
                  {creating ? 'Creating...' : 'Go live'}
                </button>
                <button onClick={() => setShowComposer(false)} className="px-5 py-2.5 rounded-xl border border-line text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <Video className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No live classes available right now.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map(s => (
            <div key={s._id} className="p-5 rounded-2xl bg-white/80 border border-line hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted mt-0.5">{s.teacherName || 'Teacher'}</p>
                </div>
                {s.status === 'live' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" /> Live
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted mb-4">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s.className} {s.section}</span>
                <span className="px-2 py-0.5 rounded bg-peri/10 text-peri">{s.subject}</span>
                {s.code && <span className="font-mono">{s.code}</span>}
              </div>
              <button
                onClick={() => handleJoin(s)}
                className="w-full py-2.5 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-[1.02] transition-transform"
              >
                <Phone className="w-4 h-4 inline mr-1" /> Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
