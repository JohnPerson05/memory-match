"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shuffle, Share2, Trophy } from "lucide-react"
import confetti from "canvas-confetti"
import Image from "next/image"

// For development, we'll use placeholder images
const placeholderImages = [
  "/signderella.jpg?height=100&width=100&text=1",
  "/daddy.jpg?height=100&width=100&text=2",
  "/zoe.jpg?height=100&width=100&text=3",
  "/potter.jpg?height=100&width=100&text=4",
  "/claire.jpg?height=100&width=100&text=5",
  "/lj.jpg?height=100&width=100&text=6",
  "/me.jpg?height=100&width=100&text=7",
  "/signslo.jpg?height=100&width=100&text=8",
  "/signpass.jpg?height=100&width=100&text=9",
  "/token.jpg?height=100&width=100&text=10",
  "/cute.jpg?height=100&width=100&text=11",
  "/glass.png?height=100&width=100&text=12",
  "/master.jpg?height=100&width=100&text=12",
  "/holy.jpg?height=100&width=100&text=12",
  "/xoxo.jpg?height=100&width=100&text=12",
  "/meme.jpg?height=100&width=100&text=12",

]

export default function MemoryGame() {
    const [gameState, setGameState] = useState<
      "intro" | "memorize" | "shuffling" | "guess" | "result-success" | "result-failure" | "result"
    >("intro")
    const [level, setLevel] = useState(1)
    const [score, setScore] = useState(0)
    const [cards, setCards] = useState<string[]>([])
    const [targetCard, setTargetCard] = useState<string>("")
    const [selectedCard, setSelectedCard] = useState<number | null>(null)
    const [isShuffling, setIsShuffling] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const [memorizeTime, setMemorizeTime] = useState(3)
    const [memorizeCounter, setMemorizeCounter] = useState(3)
    const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null)
    const memorizeTimerRef = useRef<NodeJS.Timeout | null>(null)
  
    // Initialize game
    useEffect(() => {
      if (gameState === "intro") {
        // Reset game state
        setScore(0)
        setLevel(1)
        setSelectedCard(null)
        setMemorizeTime(3)
      }
    }, [gameState])
  
    // Set up cards for the level
    useEffect(() => {
      if (gameState === "memorize") {
        // Calculate number of cards based on level
        let numCards
        if (level <= 2) {
          numCards = 4
        } else if (level <= 5) {
          numCards = 6
        } else if (level <= 7) {
          numCards = 7
        } else if (level <= 8) {
          numCards = 8
        } else {
          // For levels beyond 8, add 1 card for every 2 levels
          numCards = 8 + Math.floor((level - 8) / 2)
        }
  
        // Adjust memorize time based on level
        const newMemorizeTime = level <= 3 ? 4 : level <= 5 ? 3 : 2
        setMemorizeTime(newMemorizeTime)
        setMemorizeCounter(newMemorizeTime)
  
        // Shuffle and select cards
        const shuffledImages = [...placeholderImages].sort(() => Math.random() - 0.5).slice(0, numCards)
        setCards(shuffledImages)
  
        // Pick a random card to be the target
        const randomIndex = Math.floor(Math.random() * numCards)
        setTargetCard(shuffledImages[randomIndex])
  
        // Start countdown for memorize phase
        let count = newMemorizeTime
        memorizeTimerRef.current = setInterval(() => {
          count -= 1
          setMemorizeCounter(count)
  
          if (count <= 0) {
            clearInterval(memorizeTimerRef.current as NodeJS.Timeout)
  
            // Add a small delay before shuffling starts
            setTimeout(() => {
              setGameState("shuffling")
              startShuffling()
            }, 500)
          }
        }, 1000)
  
        return () => {
          if (memorizeTimerRef.current) {
            clearInterval(memorizeTimerRef.current)
          }
        }
      }
    }, [gameState, level])
  
    // Replace the entire startShuffling function with this improved version
    const startShuffling = () => {
      setIsShuffling(true)
  
      // Match shuffle speed with pulse animation timing
      let shuffleSpeed: number
      if (level <= 3) {
        shuffleSpeed = 600 // 0.6s pulse
      } else if (level <= 5) {
        shuffleSpeed = 400 // 0.4s pulse
      } else if (level <= 7) {
        shuffleSpeed = 200 // 0.2s pulse
      } else if (level <= 8) {
        shuffleSpeed = 100 // 0.1s pulse
      } else if (level <= 10) {
        shuffleSpeed = 50 // 0.05s pulse
      } else {
        shuffleSpeed = 5 // 0.01s pulse
      }
  
      // Track the position of the target card during shuffling
      let targetIndex = cards.indexOf(targetCard)
  
      // Number of shuffles based on level (fewer shuffles for better tracking)
      const shuffleCount = 3 + Math.min(level, 5)
      let currentShuffle = 0
  
      const performShuffle = () => {
        // Create a predictable shuffle pattern
        // We'll always swap two adjacent cards in a predictable pattern
        const idx1 = currentShuffle % cards.length
        const idx2 = (idx1 + 1) % cards.length
  
        setCards((prevCards) => {
          const newCards = [...prevCards]
  
          // Swap the cards
          const temp = newCards[idx1]
          newCards[idx1] = newCards[idx2]
          newCards[idx2] = temp
  
          // Update the target index if it was involved in the swap
          if (targetIndex === idx1) {
            targetIndex = idx2
          } else if (targetIndex === idx2) {
            targetIndex = idx1
          }
  
          return newCards
        })
  
        currentShuffle++
  
        if (currentShuffle < shuffleCount) {
          // Continue shuffling with the same timing as the pulse animation
          shuffleTimerRef.current = setTimeout(performShuffle, shuffleSpeed)
        } else {
          // Pause before ending the shuffling phase
          setTimeout(() => {
            setIsShuffling(false)
            setGameState("guess")
          }, shuffleSpeed) // Match the final pause with the shuffle speed
        }
      }
  
      // Start shuffling immediately without initial delay
      performShuffle()
    }
  
    // Clean up shuffle timer
    useEffect(() => {
      return () => {
        if (shuffleTimerRef.current) {
          clearTimeout(shuffleTimerRef.current)
        }
        if (memorizeTimerRef.current) {
          clearInterval(memorizeTimerRef.current)
        }
      }
    }, [])
  
    // Replace the handleCardSelect function with this improved version
    const handleCardSelect = (index: number) => {
      if (gameState !== "guess") return
  
      setSelectedCard(index)
  
      // Check if the selected card is the target
      if (cards[index] === targetCard) {
        // Correct guess
        setScore((prevScore) => prevScore + level * 100)
  
        // Show confetti for correct answer
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
  
        // Show the correct card briefly before moving to next level
        setTimeout(() => {
          // Reveal all cards briefly to show the correct one
          setGameState("result-success")
  
          // Then move to next level
          setTimeout(() => {
            setLevel((prevLevel) => prevLevel + 1)
            setSelectedCard(null)
            setGameState("memorize")
          }, 1500)
        }, 500)
      } else {
        // Wrong guess - game over
        // First reveal all cards to show where the correct one was
        setTimeout(() => {
          setGameState("result-failure")
  
          // Then show game over screen
          setTimeout(() => {
            setGameState("result")
          }, 1500)
        }, 500)
      }
    }
  
    // Start a new game
    const startGame = () => {
      setShowInstructions(false)
      setGameState("memorize")
    }
  
    // Update the restart game function to properly reset state
    const restartGame = () => {
      setGameState("intro")
      setShowInstructions(true)
      setLevel(1)
      setScore(0)
      setSelectedCard(null)
      setCards([])
      setTargetCard("")
      setIsShuffling(false)
      setMemorizeTime(3)
      setMemorizeCounter(3)
  
      // Clear any existing timers
      if (shuffleTimerRef.current) {
        clearTimeout(shuffleTimerRef.current)
      }
      if (memorizeTimerRef.current) {
        clearInterval(memorizeTimerRef.current)
      }
    }
  
    // Share score on Twitter
    const shareScore = () => {
      const text = `Hey Orange Dynasty! 🍊\n\nI scored ${score} points in the Memory Card Challenge! Can you beat my score?`
      const url = window.location.href
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank",
      )
    }
  
    // Get difficulty label based on level
    const getDifficultyLabel = () => {
      if (level <= 3) return "Easy"
      if (level <= 5) return "Medium"
      if (level <= 8) return "Hard"
      return "Expert"
    }
  
    // Get shuffle speed text
    const getShuffleSpeedText = () => {
      if (level <= 3) return "Slow"
      if (level <= 5) return "Medium"
      if (level <= 8) return "Fast"
      return "Very Fast"
    }
  
    // Update the instructions card styling
    const InstructionsCard = () => (
      <div className="bg-black/90 rounded-[20px] p-8 mb-6 max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
        <h2 className="text-[28px] font-semibold mb-6 text-orange-300/90">How to Play:</h2>
        <ol className="list-decimal list-inside space-y-4 text-[16px] text-gray-200">
          <li className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Memorize the character shown on screen
          </li>
          <li className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Watch carefully as the cards shuffle
            <ul className="list-none pl-6 mt-2 space-y-1 text-orange-200/80">
              <li>• Levels 1-3: Slow shuffling</li>
              <li>• Levels 4-5: Medium speed</li>
              <li>• Levels 6+: Fast shuffling</li>
            </ul>
          </li>
          <li className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            Find the matching character
          </li>
          <li className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            Score points and advance levels
          </li>
        </ol>
        <Button
          className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white rounded-md py-3 text-lg font-medium"
          onClick={startGame}
        >
          Start Game
        </Button>
      </div>
    )
  
    return (
      <div className="w-full max-w-md mx-auto">
        {/* Game header */}
        {gameState !== "intro" && (
          <div className="backdrop-blur-md bg-white/30 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="text-orange-800">
                <div className="text-lg font-semibold">Level: {level}</div>
                <div className="text-lg font-semibold">Score: {score}</div>
                <div className="text-sm font-medium mt-1">Difficulty: {getDifficultyLabel()}</div>
              </div>
  
              <Button variant="outline" className="bg-white/40 hover:bg-white/50 text-orange-800" onClick={restartGame}>
                Restart
              </Button>
            </div>
          </div>
        )}
  
        {/* Instructions */}
        {gameState === "intro" && showInstructions && <InstructionsCard />}
  
        {/* Memorize phase */}
        {gameState === "memorize" && (
          <div className="text-center mb-6 bg-black/60 p-6 rounded-xl backdrop-blur-md">
            <div className="text-xl font-bold text-white mb-3">Memorize this character:</div>
            <div className="relative w-32 h-32 mx-auto mb-4 bg-black/40 rounded-xl overflow-hidden">
              <Image src={targetCard || "/placeholder.svg"} alt="Character to memorize" fill className="object-cover" />
            </div>
            <div className="text-white">Memorizing... {memorizeCounter}s</div>
            <div className="text-sm text-orange-200 mt-2">Shuffle speed: {getShuffleSpeedText()}</div>
          </div>
        )}
  
        {/* Shuffling message */}
        {gameState === "shuffling" && (
          <div className="text-center mb-6 bg-black/60 p-6 rounded-xl backdrop-blur-md">
            <div className="text-xl font-bold text-white mb-3">Shuffling cards...</div>
            <Shuffle className="w-12 h-12 mx-auto text-white animate-spin" />
            <div className="text-sm text-orange-200 mt-4">Speed: {getShuffleSpeedText()}</div>
          </div>
        )}
  
        {/* Guess phase */}
        {gameState === "guess" && (
          <div className="text-center mb-6 bg-black/60 p-6 rounded-xl backdrop-blur-md">
            <div className="text-xl font-bold text-white mb-3">Find the character!</div>
            <div className="text-sm text-orange-200">Select the card with the character you memorized</div>
          </div>
        )}
  
        {/* Cards display with glossy effect */}
        {(gameState === "memorize" || gameState === "shuffling" || gameState === "guess") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`
                  aspect-square cursor-pointer transition-all duration-300 transform
                  ${isShuffling ? `animate-pulse ${level <= 3 ? "animate-[pulse_0.6s_ease-in-out_infinite]" : level <= 5 ? "animate-[pulse_0.4s_ease-in-out_infinite]" : level <= 7 ? "animate-[pulse_0.2s_ease-in-out_infinite]" : level <= 8 ? "animate-[pulse_0.1s_ease-in-out_infinite]" : level <= 10 ? "animate-[pulse_0.05s_ease-in-out_infinite]" : "animate-[pulse_0.01s_ease-in-out_infinite]"}` : ""}
                  ${selectedCard === index ? "scale-105" : "hover:scale-105"}
                  ${card === targetCard && gameState !== "guess" ? "ring-2 ring-green-400/50" : ""}
                `}
                onClick={() => handleCardSelect(index)}
              >
                <Card
                  className={`
                  h-full flex items-center justify-center
                  bg-black/80 backdrop-blur-lg border-2
                  ${gameState === "guess" ? "border-orange-400/50" : "border-transparent"}
                  ${selectedCard === index ? "ring-4 ring-orange-400" : ""}
                  ${card === targetCard && gameState !== "guess" ? "border-green-400/50" : ""}
                  shadow-[0_8px_16px_rgba(0,0,0,0.3)]
                  before:content-[""] before:absolute before:inset-0 before:bg-gradient-to-br 
                  before:from-white/20 before:to-transparent before:rounded-xl
                  overflow-hidden
                `}
                >
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {gameState === "guess" ? (
                      <div className="text-4xl text-white font-bold">?</div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image src={card || "/placeholder.svg"} alt="Character" fill className="object-cover p-2" />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
  
        {/* Show all cards after guessing (for both success and failure) */}
        {(gameState === "result-success" || gameState === "result-failure") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`
            aspect-square transition-all duration-300 transform
            ${card === targetCard ? "scale-105" : ""}
          `}
              >
                <Card
                  className={`
            h-full flex items-center justify-center
            bg-black/80 backdrop-blur-lg border-2
            ${
              card === targetCard
                ? "border-green-500 ring-4 ring-green-400"
                : selectedCard === index
                  ? "border-red-500 ring-4 ring-red-400"
                  : "border-transparent"
            }
            shadow-[0_8px_16px_rgba(0,0,0,0.3)]
            before:content-[""] before:absolute before:inset-0 before:bg-gradient-to-br 
            before:from-white/20 before:to-transparent before:rounded-xl
            overflow-hidden
          `}
                >
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image src={card || "/placeholder.svg"} alt="Character" fill className="object-cover p-2" />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
  
        {/* Result screen with enhanced design */}
        {gameState === "result" && (
          <Card className="p-8 mb-6 bg-black/80 text-white backdrop-blur-lg shadow-2xl animate-fade-in">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-bounce" />
            <h2 className="text-3xl font-bold mb-3 text-center text-orange-300">Game Over!</h2>
            <p className="text-2xl mb-4 text-center">
              Final Score: <span className="font-bold text-orange-400">{score}</span>
            </p>
            <p className="text-lg mb-6 text-center text-orange-200">
              You reached level {level} ({getDifficultyLabel()})
            </p>
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                onClick={restartGame}
              >
                Play Again
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
                onClick={shareScore}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </Card>
        )}
  
        {/* Game controls */}
        {gameState === "intro" && !showInstructions && (
          <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={startGame}>
            Start Game
          </Button>
        )}
      </div>
    )
  }
  