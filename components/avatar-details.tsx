"use client"

import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from 'next/link'
import { useState } from 'react'

interface AvatarDetailsProps {
  avatar: {
    id: string
    name: string
    image: string
    description: string
    systemPrompt: string
    updatedPrompt:string
  }
  onBack: () => void
  onCancel: () => void
  onApply: (data: {
    customName: string
    detectEmotions: boolean
    allKnowledgeBase: boolean
    systemPrompt: string
    updatedPrompt:string
  }) => void
}

export function AvatarDetails({ avatar, onBack, onCancel, onApply}: AvatarDetailsProps) {
  const [appliedSystemPrompt,setAppliedSystemPrompt]= useState(avatar.systemPrompt);
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl">Tina: Your Intelligent and Intuitive AI Voice Agent</h2>    
      </div>

      <div className="flex gap-8 mb-8">
        <div className="w-[280px] h-[280px] border-2 border-[#4285F4] rounded-lg overflow-hidden">
          <Image
            src={avatar.image}
            alt={avatar.name}
            width={280}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
        <textarea
          // defaultValue={avatar.systemPrompt}
          onChange={(e) => 
              setAppliedSystemPrompt(e.target.value)
              }
          className="text-gray-600 mb-8 w-full border border-gray-300 rounded-lg p-4 h-28 leading-5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {avatar.systemPrompt}
        </textarea>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-base font-medium">Custom Name</label>
              <Input placeholder="Enter custom name" />
              <p className="text-sm text-gray-500">You can provide your own custom name for agent</p>
            </div>  

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="emotions" />
                <label htmlFor="emotions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Detect Emotions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="knowledge" />
                <label htmlFor="knowledge" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  All Knowledge Base
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/configuration">
        <Button
            className="bg-[#4285F4]"
            onClick={() => {
              onApply({
                customName: "",
                detectEmotions: false,
                allKnowledgeBase: false,
                systemPrompt: appliedSystemPrompt,
                updatedPrompt:appliedSystemPrompt
              }); 
            }}
          >
            Apply
        </Button>
        </Link>
      </div>
    </div>
  )
}

