import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Umbrella, PlusCircle, Glasses, ChevronRight, Star, ArrowDown } from 'lucide-react'
import { Header, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, CardImage, CardBody, Badge } from '../components/common'
import { formatCurrency } from '../utils/helpers'

// Sample packages for the preview (will be fetched from API)
const samplePackages = [
  {
    id: '1',
    name: 'Basic Beach Day',
    price: 89,
    tag: null,
    description: 'Everything you need for a simple, perfect beach day.',
    imageUrl: null,
  },
  {
    id: '2',
    name: 'Couples Relaxation',
    price: 149,
    tag: 'Most Popular',
    description: 'Premium comfort for two with all the extras.',
    imageUrl: null,
  },
  {
    id: '3',
    name: 'Family Fun',
    price: 199,
    tag: 'Best Value',
    description: 'Room for the whole family plus games and snacks.',
    imageUrl: null,
  },
]

const steps = [
  { icon: MapPin, title: 'Pick Your Beach', description: 'Choose from our partner locations' },
  { icon: Umbrella, title: 'Choose Your Package', description: 'Select the perfect setup' },
  { icon: PlusCircle, title: 'Add Your Extras', description: 'Customize with add-ons' },
  { icon: Glasses, title: 'Show Up & Chill', description: 'We handle the rest' },
]

export default function HomePage() {
  const [meterAnimated, setMeterAnimated] = useState(false)
  const meterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMeterAnimated(true)
        }
      },
      { threshold: 0.5 }
    )

    if (meterRef.current) {
      observer.observe(meterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header transparent />
      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden -mt-16">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-400 via-ocean-300 to-sunset-400" />

          {/* Wave Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
              <path
                fill="white"
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight">
              Your Perfect Beach Day, Set Up and Waiting
            </h1>
            <p className="text-xl text-white/90 mb-8">
              We bring everything. You bring the good vibes.
            </p>
            <Link to="/book">
              <Button size="lg" className="shadow-lg bg-white text-ocean-500 hover:bg-sand-50">
                Book Your Beach Setup
              </Button>
            </Link>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
              <ArrowDown className="w-6 h-6 text-white/80" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-sand-50">
          <div className="max-w-lg mx-auto">
            <h2 className="font-display text-3xl text-ocean-700 text-center mb-10">
              How It Works
            </h2>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
              <div className="flex gap-4 min-w-max md:grid md:grid-cols-4 md:min-w-0">
                {steps.map(({ icon: Icon, title, description }, index) => (
                  <div
                    key={title}
                    className="flex flex-col items-center text-center w-40 md:w-auto flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-ocean-500" />
                    </div>
                    <div className="text-sm font-semibold text-ocean-300 mb-1">
                      Step {index + 1}
                    </div>
                    <h3 className="font-display text-lg text-ocean-700 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stress-Free Meter */}
        <section ref={meterRef} className="py-16 px-4">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="font-display text-3xl text-ocean-700 mb-8">
              The Stress-Free Meter
            </h2>

            {/* Animated Gauge */}
            <div className="relative w-64 h-32 mx-auto mb-8">
              <svg viewBox="0 0 200 100" className="w-full">
                {/* Background arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#FDECD3"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Gradient arc */}
                <defs>
                  <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E76F51" />
                    <stop offset="50%" stopColor="#F4A261" />
                    <stop offset="100%" stopColor="#219EBC" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#meterGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={meterAnimated ? '0' : '251'}
                  style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                />
                {/* Labels */}
                <text x="25" y="95" className="text-xs fill-coral-500 font-medium">
                  Stressed
                </text>
                <text x="135" y="95" className="text-xs fill-ocean-500 font-medium">
                  Stress Free
                </text>
              </svg>

              {/* Needle */}
              <div
                className="absolute left-1/2 bottom-0 w-1 h-20 bg-ocean-700 rounded-full origin-bottom"
                style={{
                  transform: `translateX(-50%) rotate(${meterAnimated ? '45deg' : '-45deg'})`,
                  transition: 'transform 2s ease-out',
                }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-ocean-700 rounded-full" />
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-2">
              Average time saved: <strong className="text-ocean-600">2.5 hours</strong>
            </p>
            <p className="text-sm text-gray-500">
              of shopping, loading, hauling, and setting up
            </p>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="py-16 px-4 bg-sand-50">
          <div className="max-w-lg mx-auto">
            <h2 className="font-display text-3xl text-ocean-700 text-center mb-8">
              Featured Packages
            </h2>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
              <div className="flex gap-4 min-w-max">
                {samplePackages.map((pkg) => (
                  <Card key={pkg.id} elevated className="w-72 flex-shrink-0">
                    <CardImage
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="h-40"
                    />
                    <CardBody>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-xl text-ocean-700">{pkg.name}</h3>
                        {pkg.tag && (
                          <Badge variant={pkg.tag === 'Most Popular' ? 'coral' : 'ocean'}>
                            {pkg.tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-ocean-600">
                          {formatCurrency(pkg.price)}
                        </span>
                        <Link to="/packages">
                          <Button size="sm">View Package</Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Buttons */}
        <section className="py-12 px-4">
          <div className="max-w-lg mx-auto space-y-4">
            <Link to="/book" className="block">
              <Button fullWidth size="lg" rightIcon={<ChevronRight className="w-5 h-5" />}>
                Book Your Beach Setup
              </Button>
            </Link>
            <Link to="/packages" className="block">
              <Button fullWidth size="lg" variant="secondary" rightIcon={<ChevronRight className="w-5 h-5" />}>
                Browse Packages
              </Button>
            </Link>
            <Link to="/add-ons" className="block">
              <Button fullWidth size="lg" variant="coral" rightIcon={<ChevronRight className="w-5 h-5" />}>
                View Add-Ons
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 px-4 bg-ocean-50">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-sunset-400 text-sunset-400" />
              ))}
            </div>
            <blockquote className="font-display text-2xl text-ocean-700 italic mb-4">
              "Best beach day ever. We just showed up and everything was perfect."
            </blockquote>
            <p className="text-gray-600">— Sarah M., Monterey</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-ocean-700 text-white">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="font-display text-2xl mb-4">ShoreReady</h3>
            <p className="text-ocean-200 mb-6">Beach setups made effortless</p>
            <div className="flex justify-center gap-6 text-sm text-ocean-200">
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
            <p className="text-ocean-300 text-sm mt-8">
              © 2024 ShoreReady. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
      <MobileNav />
    </>
  )
}
