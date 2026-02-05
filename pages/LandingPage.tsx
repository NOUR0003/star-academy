
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 dark:opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'rgb(79, 70, 229)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgb(147, 51, 234)', stopOpacity:1}} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-indigo-100 dark:border-indigo-900/50">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            The Ultimate Math Experience
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-none tracking-tighter">
            Learn Math from <br/><span className="text-indigo-600 dark:text-indigo-400">The Legend.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 font-medium">
            Join the academy of <span className="text-slate-900 dark:text-white font-bold underline decoration-indigo-500">Eng. Shehab Elebady</span>. Master Secondary Mathematics with high-definition lessons and engineering-grade precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-[2rem] font-bold shadow-2xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95">
              Start Learning Now
            </Link>
            <Link to="/about" className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-800 dark:text-slate-200 px-12 py-5 rounded-[2rem] font-bold transition-all shadow-sm">
              Meet The Math Legend
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits for Students */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">World-Class Math Tutoring</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Everything you need to conquer your final exams with confidence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "Legendary Content", 
                desc: "Every lesson is crafted by Eng. Shehab to ensure maximum retention and understanding of complex Math.",
                icon: "📐"
              },
              { 
                title: "Crystal Clear Video", 
                desc: "High-definition video lessons that make you feel like you're sitting in the front row of the classroom.",
                icon: "🎥"
              },
              { 
                title: "Smart Wallet", 
                desc: "A flexible payment system built for students. Top up easily and unlock specific chapters as you go.",
                icon: "💎"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all group">
                <div className="text-5xl mb-8 group-hover:scale-125 transition-transform origin-left">{f.icon}</div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 leading-tight">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-indigo-600 dark:bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">Don't just pass. Excel.</h2>
          <p className="text-xl mb-12 opacity-80 font-medium">Join thousands of students who have turned their Math fears into their greatest strengths.</p>
          <Link to="/register" className="bg-white text-indigo-600 px-16 py-6 rounded-[2rem] font-black shadow-2xl hover:bg-slate-100 transition transform active:scale-95 text-lg">
            Join the Legend's Academy
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
