import { useState } from 'react'
import { Header, MobileNav } from '../components/layout'
import { Button } from '../components/common'
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          ...formData
        }).toString()
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        throw new Error('Form submission failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Header title="Contact Us" showBack />

      <main id="main-content" className="pb-24">
        {/* Header */}
        <section className="bg-ocean-700 text-white py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Get in Touch
            </h1>
            <p className="text-ocean-200">
              Questions? Feedback? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-12 px-6 bg-sand-50">
          <div className="max-w-xl mx-auto">
            {/* Contact Info */}
            <div className="grid gap-4 mb-10">
              <a
                href="mailto:hello@shoreready.com"
                className="flex items-center gap-4 p-4 bg-white border border-sand-200 hover:border-ocean-300 transition-colors"
              >
                <div className="w-10 h-10 bg-ocean-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm text-warm-500">Email</p>
                  <p className="text-ocean-700 font-medium">hello@shoreready.com</p>
                </div>
              </a>

              <a
                href="tel:+18315551234"
                className="flex items-center gap-4 p-4 bg-white border border-sand-200 hover:border-ocean-300 transition-colors"
              >
                <div className="w-10 h-10 bg-ocean-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm text-warm-500">Phone</p>
                  <p className="text-ocean-700 font-medium">(831) 555-1234</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-white border border-sand-200">
                <div className="w-10 h-10 bg-ocean-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm text-warm-500">Service Area</p>
                  <p className="text-ocean-700 font-medium">Santa Cruz to Monterey, CA</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-sand-200 p-6">
              <h2 className="text-xl text-ocean-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Send a Message
              </h2>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-ocean-600" />
                  </div>
                  <h3 className="text-lg font-medium text-ocean-800 mb-2">Message Sent!</h3>
                  <p className="text-warm-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Hidden fields for Netlify */}
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don't fill this out: <input name="bot-field" />
                    </label>
                  </p>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-coral-50 border border-coral-200 text-coral-700 text-sm rounded">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ocean-800 mb-2">
                      Name <span className="text-coral-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ocean-800 mb-2">
                      Email <span className="text-coral-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-ocean-800 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-ocean-800 mb-2">
                      Message <span className="text-coral-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                    />
                  </div>

                  <Button type="submit" fullWidth loading={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </>
  )
}
