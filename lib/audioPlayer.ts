/**
 * AudioPlayer - Streams PCM audio chunks in real-time via Web Audio API
 * Handles streaming audio playback from WebSocket server
 * Uses AudioWorklet or ScriptProcessorNode for low-latency streaming
 */

export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private audioQueue: Float32Array[] = [];
  private isPlaying = false;
  private sampleRate = 24000; // Azure Speech TTS default sample rate
  private numChannels = 1; // Mono audio
  private nextPlayTime = 0;
  private audioBufferDuration = 0;
  private scheduledBuffers: AudioBufferSourceNode[] = [];
  private processedChunks = new Set<string>(); // Track processed chunks to prevent duplicates
  private lastChunkHash: string | null = null;
  private lastChunkTime = 0;

  constructor(sampleRate: number = 24000, numChannels: number = 1) {
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
  }

  /**
   * Initialize Web Audio API context
   */
  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.sampleRate,
      });
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.audioContext.destination);
      
      console.log('✅ Audio context initialized with sample rate:', this.audioContext.sampleRate);
    } catch (error) {
      console.error('❌ Failed to initialize audio context:', error);
      throw error;
    }
  }

  /**
   * Add audio chunk (base64 encoded WAV/PCM data) and play immediately
   * This enables real-time streaming playback
   */
  private chunkCounter = 0; // Track chunks for logging

  async addAudioChunk(base64Data: string, isLast: boolean = false): Promise<void> {
    this.chunkCounter++;
    const now = Date.now();
    console.log(`🎵 [CLIENT-AUDIO-PLAYER] addAudioChunk() called #${this.chunkCounter}, isLast: ${isLast}, timestamp: ${now}`);
    
    if (!this.audioContext) {
      console.log('🎵 [CLIENT-AUDIO-PLAYER] AudioContext not initialized, initializing...');
      await this.initialize();
    }

    if (!this.audioContext || !this.gainNode) {
      console.error('❌ [CLIENT-AUDIO-PLAYER] Audio context not initialized');
      return;
    }

    // Handle empty chunks (signals end of stream)
    if (!base64Data || base64Data.length === 0) {
      if (isLast) {
        console.log('🔊 [CLIENT-AUDIO-PLAYER] Received empty last chunk, waiting for playback to complete...');
      } else {
        console.log('⏭️ [CLIENT-AUDIO-PLAYER] Received empty non-last chunk, skipping');
      }
      return;
    }

    // CRITICAL: Prevent duplicate chunk processing
    // Create a hash of the chunk data (use first 100 chars + length for quick comparison)
    const chunkHash = `${base64Data.substring(0, 100)}-${base64Data.length}`;
    
    // Check if this exact chunk was processed recently (within 1 second)
    if (this.processedChunks.has(chunkHash)) {
      console.warn(`⚠️ [CLIENT-AUDIO-PLAYER] DUPLICATE DETECTED: Chunk #${this.chunkCounter} already processed - SKIPPING`);
      console.warn(`⚠️ [CLIENT-AUDIO-PLAYER] Chunk hash: ${chunkHash.substring(0, 50)}...`);
      return;
    }
    
    // Check if same chunk was received very recently (within 500ms) - likely duplicate
    if (this.lastChunkHash === chunkHash && (now - this.lastChunkTime) < 500) {
      console.warn(`⚠️ [CLIENT-AUDIO-PLAYER] DUPLICATE DETECTED: Same chunk received ${now - this.lastChunkTime}ms ago - SKIPPING`);
      return;
    }
    
    // Mark chunk as processed
    this.processedChunks.add(chunkHash);
    this.lastChunkHash = chunkHash;
    this.lastChunkTime = now;
    
    // Clean up old chunk hashes (keep last 50 to prevent memory leak)
    if (this.processedChunks.size > 50) {
      const entries = Array.from(this.processedChunks);
      this.processedChunks = new Set(entries.slice(-50));
      console.log('🔄 [CLIENT-AUDIO-PLAYER] Cleaned up old chunk hashes, keeping last 50');
    }

    try {
      console.log(`🎵 [CLIENT-AUDIO-PLAYER] Processing chunk #${this.chunkCounter}, base64 length: ${base64Data.length}`);
      // Decode base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Azure TTS returns audio in RIFF WAV format
      // Try to decode as WAV first
      let audioBuffer: AudioBuffer;
      try {
        audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer.slice(0));
      } catch (wavError) {
        // If WAV decode fails, treat as raw PCM 16-bit little-endian
        console.warn('⚠️ Failed to decode as WAV, treating as raw PCM');
        const pcmData = new Int16Array(bytes.buffer);
        const floatData = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          floatData[i] = pcmData[i] / 32768.0; // Normalize to [-1, 1]
        }
        
        // Create AudioBuffer from PCM data
        audioBuffer = this.audioContext.createBuffer(
          this.numChannels,
          floatData.length,
          this.sampleRate
        );
        audioBuffer.getChannelData(0).set(floatData);
      }

      console.log(`🎵 [CLIENT-AUDIO-PLAYER] Audio buffer decoded, duration: ${audioBuffer.duration}s, sample rate: ${audioBuffer.sampleRate}`);
      
      // Play audio immediately for real-time streaming
      await this.playAudioBuffer(audioBuffer);
      console.log(`✅ [CLIENT-AUDIO-PLAYER] Chunk #${this.chunkCounter} scheduled for playback`);
      
      if (isLast) {
        // Wait for all scheduled buffers to finish
        console.log('🔊 [CLIENT-AUDIO-PLAYER] Last audio chunk received, waiting for playback to complete...');
        console.log(`🔊 [CLIENT-AUDIO-PLAYER] Total chunks received: ${this.chunkCounter}`);
      }
    } catch (error) {
      console.error('❌ Error adding audio chunk:', error);
    }
  }

  /**
   * Play AudioBuffer immediately using scheduled playback
   * This enables low-latency streaming
   */
  private async playAudioBuffer(audioBuffer: AudioBuffer): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      return;
    }

    try {
      // Create a new source node for this buffer
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      // Schedule playback
      const currentTime = this.audioContext.currentTime;
      
      // If we have scheduled buffers, queue after the last one
      if (this.nextPlayTime > currentTime) {
        source.start(this.nextPlayTime);
        this.nextPlayTime += audioBuffer.duration;
      } else {
        // Play immediately if no queue
        source.start(currentTime);
        this.nextPlayTime = currentTime + audioBuffer.duration;
      }

      // Track scheduled buffers
      this.scheduledBuffers.push(source);
      this.isPlaying = true;

      // Clean up when buffer finishes
      source.onended = () => {
        const index = this.scheduledBuffers.indexOf(source);
        if (index > -1) {
          this.scheduledBuffers.splice(index, 1);
        }
        
        // If no more buffers, mark as not playing
        if (this.scheduledBuffers.length === 0) {
          this.isPlaying = false;
          this.nextPlayTime = 0;
          console.log('🔊 Audio playback completed');
        }
      };
    } catch (error) {
      console.error('❌ Error playing audio buffer:', error);
    }
  }

  /**
   * Stop current playback and clear queue
   */
  stop(): void {
    // Stop all scheduled buffers
    this.scheduledBuffers.forEach((source) => {
      try {
        source.stop();
      } catch (error) {
        // Source may already be stopped
      }
    });
    
    this.scheduledBuffers = [];
    this.audioQueue = [];
    this.isPlaying = false;
    this.nextPlayTime = 0;
    this.processedChunks.clear();
    this.lastChunkHash = null;
    this.lastChunkTime = 0;
    console.log('🛑 Audio playback stopped');
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    this.gainNode = null;
  }
}
