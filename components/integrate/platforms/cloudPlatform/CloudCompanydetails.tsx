"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight } from "lucide-react";
import Fabric from "../../../../public/companyLogo/cloudPlatform/Fabric.png"
import aws from "../../../../public/companyLogo/cloudPlatform/aws.svg"
import gcp from "../../../../public/companyLogo/cloudPlatform/googleCloud.svg"
import { CloudDetailsDialog } from "./CloudDialogDetails";
const techItems = [
  { id:1,name: "Azure Fabric", logo: Fabric },
  { id:2,name: "AWS", logo: aws },
  { id:3,name: "Google Cloud", logo: gcp },
  { id:4,name: "Cloud Platform-1", logo: gcp },
  { id:5,name: "Cloud Platform-2", logo: gcp },
  { id:6,name: "Cloud Platform-3", logo: gcp },
  { id:7,name: "Cloud Platform-4", logo: gcp },
  { id:8,name: "Cloud Platform-5", logo: gcp }
];

export function CloudCompanyDetails({
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
        <CloudDetailsDialog 
          open={open}
          onClose={onClose}
          company={techItems.find((item) => item.id === isCompanySelected)}
        />
      )}
    </div>
  );
}
