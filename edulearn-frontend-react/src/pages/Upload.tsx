import { useState, useRef } from 'react';
import { SUBJECTS, CURRICULUM } from '../lib/curriculum';
import { API_BASE, getToken } from '../lib/api';
import { Upload as UploadIcon, CheckCircle, Film } from 'lucide-react';

export default function Upload() {
  const [cls, setCls] = useState(7);
  const [subject, setSubject] = useState('maths');
  const [chapterSlug, setChapterSlug] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const chapters = CURRICULUM[cls]?.[subject] || [];

  async function handleUpload() {
    if (!file || !title.trim()) {
      setMsg({ text: 'Please fill in all fields and select a file.', ok: false });
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title.trim());
    formData.append('className', `Class ${cls}`);
    formData.append('subject', subject);
    if (chapterSlug) formData.append('chapterSlug', chapterSlug);

    setUploading(true);
    setProgress(0);
    setMsg(null);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/api/videos/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error('Upload failed'));
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      setMsg({ text: 'Video uploaded successfully!', ok: true });
      setTitle('');
      setFile(null);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      setMsg({ text: err.message || 'Upload failed.', ok: false });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium mb-2">Upload Video</h1>
        <p className="text-muted">Upload lecture recordings for your students.</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/80 border border-line space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1.5">Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Triangles - Introduction"
            className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:border-teal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Class</label>
            <select value={cls} onChange={e => setCls(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm">
              {[6,7,8,9].map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm">
              {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.en}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Chapter (optional)</label>
          <select value={chapterSlug} onChange={e => setChapterSlug(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-cream text-sm">
            <option value="">General</option>
            {chapters.map(ch => <option key={ch[0]} value={ch[0]}>{ch[1]}</option>)}
          </select>
        </div>

        {/* File drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-line rounded-2xl p-8 text-center cursor-pointer hover:border-teal hover:bg-teal/5 transition-colors"
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file ? (
            <div>
              <Film className="w-10 h-10 text-teal mx-auto mb-2" />
              <p className="font-semibold text-sm">{file.name}</p>
              <p className="text-xs text-muted mt-1">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
          ) : (
            <div>
              <UploadIcon className="w-10 h-10 text-muted mx-auto mb-2" />
              <p className="text-sm text-muted">Click to select a video file</p>
              <p className="text-xs text-muted mt-1">MP4, WebM, or MOV</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {uploading && (
          <div>
            <div className="h-2 rounded-full bg-line overflow-hidden">
              <div className="h-full rounded-full aurora-gradient transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted text-center mt-1">{progress}% uploaded</p>
          </div>
        )}

        {msg && (
          <div className={`flex items-center gap-2 text-sm ${msg.ok ? 'text-teal' : 'text-danger'}`}>
            {msg.ok && <CheckCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file || !title.trim()}
          className="w-full py-3.5 rounded-xl aurora-gradient text-navy font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : 'Upload video'}
        </button>
      </div>
    </div>
  );
}
