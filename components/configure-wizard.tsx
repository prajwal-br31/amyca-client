"use client"

import { useState } from "react"
import { Phone, Bot, BookOpen, Eye } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ConfigureWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  { icon: Bot, label: "Configure Agent", active: true },
  { icon: Phone, label: "Select Phone Number", active: false },
  { icon: BookOpen, label: "Add Knowledge", active: false },
  { icon: Eye, label: "Review", active: false },
]

export function ConfigureWizard({ open, onOpenChange }: ConfigureWizardProps) {
  const [welcomeMessageEnabled, setWelcomeMessageEnabled] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Configure Contact Centre</h2>
          
          {/* Steps */}
          <div className="flex justify-between mb-12">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={`flex flex-col items-center flex-1 ${
                  index < steps.length - 1
                    ? "relative after:content-[''] after:absolute after:top-5 after:left-1/2 after:w-full after:h-[2px] after:bg-gray-200"
                    : ""
                }`}
              >
                <div
                  className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full ${
                    step.active ? "bg-[#4285F4] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`mt-2 text-sm ${step.active ? "text-[#4285F4]" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-8">
            <div>
              <h3 className="text-base font-medium mb-4">Agent Avatar</h3>
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Button variant="link" className="text-[#4285F4]">
                  Select Avatar
                </Button>
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
                    <SelectItem value="natural">Natural Conversion</SelectItem>
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
                  checked={welcomeMessageEnabled}
                  onCheckedChange={setWelcomeMessageEnabled}
                />
              </div>
              <Input
                type="text"
                placeholder="Enter welcome message"
                defaultValue="Good morning, I am your AI agent to help you with your question"
                disabled={!welcomeMessageEnabled}
              />
              <p className="text-sm text-gray-500">This is the first voice for your users</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-[#4285F4]">
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

