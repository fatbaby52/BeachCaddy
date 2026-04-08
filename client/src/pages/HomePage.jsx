import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Star, MapPin } from 'lucide-react'
import { Header, MobileNav } from '../components/layout'
import { Button } from '../components/common'
import { formatCurrency } from '../utils/helpers'

// Real beach images from Unsplash
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
  heroSecondary: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
  beachSetup: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  couples: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
  family: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
  luxury: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&q=80',
  testimonial: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
}

const featuredPackages = [
  {
    id: '1',
    name: 'Essential',
    price: 89,
    description: 'Umbrella, 2 chairs, cooler with ice, towels',
    image: IMAGES.beachSetup,
  },
  {
    id: '2',
    name: 'Couples Retreat',
    price: 149,
    tag: 'Popular',
    description: 'Premium loungers, canopy, speaker, drinks included',
    image: IMAGES.couples,
  },
  {
    id: '3',
    name: 'Family Day',
    price: 199,
    description: 'Large canopy, 4 chairs, games, snacks, toy set',
    image: IMAGES.family,
  },
]

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      <Header transparent />
      <main className="overflow-hidden">
        {/* Hero Section - Editorial Style */}
        <section className="relative min-h-[100svh] -mt-16">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={IMAGES.hero}
              alt="Beautiful sandy beach with crystal clear water"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 via-ocean-900/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-[100svh] flex flex-col justify-end px-6 pb-24 pt-32">
            <div className="max-w-2xl">
              <p
                className={`eyebrow text-sand-200 mb-4 opacity-0 ${loaded ? 'animate-fade-in-up' : ''}`}
              >
                Beach Concierge Service
              </p>

              <h1
                className={`display-xl text-white mb-6 opacity-0 ${loaded ? 'animate-fade-in-up delay-100' : ''}`}
              >
                Your beach day,
                <br />
                <span className="text-sunset-300">effortlessly perfect</span>
              </h1>

              <p
                className={`text-xl text-sand-100 mb-10 max-w-md leading-relaxed opacity-0 ${loaded ? 'animate-fade-in-up delay-200' : ''}`}
              >
                We set up everything before you arrive. Umbrellas, chairs, coolers, snacks—just show up and relax.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 opacity-0 ${loaded ? 'animate-fade-in-up delay-300' : ''}`}
              >
                <Link to="/book">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-ocean-800 hover:bg-sand-100">
                    Book Your Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/packages" className="btn-ghost text-white hover:text-sand-200">
                  View Packages
                </Link>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-3 bg-white/60 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Value Prop - Simple, Not Carded */}
        <section className="py-20 md:py-32 px-6 bg-sand-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="eyebrow text-ocean-600 mb-4">How It Works</p>
                <h2 className="display-lg text-ocean-800 mb-8">
                  Skip the hassle.
                  <br />
                  Keep the memories.
                </h2>
                <div className="divider mb-8" />

                <div className="space-y-8">
                  {[
                    { num: '01', title: 'Choose your beach & time', desc: 'We serve the best spots on the coast' },
                    { num: '02', title: 'Pick your setup', desc: 'From basic essentials to full luxury' },
                    { num: '03', title: 'Show up and chill', desc: "Everything's ready when you arrive" },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <span className="text-4xl font-light text-sand-300">{step.num}</span>
                      <div>
                        <h3 className="text-lg font-medium text-ocean-800 mb-1">{step.title}</h3>
                        <p className="text-warm-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <img
                  src={IMAGES.heroSecondary}
                  alt="Beach setup with umbrella and chairs"
                  className="w-full aspect-[4/5] object-cover"
                />
                {/* Stats overlay */}
                <div className="absolute -bottom-8 -left-4 md:-left-8 bg-white p-6 shadow-dramatic">
                  <p className="text-5xl font-light text-ocean-700 mb-1">2.5h</p>
                  <p className="text-sm text-warm-600">Average time saved<br />per beach trip</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Packages - Editorial Grid */}
        <section className="py-20 md:py-32 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <p className="eyebrow text-coral-500 mb-4">Packages</p>
                <h2 className="display-lg text-ocean-800">
                  Find your perfect
                  <br />
                  beach setup
                </h2>
              </div>
              <Link
                to="/packages"
                className="mt-6 md:mt-0 text-ocean-600 font-medium flex items-center gap-2 hover:gap-3 transition-all"
              >
                View all packages
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredPackages.map((pkg, i) => (
                <Link
                  key={pkg.id}
                  to="/packages"
                  className={`group block opacity-0 ${loaded ? 'animate-fade-in-up' : ''}`}
                  style={{ animationDelay: `${400 + i * 100}ms` }}
                >
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {pkg.tag && (
                      <span className="absolute top-4 left-4 badge badge-coral">
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-medium text-ocean-800 group-hover:text-ocean-600 transition-colors">
                      {pkg.name}
                    </h3>
                    <span className="text-xl font-medium text-ocean-600">
                      {formatCurrency(pkg.price)}
                    </span>
                  </div>
                  <p className="text-warm-600 text-sm">{pkg.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial - Full Width */}
        <section className="py-20 md:py-32 px-6 bg-ocean-800">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-sunset-400 text-sunset-400" />
              ))}
            </div>

            <blockquote className="text-3xl md:text-4xl text-white font-light leading-snug mb-10" style={{ fontFamily: 'var(--font-display)' }}>
              "We arrived to find everything set up perfectly. The kids ran straight to the water while we relaxed under the canopy. Best beach day we've ever had."
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <img
                src={IMAGES.testimonial}
                alt="Sarah M."
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-white font-medium">Sarah Mitchell</p>
                <p className="text-ocean-300 text-sm">Monterey, CA</p>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Preview */}
        <section className="py-20 md:py-32 px-6 bg-sand-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="eyebrow text-ocean-600 mb-4">Locations</p>
              <h2 className="display-lg text-ocean-800 mb-4">
                Serving California's finest beaches
              </h2>
              <p className="text-warm-600 max-w-lg mx-auto">
                From Santa Cruz to Monterey, we know the best spots—and we'll make sure you get the perfect setup.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {['Seacliff State Beach', 'Sunset State Beach', 'Manresa State Beach', 'Rio Del Mar', 'Capitola'].map((beach) => (
                <div
                  key={beach}
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-sand-200 text-warm-700 text-sm"
                >
                  <MapPin className="w-4 h-4 text-ocean-500" />
                  {beach}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-32 px-6">
          <div className="absolute inset-0">
            <img
              src={IMAGES.luxury}
              alt="Sunset beach scene"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-ocean-900/70" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="display-lg text-white mb-6">
              Ready for your
              <br />
              perfect beach day?
            </h2>
            <p className="text-xl text-sand-200 mb-10">
              Book now and let us handle everything.
            </p>
            <Link to="/book">
              <Button size="lg" className="bg-white text-ocean-800 hover:bg-sand-100">
                Book Your Setup
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer - Minimal */}
        <footer className="py-12 px-6 bg-ocean-900 text-ocean-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  ShoreReady
                </h3>
                <p className="text-sm">Beach setups made effortless</p>
              </div>

              <div className="flex gap-8 text-sm">
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-ocean-800 text-sm">
              <p>&copy; {new Date().getFullYear()} ShoreReady. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      <MobileNav />
    </>
  )
}
