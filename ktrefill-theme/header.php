<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container nav-wrap">
        <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php if (has_custom_logo()) {
                the_custom_logo();
            } else { ?>
                <picture>
                    <source srcset="<?php echo get_template_directory_uri(); ?>/images/logo.webp" type="image/webp">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/logo.svg" alt="<?php bloginfo('name'); ?>" class="logo-img">
                </picture>
            <?php } ?>
        </a>

        <nav class="site-nav" aria-label="Primary navigation">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'fallback_cb' => function() {
                    echo '<ul>';
                    echo '<li><a href="' . esc_url(home_url('/buy-airtime.html')) . '">Buy Airtime</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/carrier-esim.html')) . '">Carrier eSIM</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/physical-sim.html')) . '">Physical SIM</a></li>';
                    echo '<li><a href="' . esc_url(home_url('/buy-gift-card.html')) . '">Buy Gift Card</a></li>';
                    echo '</ul>';
                },
                'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s</ul>',
            ));
            ?>
        </nav>

        <div class="header-actions">
            <?php
            $account_url = home_url('/signin.html');
            if (function_exists('wc_get_page_permalink')) {
                $account_url = wc_get_page_permalink('myaccount');
            }
            ?>

            <a href="<?php echo esc_url($account_url); ?>" class="account-link" aria-label="Sign in to your account">
                <svg class="account-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                    <circle cx="12" cy="8" r="4"></circle>
                </svg>
            </a>

            <?php if (function_exists('wc_get_cart_url')) { ?>
                <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="cart-link" aria-label="Shopping cart">
                    <svg class="cart-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
                </a>
            <?php } ?>

            <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>
</header>
