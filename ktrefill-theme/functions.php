<?php
function ktrefill_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('woocommerce');
    add_theme_support('custom-logo');

    register_nav_menus(array(
        'primary' => __('Primary Navigation', 'ktrefill-premium'),
    ));
}
add_action('after_setup_theme', 'ktrefill_theme_setup');

function ktrefill_theme_assets() {
    wp_enqueue_style('ktrefill-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
    wp_enqueue_script('ktrefill-script', get_template_directory_uri() . '/script.js', array(), wp_get_theme()->get('Version'), true);
}
add_action('wp_enqueue_scripts', 'ktrefill_theme_assets');

// Update cart count via AJAX
function ktrefill_update_cart_count() {
    wp_send_json(array(
        'count' => WC()->cart->get_cart_contents_count()
    ));
}
add_action('wp_ajax_ktrefill_update_cart', 'ktrefill_update_cart_count');
add_action('wp_ajax_nopriv_ktrefill_update_cart', 'ktrefill_update_cart_count');
