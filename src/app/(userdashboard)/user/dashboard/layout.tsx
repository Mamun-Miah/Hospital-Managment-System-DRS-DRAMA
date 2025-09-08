"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Get email from localStorage
      const email = localStorage.getItem("wp_user_email");
      console.log('get email from storage',email)

      if (!email) {
        router.replace("http://localhost/mysite/login/");
        return;
      }

      try {
        const res = await fetch("/api/auth/check-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!data.valid) {
          router.replace("http://localhost/mysite/login/");
        } else {
          setLoading(false); // session valid → render children
        }
      } catch (err) {
        console.error(err);
        router.replace("http://localhost/mysite/login/");
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
