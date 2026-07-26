import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

const TOKEN_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, if we have a stored access token, try to restore the
  // session by fetching the current user. If the token is invalid/expired,
  // clear it silently — the user just lands on a logged-out screen.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getMe()
      .then((restoredUser) => setUser(restoredUser))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { user: newUser, accessToken } = await authService.register({
      name,
      email,
      password,
    });
    localStorage.setItem(TOKEN_KEY, accessToken);
    setUser(newUser);
    return newUser;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { user: loggedInUser, accessToken } = await authService.login({
      email,
      password,
    });
    localStorage.setItem(TOKEN_KEY, accessToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_err) {
      // Even if the server call fails, clear local state so the user
      // isn't stuck in a "logged in" UI with a dead token.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      toast.success('Logged out');
    }
  }, []);

  // Re-fetches the current user from the server — used after editing
  // profile fields (name, avatar) so the UI reflects the saved state.
  const refetchUser = useCallback(async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      return freshUser;
    } catch (_err) {
      // If this fails the existing user state just stays as-is.
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
