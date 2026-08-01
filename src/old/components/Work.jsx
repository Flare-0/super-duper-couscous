const videoIds = [
 { id: 'VsA7BLwt2nc' ,title:"Wispr flow"},
 { id: 'OAlPSMHKW1k' ,title:"Nsave financials"},
 { id: 'aEQksI1hAM8' ,title:"Stripe"}
]

export default function Work() {
  return (
    <section id="work" className="border-b border-[var(--border-color)]">
      <div className="px-4 md:px-8 py-6 md:py-8 border-b border-[var(--border-color)]">
        <h2 className="text-xl md:text-3xl font-bold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Selected Work</h2>
      </div>
      <div className="grid">
        {videoIds.map((videoId, index) => (
          <div
            key={index}
            className="border-b border-[var(--border-color)] last:border-b-0"
          >
            <div className="px-4 md:px-8 py-4 md:py-6">
              <div className="aspect-video w-full bg-[var(--bg-secondary)]">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId.id}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId.id}&modestbranding=1&showinfo=0`}
                  title={`Project ${index + 1}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm md:text-base font-semibold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{videoId.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">Motion Design</p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">2026</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
