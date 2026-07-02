import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMotorbikeFill, RiMailLine, RiLockLine, RiUserLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (!form.password) return toast.error('Password is required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-accent-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md fade-in">
        <div className="glass rounded-3xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 shadow-lg shadow-accent-500/25 mb-4">
              <RiMotorbikeFill className="text-2xl text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
            <p className="text-sm text-slate-600 mt-1">Join the motorcycle auction community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-dark pl-11"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-dark pl-11 pr-11"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="input-dark pl-11"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
