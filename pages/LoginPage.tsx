
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (identifier: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check main owner override
    if ((identifier === 'nour@gmail.com' || identifier === 'nour' || identifier === '01028178830') && password === 'pubgnour') {
      if (onLogin(identifier === 'nour' ? 'nour@gmail.com' : identifier)) {
        navigate('/admin');
        return;
      }
    }

    if (onLogin(identifier)) {
      navigate('/');
    } else {
      setError('Invalid Gmail/Phone or password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Sign In</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-semibold">Login with your Gmail or Phone</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Gmail or Student Phone</label>
            <input 
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-bold dark:text-white"
              placeholder="e.g. user@gmail.com or 01..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password"
              required
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-bold dark:text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-black uppercase tracking-tight">{error}</p>}

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition transform active:scale-95 text-lg">
            Sign In
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
            New student? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
