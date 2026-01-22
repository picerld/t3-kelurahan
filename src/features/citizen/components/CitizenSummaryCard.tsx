import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Users } from "lucide-react";

export const CitizenSummaryCard = () => {
    const stats = [
        { icon: Users, label: "Total Penduduk", value: "200", change: "-10%", color: "bg-emerald-600", isNegative: true },
        { icon: UserCheck, label: "Total Keluarga", value: "50", change: "-4%", color: "bg-kreatop-blue", isNegative: true },
    ];

    return (
        <div className="grid grid-cols-2 gap-5">
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
    )
}