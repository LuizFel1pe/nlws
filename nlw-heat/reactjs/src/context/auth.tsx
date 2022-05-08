import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../service/api';

type AuthProvider = {
  children: ReactNode;
};

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

type AuthResponse = {
  token: string;
  user: User;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=e4d229eed73ea415cfd2`;

  async function signIn(code: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code,
    });

    const { token, user } = response.data;

    localStorage.setItem('@doWhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@doWhile:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@doWhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, code] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(code);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signOut, signInUrl }}>
      {props.children}
    </AuthContext.Provider>
  );
}
