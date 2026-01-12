/**
 * MicStream - Captures raw PCM audio using Web Audio API
 * Handles microphone capture and streaming to WebSocket
 * Azure Speech Service requires PCM 16-bit, 16kHz, mono
 */

export class MicStream {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private isRecording = false;
  private onAudioData: ((data: ArrayBuffer) => void) | null = null;
  private sampleRate = 16000; // Azure Speech Service standard
  private diagnosticCounter = 0; // For diagnostic logging

  /**
   * Request microphone access and start streaming raw PCM audio
   */
  async start(onAudioData: (data: ArrayBuffer) => void): Promise<void> {
    try {
      // Request microphone access
      // Note: autoGainControl might suppress audio too much, so we'll disable it
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono
          sampleRate: 16000, // 16kHz for Azure Speech Service (browser may ignore this)
          echoCancellation: true,
          noiseSuppression: false, // Disable to preserve audio levels
          autoGainControl: false, // Disable to prevent audio suppression
        },
      });
      
      console.log('🎤 Microphone access granted');
      const audioTracks = this.mediaStream.getAudioTracks();
      console.log('🎤 MediaStream tracks:', audioTracks.map(t => ({
        label: t.label,
        enabled: t.enabled,
        muted: t.muted,
        readyState: t.readyState,
        settings: t.getSettings()
      })));
      
      // Verify at least one audio track is active
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks found in MediaStream');
      }
      
      // Check track status
      const activeTracks = audioTracks.filter(t => t.enabled && !t.muted && t.readyState === 'live');
      if (activeTracks.length === 0) {
        console.error('❌ CRITICAL: No active audio tracks!');
        console.error('   - Enabled tracks:', audioTracks.filter(t => t.enabled).length);
        console.error('   - Unmuted tracks:', audioTracks.filter(t => !t.muted).length);
        console.error('   - Live tracks:', audioTracks.filter(t => t.readyState === 'live').length);
        console.error('   - Track details:', audioTracks.map(t => ({
          label: t.label,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState
        })));
        throw new Error('No active audio tracks - microphone may be muted or disabled');
      }
      
      console.log(`✅ Found ${activeTracks.length} active audio track(s)`);

      this.onAudioData = onAudioData;

      // Create AudioContext (browser may not support custom sample rate, use default)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ensure audio context is running (might be suspended on some browsers)
      // Browsers require user interaction before audio context can start
      if (this.audioContext.state === 'suspended') {
        console.log('🔄 Audio context is suspended, attempting to resume...');
        try {
          await this.audioContext.resume();
          console.log('✅ Audio context resumed successfully');
        } catch (error) {
          console.error('❌ Failed to resume audio context:', error);
          console.error('   - User interaction may be required');
          throw new Error('Audio context suspended - user interaction required');
        }
      }
      
      // Double-check state after resume attempt
      if (this.audioContext.state !== 'running') {
        console.warn('⚠️ Audio context state is still:', this.audioContext.state);
        console.warn('   - Audio processing may not work until context is running');
      }
      
      // Get actual sample rate (browser may use 44100 or 48000 instead of requested 16000)
      const actualSampleRate = this.audioContext.sampleRate;
      console.log(`🎚️ Audio context sample rate: ${actualSampleRate}Hz (requested: ${this.sampleRate}Hz)`);
      console.log(`🎚️ Audio context state: ${this.audioContext.state}`);

      // Create source from media stream
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Verify the source is connected and receiving audio
      console.log('🔗 MediaStreamSource created from MediaStream');
      
      // Monitor the MediaStream for audio activity (reuse audioTracks from above)
      audioTracks.forEach((track, index) => {
        track.addEventListener('ended', () => {
          console.warn(`⚠️ Audio track ${index} ended unexpectedly`);
        });
        track.addEventListener('mute', () => {
          console.warn(`⚠️ Audio track ${index} was muted`);
        });
        track.addEventListener('unmute', () => {
          console.log(`✅ Audio track ${index} was unmuted`);
        });
      });

      // Create ScriptProcessorNode for processing audio
      // NOTE: ScriptProcessorNode is deprecated but still widely supported
      // Buffer size: 4096 samples (smaller = lower latency, but more processing)
      // Must be power of 2: 256, 512, 1024, 2048, 4096, 8192, 16384
      const bufferSize = 4096;
      
      // Check if ScriptProcessorNode is available
      if (!this.audioContext.createScriptProcessor) {
        throw new Error('ScriptProcessorNode not supported in this browser. Please use a modern browser.');
      }
      
      this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      console.log(`🔧 ScriptProcessorNode created with buffer size: ${bufferSize}`);

      // Create a silent gain node to prevent audio feedback
      // ScriptProcessorNode requires connection to destination, but we don't want to play audio
      const silentGain = this.audioContext.createGain();
      silentGain.gain.value = 0; // Silent - prevents feedback

      // Process audio data
      // IMPORTANT: ScriptProcessorNode processes audio from inputBuffer
      // The audio flows through even if output is silent
      this.scriptProcessor.onaudioprocess = (event) => {
        if (!this.isRecording) return;

        // Get audio data from INPUT buffer (this is the microphone audio)
        // Float32Array, values between -1 and 1
        const inputData = event.inputBuffer.getChannelData(0);
        
        // Check if we're actually receiving audio data (first time detection)
        if (!audioReceived) {
          for (let i = 0; i < Math.min(100, inputData.length); i++) {
            if (Math.abs(inputData[i]) > 0.0001) {
              audioReceived = true;
              clearTimeout(testTimeout);
              console.log('✅ Audio data confirmed - microphone is capturing!');
              break;
            }
          }
        }
        
        // Check if we're actually receiving audio data
        if (this.diagnosticCounter === 1) {
          // Check if all samples are zero (no audio)
          let allZeros = true;
          for (let i = 0; i < Math.min(100, inputData.length); i++) {
            if (Math.abs(inputData[i]) > 0.0001) {
              allZeros = false;
              break;
            }
          }
          if (allZeros) {
            console.error('❌ CRITICAL: ScriptProcessorNode receiving all zeros - MediaStream not providing audio!');
            console.error('   - Check: Is microphone muted in system settings?');
            console.error('   - Check: Are audio tracks enabled?', audioTracks.map(t => ({ enabled: t.enabled, muted: t.muted })));
            console.error('   - Check: Is browser blocking audio capture?');
            console.error('   - ScriptProcessorNode might not be working in this browser');
          }
        }
        
        // Diagnostic: Check audio levels periodically (first chunk and every 100 chunks)
        if (!this.diagnosticCounter) this.diagnosticCounter = 0;
        this.diagnosticCounter++;
        
        if (this.diagnosticCounter === 1 || this.diagnosticCounter % 100 === 0) {
          // Calculate audio level statistics
          let maxAmplitude = 0;
          let minAmplitude = 0;
          let nonZeroSamples = 0;
          for (let i = 0; i < inputData.length; i++) {
            const absValue = Math.abs(inputData[i]);
            maxAmplitude = Math.max(maxAmplitude, absValue);
            minAmplitude = Math.min(minAmplitude, absValue);
            if (absValue > 0.001) nonZeroSamples++;
          }
          console.log(`🎤 Frontend audio level (chunk ${this.diagnosticCounter}): max=${maxAmplitude.toFixed(4)}, min=${minAmplitude.toFixed(4)}, active samples=${nonZeroSamples}/${inputData.length}`);
          
          if (maxAmplitude < 0.01) {
            console.warn('⚠️ WARNING: Frontend audio is very quiet! Check microphone input.');
          }
        }

        // Resample if needed (actual sample rate might be different from 16kHz)
        let processedData: Float32Array;
        if (actualSampleRate !== this.sampleRate) {
          // Simple linear resampling (for better quality, use a proper resampler library)
          const ratio = this.sampleRate / actualSampleRate;
          const newLength = Math.floor(inputData.length * ratio);
          processedData = new Float32Array(newLength);
          for (let i = 0; i < newLength; i++) {
            const srcIndex = i / ratio;
            const srcIndexFloor = Math.floor(srcIndex);
            const srcIndexCeil = Math.min(srcIndexFloor + 1, inputData.length - 1);
            const t = srcIndex - srcIndexFloor;
            processedData[i] = inputData[srcIndexFloor] * (1 - t) + inputData[srcIndexCeil] * t;
          }
        } else {
          processedData = inputData;
        }

        // Convert Float32Array to Int16Array (16-bit PCM, little-endian)
        // Azure Speech Service expects PCM 16-bit signed integer, little-endian
        // Apply moderate gain boost to ensure audio is audible (but not too much to avoid clipping)
        const gainBoost = 2.0; // Boost audio by 2x to ensure good signal level
        const pcmData = new Int16Array(processedData.length);
        for (let i = 0; i < processedData.length; i++) {
          // Clamp value to [-1, 1], apply gain boost, then convert to 16-bit signed integer
          let s = Math.max(-1, Math.min(1, processedData[i] * gainBoost));
          // Convert to 16-bit signed integer: multiply by 32767 and round
          pcmData[i] = Math.round(s * 32767);
        }

        // Convert to ArrayBuffer and send
        if (this.onAudioData) {
          this.onAudioData(pcmData.buffer);
        }
      };

      // Connect audio flow: source → scriptProcessor → silentGain → destination
      // CRITICAL: ScriptProcessorNode MUST be connected to destination for it to process audio
      // The audio must actually flow through the chain, even if output is silent
      // Order matters: connect in sequence
      
      // First, connect scriptProcessor to silentGain (output side)
      this.scriptProcessor.connect(silentGain);
      silentGain.connect(this.audioContext.destination);
      
      // Then connect source to scriptProcessor (input side)
      // This ensures the audio graph is complete before we start feeding data
      source.connect(this.scriptProcessor);
      
      console.log('🔗 Audio processing chain connected: MediaStream → ScriptProcessor → SilentGain → Destination');
      console.log('🔗 Source node state:', {
        numberOfInputs: source.numberOfInputs,
        numberOfOutputs: source.numberOfOutputs,
        channelCount: source.channelCount,
        channelCountMode: source.channelCountMode
      });
      console.log('🔗 ScriptProcessor node state:', {
        numberOfInputs: this.scriptProcessor.numberOfInputs,
        numberOfOutputs: this.scriptProcessor.numberOfOutputs,
        bufferSize: this.scriptProcessor.bufferSize
      });
      
      // Verify audio context is actually running
      if (this.audioContext.state !== 'running') {
        console.error('❌ Audio context is not running! State:', this.audioContext.state);
        console.error('   - Audio processing will not work until context is running');
        console.error('   - Try clicking on the page or making a user interaction');
        throw new Error(`Audio context not running: ${this.audioContext.state}`);
      }
      
      // Give the audio graph a moment to initialize
      // Sometimes there's a brief delay before audio starts flowing
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('⏳ Audio graph initialization delay completed');
      
      // Set up a test to verify audio is actually flowing
      // We'll check after a short delay to see if we receive any audio data
      let audioReceived = false;
      const testTimeout = setTimeout(() => {
        if (!audioReceived && this.isRecording) {
          console.error('❌ CRITICAL: No audio data received after 1 second!');
          console.error('   - MediaStream might not be providing audio');
          console.error('   - Check microphone permissions and system settings');
          console.error('   - Try speaking into the microphone');
          console.error('   - Check if ScriptProcessorNode is working in this browser');
          console.error('   - This might be a browser compatibility issue with ScriptProcessorNode');
        }
      }, 1000);

      this.isRecording = true;

      console.log('🎤 Microphone started, streaming raw PCM audio...');
      console.log('🔍 Waiting for audio data confirmation...');
    } catch (error) {
      console.error('❌ Failed to start microphone:', error);
      throw error;
    }
  }

  /**
   * Stop recording and release microphone
   */
  stop(): void {
    this.isRecording = false;

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
    }

    this.onAudioData = null;
    console.log('🛑 Microphone stopped');
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Get current media stream (for debugging)
   */
  getMediaStream(): MediaStream | null {
    return this.mediaStream;
  }
}

