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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Home() {
   const { data: session, status } = useSession();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      router.push('/dashboard/');
      
    } else {
      setRedirecting(true);
      router.push('/dashboard/'); // show homepage to guests
    }
  }, [status, session, router]);

  if (redirecting) return <div>Loading Admin Panel...</div>;


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
