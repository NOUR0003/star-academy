
import React, { useState } from 'react';
import { User, Lesson, UserLessonActivity, DepositRequest, DepositStatus } from '../types';
import { Link } from 'react-router-dom';

interface StudentDashboardProps {
  user: User | null;
  lessons: Lesson[];
  activity: UserLessonActivity[];
  depositRequests: DepositRequest[];
  onRecharge: (amount: number) => void;
  onPurchase: (lessonId: string) => boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, lessons, activity, depositRequests, onRecharge, onPurchase }) => {
  const [rechargeAmt, setRechargeAmt] = useState<string>('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  if (!user) return <div className="p-10 text-center">Please login to view dashboard.</div>;

  const handleRechargeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(rechargeAmt);
    if (!isNaN(val) && val > 0) {
      onRecharge(val);
      setRechargeAmt('');
      setMessage({ text: `Deposit request for $${val} sent! Waiting for admin approval.`, type: 'success' });
    }
  };

  const handlePurchase = (id: string) => {
    if (onPurchase(id)) {
      setMessage({ text: 'Lesson purchased successfully!', type: 'success' });
    } else {
      setMessage({ text: 'Insufficient balance or already purchased.', type: 'error' });
    }
  };

  const getActivity = (lessonId: string) => activity.find(a => a.userId === user.id && a.lessonId === lessonId);
  
  const myRequests = depositRequests.filter(r => r.userId === user.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass rounded-3xl p-8 flex flex-col justify-between border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Hello, {user.username}!</h1>
            <p className="text-slate-500 mt-2">Ready to master your subjects today?</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-indigo-600/10 px-4 py-2 rounded-xl text-indigo-700 text-sm font-bold border border-indigo-100">
              {user.purchasedLessons.length} Purchased Lessons
            </div>
            <div className="bg-green-600/10 px-4 py-2 rounded-xl text-green-700 text-sm font-bold border border-green-100">
              Wallet Active
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Wallet Balance</h2>
          <div className="text-4xl font-extrabold text-indigo-600 mb-6">${user.balance}</div>
          <form onSubmit={handleRechargeRequest} className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deposit Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition" 
                placeholder="0.00"
                value={rechargeAmt}
                onChange={(e) => setRechargeAmt(e.target.value)}
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
              Request Recharge
            </button>
          </form>
          
          {myRequests.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Requests</h3>
              <div className="space-y-2">
                {myRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">${req.amount}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      req.status === DepositStatus.PENDING ? 'bg-amber-50 text-amber-600' :
                      req.status === DepositStatus.APPROVED ? 'bg-green-50 text-green-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-5 rounded-2xl font-bold flex items-center shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span>
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto opacity-40 hover:opacity-100 transition text-xl">&times;</button>
        </div>
      )}

      {/* Available Lessons */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Explore Lessons</h2>
          <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{lessons.length} Courses Available</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map(lesson => {
            const isPurchased = user.purchasedLessons.includes(lesson.id);
            const userAct = getActivity(lesson.id);
            const viewsRemaining = userAct ? Math.max(0, lesson.viewLimit - userAct.viewsUsed) : lesson.viewLimit;
            const isBlocked = userAct && userAct.viewsUsed >= lesson.viewLimit;

            return (
              <div key={lesson.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group">
                <div className="relative h-52 overflow-hidden">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  {!isPurchased && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-2xl font-bold text-indigo-600 shadow-sm border border-white">
                      ${lesson.price}
                    </div>
                  )}
                  {isPurchased && (
                    <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center">
                       <div className="bg-white text-indigo-600 px-5 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg">Purchased</div>
                    </div>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition">{lesson.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{lesson.description}</p>
                  
                  <div className="mt-auto pt-6 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Access</span>
                      <span className="text-sm font-bold text-slate-700">{lesson.viewLimit} Full Views</span>
                    </div>
                    {isPurchased ? (
                      isBlocked ? (
                        <button disabled className="bg-slate-100 text-slate-400 px-8 py-2.5 rounded-2xl text-sm font-bold cursor-not-allowed">
                          Blocked
                        </button>
                      ) : (
                        <Link to={`/lesson/${lesson.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-2xl text-sm font-bold transition shadow-lg shadow-indigo-100">
                          Watch ({viewsRemaining})
                        </Link>
                      )
                    ) : (
                      <button 
                        onClick={() => handlePurchase(lesson.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-2xl text-sm font-bold transition shadow-lg shadow-indigo-100"
                      >
                        Unlock Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
