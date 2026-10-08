import { useEffect } from 'react';
import { supabase } from '@/shared/api/supabase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  return useAuthStore();
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSession, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setLoading]);

  return <>{children}</>;
};
