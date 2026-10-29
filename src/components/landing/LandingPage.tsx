import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  FileText,
  ArrowRight,
  Sparkles,
  Lock,
  Kanban,
  DollarSign,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onEnterDashboard }) => {
  const { user, signOut, demoLogin } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'reset'>('signin');

  const openAuth = (mode: 'signin' | 'signup' | 'reset') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleDemo = () => {
    demoLogin();
    onEnterDashboard();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">JobTrack</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Career Suite
              </span>
            </div>
          </div>

          {/* Scroll-to Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#board" className="hover:text-blue-600 transition">Kanban Workflow</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#security" className="hover:text-blue-600 transition">Privacy & Security</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onEnterDashboard}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-[#0f172a] text-white hover:bg-blue-900 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={signOut}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signin')}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-[#0f172a] hover:bg-blue-900 text-white transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Sign Up Free</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>The Personal Career Hub Built for Modern Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0f172a] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Organize applications. Ace interviews. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Land the highest offer.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            JobTrack is your private, end-to-end command center. Track company pipelines with interactive drag-and-drop Kanban, schedule interviews on a live calendar, track recruiter contacts, and compare offers down to the dollar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-white bg-[#0f172a] hover:bg-blue-900 transition shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-blue-950 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Explore Live Demo Account</span>
            </button>

            <button
              onClick={onNavigateToLogin}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2"
            >
              Or go to dedicated Login Page &rarr;
            </button>
          </div>

          {/* Social proof badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Private (Owner-Only Data)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Interactive Drag-and-Drop Board</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Integrated Calendar & Offers Suite</span>
            </div>
          </div>

          {/* Interactive Mockup / Visual Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-left">
            {/* Window bar */}
            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-medium text-slate-300">jobtrack.app / pipeline-board</span>
              </div>
              <span className="text-xs font-mono text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded">Active Search</span>
            </div>

            {/* Board Mockup Content */}
            <div className="p-6 bg-slate-50/60 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Col 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Applied
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">1</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900">Developer Experience</div>
                  <div className="text-slate-500 font-medium">Vercel • Remote</div>
                  <div className="mt-2 text-emerald-700 font-semibold">$165,000 / yr</div>
                </div>
              </div>

              {/* Col 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Phone Screen
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">1</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900">Senior Software Eng</div>
                  <div className="text-slate-500 font-medium">Google • Mountain View</div>
                  <div className="mt-2 text-emerald-700 font-semibold">$210,000 / yr</div>
                </div>
              </div>

              {/* Col 3 */}
              <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Interview
                  </span>
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">2</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs shadow-xs">
                    <div className="font-bold text-slate-900">Full Stack Engineer</div>
                    <div className="text-slate-500 font-medium">Stripe • Seattle</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-emerald-700 font-semibold">$185,000</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        System Design
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs shadow-xs">
                    <div className="font-bold text-slate-900">Lead Design Engineer</div>
                    <div className="text-slate-500 font-medium">Airbnb • SF</div>
                    <div className="mt-2 text-emerald-700 font-semibold">$180,000</div>
                  </div>
                </div>
              </div>

              {/* Col 4 */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Offer
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">1</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-300 text-xs shadow-sm">
                  <div className="font-bold text-slate-900">Staff Frontend Architect</div>
                  <div className="text-slate-500 font-medium">Linear • Hybrid</div>
                  <div className="mt-2 text-emerald-700 font-bold">$195k Base + $25k Bonus</div>
                  <div className="mt-1 text-[10px] text-slate-500 font-medium">$140k Equity / 4y</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Core Features</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Everything you need to run an intentional job search
            </h3>
            <p className="mt-4 text-base text-slate-600">
              No more messy spreadsheets or lost email threads. JobTrack brings every touchpoint, interview, contact, and compensation package into one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-300 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <Kanban className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Kanban Board & List Views</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly move roles from Wishlist to Applied, Phone Screen, Interview, and Offer with fluid drag-and-drop. Easily filter by status, keyword, and target salary.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-300 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Interview Calendar & Meeting URLs</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interactive monthly calendar with direct meeting links, interview formats, prep notes, and strict start/end time validation to keep your schedule accurate.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-300 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Offer & Salary Negotiation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log annual base salaries, sign-on bonuses, equity grants, benefits, and response deadlines. Store negotiation notes side by side to compare competing offers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-300 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Recruiter & Referral Rolodex</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keep every recruiter, hiring manager, and internal referral at your fingertips with direct emails, phone numbers, relationship tags, and communication history.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-300 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Document & Resume Locker</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track customized resume versions, tailored cover letters, portfolios, and reference letters linked directly to the exact job application they were sent for.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-300 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Action Items & Next Steps</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never drop the ball on follow-up emails, take-home assignments, or thank-you notes with integrated due-date reminders and one-click completion toggles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board & Workflow Section */}
      <section id="board" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Visual Workflow</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mt-2 tracking-tight">
                Master the full hiring funnel from first click to signature
              </h3>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Job applications move through distinct phases. JobTrack mirrors the modern hiring pipeline with 8 standardized stages:
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-bold">
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> 1. Wishlist
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> 2. Applied
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> 3. Phone Screen
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> 4. Interview
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> 5. Offer
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 6. Accepted
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> 7. Rejected
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 8. Withdrawn
                </span>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => openAuth('signup')}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#0f172a] hover:bg-blue-900 transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Build Your Pipeline Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Detail Tabs Mockup */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Application 360° Detail</h4>
                  <p className="text-xs text-slate-500">Every record is linked cleanly to its parent role</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  Interview Stage
                </span>
              </div>

              {/* Mock tabs */}
              <div className="flex gap-2 mt-4 text-xs font-bold border-b border-slate-100 pb-2">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-1">Overview</span>
                <span className="text-slate-400">Interviews (2)</span>
                <span className="text-slate-400">Contacts (1)</span>
                <span className="text-slate-400">Notes (2)</span>
                <span className="text-slate-400">Documents (1)</span>
                <span className="text-slate-400">Offers</span>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Role:</span>
                  <span className="font-bold text-slate-800">Senior Full Stack Engineer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Company:</span>
                  <span className="font-bold text-slate-800">Stripe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Expected Annual Salary:</span>
                  <span className="font-bold text-emerald-700">$185,000 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Location:</span>
                  <span className="font-medium text-slate-700">Seattle, WA (Remote Available)</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Cascade deletion guarantees clean cleanup</span>
                <span className="text-rose-600 font-bold">Cascade Protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Simple 3-Step Setup</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mt-2 tracking-tight">
              From applied to accepted in record time
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Add Your Applications</h4>
              <p className="text-sm text-slate-600">
                Save target companies, job descriptions, expected salaries, and applied dates with instant validation.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Track Interviews & Notes</h4>
              <p className="text-sm text-slate-600">
                Schedule rounds on your interactive calendar, attach recruiter contacts, and stay ahead of follow-up tasks.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">Compare Offers & Close</h4>
              <p className="text-sm text-slate-600">
                Log bonuses, stock options, and perks side by side to negotiate with complete leverage and confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section id="security" className="py-16 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight">Your Career Data Is Owner-Only</h3>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Every single application, compensation note, recruiter email, and resume is isolated strictly to your user account. No public access, no shared leaks, no tracking.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => openAuth('signup')}
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer shadow-lg shadow-blue-500/20"
              >
                Create Private Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-base text-slate-900 mb-1">How does the drag-and-drop Kanban board work?</h4>
              <p className="text-sm text-slate-600">
                Simply click and drag any application card into any of the 8 status columns (Wishlist, Applied, Phone Screen, Interview, Offer, Rejected, Withdrawn, Accepted). The status updates immediately in your pipeline.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-base text-slate-900 mb-1">What happens when I delete an application?</h4>
              <p className="text-sm text-slate-600">
                JobTrack executes a safe cascade deletion: deleting an application will also remove its linked interviews, recruiter contacts, personal notes, documents, and offers so you never have orphaned records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-base text-slate-900 mb-1">Can I test JobTrack without creating a new email?</h4>
              <p className="text-sm text-slate-600">
                Yes! Click "Explore Live Demo Account" anywhere on the landing page to instantly sign in as our pre-seeded demo user with realistic applications, upcoming interviews, and offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="font-bold text-slate-800 text-sm">JobTrack</span>
            <span className="text-slate-400">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#security" className="hover:text-slate-900 transition">Privacy</a>
            <button onClick={() => openAuth('signin')} className="hover:text-blue-600 transition cursor-pointer">
              Sign In
            </button>
            <button onClick={() => openAuth('signup')} className="hover:text-blue-600 transition cursor-pointer">
              Register
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={onEnterDashboard}
      />
    </div>
  );
};
