"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MinusIcon } from "lucide-react"

export default function ModelSelection() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium">Model selection</h2>
        {/* <Button variant="ghost" size="icon" className="h-6 w-6">
          <MinusIcon className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Select primary chat model, and embedding model from the model library. Configure fallback model to get answer
          if the primary model fails to provide one.
        </div>

        <div className="space-y-4">
          <div className="space-y-2.5">
            <Label>Default foundation model</Label>
            <Select defaultValue="gpt-4-turbo">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo">Openai/gpt-4-turbo</SelectItem>
                <SelectItem value="gpt-4">Openai/gpt-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">Openai/gpt-3.5-turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="apply-all" />
            <Label htmlFor="apply-all">Apply for all prompts</Label>
          </div>

          <div className="space-y-2.5">
            <Label>Fallback LLM model</Label>
            <Select defaultValue="gpt-4-0125-preview">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-0125-preview">Openai/gpt-4-0125-preview</SelectItem>
                <SelectItem value="gpt-4">Openai/gpt-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">Openai/gpt-3.5-turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label>Embedding model</Label>
            <Select defaultValue="text-embedding-3-small">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-embedding-3-small">Openai/text-embedding-3-small</SelectItem>
                <SelectItem value="text-embedding-3-small">Openai/text-embedding-3-small</SelectItem>
                <SelectItem value="text-embedding-3-large">Openai/text-embedding-3-large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label>Multimodal model</Label>
            <Select defaultValue="gpt-4o">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">Openai/gpt-4o</SelectItem>
                <SelectItem value="gpt-4-vision">Openai/gpt-4-vision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
          
        </div>
      </div>
    </div>
  )
}

