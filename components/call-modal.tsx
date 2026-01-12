import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialogTest"
import { PhoneCall, PhoneOff } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { MicStream } from "@/lib/micStream"
import { AudioPlayer } from "@/lib/audioPlayer"

interface TestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TranscriptMessage {
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

export function TestCallModal({ open, onOpenChange }: TestModalProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isCalling, setIsCalling] = useState(false)
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false) // Track if bot is speaking/processing

  const wsRef = useRef<WebSocket | null>(null)
  const micStreamRef = useRef<MicStream | null>(null)
  const audioPlayerRef = useRef<AudioPlayer | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userInitiatedDisconnectRef = useRef(false)
  const processedMessagesRef = useRef<Set<string>>(new Set()) // Track processed messages to prevent duplicates
  const lastMessageTimeRef = useRef<{ text: string; timestamp: number } | null>(null)

  // Fetch WebSocket URL from backend
  useEffect(() => {
    if (open) {
      fetchWsUrl()
    } else {
      // Reset state when modal closes
      handleHangup()
    }
  }, [open])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleHangup()
    }
  }, [])

  const fetchWsUrl = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://amyca-server.onrender.com'
      const response = await fetch(`${apiBaseUrl}/api/ws-token`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch WebSocket URL: ${response.status}`)
      }

      const data = await response.json()
      setWsUrl(data.url)
      console.log('✅ WebSocket URL fetched:', data.url)
    } catch (error) {
      console.error('❌ Error fetching WebSocket URL:', error)
      setError('Failed to get connection URL. Please try again.')
    }
  }

  const connectWebSocket = () => {
    if (!wsUrl) {
      setError('WebSocket URL not available')
      return
    }

    // Check if WebSocket is already connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.warn('⚠️ [CLIENT-WS] WebSocket already connected, skipping duplicate connection')
      return
    }

    // Close existing connection if any
    if (wsRef.current) {
      console.log('🔄 [CLIENT-WS] Closing existing WebSocket before creating new one')
      wsRef.current.close()
      wsRef.current = null
    }

    try {
      console.log('🔌 [CLIENT-WS] Creating NEW WebSocket connection to:', wsUrl)
      console.log('🔌 [CLIENT-WS] Connection timestamp:', Date.now())
      
      // Mark that this is NOT a user-initiated disconnect
      userInitiatedDisconnectRef.current = false

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws
      console.log('✅ [CLIENT-WS] WebSocket object created, readyState:', ws.readyState)

      ws.onopen = () => {
        console.log('✅ [CLIENT-WS] WebSocket OPENED (onopen event fired)')
        console.log('✅ [CLIENT-WS] Connection timestamp:', Date.now())
        console.log('✅ [CLIENT-WS] WebSocket readyState:', ws.readyState)
        setIsConnected(true)
        setError(null)
        
        // Send start message to notify server we're ready to send audio
        // The server will start recognition when this connection is established,
        // but this ensures the server knows audio is coming
        ws.send(JSON.stringify({ type: 'start' }))
        console.log('📤 [CLIENT-WS] Sent start message to server')
      }

      ws.onmessage = async (event) => {
        console.log('📥 [CLIENT-WS] Message received from server, timestamp:', Date.now())
        
        try {
          // Check if message is binary (Blob or ArrayBuffer)
          if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
            console.log('📥 [CLIENT-WS] Received binary message (audio data)')
            // Binary audio data - convert to base64 and handle
            const arrayBuffer = event.data instanceof Blob 
              ? await event.data.arrayBuffer() 
              : event.data
            const base64 = btoa(
              String.fromCharCode(...new Uint8Array(arrayBuffer))
            )
            console.log('📥 [CLIENT-WS] Binary audio converted to base64, length:', base64.length)
            await handleAudioChunk(base64, false)
            return
          }

          // Try to parse as JSON
          let data: any
          try {
            data = JSON.parse(event.data)
            console.log('📥 [CLIENT-WS] Received JSON message, type:', data.type)
          } catch {
            // If not JSON and not binary, ignore
            console.warn('⚠️ [CLIENT-WS] Received non-JSON, non-binary message')
            return
          }

          // Handle different message types
          switch (data.type) {
            case 'connected':
              console.log('✅ Server confirmed connection:', data.message)
              break

            case 'partial_transcription':
              // Update last user transcript or add new one
              setTranscripts((prev) => {
                const updated = [...prev]
                const lastUserIndex = updated.length - 1
                if (updated[lastUserIndex]?.type === 'user') {
                  updated[lastUserIndex] = {
                    type: 'user',
                    text: data.text,
                    timestamp: updated[lastUserIndex].timestamp,
                  }
                } else {
                  updated.push({
                    type: 'user',
                    text: data.text,
                    timestamp: new Date(),
                  })
                }
                return updated
              })
              break

            case 'transcription':
              // Final user transcription
              setTranscripts((prev) => {
                const updated = [...prev]
                const lastUserIndex = updated.length - 1
                if (updated[lastUserIndex]?.type === 'user') {
                  updated[lastUserIndex] = {
                    type: 'user',
                    text: data.text,
                    timestamp: updated[lastUserIndex].timestamp,
                  }
                } else {
                  updated.push({
                    type: 'user',
                    text: data.text,
                    timestamp: new Date(),
                  })
                }
                return updated
              })
              console.log('📝 User transcription:', data.text)
              break

            case 'response':
              // Bot response text - prevent duplicates using response ID or text matching
              const responseId = data.responseId || `response-${Date.now()}`
              const messageKey = data.responseId ? `bot-${responseId}` : `bot-${data.text.substring(0, 100)}`
              const now = Date.now()
              
              // Check if this exact message was processed (by ID or text)
              if (processedMessagesRef.current.has(messageKey)) {
                console.log('⏭️ [CLIENT] Skipping duplicate bot response (already processed):', data.text.substring(0, 50))
                return
              }
              
              // Check if same text was received very recently (within 1 second) - likely duplicate
              if (lastMessageTimeRef.current && 
                  lastMessageTimeRef.current.text === data.text &&
                  now - lastMessageTimeRef.current.timestamp < 1000) {
                console.log('⏭️ [CLIENT] Skipping duplicate bot response (rapid duplicate):', data.text.substring(0, 50))
                return
              }
              
              // Mark as processed
              processedMessagesRef.current.add(messageKey)
              lastMessageTimeRef.current = { text: data.text, timestamp: now }
              
              // Clean up old entries (keep last 20)
              if (processedMessagesRef.current.size > 20) {
                const entries = Array.from(processedMessagesRef.current)
                processedMessagesRef.current = new Set(entries.slice(-20))
              }
              
              setIsProcessing(true)
              setTranscripts((prev) => {
                // Double-check: don't add if last message is identical
                const lastMsg = prev[prev.length - 1]
                if (lastMsg && lastMsg.type === 'bot' && lastMsg.text === data.text) {
                  console.log('⏭️ [CLIENT] Skipping duplicate (last message identical):', data.text.substring(0, 50))
                  return prev
                }
                return [
                  ...prev,
                  {
                    type: 'bot',
                    text: data.text,
                    timestamp: new Date(),
                  },
                ]
              })
              console.log('🤖 [CLIENT] Bot response added:', data.text.substring(0, 50), 'ID:', responseId)
              break

            case 'audio_chunk':
              // Audio chunk from server (base64 encoded)
              console.log('🎵 [CLIENT-AUDIO] Audio chunk received, isLast:', data.isLast)
              console.log('🎵 [CLIENT-AUDIO] Chunk data length:', data.data ? data.data.length : 0)
              console.log('🎵 [CLIENT-AUDIO] Timestamp:', Date.now())
              
              if (data.isLast) {
                console.log('🎵 [CLIENT-AUDIO] Last chunk received - bot finished speaking')
                setIsProcessing(false) // Bot finished speaking
              }
              
              handleAudioChunk(data.data, data.isLast)
              break

            case 'error':
              console.error('❌ Server error:', data.message)
              setError(data.message || 'An error occurred')
              break

            default:
              console.warn('⚠️ Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('❌ Error handling WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setError('Connection error occurred')
      }

      ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason)
        setIsConnected(false)

        // Only attempt reconnect if:
        // 1. User didn't initiate the disconnect (hangup)
        // 2. Mic is still active (unexpected disconnect)
        if (!userInitiatedDisconnectRef.current && isCalling) {
          console.log('🔄 Attempting to reconnect...')
          setError('Connection lost. Reconnecting...')
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }

          // Attempt reconnect after 2 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!userInitiatedDisconnectRef.current && isCalling) {
              connectWebSocket()
            }
          }, 2000)
        } else {
          setError(null)
        }
      }
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error)
      setError('Failed to connect. Please try again.')
    }
  }

  const handleAudioChunk = async (base64Data: string, isLast: boolean = false) => {
    try {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new AudioPlayer(24000, 1) // Azure TTS uses 24kHz mono
        await audioPlayerRef.current.initialize()
      }

      // Add base64 encoded audio chunk to player
      await audioPlayerRef.current.addAudioChunk(base64Data, isLast)
    } catch (error) {
      console.error('❌ Error handling audio chunk:', error)
    }
  }

  const startCall = async () => {
    console.log('📞 [CLIENT-CALL] startCall() called, timestamp:', Date.now())
    
    // Prevent duplicate calls
    if (isCalling) {
      console.warn('⚠️ [CLIENT-CALL] Call already in progress, skipping duplicate startCall()')
      return
    }
    
    try {
      setError(null)
      setIsCalling(true)
      console.log('📞 [CLIENT-CALL] Setting isCalling = true')

      // Initialize audio player (only once)
      if (!audioPlayerRef.current) {
        console.log('🎵 [CLIENT-CALL] Initializing AudioPlayer...')
        audioPlayerRef.current = new AudioPlayer(24000, 1)
        await audioPlayerRef.current.initialize()
        console.log('✅ [CLIENT-CALL] AudioPlayer initialized')
      } else {
        console.log('⏭️ [CLIENT-CALL] AudioPlayer already initialized, reusing')
      }

      // Start microphone (only once)
      if (!micStreamRef.current) {
        console.log('🎤 [CLIENT-CALL] Starting MicStream...')
        micStreamRef.current = new MicStream()
        await micStreamRef.current.start((audioData: ArrayBuffer) => {
          // Send audio data to WebSocket
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // Convert ArrayBuffer to base64 for JSON transmission
            // This ensures compatibility and proper format handling
            const uint8Array = new Uint8Array(audioData)
            const base64 = btoa(
              String.fromCharCode.apply(null, Array.from(uint8Array))
            )
            wsRef.current.send(JSON.stringify({
              type: 'audio',
              data: base64,
            }))
            // Note: Too many logs here would be noisy, so we'll log every 100th chunk
          }
        })
        console.log('✅ [CLIENT-CALL] MicStream started')
      } else {
        console.log('⏭️ [CLIENT-CALL] MicStream already started, reusing')
      }

      // Connect WebSocket (only if not already connected)
      console.log('🔌 [CLIENT-CALL] Calling connectWebSocket()...')
      connectWebSocket()
    } catch (error) {
      console.error('❌ Error starting call:', error)
      setError(error instanceof Error ? error.message : 'Failed to start call')
      setIsCalling(false)
      
      // Cleanup on error
      if (micStreamRef.current) {
        micStreamRef.current.stop()
        micStreamRef.current = null
      }
    }
  }

  const handleHangup = () => {
    // Mark as user-initiated disconnect to prevent auto-reconnect
    userInitiatedDisconnectRef.current = true

    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Stop microphone
    if (micStreamRef.current) {
      micStreamRef.current.stop()
      micStreamRef.current = null
    }

    // Stop audio playback
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop()
      // Don't dispose - keep it for next call
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsCalling(false)
    setIsConnected(false)
    setError(null)
    setTranscripts([])
    setIsProcessing(false)
    processedMessagesRef.current.clear()
    lastMessageTimeRef.current = null
  }

  const toggleCall = () => {
    if (isCalling) {
      handleHangup()
    } else {
      startCall()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[320px] h-auto flex flex-col justify-between z-[1000] overflow-hidden p-4">
        <DialogTitle className="sr-only">ABC Help Desk - Voice Call</DialogTitle>
        <DialogDescription className="sr-only">Voice call interface with Agent Tina</DialogDescription>
        
        <div className="flex flex-col items-center space-y-2 py-1 flex-shrink-0">
          <p className="text-lg text-blue-500 opacity-90">ABC Help Desk</p>
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 shadow-xl rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/female-avatars/seliviya.svg"
              alt="AI Agent Avatar"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-base opacity-50">Agent Tina</p>
        </div>

        {/* Status Display - Shows current state */}
        <div className="flex-shrink-0 px-2 py-1">
          <p className="text-gray-600 text-center text-xs font-medium">
            {!isCalling 
              ? 'Press call to start conversation'
              : !isConnected
              ? 'Connecting...'
              : transcripts.length === 0
              ? 'Connected. Waiting for your message...'
              : isProcessing
              ? 'Agent is speaking...'
              : 'Listening...'}
          </p>
        </div>

        {/* Transcript Display - Fixed height, no scroll */}
        <div className="flex-1 min-h-[80px] max-h-[120px] border rounded-lg p-2 bg-gray-50 space-y-1 overflow-hidden flex-shrink-0">
          {transcripts.length === 0 ? (
            <p className="text-gray-400 text-center text-xs py-4">
              {isCalling ? 'Say something to start the conversation...' : 'Start a call to begin'}
            </p>
          ) : (
            <div className="space-y-2 overflow-y-auto h-full pr-1">
              {transcripts.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    msg.type === 'user'
                      ? 'bg-blue-100 text-blue-900 ml-auto text-right'
                      : 'bg-gray-200 text-gray-900 mr-auto text-left'
                  }`}
                  style={{ maxWidth: '85%' }}
                >
                  <p className="text-xs break-words">{msg.text}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">
                    {msg.type === 'user' ? 'You' : 'Agent'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-sm flex-shrink-0">
            {error}
          </div>
        )}

        {/* Connection Status */}
        {isCalling && (
          <div className="text-center text-xs flex-shrink-0 py-1">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        )}

        <div className="flex justify-center mt-1 flex-shrink-0">
          <Button
            onClick={toggleCall}
            size="lg"
            className={`rounded-full p-4 ${
              isCalling
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={!wsUrl && !isCalling}
          >
            {isCalling ? (
              <PhoneOff className="h-5 w-5" />
            ) : (
              <PhoneCall className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="text-center flex-shrink-0 pb-1">
          <small className="opacity-90 text-[10px]">
            {isCalling ? "Hang up" : "Press to call"}
          </small>
        </div>
      </DialogContent>
    </Dialog>
  )
}
