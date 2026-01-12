"use client";

import { ConfigureLayout } from "@/components/ui/configure-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Bot, Phone } from "lucide-react";

export default function ReviewPage() {
  return (
    <ConfigureLayout
      title="Review Configuration"
      description="Review your contact centre configuration before finalizing"
    >
      <Card className="p-6">
        <div className="space-y-8">
          <div className="space-y-6">
            {/* Agent Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Bot className="h-5 w-5" />
                <h2>Agent Configuration</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Agent Name</div>
                  <div className="font-medium">Support Agent</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Personality</div>
                  <div className="font-medium">Friendly and professional customer support agent</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Knowledge Base</div>
                  <div className="font-medium">Product documentation and FAQs</div>
                </div>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="/configuration">Edit</Link>
                </Button>
              </div>
            </div>

            {/* Phone Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Phone className="h-5 w-5" />
                <h2>Phone Configuration</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Selected Number</div>
                  <div className="font-medium">+1 (555) 123-4567</div>
                </div>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="/configuration/select-phone">Edit</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button variant="outline" asChild>
              <Link href="/configuration/select-phone">Back</Link>
            </Button>
            <Button>Finish Setup</Button>
          </div>
        </div>
      </Card>
    </ConfigureLayout>
  );
}
