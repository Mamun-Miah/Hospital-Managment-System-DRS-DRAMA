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
<script>
document.addEventListener("DOMContentLoaded", function() {
  // Select the WooCommerce Browse Products button
  const browseBtn = document.querySelector(".woocommerce-Button.wc-forward.button[href='http://localhost/mysite/']");
  
  if (browseBtn) {
    browseBtn.setAttribute("target", "_blank");
    browseBtn.setAttribute("rel", "noopener noreferrer"); // security best practice
  }
});
</script>

<script>
document.addEventListener("DOMContentLoaded", function() {
  //  Redirect if UM misc menu has Dashboard
  const ul = document.querySelector(".um-misc-ul");
  if (ul) {
    const dashboardLink = ul.querySelector("a[href='http://localhost:3000/user/dashboard/']");
    if (dashboardLink) {
      window.location.href = "http://localhost:3000/user/dashboard/";
      return; // stop execution to prevent double redirect
    }

    // Replace existing items with Dashboard link
    ul.innerHTML = '';
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = "http://localhost:3000/user/dashboard/";
    a.textContent = "Dashboard";
    li.appendChild(a);
    ul.appendChild(li);

    // Optional: redirect after adding
    window.location.href = "http://localhost:3000/user/dashboard/";
    return;
  }

  // 2️ Redirect if Register page shows "You are already registered"
  const main = document.querySelector(".site-main.post-12.page.type-page.status-publish.hentry");
  if (main && main.textContent.includes("You are already registered")) {
    window.location.href = "http://localhost:3000/user/dashboard/";
    return;
  }
});
</script>



