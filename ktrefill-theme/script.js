const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const STORAGE_KEYS = {
  orders: 'ktrefill_orders',
  profile: 'ktrefill_profile',
  reloadly: 'ktrefill_reloadly_config'
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

function getProfile() {
  return getStoredJson(STORAGE_KEYS.profile, null);
}

function setProfile(profile) {
  setStoredJson(STORAGE_KEYS.profile, profile);
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

  if (dashboardNodes.balance) dashboardNodes.balance.textContent = '$1,240.00';
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

function initNavigation() {
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

async function fetchReloadlyOperators(countryCode) {
  const stored = getStoredJson(STORAGE_KEYS.reloadly, null);
  if (!stored || !stored.accessToken) {
    return [];
  }

  const apiBase = (stored.apiBase || 'https://topups.reloadly.com').replace(/\/$/, '');
  const response = await fetch(`${apiBase}/operators?countryCode=${encodeURIComponent(countryCode)}`, {
    headers: {
      Authorization: `Bearer ${stored.accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Unable to load Reloadly operators for the selected country.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function populateOperatorSelect(form) {
  const countrySelect = form.querySelector('select[name="country"]');
  const operatorSelect = form.querySelector('select[name="operator"]');
  if (!countrySelect || !operatorSelect) return;

  const updateOperators = async () => {
    const country = countrySelect.value;
    const status = form.querySelector('.status-message');
    operatorSelect.innerHTML = '<option value="">Loading operators...</option>';

    if (!country) {
      operatorSelect.innerHTML = '<option value="">Select operator</option>';
      return;
    }

    try {
      const operators = await fetchReloadlyOperators(country.slice(0, 2));
      operatorSelect.innerHTML = '<option value="">Select operator</option>' + operators.map((operator) => {
        return `<option value="${operator.operatorId}">${operator.name}</option>`;
      }).join('');

      if (!operators.length) {
        showStatus(status, 'No Reloadly operators were found for this country.', 'error');
      }
    } catch (error) {
      operatorSelect.innerHTML = '<option value="">Select operator</option>';
      showStatus(status, error.message || 'Reloadly operator lookup failed.', 'error');
    }
  };

  countrySelect.addEventListener('change', updateOperators);
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

  signinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(signinForm).entries());
    const statusBox = signinForm.querySelector('.status-message');

    if (!formData.email || !formData.password) {
      showStatus(statusBox, 'Please complete both email and password fields.', 'error');
      return;
    }

    setProfile({
      email: formData.email,
      name: formData.email.split('@')[0],
      signedInAt: new Date().toISOString()
    });

    showStatus(statusBox, `Welcome back, ${formData.email}. You are now signed in.`, 'success');

    if (window.location.pathname.endsWith('signin.html')) {
      window.setTimeout(() => {
        window.location.href = './dashboard.html';
      }, 700);
    }
  });
}

function initDashboard() {
  const dashboardRoot = document.querySelector('[data-dashboard-summary]');
  if (!dashboardRoot) return;

  updateDashboardSummary();
}

function initReloadlyConfig() {
  const panel = document.querySelector('#reloadly-config');
  if (!panel) return;

  const stored = getStoredJson(STORAGE_KEYS.reloadly, {
    apiBase: 'https://topups.reloadly.com',
    clientId: '',
    clientSecret: '',
    audience: 'https://topups.reloadly.com',
    accessToken: ''
  });

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
  const cartCount = document.querySelector('.cart-count');
  if (cartCount && typeof ajaxurl !== 'undefined') {
    fetch(ajaxurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'action=ktrefill_update_cart'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.count > 0) {
          cartCount.textContent = data.count;
          cartCount.style.display = 'flex';
        } else {
          cartCount.style.display = 'none';
        }
      });
  }
}

ensureDemoOrders();
initNavigation();
initFaqs();
initCounters();
initOrderForms();
initTrackingForm();
initSigninForm();
initDashboard();
initReloadlyConfig();
initFooterYear();
updateCartCount();

if (typeof jQuery !== 'undefined') {
  jQuery(document.body).on('added_to_cart', updateCartCount);
  jQuery(document.body).on('removed_from_cart', updateCartCount);
}
