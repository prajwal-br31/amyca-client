"use client";

import { MessageCircle, PhoneCall, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { TestCallModal } from "./call-modal";
import { api } from "@/lib/api-instance";
import {ChatModal} from "./chat-modal";


interface systemPropmtProps{
  systemPrompt:string
}

export function ReviewContent({systemPrompt}:systemPropmtProps) {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  
  useEffect(() => {

    async function fetchFiles() {
      try {
        const response = await api.get("/api/documents");
        console.log(response)
        setFiles(response);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }

    fetchFiles();

  }, []);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Test your contact centre</h2>

      {/* Agent Card */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          {/* Image Section */}
          <div className="flex gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src="/female-avatars/seliviya.svg"
                alt="Silvia AI Agent"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            {/* Text Section */}
            <div className="space-y-2 flex-grow">
              <h3 className="text-xl font-semibold">
                Tina: Your Intelligent and Intuitive AI Voice Agent
              </h3>
              <p className="text-gray-600">
                {systemPrompt}     
              </p>
            </div>
          </div>
          {/* Button Section */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setIsTestModalOpen(true)}
            >
              <PhoneCall className="w-4 h-4" />
              Call
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setChatModalOpen(true)}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
          </div>
        </div>
      </div>


      <div className="space-y-4 border border-dashed border-gray-400 rounded-lg p-6">

        <div className="flex items-center gap-2 border-b border-dashed border-gray-400 py-4">
          <div className="font-medium min-w-48">Supporting Language:</div>
          <div>English</div>
        </div>

        <div className="flex items-center gap-2 border-b border-dashed border-gray-400 py-4">
          <div className="font-medium min-w-48">Welcome Message:</div>
          <div className="text-gray-600">
              Hi there, I'm Tina, Welcome to ABC call center, How can I help you today?
          </div>
        </div>

        {/* Knowledge Files */}
        <div className="flex gap-2 border-b border-dashed border-gray-400 py-4">
          <div className="font-medium min-w-48">Knowledge Files:</div>
          <div className="flex flex-wrap gap-2">
            {files.slice(0, 5).map((file: any) => (
              <a
                key={file.id}
                href="#"
                className="text-blue-600 hover:underline"
              >
                {file.originalName}, {' '}
              </a>
            ))}
            {files.length > 5 && (
              <Button variant="link" className="text-blue-600 hover:underline">
                +{files.length - 5} more
              </Button>
            )}
          </div>
        </div>

        {/* Phone Number */}
        {/* <div className="flex items-start gap-2 border-b border-dashed border-gray-100 py-4">
          <div className="font-medium min-w-48">Phone:</div>
          <div>
            <div>+1 555 555 1234</div>
            <div className="text-sm text-gray-500">Bethel OH US</div>
          </div>
        </div> */}
      </div>
      <TestCallModal 
        open={isTestModalOpen}
        onOpenChange={setIsTestModalOpen}
      />
      <ChatModal
        open={chatModalOpen}
        onOpenChange={setChatModalOpen}
      />
    </div>
  );
}
