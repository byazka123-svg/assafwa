import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, signupUser, getMe } from './api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    if (storedJwt) {
      setJwt(storedJwt);
      getMe(storedJwt)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // Token might be invalid
          localStorage.removeItem('jwt');
          setJwt(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (userData: any) => {
    const data = await signupUser(userData);
    if (data.jwt) {
      localStorage.setItem('jwt', data.jwt);
      setJwt(data.jwt);
      setUser(data.user);
    }
    return data;
  };

  const login = async (credentials: any) => {
    const data = await loginUser(credentials);
    if (data.jwt) {
      localStorage.setItem('jwt', data.jwt);
      setJwt(data.jwt);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setJwt(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, jwt, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
