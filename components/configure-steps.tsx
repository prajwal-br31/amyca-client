"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Phone, Bot, BookOpen, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AvatarSelector } from "./avatar-selector";
import { AvatarDetails } from "./avatar-details";
import { KnowledgeStep } from "./knowledge-step";
import { ReviewContent } from "./review-content";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api-instance";

type Step = "configure" | "phone" | "knowledge" | "review";

const steps = [
  { id: "configure" as const, icon: Bot, label: "Configure Agent", path: "/configuration" },
  // { id: "phone" as const, icon: Phone, label: "Select Phone Number", path: "/configuration/phone" },
  { id: "knowledge" as const, icon: BookOpen, label: "Add Knowledge", path: "/configuration/add-knowledge" },
  { id: "review" as const, icon: Eye, label: "Review", path: "/configuration/review" },
];

const getStepFromPath = (path: string) => {
  const step = steps.find(step => step.path === path);
  return step ? step.id : "configure";
};

export function ConfigureWizard() {

  const [applyAvatar, setApplyAvatar] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState<Step>(getStepFromPath(pathname));
  const [welcomeMessageEnabled, setWelcomeMessageEnabled] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("Hi there, I'm Tina, Welcome to ABC Help desk, How can I help you today?");
  const [systemPrompt, setSystemPrompt] = useState("Tina is a sophisticated AI voice assistant designed to simplify your life with seamless interactions and intelligent solutions. With her natural conversational tone, multilingual capabilities");
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>();
  const [showAvatarDetails, setShowAvatarDetails] = useState(false);

  useEffect(() => {
    setCurrentStep(getStepFromPath(pathname));
  }, [pathname]);

  const getConfiguration = async () => {
    try {
      type ConfigResponse = {
        welcomeMessageEnabled?: boolean;
        selectedAvatarId?: string;
        systemPrompt?: string;
        welcomeMessage?: string;
      };
      
      const response = await api.get<ConfigResponse>("/api/configs");
      
      if (response) {
        setWelcomeMessageEnabled(response.welcomeMessageEnabled ?? true);
        setSelectedAvatarId(response.selectedAvatarId);
        setSystemPrompt(response.systemPrompt || "");
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  };

  useEffect(() => {
    getConfiguration();
  }, []);

  const saveConfiguration = async () => {
    try {
      await api.put("/api/configs", {
        welcomeMessageEnabled,
        welcomeMessage,
        selectedAvatarId,
        systemPrompt
      });
      router.push("/configuration/add-knowledge");
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  };

  const handleStepClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="max-w- mx-auto">
      
      <div className="flex justify-between mb-12">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isPast = steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id);
          
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center flex-1 ${
                index < steps.length - 1
                  ? "relative after:content-[''] after:absolute after:top-5 after:left-1/2 after:w-full after:h-[2px] after:bg-gray-200"
                  : ""
              }`}
            >
              <button
                onClick={() => handleStepClick(step.path)}
                className="group focus:outline-none relative z-20 w-full flex flex-col items-center"
              >
                <div
                  className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                    isActive 
                      ? "bg-[#4285F4] text-white"
                      : isPast
                      ? "bg-[#4285F4] text-white"
                      : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2 text-sm ${
                    isActive ? "text-[#4285F4] font-medium" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Content */}
      {currentStep === "configure" && !showAvatarDetails && (
          <div className="space-y-8">
            <div>
              <h3 className="text-base font-medium mb-4">Agent Avatar</h3>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                {
                  !applyAvatar ? (
                    <Button 
                      variant="link" 
                      className="text-[#4285F4]"
                      onClick={() => setIsAvatarSelectorOpen(true)}
                    >
                      Select Avatar
                    </Button>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image
                            src="/female-avatars/seliviya.svg"
                            alt="Silvia AI Agent"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-4 space-x-4 flex-grow">
                          <h3 className="text-xl font-semibold">
                            Tina: Your Intelligent and Intuitive AI Voice Agent
                          </h3>
                          <p className="text-gray-600">
                           {systemPrompt}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                      <Button 
                            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                            onClick={() => setIsAvatarSelectorOpen(true)}
                          >
                            Edit
                      </Button>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Agent Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Language in which your agent speaks</p>
              </div>

              <div className="space-y-2">
                <Label>Voice</Label>
                <Select defaultValue="natural">
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Conversation</SelectItem>
                    <SelectItem value="synthetic">Explainer</SelectItem>
                    <SelectItem value="synthetic">Narrative</SelectItem>
                    <SelectItem value="synthetic">Synthetic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Your agent voice type</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your website URL</Label>
              <Input type="url" placeholder="https://" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Welcome Voice</Label>
                <Switch 
                  className="bg-[#4285F4]"
                  checked={welcomeMessageEnabled}
                  onCheckedChange={setWelcomeMessageEnabled}
                />
              </div>
              <Input
                type="text"
                placeholder="Enter welcome message"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                defaultValue="Hi there, I'm Tina, Welcome to ABC call center, How can I help you today?"
                disabled={!welcomeMessageEnabled}
              />
              <p className="text-sm text-gray-500">This is the first voice for your users</p>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/configuration/add-knowledge">
                <Button 
                  className="bg-[#4285F4]"
                  onClick={() => saveConfiguration()}
                >
                  Next
                </Button>
              </Link>
            </div>
          </div>
        )}

      {currentStep === "configure" && showAvatarDetails && (
        <AvatarDetails
          avatar={{
            id: "6",
            name: "Silvia",
            image: "/female-avatars/seliviya.svg",
            description: "Tina: Your Intelligent and Intuitive AI Voice Agent",
            systemPrompt: systemPrompt,
            updatedPrompt: systemPrompt
          }}
          onBack={() => setShowAvatarDetails(false)}
          onCancel={() => setShowAvatarDetails(false)}
          onApply={(data) => {
            console.log(data);
            setShowAvatarDetails(false);
            setApplyAvatar(true);
            setSystemPrompt(data.systemPrompt);
          }}
        />
      )}

      {currentStep === "knowledge" && (
        <KnowledgeStep />
      )}

      {currentStep === "review" && (
        <ReviewContent systemPrompt={systemPrompt}/>
      )}

      <AvatarSelector
        open={isAvatarSelectorOpen}
        onOpenChange={setIsAvatarSelectorOpen}
        selectedAvatarId={selectedAvatarId}
        onSelect={(avatar) => {
          setSelectedAvatarId(avatar.id);
          setIsAvatarSelectorOpen(false);
          setShowAvatarDetails(true);
        }}
      />
    </div>
  );
}
