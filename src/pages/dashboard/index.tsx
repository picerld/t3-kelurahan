"use client";

import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Video,
  Share2,
  Mail,
  CreditCard,
  FileText,
  UserPlus,
  Crown,
  Smartphone,
  User,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import React from "react";

export default function DashboardPage() {
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

  return (
    <GuardedLayout>
      <HeadMetaData title="Dashboard" pathName="/dashboard" />
      <div className="flex gap-1">
        <div className="flex-1 flex flex-col gap-[50px] pr-[30px]">
          {/* Statistics */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-foreground">Latest Statistics</h2>
              <Button variant="outline" className="w-[170px] justify-between border-border hover:bg-accent rounded-xl">
                <span className="font-semibold text-sm">Last 14 Days</span>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card border-border rounded-2xl">
                  <CardContent className="px-5 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-[50px] w-[50px] rounded-full items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-bold text-lg text-card-foreground">{stat.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[28px] text-card-foreground">{stat.value}</p>
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
              <h2 className="font-bold text-lg text-foreground">Feature Contents</h2>
              <Button variant="outline" className="w-[170px] justify-between border-border hover:bg-accent rounded-xl">
                <span className="font-semibold text-sm">Last 14 Days</span>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-5">
              {featuredContent.map((content, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-[304px] min-w-0">
                      <div className="flex w-[90px] h-[70px] shrink-0 rounded-[14px] bg-secondary"></div>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-foreground">{content.title}</p>
                        <p className="text-sm text-muted-foreground">{content.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-foreground">{content.views}</p>
                      <Badge className={`${content.isNegative ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]" : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"} font-bold`}>
                        {content.change}
                      </Badge>
                    </div>
                    <Button variant="outline" size="icon" className="h-[50px] w-[50px] rounded-full border-border hover:bg-accent">
                      <ArrowRight className="h-6 w-6" />
                    </Button>
                  </div>
                  {index < featuredContent.length - 1 && <hr className="border-border" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-[440px] shrink-0 flex flex-col gap-[30px] bg-card p-[30px] rounded-l-[36px]">
          <Card className="bg-primary border-0 rounded-[36px] text-primary-foreground">
            <CardContent className="p-[30px] flex flex-col gap-5">
              <div className="text-2xl font-bold">K</div>
              <div>
                <p className="text-[#CCE4FF]">Balance</p>
                <p className="font-bold text-[46px]">$22,591,200</p>
              </div>
              <p className="text-[#CCE4FF]">Rafi• 08/22</p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg text-card-foreground">Top Big Clients</h2>
            <div className="flex flex-col gap-4">
              {topClients.map((client, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-[46px] w-[46px] rounded-full bg-secondary"></div>
                      <div>
                        <p className="font-bold text-card-foreground">{client.revenue}</p>
                        <p className="text-sm text-muted-foreground">{client.name}</p>
                      </div>
                    </div>
                    <Badge className={`${client.isNegative ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]" : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"} font-bold`}>
                      {client.change}
                    </Badge>
                  </div>
                  {index < topClients.length - 1 && <hr className="border-border" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg text-card-foreground">Revenue Drivers</h2>
            <div className="flex flex-col gap-4">
              {revenueDrivers.map((driver, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-[46px] w-[46px] rounded-full bg-primary items-center justify-center">
                      <driver.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-card-foreground">{driver.title}</p>
                      <p className="text-sm text-muted-foreground">{driver.subtitle}</p>
                    </div>
                  </div>
                  {index < revenueDrivers.length - 1 && <hr className="border-border" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </GuardedLayout>
  );
}
