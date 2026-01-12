"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { PlayIcon, PauseIcon, RotateCcwIcon, FastForwardIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { SentimentGraph, generateMockSentimentData } from "./sentiment-graph"
import { customers } from "./customersData"

const calculateSentimentPercentages = () => {
  return {
    positive: 50,
    negative: 20,
    neutral: 30,
  }
}

export default function CallQualityAudioPlayer() {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [callTrack, setCallTrack] = useState(customers)
  const [sentimentData, setSentimentData] = useState<ReturnType<typeof generateMockSentimentData>>([])
  const [sentimentStats] = useState(calculateSentimentPercentages())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const [activeSentiment, setActiveSentiment] = useState<string | null>(null)

  const handlePlayPause = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return

    if (playingAudio === customerId) {
      audioRef.current?.pause()
      setPlayingAudio(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(customer.audioUrl)
      audioRef.current.play()
      setPlayingAudio(customerId)
      setSelectedCustomer(customer)
      setDialogOpen(true)

      const mockData = generateMockSentimentData(100)
      setSentimentData(mockData)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      audio.playbackRate = playbackSpeed

      const updateProgress = () => {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
        setDuration(audio.duration)
      }

      audio.addEventListener("timeupdate", updateProgress)
      audio.addEventListener("ended", () => setPlayingAudio(null))
      return () => {
        audio.removeEventListener("timeupdate", updateProgress)
        audio.removeEventListener("ended", () => setPlayingAudio(null))
      }
    }
  }, [playbackSpeed])

  useEffect(() => {
    setTotalPages(Math.ceil(callTrack.length / itemsPerPage))
  }, [callTrack])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10
    }
  }

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10
    }
  }

  const handleSpeedChange = (value: string) => {
    setPlaybackSpeed(Number(value))
    if (audioRef.current) {
      audioRef.current.playbackRate = Number(value)
    }
  }

  const handleDialogClose = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setPlayingAudio(null)
    setDialogOpen(false)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setSentimentData([])
  }

  const handleSentiment = (sentiment: string) => {
    if (sentiment === "All") {
      setCallTrack(customers)
      setActiveSentiment(null)
    } else {
      setCallTrack(customers.filter((item) => item.sentiment === sentiment))
      setActiveSentiment(sentiment)
    }
    setCurrentPage(1)
  }

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return callTrack.slice(startIndex, endIndex)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 ${i === currentPage ? "bg-blue-500 text-white" : ""}`}
        >
          {i}
        </Button>,
      )
    }

    return buttons
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-4">
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="grid grid-cols-3 gap-2 place-items-center text-2xl">
            <button
              className={`flex flex-col items-center justify-center gap-2 rounded border hover:scale-105 transition-transform duration-100 relative ${
                activeSentiment === "Positive" ? "bg-blue-500 text-white" : ""
              }`}
              style={{
                width: "350px",
                height: "80px",
                boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.2), inset 0 -4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => handleSentiment("Positive")}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgb(34, 197, 94)",
                  top: "50%",
                  left: "25%",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
              <span className={`${activeSentiment === "Positive" ? "text-white" : "opacity-80"}`}>Positive 50%</span>
            </button>

            <button
              className={`flex flex-col items-center justify-center gap-2 rounded border hover:scale-105 transition-transform duration-100 relative ${
                activeSentiment === "Neutral" ? "bg-blue-500 text-white" : ""
              }`}
              style={{
                width: "350px",
                height: "80px",
                boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.2), inset 0 -4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => handleSentiment("Neutral")}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgb(234, 179, 8)",
                  top: "50%",
                  left: "25%",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
              <span className={`${activeSentiment === "Neutral" ? "text-white" : "opacity-80"}`}>Neutral 30%</span>
            </button>

            <button
              className={`flex flex-col items-center justify-center gap-2 rounded border hover:scale-105 transition-transform duration-100 relative ${
                activeSentiment === "Negative" ? "bg-blue-500 text-white" : ""
              }`}
              style={{
                width: "350px",
                height: "80px",
                boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.2), inset 0 -4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => handleSentiment("Negative")}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgb(239, 68, 68)",
                  top: "50%",
                  left: "23%",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
              <span className={`${activeSentiment === "Negative" ? "text-white" : "opacity-80"}`}>Negative 20%</span>
            </button>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="p-2 rounded flex justify-center items-center"
              style={{ width: "40px", height: "40px" }}
              onClick={() => handleSentiment("All")}
            >
              <RotateCcwIcon className="w-8 h-8" style={{ opacity: "50%" }} />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-md border mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Agent</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Track Call</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8">
                      <Image
                        src={customer.agent.avatar || "/placeholder.svg"}
                        alt={customer.agent.name}
                        className="rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                    </div>
                    {customer.agent.name}
                  </div>
                </TableCell>
                <TableCell>{customer.customer}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        customer.sentiment === "Positive"
                          ? "bg-green-500"
                          : customer.sentiment === "Negative"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    {customer.sentiment}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => handlePlayPause(customer.id)}
                  >
                    {playingAudio === customer.id ? (
                      <PauseIcon className="h-4 w-4 text-white" />
                    ) : (
                      <PlayIcon className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          {renderPaginationButtons()}
          <Button
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[825px] p-0 min-h-[200px] flex flex-col justify-between">
          <DialogHeader className="pt-4 flex justify-around">
            <div className="flex justify-around ">
              <div className="flex-1 flex items-center p-2">
                <p className="text-2xl font-semibold px-4">Agent: {selectedCustomer?.agent.name}</p>
                <Image
                  src={selectedCustomer?.agent.avatar || "/placeholder.svg"}
                  alt={selectedCustomer?.agent.name || "Agent"}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 flex items-center justify-center p-2">
                <p className="text-2xl font-semibold px-4">Customer: {selectedCustomer?.customer}</p>
              </div>
            </div>
          </DialogHeader>
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="max-w-screen-xl mx-auto space-y-4">
              <SentimentGraph duration={duration} currentTime={currentTime} sentimentData={sentimentData} activeSentiment={activeSentiment}/>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-green-500 font-bold text-lg">{sentimentStats.positive.toFixed(1)}%</div>
                      <div className="text-sm">Positive</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-yellow-500 font-bold text-lg">{sentimentStats.neutral.toFixed(1)}%</div>
                      <div className="text-sm">Neutral</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-red-500 font-bold text-lg">{sentimentStats.negative.toFixed(1)}%</div>
                      <div className="text-sm">Negative</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Progress value={progress} className="mb-2" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" className="rounded-full" onClick={handleRewind}>
                    <RotateCcwIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="rounded-full w-12 h-12"
                    onClick={() => selectedCustomer && handlePlayPause(selectedCustomer.id)}
                  >
                    {playingAudio === selectedCustomer?.id ? (
                      <PauseIcon className="w-6 h-6" />
                    ) : (
                      <PlayIcon className="w-6 h-6" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={handleFastForward}>
                    <FastForwardIcon className="w-4 h-4" />
                  </Button>
                  <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                    <SelectTrigger className="w-[60px]">
                      <SelectValue placeholder="Speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600">
                  {playingAudio === selectedCustomer?.id ? "Playing" : "Paused"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
