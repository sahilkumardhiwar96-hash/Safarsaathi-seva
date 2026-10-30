import { useEffect, useState } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { SignIn } from '@/features/auth/SignIn';
import { Layout } from '@/app/Layout';
import { AppRoutes } from '@/app/routes';
import { supportedLanguages, messages, languageNames, type SupportedLanguage } from '@/features/i18n/languages';
import { Globe, LogOut, UserCheck } from 'lucide-react';

function MainAppShell() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginScreen, setShowLoginScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.has('login') || params.has('signin');
  });

  useEffect(() => {
    let mounted = true;

    // Safety timeout to ensure app never hangs on a blank loading screen
    const timeout = setTimeout(() => {
      if (mounted) setAuthReady(true);
    }, 1200);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) {
          setSession(data?.session || null);
          setAuthReady(true);
        }
      })
      .catch((err) => {
        console.warn('Session check warning:', err);
        if (mounted) setAuthReady(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setAuthReady(true);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  function handleReturnToApp() {
    setShowLoginScreen(false);
    navigate('/');
  }

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          <span className="font-medium tracking-wide text-slate-300">Loading MMS Suraksha…</span>
        </div>
      </div>
    );
  }

  if (!session || showLoginScreen || location.pathname === '/login') {
    return <SignIn onReturnToApp={session ? handleReturnToApp : undefined} />;
  }

  return (
    <div className="min-h-screen bg-slate-900/5 selection:bg-teal-500 selection:text-white">
      {/* Top utility bar */}
      <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 text-xs text-slate-600 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-bold tracking-tight text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            {messages[lang].appName}
          </span>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
            <Globe size={12} className="text-teal-600" />
            <select
              id="lang-select"
              value={lang}
              aria-label="Select language"
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent font-medium text-xs text-slate-700 outline-none cursor-pointer"
            >
              {supportedLanguages.map((code) => (
                <option key={code} value={code}>
                  {languageNames[code]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="text-xs text-slate-500 hover:text-teal-700 transition-colors"
            onClick={() => setShowLoginScreen(true)}
          >
            Switch Account
          </button>
          
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
            <UserCheck size={12} className="text-emerald-600" />
            <span className="max-w-[150px] truncate">{session.user.email}</span>
          </div>

          <button
            className="flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) console.error('Sign-out failed:', error);
            }}
          >
            <LogOut size={12} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <Layout>
        <AppRoutes />
      </Layout>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <MainAppShell />
    </BrowserRouter>
  );
}

export default App;
