import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  UserIcon,
  PackageIcon,
  MapPinIcon,
  SettingsIcon,
  LogOutIcon } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/ui/Breadcrumb';
export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
          {
            label: 'My Account'
          }]
          }
          className="mb-8" />


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface/50 border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                {user.avatar ?
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover" /> :


                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                }
                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    {user.name}
                  </h2>
                  <p className="text-sm text-text-muted">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-colors">
                  <UserIcon className="w-5 h-5" />
                  Profile Details
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg font-medium transition-colors">
                  <PackageIcon className="w-5 h-5" />
                  Order History
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg font-medium transition-colors">
                  <MapPinIcon className="w-5 h-5" />
                  Saved Addresses
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg font-medium transition-colors">
                  <SettingsIcon className="w-5 h-5" />
                  Account Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors mt-4">

                  <LogOutIcon className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Profile Details
              </h3>

              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-text-muted cursor-not-allowed" />

                  </div>
                </div>

                <button
                  type="button"
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">

                  Save Changes
                </button>
              </form>
            </div>

            <div className="bg-surface/50 border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">
                  Recent Orders
                </h3>
                <button className="text-sm text-primary hover:text-primary-light">
                  View All
                </button>
              </div>

              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <PackageIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">
                  You haven't placed any orders yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}