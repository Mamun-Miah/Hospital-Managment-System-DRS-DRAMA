<?php
/**
 * Plugin Name: Ultimate Member Redirect AJAX
 * Description: Redirect Ultimate Member login.
 * Version: 1.0
 */
$apiUrl = "http://localhost:3000";

add_action('um_submit_form_errors_hook_login', function($submitted_data) use ($apiUrl) {
    if (!empty($submitted_data['username']) && !empty($submitted_data['user_password'])) {
        $username = $submitted_data['username'];
        $password = $submitted_data['user_password'];

        $nextjs_api_url = $apiUrl . "/api/auth/um-login";

        wp_remote_post($nextjs_api_url, [
            'body'    => json_encode(['username' => $username, 'password' => $password]),
            'headers' => ['Content-Type' => 'application/json'],
            'timeout' => 15,
        ]);
    }
});


add_action('template_redirect', function() use ($apiUrl) {
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

            $redirect_url = $apiUrl . '/user/dashboard?url=' . $encoded_email;
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
        const siteUrl = "http://localhost/drsderma-wp"; // Change to your site URL
        const currentUrl = window.location.href; // full URL including domain

        // Match full URLs
        const targetUrls = [
            `${siteUrl}/account/`,
            `${siteUrl}/my-account/`,
            `${siteUrl}/my-account/orders/`,
            `${siteUrl}/my-account/downloads/`,
            `${siteUrl}/my-account/edit-address/`,
            `${siteUrl}/my-account/payment-methods/`,
            `${siteUrl}/my-account/edit-account/`,
            `${siteUrl}/my-account/lost-password/`,
            `${siteUrl}/dashboard/`,
            `${siteUrl}/dashboard/my-profile/`,
            `${siteUrl}/dashboard/enrolled-courses/`,
            `${siteUrl}/dashboard/wishlist/`,
            `${siteUrl}/dashboard/reviews/`,
            `${siteUrl}/dashboard/my-quiz-attempts/`,
            `${siteUrl}/dashboard/purchase_history/`,
            `${siteUrl}/dashboard/question-answer/`,
            `${siteUrl}/dashboard/my-courses/`,
            `${siteUrl}/dashboard/announcements/`,
            `${siteUrl}/dashboard/withdraw/`,
            `${siteUrl}/dashboard/instructor-profile/`,
            `${siteUrl}/dashboard/quiz-attempts/`,
            `${siteUrl}/dashboard/settings/`,
            `${siteUrl}/dashboard/enrolled-courses/active-courses/`,
            `${siteUrl}/dashboard/enrolled-courses/completed-courses/`,
            `${siteUrl}/dashboard/my-courses/pending-courses/`,
            `${siteUrl}/dashboard/my-courses/draft-courses/`,
            `${siteUrl}/dashboard/my-courses/schedule-courses/`,
            `${siteUrl}/dashboard/settings/reset-password/`,
            `${siteUrl}/dashboard/settings/withdraw-settings/`,
            `${siteUrl}/dashboard/settings/social-profile/`
        ];

        if (targetUrls.includes(currentUrl)) {
            const header = document.querySelector("header");
            const footer = document.querySelector("footer");
            const accounts = document.getElementsByClassName("um-account-meta-img-b");

            if (header) header.style.display = "none";
            if (footer) footer.style.display = "none";

            if (accounts.length > 0) {
                Array.from(accounts).forEach(el => {
                    el.style.display = "none";
                });
            }
        }
    });
    </script>
    <?php
}

add_action("wp_footer", "mysite_hide_header_footer_script");

add_filter( 'gettext', 'custom_remove_logout_text', 20, 3 );
function custom_remove_logout_text( $translated_text, $text, $domain ) {
    if ( 'woocommerce' === $domain && 
         strpos( $translated_text, 'not' ) !== false && 
         strpos( $translated_text, 'Log out' ) !== false ) {
        return ''; // remove that part
    }
    return $translated_text;
}




add_action('send_headers', function () use ($apiUrl) {
    header("Content-Security-Policy: frame-ancestors 'self' " . $apiUrl);
});

///login user with phone and email
// Allow login with phone or email in Ultimate Member
add_action('um_submit_form_errors_hook_login', 'um_login_with_phone_or_email', 10, 1);
function um_login_with_phone_or_email( $args ) {
    $username = sanitize_text_field( $args['username'] ?? '' );
    $password = $args['user_password'] ?? '';

    if ( empty($username) || empty($password) ) {
        return;
    }

    $user = null;

    // 1. Try login by username
    $user = get_user_by('login', $username);

    // 2. Try login by email
    if (!$user && is_email($username)) {
        $user = get_user_by('email', $username);
    }

    // 3. Try login by phone (UM field: phone_number_drs_derma)
    if (!$user) {
        global $wpdb;
        $user_id = $wpdb->get_var($wpdb->prepare(
            "SELECT user_id FROM $wpdb->usermeta WHERE meta_key = %s AND meta_value = %s LIMIT 1",
            'phone_number_drs_derma',
            $username
        ));
        if ($user_id) {
            $user = get_user_by('id', $user_id);
        }
    }

    // Validate password
    if ( $user && wp_check_password($password, $user->user_pass, $user->ID) ) {
        //  Successful login
        wp_set_current_user( $user->ID );
        wp_set_auth_cookie( $user->ID, true );
        do_action( 'um_after_user_login', $user->ID );
        wp_redirect( "http://localhost/drsderma-wp/user/" ); // leave as siteUrl
        exit;
    } else {
        UM()->form()->add_error( 'username', __('Invalid login details', 'ultimate-member') );
    }
}


//pass phone number in jwt

/**
 * Allow JWT Authentication login with phone number (Ultimate Member field)
 */
add_filter('authenticate', 'jwt_allow_phone_login', 10, 3);

function jwt_allow_phone_login($user, $username, $password) {
    if (!empty($user) || empty($username) || empty($password)) {
        return $user; // Skip if already authenticated or invalid
    }

    // Search by UM phone field instead of username/email
    global $wpdb;
    $user_id = $wpdb->get_var($wpdb->prepare(
        "SELECT user_id 
         FROM $wpdb->usermeta 
         WHERE meta_key = %s AND meta_value = %s 
         LIMIT 1",
        'phone_number_drs_derma',   // <-- your UM field key
        $username
    ));

    if ($user_id) {
        $wp_user = get_user_by('id', $user_id);
        if ($wp_user && wp_check_password($password, $wp_user->user_pass, $wp_user->ID)) {
            return $wp_user; 
        }
    }

    return $user; // Default behavior (normal username/email)
}
//phone number in jwt token
add_filter('jwt_auth_token_before_dispatch', function($data, $user) {
    // Get phone number from UM custom field
    $phone = get_user_meta($user->ID, 'phone_number_drs_derma', true);

    if ($phone) {
        $data['phone_number'] = $phone;
    }

    return $data;
}, 10, 2);
