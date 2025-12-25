import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { UserRole } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  cartItemCount?: number;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  cartItemCount,
  onLogout,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      <Header user={user} cartItemCount={cartItemCount} onLogout={onLogout} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;


