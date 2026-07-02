import { RiMotorbikeFill } from 'react-icons/ri';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
      {/* Pulsing motorcycle icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-accent-500/20 animate-ping" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-500/20 to-accent-400/10 border border-accent-500/30">
          <RiMotorbikeFill className="text-4xl text-accent-400 animate-pulse" />
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-6 text-slate-600 text-sm font-medium tracking-widest uppercase animate-pulse">
        Loading...
      </p>

      {/* Gradient bar */}
      <div className="mt-4 w-48 h-1 rounded-full bg-slate-50 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-accent-500 to-accent-400 animate-[slideRight_1.5s_ease-in-out_infinite]"
          style={{
            animation: 'slideRight 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
