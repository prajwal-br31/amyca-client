"use client";

import React, { useState } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HelpDeskPlatform from "@/components/integrate/platforms/helpDeskplatform/helpDeskPlatform";
import ContactCenterPlatform from "@/components/integrate/platforms/contactCenterPlatform/contactCenterPlatform";
import CloudPlatform from "@/components/integrate/platforms/cloudPlatform/CoudPlatform";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("tab1");
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
              <h1 className="text-2xl font-bold mb-6">Platforms Integration</h1>
              <Button 
                className="connect-button"
                onClick={handleOpenModal}
              >
                <Plus className="mr-2 h-4 w-4" /> Add new platform
              </Button>
            </div>
            <Tabs defaultValue="tab1" onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="flex w-full">
                <TabsTrigger
                    value="tab1"
                    className="flex-1 text-md py-2 text-center data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-500"
                  >
                    Help Desk Platforms
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab2"
                    className="flex-1 text-md py-2 text-center data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-500"
                  >
                    Contact Center Platforms
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab3"
                    className="flex-1 text-md py-2 text-center data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-500"
                  >
                    Cloud Platforms
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="tab1">
                <HelpDeskPlatform isCompanyModalOpen={isCompanyModalOpen} onCloseModal={handleCloseModal} />
              </TabsContent>
              <TabsContent value="tab2">
                <ContactCenterPlatform isCompanyModalOpen={isCompanyModalOpen} onCloseModal={handleCloseModal}/>
              </TabsContent>
              <TabsContent value="tab3">
                <CloudPlatform isCompanyModalOpen={isCompanyModalOpen} onCloseModal={handleCloseModal}/>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
