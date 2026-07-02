import { Link } from 'react-router-dom';
import { RiMotorbikeFill, RiHomeLine } from 'react-icons/ri';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative text-center fade-in">
        {/* Motorcycle icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-500/10 to-accent-400/5 border border-accent-500/20 mb-6">
          <RiMotorbikeFill className="text-5xl text-accent-400" />
        </div>

        {/* 404 */}
        <h1 className="text-7xl sm:text-9xl font-extrabold gradient-text mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Looks like this motorcycle took a wrong turn. The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <RiHomeLine /> Back to Home
        </Link>
      </div>
    </div>
  );
}
