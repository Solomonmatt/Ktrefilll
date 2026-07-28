const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const STORAGE_KEYS = {
  orders: 'ktrefill_orders',
  profile: 'ktrefill_profile',
  session: 'ktrefill_session',
  users: 'ktrefill_users',
  reloadly: 'ktrefill_reloadly_config',
  giftcards: 'ktrefill_gift_cards',
  cart: 'ktrefill_cart',
  selectedEsim: 'ktrefill_selected_esim',
  rememberMe: 'ktrefill_remember_me'
};

const ESIM_FALLBACK_CATALOG = [
  {
    name: 'USA T-Mobile eSIM',
    country: 'United States',
    code: 'US',
    operatorId: 'T-Mobile',
    price: 59985,
    oldPrice: 75000,
    image: 'https://ktrefill.com/wp-content/uploads/2026/01/file_00000000d3087246a619146aedf55cec.png'
  },
  {
    name: 'AT&T eSIM',
    country: 'United States',
    code: 'US',
    operatorId: 'AT&T',
    price: 59970,
    oldPrice: 150000,
    image: 'https://ktrefill.com/wp-content/uploads/2026/01/6b26b4d1-3a60-4a6f-99be-34a13423a202.png'
  },
  {
    name: 'USA Lyca eSIM',
    country: 'United States',
    code: 'US',
    operatorId: 'Lyca Mobile',
    price: 44985,
    oldPrice: 60000,
    image: 'https://ktrefill.com/wp-content/uploads/2026/06/Lycan-esim-image.png'
  },
  {
    name: 'UK Three eSIM',
    country: 'United Kingdom',
    code: 'GB',
    operatorId: 'Three',
    price: 43485,
    oldPrice: 60000,
    image: 'https://ktrefill.com/wp-content/uploads/2026/06/three-esim-image.png'
  },
  {
    name: 'UK Lyca eSIM',
    country: 'United Kingdom',
    code: 'GB',
    operatorId: 'Lyca Mobile',
    price: 43260,
    oldPrice: 60000,
    image: 'https://ktrefill.com/wp-content/uploads/2026/06/Lycan-esim-image.png'
  }
];

const DEFAULT_RELOADLY_CLIENT_ID = 'H6KbktQKut6yCIKTApt9LMrxgZuk0GHS';

const ESIM_DETAILS_PLANS = [
  {
    name: '1 month plan',
    badge: '1 month plan',
    data: '5GB',
    duration: '30 days',
    price: 44985,
    oldPrice: 60000,
    summary: '1-month subscription include',
    renewal: 'Monthly renewal starts from the second month with just $19/month to stay active',
    features: [
      'A USA Number.',
      'Unlimited nationwide talk & text',
      'Unlimited international talk & text to 100 countries'
    ]
  },
  {
    name: '3 months plan',
    badge: '3 months plan',
    data: '1GB',
    duration: '90 days',
    price: 73485,
    oldPrice: 105000,
    summary: '3-month subscription include',
    renewal: 'Monthly renewal starts from the 4th month with just $15/month to stay active',
    features: [
      'A USA Number.',
      'Unlimited nationwide talk & text',
      'Unlimited international talk & text to 100 countries'
    ]
  },
  {
    name: '6 months plan',
    badge: '6 months plan',
    data: '1GB',
    duration: '180 Days',
    price: 118485,
    oldPrice: 149970,
    summary: '6-month subscription include',
    renewal: 'Monthly renewal starts from the 7th month with just $15/month to stay active',
    features: [
      'A USA Number.',
      'Unlimited nationwide talk & text',
      'Unlimited international talk & text to 100 countries'
    ]
  },
  {
    name: '12 months plan',
    badge: '12 months plan',
    data: '1GB',
    duration: '1 year',
    price: 194970,
    oldPrice: 239985,
    summary: '1-Year subscription include',
    renewal: 'Monthly renewal starts from the second year with just $15/month to stay active',
    features: [
      'A USA Number.',
      'Unlimited nationwide talk & text',
      'Unlimited international talk & text to 100 countries'
    ]
  }
];
const DEFAULT_RELOADLY_SECRET = '0yopzY6UnO-j0ovKpgsEvzjIGOsoOm-LK9fMffQPQ62Hogj0SB5eUbpEXYaiTaM';
const DEFAULT_RELOADLY_WEBHOOK_SECRET = '8JAzDX6oUb-3tmQHN7aHN7AWNgg7pi-7fEuHJt8YrSH9txH55WBDykKR0xCJQfj';
const DEFAULT_RELOADLY_API_BASE = 'https://topups.reloadly.com';

const ESIM_PLAN_SCALE_FACTORS = {
  '1 month plan': 1,
  '3 months plan': 73485 / 44985,
  '6 months plan': 118485 / 44985,
  '12 months plan': 194970 / 44985
};

function getEsimPlanPricing(plan, carrier) {
  if (!carrier) {
    return {
      price: plan.price,
      oldPrice: plan.oldPrice
    };
  }

  const factor = ESIM_PLAN_SCALE_FACTORS[plan.name] || 1;
  const basePrice = parseCartAmount(carrier.price);
  const baseOldPrice = parseCartAmount(carrier.oldPrice || carrier.price);
  return {
    price: Math.max(0, Math.round(basePrice * factor)),
    oldPrice: baseOldPrice ? Math.max(0, Math.round(baseOldPrice * factor)) : 0
  };
}
const DEFAULT_RELOADLY_AUDIENCE = 'https://topups.reloadly.com';
const FALLBACK_RELOADLY_API_BASE = 'https://topups.reloadly.com';
const FALLBACK_RELOADLY_AUDIENCE = 'https://topups.reloadly.com';
const FALLBACK_COUNTRIES = [
  { code: 'GH', label: 'Ghana' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'KE', label: 'Kenya' },
  { code: 'ZA', label: 'South Africa' },
  { code: 'CA', label: 'Canada' },
  { code: 'IN', label: 'India' },
  { code: 'AE', label: 'United Arab Emirates' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'IT', label: 'Italy' },
  { code: 'AU', label: 'Australia' },
  { code: 'ES', label: 'Spain' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'SE', label: 'Sweden' },
  { code: 'CH', label: 'Switzerland' }
];
const FALLBACK_OPERATORS = {
  GH: [{ id: 'mtn-gh', name: 'MTN Ghana' }, { id: 'airtel-gh', name: 'AirtelTigo' }, { id: 'vodafone-gh', name: 'Vodafone Ghana' }],
  NG: [{ id: 'mtn-ng', name: 'MTN Nigeria' }, { id: 'airtel-ng', name: 'Airtel Nigeria' }, { id: 'glo-ng', name: 'Glo Nigeria' }, { id: '9mobile-ng', name: '9mobile' }],
  US: [{ id: 'att-us', name: 'AT&T' }, { id: 'tmobile-us', name: 'T-Mobile' }, { id: 'verizon-us', name: 'Verizon' }],
  GB: [{ id: 'ee-gb', name: 'EE' }, { id: 'o2-gb', name: 'O2' }, { id: 'three-gb', name: 'Three' }, { id: 'vodafone-gb', name: 'Vodafone' }],
  KE: [{ id: 'safaricom-ke', name: 'Safaricom' }, { id: 'airtel-ke', name: 'Airtel Kenya' }, { id: 'telkom-ke', name: 'Telkom Kenya' }],
  ZA: [{ id: 'mtn-za', name: 'MTN South Africa' }, { id: 'vodacom-za', name: 'Vodacom' }, { id: 'cellc-za', name: 'Cell C' }],
  CA: [{ id: 'bell-ca', name: 'Bell' }, { id: 'rogers-ca', name: 'Rogers' }, { id: 'telus-ca', name: 'Telus' }, { id: 'fido-ca', name: 'Fido' }],
  IN: [{ id: 'jio-in', name: 'Jio' }, { id: 'airtel-in', name: 'Airtel' }, { id: 'vi-in', name: 'Vi' }],
  AE: [{ id: 'etisalat-ae', name: 'Etisalat' }, { id: 'du-ae', name: 'du' }],
  DE: [{ id: 'telekom-de', name: 'Telekom' }, { id: 'vodafone-de', name: 'Vodafone' }, { id: 'o2-de', name: 'O2' }],
  FR: [{ id: 'orange-fr', name: 'Orange' }, { id: 'sfr-fr', name: 'SFR' }, { id: 'bouygues-fr', name: 'Bouygues Telecom' }],
  IT: [{ id: 'tim-it', name: 'TIM' }, { id: 'vodafone-it', name: 'Vodafone' }, { id: 'windtre-it', name: 'WindTre' }],
  AU: [{ id: 'telstra-au', name: 'Telstra' }, { id: 'optus-au', name: 'Optus' }, { id: 'vodafone-au', name: 'Vodafone' }],
  ES: [{ id: 'movistar-es', name: 'Movistar' }, { id: 'vodafone-es', name: 'Vodafone' }, { id: 'orange-es', name: 'Orange' }],
  NL: [{ id: 'kpn-nl', name: 'KPN' }, { id: 'vodafone-nl', name: 'Vodafone' }, { id: 'tmobile-nl', name: 'T-Mobile' }],
  SE: [{ id: 'tele2-se', name: 'Tele2' }, { id: 'telia-se', name: 'Telia' }, { id: 'tre-se', name: 'Telenor' }],
  CH: [{ id: 'swisscom-ch', name: 'Swisscom' }, { id: 'salt-ch', name: 'Salt' }, { id: 'sunrise-ch', name: 'Sunrise' }]
};

const demoOrders = [
  {
    id: 'KT-1001',
    service: 'airtime',
    status: 'Processing',
    submittedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    payload: {
      country: 'Ghana',
      amount: '40',
      phone: '+233 20 000 0000'
    }
  },
  {
    id: 'KT-1002',
    service: 'giftcard',
    status: 'Delivered',
    submittedAt: new Date(Date.now() - 14600000).toISOString(),
    payload: {
      brand: 'Apple',
      amount: '50',
      recipient: 'Family'
    }
  }
];

function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCartItems() {
  return getStoredJson(STORAGE_KEYS.cart, []);
}

function setCartItems(items) {
  setStoredJson(STORAGE_KEYS.cart, Array.isArray(items) ? items : []);
}

function setSelectedEsimPlan(plan) {
  setStoredJson(STORAGE_KEYS.selectedEsim, plan || null);
}

function getSelectedEsimPlan() {
  const raw = getStoredJson(STORAGE_KEYS.selectedEsim, null);
  if (!raw) return null;
  if (raw.carrier) return raw;
  return { carrier: raw, plan: null };
}

function clearSelectedEsimPlan() {
  localStorage.removeItem(STORAGE_KEYS.selectedEsim);
}

function parseCartAmount(amount) {
  if (typeof amount === 'number') return amount;
  const str = String(amount || '').replace(/,/g, '');
  const match = str.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function addCartItem(item) {
  const items = getCartItems();
  items.push(item);
  setCartItems(items);
  syncCartUi();
  return items;
}

function removeCartItem(index) {
  const items = getCartItems();
  if (index < 0 || index >= items.length) return items;
  items.splice(index, 1);
  setCartItems(items);
  syncCartUi();
  return items;
}

function clearCart() {
  setCartItems([]);
  syncCartUi();
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => sum + Number(item.quantity || 1), 0);
}

function syncCartUi() {
  const cartBadges = document.querySelectorAll('.cart-count, #cart-count');
  const total = getCartTotal();
  cartBadges.forEach((badge) => {
    badge.textContent = String(total);
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

function getReloadlyConfig() {
  return getStoredJson(STORAGE_KEYS.reloadly, {
    apiBase: DEFAULT_RELOADLY_API_BASE,
    clientId: DEFAULT_RELOADLY_CLIENT_ID,
    clientSecret: DEFAULT_RELOADLY_SECRET,
    audience: DEFAULT_RELOADLY_AUDIENCE,
    accessToken: ''
  });
}

function seedReloadlyConfig() {
  const stored = getStoredJson(STORAGE_KEYS.reloadly, null);
  const config = {
    apiBase: stored?.apiBase || DEFAULT_RELOADLY_API_BASE,
    clientId: stored?.clientId || DEFAULT_RELOADLY_CLIENT_ID,
    clientSecret: stored?.clientSecret || DEFAULT_RELOADLY_SECRET,
    audience: stored?.audience || DEFAULT_RELOADLY_AUDIENCE,
    accessToken: stored?.accessToken || ''
  };

  if (!stored || !stored.clientSecret || !stored.clientId) {
    setStoredJson(STORAGE_KEYS.reloadly, config);
  }
}

function hasReloadlyCredentials(config) {
  if (!config) return false;
  const hasAccessToken = Boolean(config.accessToken && String(config.accessToken).trim());
  const hasRealCredentials = Boolean(
    config.clientId && config.clientSecret &&
    config.clientId !== DEFAULT_RELOADLY_CLIENT_ID &&
    config.clientSecret !== DEFAULT_RELOADLY_SECRET
  );
  return hasAccessToken || hasRealCredentials;
}

function ensureDemoOrders() {
  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    setStoredJson(STORAGE_KEYS.orders, demoOrders);
  }
}

function getOrders() {
  return getStoredJson(STORAGE_KEYS.orders, []);
}

function setOrders(orders) {
  setStoredJson(STORAGE_KEYS.orders, orders);
}

function getUsers() {
  return getStoredJson(STORAGE_KEYS.users, []);
}

function setUsers(users) {
  setStoredJson(STORAGE_KEYS.users, Array.isArray(users) ? users : []);
}

function saveUser(user) {
  const normalizedEmail = String(user?.email || '').trim().toLowerCase();
  if (!normalizedEmail) return null;

  const users = getUsers();
  const existingIndex = users.findIndex((entry) => String(entry?.email || '').trim().toLowerCase() === normalizedEmail);
  const normalizedUser = {
    ...user,
    email: normalizedEmail,
    name: user?.name || normalizedEmail.split('@')[0],
    provider: user?.provider || 'local'
  };

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...normalizedUser };
  } else {
    users.push(normalizedUser);
  }

  setUsers(users);
  return normalizedUser;
}

function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return null;
  return getUsers().find((entry) => String(entry?.email || '').trim().toLowerCase() === normalizedEmail) || null;
}

function getProfile() {
  return getStoredJson(STORAGE_KEYS.profile, null);
}

function setProfile(profile) {
  if (profile?.email) {
    saveUser(profile);
  }
  setStoredJson(STORAGE_KEYS.profile, profile);
}

function getSession() {
  return getStoredJson(STORAGE_KEYS.session, null);
}

function buildSessionData(profile, overrides = {}) {
  const timestamp = new Date().toISOString();
  const deviceName = overrides.deviceName || 'Unknown device';
  return {
    email: profile?.email || '',
    name: profile?.name || profile?.email?.split('@')[0] || 'Guest',
    provider: profile?.provider || 'local',
    signedInAt: timestamp,
    lastLoginAt: timestamp,
    loginLocation: 'Checking location…',
    ipAddress: 'Checking IP…',
    sessionId: `sess-${Date.now().toString(36)}`,
    deviceName,
    ...overrides
  };
}

function setSession(session) {
  setStoredJson(STORAGE_KEYS.session, session);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getWalletBalance() {
  const orders = getOrders();
  const totalSpent = orders.reduce((sum, order) => {
    const amount = order?.payload?.amount;
    const parsed = parseFloat(String(amount).replace(/[^0-9.-]/g, ''));
    return sum + (Number.isFinite(parsed) ? parsed : 0);
  }, 0);
  const fundingBalance = Number(getStoredJson('ktrefill_wallet_balance', 0));
  const baseBalance = 1240;
  return Math.max(0, baseBalance - totalSpent + fundingBalance);
}

function setWalletBalance(amount) {
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
  setStoredJson('ktrefill_wallet_balance', parsedAmount);
  updateDashboardSummary();
}

function initWalletFunding() {
  const addMoneyButton = document.querySelector('[data-add-money]');
  const modal = document.getElementById('wallet-modal');
  const closeButtons = modal?.querySelectorAll('[data-close-wallet-modal]');
  const form = modal?.querySelector('[data-wallet-form]');

  if (!addMoneyButton || !modal || !form) return;

  addMoneyButton.addEventListener('click', () => {
    modal.hidden = false;
    const amountInput = form.querySelector('input[name="amount"]');
    if (amountInput) amountInput.focus();
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      modal.hidden = true;
      form.reset();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const amountInput = form.querySelector('input[name="amount"]');
    const paymentInput = form.querySelector('select[name="paymentMethod"]');
    if (!amountInput || !paymentInput) return;

    const amount = Number(amountInput.value);
    if (!Number.isFinite(amount) || amount <= 0) return;

    setWalletBalance(amount);
    modal.hidden = true;
    form.reset();
    const statusBox = document.querySelector('.status-message');
    if (statusBox) {
      statusBox.textContent = `Your wallet has been topped up with $${amount.toFixed(2)}.`;
      statusBox.className = 'status-message success';
    }
  });
}

function authenticateLocalUser(email, password) {
  const profile = findUserByEmail(email);
  if (!profile || !profile.email) {
    return { success: false, message: 'Account not found. Please sign up or use a different email.' };
  }
  if (profile.provider === 'local') {
    if (!profile.password || profile.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    return { success: true, profile };
  }
  return { success: false, message: `Please sign in with ${profile.provider} or create a local account.` };
}

function showStatus(element, message, state = 'success') {
  if (!element) return;
  element.textContent = message;
  element.className = `status-message show ${state}`;
}

function recordOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  setOrders(orders.slice(0, 24));
  updateDashboardSummary();
}

function updateDashboardSummary() {
  const summaryRoot = document.querySelector('[data-dashboard-summary]');
  if (!summaryRoot) return;

  const orders = getOrders();
  const active = orders.length;
  const delivered = orders.filter((entry) => entry.status.toLowerCase() === 'delivered').length;

  const dashboardNodes = {
    balance: summaryRoot.querySelector('[data-stat="balance"]'),
    activeOrders: summaryRoot.querySelector('[data-stat="active-orders"]'),
    completed: summaryRoot.querySelector('[data-stat="completed"]'),
    support: summaryRoot.querySelector('[data-stat="support"]')
  };

  const balanceValue = `$${getWalletBalance().toFixed(2)}`;
  if (dashboardNodes.balance) {
    dashboardNodes.balance.textContent = balanceValue;
    dashboardNodes.balance.dataset.fullValue = balanceValue;
  }
  if (dashboardNodes.activeOrders) dashboardNodes.activeOrders.textContent = String(active);
  if (dashboardNodes.completed) dashboardNodes.completed.textContent = String(delivered);
  if (dashboardNodes.support) dashboardNodes.support.textContent = '24/7 live help';

  const list = summaryRoot.querySelector('.dashboard-list');
  if (list) {
    list.innerHTML = orders.slice(0, 4).map((entry) => {
      const item = entry.payload && entry.payload.phone ? entry.payload.phone : entry.service;
      return `<li>${entry.id} · ${entry.service.toUpperCase()} · ${entry.status} · ${item}</li>`;
    }).join('');
  }
}

function updateHeaderAuthState() {
  const session = getSession();
  const accountLinks = document.querySelectorAll('.account-link');
  const profileToggles = document.querySelectorAll('.profile-toggle');
  const profileNames = document.querySelectorAll('.profile-name');
  const profileEmails = document.querySelectorAll('.profile-email');

  if (session?.email) {
    const displayName = session.name || session.email.split('@')[0];
    accountLinks.forEach((link) => {
      link.setAttribute('href', './dashboard.html');
      link.setAttribute('aria-label', `Go to ${displayName}'s dashboard`);
      link.innerHTML = `<span class="account-pill">${displayName}</span>`;
    });

    profileToggles.forEach((toggle) => {
      const nameNode = toggle.querySelector('.profile-name');
      if (nameNode) nameNode.textContent = displayName;
    });

    profileNames.forEach((node) => {
      node.textContent = displayName;
    });

    profileEmails.forEach((node) => {
      node.textContent = session.email;
    });
  } else {
    accountLinks.forEach((link) => {
      link.setAttribute('href', './signin.html');
      link.setAttribute('aria-label', 'Sign in to your account');
      link.innerHTML = `
        <svg class="account-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21a8 8 0 0 0-16 0"></path>
          <circle cx="12" cy="8" r="4"></circle>
        </svg>
      `;
    });
  }
}

function initNavigation() {
  updateHeaderAuthState();

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('open', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
        siteNav.classList.remove('active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function initFaqs() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      faqItems.forEach((entry) => {
        if (entry !== item) {
          entry.classList.remove('active');
        }
      });

      item.classList.toggle('active');
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounters = () => {
    counters.forEach((counter) => {
      const target = Number(counter.getAttribute('data-count'));
      const duration = 1400;
      const startTime = performance.now();

      const step = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        counter.textContent = `${value}${counter.dataset.suffix || ''}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = `${target}${counter.dataset.suffix || ''}`;
        }
      };

      requestAnimationFrame(step);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function getReloadlyProxyBaseUrl() {
  if (typeof window === 'undefined') {
    return '/api/reloadly';
  }

  if (window.location?.protocol === 'file:') {
    return 'http://127.0.0.1:8000/api/reloadly';
  }

  return '/api/reloadly';
}

async function ensureReloadlyAccessToken(stored = null) {
  const config = stored || getReloadlyConfig();
  if (!config) return null;
  if (config.accessToken) return config.accessToken;

  const audiences = [config.audience || DEFAULT_RELOADLY_AUDIENCE, FALLBACK_RELOADLY_AUDIENCE];

  for (const audience of audiences) {
    try {
      const authResponse = await fetch(`${getReloadlyProxyBaseUrl()}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audience })
      });

      const authData = await authResponse.json();
      if (authResponse.ok && authData.access_token) {
        const nextConfig = { ...config, accessToken: authData.access_token, audience };
        setStoredJson(STORAGE_KEYS.reloadly, nextConfig);
        return authData.access_token;
      }
    } catch {
      // continue to the next fallback target
    }
  }

  return null;
}

function getFallbackCountryOptions() {
  return FALLBACK_COUNTRIES;
}

function getFallbackOperatorOptions(countryCode) {
  const normalizedCode = String(countryCode || '').toUpperCase();
  return FALLBACK_OPERATORS[normalizedCode] || FALLBACK_OPERATORS.US;
}

function getCountryCodeCandidates(countryCode) {
  const normalizedCode = String(countryCode || '').trim().toUpperCase();
  return [normalizedCode, normalizedCode.slice(0, 2)].filter(Boolean);
}

function getOperatorCountryCode(operator) {
  const candidates = [
    operator?.country?.isoName,
    operator?.country?.code,
    operator?.countryCode,
    operator?.country?.name
  ];

  return candidates
    .map((value) => String(value || '').trim().toUpperCase())
    .find(Boolean) || '';
}

function filterOperatorsForCountry(operators, countryCode) {
  const normalizedCountryCode = String(countryCode || '').trim().toUpperCase();
  const candidates = getCountryCodeCandidates(normalizedCountryCode);

  if (!normalizedCountryCode) {
    return Array.isArray(operators) ? operators : [];
  }

  const filtered = (Array.isArray(operators) ? operators : []).filter((operator) => {
    const operatorCountryCode = getOperatorCountryCode(operator);
    const operatorName = String(operator?.name || '').toUpperCase();
    const normalizedName = operatorName.replace(/[^A-Z]/g, '');

    const matchesCountry = candidates.some((candidate) => {
      const normalizedCandidate = candidate.slice(0, 2);
      return operatorCountryCode === normalizedCandidate || operatorCountryCode.startsWith(normalizedCandidate) || operatorCountryCode.slice(0, 2) === normalizedCandidate;
    });

    const matchesCountryInName = Boolean(
      normalizedName.includes(normalizedCountryCode) ||
      normalizedName.includes('CANADA') ||
      normalizedName.includes('CANADIAN')
    );

    return matchesCountry || matchesCountryInName;
  });

  return filtered.length ? filtered : [];
}

async function fetchReloadlyCountries() {
  const stored = getReloadlyConfig();
  if (!stored) {
    return getFallbackCountryOptions();
  }

  try {
    const proxyResponse = await fetch(`${getReloadlyProxyBaseUrl()}/countries`, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      return Array.isArray(data) ? data : [];
    }
  } catch {
    // fall through to the fallback options
  }

  const accessToken = await ensureReloadlyAccessToken(stored);
  if (!accessToken) {
    return getFallbackCountryOptions();
  }

  const apiBases = [
    (stored.apiBase || DEFAULT_RELOADLY_API_BASE).replace(/\/$/, ''),
    FALLBACK_RELOADLY_API_BASE,
    DEFAULT_RELOADLY_API_BASE
  ];

  for (const apiBase of apiBases) {
    const response = await fetch(`${apiBase}/countries`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  }

  throw new Error('Unable to load Reloadly countries.');
}

async function fetchReloadlyOperators(countryCode) {
  const stored = getReloadlyConfig();
  if (!stored) {
    return getFallbackOperatorOptions(countryCode);
  }

  try {
    const proxyResponse = await fetch(`${getReloadlyProxyBaseUrl()}/operators?countryCode=${encodeURIComponent(countryCode)}`, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      const operators = Array.isArray(data) ? data : [];
      const filteredOperators = filterOperatorsForCountry(operators, countryCode);
      return filteredOperators.length ? filteredOperators : getFallbackOperatorOptions(countryCode);
    }
  } catch {
    // fall through to the fallback options
  }

  const accessToken = await ensureReloadlyAccessToken(stored);
  if (!accessToken) {
    return getFallbackOperatorOptions(countryCode);
  }

  const apiBases = [
    (stored.apiBase || DEFAULT_RELOADLY_API_BASE).replace(/\/$/, ''),
    FALLBACK_RELOADLY_API_BASE,
    DEFAULT_RELOADLY_API_BASE
  ];

  for (const apiBase of apiBases) {
    const response = await fetch(`${apiBase}/operators?countryCode=${encodeURIComponent(countryCode)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const operators = Array.isArray(data) ? data : [];
      const filteredOperators = filterOperatorsForCountry(operators, countryCode);
      return filteredOperators.length ? filteredOperators : getFallbackOperatorOptions(countryCode);
    }
  }

  return getFallbackOperatorOptions(countryCode);
}

function normalizeCountryOption(country) {
  const code = country?.countryCode || country?.isoCode || country?.code || country?.isoName || country?.name || '';
  const label = country?.name || country?.countryName || country?.country || country?.isoName || country?.code || 'Country';
  return {
    code: String(code).toUpperCase(),
    label: String(label)
  };
}

async function populateCountrySelect(select, fallbackCountries = []) {
  if (!select) return;

  const wrapper = select.closest('.custom-select-wrapper');
  const trigger = wrapper?.querySelector('.custom-select-trigger');
  const valueLabel = wrapper?.querySelector('.custom-select-value');
  const panel = wrapper?.querySelector('.custom-select-panel');
  const listRoot = wrapper?.querySelector('.custom-select-options');
  const searchInput = wrapper?.querySelector('.custom-select-search input');

  const existingValue = select.value;
  select.innerHTML = '<option value="">Loading countries...</option>';
  if (valueLabel) valueLabel.textContent = 'Loading countries...';

  const renderOptions = (countries, filter = '') => {
    if (!listRoot) return;
    const normalizedFilter = String(filter || '').toLowerCase().trim();
    const filtered = countries.filter((country) => {
      return country.label.toLowerCase().includes(normalizedFilter) || country.code.toLowerCase().includes(normalizedFilter);
    });

    if (!filtered.length) {
      listRoot.innerHTML = '<li class="custom-select-option">No countries found.</li>';
      return;
    }

    listRoot.innerHTML = filtered.map((country) => {
      const flagSrc = getCountryFlagImageSrc(country.code);
      const flagMarkup = flagSrc
        ? `<span class="flag-icon"><img src="${flagSrc}" alt="${country.label} flag" loading="lazy" decoding="async" onerror="this.onerror=null; this.parentElement.textContent='${getCountryFlagEmoji(country.code)}';" /></span>`
        : `<span class="flag-icon">${getCountryFlagEmoji(country.code)}</span>`;
      return `
        <li class="custom-select-option" role="option" data-value="${country.code}" tabindex="-1">
          ${flagMarkup}
          <span class="option-label">${country.label}</span>
          <span class="option-code">${country.code}</span>
        </li>
      `;
    }).join('');
  };

  const setTriggerValue = (code) => {
    const option = [...select.options].find((opt) => opt.value === code);
    if (!option) return;
    if (valueLabel) valueLabel.textContent = option.textContent || option.value;
    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const closePanel = () => {
    if (!panel || !trigger) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  const openPanel = () => {
    if (!panel || !trigger) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    searchInput?.focus();
  };

  const togglePanel = () => {
    if (!panel) return;
    panel.hidden ? openPanel() : closePanel();
  };

  if (trigger) {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      togglePanel();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const countries = Array.from(select.options)
        .filter((option) => option.value)
        .map((option) => ({ code: option.value, label: option.textContent || option.value }));
      renderOptions(countries, searchInput.value);
    });
  }

  document.addEventListener('click', (event) => {
    if (!wrapper || wrapper.contains(event.target)) return;
    closePanel();
  });

  if (panel) {
    panel.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  if (listRoot) {
    listRoot.addEventListener('click', (event) => {
      const option = event.target.closest('.custom-select-option');
      if (!option) return;
      const code = option.getAttribute('data-value');
      if (code) {
        setTriggerValue(code);
        closePanel();
      }
    });
  }

  try {
    const countries = await fetchReloadlyCountries();
    const normalized = countries.length
      ? countries.map(normalizeCountryOption)
      : fallbackCountries.map((country) => typeof country === 'string' ? { code: country, label: country } : country);

    if (!normalized.length) {
      throw new Error('No countries available');
    }

    select.innerHTML = '<option value="">Select country</option>';
    normalized.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.label;
      select.appendChild(option);
    });

    renderOptions(normalized);
    if (existingValue && [...select.options].some((option) => option.value === existingValue)) {
      setTriggerValue(existingValue);
    }
  } catch {
    const fallbackList = fallbackCountries.map((country) => typeof country === 'string' ? { code: country, label: country } : country);
    select.innerHTML = '<option value="">Select country</option>';
    fallbackList.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.label;
      select.appendChild(option);
    });
    renderOptions(fallbackList);
  }
}

function populateOperatorSelect(form) {
  const countrySelect = form.querySelector('select[name="country"]');
  const operatorSelect = form.querySelector('select[name="operator"]');
  if (!countrySelect || !operatorSelect) return;

  const fallbackCountries = [
    { code: 'GH', label: 'Ghana' },
    { code: 'NG', label: 'Nigeria' },
    { code: 'US', label: 'United States' },
    { code: 'GB', label: 'United Kingdom' }
  ];

  const updateOperators = async () => {
    const country = countrySelect.value;
    const status = form.querySelector('.status-message');
    operatorSelect.innerHTML = '<option value="">Loading operators...</option>';
    operatorSelect.disabled = true;

    if (!country) {
      operatorSelect.innerHTML = '<option value="">Select operator</option>';
      operatorSelect.disabled = true;
      return;
    }

    const config = getReloadlyConfig();
    if (!hasReloadlyCredentials(config)) {
      operatorSelect.innerHTML = '<option value="">Select operator</option>';
      operatorSelect.disabled = false;
      showStatus(status, 'Save your Reloadly Client ID and Client Secret from the Reloadly developer dashboard to load live operators.', 'error');
      return;
    }

    try {
      const countryCode = country.length > 2 ? country.slice(0, 2) : country;
      const operators = await fetchReloadlyOperators(countryCode);
      operatorSelect.innerHTML = '<option value="">Select operator</option>' + operators.map((operator) => {
        const operatorId = operator.operatorId || operator.id || operator.name;
        const operatorName = operator.name || operator.operatorName || operatorId;
        return `<option value="${operatorId}">${operatorName}</option>`;
      }).join('');
      operatorSelect.disabled = false;

      if (!operators.length) {
        showStatus(status, 'No operators were found for this country. Showing the available local options instead.', 'error');
      }
    } catch (error) {
      operatorSelect.innerHTML = '<option value="">Select operator</option>';
      operatorSelect.disabled = false;
      showStatus(status, error.message || 'Reloadly operator lookup failed. Showing the available local options instead.', 'error');
    }
  };

  populateCountrySelect(countrySelect, fallbackCountries).then(() => {
    updateOperators();
  }).finally(() => {
    renderAirtimeCountryGrid();
  });

  countrySelect.addEventListener('change', updateOperators);
}

const COUNTRY_FLAG_URL = 'https://flagcdn.com/w40';

function getCountryFlagImageSrc(countryCode) {
  if (!countryCode) return null;
  const upper = String(countryCode).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return null;
  return `${COUNTRY_FLAG_URL}/${upper.toLowerCase()}.png`;
}

function getCountryFlagEmoji(countryCode) {
  if (!countryCode) return '🌍';
  const upper = String(countryCode).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return '🌍';
  return upper.replace(/./g, (char) => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65));
}

function renderAirtimeCountryGrid() {
  const root = document.getElementById('airtime-country-grid');
  if (!root) return;

  const countrySelect = document.querySelector('.airtime-form select[name="country"]');
  if (!countrySelect) {
    root.innerHTML = '<div class="catalog-loading">Loading available countries…</div>';
    return;
  }

  const countries = Array.from(countrySelect.options)
    .filter((option) => option.value)
    .map((option) => ({ code: option.value, label: option.textContent }));
  const visibleCountries = countries.slice(0, 12);

  if (!countries.length) {
    root.innerHTML = '<div class="catalog-loading">No supported countries are available yet.</div>';
    return;
  }

  const extraCountries = countries.length > visibleCountries.length ? `<article class="country-card"><div><strong>+${countries.length - visibleCountries.length} more</strong><span>countries</span></div></article>` : '';

  root.innerHTML = [...visibleCountries, ...(extraCountries ? [extraCountries] : [])].map((country) => {
    if (typeof country === 'string') return country;

    const flagSrc = getCountryFlagImageSrc(country.code);
    const flagContent = flagSrc
      ? `<img src="${flagSrc}" alt="${country.label} flag" loading="lazy" decoding="async" />`
      : getCountryFlagEmoji(country.code);

    return `
      <article class="country-card">
        <span class="country-flag">${flagContent}</span>
        <div>
          <strong>${country.label}</strong>
          <span>${country.code}</span>
        </div>
      </article>
    `;
  }).join('');
}

async function renderCarrierCatalog() {
  const root = document.querySelector('[data-live-catalog]');
  const statusBox = document.querySelector('[data-live-catalog-status]');
  if (!root) return;

  const selectedCarrierName = getSelectedEsimPlan()?.carrier?.name;

  const renderEsimCards = (items, badgeText = 'eSIM') => {
    root.innerHTML = items.map((item) => {
      const imageSrc = item.image || 'https://ktrefill.com/wp-content/uploads/2026/01/file_00000000d3087246a619146aedf55cec.png';
      const oldPriceHtml = item.oldPrice ? `<span class="old-price">₦${Number(item.oldPrice).toLocaleString()}</span>` : '';
      const isSelectedCarrier = selectedCarrierName === item.name;
      return `
        <article class="product-card${isSelectedCarrier ? ' selected' : ''}"${isSelectedCarrier ? ' data-selected-carrier="true"' : ''}>
          <div class="product-image">
            <img src="${imageSrc}" alt="${item.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='https://ktrefill.com/wp-content/uploads/2026/01/file_00000000d3087246a619146aedf55cec.png';" />
          </div>
          <div>
            <span class="product-tag">${badgeText}</span>
            <h3>${item.name}</h3>
            <p>${item.country} · ${item.operatorId}</p>
          </div>
          <div class="price-row">
            ${oldPriceHtml}
            <span class="new-price">₦${Number(item.price || 0).toLocaleString()}</span>
          </div>
          <a class="btn btn-primary select-plan-button" href="./esim-details.html"
            data-plan-name="${item.name}"
            data-plan-country="${item.country}"
            data-plan-operator="${item.operatorId}"
            data-plan-price="${item.price || 0}"
            data-plan-old-price="${item.oldPrice || item.price || 0}"
            data-plan-image="${imageSrc}">
            ${isSelectedCarrier ? 'Selected' : 'Select plan'}
          </a>
        </article>
      `;
    }).join('');
  };

  renderEsimCards(ESIM_FALLBACK_CATALOG, 'eSIM');

  if (statusBox) {
    showStatus(statusBox, 'Showing ready-to-use eSIM offers while the live catalog is being refreshed.', 'success');
  }

  try {
    const config = getReloadlyConfig();
    if (!hasReloadlyCredentials(config)) {
      return;
    }

    const countries = ['US', 'GB', 'NG', 'CA', 'ZA'];
    const catalog = [];

    for (const countryCode of countries) {
      const operators = await fetchReloadlyOperators(countryCode);
      operators.slice(0, 2).forEach((operator) => {
        catalog.push({
          name: operator.name || `${countryCode} operator`,
          country: operator.countryName || countryCode,
          code: countryCode,
          operatorId: operator.operatorId || 'live',
          price: operator.price || 0,
          oldPrice: operator.oldPrice || operator.price || 0,
          image: operator.logo || operator.image || 'https://ktrefill.com/wp-content/uploads/2026/01/file_00000000d3087246a619146aedf55cec.png'
        });
      });
    }

    const finalCatalog = catalog.length ? catalog.slice(0, 8) : ESIM_FALLBACK_CATALOG;
    renderEsimCards(finalCatalog, 'Live');
    if (statusBox) {
      showStatus(statusBox, 'Live carrier offers loaded successfully.', 'success');
    }
  } catch (error) {
    if (statusBox) {
      showStatus(statusBox, error.message || 'Unable to load live carrier offers. Showing fallback offers.', 'error');
    }
  }
}

function initCarrierEsimSelection() {
  document.body.addEventListener('click', (event) => {
    const button = event.target.closest('a.select-plan-button');
    if (!button) return;

    event.preventDefault();
    setSelectedEsimPlan({
      carrier: {
        name: button.dataset.planName,
        country: button.dataset.planCountry,
        operatorId: button.dataset.planOperator,
        price: parseCartAmount(button.dataset.planPrice),
        oldPrice: parseCartAmount(button.dataset.planOldPrice),
        image: button.dataset.planImage
      },
      plan: null
    });

    const href = button.getAttribute('href') || './esim-details.html';
    window.location.href = href;
  });
}

function renderEsimPlanOptions(selectedName) {
  const root = document.getElementById('esim-plan-options');
  if (!root) return;
  const carrier = getSelectedEsimPlan()?.carrier || null;

  root.innerHTML = ESIM_DETAILS_PLANS.map((item) => {
    const pricing = getEsimPlanPricing(item, carrier);
    const oldPriceHtml = pricing.oldPrice ? `<span class="old-price">₦${Number(pricing.oldPrice).toLocaleString()}</span>` : '';
    const isSelected = selectedName === item.name;
    return `
      <article class="product-card esim-plan-card${isSelected ? ' selected' : ''}" data-esim-plan-select="${item.name}" tabindex="0">
        <div class="plan-card-heading">
          <h3>${item.name}</h3>
          <div class="plan-card-meta">
            <span>📊 ${item.data}</span>
            <span>⏱️ ${item.duration}</span>
          </div>
        </div>
        <div class="price-row plan-price-row">
          ${oldPriceHtml}
          <span class="new-price">₦${Number(pricing.price).toLocaleString()}</span>
        </div>
        <div class="plan-features">
          <p class="plan-summary">${item.summary}</p>
          <ul>
            ${item.features.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
          <p class="plan-renewal">🔄 ${item.renewal}</p>
        </div>
        <button class="btn btn-secondary" type="button" ${isSelected ? 'disabled' : ''}>${isSelected ? 'Selected' : 'Select'}</button>
      </article>
    `;
  }).join('');
}

function initEsimDetailsPage() {
  const root = document.getElementById('esim-details-root');
  if (!root) return;

  const status = document.getElementById('esim-details-status');
  const offerName = document.getElementById('esim-details-offer-name');
  const offerMeta = document.getElementById('esim-details-offer-meta');
  const badge = document.getElementById('esim-details-badge');
  const selectedPlanName = document.getElementById('esim-selected-plan');
  const selectedPrice = document.getElementById('esim-selected-price');
  const selectedOldPrice = document.getElementById('esim-selected-old-price');
  const offerImage = document.getElementById('esim-details-image');
  const carrierImage = document.getElementById('esim-carrier-image');
  const carrierName = document.getElementById('esim-carrier-name');
  const carrierCountry = document.getElementById('esim-carrier-country');
  const carrierHeading = document.getElementById('esim-carrier-heading');
  const carrierDescription = document.getElementById('esim-carrier-description');
  const carrierNote = document.getElementById('esim-carrier-note');
  const form = document.getElementById('esim-details-form');
  const clearButton = document.getElementById('esim-details-clear');
  const backButton = document.getElementById('esim-details-back');
  const contactToggleGroup = document.getElementById('esim-contact-toggle');
  const contactHidden = document.getElementById('esim-contact-hidden');

  const updateDetails = (selectedEsim) => {
    const carrier = selectedEsim?.carrier || null;
    const plan = selectedEsim?.plan || null;

    if (!carrier) {
      offerName.textContent = 'No eSIM carrier selected';
      offerMeta.textContent = 'Please select a carrier eSIM from the catalog first.';
      badge.textContent = 'No carrier selected';
      carrierName.textContent = 'No carrier selected';
      carrierCountry.textContent = 'Select a carrier from the previous page';
      carrierHeading.textContent = 'Choose a carrier to continue';
      carrierDescription.textContent = 'Select an eSIM carrier from the catalog page. Your chosen carrier details and plan options will appear here.';
      carrierNote.textContent = 'Plans and coverage vary by carrier. We recommend reviewing your device compatibility before ordering.';
      selectedPlanName.textContent = 'No plan selected';
      selectedPrice.textContent = 'Select a plan';
      selectedOldPrice.textContent = '';
      if (offerImage) offerImage.src = 'https://ktrefill.com/wp-content/uploads/2026/01/file_00000000d3087246a619146aedf55cec.png';
      if (carrierImage) carrierImage.alt = 'Selected eSIM carrier';
      if (status) showStatus(status, 'Choose a carrier from the catalog page before adding to cart.', 'info');
      renderEsimPlanOptions();
      return;
    }

    offerName.textContent = carrier.name;
    offerMeta.textContent = `${carrier.country} · ${carrier.operatorId}`;
    badge.textContent = 'Selected eSIM';
    carrierName.textContent = carrier.name;
    carrierCountry.textContent = `${carrier.country} · ${carrier.operatorId}`;
    carrierHeading.textContent = carrier.name;
    carrierDescription.textContent = `Enjoy service from ${carrier.operatorId} in ${carrier.country} with instant eSIM activation.`;
    carrierNote.textContent = 'Data allotments, coverage, and pricing may vary by carrier. Please confirm your device compatibility.';
    if (offerImage && carrier.image) offerImage.src = carrier.image;
    if (carrierImage) {
      carrierImage.src = carrier.image || 'https://ktrefill.com/wp-content/uploads/2026/01/file_00000000d3087246a619146aedf55cec.png';
      carrierImage.alt = `${carrier.name} carrier image`;
    }

    if (!plan) {
      selectedPlanName.textContent = 'No plan selected';
      selectedPrice.textContent = 'Choose a duration plan';
      selectedOldPrice.textContent = '';
      if (status) showStatus(status, 'Select a duration plan below before adding to cart.', 'info');
      return;
    }

    selectedPlanName.textContent = plan.name;
    selectedPrice.textContent = `₦${Number(plan.price || 0).toLocaleString()}`;
    selectedOldPrice.textContent = plan.oldPrice ? `₦${Number(plan.oldPrice).toLocaleString()}` : '';
    if (status) status.textContent = '';
  };

  const selectedEsim = getSelectedEsimPlan();
  renderEsimPlanOptions(selectedEsim?.plan?.name);
  updateDetails(selectedEsim);

  document.body.addEventListener('click', (event) => {
    const button = event.target.closest('[data-esim-plan-select]');
    if (!button) return;

    const selectedName = button.dataset.esimPlanSelect;
    const selectedPlan = ESIM_DETAILS_PLANS.find((item) => item.name === selectedName);
    const selectedEsim = getSelectedEsimPlan();
    if (selectedPlan && selectedEsim?.carrier) {
      const planWithPricing = {
        ...selectedPlan,
        ...getEsimPlanPricing(selectedPlan, selectedEsim.carrier)
      };
      const updatedSelection = {
        carrier: selectedEsim.carrier,
        plan: planWithPricing
      };
      setSelectedEsimPlan(updatedSelection);
      renderEsimPlanOptions(selectedPlan.name);
      updateDetails(updatedSelection);
      if (status) showStatus(status, `${selectedPlan.name} selected. Complete your details below.`, 'success');
    }
  });

  clearButton?.addEventListener('click', () => {
    clearSelectedEsimPlan();
    updateDetails(null);
    if (status) showStatus(status, 'eSIM selection cleared.', 'success');
  });

  backButton?.addEventListener('click', () => {
    window.location.href = './carrier-esim.html';
  });

  contactToggleGroup?.addEventListener('click', (event) => {
    const button = event.target.closest('.contact-toggle');
    if (!button) return;
    contactToggleGroup.querySelectorAll('.contact-toggle').forEach((toggle) => {
      toggle.classList.toggle('active', toggle === button);
    });
    if (contactHidden) {
      contactHidden.value = button.dataset.contact || 'WhatsApp';
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedEsim = getSelectedEsimPlan();
    if (!selectedEsim?.carrier) {
      if (status) showStatus(status, 'Select a carrier eSIM before adding to cart.', 'error');
      return;
    }

    if (!selectedEsim?.plan) {
      if (status) showStatus(status, 'Select a duration plan before adding to cart.', 'error');
      return;
    }

    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const phoneModel = formData.get('phoneModel')?.toString().trim();
    const preferredContact = formData.get('preferredContact')?.toString().trim();

    if (!name || !email || !phone || !phoneModel || !preferredContact) {
      if (status) showStatus(status, 'Please complete all required fields before adding to cart.', 'error');
      return;
    }

    addCartItem({
      service: 'esim',
      name: `${selectedEsim.carrier.name} · ${selectedEsim.plan.name}`,
      amount: selectedEsim.plan.price,
      quantity: 1,
      description: `${selectedEsim.carrier.operatorId} eSIM · ${selectedEsim.plan.name} · ${phoneModel} · ${preferredContact}`
    });

    updateCartCount();
    if (status) showStatus(status, `${selectedEsim.plan.name} added to cart successfully.`, 'success');
  });
}

function createGiftCardImage(name, colors = ['#d8a542', '#8b5cf6'], suffix = 'default') {
  const normalizedName = String(name || 'Gift').toLowerCase();
  const compactName = normalizedName.replace(/[^a-z0-9]+/g, '').trim();
  const brandLogoMap = {
    apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    amazon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'google play': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Play_2022_icon.svg',
    googleplay: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Play_2022_icon.svg',
    google: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Play_2022_icon.svg',
    steam: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
    mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
    netflix: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    spotify: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    nike: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    adidas: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    uber: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg',
    airbnb: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    starbucks: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Starbucks_Corporation_Logo_2011.svg',
    sephora: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Sephora_logo.svg',
    target: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg',
    walmart: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Walmart_logo.svg',
    ebay: 'https://upload.wikimedia.org/wikipedia/commons/4/48/EBay_logo.png',
    playstation: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
    xbox: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_logo.svg',
    disney: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    'hbo max': 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
    hbo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
    'best buy': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Best_Buy_logo_2018.svg',
    bestbuy: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Best_Buy_logo_2018.svg',
    'american express': 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
    amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg'
  };

  const matchCandidates = [
    normalizedName,
    normalizedName.replace(/gift card(s)?/g, '').trim(),
    normalizedName.replace(/gift cards?/g, '').trim(),
    normalizedName.replace(/[^a-z\s]+/g, '').trim(),
    compactName,
    normalizedName.replace(/\s+/g, '')
  ];

  let matchedLogo = '';
  for (const candidate of matchCandidates) {
    if (brandLogoMap[candidate]) {
      matchedLogo = brandLogoMap[candidate];
      break;
    }
  }

  if (!matchedLogo) {
    for (const [key, logoUrl] of Object.entries(brandLogoMap)) {
      if (normalizedName.includes(key) || compactName.includes(key.replace(/[^a-z0-9]+/g, '').trim())) {
        matchedLogo = logoUrl;
        break;
      }
    }
  }

  if (matchedLogo) {
    return `<img class="giftcard-image" src="${matchedLogo}" alt="${name} logo" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`;
  }

  const initials = (name || 'Gift')
    .split(' ')
    .map((word) => word[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [primaryColor, secondaryColor] = colors;
  const gradientId = `gift-card-gradient-${suffix}`;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" role="img" aria-label="${name} gift card illustration">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="${secondaryColor}" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" rx="24" fill="#0b0b0b" />
      <rect x="16" y="16" width="208" height="128" rx="20" fill="url(#${gradientId})" opacity="0.95" />
      <rect x="32" y="38" width="176" height="24" rx="12" fill="rgba(255,255,255,0.2)" />
      <rect x="36" y="82" width="108" height="12" rx="6" fill="rgba(255,255,255,0.24)" />
      <rect x="36" y="104" width="84" height="10" rx="5" fill="rgba(255,255,255,0.2)" />
      <circle cx="188" cy="94" r="24" fill="rgba(255,255,255,0.18)" />
      <text x="120" y="104" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#fff">${initials}</text>
    </svg>`;
}

function resolveGiftCardImage(item) {
  if (typeof item?.image === 'string') return item.image;
  if (item?.image?.url) return item.image.url;
  if (item?.image?.src) return item.image.src;
  if (item?.logo?.url) return item.logo.url;
  if (item?.logo?.src) return item.logo.src;
  if (item?.thumbnail?.url) return item.thumbnail.url;
  if (item?.thumbnail?.src) return item.thumbnail.src;
  if (item?.mediaUrl) return item.mediaUrl;
  if (item?.icon) return item.icon;
  if (item?.imageUrl) return item.imageUrl;
  return '';
}

function normalizeGiftCardItem(item, index) {
  const name = item?.name || item?.brandName || item?.brand || item?.title || item?.productName || `Gift Card ${index + 1}`;
  const category = item?.category || item?.type || item?.group || 'Digital Gift Card';
  const region = item?.region || item?.country || item?.market || 'Global';
  const amount = item?.amount || item?.price || item?.minAmount || item?.startingPrice || item?.currency || 'From $10';
  const description = item?.description || item?.shortDescription || item?.summary || `${name} gift card available for instant delivery.`;
  const tag = item?.tag || item?.badge || item?.status || 'Featured';
  const imageUrl = resolveGiftCardImage(item);
  const colors = item?.colors || [
    item?.primaryColor || '#d8a542',
    item?.secondaryColor || '#8b5cf6'
  ];

  return {
    name: String(name),
    category: String(category),
    region: String(region),
    amount: String(amount),
    description: String(description),
    tag: String(tag),
    imageUrl: String(imageUrl || ''),
    colors
  };
}

function normalizeGiftCardVariants(item, index) {
  const baseItem = normalizeGiftCardItem(item, index);
  const variantSources = [
    item?.denominations,
    item?.amounts,
    item?.values,
    item?.prices,
    item?.variants,
    item?.options
  ];

  for (const source of variantSources) {
    if (Array.isArray(source) && source.length) {
      return source.map((variant, variantIndex) => {
        const variantData = typeof variant === 'object' && variant !== null ? variant : { amount: variant };
        const variantName = variantData?.name || variantData?.title || variantData?.productName || variantData?.brandName || baseItem.name;
        const variantAmount = variantData?.amount || variantData?.price || variantData?.value || variantData?.denomination || variantData?.displayAmount || baseItem.amount;
        const variantDescription = variantData?.description || variantData?.shortDescription || variantData?.summary || baseItem.description;
        const variantImageUrl = resolveGiftCardImage({ ...item, ...variantData });

        return {
          ...baseItem,
          name: String(variantName),
          amount: String(variantAmount || baseItem.amount),
          description: String(variantDescription || baseItem.description),
          imageUrl: String(variantImageUrl || baseItem.imageUrl || ''),
          tag: String(variantData?.tag || baseItem.tag),
          colors: variantData?.colors || baseItem.colors
        };
      });
    }
  }

  return [baseItem];
}

function normalizeGiftCardPayload(payload) {
  if (Array.isArray(payload)) {
    return payload.flatMap((item, index) => normalizeGiftCardVariants(item, index));
  }

  const candidateCollections = [
    payload?.giftCards,
    payload?.items,
    payload?.products,
    payload?.brands,
    payload?.data,
    payload?.results,
    payload?.catalog
  ];

  for (const candidate of candidateCollections) {
    if (Array.isArray(candidate)) {
      return candidate.flatMap((item, index) => normalizeGiftCardVariants(item, index));
    }
  }

  if (payload && typeof payload === 'object') {
    return normalizeGiftCardVariants(payload, 0);
  }

  return [];
}

async function fetchGiftCardCatalogFromApi() {
  const config = getReloadlyConfig();
  const proxyBase = getReloadlyProxyBaseUrl();
  const customEndpointCandidates = [
    window.KTREFILL_GIFTCARDS_API_URL,
    window.KTREFILL_GIFT_CARDS_API_URL,
    window.KTREFILL_GIFT_CARD_API_URL,
    window.__KTREFILL_GIFT_CARD_API_URL__,
    window.__KTREFILL_GIFT_CARDS_API_URL__
  ].filter(Boolean);

  const headers = { Accept: 'application/json' };
  const accessToken = await ensureReloadlyAccessToken(config);
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const endpointCandidates = [];
  endpointCandidates.push(`${proxyBase}/giftcards`);
  endpointCandidates.push(`${proxyBase}/products?productType=giftcard`);
  const apiBases = [
    (config?.apiBase || DEFAULT_RELOADLY_API_BASE).replace(/\/$/, ''),
    FALLBACK_RELOADLY_API_BASE,
    DEFAULT_RELOADLY_API_BASE
  ].filter(Boolean);

  apiBases.forEach((apiBase) => {
    endpointCandidates.push(`${apiBase}/giftcards`);
    endpointCandidates.push(`${apiBase}/giftcards?size=100`);
    endpointCandidates.push(`${apiBase}/giftcards?countryCode=US`);
    endpointCandidates.push(`${apiBase}/products`);
    endpointCandidates.push(`${apiBase}/products?size=100`);
    endpointCandidates.push(`${apiBase}/products?productType=giftcard`);
  });

  endpointCandidates.push(...customEndpointCandidates);
  endpointCandidates.push('/wp-json/ktrefill/v1/giftcards');
  endpointCandidates.push('/wp-json/ktrefill/v1/gift-cards');
  endpointCandidates.push('/api/giftcards');
  endpointCandidates.push('https://topups.reloadly.com/giftcards');
  endpointCandidates.push('https://topups-sandbox.reloadly.com/giftcards');
  endpointCandidates.push('https://topups.reloadly.com/products');
  endpointCandidates.push('https://topups-sandbox.reloadly.com/products');

  const seen = new Set();
  for (const endpoint of endpointCandidates) {
    if (!endpoint || seen.has(endpoint)) continue;
    seen.add(endpoint);

    try {
      const response = await fetch(endpoint, { headers });

      if (!response.ok) continue;

      const payload = await response.json();
      const normalized = normalizeGiftCardPayload(payload);
      if (normalized.length) {
        setStoredJson(STORAGE_KEYS.giftcards, normalized);
        return normalized;
      }
    } catch {
      continue;
    }
  }

  return [];
}

const GIFT_CARD_CATALOG = [
  { name: 'Apple Gift Card', category: 'App Store', region: 'Global', amount: 'From $25', description: 'Perfect for iPhone, iPad, Mac, and Apple services.', tag: 'Top seller', colors: ['#f5c542', '#ff7a59'] },
  { name: 'Apple App Store', category: 'Apps & Games', region: 'Global', amount: 'From $15', description: 'Great for apps, games, subscriptions, and digital content.', tag: 'Instant', colors: ['#f5c542', '#ff7a59'] },
  { name: 'Apple Music', category: 'Entertainment', region: 'Global', amount: 'From $10', description: 'Redeem for music, playlists, and premium listening.', tag: 'Popular', colors: ['#f5c542', '#ff7a59'] },
  { name: 'Apple TV+', category: 'Streaming', region: 'Global', amount: 'From $15', description: 'Stream shows, films, and original Apple TV+ content.', tag: 'Streaming', colors: ['#f5c542', '#ff7a59'] },
  { name: 'Apple Arcade', category: 'Gaming', region: 'Global', amount: 'From $10', description: 'Enjoy exclusive Apple Arcade games and subscriptions.', tag: 'Gaming', colors: ['#f5c542', '#ff7a59'] },
  { name: 'Amazon', category: 'Shopping', region: 'US & Global', amount: 'From $20', description: 'Shop electronics, essentials, and everyday favorites.', tag: 'Most popular', colors: ['#ff9900', '#ff5f5f'] },
  { name: 'Google Play', category: 'Apps & Games', region: 'Global', amount: 'From $15', description: 'Great for apps, games, subscriptions, and digital content.', tag: 'Instant', colors: ['#4285f4', '#34a853'] },
  { name: 'Steam', category: 'Gaming', region: 'Global', amount: 'From $10', description: 'Send funds for games, DLC, and in-game purchases.', tag: 'Gaming', colors: ['#1a1a1a', '#5a7dff'] },
  { name: 'Visa', category: 'Prepaid', region: 'US', amount: 'From $50', description: 'Flexible digital cards usable across many online stores.', tag: 'Flexible', colors: ['#1f4ed8', '#7dd3fc'] },
  { name: 'Mastercard', category: 'Prepaid', region: 'Global', amount: 'From $50', description: 'Trusted prepaid options for everyday online purchases.', tag: 'Trusted', colors: ['#ff5b5b', '#f59e0b'] },
  { name: 'Uber', category: 'Travel', region: 'Global', amount: 'From $15', description: 'Recharge rides and food delivery in minutes.', tag: 'Travel', colors: ['#000000', '#4ade80'] },
  { name: 'Airbnb', category: 'Travel', region: 'Global', amount: 'From $40', description: 'Ideal for weekends away, stays, and city breaks.', tag: 'Travel', colors: ['#ff5a5f', '#ff8a00'] },
  { name: 'Starbucks', category: 'Coffee', region: 'US', amount: 'From $10', description: 'Treat someone to favorite coffee and pastries.', tag: 'Lifestyle', colors: ['#0f766e', '#f59e0b'] },
  { name: 'Sephora', category: 'Beauty', region: 'US', amount: 'From $25', description: 'Enjoy beauty products, skincare, and fragrances.', tag: 'Beauty', colors: ['#ec4899', '#a855f7'] },
  { name: 'Nike', category: 'Fashion', region: 'Global', amount: 'From $30', description: 'A stylish pick for sneakers, apparel, and gear.', tag: 'Fashion', colors: ['#111111', '#ef4444'] },
  { name: 'Adidas', category: 'Fashion', region: 'Global', amount: 'From $25', description: 'Great for sportswear, shoes, and performance gear.', tag: 'Sports', colors: ['#0f172a', '#facc15'] },
  { name: 'Target', category: 'Retail', region: 'US', amount: 'From $20', description: 'Useful for home essentials, hobbies, and everyday items.', tag: 'Retail', colors: ['#dc2626', '#f59e0b'] },
  { name: 'Walmart', category: 'Retail', region: 'US', amount: 'From $20', description: 'A practical option for groceries and household needs.', tag: 'Everyday', colors: ['#0ea5e9', '#1d4ed8'] },
  { name: 'eBay', category: 'Marketplace', region: 'Global', amount: 'From $15', description: 'A flexible option for shopping, collectibles, and deals.', tag: 'Marketplace', colors: ['#0064d2', '#0f172a'] },
  { name: 'Spotify', category: 'Entertainment', region: 'Global', amount: 'From $10', description: 'Great for music, podcasts, and premium listening.', tag: 'Entertainment', colors: ['#1db954', '#0f172a'] },
  { name: 'Netflix', category: 'Entertainment', region: 'Global', amount: 'From $15', description: 'Perfect for streaming subscriptions and movie nights.', tag: 'Streaming', colors: ['#e50914', '#831010'] },
  { name: 'PlayStation', category: 'Gaming', region: 'Global', amount: 'From $20', description: 'Ideal for games, add-ons, and digital perks.', tag: 'Gaming', colors: ['#00439c', '#00a3e0'] },
  { name: 'Xbox', category: 'Gaming', region: 'Global', amount: 'From $20', description: 'Send credits for gaming and entertainment.', tag: 'Gaming', colors: ['#107c10', '#5eead4'] },
  { name: 'Disney', category: 'Entertainment', region: 'Global', amount: 'From $25', description: 'A favorite choice for fans of movies and streaming.', tag: 'Family', colors: ['#2563eb', '#f43f5e'] },
  { name: 'HBO Max', category: 'Entertainment', region: 'Global', amount: 'From $15', description: 'Great for premium shows and on-demand viewing.', tag: 'Streaming', colors: ['#8b5cf6', '#ec4899'] },
  { name: 'Best Buy', category: 'Tech', region: 'US', amount: 'From $25', description: 'Excellent for electronics, accessories, and gadgets.', tag: 'Tech', colors: ['#0f766e', '#3b82f6'] },
  { name: 'American Express', category: 'Prepaid', region: 'US', amount: 'From $50', description: 'A premium choice for digital rewards and secure shopping.', tag: 'Premium', colors: ['#1d4ed8', '#f59e0b'] },
  { name: 'Etihad', category: 'Travel', region: 'Global', amount: 'From $40', description: 'Useful for flights, upgrades, and travel bookings.', tag: 'Travel', colors: ['#0f172a', '#facc15'] }
];

function openGiftCardPurchase(card) {
  const panel = document.getElementById('giftcard-purchase-panel');
  const title = document.getElementById('giftcard-selection-title');
  const tag = document.getElementById('giftcard-selection-tag');
  const brandInput = document.getElementById('giftcard-selected-brand');
  const summary = document.getElementById('giftcard-selection-summary');
  const steps = document.querySelectorAll('.giftcard-step');
  const orderProduct = document.getElementById('giftcard-order-product');
  const orderAmount = document.getElementById('giftcard-order-amount');
  const orderTotal = document.getElementById('giftcard-order-total');
  const detailsStage = document.getElementById('giftcard-details-stage');
  const checkoutStage = document.getElementById('giftcard-checkout-stage');
  const detailsName = document.getElementById('giftcard-details-name');
  const detailsRegion = document.getElementById('giftcard-details-region');

  if (!panel || !title || !tag || !brandInput || !detailsStage || !checkoutStage) return;

  panel.hidden = false;
  detailsStage.hidden = false;
  checkoutStage.hidden = true;

  title.textContent = card?.name || 'Selected gift card';
  tag.textContent = card?.tag || 'Ready to buy';
  brandInput.value = card?.name || '';

  if (summary) {
    summary.hidden = false;
    const safeName = String(card?.name || 'Selected gift card').replace(/"/g, '&quot;');
    summary.innerHTML = `
      <p class="eyebrow">Selected gift card</p>
      <h4>${safeName}</h4>
      <p>${card?.description || 'Choose your amount and recipient details to continue.'}</p>
    `;
  }

  if (detailsName) detailsName.textContent = card?.name || 'Selected gift card';
  if (detailsRegion) detailsRegion.textContent = card?.region || 'Instant delivery';
  if (orderProduct) orderProduct.textContent = card?.name || 'Selected gift card';

  const amountInputHidden = document.getElementById('giftcard-amount-input');
  const quantityInput = document.getElementById('giftcard-quantity');
  const quantityInputHidden = document.getElementById('giftcard-quantity-input');

  const defaultAmount = parseCartAmount(card?.amount) || 25;
  const quantity = 1;
  const currencySymbol = '$';
  const amountText = `${currencySymbol}${defaultAmount.toFixed(2)}`;
  const totalText = `${currencySymbol}${(defaultAmount * quantity).toFixed(2)}`;

  if (orderAmount) orderAmount.textContent = amountText;
  if (orderTotal) orderTotal.textContent = totalText;

  if (amountInputHidden) amountInputHidden.value = String(defaultAmount);
  if (quantityInput) quantityInput.value = String(quantity);
  if (quantityInputHidden) quantityInputHidden.value = String(quantity);
  document.querySelectorAll('.giftcard-amount-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.amount === String(defaultAmount));
  });

  detailsStage.classList.add('active');
  checkoutStage.classList.remove('active');

  steps.forEach((step, index) => {
    step.classList.toggle('complete', index === 0);
    step.classList.toggle('active', index === 1);
  });

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function renderGiftCardCatalog() {
  const root = document.getElementById('giftcard-catalog');
  const searchInput = document.getElementById('giftcard-search');
  if (!root) return;

  const renderItems = (items, query = '') => {
    const normalizedQuery = query.toLowerCase().trim();
    const filteredCards = items.filter((card) => {
      const searchable = `${card.name} ${card.category} ${card.region} ${card.description}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });

    if (!filteredCards.length) {
      root.innerHTML = '<div class="giftcard-empty">No gift cards matched your search. Try another brand or category.</div>';
      return;
    }

    root.innerHTML = filteredCards.map((card) => {
      const safeName = String(card.name).replace(/"/g, '&quot;');
      const imageContent = createGiftCardImage(card.name, card.colors, String(card.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      const imageMarkup = card.imageUrl
        ? `<img class="giftcard-image" src="${card.imageUrl}" alt="${safeName} gift card" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,${encodeURIComponent(imageContent)}';" />`
        : `<div class="giftcard-image">${imageContent}</div>`;

      return `
        <article class="giftcard-card">
          <div class="giftcard-image-wrap">
            ${imageMarkup}
          </div>
          <div class="giftcard-body">
            <span class="giftcard-tag">${card.tag}</span>
            <h3>${card.name}</h3>
            <p>${card.description}</p>
            <div class="giftcard-meta">
              <span>${card.category}</span>
              <span>${card.amount}</span>
            </div>
            <div class="giftcard-actions">
              <button class="btn btn-secondary" type="button" data-giftcard-select="${String(card.name)}">Buy now</button>
              <button class="btn btn-primary" type="button" data-add-to-cart="${String(card.name)}">Add to cart</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  };

  let currentCatalog = getStoredJson(STORAGE_KEYS.giftcards, GIFT_CARD_CATALOG);
  if (!Array.isArray(currentCatalog) || currentCatalog.length === 0) {
    currentCatalog = GIFT_CARD_CATALOG;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => renderItems(currentCatalog, event.target.value));
  }

  renderItems(currentCatalog, '');
  const statusBox = document.getElementById('giftcard-add-status');
  if (statusBox) {
    showStatus(statusBox, 'Showing a ready-to-use gift card catalog while live offers refresh.', 'success');
  }

  root.onclick = (event) => {
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
      const selectedName = addButton.getAttribute('data-add-to-cart');
      const selectedCard = currentCatalog.find((card) => card.name === selectedName);
      const status = document.getElementById('giftcard-add-status');
      if (selectedCard) {
        addCartItem({
          service: 'giftcard',
          name: selectedCard.name,
          amount: parseCartAmount(selectedCard.amount),
          quantity: 1,
          description: selectedCard.description || ''
        });
        updateCartCount();
        showStatus(status, `${selectedCard.name} added to cart.`, 'success');
      }
      return;
    }

    const button = event.target.closest('[data-giftcard-select]');
    if (!button) return;

    const selectedName = button.getAttribute('data-giftcard-select');
    const selectedCard = currentCatalog.find((card) => card.name === selectedName);
    if (selectedCard) {
      openGiftCardPurchase(selectedCard);
    }
  };

  try {
    const apiCatalog = await fetchGiftCardCatalogFromApi();
    currentCatalog = apiCatalog.length ? apiCatalog : currentCatalog;
    renderItems(currentCatalog, searchInput?.value || '');

    if (statusBox && apiCatalog.length) {
      showStatus(statusBox, 'Live gift card offers loaded successfully.', 'success');
    }

    root.onclick = (event) => {
      const addButton = event.target.closest('[data-add-to-cart]');
      if (addButton) {
        const selectedName = addButton.getAttribute('data-add-to-cart');
        const selectedCard = currentCatalog.find((card) => card.name === selectedName);
        const status = document.getElementById('giftcard-add-status');
        if (selectedCard) {
          addCartItem({
            service: 'giftcard',
            name: selectedCard.name,
            amount: parseCartAmount(selectedCard.amount),
            quantity: 1,
            description: selectedCard.description || ''
          });
          updateCartCount();
          showStatus(status, `${selectedCard.name} added to cart.`, 'success');
        }
        return;
      }

      const button = event.target.closest('[data-giftcard-select]');
      if (!button) return;

      const selectedName = button.getAttribute('data-giftcard-select');
      const selectedCard = currentCatalog.find((card) => card.name === selectedName);
      if (selectedCard) {
        openGiftCardPurchase(selectedCard);
      }
    };
  } catch {
    renderItems(currentCatalog, searchInput?.value || '');
  }
}

function initGiftCardCheckoutForm() {
  const form = document.getElementById('giftcard-form');
  if (!form) return;

  const panel = document.getElementById('giftcard-purchase-panel');
  const countrySelect = document.getElementById('giftcard-country');
  const currencySelect = document.getElementById('giftcard-currency');
  const amountButtons = document.querySelectorAll('.giftcard-amount-button');
  const quantityInput = document.getElementById('giftcard-quantity');
  const amountInputHidden = document.getElementById('giftcard-amount-input');
  const quantityInputHidden = document.getElementById('giftcard-quantity-input');
  const detailsPrice = document.getElementById('giftcard-details-price');
  const checkoutStage = document.getElementById('giftcard-checkout-stage');
  const detailsStage = document.getElementById('giftcard-details-stage');
  const detailsBack = document.getElementById('giftcard-details-back');
  const detailsContinue = document.getElementById('giftcard-details-continue');
  const changeProduct = document.getElementById('giftcard-change-product');
  const orderAmount = document.getElementById('giftcard-order-amount');
  const orderTotal = document.getElementById('giftcard-order-total');

  const currencyMap = {
    NG: ['₦ NGN'],
    US: ['$ USD'],
    GB: ['£ GBP'],
    CA: ['CAD CAD'],
    DE: ['€ EUR'],
    FR: ['€ EUR'],
    ZA: ['ZAR ZAR'],
    KE: ['KES KES'],
    AU: ['A$ AUD'],
    IT: ['€ EUR']
  };

  const updateCurrencyOptions = () => {
    const selectedCountry = countrySelect?.value || '';
    const options = currencyMap[selectedCountry] || ['Select country first'];
    if (!currencySelect) return;

    currencySelect.innerHTML = '';
    options.forEach((optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      currencySelect.appendChild(option);
    });

    if (selectedCountry) {
      currencySelect.value = options[0];
    }
  };

  const updateOrderSummary = () => {
    const amountValue = Number(amountInputHidden?.value || 0);
    const quantityValue = Number(quantityInput?.value || 1);
    const currency = currencySelect?.value || '$ USD';
    const totalAmount = amountValue * Math.max(1, quantityValue);
    const currencySymbol = currency === '₦ NGN' ? '₦' : currency === '£ GBP' ? '£' : currency === '€ EUR' ? '€' : '$';
    const unitAmountText = Number.isFinite(amountValue) && amountValue > 0
      ? `${currencySymbol}${amountValue.toFixed(2)}`
      : '$0.00';
    const totalAmountText = Number.isFinite(totalAmount) && totalAmount > 0
      ? `${currencySymbol}${totalAmount.toFixed(2)}`
      : '$0.00';

    if (orderAmount) orderAmount.textContent = unitAmountText;
    if (orderTotal) orderTotal.textContent = totalAmountText;
    if (detailsPrice) detailsPrice.textContent = totalAmountText;
    if (quantityInputHidden) quantityInputHidden.value = String(Math.max(1, quantityValue));
  };

  const setActiveAmountButton = (selectedAmount) => {
    amountButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.amount === String(selectedAmount));
    });
  };

  const selectAmount = (amount) => {
    if (amountInputHidden) amountInputHidden.value = String(amount);
    setActiveAmountButton(amount);
    updateOrderSummary();
  };

  amountButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const amount = Number(button.dataset.amount || 0);
      selectAmount(amount);
    });
  });

  quantityInput?.addEventListener('input', () => {
    if (quantityInputHidden) {
      const value = Math.max(1, Number(quantityInput.value || 1));
      quantityInput.value = String(value);
      quantityInputHidden.value = String(value);
    }
    updateOrderSummary();
  });

  amountInputHidden?.addEventListener('input', updateOrderSummary);

  detailsContinue?.addEventListener('click', () => {
    if (detailsStage) detailsStage.hidden = true;
    if (checkoutStage) checkoutStage.hidden = false;
    const steps = document.querySelectorAll('.giftcard-step');
    steps.forEach((step, index) => {
      step.classList.toggle('complete', index < 2);
      step.classList.toggle('active', index === 2);
    });
    if (countrySelect) countrySelect.focus();
  });

  detailsBack?.addEventListener('click', () => {
    if (panel) panel.hidden = true;
    if (detailsStage) detailsStage.hidden = true;
    if (checkoutStage) checkoutStage.hidden = true;
  });

  changeProduct?.addEventListener('click', () => {
    if (panel) panel.hidden = true;
    if (detailsStage) detailsStage.hidden = true;
    if (checkoutStage) checkoutStage.hidden = true;
  });

  countrySelect?.addEventListener('change', updateCurrencyOptions);
  currencySelect?.addEventListener('change', updateOrderSummary);
  selectAmount(25);
  updateCurrencyOptions();
  updateOrderSummary();
}

function renderCartPage() {
  const root = document.getElementById('cart-page');
  if (!root) return;

  const itemsContainer = root.querySelector('#cart-items');
  const emptyMessage = root.querySelector('#cart-empty');
  const summary = root.querySelector('#cart-summary');
  const subtotalNode = root.querySelector('[data-cart-subtotal]');
  const itemCountNode = root.querySelector('[data-cart-count]');
  const clearButton = root.querySelector('#cart-clear');
  const checkoutButton = root.querySelector('#cart-checkout');
  const itemCountLabel = root.querySelector('#cart-item-count');
  const cartNotice = document.getElementById('cart-notice');

  if (!itemsContainer || !emptyMessage || !summary || !subtotalNode || !itemCountNode || !itemCountLabel) return;

  if (cartNotice) {
    cartNotice.textContent = '';
    cartNotice.className = 'status-message';
  }

  const items = getCartItems();
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || item.amount || 0) * Number(item.quantity || 1), 0);

  itemCountLabel.textContent = `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`;
  itemCountNode.textContent = String(totalQuantity);
  subtotalNode.textContent = `$${subtotal.toFixed(2)}`;

  if (!items.length) {
    itemsContainer.innerHTML = '';
    emptyMessage.hidden = false;
    summary.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  summary.hidden = false;

  itemsContainer.innerHTML = items.map((item, index) => {
    const name = item.name || item.brand || 'Product';
    const price = item.price || item.amount || 0;
    const quantity = item.quantity || 1;
    const total = Number(price) * Number(quantity);

    return `
      <article class="cart-item">
        <div class="cart-item__details">
          <div class="cart-item__title">${String(name)}</div>
          <div class="cart-item__meta">Qty: ${quantity} · ${price ? `$${Number(price).toFixed(2)}` : 'Price unavailable'}</div>
        </div>
        <div class="cart-item__price">${price ? `$${total.toFixed(2)}` : '—'}</div>
        <button type="button" class="btn btn-secondary btn-sm" data-cart-remove="${index}">Remove</button>
      </article>
    `;
  }).join('');

  itemsContainer.querySelectorAll('[data-cart-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-cart-remove'));
      removeCartItem(index);
      updateCartCount();
      renderCartPage();
    });
  });

  clearButton?.addEventListener('click', () => {
    clearCart();
    updateCartCount();
    renderCartPage();
  });

  checkoutButton?.addEventListener('click', () => {
    const status = cartNotice || document.getElementById('cart-notice');
    const items = getCartItems();
    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || item.amount || 0) * Number(item.quantity || 1), 0);

    if (!items.length) {
      showStatus(status, 'Your cart is empty. Add items before checking out.', 'error');
      return;
    }

    const order = {
      id: `KT-${Date.now().toString().slice(-8)}`,
      service: 'cart',
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      payload: {
        items,
        totalItems: totalQuantity,
        subtotal: subtotal.toFixed(2),
        currency: 'USD'
      }
    };

    recordOrder(order);
    clearCart();
    updateCartCount();
    renderCartPage();
    showStatus(status, `Cart checkout complete. Order ${order.id} has been created.`, 'success');
  });
}

function initCartButtons() {
  const airtimeForm = document.getElementById('airtime-form');
  const airtimeCartButton = document.getElementById('airtime-add-to-cart');

  if (airtimeForm && airtimeCartButton) {
    airtimeCartButton.addEventListener('click', () => {
      const formData = new FormData(airtimeForm);
      const country = formData.get('country')?.toString().trim();
      const operator = formData.get('operator')?.toString().trim();
      const type = formData.get('type')?.toString().trim();
      const paymentMethod = formData.get('paymentMethod')?.toString().trim();
      const amount = parseCartAmount(formData.get('amount'));
      const phone = formData.get('phone')?.toString().trim();
      const status = airtimeForm.querySelector('.status-message');

      if (!country || !operator || !type || !paymentMethod || !amount || !phone) {
        showStatus(status, 'Please complete the airtime form before adding to cart.', 'error');
        return;
      }

      addCartItem({
        service: 'airtime',
        name: `Airtime top-up • ${country} • ${operator}`,
        amount,
        quantity: 1,
        description: `${type} payment with ${paymentMethod}`
      });
      updateCartCount();
      showStatus(status, 'Airtime request added to cart.', 'success');
    });
  }
}

function initPhysicalSimCartButtons() {
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) return;

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('a.local-add-to-cart');
    if (!button) return;

    event.preventDefault();

    const name = button.getAttribute('data-sim-name') || button.textContent.trim();
    const amount = parseCartAmount(button.getAttribute('data-sim-price'));
    const status = document.getElementById('physical-sim-status');

    if (!name) {
      showStatus(status, 'Unable to add this SIM card to cart. Please try again.', 'error');
      return;
    }

    addCartItem({
      service: 'sim',
      name,
      amount,
      quantity: 1,
      description: 'Physical SIM card purchase'
    });
    updateCartCount();
    showStatus(status, `${name} added to cart.`, 'success');
  });
}

function initOrderForms() {
  document.querySelectorAll('.service-form').forEach((form) => {
    populateOperatorSelect(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(form).entries());
      const order = {
        id: `KT-${Date.now().toString().slice(-8)}`,
        service: form.dataset.service || form.id,
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
        payload: formData
      };

      recordOrder(order);
      const status = form.querySelector('.status-message');
      showStatus(status, `Order ${order.id} created. Your request is now in the local KT Refill queue.`, 'success');
      form.reset();
    });
  });
}

function initTrackingForm() {
  const trackingForm = document.querySelector('#tracking-form');
  if (!trackingForm) return;

  trackingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const lookupId = trackingForm.querySelector('input[name="orderId"]')?.value?.trim();
    const statusBox = trackingForm.querySelector('.status-message');
    const orders = getOrders();
    const match = orders.find((entry) => entry.id.toLowerCase() === lookupId.toLowerCase());

    if (!match) {
      showStatus(statusBox, 'No matching order found. Please check your order ID and try again.', 'error');
      return;
    }

    showStatus(statusBox, `Order ${match.id} is currently ${match.status}.`, 'success');
  });
}

function initSigninForm() {
  const signinForm = document.querySelector('#signin-form');
  if (!signinForm) return;

  const authTabs = document.querySelectorAll('.auth-tab');
  const authTitle = document.getElementById('auth-panel-title');
  const authCopy = document.getElementById('auth-panel-copy');
  const submitButton = signinForm.querySelector('.auth-submit-btn');
  const nameField = signinForm.querySelector('.auth-name-field');
  const confirmPasswordField = signinForm.querySelector('.auth-confirm-password-field');
  const rememberField = signinForm.querySelector('.remember-field');
  const rememberCheckbox = signinForm.querySelector('input[name="rememberMe"]');
  const forgotPasswordLink = signinForm.querySelector('.auth-forgot-password');
  const statusBox = signinForm.querySelector('.status-message');

  const existingSession = getSession();
  if (existingSession?.email) {
    showStatus(statusBox, 'You are already signed in. Redirecting to your dashboard...', 'success');
    window.setTimeout(() => {
      window.location.href = './dashboard.html';
    }, 500);
    return;
  }

  const storedProfile = getProfile();
  const remembered = localStorage.getItem(STORAGE_KEYS.rememberMe) === 'true';
  if (rememberCheckbox) rememberCheckbox.checked = remembered;
  if (remembered && storedProfile?.email) {
    const emailInput = signinForm.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = storedProfile.email;
  }

  const setAuthMode = (mode) => {
    signinForm.dataset.authMode = mode;
    authTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.authMode === mode));

    if (mode === 'signup') {
      authTitle.textContent = 'Create account';
      authCopy.textContent = 'Register a new account to simplify checkout and track your orders.';
      submitButton.textContent = 'Sign Up';
      if (nameField) nameField.hidden = false;
      if (confirmPasswordField) confirmPasswordField.hidden = false;
      if (rememberField) rememberField.hidden = true;
      if (forgotPasswordLink) forgotPasswordLink.hidden = true;
    } else {
      authTitle.textContent = 'Sign In';
      authCopy.textContent = 'Keep me signed in and access your dashboard, orders, and wallet history.';
      submitButton.textContent = 'Login';
      if (nameField) nameField.hidden = true;
      if (confirmPasswordField) confirmPasswordField.hidden = true;
      if (rememberField) rememberField.hidden = false;
      if (forgotPasswordLink) forgotPasswordLink.hidden = false;
    }
  };

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
  });

  document.querySelectorAll('[data-social-login]').forEach((button) => {
    button.addEventListener('click', () => {
      const provider = button.getAttribute('data-social-login');
      handleSocialLogin(provider);
    });
  });

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', () => {
      const email = signinForm.querySelector('input[name="email"]')?.value?.trim();
      if (!email) {
        showStatus(statusBox, 'Enter your email address and we will send a password reset link.', 'success');
        return;
      }
      showStatus(statusBox, `A password reset link has been sent to ${email}. Check your inbox.`, 'success');
    });
  }

  const handleSocialLogin = (provider) => {
    const providerNames = {
      google: 'Google',
      facebook: 'Facebook',
      apple: 'Apple'
    };
    const displayName = providerNames[provider] || provider;
    const emailInput = signinForm.querySelector('input[name="email"]');
    const nameInput = signinForm.querySelector('input[name="name"]');

    showStatus(statusBox, `${displayName} sign-in requires a couple of details. Enter your email to continue.`, 'success');

    const email = window.prompt(`Enter your email to continue with ${displayName}:`, emailInput?.value?.trim() || '');
    if (!email || !email.includes('@')) {
      showStatus(statusBox, 'Please provide a valid email address to continue.', 'error');
      return;
    }

    if (emailInput) emailInput.value = email;

    showStatus(statusBox, `Great. Now enter your full name for ${displayName}.`, 'success');

    const name = window.prompt(`Enter your full name for ${displayName}:`, nameInput?.value?.trim() || email.split('@')[0]);
    const finalName = name && name.trim() ? name.trim() : email.split('@')[0];

    if (nameInput) nameInput.value = finalName;

    const profile = saveUser({
      email,
      name: finalName,
      signedInAt: new Date().toISOString(),
      provider
    });

    setProfile(profile);
    setSession(buildSessionData(profile));
    updateHeaderAuthState();

    if (rememberCheckbox) {
      localStorage.setItem(STORAGE_KEYS.rememberMe, String(rememberCheckbox.checked));
    }

    showStatus(statusBox, `${displayName} account connected. Redirecting to your dashboard...`, 'success');
    window.setTimeout(() => {
      window.location.href = './dashboard.html';
    }, 800);
  };

  const emailField = signinForm.querySelector('input[name="email"]');
  const passwordField = signinForm.querySelector('input[name="password"]');
  const confirmPasswordFieldInput = signinForm.querySelector('input[name="confirmPassword"]');
  const nameFieldInput = signinForm.querySelector('input[name="name"]');

  const authValues = {
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  };

  const syncAuthValues = () => {
    authValues.email = String(emailField?.value || '').trim();
    authValues.password = String(passwordField?.value || '').trim();
    authValues.confirmPassword = String(confirmPasswordFieldInput?.value || '').trim();
    authValues.name = String(nameFieldInput?.value || '').trim();
  };

  [emailField, passwordField, confirmPasswordFieldInput, nameFieldInput].filter(Boolean).forEach((field) => {
    field.addEventListener('input', syncAuthValues);
    field.addEventListener('change', syncAuthValues);
  });

  syncAuthValues();

  const handleAuthSubmit = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (signinForm.hasAttribute('action')) {
      signinForm.removeAttribute('action');
    }
    if (signinForm.hasAttribute('method')) {
      signinForm.removeAttribute('method');
    }

    syncAuthValues();

    const mode = signinForm.dataset.authMode || 'signin';
    const { email, password, confirmPassword, name } = authValues;

    if (!email || !password) {
      showStatus(statusBox, 'Please complete both email and password fields before continuing.', 'error');
      return;
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        showStatus(statusBox, 'Please confirm your password to create an account.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showStatus(statusBox, 'Passwords do not match. Please check and try again.', 'error');
        return;
      }

      const existingProfile = getProfile();
      if (existingProfile && existingProfile.email && existingProfile.email.toLowerCase() === email.toLowerCase()) {
        showStatus(statusBox, 'An account with this email already exists. Please sign in instead.', 'error');
        return;
      }

      const profile = {
        email,
        name: name || email.split('@')[0],
        password,
        signedInAt: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        provider: 'local'
      };
      const savedProfile = saveUser(profile);
      setProfile(savedProfile);
      setSession(buildSessionData(savedProfile));
      updateHeaderAuthState();

      if (rememberCheckbox) {
        localStorage.setItem(STORAGE_KEYS.rememberMe, String(rememberCheckbox.checked));
      }

      showStatus(statusBox, `Welcome ${profile.name}, your account has been created. Redirecting...`, 'success');
      window.setTimeout(() => {
        window.location.href = './dashboard.html';
      }, 700);
      return;
    }

    const auth = authenticateLocalUser(email, password);
    if (!auth.success) {
      showStatus(statusBox, auth.message, 'error');
      return;
    }

    const profile = auth.profile;
    const signedInProfile = saveUser({
      ...profile,
      signedInAt: new Date().toISOString()
    });
    setSession(buildSessionData(signedInProfile));
    setProfile({
      ...signedInProfile,
      signedInAt: signedInProfile.signedInAt
    });
    updateHeaderAuthState();

    if (rememberCheckbox) {
      localStorage.setItem(STORAGE_KEYS.rememberMe, String(rememberCheckbox.checked));
    }

    showStatus(statusBox, `Welcome back, ${profile.name}. You are now signed in.`, 'success');
    window.setTimeout(() => {
      window.location.href = './dashboard.html';
    }, 700);
  };

  signinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  signinForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target && event.target.tagName === 'INPUT') {
      event.preventDefault();
      event.stopPropagation();
      handleAuthSubmit(event);
    }
  });
  submitButton.addEventListener('click', handleAuthSubmit);

  setAuthMode('signin');
}

function formatDashboardDate(value) {
  const parsed = new Date(value || Date.now());
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
}

function updateDashboardSessionView(session) {
  const locationElement = document.querySelector('.dashboard-login-location');
  const ipElement = document.querySelector('.dashboard-login-ip');
  const sessionElement = document.querySelectorAll('.dashboard-last-session');
  const fallbackLocation = session?.loginLocation || 'Local environment';
  const fallbackIp = session?.ipAddress || 'IP unavailable';
  const deviceName = session?.deviceName || 'Windows PC';

  if (locationElement) locationElement.textContent = fallbackLocation;
  if (ipElement) ipElement.textContent = `IP: ${fallbackIp}`;
  sessionElement.forEach((element) => {
    element.textContent = deviceName;
  });
}

function getDashboardApiBase() {
  if (typeof window === 'undefined') return 'http://127.0.0.1:8000';
  const origin = window.location.origin;
  if (origin && origin !== 'null' && origin !== 'file://') {
    return origin;
  }
  return 'http://127.0.0.1:8000';
}

async function fetchLiveIpAddress() {
  const baseUrl = getDashboardApiBase();
  try {
    const response = await fetch(`${baseUrl}/api/ip`, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.ip || null;
  } catch {
    return null;
  }
}

async function fetchLiveLocationData() {
  const baseUrl = getDashboardApiBase();
  try {
    const response = await fetch(`${baseUrl}/api/location`, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const data = await response.json();
    return data || null;
  } catch {
    return null;
  }
}

async function hydrateSessionDetails(session) {
  updateDashboardSessionView(session);

  try {
    const [ipAddress, locationData] = await Promise.all([
      fetchLiveIpAddress(),
      fetchLiveLocationData()
    ]);

    const resolvedIp = ipAddress || session?.ipAddress || 'IP unavailable';
    const locationText = locationData?.city && locationData?.country_name
      ? `${locationData.city}, ${locationData.country_name}`
      : locationData?.city && locationData?.region
        ? `${locationData.city}, ${locationData.region}`
        : locationData?.country_name
          ? locationData.country_name
          : session?.loginLocation || 'Local environment';

    const updatedSession = {
      ...session,
      loginLocation: locationText,
      ipAddress: resolvedIp,
      lastLoginAt: session?.lastLoginAt || session?.signedInAt,
      deviceName: session?.deviceName || getDeviceName()
    };

    setSession(updatedSession);
    updateDashboardSessionView(updatedSession);
  } catch (error) {
    updateDashboardSessionView(session);
  }
}

function getDeviceName() {
  const platform = navigator.userAgentData?.platform || navigator.platform || 'Unknown platform';
  const browser = navigator.userAgentData?.brands?.[0]?.brand || navigator.userAgent?.match(/(Chrome|Firefox|Safari|Edge|Opera)\//)?.[1] || 'Browser';
  const normalizedPlatform = platform === 'Unknown platform' ? 'Windows PC' : platform;
  return `${browser} on ${normalizedPlatform}`;
}

function initDashboard() {
  const dashboardRoot = document.querySelector('[data-dashboard-summary]');
  const logoutButton = document.querySelector('#dashboard-logout');
  if (!dashboardRoot) return;

  const balanceToggle = dashboardRoot.querySelector('[data-balance-toggle]');
  const balanceValue = dashboardRoot.querySelector('[data-stat="balance"]');

  if (balanceToggle && balanceValue) {
    balanceToggle.addEventListener('click', () => {
      const isHidden = balanceValue.classList.toggle('is-hidden');
      balanceValue.textContent = isHidden ? '••••••' : (balanceValue.dataset.fullValue || balanceValue.textContent);
      balanceToggle.setAttribute('aria-label', isHidden ? 'Show balance' : 'Hide balance');
      balanceToggle.classList.toggle('is-hidden', isHidden);
    });
  }

  const session = getSession();
  const fallbackSession = {
    email: '',
    name: 'Guest',
    provider: 'local',
    signedInAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginLocation: 'Local environment',
    ipAddress: 'IP unavailable',
    deviceName: getDeviceName()
  };
  const activeSession = session && session.email ? session : { ...fallbackSession, ...session };

  const currentDeviceName = activeSession.deviceName || getDeviceName();
  const readySession = { ...activeSession, deviceName: currentDeviceName };
  setSession(readySession);

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearSession();
      window.location.href = './signin.html';
    });
  }

  const userNames = dashboardRoot.querySelectorAll('.dashboard-welcome-name');
  const userGreeting = dashboardRoot.querySelector('.dashboard-welcome-copy');
  const userLastLogin = dashboardRoot.querySelector('.dashboard-last-login');
  const profileName = document.querySelector('.profile-name');
  const profileEmail = document.querySelector('.profile-email');

  const displayName = readySession.name || readySession.email.split('@')[0] || 'Guest';
  const displayTime = formatDashboardDate(readySession.lastLoginAt || readySession.signedInAt);
  const nextDeviceName = readySession.deviceName || getDeviceName();

  userNames.forEach((node) => {
    if (node) node.textContent = displayName;
  });
  if (userGreeting) userGreeting.textContent = `You last signed in on ${displayTime}. Manage your airtime, gift cards and orders from here.`;
  if (userLastLogin) userLastLogin.textContent = displayTime;
  if (profileName) profileName.textContent = displayName;
  if (profileEmail) profileEmail.textContent = readySession.email || 'guest@ktrefill.local';

  const updatedSession = {
    ...readySession,
    deviceName: nextDeviceName
  };
  setSession(updatedSession);

  updateHeaderAuthState();
  updateDashboardSummary();
  initProfileDropdown();
  hydrateSessionDetails(updatedSession);

  window.setInterval(() => {
    const liveSession = getSession();
    if (liveSession?.email) {
      const refreshedTime = formatDashboardDate(liveSession.lastLoginAt || liveSession.signedInAt);
      const lastLoginNodes = document.querySelectorAll('.dashboard-last-login');
      lastLoginNodes.forEach((node) => {
        node.textContent = refreshedTime;
      });
      updateDashboardSummary();
      updateDashboardSessionView(liveSession);
    }
  }, 10000);
}

function initProfileDropdown() {
  const dropdown = document.querySelector('.profile-dropdown');
  const toggle = document.querySelector('.profile-toggle');
  const menu = document.querySelector('.profile-menu');
  const logoutLink = document.querySelector('.profile-logout');
  if (!dropdown || !toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.profile-dropdown')) {
      menu.classList.remove('open');
    }
  });

  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      clearSession();
      window.location.href = './signin.html';
    });
  }
}

function initLiveCatalog() {
  if (document.querySelector('[data-live-catalog]')) {
    renderCarrierCatalog();
  }

  if (document.querySelector('.select-plan-button')) {
    initCarrierEsimSelection();
  }

  if (document.getElementById('esim-details-root')) {
    initEsimDetailsPage();
  }
}

function initReloadlyConfig() {
  const panel = document.querySelector('#reloadly-config');
  if (!panel) return;

  const stored = getReloadlyConfig();

  const clientIdInput = panel.querySelector('input[name="clientId"]');
  const clientSecretInput = panel.querySelector('input[name="clientSecret"]');
  const audienceInput = panel.querySelector('input[name="audience"]');
  const tokenInput = panel.querySelector('input[name="apiToken"]');
  const baseInput = panel.querySelector('input[name="apiBase"]');
  const saveButton = panel.querySelector('button[type="button"]');

  if (clientIdInput) clientIdInput.value = stored.clientId || '';
  if (clientSecretInput) clientSecretInput.value = stored.clientSecret || '';
  if (audienceInput) audienceInput.value = stored.audience || 'https://topups.reloadly.com';
  if (tokenInput) tokenInput.value = stored.accessToken || '';
  if (baseInput) baseInput.value = stored.apiBase || 'https://topups.reloadly.com';

  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      const statusBox = panel.querySelector('.status-message');
      const apiConfiguration = {
        apiBase: baseInput?.value || 'https://topups.reloadly.com',
        clientId: clientIdInput?.value || '',
        clientSecret: clientSecretInput?.value || '',
        audience: audienceInput?.value || 'https://topups.reloadly.com',
        accessToken: tokenInput?.value || ''
      };

      if (!apiConfiguration.clientId || !apiConfiguration.clientSecret) {
        showStatus(statusBox, 'Please fill in both Reloadly client credentials before saving.', 'error');
        return;
      }

      try {
        const authResponse = await fetch('https://auth.reloadly.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            client_id: apiConfiguration.clientId,
            client_secret: apiConfiguration.clientSecret,
            grant_type: 'client_credentials',
            audience: apiConfiguration.audience
          })
        });

        const authData = await authResponse.json();
        if (!authResponse.ok || !authData.access_token) {
          throw new Error(authData.message || 'Reloadly authentication failed.');
        }

        apiConfiguration.accessToken = authData.access_token;
        setStoredJson(STORAGE_KEYS.reloadly, apiConfiguration);
        if (tokenInput) tokenInput.value = authData.access_token;
        showStatus(statusBox, 'Reloadly configuration saved and token refreshed successfully.', 'success');
      } catch (error) {
        showStatus(statusBox, error.message || 'Unable to authenticate with Reloadly from this local page.', 'error');
      }
    });
  }
}

function initFooterYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

function updateCartCount() {
  syncCartUi();
}

ensureDemoOrders();
seedReloadlyConfig();
initNavigation();
initFaqs();
initCounters();
initOrderForms();
initCartButtons();
initPhysicalSimCartButtons();
initTrackingForm();
initSigninForm();
initDashboard();
initLiveCatalog();
initGiftCardCheckoutForm();
renderGiftCardCatalog();
renderCartPage();
initReloadlyConfig();
initCarrierEsimSelection();
initEsimDetailsPage();
initWalletFunding();
initFooterYear();
updateCartCount();
renderCartPage();

if (typeof jQuery !== 'undefined') {
  jQuery(document.body).on('added_to_cart', updateCartCount);
  jQuery(document.body).on('removed_from_cart', updateCartCount);
}
