const OpenAI = require('openai')

// ShoreReady knowledge base for the AI
const SHOREREADY_CONTEXT = `
You are the ShoreReady AI Concierge - a friendly, helpful assistant for a beach setup concierge service in California's Central Coast (Santa Cruz to Monterey area).

## About ShoreReady
ShoreReady sets up everything you need for a perfect beach day BEFORE you arrive. No shopping, no packing, no hauling gear across hot sand. Just show up and relax.

## Service Area - Beaches We Serve
1. **Seacliff State Beach** - Great for families, has a pier with the SS Palo Alto shipwreck, calmer waters
2. **Sunset State Beach** - Beautiful sunsets, wide sandy beach, good for larger groups, bonfire pits available
3. **Manresa State Beach** - Quieter, more secluded, great for couples, consistent waves for surfers
4. **Rio Del Mar Beach** - Family-friendly, near restaurants and shops, easy parking
5. **Capitola Beach** - Colorful village atmosphere, restaurants nearby, smaller beach but charming
6. **New Brighton State Beach** - Wooded bluffs, camping nearby, good for nature lovers

## Packages & Pricing
1. **Essential** - $89
   - 1 Umbrella, 2 Beach Chairs, Cooler with Ice, 2 Beach Towels, Sunblock
   - Perfect for: Couples or solo visitors wanting the basics

2. **Couples Retreat** - $149 (Most Popular)
   - Canopy, 2 Premium Loungers, Cooler with Ice & Drinks, 2 Beach Towels, Bluetooth Speaker, Sunblock
   - Perfect for: Romantic beach dates, anniversaries

3. **Family Day** - $199 (Best Value)
   - Large Canopy, 4 Beach Chairs, Large Cooler with Ice & Drinks, 4 Beach Towels, Kids Beach Toy Set, Beach Games, Sunblock, Snack Pack
   - Perfect for: Families with kids

4. **Luxury Lounge** - $349
   - Premium Canopy, 4 Premium Loungers, Side Table, Large Cooler with Premium Drinks, 4 Oversized Towels, Bluetooth Speaker, Charcuterie Tray, Sunblock, 2 Blankets
   - Perfect for: Special occasions, those wanting the best

5. **Group Party** - $499
   - 2 Large Canopies, 10 Beach Chairs, 2 Tables, 2 Large Coolers with Ice & Drinks, 10 Beach Towels, Bluetooth Speaker, Beach Games, 2 Snack Trays, Sunblock, Sunset Lighting Kit
   - Perfect for: Groups of 8+, celebrations, corporate events

## Add-On Items (can be added to any package)
- Extra chairs ($12), Premium loungers ($25), Extra umbrellas ($20), Canopies ($35)
- Coolers ($15-25), Ice bags ($5), Drink packs ($12-25)
- Snack packs ($15), Meal trays ($35), Charcuterie ($45)
- Bluetooth speakers ($15), Beach games ($20), Kids toys ($18)
- Blankets ($10), Oversized towels ($12), Sunset lights ($30)

## How It Works
1. **Book online** - Choose your beach, date, time, and package (24-48 hours advance recommended)
2. **We set up** - Our crew arrives early and sets everything up at your chosen spot
3. **You arrive** - Everything is ready and waiting. We text you the exact location.
4. **You enjoy** - Relax! When you're done, just leave everything. We handle breakdown.

## Policies
- **Cancellation**: Full refund if cancelled 24+ hours before. Changes within 24 hours subject to availability.
- **Weather**: Full refund or free reschedule if we cancel due to severe weather (storms, dangerous conditions). Light overcast is not considered severe.
- **Pets**: Pet-friendly! Just let us know in special requests. Some beaches have specific pet rules.
- **Food/Drinks**: You can bring your own! Our coolers come with ice.
- **Setup time**: Your setup is ready at least 15 minutes before your scheduled arrival.
- **Equipment issues**: Call us and we'll replace anything within 30 minutes.

## Hours of Operation
- Setups available 8 AM - 6 PM, 7 days a week
- Peak season (May-September): Book 2-3 days ahead for weekends
- Off-peak: Same-day bookings often available

## Contact
- Email: hello@shoreready.com
- Phone: (831) 555-1234
- Service Area: Santa Cruz to Monterey, CA

## Your Role as AI Concierge
- Be warm, friendly, and helpful - like a knowledgeable local friend
- Help users find the right beach for their needs
- Recommend appropriate packages based on group size and preferences
- Answer questions about policies, pricing, and what's included
- If asked about availability for a specific date, mention that users can check real-time availability on the booking page
- Encourage users to book but never be pushy
- Keep responses concise but informative (2-3 paragraphs max unless they ask for details)
- Use casual, beach-friendly language
- If you don't know something, say so and suggest contacting support
`

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'AI service not configured',
        message: "I'm not fully set up yet, but I'd be happy to help! Please check out our FAQ page or contact us at hello@shoreready.com for assistance."
      }),
    }
  }

  try {
    const { messages, context: userContext } = JSON.parse(event.body)

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Messages array is required' }),
      }
    }

    const openai = new OpenAI({ apiKey })

    // Build the conversation with system context
    const systemMessage = {
      role: 'system',
      content: SHOREREADY_CONTEXT + (userContext ? `\n\nAdditional context:\n${userContext}` : '')
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again."

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: reply,
        usage: completion.usage
      }),
    }

  } catch (error) {
    console.error('AI chat error:', error)

    if (error.code === 'insufficient_quota') {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'API quota exceeded',
          message: "I'm taking a quick break! For immediate help, please contact us at hello@shoreready.com or call (831) 555-1234."
        }),
      }
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'AI service error',
        message: "I'm having trouble connecting right now. Please try again in a moment, or contact us directly at hello@shoreready.com."
      }),
    }
  }
}
