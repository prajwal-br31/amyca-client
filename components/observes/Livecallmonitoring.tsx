"use client";

import { useState } from "react";
import { Download, RotateCcw, FastForward, Pause ,Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import jira from "../../public/companyLogo/standardSystem/jira.svg"
import manageEngine from "../../public/companyLogo/helpdesk/Manageengine.svg"
import Azure from "../../public/companyLogo/cloudPlatform/azure.svg"
import genesis from "../../public/companyLogo/contactPlatform/genesis.svg"

const participants = [
  { name: "Manage Engine", role: "customer",logo:manageEngine },
  { name: "Genesis", role: "customer",logo:genesis },
  { name: "Azure Fabric", role: "customer",logo:Azure },
  { name: "Jira", role: "customer",logo:jira }
];


export default function CallAnalytics() {
  const [progress, setProgress] = useState(8); 
  const [activePlayback, setActivePlayback] = useState<number | null>(null); 

  const handlePlayPause = (index: number) => {
      setActivePlayback((prev)=>prev===index?null:index); // Pause if already playing
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Tabs */}
      <Tabs defaultValue="recording" className="mb-6">
        <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 text-center">
        <TabsTrigger
                value="recording"
                className="px-4 py-2  text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-gray-100 text-gray-900"
                >
                Recording
                </TabsTrigger>
        </TabsList>
        <TabsContent value="recording">
          {/* Sentiment Analysis */}
          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              <h3 className="text-lg font-semibold mt-2">Sentiment</h3>
              {/* <div className="ml-auto flex items-center gap-4">
                <Download className="w-5 h-5 text-gray-600" />
              </div> */}
            </div>

            {/* Call Participants */}
            <div className="space-y-8">
                  {participants.map((participant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  {/* Participant Info */}
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded border p-2 flex items-center justify-center bg-white">
                        <Image src={participant.logo} fill alt={"Customer logo"} className="rounded object-contain" />
                      </div>
                      <h4 className="font-medium text-xl">{participant.name}</h4>
                    </div>
                    <div>
                      <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                        {participant.role}
                      </span>
                    </div>
                  </div>

                  {/* Sentiment Visualization */}
                  <div className="h-8 flex items-center gap-4">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1"
                        style={{
                          height: `${Math.random() * 100}%`,
                          backgroundColor: ["#22C55E", "#EAB308", "#EF4444"][
                            Math.floor(Math.random() * 3)
                          ],
                          opacity: Math.random() * 0.5 + 0.5,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Playback Controls */}
                  <div className="bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="max-w-screen-xl mx-auto">
                      <Progress value={progress} className="mb-2" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">0:35 / 07:41</div>
                        <div className="flex items-center gap-4">
                          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handlePlayPause(index)}>
                            {activePlayback?<Pause className="w-6 h-6"/>:<Play className="w-6 h-6" />}
                          </button>
                          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <FastForward className="w-4 h-4" />
                          </button>
                          <select className="bg-transparent border border-gray-200 rounded px-2 py-1">
                            <option>1.0</option>
                            <option>1.25</option>
                            <option>1.5</option>
                          </select>
                        </div>
                        <div className="text-sm text-gray-600">Paused 0:12</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        {/* <TabsContent value="call-steps">
          <div className="p-4 text-center text-gray-500">Call steps content</div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
