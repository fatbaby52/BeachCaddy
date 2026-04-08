// Use relative URLs - Netlify redirects handle routing to functions
const API_BASE = ''

/**
 * Send a message to the AI Concierge
 * @param {Array} messages - Array of message objects { role: 'user'|'assistant', content: string }
 * @param {string} context - Optional additional context
 * @returns {Promise<{message: string, usage?: object}>}
 */
export async function sendMessage(messages, context = '') {
  const response = await fetch(`${API_BASE}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, context }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get AI response')
  }

  return response.json()
}

/**
 * Get suggested questions
 * @returns {Promise<{suggestions: string[]}>}
 */
export async function getSuggestions() {
  const response = await fetch(`${API_BASE}/api/ai/suggestions`)

  if (!response.ok) {
    // Return default suggestions if endpoint fails
    return {
      suggestions: [
        "What beaches do you serve?",
        "Which package is best for families?",
        "How far in advance should I book?",
        "What's your cancellation policy?",
      ]
    }
  }

  return response.json()
}

/**
 * Get beach recommendation
 * @param {string} groupType - 'couple' | 'family' | 'group' | 'solo'
 * @param {object} preferences - Optional preferences
 * @returns {Promise<{primary: string, reason: string, alternative: string}>}
 */
export async function getBeachRecommendation(groupType, preferences = {}) {
  const response = await fetch(`${API_BASE}/api/ai/recommend-beach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupType, preferences }),
  })

  if (!response.ok) {
    throw new Error('Failed to get recommendation')
  }

  return response.json()
}
