import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "./../lib/supabaseClient";
import type { UserProfile } from "./../types/usersTypes";
import type { AuthContextType } from "./../types/authTypes";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

function mapFromSession(sessionUser: any): UserProfile {
  const { id, email } = sessionUser;
  const md = sessionUser.user_metadata ?? {};

  return {
    id,
    email: email ?? "",
    username: md.username ?? "",
    name: md.name ?? "",
    lastname: md.lastname ?? "",
    phone: md.phone ?? "",
    location: md.location ?? "",
    hobby: md.hobby ?? "",
    created_at: undefined,
    is_active: undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateFromTable = async (uid: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, name, lastname, email, phone, location, hobby, created_at, is_active")
      .eq("id", uid)
      .maybeSingle();

    if (error) {
      console.warn("Hydrate profile error:", error.message);
      return;
    }

    if (data) {
      setUser((prev) => ({
        ...(prev ?? { id: uid } as any),
        ...data,
      }));
    }
  };

  useEffect(() => {
    let alive = true;

    async function getSession() {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user;

        if (sessionUser && alive) {
          const base = mapFromSession(sessionUser);
          setUser(base);

          hydrateFromTable(sessionUser.id);
        } else if (alive) {
          setUser(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user;

        if (sessionUser) {
          setUser(mapFromSession(sessionUser));

          hydrateFromTable(sessionUser.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}