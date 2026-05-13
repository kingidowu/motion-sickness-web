import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Drop from './components/Drop'
import LadiesLine from './components/LadiesLine'
import OGMembers from './components/OGMembers'
import Story from './components/Story'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Inquiry from './components/Inquiry'
import SignupPopup from './components/SignupPopup'
import AdminPage from './components/AdminPage'
import AIStylist from './components/AIStylist'
import { supabase } from './lib/supabase'

function useVisitorTracking() {
  useEffect(() => {
    if (!supabase) return
    supabase.from('ms_visitors').insert({
      page: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).then(() => {})
  }, [])
}

export default function App() {
  const [inquiryItem, setInquiryItem] = useState(null)
  useVisitorTracking()

  if (window.location.pathname === '/admin') {
    return <AdminPage />
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav />
      <Hero />
      <Drop onInquire={setInquiryItem} />
      <LadiesLine onInquire={setInquiryItem} />
      <OGMembers onInquire={setInquiryItem} />
      <Story />
      <Contact />
      <Footer />
      {inquiryItem && (
        <Inquiry prefilled={inquiryItem} onClose={() => setInquiryItem(null)} />
      )}
      <SignupPopup />
      <AIStylist />
    </div>
  )
}
