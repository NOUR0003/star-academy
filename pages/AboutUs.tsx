
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 transition-colors">
      <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] rotate-3 -z-10"></div>
            {/* Using the specific provided photo of Eng. Shehab Elebady */}
            <div className="w-full rounded-[3rem] shadow-2xl overflow-hidden aspect-[1/1] bg-slate-200 flex items-center justify-center relative">
               <img 
                src="https://i.postimg.cc/nVg4Fq3R/Whats-App-Image-2026-01-05-at-08-20-43-c113e2d2.jpg" 
                alt="Eng. Shehab Elebady - Math Legend" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-800">
                 <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Chief Visionary</p>
                 <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">Math Legend</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-4 block">The Elite Tutor</span>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 leading-none tracking-tighter">Eng. Shehab <br/>Elebady</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
            Recognized as the <span className="text-indigo-600 dark:text-indigo-400 font-bold">Math Legend</span>, Eng. Shehab Elebady has revolutionized secondary school mathematics for thousands of students.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">
            With a unique engineering perspective, he transforms complex equations into simple, logical puzzles that any student can solve with confidence.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">15+</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Teaching Years</div>
            </div>
            <div>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">10k+</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Success Stories</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">Academic Philosophy</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl font-black">∑</div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">Precision & Logic</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We apply Engineering rigor to Math education. Every formula has a story, and every problem has a logical path to victory.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center text-2xl font-black">∞</div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">Limitless Growth</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Math is the language of the universe. Mastering it opens doors to every high-paying career path in existence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
