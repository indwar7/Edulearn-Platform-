import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CHAPTER_INDEX } from '../lib/curriculum';
import { Play, FileText, ArrowLeft, Clock } from 'lucide-react';

export default function Lesson() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = chapterId ? CHAPTER_INDEX[chapterId] : null;
  const [mode, setMode] = useState<'choose' | 'video' | 'notes'>('choose');

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-2xl mb-4">Chapter not found</h2>
        <Link to="/learn" className="text-teal font-semibold no-underline">Back to Learn</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link to="/learn" className="flex items-center gap-1 text-teal no-underline hover:underline">
          <ArrowLeft className="w-4 h-4" /> Learn
        </Link>
        <span>/</span>
        <span>Class {chapter.cls}</span>
        <span>/</span>
        <span style={{ color: chapter.subject.accent }}>{chapter.subject.en}</span>
        <span>/</span>
        <span className="text-ink font-medium">{chapter.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium mb-2">{chapter.name}</h1>
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2.5 py-1 rounded-md font-medium"
            style={{ background: chapter.subject.accent + '22', color: chapter.subject.accent }}
          >
            {chapter.subject.en}
          </span>
          <span className="text-xs text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" /> ~{chapter.mins} min
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-peri/10 text-peri font-medium">
            Class {chapter.cls}
          </span>
        </div>
      </div>

      {/* Mode chooser */}
      {mode === 'choose' && (
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setMode('video')}
            className="p-8 rounded-2xl bg-white/80 border border-line hover:shadow-lg hover:-translate-y-1 transition-all ease-smooth text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
              <Play className="w-7 h-7 text-teal" />
            </div>
            <h3 className="font-display text-xl font-medium mb-2">Watch video</h3>
            <p className="text-muted text-sm">Watch the lecture video with visual explanations and examples.</p>
          </button>

          <button
            onClick={() => setMode('notes')}
            className="p-8 rounded-2xl bg-white/80 border border-line hover:shadow-lg hover:-translate-y-1 transition-all ease-smooth text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-peri/10 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-peri" />
            </div>
            <h3 className="font-display text-xl font-medium mb-2">Read notes</h3>
            <p className="text-muted text-sm">Study the chapter notes with key concepts and summaries.</p>
          </button>
        </div>
      )}

      {/* Video mode */}
      {mode === 'video' && (
        <div>
          <button onClick={() => setMode('choose')} className="text-sm text-teal mb-4 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to options
          </button>
          <div className="aspect-video bg-navy rounded-2xl flex items-center justify-center">
            <div className="text-center text-white/60">
              <Play className="w-12 h-12 mx-auto mb-3 text-teal" />
              <p className="text-sm">Video content for "{chapter.name}" will appear here.</p>
            </div>
          </div>
        </div>
      )}

      {/* Notes mode */}
      {mode === 'notes' && (
        <div>
          <button onClick={() => setMode('choose')} className="text-sm text-teal mb-4 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to options
          </button>
          <div className="p-8 rounded-2xl bg-white/80 border border-line min-h-[400px]">
            <h2 className="font-display text-2xl font-medium mb-4">{chapter.name}</h2>
            <p className="text-muted">Chapter notes and study material will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
