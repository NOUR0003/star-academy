
import React, { useState, useRef, useMemo } from 'react';
import { AppState, User, Lesson, UserRole, DepositStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  state: AppState;
  onUpdateBalance: (userId: string, amount: number) => void;
  onAddLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
  onProcessDeposit: (requestId: string, approve: boolean) => void;
  onChangeUserRole: (userId: string, newRole: UserRole) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  state, 
  onUpdateBalance, 
  onAddLesson, 
  onDeleteLesson, 
  onProcessDeposit, 
  onChangeUserRole 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'lessons' | 'analytics' | 'deposits'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newLesson, setNewLesson] = useState({ 
    title: '', 
    description: '', 
    price: 0, 
    viewLimit: 1, 
    videoUrl: '', 
    thumbnail: '' 
  });
  const [balanceEdit, setBalanceEdit] = useState<{ userId: string, amount: string }>({ userId: '', amount: '' });
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const currentUser = state.currentUser;
  const isOwner = currentUser?.role === UserRole.OWNER;

  // --- Calculations ---
  const studentCount = useMemo(() => state.users.filter(u => u.role === UserRole.STUDENT).length, [state.users]);
  const totalRevenue = useMemo(() => state.activity.reduce((acc, act) => {
    const lesson = state.lessons.find(l => l.id === act.lessonId);
    return acc + (lesson?.price || 0);
  }, 0), [state.activity, state.lessons]);

  const chartData = useMemo(() => state.lessons.map(l => ({
    name: l.title.length > 12 ? l.title.substring(0, 10) + '..' : l.title,
    purchases: state.activity.filter(a => a.lessonId === l.id).length
  })), [state.lessons, state.activity]);

  const pendingDeposits = useMemo(() => 
    state.depositRequests.filter(r => r.status === DepositStatus.PENDING), 
  [state.depositRequests]);

  const sortedAndFilteredUsers = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return state.users
      .filter(u => 
        u.username.toLowerCase().includes(s) || 
        u.fullName.toLowerCase().includes(s) || 
        u.email.toLowerCase().includes(s) || 
        u.phone.includes(s) || 
        u.fatherPhone.includes(s) || 
        u.motherPhone.includes(s)
      )
      .sort((a, b) => {
        const priority = { [UserRole.OWNER]: 0, [UserRole.ADMIN]: 1, [UserRole.STUDENT]: 2 };
        return (priority[a.role] || 3) - (priority[b.role] || 3);
      });
  }, [state.users, searchTerm]);

  // --- Handlers ---
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0);
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null || prev >= 100) {
            clearInterval(timer);
            setNewLesson(prevLesson => ({ ...prevLesson, videoUrl: URL.createObjectURL(file) }));
            setUploadProgress(null);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLesson(prev => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
    }
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.videoUrl) return alert("Please upload a video file.");
    
    onAddLesson({
      id: `l${Date.now()}`,
      ...newLesson,
      thumbnail: newLesson.thumbnail || `https://picsum.photos/seed/${newLesson.title}/400/225`
    });
    
    setNewLesson({ title: '', description: '', price: 0, viewLimit: 1, videoUrl: '', thumbnail: '' });
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#6366f1'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 transition-colors">
      {/* Header with Custom Nav */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Command Center</h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-[10px] tracking-widest mt-1">Academy Management System</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
          {(['users', 'lessons', 'deposits', 'analytics'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-8 py-3 rounded-xl text-xs font-black capitalize transition-all relative ${activeTab === t ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              {t}
              {t === 'deposits' && pendingDeposits.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white border-2 border-white dark:border-slate-900">
                  {pendingDeposits.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl">
              <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-4">Total Revenue</p>
              <h3 className="text-4xl font-black tracking-tighter">${totalRevenue}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Students</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{studentCount}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">System Users</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{state.users.length}</h3>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Course Sales</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{state.activity.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">Lesson Popularity</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9', opacity: 0.1}} 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800}}
                  />
                  <Bar dataKey="purchases" radius={[10, 10, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search students by any info (Name, Phone, Father Phone, Gmail...)" 
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedAndFilteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group" onClick={() => setSelectedUser(u)}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-xl shadow-inner">
                          {u.fullName[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        u.role === UserRole.OWNER ? 'bg-rose-100 text-rose-700' : 
                        u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-slate-800 dark:text-white font-black text-lg">${u.balance}</td>
                    <td className="px-10 py-6" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-20 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-500/20" 
                            placeholder="±$"
                            onChange={(e) => setBalanceEdit({ userId: u.id, amount: e.target.value })}
                            value={balanceEdit.userId === u.id ? balanceEdit.amount : ''}
                          />
                          <button 
                            onClick={() => {
                              onUpdateBalance(u.id, parseFloat(balanceEdit.amount) || 0);
                              setBalanceEdit({ userId: '', amount: '' });
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all"
                          >
                            Add
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deposits Tab */}
      {activeTab === 'deposits' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingDeposits.length === 0 ? (
                <tr><td colSpan={4} className="px-10 py-24 text-center text-slate-400 font-black italic uppercase tracking-tighter opacity-40">Zero Pending Requests</td></tr>
              ) : (
                pendingDeposits.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-10 py-6 font-black text-slate-800 dark:text-white">@{req.username}</td>
                    <td className="px-10 py-6 text-indigo-600 font-black text-2xl tracking-tighter">${req.amount}</td>
                    <td className="px-10 py-6">
                       <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest">Pending</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex gap-2">
                        <button onClick={() => onProcessDeposit(req.id, true)} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 dark:shadow-none hover:bg-green-700 transition">Approve</button>
                        <button onClick={() => onProcessDeposit(req.id, false)} className="bg-red-50 dark:bg-red-900/20 text-red-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="grid lg:grid-cols-3 gap-10 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Active Courses</h2>
              <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{state.lessons.length} PUBLISHED</span>
            </div>
            {state.lessons.map(lesson => (
              <div key={lesson.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-8 group transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-40 h-40 flex-shrink-0 relative overflow-hidden rounded-[2rem]">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={lesson.title} />
                  <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-4 leading-tight tracking-tight">{lesson.title}</h4>
                  <div className="flex flex-wrap gap-4">
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-5 py-2 rounded-full uppercase tracking-widest">${lesson.price}</span>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-5 py-2 rounded-full uppercase tracking-widest">{lesson.viewLimit} Full Views</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteLesson(lesson.id)}
                  className="text-slate-200 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-colors p-6"
                  title="Remove Course"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-slate-800 h-fit sticky top-28">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter">Publish Content</h3>
            <form onSubmit={handleAddLessonSubmit} className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Course Title</label>
                <input 
                  type="text" required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition font-bold dark:text-white"
                  value={newLesson.title}
                  placeholder="The Ultimate Algebra Chapter..."
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Video File</label>
                  <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoUpload} className="hidden" id="v-up" />
                  <label htmlFor="v-up" className={`w-full h-24 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition ${newLesson.videoUrl ? 'bg-green-50/50 border-green-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200'}`}>
                    <span className="text-[10px] font-black uppercase text-center">{uploadProgress !== null ? `Up ${uploadProgress}%` : newLesson.videoUrl ? 'Video OK ✅' : 'Pick Video'}</span>
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Cover Image</label>
                  <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverUpload} className="hidden" id="c-up" />
                  <label htmlFor="c-up" className={`w-full h-24 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition ${newLesson.thumbnail ? 'bg-indigo-50/50 border-indigo-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200'}`}>
                    {newLesson.thumbnail ? <img src={newLesson.thumbnail} className="h-full w-full object-cover rounded-[1.4rem]" /> : <span className="text-[10px] font-black uppercase">Pick Cover</span>}
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Summary</label>
                <textarea 
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition h-28 text-sm font-medium dark:text-white scrollbar-hide"
                  value={newLesson.description}
                  placeholder="Master complex numbers in just 30 mins..."
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Price ($)</label>
                  <input type="number" required className="w-full bg-transparent border-none text-2xl font-black outline-none" value={newLesson.price} onChange={(e) => setNewLesson({...newLesson, price: parseFloat(e.target.value)})} />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Views</label>
                  <input type="number" required className="w-full bg-transparent border-none text-2xl font-black outline-none" value={newLesson.viewLimit} onChange={(e) => setNewLesson({...newLesson, viewLimit: parseInt(e.target.value)})} />
                </div>
              </div>
              <button 
                disabled={uploadProgress !== null}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-3xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 disabled:opacity-50"
              >
                Go Live
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl p-12 rounded-[4rem] shadow-2xl relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
            <button onClick={() => setSelectedUser(null)} className="absolute top-10 right-10 text-4xl opacity-20 hover:opacity-100 transition">&times;</button>
            
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-8">
                 <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{selectedUser.fullName}</h2>
                    <p className="text-indigo-600 font-black uppercase text-xs tracking-widest">Student Profile Details</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Gmail</label>
                       <p className="font-bold text-sm truncate dark:text-slate-300">{selectedUser.email}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Student Phone</label>
                       <p className="font-bold text-sm dark:text-slate-300">{selectedUser.phone}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Father Phone</label>
                       <p className="font-bold text-sm dark:text-slate-300">{selectedUser.fatherPhone}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Mother Phone</label>
                       <p className="font-bold text-sm dark:text-slate-300">{selectedUser.motherPhone}</p>
                    </div>
                 </div>

                 <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-indigo-400">Purchased Courses</h4>
                    {selectedUser.purchasedLessons.length === 0 ? (
                      <p className="text-xs font-bold text-slate-400 italic">No activity yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedUser.purchasedLessons.map(lid => {
                          const lesson = state.lessons.find(l => l.id === lid);
                          const act = state.activity.find(a => a.userId === selectedUser.id && a.lessonId === lid);
                          return (
                            <div key={lid} className="flex justify-between items-center text-xs font-bold p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                              <span className="text-slate-700 dark:text-slate-200">{lesson?.title || 'Unknown Lesson'}</span>
                              <span className="text-indigo-600">Views: {act?.viewsUsed || 0}/{lesson?.viewLimit || '?'}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                 </div>
              </div>

              <div className="w-full md:w-64 space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-[2.5rem] text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Wallet Balance</p>
                   <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">${selectedUser.balance}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-center text-slate-400">Security & Roles</h4>
                  <div className="flex flex-col gap-2">
                    {/* Protection: Main owner nour cannot be downgraded */}
                    {selectedUser.username === 'nour' ? (
                      <div className="bg-rose-100 text-rose-700 p-4 rounded-2xl text-[10px] font-black text-center uppercase">IMMUTABLE OWNER</div>
                    ) : (
                      <>
                        <button 
                          onClick={() => onChangeUserRole(selectedUser.id, UserRole.OWNER)}
                          className={`role-btn ${selectedUser.role === UserRole.OWNER ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600'}`}
                        >
                          Owner
                        </button>
                        <button 
                          onClick={() => onChangeUserRole(selectedUser.id, UserRole.ADMIN)}
                          className={`role-btn ${selectedUser.role === UserRole.ADMIN ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'}`}
                        >
                          Admin
                        </button>
                        <button 
                          onClick={() => onChangeUserRole(selectedUser.id, UserRole.STUDENT)}
                          className={`role-btn ${selectedUser.role === UserRole.STUDENT ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}
                        >
                          Student
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .role-btn {
          padding: 1rem;
          border-radius: 1.5rem;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s;
          width: 100%;
          border: 1px solid transparent;
        }
        .role-btn:hover {
          filter: brightness(0.9);
          transform: scale(1.02);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
