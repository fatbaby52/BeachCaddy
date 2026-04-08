import { useState } from 'react'
import { Header, MobileNav } from '../components/layout'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../utils/helpers'

const faqs = [
  {
    category: 'Booking & Reservations',
    questions: [
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 24-48 hours in advance, especially for weekends and holidays. Same-day bookings may be available depending on capacity.'
      },
      {
        q: 'Can I modify or cancel my reservation?',
        a: 'Yes! You can modify or cancel your booking up to 24 hours before your scheduled arrival time for a full refund. Changes within 24 hours may be subject to availability.'
      },
      {
        q: 'What beaches do you serve?',
        a: 'We currently serve beaches from Santa Cruz to Monterey, including Seacliff State Beach, Sunset State Beach, Manresa State Beach, Rio Del Mar, Capitola, and New Brighton State Beach.'
      },
    ]
  },
  {
    category: 'Setup & Equipment',
    questions: [
      {
        q: 'What time will my setup be ready?',
        a: 'Your beach setup will be ready and waiting at least 15 minutes before your scheduled arrival time. We'll send you the exact location via text message.'
      },
      {
        q: 'What's included in the packages?',
        a: 'Each package includes different items—check the package details for specifics. Generally, our Essential package includes an umbrella, chairs, cooler with ice, towels, and sunblock. Premium packages add canopies, loungers, speakers, and more.'
      },
      {
        q: 'What if something is damaged or not working?',
        a: 'Just call us! We'll replace any equipment issues within 30 minutes. Our team is always nearby to help.'
      },
      {
        q: 'Do I need to pack up at the end?',
        a: 'Nope! Just leave everything where it is when you're done. Our crew will handle all the breakdown and cleanup—that's the whole point!'
      },
    ]
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        q: 'When am I charged?',
        a: 'Your card is charged when you complete your booking. We accept all major credit cards.'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No hidden fees! The price you see includes all taxes and service fees. What you see is what you pay.'
      },
      {
        q: 'Do you offer group discounts?',
        a: 'Yes! Our Group Party package is designed for groups of 8+ and offers the best value. Contact us for custom quotes for larger events.'
      },
    ]
  },
  {
    category: 'Weather & Policies',
    questions: [
      {
        q: 'What happens if the weather is bad?',
        a: 'If we need to cancel due to severe weather (storms, dangerous conditions), you'll receive a full refund or can reschedule for free. Light overcast or typical beach weather is not considered severe.'
      },
      {
        q: 'What's your pet policy?',
        a: 'We're pet-friendly! Just let us know in the special requests if you're bringing a furry friend. Note that some beaches have specific pet rules.'
      },
      {
        q: 'Can I bring my own food and drinks?',
        a: 'Absolutely! Our coolers come stocked with ice, but you're welcome to bring your own food and beverages. We also offer add-on snack packs and drink packages.'
      },
    ]
  },
]

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-sand-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-ocean-800 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-ocean-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-warm-400 flex-shrink-0" />
        )}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <p className="text-warm-600">{answer}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <>
      <Header title="FAQ" showBack />

      <main id="main-content" className="pb-24">
        {/* Header */}
        <section className="bg-ocean-700 text-white py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-ocean-200">
              Everything you need to know about ShoreReady
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-8 px-6 bg-sand-50">
          <div className="max-w-2xl mx-auto space-y-8">
            {faqs.map((section, i) => (
              <div key={i} className="bg-white border border-sand-200 p-6">
                <h2 className="text-lg text-ocean-800 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {section.category}
                </h2>
                <div>
                  {section.questions.map((faq, j) => (
                    <FAQItem key={j} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl text-ocean-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Still have questions?
            </h2>
            <p className="text-warm-600 mb-6">
              We're here to help! Reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@shoreready.com"
                className="btn-primary"
              >
                Email Us
              </a>
              <a
                href="tel:+18315551234"
                className="btn-outline"
              >
                Call (831) 555-1234
              </a>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </>
  )
}
