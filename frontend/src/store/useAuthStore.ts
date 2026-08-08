import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('twinsix_user') || 'null'),
  token: localStorage.getItem('twinsix_token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('twinsix_user', JSON.stringify(user));
    localStorage.setItem('twinsix_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('twinsix_user');
    localStorage.removeItem('twinsix_token');
    set({ user: null, token: null });
  },
}));
