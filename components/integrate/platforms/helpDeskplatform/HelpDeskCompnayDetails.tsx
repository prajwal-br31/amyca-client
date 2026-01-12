"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";
import ManageEngine from "../../../../public/companyLogo/helpdesk/Manageengine.svg";
import serviceNow from "../../../../public/companyLogo/helpdesk/serviceNow.svg";
import helpdesk from "../../../../public/companyLogo/helpdesk/helpdesk.png";
import { WorkspaceDetailsDialog } from "./helpDeskDialog";

const techItems = [
  { id: 1, name: "ManageEngine", logo: ManageEngine },
  { id: 2, name: "ServiceNow", logo: serviceNow },
  { id: 3, name: "Help Desk 1", logo: helpdesk },
  { id: 4, name: "Help Desk 2", logo: helpdesk },
  { id: 5, name: "Help Desk 3", logo: helpdesk },
  { id: 6, name: "Help Desk 4", logo: helpdesk },
  { id: 7, name: "Help Desk 5", logo: helpdesk },
  { id: 8, name: "Help Desk 6", logo: helpdesk },
];

export function HelpDeskCompanyDetails({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isCompanySelected, setIsCompanySelected] = useState<number | null>(null);
  const [displayCompany, setDisplayCompany] = useState(true);

  useEffect(() => {
    if (!open) {
      setDisplayCompany(true);
      setIsCompanySelected(null);
    }
  }, [open]);

  const handleCompanyID = (id: number) => {
    const company = techItems.find((item) => item.id === id);
    setIsCompanySelected(company);
    setDisplayCompany(false); // Set to false when a company is selected
  };

  return (
    <div>
      {displayCompany ? (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-5xl p-8">
            <div className="h-[400px] overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {techItems.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white hover:shadow-lg transition-transform transform overflow-hidden"
                  onClick={() => handleCompanyID(item.id)}
                >
                  <div className="bg-blue-600 p-2 w-full">
                    <h3 className="text-white text-center font-medium">{item.name}</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-2 w-24 h-24 mx-auto">
                      <Image
                        src={item.logo || "/placeholder.svg"}
                        alt={`${item.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <WorkspaceDetailsDialog
          open={open}
          onClose={onClose}
          company={techItems.find((item) => item.id === isCompanySelected)}
        />
      )}
    </div>
  );
}
