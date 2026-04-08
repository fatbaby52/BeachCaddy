import { Header, MobileNav } from '../components/layout'
import { MapPin, Users, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header title="About Us" showBack />

      <main id="main-content" className="pb-24">
        {/* Hero */}
        <section className="bg-ocean-700 text-white py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Beach days, made effortless
            </h1>
            <p className="text-ocean-200 text-lg">
              We believe everyone deserves a perfect beach day without the hassle.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-6 bg-sand-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl text-ocean-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Our Story
            </h2>
            <div className="space-y-4 text-warm-700">
              <p>
                ShoreReady started with a simple observation: people love the beach, but hate the prep.
                Loading the car, hauling gear across hot sand, setting everything up—by the time you're
                ready to relax, you're already exhausted.
              </p>
              <p>
                We thought there had to be a better way. What if you could just show up and everything
                was already perfect? That's exactly what we built.
              </p>
              <p>
                Today, we help hundreds of families, couples, and groups have the beach day of their
                dreams—no shopping, no packing, no setup required.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl text-ocean-800 mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              What We Stand For
            </h2>
            <div className="space-y-8">
              {[
                {
                  icon: Heart,
                  title: 'Quality Over Quantity',
                  description: 'We use premium equipment and take pride in every setup. Your beach day deserves the best.'
                },
                {
                  icon: MapPin,
                  title: 'Local Expertise',
                  description: 'We know every beach on the coast—the best spots, the hidden gems, and where to catch the sunset.'
                },
                {
                  icon: Users,
                  title: 'People First',
                  description: "Our team genuinely cares about making your day special. It's not just a job, it's our passion."
                },
              ].map((value, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-ocean-50 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-ocean-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ocean-800 mb-1">{value.title}</h3>
                    <p className="text-warm-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beaches */}
        <section className="py-16 px-6 bg-sand-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl text-ocean-800 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Proudly Serving
            </h2>
            <p className="text-warm-600 mb-8">
              California's Central Coast beaches
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Seacliff State Beach', 'Sunset State Beach', 'Manresa State Beach', 'Rio Del Mar', 'Capitola', 'New Brighton'].map((beach) => (
                <span key={beach} className="px-4 py-2 bg-white border border-sand-200 text-warm-700 text-sm">
                  {beach}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </>
  )
}
