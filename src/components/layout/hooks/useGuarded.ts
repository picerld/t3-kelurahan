import React from "react";

export type SessionUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export type SessionType = {
    user?: SessionUser | null;
} | null;

export type GuardedContextValue = {
    session: SessionType;
    user: SessionUser | null;
    sessionLoading: boolean;
    logoutLoading: boolean;
    displayName?: string;
    displayEmail: string;
    avatarFallback: string;
    logout: () => Promise<void>;
};

export const GuardedContext = React.createContext<GuardedContextValue | null>(null);

export function useGuarded() {
    const ctx = React.useContext(GuardedContext);
    if (!ctx) throw new Error("useGuarded must be used inside GuardedLayout");
    return ctx;
}