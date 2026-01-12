"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordingCallQuality from "./RecordingCallQuality";
export default function CallAnalytics() {
  const [progress, setProgress] = useState(8); // 0:35 / 7:41 ≈ 8%

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Tabs */}
      <Tabs defaultValue="recording" className="mb-6">
        <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 ">
        <TabsTrigger
                value="recording"
                className="px-4 py-2  text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-gray-100 text-gray-900"
                >
                Recording
                </TabsTrigger>
                {/* <TabsTrigger
                value="call-steps"
                className="px-4 py-2  text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-gray-100 text-gray-900"
                >
                Call Steps
                </TabsTrigger> */}
        </TabsList>


            <TabsContent value="recording">
                <RecordingCallQuality />
            </TabsContent>
        
        {/* <TabsContent value="call-steps">
          <div className="p-4 text-center text-gray-500">Call steps content</div>
        </TabsContent> */}
      </Tabs>

    </div>
  );
}
