import { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Work from '../components/Work'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { Analytics } from "@vercel/analytics/react"

function Home() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (!isDark) {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <>
          <Analytics />
    <div className="min-h-screen">
      <Nav isDark={isDark} toggleTheme={toggleTheme} />
      <main className="border-x border-[var(--border-color)] md:max-w-[55vw] md:mx-auto">
        <Hero />
        <Work />
        <Contact />
      </main>
      <div className="md:max-w-[55vw] md:mx-auto">
        <Footer />
      </div>
    </div>
    </>
  )
}

export default Home
