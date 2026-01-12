"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";
import salesforce from "../../../../public/companyLogo/standardSystem/salesforce.svg"
import sap from "../../../../public/companyLogo/standardSystem/sap.svg"
import workday from "../../../../public/companyLogo/standardSystem/workday.svg"
import { CustomerSystemDetailsDialog } from "./customerDialogDetails";
import systemImage from "../../../../public/companyLogo/standardSystem/systemImage.png"
const techItems = [
  { id: 1, name: "System-1", logo: systemImage },
  { id: 2, name: "System-2", logo: systemImage },
  { id: 3, name: "System-3", logo: systemImage },
  { id: 4, name: "System-4", logo: systemImage },
  { id: 5, name: "System-5", logo: systemImage },
  { id: 6, name: "System-6", logo: systemImage },
  { id: 7, name: "System-7", logo: systemImage },
  { id: 8, name: "System-8", logo: systemImage },
];

export function CustomerSystemCompanyDetails({
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
        <CustomerSystemDetailsDialog 
                      open={open}
                      onClose={onClose}
                      company={techItems.find((item) => item.id === isCompanySelected)} workspace={undefined}        />
      )}
    </div>
  );
}
