
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Lesson, UserLessonActivity } from '../types';

interface MemberHomeProps {
  user: User;
  lessons: Lesson[];
  activity: UserLessonActivity[];
}

const MemberHome: React.FC<MemberHomeProps> = ({ user, lessons, activity }) => {
  const recentLessons = [...lessons].reverse().slice(0, 3);
  const myLessons = lessons.filter(l => user.purchasedLessons.includes(l.id));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors">
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-none">Welcome, {user.username}!</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-semibold">Your path to excellence with Eng. Shehab Elebady is wide open.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-900/50 p-6 rounded-3xl text-center min-w-[160px] shadow-sm">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">My Balance</div>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">${user.balance}</div>
              </div>
              <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-indigo-200 dark:shadow-none transition transform hover:-translate-y-1 active:scale-95">
                My Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-16">
        {/* Statistics or Quick Activity */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 transition">📚</div>
            <div>
              <div className="text-2xl font-black text-slate-800 dark:text-white">{myLessons.length}</div>
              <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Courses Owned</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-lg transition">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 transition">⭐</div>
            <div>
              <div className="text-2xl font-black text-slate-800 dark:text-white">{lessons.length}</div>
              <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Total Lessons</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-lg transition">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 transition">⏳</div>
            <div>
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                {activity.filter(a => a.userId === user.id).reduce((sum, a) => sum + a.viewsUsed, 0)}
              </div>
              <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Total Views</div>
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Recent Additions</h2>
            <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 text-sm font-black hover:underline tracking-widest uppercase">Explore All →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {recentLessons.map(lesson => (
              <div key={lesson.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="h-52 relative overflow-hidden">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={lesson.title} />
                  <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-5 py-2 rounded-2xl font-black text-sm text-indigo-600 dark:text-indigo-400 shadow-lg">
                    ${lesson.price}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-indigo-600 transition leading-tight">{lesson.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 leading-relaxed font-medium">{lesson.description}</p>
                  <Link to="/dashboard" className="block text-center bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700 text-indigo-600 dark:text-indigo-400 py-4 rounded-2xl text-sm font-black transition duration-300">
                    Get Access
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-indigo-900 dark:bg-indigo-950 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex-grow z-10">
            <h3 className="text-3xl font-black mb-6 tracking-tight">Need Academic Support?</h3>
            <p className="text-lg opacity-80 leading-relaxed mb-8 max-w-xl font-medium">
              Join Eng. Shehab's exclusive student group to discuss problems, get quick answers, and stay updated with the latest academy announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://chat.whatsapp.com/EqW5kZnqCIG4i9viyVeMsb" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-black transition shadow-lg">
                <span className="text-2xl">💬</span> Join Student Group
              </a>
              <a href="https://wa.me/201201212002" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black transition backdrop-blur-sm">
                Direct WhatsApp
              </a>
            </div>
          </div>
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center text-8xl animate-bounce-slow z-10">
            🎓
          </div>
        </section>
      </div>
    </div>
  );
};

export default MemberHome;
