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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
   const [username, setUsername] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  return (
   
        <div
          className={`${inter.variable} antialiased flex h-screen bg-gray-100`}
        >
          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 bg-white shadow-lg w-64 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 z-40
          md:translate-x-0 md:static md:inset-auto`}
          >
            <div className="p-6 flex items-center font-bold border-gray-200">
              <Image src="/images/logo.png" width={50} height={50} alt="logo" />
              <p className="text-[#5503D9] ml-2">DRS DERMA</p>
            </div>
            <nav className="mt-6">
              <ul>
                <li
                  onClick={() => setSidebarOpen(false)}
                  className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
                    pathname === "/user/dashboard/" && "bg-gray-200"
                  }`}
                >
                  <Link
                    href="/user/dashboard/"
                    className="flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">grid_view</span>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li
                  onClick={() => setSidebarOpen(false)}
                  className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
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
                  className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
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
                <li
                  onClick={() => setSidebarOpen(false)}
                  className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
                    pathname.includes("treatment-history") && "bg-gray-200"
                  }`}
                >
                  <Link
                    href="/user/dashboard/treatment-history"
                    className="flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      medical_information
                    </span>
                    <span>Treatment History</span>
                  </Link>
                </li>
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
                <li
                  onClick={() => setSidebarOpen(false)}
                  className={`p-3 hover:bg-gray-200 rounded transition-all duration-200 ${
                    pathname.includes("lms") && "bg-gray-200"
                  }`}
                >
                  <a
                    href="/user/dashboard/lms"
                    className="flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      book_ribbon
                    </span>
                    <span>LMS</span>
                  </a>
                </li>
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
                {/* <li className="p-3 hover:bg-gray-200 rounded transition-all duration-200">
                  <a
                    href="/user/dashboard/my-account"
                    className="flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      account_box
                    </span>
                    <span>My Account</span>
                  </a>
                </li> */}
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
              className="fixed inset-0 bg-gray-200 bg-opacity-30 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center bg-white py-6 px-10 shadow-md sticky top-0 z-20">
              <div>
                <button
                  className="md:hidden px-3 py-2 rounded bg-gray-200"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="flex items-center gap-3">
                  <button>
                    <span className="material-symbols-outlined">emoji_people</span>
                  </button>
                  <h5 className="font-semibold mt-2">Welcome {username}</h5>
                </div>
              </div>

              <div>
                {/* <li className="p-3 hover:bg-gray-200 rounded transition-all duration-200"> */}
                <a
                  href="/user/dashboard/my-account"
                  className="flex items-center gap-2 p-3 hover:bg-gray-200 rounded transition-all duration-200"
                >
                  <span className="material-symbols-outlined">account_box</span>
                  <span>My Account</span>
                </a>
                {/* </li> */}
              </div>
            </header>

            {/* Content */}
            <main className=" bg-white overflow-auto flex-1 ">{children}</main>
          </div>
        </div>
     
  );
};

export default DashboardLayout;
