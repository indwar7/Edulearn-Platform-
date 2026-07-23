import { useState, useEffect } from 'react';
import { getDashboard } from '../lib/api';
import { Shield, Users, BookOpen, BarChart3 } from 'lucide-react';

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-teal" />
        <div>
          <h1 className="font-display text-3xl font-medium">Admin Panel</h1>
          <p className="text-muted">Platform overview and management.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-white/80 border border-line">
          <Users className="w-8 h-8 text-teal mb-3" />
          <div className="text-3xl font-bold">{data?.totalUsers || 0}</div>
          <div className="text-sm text-muted">Total users</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/80 border border-line">
          <BookOpen className="w-8 h-8 text-peri mb-3" />
          <div className="text-3xl font-bold">{data?.totalVideos || 0}</div>
          <div className="text-sm text-muted">Videos uploaded</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/80 border border-line">
          <BarChart3 className="w-8 h-8 text-amber mb-3" />
          <div className="text-3xl font-bold">{data?.totalSessions || 0}</div>
          <div className="text-sm text-muted">Live sessions</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/80 border border-line">
        <h2 className="font-display text-xl font-medium mb-4">Platform Management</h2>
        <p className="text-muted text-sm">
          Admin features like user management, content moderation, and analytics are available here.
          This panel provides full oversight of the EduLearn platform.
        </p>
      </div>
    </div>
  );
}
