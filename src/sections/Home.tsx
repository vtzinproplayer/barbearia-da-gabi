import { About } from './About'
import { CtaBand } from './CtaBand'
import { FaqSection } from './FaqSection'
import { Gallery } from './Gallery'
import { Hero } from './Hero'
import { Services } from './Services'
import { Testimonials } from './Testimonials'
import { Ticker } from './Ticker'

export function Home() {
  return (
    <main>
      <Hero />
      <Ticker />
      <Services />
      <About />
      <Gallery />
      <Testimonials />
      <FaqSection />
      <CtaBand />
    </main>
  )
}
