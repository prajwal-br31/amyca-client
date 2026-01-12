"use client"

import { useState } from "react"
import { Search, HelpCircle, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useSidebar } from "../context/SidebarContext"
export const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const { isIntegrateHidden, toggleIntegrate } = useSidebar()

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen)

  return (
    <header className="flex items-center justify-between h-16 px-6 backdrop-blur-md z-50 relative">
      <div className="logo-text">
        <p className="text-4xl font-semibold text-blue-600">
        {/* AmYcA <span className="text-sm text-gray-500">Voice over Gen AI</span> */}
        </p>
      </div>
      <div className="flex items-center gap-2 relative">
        <button className="p-2 hover:bg-blue-50/50 rounded-full transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-blue-50/50 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
        <div className="relative">
          <button onClick={toggleDropdown} className="p-2 hover:bg-blue-50/50 rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000]">
              <Link href="/manage-users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Manage Users
              </Link>
              <button
                onClick={toggleIntegrate}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {isIntegrateHidden ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show 
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide
                  </>
                )}
              </button>
              <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

