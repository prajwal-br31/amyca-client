"use client"
import React, { useState, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Check, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CustomerSystemCompanyDetails } from "./customerCompanyList";
import { CustomerSystemDetailsDialog } from "./customerDialogDetails"
const initialSystems = [
  { id: 1, name: "System-1", isEditing: false },
  { id: 2, name: "System-2", isEditing: false },
  { id: 3, name: "System-3", isEditing: false },
  { id: 4, name: "System-4", isEditing: false },
]

interface CustomerApplicationProps {
  isCompanyModalOpen: boolean
  handleCloseModal: () => void
}

export default function CustomerSystemPlatform({ isCompanyModalOpen, handleCloseModal }: CustomerApplicationProps) {
  const [systemItems, setSystemItems] = useState(initialSystems);
  const [editWorkspace, setEditWorkspace] = useState(false);


  const [selectedWorkspace, setSelectedWorkspace] = useState<
  { id: number; name: string; logo: string } | null>(null);

  const handleDelete = (id: number) => {
    setSystemItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const handleSystemEdit = (id: number) => {
    setSystemItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, isEditing: true } : item)))
  }

  const handleSave = (id: number, newName: string) => {
    setSystemItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, name: newName, isEditing: false } : item)),
    )
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === "Enter") {
      handleSave(id, e.currentTarget.value)
    }
  }

  const handleEdit = (index: number) => {
    const workspaceToEdit = systemItems[index];
    setSelectedWorkspace(workspaceToEdit);
    setEditWorkspace(true);
  };

  const closeEditDialog = () => {
    setEditWorkspace(false);
    setSelectedWorkspace(null);
  };

  return (
    <div className="container mx-auto pb-6 pt-2">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-m font-medium text-gray-700">System Number</th>
            <th className="px-6 py-3 text-left text-m font-medium text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-m font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {systemItems.map((item,index) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="px-6 py-4 text-gray-700">
                {item.isEditing ? (
                  <Input
                    defaultValue={item.name}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    onBlur={(e) => handleSave(item.id, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center">
                    {item.name}
                    {item.id === 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => handleSystemEdit(item.id)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-green-600 font-medium">Success</td>
              <td className="px-6 py-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(index)}>
                     <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
      {editWorkspace && selectedWorkspace && (
                            <CustomerSystemDetailsDialog
                              open={editWorkspace} 
                              onClose={closeEditDialog}
                              workspace={selectedWorkspace} 
                              company={undefined} 
                        />
                  )}
                  <CustomerSystemCompanyDetails
                    open={isCompanyModalOpen}
                    onClose={() => handleCloseModal()}
                  />
    </div>
  )
}

