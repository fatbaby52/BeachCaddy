import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Send, Loader2, Sparkles, User, X, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sendMessage, getSuggestions } from '../../services/aiConcierge'
import { cn } from '../../utils/helpers'

// Message bubble component
const MessageBubble = memo(function MessageBubble({ message, isUser }) {
  return (
    <div className={cn('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : '')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-ocean-600' : 'bg-gradient-to-br from-sunset-400 to-coral-500'
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      <div className={cn(
        'max-w-[80%] px-4 py-3 text-sm',
        isUser
          ? 'bg-ocean-600 text-white rounded-2xl rounded-tr-sm'
          : 'bg-white border border-sand-200 text-warm-800 rounded-2xl rounded-tl-sm shadow-sm'
      )}>
        {/* Render message with basic formatting */}
        <div className="whitespace-pre-wrap">
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {line.startsWith('- ') ? (
                <span className="flex items-start gap-2">
                  <span className="text-ocean-500 mt-1">•</span>
                  <span>{line.slice(2)}</span>
                </span>
              ) : line.startsWith('**') && line.endsWith('**') ? (
                <strong className="text-ocean-700">{line.slice(2, -2)}</strong>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
})

// Quick action buttons
const QuickActions = memo(function QuickActions({ onAction }) {
  const actions = [
    { label: 'Book Now', icon: Calendar, path: '/book' },
    { label: 'View Beaches', icon: MapPin, path: '/book' },
  ]

  return (
    <div className="flex gap-2 mt-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.path}
          onClick={() => onAction?.()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ocean-50 text-ocean-700 text-xs font-medium rounded-full hover:bg-ocean-100 transition-colors"
        >
          <action.icon className="w-3 h-3" />
          {action.label}
        </Link>
      ))}
    </div>
  )
})

// Suggestion chips
const SuggestionChips = memo(function SuggestionChips({ suggestions, onSelect, disabled }) {
  if (!suggestions.length) return null

  return (
    <div className="mb-4">
      <p className="text-xs text-warm-500 mb-2">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.slice(0, 4).map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="px-3 py-1.5 bg-sand-100 text-warm-700 text-xs rounded-full hover:bg-sand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
})

// Typing indicator
const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sunset-400 to-coral-500 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-sand-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
})

// Main AIConcierge component
export default function AIConcierge({
  isOpen = true,
  onClose,
  compact = false,
  showHeader = true,
  initialMessage = "Hi! I'm your ShoreReady AI Concierge. I can help you find the perfect beach, recommend packages, answer questions about our service, and more. What can I help you with today?",
  placeholder = "Ask me anything about beach setups...",
}) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialMessage }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Load suggestions on mount
  useEffect(() => {
    getSuggestions().then(data => {
      setSuggestions(data.suggestions || [])
    }).catch(() => {
      // Use defaults if fetch fails
      setSuggestions([
        "What beaches do you serve?",
        "Which package is best for families?",
        "How does the service work?",
        "What's your cancellation policy?",
      ])
    })
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = useCallback(async (messageText = input) => {
    const text = messageText.trim()
    if (!text || isLoading) return

    setError(null)
    setInput('')

    // Add user message
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send to API (exclude initial greeting from context)
      const apiMessages = [...messages.slice(1), userMessage].map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await sendMessage(apiMessages)

      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }])
    } catch (err) {
      console.error('AI Concierge error:', err)
      setError(err.message)
      // Add error message from AI
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.message || "I'm having trouble connecting right now. Please try again or contact us at hello@shoreready.com."
      }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleSuggestionSelect = useCallback((suggestion) => {
    handleSend(suggestion)
  }, [handleSend])

  if (!isOpen) return null

  return (
    <div className={cn(
      'flex flex-col bg-sand-50',
      compact ? 'h-full' : 'h-[500px] max-h-[80vh]'
    )}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-ocean-700 to-ocean-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium">AI Concierge</h3>
              <p className="text-xs text-ocean-200">Ask me anything</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} isUser={message.role === 'user'} />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Quick actions after AI responses */}
        {messages.length > 1 && messages[messages.length - 1].role === 'assistant' && !isLoading && (
          <QuickActions onAction={onClose} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4">
          <SuggestionChips
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-sand-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-sand-50 border border-sand-200 rounded-full text-sm focus:outline-none focus:border-ocean-500 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-ocean-600 text-white rounded-full flex items-center justify-center hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
