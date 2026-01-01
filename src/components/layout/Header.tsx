import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { UserRole } from '@/types';

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
  cartItemCount?: number;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, cartItemCount = 0, onLogout }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white border-b border-[#d4e4d9] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? (user.role === UserRole.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.MENU) : ROUTES.LOGIN} className="flex items-center">
            <span className="text-2xl font-bold text-[#2d8659]">ReadyDish</span>
          </Link>

          {/* Navigation */}
          {user && user.role && (
            <nav className="hidden md:flex items-center space-x-6">
              {user.role === UserRole.CUSTOMER ? (
                <>
                  <Link
                    to={ROUTES.MENU}
                    className="text-[#5a6c5d] hover:text-[#2d8659] font-medium transition-colors"
                  >
                    Menu
                  </Link>
                  <Link
                    to={ROUTES.ORDERS}
                    className="text-[#5a6c5d] hover:text-[#2d8659] font-medium transition-colors"
                  >
                    My Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    className="text-[#5a6c5d] hover:text-[#2d8659] font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={ROUTES.ADMIN_DISHES}
                    className="text-[#5a6c5d] hover:text-[#2d8659] font-medium transition-colors"
                  >
                    Dishes
                  </Link>
                  <Link
                    to={ROUTES.ADMIN_ORDERS}
                    className="text-[#5a6c5d] hover:text-[#2d8659] font-medium transition-colors"
                  >
                    Orders
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user && user.role ? (
              <>
                {user.role === UserRole.CUSTOMER && (
                  <Link
                    to={ROUTES.CART}
                    className="relative p-2 text-[#5a6c5d] hover:text-[#2d8659] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 bg-[#2d8659] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-[#5a6c5d] hover:text-[#2d8659] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#2d8659] rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block font-medium">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#d4e4d9] py-1 z-50">
                      <div className="px-4 py-2 border-b border-[#d4e4d9]">
                        <p className="text-sm font-medium text-[#2c3e2d]">{user.name}</p>
                        <p className="text-xs text-[#5a6c5d]">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[#5a6c5d] hover:bg-[#f0f7f3] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


