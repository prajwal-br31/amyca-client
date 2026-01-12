"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cog, Trash2 } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api-instance"

interface KnowledgeFile {
  _id: string
  originalName: string
  size: string
  description: string
  createdAt: Date
  status: string
}

export function KnowledgeStep() {
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchKnowledgeFiles()
  }, [])

  const fetchKnowledgeFiles = async () => {
    try {
      setIsLoading(true)
      const response = await api.get<KnowledgeFile[]>("/api/documents")
      setKnowledgeFiles(response || [])
    } catch (err) {
      console.error("Error fetching files:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !description) {
      alert("Please select a file and enter a description")
      return
    }
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("description", description)
      await api.postFormData("/api/documents", formData)
      await fetchKnowledgeFiles()
      setFile(null)
      setDescription("")
    } catch (err) {
      console.error("Error adding file:", err)
    }
  }

  const handleTrain = async (id: string) => {
    try {
      setIsTraining(true)
      console.log('🚀 Starting training for document:', id)
      const response = await api.post(`/api/documents/train/${id}`, {})
      console.log('✅ Training response:', response)
      
      // Refresh the list to show updated status
      await fetchKnowledgeFiles()
      
      // Show success message (you can replace with a toast notification)
      alert('Training started successfully! The document will be processed in the background.')
    } catch (err: any) {
      console.error("❌ Error training file:", err)
      const errorMessage = err?.message || err?.response?.data?.message || 'Failed to start training'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsTraining(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await api.delete(`/api/documents/${id}`)
        await fetchKnowledgeFiles()
      } catch (err) {
        console.error("Error deleting file:", err)
      }
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <label className="flex-1 border-2 border-dashed rounded-lg p-8 flex items-center justify-center">
          <input
            accept="application/pdf, text/plain"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <span className="text-gray-500">{file ? file.name : "Drag & drop your files Or click here to upload"}</span>
        </label>
        <div className="flex-[2] space-y-2">
          <label className="text-sm font-medium">Knowledge Description</label>
          <div className="flex gap-2">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="flex-1"
            />
            <Button className="bg-[#4285F4] hover:bg-[#4285F4]/90" type="submit">
              + ADD
            </Button>
          </div>
        </div>
      </form>

      <div>
        <h3 className="text-base font-medium mb-4">Knowledge Files</h3>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : knowledgeFiles.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No files uploaded yet</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-medium text-sm w-[250px]">File Name</th>
                  <th className="text-left p-4 font-medium text-sm flex-1">Knowledge Description</th>
                  <th className="text-left p-4 font-medium text-sm w-[180px]">Date Added</th>
                  <th className="text-left p-4 font-medium text-sm w-[150px]">Train the model</th>
                  <th className="text-left p-4 font-medium text-sm w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeFiles.map((file) => (
                  <tr key={file._id} className="border-t">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium">{file.originalName}</div>
                        <div className="text-sm text-gray-500">{file.size}</div>
                      </div>
                    </td>
                    <td className="p-4">{file.description}</td>
                    <td className="p-4">{new Date(file.createdAt).toLocaleString("en-US")}</td>
                    <td className="p-4">
                      <Button
                        variant={file.status === "completed" ? "success" : "secondary"}
                        size="sm"
                        className={`gap-2 ${
                          file.status === "completed"
                            ? "bg-gray-500 hover:bg-gray-400"
                            : file.status === "processing"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-gray-400 hover:bg-gray-600 text-white"
                        }`}
                        onClick={() => handleTrain(file._id)}
                        disabled={isTraining || file.status === "processing" || file.status === "completed"}
                      >
                        <Cog className={`h-4 w-4 ${file.status === "processing" ? "animate-spin" : ""}`} />
                        {file.status === "completed" 
                          ? "Trained" 
                          : file.status === "processing"
                          ? "Training..."
                          : "Train"}
                      </Button>
                    </td>
                    <td className="p-4">
                      <Button onClick={() => handleDelete(file._id)} variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/configuration">
          <Button variant="outline">Previous</Button>
        </Link>
        <Link href="/configuration/review">
          <Button className="bg-[#4285F4] hover:bg-[#4285F4]/90">Next</Button>
        </Link>
      </div>
    </div>
  )
}

