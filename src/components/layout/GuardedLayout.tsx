"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/server/better-auth/client";
import { toast } from "sonner";
import { LayoutShell } from "./LayoutShell";
import { MainSidebar } from "./MainSidebar";
import { MainNavbar } from "./MainNavbar";
import { GuardedContext, type GuardedContextValue, type SessionType, type SessionUser } from "@/components/layout/hooks/useGuarded";


function makeAvatarFallback(user: SessionUser | null) {
  const base = (user?.name ?? user?.email ?? "U").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "U";
}

function makeDisplayName(user: SessionUser | null) {
  if (user?.name && user.name.trim().length > 0) return user.name;
  if (user?.email) return user.email.split("@")[0];
  return "User";
}

type GuardedLayoutProps = {
  withHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  children: React.ReactNode;
}

export default function GuardedLayout({
  withHeader = true,
  headerTitle = "Overview",
  headerSubtitle = "Growth reporting of your account",
  children,
}: GuardedLayoutProps) {
  const router = useRouter();

  const [session, setSession] = React.useState<SessionType>(null);
  const [sessionLoading, setSessionLoading] = React.useState(true);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  React.useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setSessionLoading(true);
        const res = await authClient.getSession();
        const s = (res as any)?.data ?? res;

        if (!alive) return;

        setSession(s as SessionType);

        if (!s?.user) {
          router.replace("/");
        }
      } catch {
        if (!alive) return;
        setSession(null);
        router.replace("/");
      } finally {
        if (alive) setSessionLoading(false);
      }
    };

    void load();
    return () => {
      alive = false;
    };
  }, [router]);

  const user = session?.user ?? null;

  const displayName = React.useMemo(() => makeDisplayName(user), [user]);
  const displayEmail = user?.email ?? "—";
  const avatarFallback = React.useMemo(() => makeAvatarFallback(user), [user]);

  const logout = React.useCallback(async () => {
    try {
      setLogoutLoading(true);
      const res = await authClient.signOut();

      if ((res as any)?.error) {
        toast.error("Logout failed", {
          description: (res as any)?.error?.message ?? "Please try again.",
        });
        return;
      }

      toast.success("Logged out", { description: "See you again 👋" });
      setSession(null);
      window.location.assign("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast.error("Logout failed", { description: message });
    } finally {
      setLogoutLoading(false);
    }
  }, []);

  const value: GuardedContextValue = {
    session,
    user,
    sessionLoading,
    logoutLoading,
    displayName,
    displayEmail,
    avatarFallback,
    logout,
  };

  return (
    <GuardedContext.Provider value={value}>
      <LayoutShell sidebar={<MainSidebar />}
        navbar={<MainNavbar withHeader={withHeader} headerTitle={headerTitle} headerSubtitle={headerSubtitle} />}>
        {children}
      </LayoutShell>
    </GuardedContext.Provider>
  );
}
