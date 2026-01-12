"use client";
import React, { useState } from "react";
import Image from "next/image";
import IBM from "../../../../public/companyLogo/cloudPlatform/ibm.svg";
import salesforce from "../../../../public/companyLogo/cloudPlatform/salesforce.svg";
import Azure from "../../../../public/companyLogo/cloudPlatform/azure.svg";
import oracle from "../../../../public/companyLogo/cloudPlatform/oracle.svg";
import alibaba from "../../../../public/companyLogo/cloudPlatform/alibaba.png";
import { Button } from "@/components/ui/button";
import { CloudCompanyDetails } from "./CloudCompanydetails";
import { Pencil,Trash2 } from "lucide-react";
import Fabric from "../../../../public/companyLogo/cloudPlatform/Fabric.png"
import aws from "../../../../public/companyLogo/cloudPlatform/aws.svg"
import gcp from "../../../../public/companyLogo/cloudPlatform/googleCloud.svg"
import { CloudDetailsDialog } from "./CloudDialogDetails";
const initialTechItems = [
  { id:1,name: "Azure Fabric", logo: Fabric },
  { id:2,name: "AWS", logo: aws },
  { id:2,name: "Google Cloud", logo: gcp }
];

interface CloudPlatfromProps {
  isCompanyModalOpen:boolean;
  onCloseModal:()=>void;
}

export default function CloudPlatform({
  isCompanyModalOpen,
  onCloseModal
}:CloudPlatfromProps) {

  const [techItems, setTechItems] = useState(initialTechItems);

    const [editWorkspace, setEditWorkspace] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState<
      { id: number; name: string; logo: string } | null
    >(null);
  
    const handleDelete = (index: number) => {
      setTechItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };
  
    const handleEdit = (index: number) => {
      const workspaceToEdit = techItems[index];
      setSelectedWorkspace(workspaceToEdit);
      setEditWorkspace(true);
    };
  
    const closeEditDialog = () => {
      setEditWorkspace(false);
      setSelectedWorkspace(null);
    };

  return (
    <>
    <div className="">
            <div className="container mx-auto pb-8 pt-4">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-m font-medium text-gray-700">
                        Platform Logo
                      </th>
                      <th className="px-6 py-3 text-left text-m font-medium text-gray-700">
                        Platform Name
                      </th>
                      <th className="px-6 py-3 text-left text-m font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-m font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {techItems.slice(0,5).map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-6 py-4">
                          <div className="relative" style={{ width: '80px', height: 'auto' }}>
                            <Image
                              src={item.logo || "/placeholder.svg"}
                              alt={`${item.name} logo`}
                              layout="intrinsic"
                              className="object-contain"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{item.name}</td>
                        <td className="px-6 py-4 text-green-600 font-medium">Success</td>
                        <td className="px-6 py-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>handleEdit(index)}>
                                <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>{handleDelete(index)}}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           
            {editWorkspace && selectedWorkspace && (
                      <CloudDetailsDialog
                        open={editWorkspace} 
                        onClose={closeEditDialog}
                        workspace={selectedWorkspace} 
                        company={undefined} 
                      />
                    )}
            <CloudCompanyDetails
              open={isCompanyModalOpen}
              onClose={() => onCloseModal()}
            />
        </div>
    </>
  );
}
