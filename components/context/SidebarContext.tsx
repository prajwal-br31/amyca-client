"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

type SidebarContextType = {
  isIntegrateHidden: boolean
  toggleIntegrate: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isIntegrateHidden, setIsIntegrateHidden] = useState(false)

  const toggleIntegrate = () => {
    setIsIntegrateHidden((prev) => !prev)
  }

  return <SidebarContext.Provider value={{ isIntegrateHidden, toggleIntegrate }}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

