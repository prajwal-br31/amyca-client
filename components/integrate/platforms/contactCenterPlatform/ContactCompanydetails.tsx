"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import avaya from "../../../../public/companyLogo/contactPlatform/avaya.svg"
import genesis from "../../../../public/companyLogo/contactPlatform/genesis.svg"
import connect from "../../../../public/companyLogo/contactPlatform/Connect.svg"
import five9 from "../../../../public/companyLogo/contactPlatform/Five9.png"
import talkdesk from "../../../../public/companyLogo/contactPlatform/talkdesk.png"
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";
import ContactCenterPlatform from "./contactCenterPlatform";
import { ContactCenterDetailsDialog } from "./ContactCenterDialog";
const techItems = [
  { id: 1, name: "Genesis", logo: genesis },
{ id: 2, name: "Avaya", logo: avaya },
{ id: 3, name: "Amazon Connect", logo: connect },
{ id: 4, name: "Contact Center-1", logo: genesis },
{ id: 5, name: "Contact Center-2", logo: genesis },
{ id: 6, name: "Contact Center-3", logo: genesis },
{ id: 7, name: "Contact Center-4", logo: genesis },
{ id: 8, name: "Contact Center-5", logo: genesis },

];

export function ContactCenterCompanyDetails({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isCompanySelected, setIsCompanySelected] = useState<number | null>(null);
  const [displayCompany, setDisplayCompany] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  useEffect(()=>{
    if(!open){
        setDisplayCompany(true);
        setIsCompanySelected(null);
    }
  },[open])
  
  const handleCompanyID = (id: number) => {
    const company = techItems.find((item)=>item.id===id);
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
        <ContactCenterDetailsDialog 
        open={open}
          onClose={onClose}
          company={techItems.find((item) => item.id === isCompanySelected)}
        />
      )}
    </div>
  );
}
