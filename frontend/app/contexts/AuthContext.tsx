"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:8000";

export interface UserInterface {
  public_id: string;
  student_id: string;
  email: string;
  name: string;
  school: string;
  major: string;
}

export interface VoteStatusInterface {
  has_voted: boolean;
  voted_school_code: string | null;
  own_school_id: number | null;
}

export interface AuthContextInterface {
  user: UserInterface | null;
  voteStatus: VoteStatusInterface | null;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatusInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authFetch = async () => {
    try {
      setLoading(true);

      const userRes = await fetch(`${backendUrl}/profile/me`, {
        credentials: "include",
      });

      if (!userRes.ok) {
        setUser(null);
        setVoteStatus(null);
        return;
      }

      const userData = await userRes.json();
      setUser(userData);

      const voteRes = await fetch(`${backendUrl}/votes/status`, {
        credentials: "include",
      });

      if (voteRes.ok) {
        setVoteStatus(await voteRes.json());
      } else {
        setVoteStatus(null);
      }
    } catch (err) {
      console.error("Auth fetch failed:", err);
      setUser(null);
      setVoteStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setVoteStatus(null);
    }
  };

  useEffect(() => {
    authFetch();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        voteStatus,
        loading,
        refetch: authFetch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used with AuthProvider");
  }
  return context;
}