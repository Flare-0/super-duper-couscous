const whatsappNumber = '+8801407096332'

export default function Contact() {
  return (
    <section id="contact" className="border-b border-[var(--border-color)]">
      <div className="px-4 md:px-8 py-16 md:py-32">
        <div className="max-w-lg text-left">

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 md:mb-6" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Let's make<br />something <span className="bg-gradient-to-r from-[#FBBFFF] to-[#2B75FF] bg-clip-text text-transparent">move</span>
          </h2>

          <p className="text-base md:text-xl text-[var(--text-secondary)] mb-8 md:mb-10 leading-relaxed">
            Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your vision to life through motion.
          </p>
          <a href="mailto:hello@mattr.art" className="md:text-6xl text-4xl  font-bold undl">
            hello@mattr.art
          </a>
        </div>
      </div>
    </section>
  )
}
