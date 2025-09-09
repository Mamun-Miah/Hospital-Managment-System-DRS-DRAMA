<script>
document.addEventListener("DOMContentLoaded", function () {
  // Select ONLY the UM login form
  const loginForm = document.querySelector(".um-login form"); 
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent only UM login form submission

    const usernameInput = loginForm.querySelector('input[name^="username"]');
    const passwordInput = loginForm.querySelector('input[name^="user_password"]');

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      // Send credentials to Next.js API
      const res = await fetch("http://127.0.0.1:3000/api/auth/um-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("JWT Response:", data);

      if (data.token && data.user?.email) {
        // Completely clear localStorage
        localStorage.clear();

        // Redirect to protected dashboard
        window.location.href = "http://127.0.0.1:3000/user/dashboard";
      } else {
        alert("Login failed: " + (data.error || "No token returned"));
      }
    } catch (err) {
      console.error(err);
      alert("Error sending credentials to Next.js API");
    }
  });
});
</script>
