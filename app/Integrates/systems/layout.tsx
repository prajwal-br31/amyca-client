"use client"
import React, { useState } from "react";
import Link from "next/link";
import { Search, HelpCircle, User } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { TabsContent,TabsTrigger,Tabs,TabsList } from "@radix-ui/react-tabs";
import CustomerSystemPlatform from "@/components/integrate/systems/customerSystem/customerSystem";
import StandardSystemPlatform from "@/components/integrate/systems/standardSystem/StandardSystem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab,setActiveTab]=useState("tab1");
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const handleOpenModal = () => setIsCompanyModalOpen(true);
  const handleCloseModal = () => setIsCompanyModalOpen(false);
  return (
    <div className="flex min-h-screen bg-gradient">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="glass-card p-8">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold mb-6">One-Click Application Integration</h1>
              <Button onClick={handleOpenModal}>
                <Plus className="mr-2 h-4 w-4" />Add new Application
              </Button>
            </div>
            <Tabs defaultValue="tab1" onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                  <TabsList className=" flex w-full">
                    <TabsTrigger value="tab1"
                    className={`flex-1 text-md py-2 text-center ${
                      activeTab === "tab1" ? "bg-blue-600 text-white" : "text-gray-500"
                    }`}>
                      Customer Applications
                    </TabsTrigger>
                    <TabsTrigger value="tab2"
                    className={`flex-1 text-md py-2 text-center ${
                      activeTab === "tab2" ? "bg-blue-600 text-white" : "text-gray-500"
                    }`}>
                      Standard Applications
                    </TabsTrigger>
                  </TabsList>
              </div>
              <TabsContent
                value="tab1"
                className={`transition-opacity duration-300 ease-in-out ${
                  activeTab === "tab1" ? "opacity-100" : "opacity-0"
                }`}
              >
                <CustomerSystemPlatform isCompanyModalOpen={isCompanyModalOpen} handleCloseModal={handleCloseModal}/>
              </TabsContent>
              <TabsContent
                value="tab2"
                className={`transition-opacity duration-300 ease-in-out ${
                  activeTab === "tab2" ? "opacity-100" : "opacity-0"
                }`}
              >
                <StandardSystemPlatform isCompanyModalOpen={isCompanyModalOpen} handleCloseModal={handleCloseModal} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
