<script>
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".um-form form"); // select UM login form
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent default UM login

    // select username and password inputs (dynamic IDs)
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

      if (data.token) {
        alert("Logged in via Next.js API!");
        // Store the token (cookie/localStorage) and redirect if needed
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending credentials to Next.js");
    }

    // Optional: continue default UM login
    // loginForm.submit();
  });
});
</script>
