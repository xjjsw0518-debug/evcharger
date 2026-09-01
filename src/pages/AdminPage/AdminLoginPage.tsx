import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Logo from '@/components/Logo';
import FloatingContactButtons from '@/components/FloatingContactButtons';

const LOCK_KEY = '__youpei_admin_lock';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_KEY = '__youpei_admin_session';

function getLockState(): { attempts: number; lockedUntil: number | null } {
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
        lockedUntil: typeof parsed.lockedUntil === 'number' ? parsed.lockedUntil : null,
      };
    }
  } catch (e) {
    console.warn('Failed to parse lock state:', String(e));
  }
  return { attempts: 0, lockedUntil: null };
}

function setLockState(attempts: number, lockedUntil: number | null) {
  try {
    localStorage.setItem(LOCK_KEY, JSON.stringify({ attempts, lockedUntil }));
  } catch {
    // ignore
  }
}

function clearLockState() {
  try {
    localStorage.removeItem(LOCK_KEY);
  } catch {
    // ignore
  }
}

export function isAdminLoggedIn(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.loggedInAt) return false;
    return true;
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(username: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      username,
      loggedInAt: Date.now(),
    }));
  } catch {
    // ignore
  }
}

export function clearAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { settings, loaded } = useSiteSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockInfo, setLockInfo] = useState(getLockState());

  const isLocked = lockInfo.lockedUntil && Date.now() < lockInfo.lockedUntil;
  const remainingLockSeconds = isLocked
    ? Math.ceil((lockInfo.lockedUntil! - Date.now()) / 1000)
    : 0;
  const attemptsLeft = MAX_ATTEMPTS - lockInfo.attempts;

  useEffect(() => {
    document.title = 'Admin Login - youpei auto';
    return () => {
      document.title = 'youpei auto - Wholesale EV Charging Accessories';
    };
  }, []);

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      setLockInfo(getLockState());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loaded) return;
    if (isLocked) {
      setError(`尝试次数过多，请 ${formatRemainingTime(remainingLockSeconds)} 后再试`);
      return;
    }
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    // Simulate async check for UX
    await new Promise(r => setTimeout(r, 500));

    const correctUser = settings.adminUsername;
    const correctPass = settings.adminPassword;

    if (username.trim() === correctUser && password === correctPass) {
      clearLockState();
      setLockInfo({ attempts: 0, lockedUntil: null });
      setAdminLoggedIn(username.trim());
      navigate(`/XUEJIAN-manage`, { replace: true });
    } else {
      const newAttempts = lockInfo.attempts + 1;
      let lockedUntil: number | null = null;
      if (newAttempts >= MAX_ATTEMPTS) {
        lockedUntil = Date.now() + LOCK_DURATION_MS;
      }
      setLockState(newAttempts, lockedUntil);
      setLockInfo({ attempts: newAttempts, lockedUntil });

      if (lockedUntil) {
        setError('尝试次数过多，请10分钟后再试');
      } else {
        const left = MAX_ATTEMPTS - newAttempts;
        setError(`用户名或密码错误，还剩 ${left} 次尝试机会`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden px-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0D9488]/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/40 p-8 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary/10 p-4 rounded-2xl mb-4">
              <Shield className="size-8 text-primary" />
            </div>
            <div className="bg-background/50 -mx-1 px-3 py-1.5 rounded-lg inline-block">
              <Logo size="md" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mt-4 text-center">
              Admin Login
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理后台登录
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Username / 用户名
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10 h-11"
                  autoComplete="username"
                  disabled={isLocked || loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password / 密码
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 pr-10 h-11"
                  autoComplete="current-password"
                  disabled={isLocked || loading}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(e as unknown as FormEvent);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2 text-center">
                {error}
              </div>
            )}

            {/* Lock info */}
            {isLocked && (
              <div className="text-sm text-warning bg-warning/10 border border-warning/20 rounded-md px-3 py-2 text-center">
                账户已锁定，剩余锁定时间：{formatRemainingTime(remainingLockSeconds)}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLocked || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login / 登录'
              )}
            </Button>

            {/* Attempts reminder */}
            {!isLocked && lockInfo.attempts > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                剩余尝试次数：{attemptsLeft} 次
              </p>
            )}
          </form>

          {/* Footer hint */}
          <p className="text-xs text-muted-foreground/60 text-center mt-8">
            仅限授权人员访问 · Authorized Personnel Only
          </p>
        </div>
      </div>
      <FloatingContactButtons />
    </div>
  );
}
