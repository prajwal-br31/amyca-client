export interface Participant {
    name: string
    role: string
    logo: string
  }
  
  export interface AudioPlayerProps {
    participant: Participant
    isActive: boolean
    onPlay: () => void
  }
  
  