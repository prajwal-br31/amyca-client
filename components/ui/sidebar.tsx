"use client"

import type React from "react"

import { DashboardIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import {
  Monitor,
  ScreenShare,
  Settings,
  EyeIcon,
  Database,
  BarChartIcon as ChartBar,
  BotMessageSquare,
  ScanSearch,
  PersonStanding,
  BookAudio,
  Disc,
  BrainCircuit,
  PhoneCall,
  BadgeMinus,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSidebar } from "../context/SidebarContext"

interface SubMenuItem {
  name: string
  href: string
  icon: React.ElementType
}

interface MenuItem {
  name: string
  icon: React.ElementType
  href: string
  subItems?: SubMenuItem[]
}

export const Sidebar = () => {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const { isIntegrateHidden } = useSidebar()

  const menuItems: MenuItem[] = [
    {
      name: "Analytics",
      icon: ChartBar,
      href: "/analytics",
      subItems: [{ name: "Dashboard", href: "/analytics/Dashboard", icon: DashboardIcon }],
    },
    {
      name: "Configure",
      icon: Settings,
      href: "/configuration/",
      subItems: [
        { name: "Agent Configuration", href: "/configuration", icon: PersonStanding },
        { name: "Add Knowledge", href: "/configuration/add-knowledge", icon: Database },
        { name: "Review", href: "/configuration/review", icon: ScanSearch },
      ],
    },
    {
      name: "Integrate",
      icon: ScreenShare,
      href: "/Integrates",
      subItems: [
        { name: "Platforms", href: "/Integrates/platforms", icon: Disc },
        { name: "Applications", href: "/Integrates/systems", icon: Monitor },
        { name: "LLMs", href: "/Integrates/llms", icon: BrainCircuit },
      ],
    },
    {
      name: "Multi Agents",
      icon: BotMessageSquare,
      href: "/agentsConnect",
    },
    {
      name: "Observe",
      icon: EyeIcon,
      href: "/Observes",
      subItems: [
        { name: "Call Quality", href: "/Observes/callQuality", icon: PhoneCall },
        { name: "Negative Sentiments", href: "/Observes/liveCall", icon: BadgeMinus },
        { name: "Prompt Tuning", href: "/Observes/promptTuning", icon: BookAudio },
      ],
    },
  ]

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName) ? prev.filter((name) => name !== menuName) : [...prev, menuName],
    )
  }

  const initializeExpandedMenus = () => {
    const menuToExpand = menuItems.find((item) => item.subItems?.some((subItem) => pathname === subItem.href))
    if (menuToExpand) {
      setExpandedMenus([menuToExpand.name])
    }
  }

  useEffect(() => {
    initializeExpandedMenus()
  }, [pathname]) //Fixed useEffect dependency

  const handleMouseEnter = (e: React.MouseEvent, itemName: string) => {
    if (!isCollapsed) return

    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPosition({ top: rect.top, left: rect.right })
    setHoveredMenu(itemName)
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isCollapsed) return

    const toElement = (e as any).toElement || (e as any).relatedTarget
    if (!toElement) {
      setHoveredMenu(null)
      return
    }

    const isMovingToMenu =
      toElement.classList.contains("menu-tooltip") ||
      toElement.classList.contains("submenu-popover") ||
      toElement.closest(".menu-tooltip") ||
      toElement.closest(".submenu-popover")

    const isMovingToMenuItem = toElement.closest(".menu-item")

    if (!isMovingToMenu && !isMovingToMenuItem) {
      setHoveredMenu(null)
    }
  }

  const handleSubmenuMouseLeave = (e: React.MouseEvent) => {
    if (!isCollapsed) return

    const toElement = (e as any).toElement || (e as any).relatedTarget
    if (!toElement || (!toElement.closest(".menu-item") && !toElement.closest(".submenu-popover"))) {
      setHoveredMenu(null)
    }
  }

  const visibleMenuItems = menuItems.filter((item) => item.name !== "Integrate" || !isIntegrateHidden)

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-content">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border rounded-full p-1.5 hover:bg-gray-100 z-50"
        >
          <ChevronDownIcon
            className={`transform transition-transform h-4 w-4 ${isCollapsed ? "-rotate-90" : "rotate-90"}`}
          />
        </button>

        <div className="logo-section flex justify-center">
          <img src="/logo.png" alt="CallGen" className="h-8" />
        </div>

        <nav className="nav-section">
          {visibleMenuItems.map((item) => (
            <div
              key={item.name}
              className="menu-item"
              onMouseEnter={(e) => handleMouseEnter(e, item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.subItems ? (
                <div
                  className={`nav-link ${pathname === item.href ? "active" : ""} cursor-pointer`}
                  onClick={() => !isCollapsed && toggleMenu(item.name)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <item.icon className="nav-icon" />
                      {!isCollapsed && <span className="ml-3">{item.name}</span>}
                    </div>
                    {!isCollapsed && item.subItems && (
                      <ChevronDownIcon
                        className={`transform transition-transform h-4 w-4 ${expandedMenus.includes(item.name) ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <Link href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}>
                  <div className="flex items-center">
                    <item.icon className="nav-icon" />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </div>
                </Link>
              )}

              {item.subItems &&
                ((isCollapsed && hoveredMenu === item.name) || (!isCollapsed && expandedMenus.includes(item.name))) && (
                  <div
                    className={`${isCollapsed ? "submenu-popover" : "submenu"}`}
                    style={isCollapsed ? { top: `${menuPosition.top}px`, left: `${menuPosition.left}px` } : undefined}
                    onMouseLeave={handleSubmenuMouseLeave}
                  >
                    {isCollapsed && <div className="submenu-title">{item.name}</div>}
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`submenu-link ${pathname === subItem.href ? "active" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <subItem.icon className="nav-icon" />
                          <span>{subItem.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>
    </aside>  
  )
}

