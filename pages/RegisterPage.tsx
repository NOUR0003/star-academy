
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface RegisterPageProps {
  onRegister: (userData: Partial<User>) => boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    fatherPhone: '',
    motherPhone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (onRegister(formData)) {
      navigate('/');
    } else {
      setError('Username, Gmail, or Phone already taken');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Student Registration</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-semibold">Please provide your official information</p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Full Real Name</label>
              <input type="text" name="fullName" required className="reg-input" placeholder="Ahmed Mohamed..." value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Unique Username</label>
              <input type="text" name="username" required className="reg-input" placeholder="ahmed99" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Student Gmail</label>
              <input type="email" name="email" required className="reg-input" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Student Phone</label>
              <input type="tel" name="phone" required className="reg-input" placeholder="01..." value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Father's Phone</label>
              <input type="tel" name="fatherPhone" required className="reg-input" placeholder="01..." value={formData.fatherPhone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Mother's Phone</label>
              <input type="tel" name="motherPhone" required className="reg-input" placeholder="01..." value={formData.motherPhone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input type="password" name="password" required className="reg-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" required className="reg-input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            {error && <p className="text-red-500 text-xs font-black uppercase tracking-tight mb-4">{error}</p>}
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition transform active:scale-95 text-xl">
              Complete Registration
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
            Already registered? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

      <style>{`
        .reg-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          outline: none;
          transition: all 0.2s;
          font-weight: 700;
        }
        .dark .reg-input {
          background: #1e293b;
          border-color: #334155;
          color: white;
        }
        .reg-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
