import { useRef, useEffect } from 'react'

const DitherBody = ({
  palette = ['#2B75FF', '#FABEFF', '#ffffff'],
  speed = 0.3,
  cellSize = 2,
  waveCount = 1.5,
  ditherDensity = 0.6,
  className = '',
}) => {
  const canvasRef = useRef(null)
  const stateRef = useRef({ mouse: { x: 0.5, y: 0.5 }, time: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId

    const parsedColors = palette.map(hex => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ])

    const bayer4 = [
      [0, 8, 2, 12],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ]

    const resize = () => {
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const state = stateRef.current
      state.time += speed * 0.016

      const W = window.innerWidth
      const H = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      const cs = Math.max(1, cellSize)
      const cols = Math.ceil(W / cs)
      const rows = Math.ceil(H / cs)

      canvas.width = W * dpr
      canvas.height = H * dpr

      const smallCanvas = document.createElement('canvas')
      smallCanvas.width = cols
      smallCanvas.height = rows
      const sCtx = smallCanvas.getContext('2d')
      const imageData = sCtx.createImageData(cols, rows)
      const data = imageData.data

      const { x: mx, y: my } = state.mouse
      const nColors = parsedColors.length

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const nx = col / cols
          const ny = row / rows

          let value = 0
          for (let w = 0; w < waveCount; w++) {
            const freq = 0.002 + w * 0.001
            const amp = 0.12 - w * 0.02
            const phase = w * 2.1
            const dx = nx - mx
            const dy = ny - my
            const dist = Math.sqrt(dx * dx + dy * dy)
            value += Math.sin(
              nx * 1200 * freq +
                ny * 900 * freq +
                dist * 600 * freq +
                state.time +
                phase
            ) * amp
          }

          const totalAmp = 0.1 * waveCount
          value = (value / totalAmp) * 0.5 + 0.5
          value = Math.max(0, Math.min(1, value))

          const h = Math.sin(col * 127.1 + row * 311.7) * 43758.5453
          const noise = h - Math.floor(h)
          value += (noise - 0.5) * ditherDensity * 0.18

          const scaled = value * (nColors - 1)
          const idx = Math.floor(scaled)
          const frac = scaled - idx
          const bx = col % 4
          const by = row % 4
          const threshold = 0.5 + (bayer4[by][bx] / 16 - 0.5) * ditherDensity
          const ci =
            frac > threshold
              ? Math.min(idx + 1, nColors - 1)
              : Math.max(idx, 0)

          const [r, g, b] = parsedColors[ci]
          const pi = (row * cols + col) * 4
          data[pi] = r
          data[pi + 1] = g
          data[pi + 2] = b
          data[pi + 3] = 255
        }
      }

      sCtx.putImageData(imageData, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height)

      rafId = requestAnimationFrame(draw)
    }

    const onMouse = (e) => {
      stateRef.current.mouse = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    const onTouch = (e) => {
      if (e.touches[0]) {
        stateRef.current.mouse = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        }
      }
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch)
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [palette, speed, cellSize, waveCount, ditherDensity])

  return (
    <canvas
      ref={canvasRef}
      className={className}
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

export default DitherBody
