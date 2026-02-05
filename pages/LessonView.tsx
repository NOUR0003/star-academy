
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, UserLessonActivity, User } from '../types';
import { generateLessonSummary, generateQuickQuiz } from '../services/geminiService';

interface LessonViewProps {
  lessons: Lesson[];
  activity: UserLessonActivity[];
  currentUser: User | null;
  onTrackView: (id: string) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lessons, activity, currentUser, onTrackView }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<string>('Generating AI summary...');
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const lesson = lessons.find(l => l.id === id);
  const userActivity = activity.find(a => a.userId === currentUser?.id && a.lessonId === id);

  useEffect(() => {
    if (!currentUser || !lesson || !currentUser.purchasedLessons.includes(lesson.id)) {
      navigate('/dashboard');
      return;
    }

    if (userActivity && userActivity.viewsUsed >= lesson.viewLimit) {
      alert("View limit reached for this lesson!");
      navigate('/dashboard');
    }
  }, [id, currentUser, lesson, userActivity, navigate]);

  const handlePlay = () => {
    if (!viewTracked) {
      onTrackView(lesson!.id);
      setViewTracked(true);
    }
  };

  const handleFetchAI = async () => {
    if (!lesson) return;
    setLoadingAI(true);
    const [sum, q] = await Promise.all([
      generateLessonSummary(lesson.title, lesson.description),
      generateQuickQuiz(lesson.title, lesson.description)
    ]);
    setSummary(sum || 'No summary available.');
    setQuiz(q || []);
    setLoadingAI(false);
  };

  if (!lesson) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video shadow-2xl flex items-center justify-center border-4 border-slate-800">
        <video 
          ref={videoRef}
          src={lesson.videoUrl} 
          controls 
          className="w-full h-full"
          onPlay={handlePlay}
          controlsList="nodownload"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{lesson.title}</h1>
            <p className="text-slate-600 leading-relaxed mb-6">{lesson.description}</p>
            <div className="flex items-center space-x-4">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                {userActivity ? lesson.viewLimit - userActivity.viewsUsed : lesson.viewLimit} Views Left
              </span>
              <span className="text-slate-400 text-xs font-medium">Purchased on {userActivity ? new Date(userActivity.purchaseDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                <span className="text-2xl">✨</span> AI Study Assistant
              </h3>
              <button 
                onClick={handleFetchAI}
                disabled={loadingAI}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loadingAI ? 'Thinking...' : 'Generate Helper'}
              </button>
            </div>
            
            {loadingAI ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {summary !== 'Generating AI summary...' && (
                  <div className="prose prose-indigo max-w-none text-indigo-800">
                    <p className="whitespace-pre-wrap">{summary}</p>
                  </div>
                )}
                {quiz.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-indigo-200">
                    <h4 className="font-bold text-indigo-900">Quick Knowledge Check</h4>
                    {quiz.map((q, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-indigo-100">
                        <p className="text-sm font-bold mb-3">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt: string, oi: number) => (
                            <button key={oi} className="text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-100 text-xs transition font-medium border border-transparent hover:border-indigo-200">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Your Progress</h3>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(userActivity?.viewsUsed || 0) / lesson.viewLimit * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 font-bold">
              You've used {userActivity?.viewsUsed} out of {lesson.viewLimit} allowed views.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl text-white">
            <h3 className="font-bold mb-4">Next Recommended</h3>
            <div className="space-y-4">
              {lessons.filter(l => l.id !== lesson.id).slice(0, 2).map(l => (
                <div key={l.id} className="flex gap-3 group cursor-pointer" onClick={() => navigate(`/lesson/${l.id}`)}>
                  <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                    <img src={l.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold line-clamp-1">{l.title}</h5>
                    <p className="text-[10px] opacity-60">${l.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
