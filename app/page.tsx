import MemoryGame from '@/components/memory-game'
import { FlagIcon as Orange, Wine, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fce6d4]">
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Floating icons */}
        <div className="fixed w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] animate-float-slow">
            <Orange className="w-12 h-12 text-orange-400/50" />
          </div>
          <div className="absolute top-[15%] right-[15%] animate-float-medium">
            <Wine className="w-12 h-12 text-rose-400/50" />
          </div>
          <div className="absolute top-[20%] left-[50%] animate-float-fast">
            <TrendingUp className="w-12 h-12 text-yellow-400/50" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-orange-800 mb-4 animate-fade-in">
            Memory Match
          </h1>
          <p className="text-xl text-orange-700 mb-8 animate-fade-in-delay">
            Test your memory with this fun card matching game!
          </p>
          <MemoryGame />
        </div>
      </main>
    </div>
  )
}
