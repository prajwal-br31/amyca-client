"use client"

import type React from "react"
import { Header } from "@/components/ui/header"
import { Sidebar } from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/context/SidebarContext"
export default function ConfigurationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SidebarProvider>
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-8">
              <div className="glass-card p-8">
                <h1 className="text-2xl font-bold mb-6">Configure Contact Centre</h1>
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}

