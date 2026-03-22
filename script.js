// =============================================
//  Vagbharathi Vidhya Samasthe – script.js
// =============================================

// ── Sticky Navbar Shadow on Scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Hamburger / Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// ── Active Nav Link Highlight on Scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
      });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && !active.classList.contains('nav-cta')) {
        active.style.color = 'var(--green-700)';
        active.style.fontWeight = '600';
      }
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

// ── Scroll Reveal Animation ──
const revealElements = document.querySelectorAll(
  '.academic-card, .faculty-card, .news-card, .gallery-item, .pillar, .step, .stat-card'
);
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add staggered delay to grid items
document.querySelectorAll('.academics-grid .academic-card').forEach((el, i) => {
  el.dataset.delay = i * 80;
});
document.querySelectorAll('.faculty-grid .faculty-card').forEach((el, i) => {
  el.dataset.delay = i * 80;
});
document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.dataset.delay = i * 60;
});

revealElements.forEach(el => revealObserver.observe(el));

// ── Smooth Scroll for Internal Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Enquiry Form Toast ──
function handleEnquiry() {
  const inputs = document.querySelectorAll('.admissions-form-card input, .admissions-form-card select');
  let allFilled = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) {
      allFilled = false;
      inp.style.borderColor = '#e24b4a';
      setTimeout(() => { inp.style.borderColor = ''; }, 2500);
    }
  });

  if (!allFilled) {
    showToast('⚠️ Please fill in all fields before submitting.', '#c04828');
    return;
  }

  // Simulate form submission
  showToast('✅ Enquiry submitted! We\'ll be in touch soon.');
  inputs.forEach(inp => { inp.value = ''; });
}

function showToast(message, bg) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  if (bg) toast.style.background = bg;
  else toast.style.background = '';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Gallery Item Click ──
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.gallery-label')?.textContent || 'Gallery Image';
    showToast(`📸 ${label} — Add real images to assets/images/ folder`);
  });
});

// ── Counter Animation for Hero Stats ──
// Reads values directly from your HTML — just edit index.html freely!
function animateCounter(el, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const update = () => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(current) + suffix;
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.textContent.trim();
        const suffix = raw.replace(/^[\d,]+/, '');
        const target = parseInt(raw.replace(/,/g, ''), 10);
        if (!isNaN(target)) animateCounter(el, target, suffix);
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ── Navbar Transparent → Solid on Scroll ──
function updateNav() {
  const hero = document.getElementById('home');
  if (!hero) return;
  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom < 0) {
    navbar.style.background = 'rgba(255,255,255,0.98)';
  } else {
    navbar.style.background = '';
  }
}
window.addEventListener('scroll', updateNav, { passive: true });