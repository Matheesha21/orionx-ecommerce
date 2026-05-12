import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscriptionsApi } from '../services/api';

interface Subscriber { _id: string; email: string; createdAt: string; }

export function AdminSubscribersPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await subscriptionsApi.getAll();
      setSubs(res.subscribers || []);
    } catch (err: any) {
      console.error('Load subscribers failed:', err);
      setError(err?.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (isAuthenticated && isAdmin) fetch(); else setLoading(false); }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />;

  const handleRemove = async (id: string) => {
    if (!confirm('Remove subscriber?')) return;
    try { await subscriptionsApi.delete(id); await fetch(); } catch (err) { alert('Remove failed'); }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto bg-surface/50 border border-border rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers</h1>
        {loading ? <p>Loading...</p> : error ? <p className="text-red-400">{error}</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b"><th className="py-2">Email</th><th className="py-2">Subscribed</th><th className="py-2">Action</th></tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s._id} className="border-b">
                  <td className="py-2">{s.email}</td>
                  <td className="py-2">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="py-2"><button onClick={() => handleRemove(s._id)} className="text-red-400">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
