exports.handler = async (event, context) => {
  const suggestions = [
    "What beaches do you serve?",
    "Which package is best for families?",
    "What's included in the Couples Retreat?",
    "How far in advance should I book?",
    "What happens if it rains?",
    "Can I bring my dog?",
    "What's your cancellation policy?",
    "Recommend a beach for a romantic date",
    "Best beach for kids?",
    "Do you provide food and drinks?",
  ]

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suggestions }),
  }
}
