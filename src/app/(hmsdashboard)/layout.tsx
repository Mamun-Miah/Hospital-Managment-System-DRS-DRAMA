import "material-symbols";
import "remixicon/fonts/remixicon.css";
import "react-calendar/dist/Calendar.css";
import "swiper/css";
import "swiper/css/bundle";
import AuthProvider from './providers/SessionProvider'
// globals
import "./globals.css";

import LayoutProvider from "@/providers/LayoutProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});
  
export const metadata: Metadata = {
  title: "DRS DERMA - HMS",
  description: "DRS DERMA -HMS",
  icons: {
    icon: '/favicon.ico',            // default icon
    shortcut: '/favicon-32x32.png',  // used for pinned/tab shortcuts
    apple: '/apple-touch-icon.png',  // iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${inter.variable} antialiased`}
      >
       <AuthProvider><LayoutProvider>{children}</LayoutProvider></AuthProvider> 
      </body>
    </html>
  );
}
