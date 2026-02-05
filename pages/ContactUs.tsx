
import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 transition-colors">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Get in Touch</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-semibold">We are here to support your educational journey.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <a 
          href="https://wa.me/201201212002" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">💬</div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Direct WhatsApp</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Message Eng. Shehab directly for any urgent questions or help.</p>
          <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs">+20 120 121 2002</span>
        </a>

        <a 
          href="https://chat.whatsapp.com/EqW5kZnqCIG4i9viyVeMsb" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition">👥</div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Student Group</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Join our community of over 1,000 students on WhatsApp.</p>
          <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs">Join Group →</span>
        </a>
      </div>

      <div className="mt-20 bg-indigo-600 dark:bg-indigo-950 p-12 rounded-[3rem] text-white text-center">
        <h3 className="text-2xl font-black mb-4">Location & Hours</h3>
        <p className="opacity-80 leading-relaxed max-w-lg mx-auto font-medium">
          The Academy operates primarily online, but our support team is available via WhatsApp from 9:00 AM to 9:00 PM every day.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
