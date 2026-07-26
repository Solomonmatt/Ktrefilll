<footer class="site-footer">
    <div class="container footer-grid">
        <div>
            <a class="brand" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
            <p>Professional digital services for seamless global connectivity.</p>
        </div>
        <div>
            <h3>Quick Links</h3>
            <a href="<?php echo esc_url(home_url('/dashboard.html')); ?>">Dashboard</a>
            <a href="<?php echo esc_url(home_url('/buy-airtime.html')); ?>">Buy Airtime</a>
            <a href="<?php echo esc_url(home_url('/buy-gift-card.html')); ?>">Buy GiftCard</a>
            <a href="<?php echo esc_url(home_url('/physical-sim.html')); ?>">Physical SIM</a>
            <a href="<?php echo esc_url(home_url('/carrier-esim.html')); ?>">Carrier ESIM</a>
            <a href="<?php echo esc_url(home_url('/order-tracking.html')); ?>">Order Tracking</a>
            <a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact us</a>
        </div>
        <div>
            <h3>Resources</h3>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Refund Policy</a>
            <a href="#">Privacy Policy</a>
        </div>
    </div>
    <div class="container footer-bottom">
        <p>© <span id="year"></span> <?php bloginfo('name'); ?>. All rights reserved.</p>
    </div>
</footer>

<button class="float-chat" aria-label="Open support chat">💬</button>

<?php wp_footer(); ?>
</body>
</html>
