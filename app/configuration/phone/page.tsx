"use client";

import { ConfigureLayout } from "@/components/ui/configure-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function SelectPhonePage() {
  return (
    <ConfigureLayout
      title="Select Phone Number"
      description="Choose a phone number for your contact centre"
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Phone Numbers</Label>
              <div className="relative">
                <Input 
                  id="search" 
                  placeholder="Search by area code or number..." 
                  className="pl-10"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3">
              {["+1 (555) 123-4567", "+1 (555) 234-5678", "+1 (555) 345-6789"].map((number) => (
                <div
                  key={number}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{number}</span>
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button variant="outline" asChild>
              <Link href="/configuration">Back</Link>
            </Button>
            <Button asChild>
              <Link href="/configuration/review">Continue</Link>
            </Button>
          </div>
        </div>
      </Card>
    </ConfigureLayout>
  );
}
