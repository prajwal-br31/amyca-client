"use client"

import React, { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import AnalyticsTab1 from "@/components/analytics/analytics_tab1/page";
import AnalyticsTab2 from "@/components/analytics/analytics_tab2/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("tab1");
  const [ dateFilter,setDateFilter]= useState<string>("today");
  const [dateRange,setDateRange]=useState<{start:string;end:string}>({start:"",end:""})

  useEffect(()=>{
    upDateDateRange(dateFilter);
  },[dateFilter])

  const upDateDateRange =(filter:string)=>{
      let start,end;
      const now = moment();

      switch (filter){
        case "today":
          start = now.startOf("day")
          end =now.endOf("day")
          break;
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
        start:start.format("YYYY-MM-DD"),
        end: end.format("YYYY-MM-DD")
      })
  }

  const handleDateFilterChange =(value:string)=>{
    setDateFilter(value)
    upDateDateRange(value)
  }

  return (
    <div className="flex min-h-screen bg-gradient">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="glass-card p-8">
            <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-6">Executive Dashboard</h1>
            <div className="w-48">
              <Select onValueChange={handleDateFilterChange} value={dateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Date"/>
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
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 text-sm font-medium text-center ${
                  activeTab === "tab1"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("tab1")}
              >
                Call Analysis
              </button>
              <button
                className={`flex-1 py-4 px-6 text-sm font-medium text-center  ${
                  activeTab === "tab2"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("tab2")}
              >
                Key Metrics
              </button>
            </div>

            <div className="pt-6">
            <div
                className={`transition-opacity duration-300 ease-in-out ${
                  activeTab === "tab1" ? "opacity-100" : "opacity-0"
                }`}
              >
                {activeTab === "tab1" && <AnalyticsTab1 dateRange={dateRange}/>}
              </div>
              <div
                className={`transition-opacity duration-300 ease-in-out ${
                  activeTab === "tab2" ? "opacity-100" : "opacity-0"
                }`}
              >
                {activeTab === "tab2" && <AnalyticsTab2 dateRange={dateRange}/>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
