
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, isDarkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 dark:shadow-none">★</div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 dark:text-white leading-none">Eng. Shehab</span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Star Academy</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
          <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About</Link>
          <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</Link>
          {user && (
            <>
              <Link to={user.role === UserRole.STUDENT ? "/dashboard" : "/admin"} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Profile</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <button 
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-inner"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{user.role}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.username}</p>
            </div>
            <button 
              onClick={() => { onLogout(); navigate('/'); }}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-5 py-2.5 rounded-xl text-sm font-bold transition border border-red-100 dark:border-red-900/50"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login" className="text-slate-600 dark:text-slate-400 px-4 py-2.5 text-sm font-bold hover:text-indigo-600 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition transform active:scale-95">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
