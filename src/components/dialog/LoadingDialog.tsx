"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type LoadingDialogProps = {
    open: boolean;
    title?: string;
    description?: string;
};

export function LoadingDialog({
    open,
    title = "Loading data…",
    description = "Please wait a moment.",
}: LoadingDialogProps) {
    return (
        <Dialog open={open}>
            <DialogContent className="max-w-[420px] rounded-2xl border-border bg-card p-0 shadow-xl">
                <Card className="border-0 shadow-none rounded-2xl">
                    <div className="p-6 flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                            <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-base font-bold text-card-foreground">{title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>

                            <div className="mt-4 h-2 w-full rounded-full bg-secondary overflow-hidden relative">
                                <div className="absolute inset-0 animate-pulse bg-muted" />
                            </div>
                        </div>
                    </div>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
