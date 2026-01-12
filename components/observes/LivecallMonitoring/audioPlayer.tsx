"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, Play, Pause, FastForward } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AudioPlayerProps } from "./types"

// Mock sentiment data generation
const generateSentimentData = (duration: number) => {
  const data = []
  for (let i = 0; i < duration; i++) {
    const random = Math.random()
    if (random < 0.15) {
      data.push({ time: i, sentiment: "negative", value: Math.random() * 0.8 + 0.2 }) // Random value between 0.2 and 1
    } else if (random < 0.4) {
      // 0.15 + 0.25 = 0.40
      data.push({ time: i, sentiment: "neutral", value: 0.75 }) // Fixed value for neutral
    } else {
      data.push({ time: i, sentiment: "positive", value: 0.5 }) // Fixed value for positive
    }
  }
  return data
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function AudioPlayer({ participant, isActive, onPlay }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sentimentData = useRef(generateSentimentData(461))

  // Customizable bar width and gap
  const barWidth = 8
  const gap = 16
  const maxBarHeight = 60

  useEffect(() => {
    const drawSentimentGraph = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      sentimentData.current.forEach((data, index) => {
        const x = (barWidth + gap) * index

        switch (data.sentiment) {
          case "positive":
            ctx.strokeStyle = "#10b981"
            ctx.beginPath()
            ctx.moveTo(x, canvas.height * 0.75)
            ctx.lineTo(x + barWidth, canvas.height * 0.75)
            ctx.stroke()
            break
          case "neutral":
            ctx.strokeStyle = "#f59e0b"
            ctx.beginPath()
            ctx.moveTo(x, canvas.height * 0.5)
            ctx.lineTo(x + barWidth, canvas.height * 0.5)
            ctx.stroke()
            break
          case "negative":
            const height = data.value * maxBarHeight
            const y = (canvas.height - height) / 2
            ctx.fillStyle = "#ef4444"
            ctx.fillRect(x, y, barWidth, height)
            break
        }
      })
    }

    drawSentimentGraph()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  useEffect(() => {
    if (!isActive && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  }, [isActive, isPlaying])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        onPlay()
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Calculate canvas width based on data length, bar width, and gap
  const canvasWidth = sentimentData.current.length * (barWidth + gap) - gap

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{participant.name}</h2>
          <div className="ml-auto">
            <span className="text-sm text-muted-foreground">{participant.role}</span>
          </div>
        </div>

        <div className="relative w-full h-16 rounded-lg overflow-hidden">
          <div className="w-full h-full ">
            <canvas ref={canvasRef} className="h-full bg-muted" width={canvasWidth} height={96} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <audio
            ref={audioRef}
            src="/demo.mp3"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0
                }
              }}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon">
              <FastForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="bg-secondary w-full h-1 rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <Select
              value={playbackRate.toString()}
              onValueChange={(value) => setPlaybackRate(Number.parseFloat(value))}
            >
              <SelectTrigger className="w-[65px]">
                <SelectValue>{playbackRate}x</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1.0">1.0x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2.0">2.0x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

