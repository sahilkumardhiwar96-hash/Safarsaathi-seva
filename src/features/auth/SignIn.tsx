import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Globe, ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supportedLanguages, messages, languageNames, type SupportedLanguage } from '@/features/i18n/languages';

interface SignInProps {
  onReturnToApp?: () => void;
}

export function SignIn({ onReturnToApp }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState<SupportedLanguage>('en');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage('Authentication failed. Please verify your work email and password.');
    } else if (onReturnToApp) {
      onReturnToApp();
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Background ambient gradient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-teal-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 shadow-lg shadow-teal-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{messages[lang].appName}</h1>
              <p className="text-xs text-slate-400">Child Continuity Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-400 backdrop-blur-md">
            <Globe size={13} className="text-teal-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              aria-label="Select language"
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
            >
              {supportedLanguages.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {languageNames[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Staff Sign-In</h2>
            <p className="mt-1 text-xs text-slate-400">
              Access the cross-district tracking and case continuation console.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <Mail size={13} className="text-slate-400" /> Official Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-teal-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                type="email"
                autoComplete="username"
                required
                placeholder="officer@welfare.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <Lock size={13} className="text-slate-400" /> Password
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-teal-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div role="alert" className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-600 hover:to-emerald-700 hover:shadow-teal-500/40 disabled:opacity-50"
          >
            {busy ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Authenticating…</span>
              </div>
            ) : (
              messages[lang].signIn
            )}
          </button>

          {onReturnToApp && (
            <button
              type="button"
              onClick={onReturnToApp}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 py-2.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-200"
            >
              <ArrowLeft size={13} /> Return to Dashboard
            </button>
          )}

          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] leading-relaxed text-slate-500">
              Protected Welfare Information System · Authorized Case Workers & Officials Only
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
