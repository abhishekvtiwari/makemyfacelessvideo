// src/app/page.tsx
import { Navbar }      from "@/components/sections/Navbar"
import { Hero }        from "@/components/sections/Hero"
import { Features }    from "@/components/sections/Features"
import { Niches }      from "@/components/sections/Niches"
import { Workflow }    from "@/components/sections/Workflow"
import { SocialProof } from "@/components/sections/SocialProof"
import { CtaBanner }   from "@/components/sections/CtaBanner"
import { Footer }      from "@/components/sections/Footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Niches />
      <Workflow />
      <SocialProof />
      <CtaBanner />
      <Footer />
    </>
  )
}
