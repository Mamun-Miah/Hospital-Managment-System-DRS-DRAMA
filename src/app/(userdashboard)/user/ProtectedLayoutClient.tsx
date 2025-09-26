"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface Props {
  children: React.ReactNode;
}

export default function ProtectedLayoutClient({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    
    const checkSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlParam = params.get("url");  
        let email = "";

        if (urlParam) {
          const [base64Email] = urlParam.split(":");
          email = atob(base64Email);
          localStorage.clear();
          localStorage.setItem("wp_user_email", email);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          email = localStorage.getItem("wp_user_email") || "";
        }

        if (!email) {
          router.replace(`${process.env.NEXT_PUBLIC_WP_BASE_URL}/logout/?redirect_to=${process.env.NEXT_PUBLIC_WP_BASE_URL}/login/`);
          return;
        }

        const res = await fetch(`/api/auth/validate-token?url=${btoa(email)}:200`);
        const data = await res.json();
        // console.log('username',data)

        if (!data.valid) {
          router.replace(`${process.env.NEXT_PUBLIC_WP_BASE_URL}/logout/?redirect_to=${process.env.NEXT_PUBLIC_WP_BASE_URL}/login/`);
          return;
        }
        if (data.username) {
          localStorage.setItem("wp_user_username", data.username);
          localStorage.setItem("wp_phone_number", data.phoneNumber);

        }
        setLoading(false);
      } catch (err) {
        console.error("Session validation error:", err);
        router.replace(`${process.env.NEXT_PUBLIC_WP_BASE_URL}/logout/?redirect_to=${process.env.NEXT_PUBLIC_WP_BASE_URL}/login/`);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
