import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { subscriptionsApi } from '../services/api';

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  useEffect(() => {
    const doUnsubscribe = async () => {
      if (!email) return setStatus('error');
      setStatus('loading');
      try {
        await subscriptionsApi.unsubscribe(email);
        setStatus('success');
      } catch (err) {
        console.error('Unsubscribe failed:', err);
        setStatus('error');
      }
    };

    doUnsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-surface border border-border rounded-xl text-center">
        {status === 'loading' && <p>Processing unsubscribe...</p>}
        {status === 'success' && (
          <>
            <h2 className="text-xl font-bold mb-2">Unsubscribed</h2>
            <p className="mb-4">You have been removed from our newsletter list.</p>
            <Link to="/" className="text-primary">Return home</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-xl font-bold mb-2">Unsubscribe failed</h2>
            <p className="mb-4">We couldn't process your request. Try contacting support.</p>
            <Link to="/" className="text-primary">Return home</Link>
          </>
        )}
      </div>
    </div>
  );
}
