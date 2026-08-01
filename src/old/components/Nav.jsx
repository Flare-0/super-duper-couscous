export default function Nav({ isDark, toggleTheme }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 md:h-14">
        <div className="flex items-center gap-3 md:gap-3">
          <img 
            src="/mattr.svg" 
            alt="Mattr" 
            className="w-10 h-10 md:w-8 md:h-8"
          />
          <span className="text-xl md:text-lg font-bold tracking-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Mattr</span>
        </div>
        <div className="flex items-center gap-3 md:gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 md:w-9 md:h-9 flex items-center justify-center border border-[var(--border-color)] hover:border-[var(--border-light)] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <a
            href="#contact"
            className="px-5 py-2.5 md:px-4 md:py-2 border border-[var(--border-color)] hover:border-[var(--border-light)] transition-colors text-sm"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}
