"use client";

import { Inter } from "next/font/google";
import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
// import "../../../(hmsdashboard)/globals.css";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
  title = "Dashboard",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className={`${inter.variable} antialiased flex h-screen bg-gray-100`}>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 bg-white shadow-lg w-64 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 z-40
          md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="p-6 flex items-center font-bold border-b border-gray-200">
          <Image src="/images/logo.png" width={50} height={50} alt="logo" />
          <p className="text-[#5503D9] ml-2">DRS DERMA</p>
        </div>

        <nav className="mt-6">
          <ul>
            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="material-symbols-outlined">grid_view</span>
                Dashboard
              </Link>
            </li>

            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/dashboard/prescription" className="flex items-center gap-2">
                <span className="material-symbols-outlined">prescriptions</span>
                Prescription
              </Link>
            </li>

            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/dashboard/billing-records" className="flex items-center gap-2">
                <span className="material-symbols-outlined">credit_card</span>
                Billing Records
              </Link>
            </li>

            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/dashboard/treatment-history" className="flex items-center gap-2">
                <span className="material-symbols-outlined">medical_information</span>
                Treatment History
              </Link>
            </li>

            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/ecommerce" className="flex items-center gap-2">
                <span className="material-symbols-outlined">store</span>
                Ecommerce
              </Link>
            </li>

            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/lms" className="flex items-center gap-2">
                <span className="material-symbols-outlined">book_ribbon</span>
                LMS
              </Link>
            </li>

            <li className="p-3 hover:bg-gray-200 rounded cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <span className="material-symbols-outlined">settings</span>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-200 bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white py-4 px-10 shadow-md sticky top-0 z-20">
          <button
            className="md:hidden px-3 py-2 rounded bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>

        <main className="p-6 overflow-auto flex-1 px-10">{children}</main>
      </div>
    </div>
  );
}
