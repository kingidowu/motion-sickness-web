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
import Checkout from './components/Checkout'
import SignupPopup from './components/SignupPopup'
import AdminPage from './components/AdminPage'
import AIStylist from './components/AIStylist'
import IntellectualProperty from './components/IntellectualProperty'
import TermsOfService from './components/TermsOfService'
import PolicyPage from './components/PolicyPage'
import MemberAuth from './components/MemberAuth'
import MemberProfile from './components/MemberProfile'
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

  if (window.location.pathname === '/admin') return <AdminPage />
  if (window.location.pathname === '/intellectual-property') return <IntellectualProperty />
  if (window.location.pathname === '/terms') return <TermsOfService />
  if (window.location.pathname === '/login' || window.location.pathname === '/signup') return <MemberAuth />
  if (window.location.pathname === '/profile') return <MemberProfile />
  const policyPaths = ['/shipping-policy', '/refund-policy', '/privacy-policy', '/size-guide']
  if (policyPaths.includes(window.location.pathname)) {
    return <PolicyPage path={window.location.pathname} />
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
        <Checkout item={inquiryItem} onClose={() => setInquiryItem(null)} />
      )}
      <SignupPopup />
      <AIStylist />
    </div>
  )
}
