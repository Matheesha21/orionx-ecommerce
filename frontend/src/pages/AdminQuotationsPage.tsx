import React, { useState, useEffect } from 'react';
import { FileTextIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Quotation {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  productsOfInterest: string;
  quantity: number;
  additionalDetails: string;
  status: 'pending' | 'replied' | 'rejected';
  createdAt: string;
}

export function AdminQuotationsPage() {
  const { user, isAdmin } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'replied' | 'rejected'>('all');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/quotations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch quotations');

      const data = await response.json();
      setQuotations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'replied' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/quotations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setQuotations(quotations.map(q => q._id === id ? { ...q, status: newStatus } : q));
      if (selectedQuotation?._id === id) {
        setSelectedQuotation({ ...selectedQuotation, status: newStatus });
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/quotations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      setQuotations(quotations.filter(q => q._id !== id));
      if (selectedQuotation?._id === id) {
        setSelectedQuotation(null);
      }
    } catch (err) {
      setError('Failed to delete quotation');
    }
  };

  const filteredQuotations = filterStatus === 'all' 
    ? quotations 
    : quotations.filter(q => q.status === filterStatus);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
          <p className="text-text-secondary mt-2">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileTextIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Quotation Requests</h1>
          </div>
          <div className="text-text-secondary">
            Total: <span className="font-semibold">{quotations.length}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {(['all', 'pending', 'replied', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quotations List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">Loading quotations...</p>
              </div>
            ) : filteredQuotations.length === 0 ? (
              <div className="text-center py-8 bg-surface border border-border rounded-lg">
                <p className="text-text-secondary">No quotations found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotations.map((quotation) => (
                  <div
                    key={quotation._id}
                    onClick={() => setSelectedQuotation(quotation)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedQuotation?._id === quotation._id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-surface border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {quotation.firstName} {quotation.lastName}
                        </h3>
                        <p className="text-sm text-text-secondary">{quotation.email}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          quotation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : quotation.status === 'replied'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {quotation.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">
                      {quotation.productsOfInterest} - Qty: {quotation.quantity}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            {selectedQuotation ? (
              <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-text-primary mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary">Name</p>
                    <p className="font-semibold text-text-primary">
                      {selectedQuotation.firstName} {selectedQuotation.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Email</p>
                    <p className="font-semibold text-text-primary break-all">
                      {selectedQuotation.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Phone</p>
                    <p className="font-semibold text-text-primary">{selectedQuotation.phone}</p>
                  </div>
                  {selectedQuotation.company && (
                    <div>
                      <p className="text-sm text-text-secondary">Company</p>
                      <p className="font-semibold text-text-primary">{selectedQuotation.company}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-text-secondary">Product</p>
                    <p className="font-semibold text-text-primary">
                      {selectedQuotation.productsOfInterest}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Quantity</p>
                    <p className="font-semibold text-text-primary">{selectedQuotation.quantity}</p>
                  </div>
                  {selectedQuotation.additionalDetails && (
                    <div>
                      <p className="text-sm text-text-secondary">Additional Details</p>
                      <p className="text-text-primary text-sm break-words">
                        {selectedQuotation.additionalDetails}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-text-secondary">Submitted</p>
                    <p className="text-text-primary text-sm">
                      {new Date(selectedQuotation.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-text-secondary mb-3">Status</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedQuotation._id, 'replied')
                        }
                        className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Replied
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedQuotation._id, 'rejected')
                        }
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <XIcon className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedQuotation._id)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <p className="text-text-secondary">Select a quotation to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
