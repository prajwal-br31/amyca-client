"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialogTest"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api-instance"
import { Send, MessageCircle, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false)

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      const response = await api.post("/api/messages/chat", { message: inputMessage, history: messages });

      setMessages(prev => [...prev, { text: response?.choices[0].message.content, isUser: false }]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal className="z-[1000]">
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[400px] h-auto min-h-[73vh] max-h-[90vh] flex flex-col justify-between overflow-y-auto p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-md">
              <MessageCircle className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">ABC Help Desk</p>
              <p className="text-sm text-blue-100">Always here to help you</p>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4 bg-gray-50">
          {!isFirstMessageSent && (
            <div className="flex items-start space-x-3 mb-4 animate-fade-in">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/female-avatars/seliviya.svg" alt="AI Agent Avatar" fill className="object-cover" />
              </div>
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-sm text-gray-800 opacity-50">Hi there, I'm Tina. How can I help you today?</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.isUser ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              {!message.isUser && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image src="/female-avatars/seliviya.svg" alt="AI Agent Avatar" fill className="object-cover" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                  message.isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                {message.text}
              </div>
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex justify-center items-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Chat with your Intuitive AI..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow"
            />
            <Button onClick={sendMessage} size="icon" className="bg-blue-500 hover:bg-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

