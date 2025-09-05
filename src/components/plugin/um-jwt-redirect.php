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


