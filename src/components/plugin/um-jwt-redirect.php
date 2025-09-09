<?php
/**
 * Plugin Name: Ultimate Member JWT Redirect AJAX
 * Description: Redirect Ultimate Member login to Next.js with JWT token (works for AJAX login).
 * Version: 1.0
 */

add_action('um_submit_form_errors_hook_login', function($submitted_data) {
    if (!empty($submitted_data['username']) && !empty($submitted_data['user_password'])) {
        $username = $submitted_data['username'];
        $password = $submitted_data['user_password'];

        $nextjs_api_url = "http://127.0.0.1:3000/api/auth/um-login";

        wp_remote_post($nextjs_api_url, [
            'body'    => json_encode(['username' => $username, 'password' => $password]),
            'headers' => ['Content-Type' => 'application/json'],
            'timeout' => 15,
        ]);
    }
});


add_action('template_redirect', function() {
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        $request_uri = $_SERVER['REQUEST_URI'];

        $path = parse_url($request_uri, PHP_URL_PATH);
        $path = rtrim($path, '/');
        $home_path = parse_url(home_url(), PHP_URL_PATH);
        if ($home_path !== '/') {
            $path = preg_replace('#^' . preg_quote($home_path, '#') . '#', '', $path);
        }
        $path = ltrim($path, '/');

        if ($path === 'user' || strpos($path, 'user/') === 0) {
            // Encode the email (Base64)
            $encoded_email = urlencode(base64_encode($user->user_email));

            $redirect_url = 'http://localhost:3000/user/dashboard?url=' . $encoded_email;
            wp_safe_redirect($redirect_url);
            exit;
        }
    }
});


// Add this in functions.php or a small plugin
function mysite_hide_header_footer_script() {
    ?>
    <script>
    document.addEventListener("DOMContentLoaded", function () {
        const currentUrl = window.location.pathname;

        // Match `/mysite/account/`
        if (currentUrl === "/mysite/account/" || currentUrl === "/mysite/my-account/" || currentUrl === "/mysite/my-account/orders/" || currentUrl === "/mysite/my-account/downloads/"  ||
            currentUrl === "/mysite/my-account/edit-address/" || currentUrl === "/mysite/my-account/payment-methods/" || currentUrl === "/mysite/my-account/edit-account/" || currentUrl === "/mysite/my-account/lost-password/"
        ) {
            const header = document.querySelector("header");
            const footer = document.querySelector("footer");

            if (header) header.style.display = "none";
            if (footer) footer.style.display = "none";
        }
    });
    </script>
    <?php
}
add_action("wp_footer", "mysite_hide_header_footer_script");




add_action('send_headers', function () {
    header("Content-Security-Policy: frame-ancestors 'self' http://localhost:3000");
});


