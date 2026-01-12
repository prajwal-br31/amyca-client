export interface SentimentData {
    sentiment: "positive" | "neutral" | "negative"
    value: number
  }
  
  export function generateMockSentimentData(duration: number): SentimentData[] {
    const data: SentimentData[] = []
    for (let i = 0; i < duration; i++) {
      const random = Math.random()
      if (random < 0.33) {
        data.push({ sentiment: "negative", value: Math.random() * 0.5 + 0.5 })
      } else if (random < 0.66) {
        data.push({ sentiment: "neutral", value: Math.random() * 0.5 + 0.5 })
      } else {
        data.push({ sentiment: "positive", value: Math.random() * 0.5 + 0.5 })
      }
    }
    return data
  }
  
  