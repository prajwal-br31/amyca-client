"use client"

import { useRef, useEffect } from "react"

interface SentimentGraphProps {
  duration: number
  currentTime: number
  sentimentData: ReturnType<typeof generateMockSentimentData>
  activeSentiment :string
}

export const generateMockSentimentData = (duration: number) => {
  const data = []
  for (let i = 0; i < duration; i++) {
    const random = Math.random()
    if (random < 0.2) {
      data.push({ time: i, sentiment: "negative", value: Math.random() * 0.8 + 0.2 })
    } else if (random < 0.5) {
      data.push({ time: i, sentiment: "neutral", value: 0.5 })
    } else {
      data.push({ time: i, sentiment: "positive", value: Math.random() * 0.5 + 0.5 })
    }
  }
  return data
}

export function SentimentGraph({ duration, currentTime, sentimentData,activeSentiment }: SentimentGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const totalWidth = canvas.width
      const barWidth = (totalWidth / sentimentData.length) * 0.9
      const gap = (totalWidth / sentimentData.length) * 0.1

      sentimentData.forEach((data, index) => {
        const x = index * (barWidth + gap)

        switch (data.sentiment) {
          case "positive":
            ctx.strokeStyle = "#10b981" // Green for positive
            ctx.beginPath()
            ctx.moveTo(x, canvas.height * 0.9) // Moved to 90% of canvas height
            ctx.lineTo(x + barWidth, canvas.height * 0.9)
            ctx.stroke()
            break
          case "neutral":
            ctx.strokeStyle = "#f59e0b" // Yellow for neutral
            ctx.beginPath()
            ctx.moveTo(x, canvas.height * 0.6) // Moved to 60% of canvas height
            ctx.lineTo(x + barWidth, canvas.height * 0.6)
            ctx.stroke()
            break
          case "negative":
            const height = data.value * (canvas.height * 0.4) // Reduced height to fit in top 40% of canvas
            const y = canvas.height * 0.1 // Starts at 10% of canvas height
            ctx.fillStyle = "#ef4444" // Red for negative
            ctx.fillRect(x, y, barWidth, height)
            break
        }
      })

      // Draw playhead
      const playheadX = (currentTime / duration) * canvas.width
      ctx.fillStyle = "white"
      ctx.fillRect(playheadX - 1, 0, 2, canvas.height)
    }

    drawGraph()

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [sentimentData, currentTime, duration])

  return (
    <div className="relative w-full h-24 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={1000}
        height={96}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}

