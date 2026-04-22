'use client'
// src/components/home/HeroCanvas.tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const CARDS = [
  { niche: 'Finance',     label: 'NICHE 01', pos: [-2.2, 1.2, -1.0] as const, rot: [0,  0.30, -0.10] as const },
  { niche: 'True Crime',  label: 'NICHE 02', pos: [-0.8, -0.8, -0.5] as const, rot: [0,  0.10,  0.05] as const },
  { niche: 'Motivation',  label: 'NICHE 03', pos: [ 0.8,  1.0,  0.0] as const, rot: [0, -0.15, -0.08] as const },
  { niche: 'History',     label: 'NICHE 04', pos: [ 2.0, -0.5, -0.8] as const, rot: [0, -0.30,  0.10] as const },
  { niche: 'Tech',        label: 'NICHE 05', pos: [ 0.0, -1.6, -1.2] as const, rot: [0.10, 0,  0.00] as const },
]

// Cross-browser rounded rect on canvas 2D context
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function createCardTexture(niche: string, label: string): THREE.CanvasTexture {
  const W = 600, H = 380
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background
  roundRect(ctx, 0, 0, W, H, 20)
  ctx.fillStyle = '#0d1525'
  ctx.fill()

  // Border glow — outer stroke
  roundRect(ctx, 1, 1, W - 2, H - 2, 19)
  ctx.strokeStyle = '#5B47F5'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner radial glow
  const grd = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 260)
  grd.addColorStop(0, 'rgba(91,71,245,0.1)')
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grd
  roundRect(ctx, 2, 2, W - 4, H - 4, 18)
  ctx.fill()

  // Teal label ("NICHE 01")
  ctx.font      = '600 13px monospace'
  ctx.fillStyle = '#0D9488'
  ctx.textAlign = 'center'
  ctx.fillText(label, W / 2, H / 2 - 40)

  // Niche name
  ctx.font      = '700 52px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(niche, W / 2, H / 2 + 20)

  return new THREE.CanvasTexture(canvas)
}

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.innerWidth < 768
    if (isMobile) return   // mobile shows static fallback — no canvas

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ─────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 5)

    // ── Lights ─────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const violetLight = new THREE.PointLight(0x5b47f5, 1.5, 20)
    const tealLight   = new THREE.PointLight(0x0d9488, 0.8, 18)
    const whiteLight  = new THREE.PointLight(0xffffff, 0.3, 15)
    scene.add(violetLight, tealLight, whiteLight)

    // ── Card group ─────────────────────────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    const floatOffsets = CARDS.map(() => Math.random() * Math.PI * 2)
    const baseY        = CARDS.map(c => c.pos[1])

    CARDS.forEach((c, i) => {
      const tex  = createCardTexture(c.niche, c.label)
      const geo  = new THREE.PlaneGeometry(3, 1.9)
      const mat  = new THREE.MeshStandardMaterial({
        map:         tex,
        transparent: true,
        roughness:   0.4,
        metalness:   0.05,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(c.pos[0], c.pos[1], c.pos[2])
      mesh.rotation.set(c.rot[0], c.rot[1], c.rot[2])
      group.add(mesh)
    })

    // ── Particles ─────────────────────────────────────────────────────────────
    const PARTICLE_COUNT = 200
    const pGeo  = new THREE.BufferGeometry()
    const pPos  = new Float32Array(PARTICLE_COUNT * 3)
    const pSeed = new Float32Array(PARTICLE_COUNT) // per-particle drift seed

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 10
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5
      pSeed[i]        = Math.random() * Math.PI * 2
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x5b47f5, size: 0.03,
      transparent: true, opacity: 0.4,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    // ── Mouse tracking ─────────────────────────────────────────────────────────
    const mouseTarget = { x: 0, y: 0 }
    const mouseCurrent = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Resize ─────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animation loop ─────────────────────────────────────────────────────────
    let frameId: number
    let prev = performance.now()
    let time = 0

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate)
      const delta = Math.min((now - prev) / 1000, 0.05)
      prev  = now
      time += delta

      // Lerp mouse → group rotation
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.05
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.05
      group.rotation.y = Math.sin(time * 0.15) * 0.12 + mouseCurrent.x * 0.08
      group.rotation.x = mouseCurrent.y * -0.04

      // Float individual cards
      group.children.forEach((child, i) => {
        child.position.y = baseY[i] + Math.sin(time * 0.4 + floatOffsets[i]) * 0.06
      })

      // Orbit lights
      const la = time * 0.35
      violetLight.position.set(Math.cos(la) * 4,       1.5,               Math.sin(la) * 4)
      tealLight.position.set(  Math.cos(la + Math.PI) * 3.5, -1,          Math.sin(la + Math.PI) * 3.5)
      whiteLight.position.set( Math.cos(la + 1.2) * 2, Math.sin(la) * 2,  2)

      // Drift particles
      const arr = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const yi = i * 3 + 1
        const xi = i * 3
        arr[yi] += delta * (0.15 + pSeed[i] * 0.2)
        arr[xi] += Math.sin(time * 0.3 + pSeed[i]) * 0.001
        if (arr[yi] > 5) arr[yi] = -5
      }
      pGeo.attributes.position.needsUpdate = true

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
