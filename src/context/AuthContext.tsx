import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../lib/api2'; // Pastikan path ini sesuai dengan struktur folder Anda';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Pertama dapatkan cookie CSRF
      await api.get('/sanctum/csrf-cookie');
      
      // Lalu lakukan login
      const response = await api.post('/login', { email, password });
      
      // Dapatkan data user
      const userResponse = await api.get('/api/user');
      setUser(userResponse.data);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}