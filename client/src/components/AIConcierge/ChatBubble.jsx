import { useState, useEffect, useCallback, memo } from 'react'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import AIConcierge from './AIConcierge'
import { cn } from '../../utils/helpers'

// Floating chat bubble that appears sitewide
const ChatBubble = memo(function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showPulse, setShowPulse] = useState(true)

  // Stop pulse animation after first interaction
  useEffect(() => {
    if (hasInteracted) {
      setShowPulse(false)
    }
  }, [hasInteracted])

  // Auto-hide pulse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setHasInteracted(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-24 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden',
          'transition-all duration-300 transform origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        <AIConcierge
          isOpen={isOpen}
          onClose={handleClose}
          compact={false}
        />
      </div>

      {/* Floating Button */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={cn(
          'fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-lg',
          'flex items-center justify-center transition-all duration-300',
          'hover:scale-110 active:scale-95',
          isOpen
            ? 'bg-warm-600 text-white rotate-0'
            : 'bg-gradient-to-br from-ocean-600 to-ocean-700 text-white'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open AI Concierge'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            {/* Pulse animation */}
            {showPulse && (
              <span className="absolute inset-0 rounded-full bg-ocean-500 animate-ping opacity-30" />
            )}
          </>
        )}
      </button>

      {/* Tooltip when closed */}
      {!isOpen && !hasInteracted && (
        <div className="fixed bottom-[7.5rem] right-20 z-50 animate-fade-in">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-warm-700 whitespace-nowrap">
            <span className="font-medium">Need help?</span> Ask our AI Concierge!
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 shadow-lg" />
          </div>
        </div>
      )}
    </>
  )
})

export default ChatBubble
