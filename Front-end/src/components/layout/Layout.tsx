import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CompareDrawer } from '../features/CompareDrawer';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <CompareDrawer />
    </div>);

}