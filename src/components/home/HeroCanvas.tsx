'use client'
// src/components/home/HeroCanvas.tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NICHES = ['Finance', 'Motivation', 'History', 'Tech', 'True Crime']
const VIOLET = new THREE.Color(0x5b47f5)
const TEAL   = new THREE.Color(0x0d9488)

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.innerWidth < 768
    const cardCount = isMobile ? 3 : 5

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 7)

    // ── Ambient + point lights ────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const ptLight = new THREE.PointLight(TEAL, 2, 20)
    ptLight.position.set(0, 0, 4)
    scene.add(ptLight)

    // ── Particle field ────────────────────────────────────
    const particleCount = isMobile ? 120 : 250
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 14
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: VIOLET, size: 0.04, transparent: true, opacity: 0.35 })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Cards ─────────────────────────────────────────────
    const cardGroup = new THREE.Group()
    scene.add(cardGroup)

    const cards: THREE.Mesh[] = []
    const cardW = 2.2
    const cardH = 1.4

    const nicheSubset = NICHES.slice(0, cardCount)
    nicheSubset.forEach((_, i) => {
      const angle  = (i / cardCount) * Math.PI * 2
      const radius = isMobile ? 2.2 : 2.8
      const geo    = new THREE.PlaneGeometry(cardW, cardH, 1, 1)
      const mat    = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0d1525),
        transparent: true,
        opacity: 0.82,
        roughness: 0.3,
        metalness: 0.1,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 0.8,
        Math.cos(angle) * 1.2,
      )
      mesh.rotation.y = -angle * 0.4
      cards.push(mesh)
      cardGroup.add(mesh)
    })

    // violet border wireframe on each card
    cards.forEach(card => {
      const edges = new THREE.EdgesGeometry(card.geometry)
      const line  = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.6 }),
      )
      card.add(line)
    })

    // ── Resize handler ────────────────────────────────────
    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Teal pulse ────────────────────────────────────────
    let pulseT = 0

    // ── Animation loop ────────────────────────────────────
    let frameId: number
    let prev = performance.now()

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate)
      const delta = Math.min((now - prev) / 1000, 0.05)
      prev = now

      // orbit cards
      cardGroup.rotation.y += delta * 0.18

      // drift particles upward
      const pArr = pGeo.attributes.position.array as Float32Array
      for (let i = 1; i < particleCount * 3; i += 3) {
        pArr[i] += delta * 0.3
        if (pArr[i] > 7) pArr[i] = -7
      }
      pGeo.attributes.position.needsUpdate = true

      // teal pulse on point light every 3s
      pulseT += delta
      const pulseCycle = pulseT % 3
      const pulseIntensity = pulseCycle < 0.5 ? (pulseCycle / 0.5) * 3 : Math.max(0, 2 - (pulseCycle - 0.5) * 4)
      ptLight.intensity = 0.8 + pulseIntensity

      // Z-depth scale on cards
      cards.forEach((card, i) => {
        const worldPos = new THREE.Vector3()
        card.getWorldPosition(worldPos)
        const zN = (worldPos.z + 2) / 4
        const s  = 0.75 + zN * 0.35
        card.scale.setScalar(s)
      })

      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: 420 }}
      aria-hidden="true"
    />
  )
}
