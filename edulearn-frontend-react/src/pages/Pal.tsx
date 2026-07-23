import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { listPalSessions, getPalSession, chatPal, renamePalSession, deletePalSession } from '../lib/api';
import { MessageCircle, Send, Plus, Trash2, Edit3, Check, X, Brain } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Session {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function Pal() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadSessions() {
    try {
      const data = await listPalSessions();
      setSessions(data.sessions || []);
    } catch {}
  }

  async function selectSession(id: string) {
    setActiveId(id);
    try {
      const data = await getPalSession(id);
      setMessages(data.messages || []);
    } catch {}
  }

  async function handleNewChat() {
    setActiveId(null);
    setMessages([]);
    setInput('');
  }

  async function handleSend() {
    if (!input.trim() || sending) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setSending(true);
    try {
      const data = await chatPal(msg, activeId || undefined);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (data.sessionId && !activeId) {
        setActiveId(data.sessionId);
        loadSessions();
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePalSession(id);
      if (activeId === id) { setActiveId(null); setMessages([]); }
      loadSessions();
    } catch {}
  }

  async function handleRename(id: string) {
    if (!editTitle.trim()) return;
    try {
      await renamePalSession(id, editTitle.trim());
      setEditingId(null);
      loadSessions();
    } catch {}
  }

  const STARTERS = [
    'Explain photosynthesis simply',
    'Help me solve a math problem',
    'What are Newton\'s laws?',
    'Quiz me on fractions',
  ];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-72 border-r border-line bg-white/50 flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full py-3 rounded-xl aurora-gradient text-navy font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" /> New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {sessions.map(s => (
            <div
              key={s._id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                activeId === s._id ? 'bg-teal/10' : 'hover:bg-black/5'
              }`}
            >
              {editingId === s._id ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    className="flex-1 text-sm px-2 py-1 rounded border border-line bg-white"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRename(s._id)}
                    autoFocus
                  />
                  <button onClick={() => handleRename(s._id)} className="text-teal"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setEditingId(null)} className="text-muted"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-muted shrink-0" />
                  <span onClick={() => selectSession(s._id)} className="flex-1 text-sm truncate">{s.title}</span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button onClick={() => { setEditingId(s._id); setEditTitle(s.title); }} className="text-muted hover:text-ink">
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="text-muted hover:text-danger">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 && !activeId ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <Brain className="w-16 h-16 text-teal mb-4" />
            <h2 className="font-display text-2xl font-medium mb-2">Hi, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-muted text-center max-w-md mb-8">
              I'm PAL, your personal AI learning assistant. Ask me anything about your subjects.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="p-3 rounded-xl bg-white/80 border border-line text-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all ease-smooth"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-teal text-navy rounded-br-sm'
                    : 'bg-white/80 border border-line rounded-bl-sm'
                }`}>
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs text-teal font-semibold">
                      <Brain className="w-3.5 h-3.5" /> PAL
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-white/80 border border-line rounded-bl-sm">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 rounded-full bg-teal animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    PAL is thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>
        )}

        {/* Composer */}
        <div className="p-4 border-t border-line bg-white/50">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Ask PAL anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 px-4 py-3 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-5 py-3 rounded-xl aurora-gradient text-navy font-bold text-sm disabled:opacity-40 hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
