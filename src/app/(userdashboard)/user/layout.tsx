// app/layout.tsx
import { ReactNode } from "react";
import "../../(hmsdashboard)/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
