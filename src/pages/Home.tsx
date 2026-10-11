import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { MenuSection } from '../components/MenuSection'
import { Gallery } from '../components/Gallery'
import { PartySection } from '../components/PartySection'
import { Reviews } from '../components/Reviews'
import { Notices } from '../components/Notices'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { CartDrawer } from '../components/CartDrawer'
import { Notifications } from '../components/Notifications'
import { Chatbot } from '../components/Chatbot'
import { PWAInstall } from '../components/PWAInstall'

export function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Navbar onOpenCart={() => setCartOpen(true)} onOpenNotif={() => setNotifOpen(true)} />
      <main>
        <Hero />
        <MenuSection />
        <Gallery />
        <PartySection />
        <Notices />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenNotif={() => {
          setCartOpen(false)
          setNotifOpen(true)
        }}
      />
      <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} />
      <Chatbot />
      <PWAInstall />
    </div>
  )
}
