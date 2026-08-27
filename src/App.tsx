import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Lenis from 'lenis'
import Cursor from '@/sections/Cursor'
import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import Manifesto from '@/sections/Manifesto'
import Works from '@/sections/Works'
import Awards from '@/sections/Awards'
import Footer from '@/sections/Footer'
import ProjectPage from '@/pages/ProjectPage'

function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Works />
      <Awards />
    </main>
  )
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const location = useLocation()

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    lenisRef.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // anchor navigation through lenis
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el as HTMLElement)
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      document.removeEventListener('click', onClick)
    }
  }, [])

  // reset scroll on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="grain relative min-h-screen bg-[#0a0a0a] text-[#ece9e4]">
      <Cursor />
      <Nav />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/works/:slug" element={<ProjectPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  )
}
