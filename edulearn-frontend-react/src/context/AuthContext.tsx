import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getUser, getToken, login as apiLogin, signup as apiSignup, logout as apiLogout, type User } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  token: string;
  loggedIn: boolean;
  role: string;
  login: (email: string, password: string, role: string) => Promise<User>;
  signup: (role: string, fields: Record<string, any>) => Promise<User>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCESS: Record<string, string[] | null> = {
  student: ['learn', 'live', 'challenge', 'mocktest', 'pal', 'lesson', 'videos', 'dashboard'],
  teacher: ['live', 'create-test', 'upload', 'pal', 'videos', 'dashboard'],
  parent: ['live', 'pal', 'videos', 'dashboard'],
  admin: null,
};

export function normalizeRole(user: User | null): string {
  const r = (user?.role || '').toLowerCase();
  if (r === 'host' || r === 'assistant') return 'teacher';
  if (['student', 'teacher', 'parent', 'admin'].includes(r)) return r;
  return 'student';
}

export function roleAllows(role: string, page: string): boolean {
  if (role === 'admin') return true;
  const allowed = ACCESS[role];
  if (!allowed) return true;
  return allowed.includes(page);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getUser);
  const [token, setToken] = useState(getToken);

  const role = normalizeRole(user);
  const loggedIn = !!token && !!user;

  const login = useCallback(async (email: string, password: string, r: string) => {
    const u = await apiLogin(email, password, r);
    setUser(u);
    setToken(getToken());
    return u;
  }, []);

  const signup = useCallback(async (r: string, fields: Record<string, any>) => {
    const u = await apiSignup(r, fields);
    setUser(u);
    setToken(getToken());
    return u;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setToken('');
  }, []);

  const refreshUser = useCallback(() => {
    setUser(getUser());
    setToken(getToken());
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loggedIn, role, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ACCESS };
