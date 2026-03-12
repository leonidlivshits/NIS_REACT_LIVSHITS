import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 opacity-60 blur-3xl transform-gpu animate-blob" />
      <div className="absolute right-0 top-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-600 opacity-50 blur-2xl transform-gpu animate-blob animation-delay-2000" />
      <div className="absolute left-10 bottom-0 w-72 h-72 rounded-full bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 opacity-40 blur-2xl transform-gpu animate-blob animation-delay-4000" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
    </div>
  );
};

export default AnimatedBackground;