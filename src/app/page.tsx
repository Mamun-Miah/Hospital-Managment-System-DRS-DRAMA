'use client';
import ContactUs from "@/components/FrontPage/ContactUs";
import Cta from "@/components/FrontPage/Cta";
import Faq from "@/components/FrontPage/Faq";
import Features from "@/components/FrontPage/Features";
import Footer from "@/components/FrontPage/Footer";
import HeroBanner from "@/components/FrontPage/HeroBanner";
import LightDarkModeButton from "@/components/FrontPage/LightDarkModeButton";
import Navbar from "@/components/FrontPage/Navbar";
import OurTeam from "@/components/FrontPage/OurTeam";
import Testimonials from "@/components/FrontPage/Testimonials";
import Widgets from "@/components/FrontPage/Widgets";

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Home() {
   const { data: session, status } = useSession()
console.log('Session:', session, 'Status:', status) 


  if (status === 'loading') return <div>Loading...</div>

  if (!session) return redirect('/authentication/sign-in/')
  return (
    <>
      <div className="front-page-body overflow-hidden">
        <LightDarkModeButton />

        <Navbar />

        <HeroBanner />

        <Features />

        <Widgets />

        <Testimonials />

        <OurTeam />

        <Faq />

        <ContactUs />

        <Cta />

        <Footer />
      </div>
    </>
  );
}
