import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMotorbikeFill, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error('Email is required');
    if (!password) return toast.error('Password is required');

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md fade-in">
        {/* Card */}
        <div className="glass rounded-3xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 shadow-lg shadow-accent-500/25 mb-4">
              <RiMotorbikeFill className="text-2xl text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-sm text-slate-600 mt-1">Sign in to continue bidding</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-dark pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-dark pl-11 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
