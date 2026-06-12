import React, { useState } from 'react';
import { User, AuditLog } from '../types';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  UserSquare2, 
  ChevronDown 
} from 'lucide-react';

interface LoginProps {
  allUsers: User[];
  onLogin: (user: User) => void;
  auditLogs: AuditLog[];
}

export const Login: React.FC<LoginProps> = ({ allUsers, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedRole) {
      setErrorMessage('Please select your institutional role.');
      return;
    }
    if (!emailInput.trim()) {
      setErrorMessage('Please enter your authorized email address.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMessage('Please enter your secure password.');
      return;
    }

    // Attempt matching email and role
    const matchedUser = allUsers.find(
      (u) => 
        u.email.toLowerCase() === emailInput.trim().toLowerCase() && 
        u.role === selectedRole
    );

    if (!matchedUser) {
      setErrorMessage(`Authentication Failed: No user profile with role "${selectedRole}" matches the email "${emailInput}". Please verify your credentials or contact the IT department.`);
      return;
    }

    // Success login
    onLogin(matchedUser);
  };

  // Mock handlers for standard links to keep app active
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Security Notice: Standard password recovery token dispatched to IT Administrator. If testing, please use a valid registered personnel email.');
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Account Request Submitted: New staff registration requires principal council approval. Please contact the Super Administrator to set up or map new roster roles.');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 font-sans selection:bg-emerald-500 selection:text-white relative">
      
      {/* Decorative enterprise glassmorphism blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-[32rem] h-[32rem] rounded-full bg-emerald-50/50 opacity-50 blur-3xl" />
        <div className="absolute bottom-[10%] right-[15%] w-[32rem] h-[32rem] rounded-full bg-blue-50/50 opacity-50 blur-3xl" />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center space-y-6 animate-fade-in">
        
        {/* Institutional Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-emerald-600 text-white p-3 rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 transition-transform">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight text-gray-900 uppercase">
              SchoolFlow
            </h1>
            <p className="text-3xs text-gray-400 font-bold tracking-wider uppercase">
              Enterprise Academic Operations Console
            </p>
          </div>
        </div>

        {/* Standard Single Card Form */}
        <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-sans font-extrabold text-gray-800">
              Account Login
            </h2>
            <p className="text-xs text-gray-400">
              Access the syllabus ledger, requests and auditing tools.
            </p>
          </div>

          <form onSubmit={handleCredentialLogin} className="space-y-4">
            {errorMessage && (
              <div 
                id="login-error-alert" 
                className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2.5 text-rose-800 text-xs font-semibold"
              >
                <AlertCircle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Field 1: Role Selection */}
            <div className="space-y-1.5">
              <label 
                htmlFor="login-role-select" 
                className="text-3xs font-extrabold text-gray-500 uppercase tracking-widest block"
              >
                Institutional Role
              </label>
              <div className="relative">
                <UserSquare2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  id="login-role-select"
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs text-gray-800 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Choose designation role --</option>
                  <option value="Teacher">Teacher / Academic Instructor</option>
                  <option value="Head of Department">Head of Department (HoD)</option>
                  <option value="Sectional Head">Sectional Head</option>
                  <option value="Deputy Principal">Deputy Principal</option>
                  <option value="Principal">Principal Seat</option>
                  <option value="Super Administrator">Super Administrator / IT Manager</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Field 2: Email */}
            <div className="space-y-1.5">
              <label 
                htmlFor="login-email-input" 
                className="text-3xs font-extrabold text-gray-500 uppercase tracking-widest block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="login-email-input"
                  type="email"
                  placeholder="e.g. james.carter@schoolflow.edu"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs text-gray-800 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Field 3: Password & Forgot Password inline wrap */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label 
                  htmlFor="login-password-input" 
                  className="text-3xs font-extrabold text-gray-500 uppercase tracking-widest block"
                >
                  Password Key
                </label>
                <a
                  href="#"
                  id="link-forgot-password"
                  onClick={handleForgotPassword}
                  className="text-3xs font-bold text-emerald-600 hover:text-emerald-750 uppercase tracking-wider transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter secret credentials"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-gray-800 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Control */}
            <button
              type="submit"
              id="btn-login-submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 uppercase tracking-wide transition-all duration-150 cursor-pointer select-none mt-2"
            >
              <span>Verify and Login</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Signup alternative selection */}
          <div className="border-t border-gray-100 pt-4 text-center">
            <span className="text-2xs text-gray-400 font-semibold uppercase tracking-wider">
              Don't have an account?{' '}
              <a
                href="#"
                id="link-register-signup"
                onClick={handleSignUp}
                className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors underline underline-offset-4"
              >
                Register Staff Member
              </a>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
