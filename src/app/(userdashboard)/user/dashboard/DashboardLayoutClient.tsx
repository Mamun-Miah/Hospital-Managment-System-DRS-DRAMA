"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface DashboardLayoutClientProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayoutClient({ children, title = "Dashboard" }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-white w-64 shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-40`}
      >
        <div className="p-6 flex items-center font-bold border-b border-gray-200">
          <Image src="/images/logo.png" width={50} height={50} alt="logo" />
          <p className="text-[#5503D9] ml-2">DRS DERMA</p>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="p-3 hover:bg-gray-200 rounded">
              <Link href="/user/dashboard" className="flex items-center gap-2">
                <span className="material-symbols-outlined">grid_view</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-gray-200 rounded">
              <Link href="/user/dashboard/prescription" className="flex items-center gap-2">
                <span className="material-symbols-outlined">prescriptions</span>
                <span>Prescription</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-gray-200 rounded">
              <Link href="/user/dashboard/billing-records" className="flex items-center gap-2">
                <span className="material-symbols-outlined">credit_card</span>
                <span>Billing Records</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-gray-200 rounded">
              <Link href="/user/dashboard/treatment-history" className="flex items-center gap-2">
                <span className="material-symbols-outlined">medical_information</span>
                <span>Treatment History</span>
              </Link>
            </li>
            <li className="p-3 hover:bg-gray-200 rounded">
              <Link href="/user/dashboard/settings" className="flex items-center gap-2">
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
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
        <header className="flex justify-between items-center bg-white py-4 px-6 shadow-sm sticky top-0 z-20">
          <button className="md:hidden px-3 py-2 rounded bg-gray-200" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
