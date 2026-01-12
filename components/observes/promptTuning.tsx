"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-2 max-w-6xl">
      <Tabs defaultValue="system" className="w-full space-y-6">
        {/* Tabs List */}
        <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 text-center">
                <TabsTrigger
                    value="system"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all 
                    data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-gray-100 text-gray-900"
                >
                    System Instructions
                </TabsTrigger>
                <TabsTrigger
                    value="question"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all 
                    data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-gray-100 text-gray-900"
                >
                    Question Settings
                </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="system" className="space-y-6">
        <div className="space-y-2">
                <Label htmlFor="model">Model Name</Label>
                <select
                    id="model"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="openai/gpt-4-turbo">
                      openai/gpt-4-turbo
                    </option>
                    <option value="openai/gpt-4">
                      openai/gpt-4
                    </option>
                    <option>
                      openai/gpt-3.5-turbo
                    </option>
                </select>
                </div>


          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea id="question" placeholder="Enter your question here..." className="min-h-[50px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userResponse">User Response</Label>
            <Textarea id="userResponse" placeholder="Enter your response here..." className="min-h-[50px]" />
          </div>
          <div className="flex justify-end space-y-2">
            <Button type="submit" className="w-fit">
              Submit
            </Button>
          </div>
          <hr></hr>
          <div className="space-y-2">
            <Label>Response</Label>
            <div className="min-h-[70px] rounded-md border bg-muted/10 p-4">
              {/* Response content will appear here */}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="question">
          <div className="text-sm text-muted-foreground">Question settings</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
