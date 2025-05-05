"use client"

import { useEffect, useRef } from "react"

const BackgroundAnimation = () => {
  const canvasRef = useRef(null)
  const mousePosition = useRef({ x: null, y: null })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId
    let particles = []

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles() // Reinitialize particles when canvas size changes
    }

    // Track mouse position
    const updateMousePosition = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Mouse leave event
    const handleMouseLeave = () => {
      mousePosition.current = {
        x: null,
        y: null,
      }
    }

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * canvas.width
        this.y = y || Math.random() * canvas.height
        this.size = Math.random() * 3 + 0.5
        this.baseSize = this.size
        this.density = Math.random() * 30 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.baseSpeedX = this.speedX
        this.baseSpeedY = this.speedY
        this.color = this.getRandomColor()
        this.baseColor = this.color
        this.glowIntensity = 0
      }

      getRandomColor() {
        const colors = [
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(139, 92, 246, 0.7)", // Purple
          "rgba(16, 185, 129, 0.7)", // Green
          "rgba(99, 102, 241, 0.7)", // Indigo
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      draw() {
        ctx.beginPath()

        // Create gradient for glow effect
        if (this.glowIntensity > 0) {
          const gradient = ctx.createRadialGradient(
            this.x,
            this.y,
            0,
            this.x,
            this.y,
            this.size * (1 + this.glowIntensity * 2),
          )

          // Extract RGB values from base color
          const baseRgb = this.baseColor.match(/\d+/g)

          gradient.addColorStop(0, this.color)
          gradient.addColorStop(1, `rgba(${baseRgb[0]}, ${baseRgb[1]}, ${baseRgb[2]}, 0)`)

          ctx.fillStyle = gradient
          ctx.arc(this.x, this.y, this.size * (1 + this.glowIntensity), 0, Math.PI * 2)
        } else {
          ctx.fillStyle = this.color
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        }

        ctx.fill()
      }

      update() {
        // Mouse interaction
        if (mousePosition.current.x != null) {
          const dx = mousePosition.current.x - this.x
          const dy = mousePosition.current.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance

          // Maximum distance for interaction
          const maxDistance = 200
          const force = (maxDistance - distance) / maxDistance

          if (distance < maxDistance) {
            // Particle is attracted to mouse
            this.glowIntensity = force * 0.5
            this.size = this.baseSize * (1 + force * 0.5)

            // Change color based on proximity to mouse
            const baseRgb = this.baseColor.match(/\d+/g)
            const alpha = 0.7 + force * 0.3
            this.color = `rgba(${baseRgb[0]}, ${baseRgb[1]}, ${baseRgb[2]}, ${alpha})`

            // Adjust speed based on mouse position
            this.speedX = this.baseSpeedX + forceDirectionX * force * 2
            this.speedY = this.baseSpeedY + forceDirectionY * force * 2
          } else {
            // Reset to base values when out of range
            this.glowIntensity = 0
            this.size = this.baseSize
            this.color = this.baseColor
            this.speedX = this.baseSpeedX
            this.speedY = this.baseSpeedY
          }
        }

        // Move particles
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges with some randomness
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX * (0.9 + Math.random() * 0.2)
          this.baseSpeedX = this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY * (0.9 + Math.random() * 0.2)
          this.baseSpeedY = this.speedY
        }

        // Keep particles within canvas
        if (this.x < 0) this.x = 0
        if (this.x > canvas.width) this.x = canvas.width
        if (this.y < 0) this.y = 0
        if (this.y > canvas.height) this.y = canvas.height
      }
    }

    // Initialize particles
    function initParticles() {
      particles = []
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000))

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    // Connect particles with lines
    function connect() {
      const maxDistance = 150
      const mouseRadius = 200

      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / maxDistance

            // Check if mouse is near this connection
            let lineColor = `rgba(99, 102, 241, ${opacity * 0.5})`

            if (mousePosition.current.x != null) {
              const mx = (particles[a].x + particles[b].x) / 2
              const my = (particles[a].y + particles[b].y) / 2
              const mouseDx = mousePosition.current.x - mx
              const mouseDy = mousePosition.current.y - my
              const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)

              if (mouseDistance < mouseRadius) {
                // Highlight connections near mouse
                const highlight = 1 - mouseDistance / mouseRadius
                lineColor = `rgba(139, 92, 246, ${(opacity + highlight * 0.5) * 0.8})`

                // Make line thicker near mouse
                ctx.lineWidth = 1 + highlight
              } else {
                ctx.lineWidth = 1
              }
            } else {
              ctx.lineWidth = 1
            }

            ctx.strokeStyle = lineColor
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Create particles on click
    function handleClick(e) {
      // Create 5 new particles at click position
      for (let i = 0; i < 5; i++) {
        if (particles.length < 300) {
          // Limit max particles
          particles.push(new Particle(e.clientX, e.clientY))
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      connect()
      animationFrameId = requestAnimationFrame(animate)
    }

    // Set up event listeners
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)
    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("click", handleClick)

    // Start animation
    initParticles()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("click", handleClick)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-gradient-to-b from-black via-gray-900 to-black" />
}

export default BackgroundAnimation
