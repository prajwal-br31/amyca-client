"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

export function CloudDetailsDialog({
  open,
  onClose,
  company,
  workspace
}: {
  open: boolean;
  onClose: () => void;
  company: { id: number; name: string; logo: string } | undefined;
  workspace:{ id: number; name: string; logo: string } | undefined;
}) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-lg text-gray-700">Workspace Name</label>
              <button>
                <HelpCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <Input className="w-full" value={company? company.name :""}/>
          </div>

          <button
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            {/* {isDescriptionOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )} */}
            <span>Workspace Description</span>
          </button>

          <Card className="bg-gray-50">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <label className="text-lg text-gray-700">Endpoint Central URL</label>
                <Input className="w-full bg-white" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-lg text-gray-700">API Key</label>
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                    {/* <ChevronRight className="w-4 h-4" /> */}
                    <span>How to get this?</span>
                  </button>
                </div>
                <Input className="w-full bg-white" type="password" />
              </div>
              <div className="flex justify-end">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                  Authenticate Endpoint
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
