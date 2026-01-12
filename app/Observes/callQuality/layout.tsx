"use client"

import type React from "react"
import { useState, useEffect } from "react"
import moment from "moment"
import { Header } from "@/components/ui/header"
import {
  Sidebar
} from "@/components/ui/sidebar"
import CallQualityAudioPlayer from "@/components/observes/callQuality/callQualityAudioPlayer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ObserveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dateFilter, setDateFilter] = useState<string>("today")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })

  useEffect(() => {
    updateDateRange(dateFilter)
  }, [dateFilter])

  const updateDateRange = (filter: string) => {
    let start, end
    const now = moment()

    switch (filter) {
      case "today":
        start = now.startOf("day")
        end = now.endOf("day")
        break
      case "past_week":
        start = now.subtract(1, "week").startOf("day")
        end = moment().endOf("day")
        break
      case "past_month":
        start = now.subtract(1, "month").startOf("day")
        end = moment().endOf("day")
        break
      case "past_year":
        start = now.subtract(1, "year").startOf("day")
        end = moment().endOf("day")
        break
      default:
        start = now.startOf("day")
        end = now.endOf("day")
    }

    setDateRange({
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
    })
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)
    updateDateRange(value)
  }

  return (
    <div className="flex min-h-screen bg-gradient">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Tracking Call Quality</h1>
              <div className="w-48">
                <Select onValueChange={handleDateFilterChange} value={dateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="past_week">Past Week</SelectItem>
                    <SelectItem value="past_month">Past Month</SelectItem>
                    <SelectItem value="past_year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CallQualityAudioPlayer dateRange={dateRange} />
          </div>
        </main>
      </div>
    </div>
  )
}

