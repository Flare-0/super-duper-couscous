import { useRef, useEffect } from 'react'

const ParticleDither = ({
  palette = ['#2B75FF', '#FABEFF', '#ffffff'],
  particleCount = 40000,
  speed = 0.3,
  mouseStrength = 6,
  mouseRadius = 120,
  particleSize = 3,
  springStrength = 0,
  damping = 0.92,
}) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: -999, y: -999 })
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId

    const parsedColors = palette.map(hex => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ])
    const nColors = parsedColors.length

    const bayer4 = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ]

    function initParticles(W, H) {
      const aspect = W / H
      const cols = Math.ceil(Math.sqrt(particleCount * aspect))
      const rows = Math.ceil(particleCount / cols)
      const arr = []
      for (let i = 0; i < particleCount; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        const nx = (col + 0.5) / cols
        const ny = (row + 0.5) / rows
        if (nx > 1 || ny > 1) continue
        arr.push({
          x: nx * W, y: ny * H,
          vx: 0, vy: 0,
          nx, ny,
        })
      }
      return arr
    }

    particlesRef.current = initParticles(window.innerWidth, window.innerHeight)

    function waveValue(nx, ny, mx, my, t) {
      let value = 0
      for (let w = 0; w < 3; w++) {
        const freq = 0.002 + w * 0.001
        const amp = 0.12 - w * 0.02
        const phase = w * 2.1
        const dx = nx - mx
        const dy = ny - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        value += Math.sin(
          nx * 1200 * freq + ny * 900 * freq + dist * 600 * freq + t + phase
        ) * amp
      }
      return (value / (0.1 * 3)) * 0.5 + 0.5
    }

    function getColorIndex(value) {
      const v = Math.max(0, Math.min(1, value))
      const scaled = v * (nColors - 1)
      const idx = Math.floor(scaled)
      const frac = scaled - idx
      const bx = Math.floor((idx * 137) % 4)
      const by = Math.floor((idx * 251) % 4)
      const threshold = bayer4[by][bx] / 16
      return frac > threshold
        ? Math.min(idx + 1, nColors - 1)
        : Math.max(idx, 0)
    }

    const draw = () => {
      timeRef.current += speed * 0.016

      const W = window.innerWidth
      const H = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = W * dpr
      canvas.height = H * dpr

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x: mx, y: my } = mouseRef.current
      const mxPx = mx * W
      const myPx = my * H
      const ps = Math.max(1, particleSize) * dpr
      const particles = particlesRef.current

      for (const p of particles) {
        const value = waveValue(p.nx, p.ny, mx, my, timeRef.current)
        const ci = getColorIndex(value)
        const [r, g, b] = parsedColors[ci]

        const waveOffset = (value - 0.5) * 40
        const waveAngle = value * Math.PI * 2
        const tx = p.nx * W + Math.cos(waveAngle) * waveOffset
        const ty = p.ny * H + Math.sin(waveAngle) * waveOffset

        const dx = tx - p.x
        const dy = ty - p.y
        p.vx += dx * springStrength
        p.vy += dy * springStrength

        const mdx = p.x - mxPx
        const mdy = p.y - myPx
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < mouseRadius) {
          const force = (1 - mDist / mouseRadius) * mouseStrength
          p.vx += (mdx / (mDist || 1)) * force
          p.vy += (mdy / (mDist || 1)) * force
        }

        p.vx *= damping
        p.vy *= damping

        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (vel > 18) {
          p.vx = (p.vx / vel) * 18
          p.vy = (p.vy / vel) * 18
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < -80) p.x = W + 80
        if (p.x > W + 80) p.x = -80
        if (p.y < -80) p.y = H + 80
        if (p.y > H + 80) p.y = -80

        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(p.x * dpr - ps / 2, p.y * dpr - ps / 2, ps, ps)
      }

      rafId = requestAnimationFrame(draw)
    }

    const onMouse = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    const onTouch = (e) => {
      if (e.touches[0]) {
        mouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        }
      }
    }
    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('mouseleave', onLeave)

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [palette, particleCount, speed, mouseStrength, mouseRadius, particleSize, springStrength, damping])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}

export default ParticleDither
