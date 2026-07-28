function toggleMobileMenu() {
  const mobileMenu = document.querySelector('#mobile-menu');
  if (!mobileMenu) return;
  mobileMenu.classList.toggle('hidden');
}

function toggleCountryDropdown() {
  const countryDropdown = document.querySelector('#country-dropdown');
  const dropdownArrow = document.querySelector('#dropdown-arrow');
  if (!countryDropdown || !dropdownArrow) return;
  countryDropdown.classList.toggle('hidden');
  dropdownArrow.classList.toggle('rotate-180');
}

function toggleFaq(button) {
  const card = button.closest('.glass-card');
  if (!card) return;
  const content = card.querySelector('.faq-content');
  const icon = button.querySelector('i');
  if (!content) return;
  const isOpen = content.classList.contains('open');
  document.querySelectorAll('.faq-content').forEach((item) => {
    item.classList.remove('open');
  });
  document.querySelectorAll('.glass-card button i').forEach((iconItem) => {
    iconItem.classList.remove('rotate-180');
  });
  if (!isOpen) {
    content.classList.add('open');
    if (icon) icon.classList.add('rotate-180');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStoredCartItems() {
  try {
    const stored = localStorage.getItem('ktrefill_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem('ktrefill_cart', JSON.stringify(items));
}

function renderHomeCart() {
  const cartBadge = document.querySelector('#cart-count');
  const items = getStoredCartItems();
  const total = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  if (cartBadge) {
    cartBadge.textContent = String(total);
    cartBadge.style.display = total > 0 ? 'flex' : 'none';
  }
}

function getSelectedTopupValues() {
  const country = document.querySelector('#selected-country')?.textContent?.trim() || 'Selected country';
  const phoneInput = document.querySelector('#topup-form input[type="tel"]');
  const phone = phoneInput?.value?.trim() || '';
  const amountInput = document.querySelector('#custom-amount');
  const rawAmount = Number(amountInput?.value || 0);
  const amount = Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : 5000;
  const currency = document.querySelector('#currency-naira')?.classList.contains('bg-accent-gold') ? 'NGN' : 'USD';

  return { country, phone, amount, currency };
}

function initPageInteractions() {
  const cartButton = document.querySelector('#cart-button');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');
  const countryOptions = document.querySelectorAll('.country-option');
  const selectedFlag = document.querySelector('#selected-flag');
  const selectedCountry = document.querySelector('#selected-country');
  const countryCode = document.querySelector('#country-code');
  const dropdownArrow = document.querySelector('#dropdown-arrow');
  const countryDropdown = document.querySelector('#country-dropdown');
  const serviceTopup = document.querySelector('#service-topup');
  const serviceEsim = document.querySelector('#service-esim');
  const topupForm = document.querySelector('#topup-form');
  const esimForm = document.querySelector('#esim-form');
  const amountButtons = document.querySelectorAll('.amount-button');
  const customAmount = document.querySelector('#custom-amount');
  const topupSubmit = document.querySelector('#topup-submit');
  const esimAddCart = document.querySelector('#esim-add-cart');
  const checkoutBtn = document.querySelector('#checkout-btn');
  const heroStartTopup = document.querySelector('#hero-start-topup');
  const heroGetEsim = document.querySelector('#hero-get-esim');
  const coverageViewAll = document.querySelector('#coverage-view-all');
  const ctaStartTopup = document.querySelector('#cta-start-topup');
  const ctaCheckRates = document.querySelector('#cta-check-rates');
  const backToTop = document.querySelector('#backToTop');

  if (cartButton) {
    cartButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = './cart.html';
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const mobileMenu = document.querySelector('#mobile-menu');
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
  });

  countryOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const flag = option.dataset.flag;
      const country = option.dataset.country;
      const code = option.dataset.code;
      if (selectedFlag && selectedCountry && countryCode) {
        selectedFlag.src = `https://flagcdn.com/w40/${flag}.png`;
        selectedCountry.textContent = country;
        countryCode.textContent = code;
      }
      if (countryDropdown) countryDropdown.classList.add('hidden');
      if (dropdownArrow) dropdownArrow.classList.remove('rotate-180');
    });
  });

  if (serviceTopup && serviceEsim && topupForm && esimForm) {
    serviceTopup.addEventListener('click', () => {
      serviceTopup.classList.add('bg-accent-gold', 'text-brand-900');
      serviceEsim.classList.remove('bg-accent-gold', 'text-brand-900');
      serviceEsim.classList.add('bg-white/10', 'text-gray-300');
      topupForm.classList.remove('hidden');
      esimForm.classList.add('hidden');
    });
    serviceEsim.addEventListener('click', () => {
      serviceEsim.classList.add('bg-accent-gold', 'text-brand-900');
      serviceTopup.classList.remove('bg-accent-gold', 'text-brand-900');
      serviceTopup.classList.add('bg-white/10', 'text-gray-300');
      topupForm.classList.add('hidden');
      esimForm.classList.remove('hidden');
    });
  }

  amountButtons.forEach((button) => {
    button.addEventListener('click', () => {
      amountButtons.forEach((item) => {
        item.classList.remove('bg-accent-gold', 'text-brand-900', 'border-accent-gold');
        item.classList.add('bg-white/5', 'text-white', 'border-white/10');
      });
      button.classList.remove('bg-white/5', 'text-white', 'border-white/10');
      button.classList.add('bg-accent-gold', 'text-brand-900', 'border-accent-gold');
      const value = button.dataset.valueNaira;
      if (customAmount && value) {
        customAmount.value = value;
      }
    });
  });

  if (topupSubmit) {
    topupSubmit.addEventListener('click', (event) => {
      event.preventDefault();
      const { country, phone, amount, currency } = getSelectedTopupValues();
      const items = getStoredCartItems();
      items.push({
        name: `Top-up ${country}`,
        amount,
        price: amount,
        quantity: 1,
        service: 'airtime',
        currency,
        country,
        phone
      });
      saveCartItems(items);
      renderHomeCart();
      window.location.href = './cart.html';
    });
  }

  if (esimAddCart) {
    esimAddCart.addEventListener('click', (event) => {
      event.preventDefault();
      const items = getStoredCartItems();
      const nameInput = document.querySelector('#esim-name');
      const phoneModelInput = document.querySelector('#esim-phone-model');
      const imeiInput = document.querySelector('#esim-imei');
      const emailInput = document.querySelector('#esim-email');
      const whatsappInput = document.querySelector('#esim-whatsapp');
      const eidInput = document.querySelector('#esim-eid');
      const quantityInput = document.querySelector('#esim-quantity');
      const quantity = Number(quantityInput?.value || 1) || 1;

      items.push({
        name: `eSIM Plan${nameInput?.value ? ` • ${nameInput.value}` : ''}`,
        amount: 39,
        price: 39,
        quantity,
        service: 'esim',
        details: {
          phoneModel: phoneModelInput?.value || '',
          imei: imeiInput?.value || '',
          email: emailInput?.value || '',
          whatsapp: whatsappInput?.value || '',
          eid: eidInput?.value || ''
        }
      });
      saveCartItems(items);
      renderHomeCart();
      window.location.href = './cart.html';
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = './signin.html';
    });
  }

  if (heroStartTopup) {
    heroStartTopup.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = './buy-airtime.html';
    });
  }

  if (heroGetEsim) {
    heroGetEsim.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = './carrier-esim.html';
    });
  }

  if (coverageViewAll) {
    coverageViewAll.addEventListener('click', () => {
      document.querySelector('#coverage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (ctaStartTopup) {
    ctaStartTopup.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = './buy-airtime.html';
    });
  }

  if (ctaCheckRates) {
    ctaCheckRates.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = './buy-airtime.html';
    });
  }

  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#country-select') && !event.target.closest('#country-dropdown')) {
      if (countryDropdown) countryDropdown.classList.add('hidden');
      if (dropdownArrow) dropdownArrow.classList.remove('rotate-180');
    }
  });

  renderHomeCart();
}

window.addEventListener('DOMContentLoaded', initPageInteractions);
