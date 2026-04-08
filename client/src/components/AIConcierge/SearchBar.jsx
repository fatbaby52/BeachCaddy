import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Search, Sparkles, Send, Loader2, X, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sendMessage, getSuggestions } from '../../services/aiConcierge'
import { cn } from '../../utils/helpers'

// AI Search Bar for homepage - expands into mini chat
const SearchBar = memo(function SearchBar({ className }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState(null)

  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Load suggestions
  useEffect(() => {
    getSuggestions().then(data => {
      setSuggestions(data.suggestions?.slice(0, 4) || [])
    }).catch(() => {
      setSuggestions([
        "What beaches do you serve?",
        "Best package for families?",
        "How does it work?",
      ])
    })
  }, [])

  // Click outside to collapse (only if no response)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !response) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [response])

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSubmit = useCallback(async (text = input) => {
    const query = text.trim()
    if (!query || isLoading) return

    setError(null)
    setIsLoading(true)
    setInput('')

    try {
      const result = await sendMessage([{ role: 'user', content: query }])
      setResponse({
        question: query,
        answer: result.message
      })
    } catch (err) {
      setError(err.message)
      setResponse({
        question: query,
        answer: err.message || "I'm having trouble right now. Try again or contact us at hello@shoreready.com."
      })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      if (response) {
        handleReset()
      } else {
        setIsExpanded(false)
      }
    }
  }, [handleSubmit, response])

  const handleReset = useCallback(() => {
    setResponse(null)
    setInput('')
    setError(null)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleSuggestionClick = useCallback((suggestion) => {
    setInput(suggestion)
    handleSubmit(suggestion)
  }, [handleSubmit])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full max-w-2xl mx-auto transition-all duration-300',
        className
      )}
    >
      {/* Search Input */}
      <div
        className={cn(
          'relative bg-white shadow-lg transition-all duration-300',
          isExpanded || response ? 'rounded-2xl' : 'rounded-full',
          response && 'rounded-b-none'
        )}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-shrink-0">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-ocean-500 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-ocean-500" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ask our AI Concierge anything..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-warm-800 placeholder:text-warm-400 focus:outline-none disabled:opacity-50"
          />
          {(input || response) && (
            <button
              onClick={response ? handleReset : () => setInput('')}
              className="p-1 hover:bg-sand-100 rounded-full transition-colors"
              aria-label="Clear"
            >
              <X className="w-4 h-4 text-warm-400" />
            </button>
          )}
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-ocean-600 text-white rounded-full hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {isExpanded && !response && !isLoading && suggestions.length > 0 && (
          <div className="px-5 pb-4 border-t border-sand-100">
            <p className="text-xs text-warm-500 mb-2 mt-3">Popular questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-sand-100 text-warm-700 text-sm rounded-full hover:bg-sand-200 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Response Panel */}
      {response && (
        <div className="bg-white rounded-b-2xl shadow-lg border-t border-sand-100 overflow-hidden">
          <div className="p-5">
            {/* Question */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-ocean-600 flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-ocean-800">{response.question}</p>
              </div>
            </div>

            {/* Answer */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sunset-400 to-coral-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-sm text-warm-700 whitespace-pre-wrap leading-relaxed">
                  {response.answer.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line.startsWith('- ') ? (
                        <span className="flex items-start gap-2">
                          <span className="text-ocean-500">•</span>
                          <span>{line.slice(2)}</span>
                        </span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-sand-100">
                  <button
                    onClick={handleReset}
                    className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
                  >
                    Ask another question
                  </button>
                  <span className="text-sand-300">|</span>
                  <Link
                    to="/book"
                    className="text-sm text-ocean-600 hover:text-ocean-700 font-medium inline-flex items-center gap-1"
                  >
                    Start Booking <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Powered by badge */}
      <div className="text-center mt-3">
        <span className="text-xs text-warm-400">
          Powered by AI • Instant answers about ShoreReady
        </span>
      </div>
    </div>
  )
})

export default SearchBar
