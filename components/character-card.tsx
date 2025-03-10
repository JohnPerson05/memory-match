"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface CharacterCardProps {
  imageSrc: string
  isRevealed: boolean
  isSelected: boolean
  isShuffling: boolean
  onClick: () => void
}

export default function CharacterCard({ imageSrc, isRevealed, isSelected, isShuffling, onClick }: CharacterCardProps) {
  return (
    <div
      className={`
        aspect-square cursor-pointer transition-all duration-300 transform
        ${isShuffling ? "animate-pulse" : ""}
        ${isSelected ? "scale-105" : "hover:scale-105"}
      `}
      onClick={onClick}
    >
      <Card
        className={`
        h-full flex items-center justify-center
        bg-black/80 backdrop-blur-lg border-2
        ${isRevealed ? "border-transparent" : "border-orange-400/50"}
        ${isSelected ? "ring-4 ring-orange-400" : ""}
        shadow-[0_8px_16px_rgba(0,0,0,0.3)]
        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br 
        before:from-white/20 before:to-transparent before:rounded-xl
        overflow-hidden
      `}
      >
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {isRevealed ? (
            <div className="relative w-full h-full">
              <Image src={imageSrc || "/placeholder.svg"} alt="Character" fill className="object-cover p-2" />
            </div>
          ) : (
            <div className="text-4xl text-white font-bold">?</div>
          )}
        </div>
      </Card>
    </div>
  )
}

