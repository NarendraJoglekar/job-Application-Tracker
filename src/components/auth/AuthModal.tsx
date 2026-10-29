import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'reset';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess,
}) => {
  const { signIn, signUp, resetPassword, demoLogin } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
          onClose();
          onSuccess?.();
        } else if (res.error) {
          setErrors({ form: res.error });
        }
      } else if (mode === 'signup') {
        const res = await signUp(name, email, password);
        if (res.success) {
          onClose();
          onSuccess?.();
        } else if (res.error) {
          setErrors({ form: res.error });
        }
      } else if (mode === 'reset') {
        const res = await resetPassword(email);
        if (res.success) {
          // Switch to sign in after notification
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
    onClose();
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy Header Accent */}
        <div className="bg-[#0f172a] px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">JobTrack</span>
          </div>

          <h2 className="text-xl font-bold">
            {mode === 'signin' && 'Welcome back to JobTrack'}
            {mode === 'signup' && 'Create your JobTrack account'}
            {mode === 'reset' && 'Reset your password'}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {mode === 'signin' && 'Sign in to access your personal pipeline and offers.'}
            {mode === 'signup' && 'Start organizing your applications, interviews, and offers.'}
            {mode === 'reset' && "Enter your email to receive a password reset link."}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
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
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
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
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#0f172a] hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In to Dashboard'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemo}
              className="w-full py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Explore as Demo User (Pre-populated Data)</span>
            </button>
          </div>

          {/* Toggle between Modes */}
          <div className="mt-4 text-center text-xs text-slate-500">
            {mode === 'signin' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Sign up for free
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Log in here
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
