import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MessageSquareIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { contactApi } from '../services/api';
import { ContactMessage } from '../types';

export function AdminMessagesPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | ContactMessage['status']>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [adminNotesDraft, setAdminNotesDraft] = useState('');

  const fetchMessages = async (filter: typeof statusFilter = statusFilter) => {
    try {
      setLoading(true);
      setError('');
      const res = await contactApi.getAll(filter);
      setMessages(res.data || []);
      if (selectedMessage) {
        const updatedSelected = (res.data || []).find((item) => item.id === selectedMessage.id);
        setSelectedMessage(updatedSelected || null);
      }
    } catch (err: any) {
      console.error('Load contact messages failed:', err);
      setError(err?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const filteredTotal = useMemo(() => messages.length, [messages]);

  const handleUpdate = async (messageId: string, status: ContactMessage['status']) => {
    try {
      setSavingId(messageId);
      await contactApi.update(messageId, { status });
      await fetchMessages();
    } catch (err: any) {
      setError(err?.message || 'Failed to update message');
    } finally {
      setSavingId(null);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage) {
      return;
    }

    if (!replyDraft.trim()) {
      setError('Please type a reply before sending.');
      return;
    }

    try {
      setSavingId(selectedMessage.id);
      setError('');
      await contactApi.reply(selectedMessage.id, {
        replyMessage: replyDraft.trim(),
        adminNotes: adminNotesDraft.trim(),
      });
      setReplyDraft('');
      await fetchMessages();
    } catch (err: any) {
      setError(err?.message || 'Failed to send reply');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (messageId: string) => {
    const confirmed = window.confirm('Delete this message?');
    if (!confirmed) return;

    try {
      setSavingId(messageId);
      await contactApi.delete(messageId);
      await fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to delete message');
    } finally {
      setSavingId(null);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquareIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Contact Messages</h1>
          </div>
          <div className="text-text-secondary">
            Total: <span className="font-semibold">{filteredTotal}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {(['all', 'new', 'read', 'replied', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                fetchMessages(status);
              }}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-text-secondary">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="bg-surface/50 border border-border rounded-xl p-6 text-text-secondary">
                No contact messages found.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full text-left rounded-xl border p-4 transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-surface/50 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-text-primary">{message.name}</h3>
                        <p className="text-sm text-text-secondary">{message.email}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-surface border border-border text-text-secondary">
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary font-medium mb-1">{message.subject}</p>
                    <p className="text-sm text-text-muted line-clamp-2">{message.message}</p>
                    <p className="text-xs text-text-muted mt-2">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="bg-surface/50 border border-border rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-text-primary mb-4">Message Details</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-text-secondary">Name</p>
                    <p className="text-text-primary font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Email</p>
                    <p className="text-text-primary break-all">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Subject</p>
                    <p className="text-text-primary font-medium">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Message</p>
                    <p className="text-text-primary whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Status</p>
                    <p className="text-text-primary font-medium capitalize">{selectedMessage.status}</p>
                  </div>
                  {selectedMessage.adminNotes && (
                    <div>
                      <p className="text-text-secondary">Admin Notes</p>
                      <p className="text-text-primary whitespace-pre-wrap">{selectedMessage.adminNotes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border space-y-3">
                    <div>
                      <p className="text-text-secondary mb-2">Reply to Customer</p>
                      <textarea
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        rows={6}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary"
                        placeholder="Write your reply to the customer..."
                      />
                    </div>
                    <div>
                      <p className="text-text-secondary mb-2">Admin Notes</p>
                      <textarea
                        value={adminNotesDraft}
                        onChange={(e) => setAdminNotesDraft(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary"
                        placeholder="Internal notes for this message (optional)"
                      />
                    </div>
                    <button
                      onClick={handleReply}
                      disabled={savingId === selectedMessage.id}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Send Reply Email
                    </button>
                  </div>

                  <div className="pt-4 border-t border-border flex flex-col gap-2">
                    <button
                      onClick={() => handleUpdate(selectedMessage.id, 'read')}
                      disabled={savingId === selectedMessage.id}
                      className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg disabled:opacity-50"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => handleUpdate(selectedMessage.id, 'replied')}
                      disabled={savingId === selectedMessage.id}
                      className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Mark Replied
                    </button>
                    <button
                      onClick={() => handleUpdate(selectedMessage.id, 'closed')}
                      disabled={savingId === selectedMessage.id}
                      className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary disabled:opacity-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={savingId === selectedMessage.id}
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface/50 border border-border rounded-xl p-6 text-text-secondary">
                Select a message to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}