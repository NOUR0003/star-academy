
import React from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center text-5xl font-black shadow-2xl">
            {user.username[0].toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{user.fullName}</h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs">@{user.username} | {user.role}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Gmail</span>
                  <span className="text-sm font-black dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Student Phone</span>
                  <span className="text-sm font-black dark:text-white">{user.phone}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Status</h3>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl">
                <p className="text-xs font-black text-indigo-400 uppercase mb-2">Available Balance</p>
                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">${user.balance}</p>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Family Contacts</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Father's Phone</span>
                  <span className="text-sm font-black dark:text-white">{user.fatherPhone}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Mother's Phone</span>
                  <span className="text-sm font-black dark:text-white">{user.motherPhone}</span>
                </div>
              </div>
            </section>
            
            <section className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Learning Activity</h3>
              <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-slate-500">Total Courses</span>
                 <span className="text-xl font-black dark:text-white">{user.purchasedLessons.length}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
