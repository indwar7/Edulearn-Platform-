import { useState, useEffect } from 'react';
import { listVideos, recordVideoView, API_BASE } from '../lib/api';
import { SUBJECTS } from '../lib/curriculum';
import { Play, Eye, Search } from 'lucide-react';

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [playing, setPlaying] = useState<any>(null);

  useEffect(() => {
    loadVideos();
  }, [filterClass, filterSubject]);

  async function loadVideos() {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (filterClass) filters.className = filterClass;
      if (filterSubject) filters.subject = filterSubject;
      const data = await listVideos(filters);
      setVideos(data);
    } catch {}
    setLoading(false);
  }

  function handlePlay(video: any) {
    setPlaying(video);
    recordVideoView(video._id);
  }

  const filtered = videos.filter(v =>
    !search || v.title?.toLowerCase().includes(search.toLowerCase()) || v.topic?.toLowerCase().includes(search.toLowerCase())
  );

  if (playing) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button onClick={() => setPlaying(null)} className="text-sm text-teal mb-4">&larr; Back to videos</button>
        <div className="aspect-video bg-navy rounded-2xl overflow-hidden mb-4">
          {playing.url ? (
            <video
              src={playing.url.startsWith('http') ? playing.url : `${API_BASE}${playing.url}`}
              controls
              autoPlay
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              <Play className="w-12 h-12" />
            </div>
          )}
        </div>
        <h2 className="font-display text-2xl font-medium mb-2">{playing.title}</h2>
        <div className="flex items-center gap-3 text-sm text-muted">
          {playing.teacherName && <span>{playing.teacherName}</span>}
          {playing.className && <span className="px-2 py-0.5 rounded bg-peri/10 text-peri">{playing.className}</span>}
          {playing.subject && <span className="px-2 py-0.5 rounded bg-teal/10 text-teal">{playing.subject}</span>}
          {playing.views !== undefined && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {playing.views} views</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium mb-2">Videos</h1>
        <p className="text-muted">Watch lecture recordings from your teachers.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white/80 text-sm focus:outline-none focus:border-teal"
          />
        </div>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="px-4 py-2.5 rounded-xl border border-line bg-white/80 text-sm">
          <option value="">All classes</option>
          {['Class 6','Class 7','Class 8','Class 9'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-4 py-2.5 rounded-xl border border-line bg-white/80 text-sm">
          <option value="">All subjects</option>
          {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.en}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Play className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No videos found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => (
            <button
              key={v._id}
              onClick={() => handlePlay(v)}
              className="p-0 rounded-2xl bg-white/80 border border-line overflow-hidden text-left hover:shadow-lg hover:-translate-y-1 transition-all ease-smooth"
            >
              <div className="aspect-video bg-navy/10 flex items-center justify-center relative">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Play className="w-10 h-10 text-muted" />
                )}
                {v.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-navy/80 text-white text-xs font-mono">
                    {v.duration}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2">{v.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                  {v.teacherName && <span>{v.teacherName}</span>}
                  {v.views !== undefined && (
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {v.views}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
