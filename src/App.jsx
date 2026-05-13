import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Drop from './components/Drop'
import OGMembers from './components/OGMembers'
import Story from './components/Story'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Inquiry from './components/Inquiry'

export default function App() {
  const [inquiryItem, setInquiryItem] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav />
      <Hero />
      <Drop onInquire={setInquiryItem} />
      <OGMembers onInquire={setInquiryItem} />
      <Story />
      <Contact />
      <Footer />
      {inquiryItem && (
        <Inquiry prefilled={inquiryItem} onClose={() => setInquiryItem(null)} />
      )}
    </div>
  )
}
