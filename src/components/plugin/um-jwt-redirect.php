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
    // Get the requested URL path
    $request_uri = $_SERVER['REQUEST_URI'];

    // Remove query string and trailing slash
    $path = parse_url($request_uri, PHP_URL_PATH);
    $path = rtrim($path, '/');

    // Extract only the last part after your site URL
    $home_path = parse_url(home_url(), PHP_URL_PATH);
    if ($home_path !== '/') {
        $path = preg_replace('#^' . preg_quote($home_path, '#') . '#', '', $path);
    }
    $path = ltrim($path, '/');

    // Check if path is exactly 'user' OR starts with 'user/'
    if ($path === 'user' || strpos($path, 'user/') === 0) {
        wp_safe_redirect('http://localhost:3000');
        exit;
    }
});