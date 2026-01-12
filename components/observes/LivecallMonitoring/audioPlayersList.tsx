"use client"

import { useState } from "react"
import { AudioPlayer } from "./audioPlayer"
import type { Participant } from "./types";
import jira from "../../../public/companyLogo/standardSystem/jira.svg"
import manageEngine from "../../../public/companyLogo/helpdesk/Manageengine.svg"
import Azure from "../../../public/companyLogo/cloudPlatform/azure.svg"
import genesis from "../../../public/companyLogo/contactPlatform/genesis.svg"

const participants = [
  {
    name: "John Christie",
    role: "customer",
    logo: manageEngine,
  },
  {
    name: "Mary Thomas",
    role: "customer",
    logo: genesis,
  },
  {
    name: "Albert",
    role: "customer",
    logo: Azure,
  },
  {
    name: "James",
    role: "customer",
    logo: jira,
  },
] as const

export default function AudioPlayerList() {
  const [activePlayer, setActivePlayer] = useState<string | null>(null)

  const handlePlay = (participantName: string) => {
    setActivePlayer(participantName)
  }

  return (
    <div className="w-full max-w-6xl mx-auto  space-y-6">
      {participants.map((participant) => (
        <AudioPlayer
          key={participant.name}
          participant={participant}
          isActive={activePlayer === participant.name}
          onPlay={() => handlePlay(participant.name)}
        />
      ))}
    </div>
  )
}

