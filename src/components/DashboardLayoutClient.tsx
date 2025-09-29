/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Inter } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  console.log(username);

  // Close when clicking outside
  useEffect(() => {
    const storedUsername = localStorage.getItem("wp_user_username");
    if (storedUsername) setUsername(capitalizeFirstLetter(storedUsername));
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    function handleDocClick(e: any) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target))
        setDropDownOpen(false);
    }
    function handleKey(e: any) {
      if (e.key === "Escape") setDropDownOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("touchstart", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("touchstart", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);
  return (
    <div className={`${inter.variable} antialiased flex h-screen bg-gray-100`}>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 bg-white shadow-lg min-w-64 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 z-40
          md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="md:hidden p-6 flex items-center font-bold border-gray-200 relative">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 bg-gray-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <Image
            src="/images/logo-org.png"
            className="md:mt-0 mt-5"
            width={200}
            height={50}
            alt="logo"
          />
        </div>
        <nav className="mt-6 sh">
          <ul>
            {/* HMS Parent Menu */}
            <li className="rounded transition-all duration-200">
              <details className="group" open>
                <summary
                  className={`flex items-center gap-2 cursor-pointer  p-3 rounded ${
                    (pathname === "/user/dashboard/" ||
                      pathname === "/user/dashboard/prescription/" ||
                      pathname === "/user/dashboard/billing-records/") &&
                    "bg-gray-200"
                  }`}
                >
                  <span className="material-symbols-outlined">
                    local_hospital
                  </span>
                  <span>HMS</span>
                </summary>
                <ul className="pl-6 mt-2 space-y-1">
                  <li
                    onClick={() => setSidebarOpen(false)}
                    className={`p-2 hover:bg-gray-200 rounded transition-all duration-200 ${
                      pathname === "/user/dashboard/" && "bg-gray-200"
                    }`}
                  >
                    <Link
                      href="/user/dashboard/"
                      className="flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">
                        grid_view
                      </span>
                      <span>My Appointment</span>
                    </Link>
                  </li>
                  <li
                    onClick={() => setSidebarOpen(false)}
                    className={`p-2 hover:bg-gray-200 rounded transition-all duration-200 ${
                      pathname.includes("prescription") && "bg-gray-200"
                    }`}
                  >
                    <Link
                      href="/user/dashboard/prescription"
                      className="flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">
                        prescriptions
                      </span>
                      <span>Prescription</span>
                    </Link>
                  </li>
                  <li
                    onClick={() => setSidebarOpen(false)}
                    className={`p-2 hover:bg-gray-200 rounded transition-all duration-200 ${
                      pathname.includes("billing-records") && "bg-gray-200"
                    }`}
                  >
                    <Link
                      href="/user/dashboard/billing-records"
                      className="flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">
                        credit_card
                      </span>
                      <span>Billing Records</span>
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            {/* E-Commerce */}
            <li
              onClick={() => setSidebarOpen(false)}
              className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
                pathname.includes("e-commerce") && "bg-gray-200"
              }`}
            >
              <a
                href="/user/dashboard/e-commerce"
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">
                  add_shopping_cart
                </span>
                <span>E-Commerce</span>
              </a>
            </li>

            {/* LMS */}
            <li
              onClick={() => setSidebarOpen(false)}
              className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
                pathname.includes("lms") && "bg-gray-200"
              }`}
            >
              <a href="/user/dashboard/lms" className="flex items-center gap-2">
                <span className="material-symbols-outlined">book_ribbon</span>
                <span>LMS</span>
              </a>
            </li>

            {/* My Account */}
            <li
              onClick={() => setSidebarOpen(false)}
              className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
                pathname.includes("my-account") && "bg-gray-200"
              }`}
            >
              <a
                href="/user/dashboard/my-account"
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined">account_box</span>
                <span>My Account</span>
              </a>
            </li>

            {/* Logout */}
            <li className="p-3 hover:bg-gray-200 rounded">
              <button
                onClick={async () => {
                  const email = localStorage.getItem("wp_user_email");
                  if (!email) return;

                  try {
                    const res = await fetch("/api/auth/logout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });

                    const data = await res.json();

                    if (data.success) {
                      localStorage.removeItem("wp_user_email");
                      localStorage.removeItem("wp_user_token");

                      // Redirect to WordPress logout link
                      window.location.href = data.redirectUrl;
                    }
                  } catch (err) {
                    console.error("Logout failed:", err);
                  }
                }}
                className="flex items-center gap-2 w-full text-left"
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col w-[80%]">
        {/* Header */}
        <header className="flex justify-between items-center bg-white py-6 px-10 shadow-md sticky top-0 z-20">
          <div className="md:hidden">
            <button
              className="md:hidden px-3 py-2 rounded bg-gray-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
          <div className="hidden md:block">
            <Image
              src="/images/logo-org.png"
              className="md:mt-0 mt-5"
              width={200}
              height={50}
              alt="logo"
            />
          </div>
          <div ref={sidebarRef} className="relative inline-block">
            <div className="flex items-center">
              {/* Caret button to toggle dropdown (doesn't navigate) */}
              <button
                onClick={() => setDropDownOpen((o) => !o)}
                // aria-expanded={open}
                // aria-label={dropDownOpen ? "Close submenu" : "Open submenu"}
                className="p-3 hover:bg-gray-200 rounded-md ml-1 flex items-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined">apps</span>
                <span className="font-medium">Quick Links</span>{" "}
                <span className="material-symbols-outlined">
                  {dropDownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
            </div>

            {/* Dropdown */}
            {dropDownOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                className="absolute left-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <Link
                  onClick={() => setDropDownOpen(false)}
                  href="/user/dashboard/book-now"
                  className="flex items-center gap-2 p-3 hover:bg-gray-200 rounded-md transition-all duration-200"
                >
                  <span className="material-symbols-outlined">
                    event_upcoming
                  </span>
                  <span className="font-medium">Book Now</span>{" "}
                </Link>
                <a
                  onClick={() => setDropDownOpen(false)}
                  href="/user/dashboard/e-commerce"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined">
                    shopping_cart
                  </span>
                  <span>Ecommerce</span>
                </a>

                <Link
                  onClick={() => setDropDownOpen(false)}
                  href="/user/dashboard/lms"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined">school</span>
                  <span>LMS</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className=" bg-white overflow-auto flex-1 p-10">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
