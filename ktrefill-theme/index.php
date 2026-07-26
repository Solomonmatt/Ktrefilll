<?php get_header(); ?>

<main>
    <section class="hero">
        <div class="container hero-grid">
            <div class="hero-copy">
                <p class="eyebrow">Powering 150+ countries</p>
                <h1>Your Portal for International Sims, Topups &amp; GiftCards</h1>
                <p class="hero-text">
                    Seamless airtime, data, gift cards and SIM services for travelers, families and businesses — all delivered with speed, security and style.
                </p>
                <div class="hero-actions">
                    <a class="btn btn-primary" href="<?php echo esc_url(home_url('/signin.html')); ?>">Get Started</a>
                    <a class="btn btn-secondary" href="#services">Explore Services</a>
                </div>
                <div class="hero-quick-links">
                    <a href="<?php echo esc_url(home_url('/physical-sim.html')); ?>">Get International SIM Cards</a>
                    <a href="<?php echo esc_url(home_url('/carrier-esim.html')); ?>">Buy Carrier eSIMs</a>
                    <a href="<?php echo esc_url(home_url('/buy-airtime.html')); ?>">International Topup</a>
                    <a href="<?php echo esc_url(home_url('/buy-gift-card.html')); ?>">Buy Gift Cards</a>
                </div>
                <div class="hero-metrics">
                    <div>
                        <strong data-count="5" data-suffix="/5">0/5</strong>
                        <span>Rated by users</span>
                    </div>
                    <div>
                        <strong data-count="150" data-suffix="+">0+</strong>
                        <span>Countries</span>
                    </div>
                    <div>
                        <strong data-count="1100000" data-suffix="+">0+</strong>
                        <span>Customers</span>
                    </div>
                </div>
            </div>

            <div class="hero-media">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/images/hero-illustration.svg'); ?>" alt="Global connectivity and digital services illustration" />
                <div class="hero-badge">
                    <span>4.9/5</span>
                    <strong>Rated by 5,000+ real users</strong>
                </div>
            </div>
        </div>
    </section>

    <section class="logo-strip">
        <div class="container">
            <p>Trusted by partners across telecommunications and digital commerce</p>
            <div class="logo-grid" aria-label="Partner logos">
                <span>Airtel</span>
                <span>Vodafone</span>
                <span>Amazon</span>
                <span>Apple</span>
                <span>Google Play</span>
            </div>
        </div>
    </section>

    <section id="services" class="section">
        <div class="container">
            <div class="section-head">
                <p class="eyebrow">Why Choose Us</p>
                <h2>Premium services for fast international transactions.</h2>
                <p>From local recharges to global gift cards, every solution is created to feel effortless and dependable.</p>
            </div>
            <div class="feature-grid">
                <article class="feature-card">
                    <div class="icon">✦</div>
                    <h3>Global Mobile Top-Ups</h3>
                    <p>Recharge phones instantly across 150+ countries with a simple and secure experience.</p>
                </article>
                <article class="feature-card">
                    <div class="icon">⚡</div>
                    <h3>Instant Delivery</h3>
                    <p>Enjoy lightning-fast top-ups, wallet transfers and digital gift card delivery in minutes.</p>
                </article>
                <article class="feature-card">
                    <div class="icon">♾</div>
                    <h3>No Limits</h3>
                    <p>Move funds freely with wallet-friendly transfers and flexible global payments.</p>
                </article>
                <article class="feature-card">
                    <div class="icon">🌐</div>
                    <h3>International SIM &amp; eSIM Services</h3>
                    <p>Stay connected wherever you go with physical SIMs and digital eSIMs for travel and business.</p>
                </article>
                <article class="feature-card">
                    <div class="icon">🔒</div>
                    <h3>Security</h3>
                    <p>Advanced encryption and secure checkout keep every transaction protected.</p>
                </article>
                <article class="feature-card">
                    <div class="icon">💬</div>
                    <h3>Support</h3>
                    <p>Reach our team on chat, email or WhatsApp whenever you need assistance.</p>
                </article>
            </div>
        </div>
    </section>

    <section class="section showcase-section">
        <div class="container showcase-grid">
            <div class="showcase-copy">
                <p class="eyebrow">Our Mission</p>
                <h2>Connecting people worldwide with speed, security and innovation.</h2>
                <p>
                    At KT Refill, our mission is simple: deliver fast, secure and modern digital solutions that connect people across borders and create confidence in every transaction.
                </p>
                <ul class="check-list">
                    <li>Instant delivery for top-ups and gift cards</li>
                    <li>Trusted support around the clock</li>
                    <li>Reliable SIM and eSIM service for every trip</li>
                </ul>
            </div>
            <div class="showcase-card">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/images/hero-illustration.svg'); ?>" alt="Modern digital connectivity concept" />
            </div>
        </div>
    </section>

    <section id="reviews" class="section">
        <div class="container">
            <div class="section-head">
                <p class="eyebrow">Client Feedback</p>
                <h2>Loved by customers across the globe.</h2>
            </div>
            <div class="testimonial-grid">
                <article class="testimonial-card">
                    <p>“The experience is smooth, quick and incredibly dependable for family recharges.”</p>
                    <strong>Julia Keys</strong>
                    <span>United Kingdom</span>
                </article>
                <article class="testimonial-card">
                    <p>“Their eSIM delivery made travel effortless. I was connected within minutes.”</p>
                    <strong>Carlos Moon</strong>
                    <span>United States</span>
                </article>
                <article class="testimonial-card">
                    <p>“A professional service that feels premium from start to finish.”</p>
                    <strong>Emeka John</strong>
                    <span>Nigeria</span>
                </article>
            </div>
        </div>
    </section>

    <section id="faq" class="section faq-section">
        <div class="container">
            <div class="section-head">
                <p class="eyebrow">Frequently Asked Questions</p>
                <h2>Everything you need to know before getting started.</h2>
            </div>
            <div class="faq-list">
                <article class="faq-item active">
                    <button class="faq-question" type="button">
                        What is KT Refill?
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>KT Refill is a trusted platform for international top-ups, SIM services, eSIMs and gift cards.</p>
                    </div>
                </article>
                <article class="faq-item">
                    <button class="faq-question" type="button">
                        Who can use the service?
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Individuals, travelers, businesses and resellers can use the platform for fast digital transactions.</p>
                    </div>
                </article>
                <article class="faq-item">
                    <button class="faq-question" type="button">
                        How fast is delivery?
                        <span>+</span>
                    </button>
                    <div class="faq-answer">
                        <p>Most transactions are completed instantly or within minutes depending on the service selected.</p>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <section class="section links-section">
        <div class="container link-grid">
            <article class="link-card">
                <h3>Get International SIM Cards</h3>
                <p>Stay connected through physical SIMs tailored for international travel and business use.</p>
                <a href="<?php echo esc_url(home_url('/physical-sim.html')); ?>">Explore SIMs</a>
            </article>
            <article class="link-card">
                <h3>Buy Carrier eSIMs</h3>
                <p>Activate a digital connection in minutes without waiting for delivery.</p>
                <a href="<?php echo esc_url(home_url('/carrier-esim.html')); ?>">Explore eSIMs</a>
            </article>
            <article class="link-card">
                <h3>International Topup</h3>
                <p>Recharge family, friends and customers around the world in a few simple steps.</p>
                <a href="<?php echo esc_url(home_url('/buy-airtime.html')); ?>">Top Up Now</a>
            </article>
            <article class="link-card">
                <h3>Buy Gift Cards</h3>
                <p>Send trusted digital gift cards effortlessly for personal or professional use.</p>
                <a href="<?php echo esc_url(home_url('/buy-gift-card.html')); ?>">Shop Gift Cards</a>
            </article>
        </div>
    </section>

    <section id="signup" class="section cta-section">
        <div class="container cta-card">
            <div>
                <p class="eyebrow">Join over 1,153,800 customers</p>
                <h2>Experience global connectivity with a professional, modern platform.</h2>
            </div>
            <a class="btn btn-primary" href="#">Sign Up Free</a>
        </div>
    </section>
</main>

<?php get_footer(); ?>
