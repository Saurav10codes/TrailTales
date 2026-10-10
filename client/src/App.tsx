import { useState, useRef } from 'react'

const API_URL = 'http://localhost:3000/api/generate-podcast'

const loadingMessages = [
  '🔍 Researching local wildlife...',
  '🌿 Discovering native plants...',
  '🪨 Unearthing geological secrets...',
  '✍️ Writing your podcast script...',
  '🎙️ Recording audio...'
]

export default function App() {
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  const handleSubmit = async () => {
    if (!location.trim()) {
      setError('Please enter a location')
      return
    }

    setLoading(true)
    setError(null)
    setAudioUrl(null)
    setLoadingIndex(0)

    intervalRef.current = setInterval(() => {
      setLoadingIndex(prev => (prev + 1) % loadingMessages.length)
    }, 2000)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate podcast')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }

  return (
    <div className="min-h-screen bg-brutal-yellow p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white border-3 border-black shadow-brutal-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-black">
            🎧 Trail Tales
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            Discover nature's hidden stories near you
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              placeholder="Enter your park or neighborhood"
              className="w-full px-4 py-4 text-lg border-3 border-black shadow-brutal focus:outline-none focus:shadow-brutal-lg transition-shadow"
              disabled={loading}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-brutal-pink border-3 border-black shadow-brutal px-6 py-4 text-xl font-bold hover:shadow-brutal-lg hover:bg-brutal-orange active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Generating...' : '🎙️ Generate Podcast'}
            </button>
          </div>

          {loading && (
            <div className="mt-8 p-4 bg-brutal-blue border-3 border-black animate-brutal-pulse">
              <p className="text-xl font-bold text-center">
                {loadingMessages[loadingIndex]}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-400 border-3 border-black">
              <p className="text-lg font-bold">❌ {error}</p>
            </div>
          )}

          {audioUrl && (
            <div className="mt-8 p-4 bg-brutal-green border-3 border-black">
              <p className="text-lg font-bold mb-3">🎧 Your podcast is ready!</p>
              <audio
                controls
                className="w-full"
                src={audioUrl}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
