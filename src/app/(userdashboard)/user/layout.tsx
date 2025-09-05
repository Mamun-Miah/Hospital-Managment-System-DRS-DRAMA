"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../../(hmsdashboard)/globals.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("wp_jwt");

      // If no token → redirect to login
      if (!token) {
        router.replace("http://localhost/mysite/login/");
        return;
      }

      try {
        const res = await fetch("/api/auth/validate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        // If token invalid → redirect to login
        if (!data.valid) {
          localStorage.removeItem("wp_jwt"); // remove invalid token
          router.replace("http://localhost/mysite/login/");
        } else {
          setLoading(false); // token valid → render children
        }
      } catch (err) {
        console.error(err);
        router.replace("http://localhost/mysite/login/");
      }
    };

    checkAuth();
  }, [router]);

  // While checking token, render loading indicator
  if (loading) return <p>Loading...</p>;

  return <> 
    <html lang="en">
      <body>{children}</body>
    </html>
    </>;
}
