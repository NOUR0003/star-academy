
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Lesson, UserLessonActivity, UserRole, AppState, DepositRequest, DepositStatus } from './types';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MemberHome from './pages/MemberHome';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LessonView from './pages/LessonView';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ProfilePage from './pages/ProfilePage';

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Advanced Calculus Basics',
    description: 'A deep dive into derivatives and integrals for high school seniors.',
    price: 50,
    viewLimit: 3,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://picsum.photos/seed/math/400/225'
  },
  {
    id: 'l2',
    title: 'Organic Chemistry: Hydrocarbons',
    description: 'Understanding alkanes, alkenes, and alkynes with practical examples.',
    price: 75,
    viewLimit: 5,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://picsum.photos/seed/chem/400/225'
  }
];

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('edu_dark_mode') === 'true';
  });

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('edu_app_state');
    if (saved) return JSON.parse(saved);
    return {
      users: [
        { 
          id: 'u0', 
          username: 'nour', 
          email: 'nour@gmail.com', 
          fullName: 'Eng. Shehab Elebady', 
          phone: '01028178830', 
          fatherPhone: 'N/A', 
          motherPhone: 'N/A', 
          role: UserRole.OWNER, 
          balance: 10000, 
          purchasedLessons: [] 
        }
      ],
      lessons: INITIAL_LESSONS,
      activity: [],
      depositRequests: [],
      currentUser: null
    };
  });

  useEffect(() => {
    localStorage.setItem('edu_app_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('edu_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const login = (identifier: string) => {
    // Identifier can be Gmail or Phone
    const user = state.users.find(u => u.email === identifier || u.phone === identifier);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User>) => {
    if (state.users.find(u => u.username === userData.username || u.email === userData.email || u.phone === userData.phone)) return false;
    const newUser: User = {
      id: `u${Date.now()}`,
      username: userData.username || '',
      email: userData.email || '',
      fullName: userData.fullName || '',
      phone: userData.phone || '',
      fatherPhone: userData.fatherPhone || '',
      motherPhone: userData.motherPhone || '',
      role: UserRole.STUDENT,
      balance: 0,
      purchasedLessons: []
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser], currentUser: newUser }));
    return true;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const requestDeposit = (amount: number) => {
    if (!state.currentUser) return;
    const request: DepositRequest = {
      id: `dr${Date.now()}`,
      userId: state.currentUser.id,
      username: state.currentUser.username,
      amount,
      status: DepositStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      depositRequests: [...prev.depositRequests, request]
    }));
  };

  const processDeposit = (requestId: string, approve: boolean) => {
    setState(prev => {
      const request = prev.depositRequests.find(r => r.id === requestId);
      if (!request || request.status !== DepositStatus.PENDING) return prev;

      const updatedRequests = prev.depositRequests.map(r => 
        r.id === requestId ? { ...r, status: approve ? DepositStatus.APPROVED : DepositStatus.REJECTED } : r
      );

      let updatedUsers = prev.users;
      if (approve) {
        updatedUsers = prev.users.map(u => 
          u.id === request.userId ? { ...u, balance: u.balance + request.amount } : u
        );
      }

      return {
        ...prev,
        depositRequests: updatedRequests,
        users: updatedUsers,
        currentUser: prev.currentUser?.id === request.userId ? updatedUsers.find(u => u.id === request.userId) || null : prev.currentUser
      };
    });
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    if (!state.currentUser || (state.currentUser.role !== UserRole.OWNER && state.currentUser.role !== UserRole.ADMIN)) return;
    
    // Protection: Immutable primary owner "nour"
    const targetUser = state.users.find(u => u.id === userId);
    if (targetUser?.username === 'nour') {
      alert("Permission Denied: The primary owner account cannot be modified.");
      return;
    }

    // Protection: Admins can't demote Owners
    if (state.currentUser.role === UserRole.ADMIN && targetUser?.role === UserRole.OWNER) {
      alert("Permission Denied: Admins cannot change owner permissions.");
      return;
    }

    // Protection: Self-downgrade
    if (state.currentUser.id === userId) return;

    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, role: newRole } : u)
    }));
  };

  const updateBalanceManually = (userId: string, amount: number) => {
    setState(prev => {
      const updatedUsers = prev.users.map(u => 
        u.id === userId ? { ...u, balance: Math.max(0, u.balance + amount) } : u
      );
      return {
        ...prev,
        users: updatedUsers,
        currentUser: prev.currentUser?.id === userId ? updatedUsers.find(u => u.id === userId) || null : prev.currentUser
      };
    });
  };

  const buyLesson = (lessonId: string) => {
    const user = state.currentUser;
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (!user || !lesson || user.balance < lesson.price || user.purchasedLessons.includes(lessonId)) return false;

    setState(prev => {
      const updatedUsers = prev.users.map(u => 
        u.id === user.id 
          ? { ...u, balance: u.balance - lesson.price, purchasedLessons: [...u.purchasedLessons, lessonId] } 
          : u
      );
      const newActivity: UserLessonActivity = {
        userId: user.id,
        lessonId,
        viewsUsed: 0,
        purchaseDate: new Date().toISOString()
      };
      return { 
        ...prev, 
        users: updatedUsers, 
        currentUser: updatedUsers.find(u => u.id === user.id) || null,
        activity: [...prev.activity, newActivity]
      };
    });
    return true;
  };

  const trackView = (lessonId: string) => {
    if (!state.currentUser) return;
    setState(prev => {
      const activity = prev.activity.map(a => 
        (a.userId === prev.currentUser?.id && a.lessonId === lessonId)
          ? { ...a, viewsUsed: a.viewsUsed + 1 }
          : a
      );
      return { ...prev, activity };
    });
  };

  const addLesson = (lesson: Lesson) => {
    setState(prev => ({ ...prev, lessons: [...prev.lessons, lesson] }));
  };

  const deleteLesson = (id: string) => {
    setState(prev => ({ ...prev, lessons: prev.lessons.filter(l => l.id !== id) }));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
        <Navbar user={state.currentUser} onLogout={logout} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                state.currentUser 
                  ? <MemberHome user={state.currentUser} lessons={state.lessons} activity={state.activity} /> 
                  : <LandingPage />
              } 
            />
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage onRegister={register} />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route 
              path="/profile" 
              element={state.currentUser ? <ProfilePage user={state.currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard" 
              element={
                (state.currentUser?.role === UserRole.ADMIN || state.currentUser?.role === UserRole.OWNER)
                  ? <Navigate to="/admin" /> 
                  : <StudentDashboard 
                      user={state.currentUser} 
                      lessons={state.lessons} 
                      activity={state.activity}
                      depositRequests={state.depositRequests}
                      onRecharge={requestDeposit}
                      onPurchase={buyLesson}
                    />
              } 
            />
            <Route 
              path="/admin" 
              element={
                (state.currentUser?.role === UserRole.ADMIN || state.currentUser?.role === UserRole.OWNER)
                  ? <AdminDashboard 
                      state={state} 
                      onUpdateBalance={updateBalanceManually}
                      onAddLesson={addLesson}
                      onDeleteLesson={deleteLesson}
                      onProcessDeposit={processDeposit}
                      onChangeUserRole={changeUserRole}
                    /> 
                  : <Navigate to="/dashboard" />
              } 
            />
            <Route 
              path="/lesson/:id" 
              element={
                <LessonView 
                  lessons={state.lessons} 
                  activity={state.activity} 
                  currentUser={state.currentUser}
                  onTrackView={trackView}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
