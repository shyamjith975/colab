import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, loginWithPassword, signupWithPassword } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('creator');
  const [location, setLocation] = useState('Mumbai, Maharashtra');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!showLoginModal) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const result = await loginWithPassword(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
    } else {
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        setShowLoginModal(false);
        navigate('/dashboard');
      }, 500);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await signupWithPassword({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      location: location.trim()
    });
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to create account.');
    } else {
      setSuccessMessage('Account created and logged in successfully!');
      setTimeout(() => {
        setShowLoginModal(false);
        navigate('/dashboard');
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-200">
              co
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signin' ? 'Sign In to co-lab' : 'Create an Account'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                SHA-256 Encrypted Authentication • colab.db
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowLoginModal(false);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'signin'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="flex items-start space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-bold text-slate-700">Password</label>
                <span className="text-[10px] text-slate-400 font-medium">SHA-256 Hashed</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Test Credentials Helper Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pre-seeded Database Accounts:</span>
              </div>
              <p className="text-slate-500">
                Default Password for all seeded users: <strong className="text-indigo-700">Colab@2026</strong>
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => { setEmail('ananya@colab.test'); setPassword('Colab@2026'); }}
                  className="bg-white px-2 py-0.5 border border-slate-200 hover:border-indigo-400 rounded text-[10px] font-semibold text-slate-700"
                >
                  ananya@colab.test (Creator)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('contact@aroma.test'); setPassword('Colab@2026'); }}
                  className="bg-white px-2 py-0.5 border border-slate-200 hover:border-indigo-400 rounded text-[10px] font-semibold text-slate-700"
                >
                  contact@aroma.test (Brand)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@colab.test'); setPassword('Colab@2026'); }}
                  className="bg-white px-2 py-0.5 border border-slate-200 hover:border-indigo-400 rounded text-[10px] font-semibold text-slate-700"
                >
                  admin@colab.test (Admin)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 text-xs"
              >
                <option value="creator">Creator / Influencer / UGC Artist</option>
                <option value="business">Business / Boutique / D2C Brand</option>
                <option value="sponsor">Corporate Sponsor / Advertiser</option>
                <option value="organiser">College Fest / Event Organiser</option>
                <option value="agency">Marketing & Talent Agency</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Thiruvananthapuram, Kerala"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Create Password (min. 6 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-900 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-2 mt-2"
            >
              <span>{loading ? 'Creating Account in colab.db...' : 'Create Account (SHA-256)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
