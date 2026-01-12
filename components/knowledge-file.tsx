import { FileText } from 'lucide-react'

interface KnowledgeFileProps {
  filename: string
}

export function KnowledgeFile({ filename }: KnowledgeFileProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
      <FileText className="w-4 h-4 text-blue-600" />
      <span className="text-sm text-blue-600">{filename}</span>
    </div>
  )
}

