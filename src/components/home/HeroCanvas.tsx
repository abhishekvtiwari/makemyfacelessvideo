'use client'
// src/components/home/HeroCanvas.tsx
import { useEffect, useRef } from 'react'

const CARDS = [
  { niche: 'Finance',    label: 'NICHE 01', pos: [-2.2,  1.2, -1.0] as const, rot: [0,  0.30, -0.10] as const },
  { niche: 'True Crime', label: 'NICHE 02', pos: [-0.8, -0.8, -0.5] as const, rot: [0,  0.10,  0.05] as const },
  { niche: 'Motivation', label: 'NICHE 03', pos: [ 0.8,  1.0,  0.0] as const, rot: [0, -0.15, -0.08] as const },
  { niche: 'History',    label: 'NICHE 04', pos: [ 2.0, -0.5, -0.8] as const, rot: [0, -0.30,  0.10] as const },
  { niche: 'Tech',       label: 'NICHE 05', pos: [ 0.0, -1.6, -1.2] as const, rot: [0.10, 0,   0.00] as const },
]

function makeCardTexture(THREE: any, niche: string, label: string) {
  const W = 600, H = 380
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')!

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(0, 0, W, H, 16)
  ctx.fill()

  // Violet left bar (6px)
  ctx.fillStyle = '#4633E0'
  ctx.fillRect(0, 0, 6, H)

  // Subtle top shadow
  const topShadow = ctx.createLinearGradient(0, 0, 0, 60)
  topShadow.addColorStop(0, 'rgba(0,0,0,0.04)')
  topShadow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = topShadow
  ctx.fillRect(6, 0, W - 6, 60)

  // Teal label
  ctx.font = '600 12px monospace'
  ctx.fillStyle = '#0A7A70'
  ctx.textAlign = 'center'
  ctx.fillText(label, W / 2, H / 2 - 44)

  // Bold dark niche name
  ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#0A0A0A'
  ctx.textAlign = 'center'
  ctx.fillText(niche, W / 2, H / 2 + 16)

  // EEF0FF pill
  ctx.fillStyle = '#EEF0FF'
  ctx.beginPath()
  ctx.roundRect(W / 2 - 40, H - 60, 80, 26, 13)
  ctx.fill()
  ctx.font = '500 10px monospace'
  ctx.fillStyle = '#4633E0'
  ctx.textAlign = 'center'
  ctx.fillText('AI VIDEO', W / 2, H - 42)

  return new THREE.CanvasTexture(cv)
}

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const THREE = (window as any).THREE
    if (!THREE) return

    const isMobile = window.innerWidth < 768
    if (isMobile) return

    // ── Renderer ────────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ──────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 5)

    // ── Card group ──────────────────────────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    const floatOffsets = CARDS.map(() => Math.random() * Math.PI * 2)
    const baseY = CARDS.map(c => c.pos[1])

    CARDS.forEach((c) => {
      const tex  = makeCardTexture(THREE, c.niche, c.label)
      const geo  = new THREE.PlaneGeometry(3, 1.9)
      const mat  = new THREE.MeshBasicMaterial({ map: tex, transparent: true })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(c.pos[0], c.pos[1], c.pos[2])
      mesh.rotation.set(c.rot[0], c.rot[1], c.rot[2])

      // Shadow plane behind card
      const shadowMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 1.9),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.06 })
      )
      shadowMesh.position.set(0.06, -0.05, -0.02)
      mesh.add(shadowMesh)

      group.add(mesh)
    })

    // ── Mouse tracking ──────────────────────────────────────────────────────────
    const mouseTarget  = { x: 0, y: 0 }
    const mouseCurrent = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Resize ──────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ──────────────────────────────────────────────────────────
    let frameId: number
    let prev = performance.now()
    let time = 0

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate)
      const delta = Math.min((now - prev) / 1000, 0.05)
      prev  = now
      time += delta

      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.05
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.05
      group.rotation.y = Math.sin(time * 0.15) * 0.12 + mouseCurrent.x * 0.08
      group.rotation.x = mouseCurrent.y * -0.04

      group.children.forEach((child, i) => {
        child.position.y = baseY[i] + Math.sin(time * 0.4 + floatOffsets[i]) * 0.06
      })

      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      data-cursor="canvas"
      className="w-full h-full"
      style={{ minHeight: 480 }}
      aria-hidden="true"
    />
  )
}
