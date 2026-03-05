import { useState, useEffect } from 'react'

export default function Hero() {
  const [timeDiff, setTimeDiff] = useState('')
  const [bdTime, setBdTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      setBdTime(now.toLocaleTimeString('en-GB', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'Asia/Dhaka'
      }))

      const localOffset = now.getTimezoneOffset() * 60 * 1000
      const bdOffset = 6 * 60 * 60 * 1000
      const diffMs = bdOffset + localOffset
      const diffHours = diffMs / (1000 * 60 * 60)
      const absDiff = Math.abs(diffHours)
      const sign = diffHours >= 0 ? '+' : '-'
      setTimeDiff(`${sign}${absDiff}h from your time`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex flex-col relative border-b border-[var(--border-color)] pt-14 pb-16 md:pb-20">
      <div className="flex-1 flex flex-col px-4 md:px-8">
        <div className="flex-[1] flex items-start justify-start pt-16 md:pt-24 w-full ">
          <div className="text-left max-w-md">
            <h1 className="text-[5.5rem] pt-16 md:text-[8rem] lg:text-[7rem] font-bold leading-[0.85] tracking-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              Hi I do<br />motion different
            </h1>
            <p className="mt-4 md:mt-6 text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
             Motion design that goes viral and looks amazing.
            </p>
          </div>
        </div>
        <div className="flex justify-center pb-8 md:pb-12">
          <a
            href="#work"
            className="flex items-center justify-center w-16 h-16 border border-[var(--border-color)] hover:border-[var(--border-light)] transition-colors"
            aria-label="Scroll to work"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="flex flex-col items-end px-4 md:px-8 pb-6 md:pb-8 gap-3 mt-auto">
        <div className="text-sm md:text-base text-[var(--text-muted)]">
          <span className="font-mono">{bdTime}</span>
          <span className="ml-1 text-xs">{timeDiff}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
          <a
            href="#contact"
            className="w-full md:w-auto flex items-center justify-center px-5 py-4 md:px-8 md:py-4 border border-[var(--border-color)] hover:border-[var(--border-light)] transition-colors text-sm font-semibold"
          >
            Get in touch
          </a>
          <a
            href="https://twitter.com/madebymattr_"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto flex items-center justify-center px-5 py-4 md:px-8 md:py-4 border border-[var(--border-color)] hover:border-[var(--border-light)] transition-colors text-sm font-semibold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="ml-2">Twitter</span>
          </a>
        </div>
      </div>
    </section>
  )
}
