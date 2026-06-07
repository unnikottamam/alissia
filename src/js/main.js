import { gsap } from 'gsap';
import {
  createIcons,
  Sun,
  Moon,
  ArrowRight,
  Mail,
  ExternalLink,
  AlertCircle,
  Check,
  X,
  Compass,
  Home,
  PawPrint,
  Pill,
  Heart,
  Bike,
  Palette,
  HeartHandshake,
  Instagram,
  ShieldCheck
} from 'lucide';

// Initialize Lucide Icons
function initIcons() {
  createIcons({
    icons: {
      Sun,
      Moon,
      ArrowRight,
      Mail,
      ExternalLink,
      AlertCircle,
      Check,
      X,
      Compass,
      Home,
      PawPrint,
      Pill,
      Heart,
      Bike,
      Palette,
      HeartHandshake,
      Instagram,
      ShieldCheck
    }
  });
}

// ----------------------------------------------------
// 1. Theme Toggle Configuration
// ----------------------------------------------------
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve previous settings, default to dark if not set
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ----------------------------------------------------
// 1b. Portfolio Sub-view Selector Switcher
// ----------------------------------------------------
function initViewSwitcher() {
  const switcher = document.getElementById('view-switcher');
  if (!switcher) return;

  const buttons = switcher.querySelectorAll('.view-btn');
  const body = document.body;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (!target) return;

      // Update active tab button style
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Swap body view layout state
      body.setAttribute('data-view', target);

      // Trigger custom smooth reveal transition via GSAP
      gsap.fromTo('.view-section', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.04 }
      );
    });
  });
}

// ----------------------------------------------------
// 2. Mobile Menu Navigation
// ----------------------------------------------------
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle active state
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu and toggle active links on selection
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      let targetSection = document.querySelector(targetId);

      const activeView = document.body.getAttribute('data-view') || 'pets';
      if (activeView === 'art') {
        if (targetId === '#home') {
          targetSection = document.getElementById('art-home');
        } else if (targetId === '#about' || targetId === '#experience') {
          targetSection = document.getElementById('art-showcase');
        }
      }

      if (targetSection) {
        const headerOffset = 70;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      
      navLinks.forEach(lnk => lnk.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 150; // offset for sticky header
    const activeView = document.body.getAttribute('data-view') || 'pets';

    sections.forEach(section => {
      // Skip sections that are not loaded in active mode
      if (section.classList.contains('view-section')) {
        if (activeView === 'pets' && !section.classList.contains('view-pets')) return;
        if (activeView === 'art' && !section.classList.contains('view-art')) return;
      }

      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Translate active sections back to main navigation buttons
    if (activeView === 'art') {
      if (current === 'art-home') current = 'home';
      if (current === 'art-showcase') current = 'about'; // highlight About Me in Art mode
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

// ----------------------------------------------------
// 3. GSAP Entry & Scroll Reveals
// ----------------------------------------------------
function initAnimations() {
  // Page load entrance animations
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.header', {
    y: -30,
    opacity: 0,
    duration: 1,
    delay: 0.2
  })
  .from('.hero-tagline', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.6')
  .from('.hero-title', {
    y: 40,
    opacity: 0,
    duration: 1
  }, '-=0.6')
  .from('.hero-desc', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.8')
  .from('.hero-actions', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.8');

  // Reveal sections on scroll using IntersectionObserver
  const revealElements = document.querySelectorAll('.card, .about-info, .about-img-wrapper, .section-title');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.fromTo(entry.target, 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(elem => {
    gsap.set(elem, { opacity: 0, y: 40 });
    revealObserver.observe(elem);
  });
}

// ----------------------------------------------------
// 4. Form Validation & AJAX Submissions
// ----------------------------------------------------

// Custom Toast Notifications
function showToast(title, desc, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success' ? 'check' : type === 'error' ? 'alert-circle' : 'alert-circle';
  
  toast.innerHTML = `
    <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
    <div class="toast-close"><i data-lucide="x"></i></div>
  `;

  container.appendChild(toast);
  createIcons({ icons: { Check, AlertCircle, X } });

  // Slide-in anim
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Auto-remove toast
  const dismissTimer = setTimeout(() => {
    dismissToast(toast);
  }, 5000);

  // Click to close
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(dismissTimer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.remove('show');
  toast.addEventListener('transitionend', () => {
    toast.remove();
  });
}

// Validate individual inputs
function validateField(input, validator, errorId) {
  const isValid = validator(input.value);
  const errorElement = document.getElementById(errorId);

  if (!isValid) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (errorElement) errorElement.classList.add('show');
  } else {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    if (errorElement) errorElement.classList.remove('show');
  }
  return isValid;
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const honeypot = document.getElementById('honeypot');

  // Regex validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Validates phone has only digits, spaces, hyphens, parentheses, plus signs
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  
  const nameValidator = (val) => val.trim().length >= 2;
  const emailValidator = (val) => emailRegex.test(val.trim());
  const phoneValidator = (val) => phoneRegex.test(val.trim()) && val.replace(/[^0-9]/g, '').length >= 7;
  const messageValidator = (val) => val.trim().length >= 10;

  // On-the-fly validation triggers
  nameInput.addEventListener('input', () => validateField(nameInput, nameValidator, 'name-feedback'));
  emailInput.addEventListener('input', () => validateField(emailInput, emailValidator, 'email-feedback'));
  phoneInput.addEventListener('input', () => validateField(phoneInput, phoneValidator, 'phone-feedback'));
  messageInput.addEventListener('input', () => validateField(messageInput, messageValidator, 'message-feedback'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation check
    const isNameValid = validateField(nameInput, nameValidator, 'name-feedback');
    const isEmailValid = validateField(emailInput, emailValidator, 'email-feedback');
    const isPhoneValid = validateField(phoneInput, phoneValidator, 'phone-feedback');
    const isMessageValid = validateField(messageInput, messageValidator, 'message-feedback');

    // Bot Spam prevention (honeypot)
    if (honeypot.value !== '') {
      showToast('Error', 'Spam detection triggered.', 'error');
      return;
    }

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      showToast('Validation Error', 'Please check the contact form inputs.', 'error');
      return;
    }

    // Submission states
    const origBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Sending Message...</span>
      <div class="spinner"></div>
    `;

    // Trigger Google reCAPTCHA v3
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.ready(() => {
        grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'submit' }).then(async (token) => {
          await submitFormWithToken(token, origBtnHTML);
        }).catch((err) => {
          console.error('reCAPTCHA execution failed:', err);
          showToast('Security Error', 'reCAPTCHA verification failed. Please try again.', 'error');
          resetSubmitBtn(origBtnHTML);
        });
      });
    } else {
      // Fallback if reCAPTCHA script didn't load (e.g., ad-blocker or offline dev)
      console.warn('reCAPTCHA script not found. Proceeding without security token.');
      submitFormWithToken('', origBtnHTML);
    }
  });

  async function submitFormWithToken(token, origBtnHTML) {
    const formData = new FormData(form);
    if (token) {
      formData.append('recaptcha_token', token);
    }

    try {
      // Send data to PHP handler via fetch AJAX
      const response = await fetch('inc/contact.php', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.status === 'success') {
        showToast('Success!', result.message, 'success');
        
        // Reset inputs & validation outlines
        form.reset();
        [nameInput, emailInput, phoneInput, messageInput].forEach(inp => {
          inp.classList.remove('is-valid');
          inp.classList.remove('is-invalid');
        });
      } else {
        showToast('Submission Failed', result.message || 'An error occurred.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('System Error', 'Could not reach server. Please try again later.', 'error');
    } finally {
      resetSubmitBtn(origBtnHTML);
    }
  }

  function resetSubmitBtn(origBtnHTML) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnHTML;
  }
}

// ----------------------------------------------------
// 6. Dynamic Copyright Year
// ----------------------------------------------------
function initCopyrightYear() {
  const yearElement = document.getElementById('copyright-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ----------------------------------------------------
// Init script components when document is ready
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTheme();
  initViewSwitcher();
  initNavigation();
  initAnimations();
  initContactForm();
  initCopyrightYear();
});
