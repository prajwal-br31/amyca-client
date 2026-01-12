import React from "react";
import Link from "next/link";
import { Search, HelpCircle, User } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import AudioPlayerList from "@/components/observes/LivecallMonitoring/audioPlayersList";

export default function ObserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold mb-6">Negative Sentiments</h1>
            <AudioPlayerList />
          </div>
        </main>
      </div>
    </div>
  );
}
