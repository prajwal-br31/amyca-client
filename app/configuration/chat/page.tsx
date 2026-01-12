// app/configuration/chat/page.tsx
"use client";

import ChatLayout from "./layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      // Here you would typically call an API to get the AI response
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "This is a simulated AI response.", isUser: false }]);
      }, 1000);
    }
  };

  return (
    <ChatLayout
      title="Chat with AI"
      description="Interact with your configured AI agent"
    >
      <Card className="p-4 h-[600px] flex flex-col">
        <div className="flex-grow overflow-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow mr-2"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </ChatLayout>
  );
}
