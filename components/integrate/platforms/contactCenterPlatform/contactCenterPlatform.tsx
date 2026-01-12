"use client";
import React, { useState } from "react";
import Image from "next/image";
import avaya from "../../../../public/companyLogo/contactPlatform/avaya.svg"
import genesis from "../../../../public/companyLogo/contactPlatform/genesis.svg"
import connect from "../../../../public/companyLogo/contactPlatform/Connect.svg"
import five9 from "../../../../public/companyLogo/contactPlatform/Five9.png"
import talkdesk from "../../../../public/companyLogo/contactPlatform/talkdesk.png"
import { Button } from "@/components/ui/button";
import { ContactCenterCompanyDetails } from "./ContactCompanydetails";
import { Pencil,Trash2 } from "lucide-react";
import { ContactCenterDetailsDialog } from "./ContactCenterDialog";
const initialTechItems = [
{ id: 1, name: "Genesis", logo: genesis },
{ id: 2, name: "Avaya", logo: avaya },
{ id: 3, name: "Amazon Connect", logo: connect }
];


interface ContactCenterPlatfromProps{
  isCompanyModalOpen : boolean;
  onCloseModal:()=>void;
}
export default function ContactCenterPlatform({
  isCompanyModalOpen,
  onCloseModal
}:ContactCenterPlatfromProps) {

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
                    {techItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-6 py-4">
                          {/* <div className="relative w-12 h-12">
                            <Image
                              src={item.logo || "/placeholder.svg"}
                              alt={`${item.name} logo`}
                              fill
                              className="object-contain"
                            />
                          </div> */}
                          <div className="relative" style={{width:'70px', height:'auto'}}>
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
           
              {
                editWorkspace && selectedWorkspace && (
                 <ContactCenterDetailsDialog 
                 open={editWorkspace} 
                  onClose={closeEditDialog}
                  workspace={selectedWorkspace} 
                  company={undefined} 
                 />
                )
              }
            <ContactCenterCompanyDetails
              open={isCompanyModalOpen}
              onClose={() => onCloseModal()}
            />
        </div>
    </>
  );
}
