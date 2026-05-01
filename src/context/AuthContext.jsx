import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vitalflow_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('vitalflow_user');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mock login — accepts any non-empty email + password (min 6 chars).
   * Returns { success, error } so callers can handle failures.
   */
  const login = (email, password) => {
    if (!email || !password) return { success: false, error: 'Please fill in all fields' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    // In mock mode: look for existing signup data first
    const existing = localStorage.getItem('vitalflow_signup_' + email.toLowerCase());
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.password !== password) return { success: false, error: 'Invalid email or password' };
      const { password: _p, ...userWithoutPw } = parsed;
      setUser(userWithoutPw);
      localStorage.setItem('vitalflow_user', JSON.stringify(userWithoutPw));
      return { success: true };
    }

    // Demo fallback: allow any login so you can demo without signing up
    const mockUser = {
      id: '1',
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      avatar: null,
      joinDate: new Date().toISOString().split('T')[0],
      height: 175,
      weight: 72,
      age: 25,
    };
    setUser(mockUser);
    localStorage.setItem('vitalflow_user', JSON.stringify(mockUser));
    return { success: true };
  };

  /**
   * Mock signup — stores user locally.
   */
  const signup = (name, email, password) => {
    if (!name || !email || !password) return { success: false, error: 'Please fill in all fields' };
    if (name.trim().length < 2) return { success: false, error: 'Name must be at least 2 characters' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase(),
      password, // stored locally only for mock auth
      avatar: null,
      joinDate: new Date().toISOString().split('T')[0],
      height: 170,
      weight: 70,
      age: 25,
    };

    // Save for login lookup
    localStorage.setItem('vitalflow_signup_' + email.toLowerCase(), JSON.stringify(newUser));

    const { password: _p, ...userWithoutPw } = newUser;
    setUser(userWithoutPw);
    localStorage.setItem('vitalflow_user', JSON.stringify(userWithoutPw));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vitalflow_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('vitalflow_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
