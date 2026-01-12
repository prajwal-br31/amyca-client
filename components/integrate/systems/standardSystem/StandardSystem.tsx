"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StandardCompanyDetails } from "./standardCompanyList";
import { Pencil,Trash2 } from "lucide-react";
import ibm from "../../../../public/companyLogo/standardSystem/ibm.svg"
import jira from "../../../../public/companyLogo/standardSystem/jira.svg"
import salesforce from "../../../../public/companyLogo/standardSystem/salesforce.svg"
import sap from "../../../../public/companyLogo/standardSystem/sap.svg"
import workday from "../../../../public/companyLogo/standardSystem/workday.svg"
import { StandardSyatemDetailsDialog } from "./standardDialogDetails";


const initialTechItems = [
  { id: 1, name: "SalesForce", logo: salesforce },
  { id: 2, name: "SAP", logo: sap },
  { id: 3, name: "WorkDay", logo: workday },
];

interface StandardApplicationProps{
  isCompanyModalOpen:boolean;
  handleCloseModal:()=>void;
}

export default function StandardSystemPlatform({
  isCompanyModalOpen,
  handleCloseModal
}:StandardApplicationProps) {

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
            <div className="container mx-auto py-8">
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
                    {techItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-6 py-4">
                        <div className="relative" style={{ width: '60px', height: 'auto' }}>
                                <Image
                                  src={item.logo || "/placeholder.svg"}
                                  alt={`${item.name} logo`}
                                  layout="intrinsic"  
                                  width={200} 
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
                      <StandardSyatemDetailsDialog
                        open={editWorkspace} 
                        onClose={closeEditDialog}
                        workspace={selectedWorkspace} 
                        company={undefined} 
                  />
            )}
            <StandardCompanyDetails
              open={isCompanyModalOpen}
              onClose={() => handleCloseModal()}
            />
        </div>
    </>
  );
}
