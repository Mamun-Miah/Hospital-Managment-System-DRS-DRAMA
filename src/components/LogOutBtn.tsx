"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
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
        // Clear localStorage
        localStorage.removeItem("wp_user_email");
        localStorage.removeItem("wp_user_token");

        // Redirect to WordPress logout
        window.location.href = data.redirectUrl;
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
