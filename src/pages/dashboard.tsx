"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  Grid3x3,
  MessageSquare,
  Users,
  Calendar,
  BarChart3,
  Star,
  Settings,
  LogOut,
  Code,
  ArrowRight,
  ChevronDown,
  Video,
  Share2,
  Mail,
  CreditCard,
  FileText,
  UserPlus,
  Crown,
  Smartphone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/server/better-auth/client";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type SessionType = {
  user?: SessionUser | null;
} | null;

const KreatopDashboard = () => {
  const router = useRouter();

  const [session, setSession] = useState<SessionType>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const stats = [
    { icon: Video, label: "Reach", value: "299,039", change: "-10%", color: "bg-purple-600", isNegative: true },
    { icon: Share2, label: "Share", value: "89,773", change: "-4%", color: "bg-blue-600", isNegative: true },
    { icon: Mail, label: "Inbox", value: "18,221", change: "+11%", color: "bg-amber-600", isNegative: false },
    { icon: CreditCard, label: "Revenue", value: "$69,000", change: "+25%", color: "bg-emerald-600", isNegative: false },
    { icon: FileText, label: "Invoice", value: "48,882", change: "-8%", color: "bg-pink-600", isNegative: true },
    { icon: UserPlus, label: "New Clients", value: "22,089", change: "+5%", color: "bg-cyan-600", isNegative: false },
  ];

  const featuredContent = [
    { title: "Gaji Designer Meningkat", date: "18 August 2020", views: "183M Views", change: "+25%", isNegative: false },
    { title: "Cara Belajar Produktif", date: "5 May 2020", views: "515,122 Views", change: "-10%", isNegative: true },
    { title: "Tips Jago Interview", date: "1 January 2019", views: "94,388 Views", change: "+11%", isNegative: false },
  ];

  const topClients = [
    { name: "BuildWithAngga, Inc", revenue: "$853,991", change: "+25%", isNegative: false },
    { name: "Gelombang LLC", revenue: "$245,000", change: "-10%", isNegative: true },
    { name: "Mekaaary, Inc", revenue: "$77,392", change: "+85%", isNegative: false },
  ];

  const revenueDrivers = [
    { icon: Crown, title: "Brand Awareness", subtitle: "14,409,220 Million Views" },
    { icon: Smartphone, title: "Software Promotion", subtitle: "39,499 Installed" },
    { icon: User, title: "Users Growth", subtitle: "558,311 Users Signed Up" },
  ];

  // Fetch session on mount
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setSessionLoading(true);

        // Better Auth common shape:
        // const { data } = await authClient.getSession()
        const res = await authClient.getSession();

        const s = res?.data ?? res;
        if (!alive) return;

        setSession(s as SessionType);

        // Optional: if not authenticated, kick back to login
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

  const displayName = useMemo(() => {
    if (user?.name && user.name.trim().length > 0) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  }, [user?.name, user?.email]);

  const displayEmail = user?.email ?? "—";

  const avatarFallback = useMemo(() => {
    const base = (user?.name ?? user?.email ?? "U").trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
    return initials || "U";
  }, [user?.name, user?.email]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const res = await authClient.signOut();

      if (res?.error) {
        toast.error("Logout failed", { description: res.error.message ?? "Please try again." });
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
  };

  // Optional: render a small loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#07041B] text-white flex items-center justify-center">
        <p className="text-[#89869A]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07041B] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-screen w-[280px] border-r border-[#23203A] px-[30px] pt-[50px] pb-[30px] flex flex-col gap-[50px]">
          <div className="flex justify-center">
            <div className="text-2xl font-bold text-blue-500">KREATOP</div>
          </div>

          <nav className="flex-1 flex flex-col justify-between overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 bg-[#312ECB] hover:bg-[#312ECB]/90 h-auto py-[10px] px-4 rounded-xl"
                >
                  <Grid3x3 className="h-6 w-6" />
                  <span className="font-semibold">Overview</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span className="font-semibold">Messages</span>
                  <Badge className="ml-auto bg-[#007AFF] hover:bg-[#007AFF] text-white text-[10px] h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    19
                  </Badge>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl">
                  <Users className="h-6 w-6" />
                  <span className="font-semibold">Clients</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl">
                  <Calendar className="h-6 w-6" />
                  <span className="font-semibold">Content Planner</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                  <span className="font-semibold">Bot Analytics</span>
                  <Badge className="ml-auto bg-[#007AFF] hover:bg-[#007AFF] text-white text-[10px] px-2 rounded-lg">NEW</Badge>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl">
                  <Star className="h-6 w-6" />
                  <span className="font-semibold">Testimonials</span>
                </Button>
              </div>

              <hr className="border-[#23203A]" />

              <div className="flex flex-col gap-4">
                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl">
                  <Settings className="h-6 w-6" />
                  <span className="font-semibold">Settings</span>
                </Button>

                {/* ✅ Logout wired to Better Auth */}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-[#312ECB]/20 h-auto py-[10px] px-4 rounded-xl"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  <LogOut className="h-6 w-6" />
                  <span className="font-semibold">{logoutLoading ? "Logging out..." : "Logout"}</span>
                </Button>
              </div>
            </div>

            <Card className="bg-[#110E24] border-[#23203A] rounded-[20px]">
              <CardContent className="p-5 flex flex-col gap-5">
                <div className="flex h-[60px] w-[60px] rounded-full bg-[#312ECB] items-center justify-center">
                  <Code className="h-7 w-7" />
                </div>
                <p className="font-bold text-lg">Kreto AI Ready to Help You Grow.</p>
                <Button className="w-full bg-[#312ECB] hover:bg-[#312ECB]/90 rounded-full">
                  <span className="font-bold text-sm">Upgrade Now</span>
                </Button>
              </CardContent>
            </Card>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="ml-[280px] flex-1">
          {/* Top Bar */}
          <header className="flex items-center justify-between p-[30px] pb-0">
            <div className="flex flex-col gap-0.5">
              <h1 className="font-bold text-[32px]">Overview</h1>
              <p className="text-lg text-[#89869A]">Growth reporting of your account</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-[14px]">
                <Button variant="outline" size="icon" className="h-[50px] w-[50px] rounded-full border-[#23203A] hover:bg-[#312ECB]/20">
                  <Search className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-[50px] w-[50px] rounded-full border-[#23203A] hover:bg-[#312ECB]/20">
                  <Bell className="h-6 w-6" />
                </Button>
              </div>

              <div className="h-[60px] border-l border-[#23203A]"></div>

              {/* ✅ Show current session name + email */}
              <div className="flex items-center gap-[14px]">
                <div className="flex flex-col text-right">
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-sm text-[#89869A]">{displayEmail}</p>
                </div>
                <Avatar className="h-[60px] w-[60px] border border-[#23203A] p-[6px]">
                  {/* if you store user image in session */}
                  <AvatarImage src={user?.image ?? "/api/placeholder/60/60"} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex p-[30px]">
            <div className="flex-1 flex flex-col gap-[50px] pr-[30px]">
              {/* Statistics */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Latest Statistics</h2>
                  <Button variant="outline" className="w-[170px] justify-between border-[#23203A] hover:bg-[#312ECB]/20 rounded-xl">
                    <span className="font-semibold text-sm">Last 14 Days</span>
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {stats.map((stat, index) => (
                    <Card key={index} className="bg-[#110E24] border-[#23203A] rounded-2xl">
                      <CardContent className="p-5 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-[50px] w-[50px] rounded-full items-center justify-center ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                          </div>
                          <span className="font-bold text-lg">{stat.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[28px]">{stat.value}</p>
                          <Badge className={`${stat.isNegative ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]" : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"} font-bold`}>
                            {stat.change}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Featured Content */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Feature Contents</h2>
                  <Button variant="outline" className="w-[170px] justify-between border-[#23203A] hover:bg-[#312ECB]/20 rounded-xl">
                    <span className="font-semibold text-sm">Last 14 Days</span>
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col gap-5">
                  {featuredContent.map((content, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-[304px] min-w-0">
                          <div className="flex w-[90px] h-[70px] shrink-0 rounded-[14px] bg-[#23203A]"></div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">{content.title}</p>
                            <p className="text-sm text-[#89869A]">{content.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">{content.views}</p>
                          <Badge className={`${content.isNegative ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]" : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"} font-bold`}>
                            {content.change}
                          </Badge>
                        </div>
                        <Button variant="outline" size="icon" className="h-[50px] w-[50px] rounded-full border-[#23203A] hover:bg-[#312ECB]/20">
                          <ArrowRight className="h-6 w-6" />
                        </Button>
                      </div>
                      {index < featuredContent.length - 1 && <hr className="border-[#23203A]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-[440px] shrink-0 flex flex-col gap-[30px] bg-[#110E24] p-[30px] rounded-l-[36px]">
              <Card className="bg-primary border-0 rounded-[36px] text-white">
                <CardContent className="p-[30px] flex flex-col gap-5">
                  <div className="text-2xl font-bold">K</div>
                  <div>
                    <p className="text-[#CCE4FF]">Balance</p>
                    <p className="font-bold text-[46px]">$22,591,200</p>
                  </div>
                  <p className="text-[#CCE4FF]">{displayName} • 08/22</p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg">Top Big Clients</h2>
                <div className="flex flex-col gap-4">
                  {topClients.map((client, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-[46px] w-[46px] rounded-full bg-[#23203A]"></div>
                          <div>
                            <p className="font-bold">{client.revenue}</p>
                            <p className="text-sm text-[#89869A]">{client.name}</p>
                          </div>
                        </div>
                        <Badge className={`${client.isNegative ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]" : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"} font-bold`}>
                          {client.change}
                        </Badge>
                      </div>
                      {index < topClients.length - 1 && <hr className="border-[#23203A]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg">Revenue Drivers</h2>
                <div className="flex flex-col gap-4">
                  {revenueDrivers.map((driver, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-[46px] w-[46px] rounded-full bg-[#312ECB] items-center justify-center">
                          <driver.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold">{driver.title}</p>
                          <p className="text-sm text-[#89869A]">{driver.subtitle}</p>
                        </div>
                      </div>
                      {index < revenueDrivers.length - 1 && <hr className="border-[#23203A]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default KreatopDashboard;
