"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlayCircle, X } from "lucide-react"
import Image from "next/image"
import sara from "../public/female-avatars/sara.svg"
import athena from "../public/female-avatars/athena.svg"
import iris from "../public/female-avatars/iris.svg"
import minerva from "../public/female-avatars/minerva.svg"
import diana from "../public/female-avatars/diana.svg"
import feryana from "../public/female-avatars/feryana.svg"
import liora from "../public/female-avatars/liora.svg"
import seliviya from "../public/female-avatars/seliviya.svg"

interface Avatar {
  id: string
  name: string
  image: string
  gender: "male" | "female"
}

const avatars: Avatar[] = [
  { id: "1", name: "Sara", image:sara, gender: "female" },
  { id: "2", name: "Athena", image: athena, gender: "female" },
  { id: "3", name: "Iris", image: iris, gender: "female" },
  { id: "4", name: "Minerva", image: minerva, gender: "female" },
  { id: "5", name: "Diana", image: diana, gender: "female" },
  { id: "6", name: "Tina", image: seliviya, gender: "female" },
  { id: "7", name: "Diana", image: diana, gender: "female" },
  { id: "8", name: "Liora", image: liora, gender: "female" },
  //Add male avatars here
  { id: "9", name: "Sara", image: "/avatar1.png", gender: "male" },
  { id: "10", name: "Athena", image: "/avatar1.png", gender: "male" },
  { id: "11", name: "Iris", image: "/avatar1.png", gender: "male" },
  { id: "12", name: "Minerva", image: "/avatar1.png", gender: "male" },
  { id: "13", name: "Diana", image: "/avatar1.png", gender: "male" },
  { id: "14", name: "Tina", image: seliviya, gender: "male" },
  { id: "15", name: "Feryana", image: "/avatar1.png", gender: "male" },
  { id: "16", name: "Liora", image: "/avatar1.png", gender: "male" },
]

interface AvatarSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (avatar: Avatar) => void
  selectedAvatarId?: string
}

export function AvatarSelector({ open, onOpenChange, onSelect, selectedAvatarId }: AvatarSelectorProps) {
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("female")

  const isSelectable = (id: string) => id === "6" || id === "14"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl">AI Avatars</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedGender} onValueChange={(v) => setSelectedGender(v as "male" | "female")}>
          <div className="px-6">
            <TabsList className="w-full max-w-[400px] grid grid-cols-2">
              <TabsTrigger value="male" className="data-[state=active]:bg-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">👨</span>
                  Male Avatars
                </div>
              </TabsTrigger>
              <TabsTrigger value="female" className="data-[state=active]:bg-[#4285F4] data-[state=active]:text-white">
                <div className="flex items-center gap-2">
                  <span>👩</span>
                  Female Avatars
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="male" className="mt-6 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {avatars.filter((a) => a.gender === "male").map((avatar) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  selected={avatar.id === selectedAvatarId}
                  onSelect={isSelectable(avatar.id) ? () => onSelect(avatar) : undefined}
                  disabled={!isSelectable(avatar.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="female" className="mt-6 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {avatars.filter((a) => a.gender === "female").map((avatar) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  selected={avatar.id === selectedAvatarId}
                  onSelect={isSelectable(avatar.id) ? () => onSelect(avatar) : undefined}
                  disabled={!isSelectable(avatar.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface AvatarCardProps {
  avatar: Avatar
  selected: boolean
  onSelect?: () => void
  disabled: boolean
}

function AvatarCard({ avatar, selected, onSelect, disabled }: AvatarCardProps) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } transition-all ${selected ? "ring-2 ring-[#4285F4]" : "hover:ring-2 hover:ring-gray-200"}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <Image
        src={avatar.image}
        alt={avatar.name}
        width={400}
        height={400}
        className="w-full aspect-square object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent">
        <span className="text-white font-medium">{avatar.name}</span>
        {!disabled && (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
            <PlayCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
