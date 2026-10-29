import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onBackToLanding: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding, onSuccess }) => {
  const { signIn, signUp, resetPassword, demoLogin } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (mode === 'signup' && !name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (mode !== 'reset') {
      if (!password) {
        errs.password = 'Password is required';
      } else if (mode === 'signup' && password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (res.success) {
          onSuccess();
        } else if (res.error) {
          setErrors({ form: res.error });
        }
      } else if (mode === 'signup') {
        const res = await signUp(name, email, password);
        if (res.success) {
          onSuccess();
        } else if (res.error) {
          setErrors({ form: res.error });
        }
      } else if (mode === 'reset') {
        const res = await resetPassword(email);
        if (res.success) {
          setMode('signin');
        } else if (res.error) {
          setErrors({ form: res.error });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoLogin();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 px-4 sm:px-0">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to JobTrack Home</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0f172a] text-white shadow-xl mb-4">
          <Briefcase className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">JobTrack</h1>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          {mode === 'signin' && 'Sign in to access your confidential pipeline'}
          {mode === 'signup' && 'Create your personal workspace today'}
          {mode === 'reset' && 'Reset your account password via email'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-100">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`pb-3 text-sm font-bold flex-1 text-center transition border-b-2 cursor-pointer ${
                mode === 'signin'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`pb-3 text-sm font-bold flex-1 text-center transition border-b-2 cursor-pointer ${
                mode === 'signup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode('reset')}
              className={`pb-3 text-sm font-bold flex-1 text-center transition border-b-2 cursor-pointer ${
                mode === 'reset'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Reset
            </button>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                        : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#0f172a] hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Password Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo shortcut */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemo}
              className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>One-Click Demo Sign In (Preloaded Data)</span>
            </button>
          </div>

          <div className="mt-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Owner-Only Security:</strong> All applications, interviews, contacts, and offers remain completely private to your signed-in profile.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
