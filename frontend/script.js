// ============================================================
//  Vagbharathi Vidhya Samasthe — script.js
//  Connected to MongoDB backend via REST API
// ============================================================

// ── CONFIG: change to your Render.com URL after deployment ──
// Ensure this matches backend port (default is 3000 in server.js)
const API = "http://localhost:3000/api";

// Avatar colors for faculty cards
const AVATAR_COLORS = [
  "#0d1f38","#143460","#1b4580","#2258a0","#3370bf",
  "#0a3d22","#1a5c40","#2e7d5e","#0f4d2e","#237848"
];

// ============================================================
//  NAVBAR — sticky + transparent/solid on scroll
// ============================================================
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// ============================================================
//  HAMBURGER — mobile menu
// ============================================================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  const spans = hamburger.querySelectorAll("span");
  spans[0].style.transform = open ? "translateY(7px) rotate(45deg)"  : "";
  spans[1].style.opacity   = open ? "0" : "";
  spans[2].style.transform = open ? "translateY(-7px) rotate(-45deg)": "";
});

document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove("open");
    hamburger.querySelectorAll("span").forEach(s => {
      s.style.transform = ""; s.style.opacity = "";
    });
  }
});

mobileMenu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => mobileMenu.classList.remove("open"))
);

// ============================================================
//  SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16,
        behavior: "smooth"
      });
    }
  });
});

// ============================================================
//  SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"),
        entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function observeReveal() {
  document.querySelectorAll(
    ".academic-card, .faculty-card, .news-card, .gallery-item, .pillar, .step"
  ).forEach((el, i) => {
    el.classList.add("reveal");
    el.dataset.delay = (i % 6) * 80;
    revealObserver.observe(el);
  });
}

// ============================================================
//  COUNTER ANIMATION — reads values from HTML
// ============================================================
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = target / 60;
  const tick = () => {
    current += step;
    if (current >= target) { el.textContent = target + suffix; return; }
    el.textContent = Math.floor(current) + suffix;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".stat-num").forEach(el => {
        const raw    = el.textContent.trim();
        const suffix = raw.replace(/^[\d,]+/, "");
        const target = parseInt(raw.replace(/,/g, ""), 10);
        if (!isNaN(target)) animateCounter(el, target, suffix);
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) heroObserver.observe(heroStats);

// ============================================================
//  TOAST
// ============================================================
function showToast(msg, color) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.style.background = color || "";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3500);
}

// ============================================================
//  GENERIC FETCH HELPER
// ============================================================
async function apiFetch(path) {
  try {
    const res = await fetch(API + path);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn("API unavailable:", path);
    return null;
  }
}

// ============================================================
//  NEWS — load from MongoDB
// ============================================================
async function loadNews() {
  const news = await apiFetch("/news");
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  if (!news || !news.length) {
    grid.innerHTML = `
      <div class="news-card featured-news">
        <div class="news-img" style="background:linear-gradient(135deg,var(--navy-800),var(--navy-600))">
          <div class="news-category">Updates</div>
        </div>
        <div class="news-content">
          <span class="news-date">Stay tuned</span>
          <h3>News & events coming soon</h3>
          <p>Check back here for the latest school updates, achievements and events.</p>
        </div>
      </div>`;
    return;
  }

  // First item = featured, rest = small cards
  const [featured, ...rest] = news.slice(0, 4);

  const featuredHTML = `
    <div class="news-card featured-news reveal">
      <div class="news-img" style="background:linear-gradient(135deg,var(--navy-800) 0%,var(--navy-500) 100%)">
        <div class="news-category">${featured.category}</div>
      </div>
      <div class="news-content">
        <span class="news-date">${featured.date}</span>
        <h3>${featured.title}</h3>
        <p>${featured.content?.substring(0, 140)}...</p>
        <a href="#" class="news-read">Read More →</a>
      </div>
    </div>`;

  const restHTML = rest.map(n => `
    <div class="news-card reveal">
      <div class="news-img small" style="background:linear-gradient(135deg,var(--navy-750) 0%,var(--navy-600) 100%)">
        <div class="news-category">${n.category}</div>
      </div>
      <div class="news-content">
        <span class="news-date">${n.date}</span>
        <h3>${n.title}</h3>
        <p>${n.content?.substring(0, 100)}...</p>
        <a href="#" class="news-read">Read More →</a>
      </div>
    </div>`).join("");

  grid.innerHTML = featuredHTML + restHTML;
  observeReveal();
}

// ============================================================
//  FACULTY — load from MongoDB
// ============================================================
async function loadFaculty() {
  const faculty = await apiFetch("/faculty");
  const grid = document.getElementById("faculty-grid");
  if (!grid) return;

  if (!faculty || !faculty.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;color:var(--slate);padding:2rem;">
        Faculty details coming soon.
      </div>`;
    return;
  }

  grid.innerHTML = faculty.map((f, i) => `
    <div class="faculty-card reveal">
      <div class="faculty-avatar" style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">
        <span>${f.initials || f.name.split(" ").map(w=>w[0]).join("").substring(0,2).toUpperCase()}</span>
      </div>
      <h4>${f.name}</h4>
      <span class="faculty-role">${f.role}</span>
      <p>${f.qualification ? f.qualification + " | " : ""}${f.department}</p>
    </div>`).join("");

  observeReveal();
}

// ============================================================
//  GALLERY — load from MongoDB
// ============================================================
async function loadGallery() {
  const items = await apiFetch("/gallery");
  const grid  = document.getElementById("gallery-grid");
  if (!grid) return;

  if (!items || !items.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);padding:3rem;">
        Gallery photos coming soon.
      </div>`;
    return;
  }

  grid.innerHTML = items.slice(0, 6).map((g, i) => `
    <div class="gallery-item reveal ${i === 0 ? "gi-tall" : i === 3 ? "gi-wide" : ""}"
         style="background:url('${g.imageUrl}') center/cover no-repeat;">
      <div class="gallery-label">${g.label}</div>
    </div>`).join("");

  observeReveal();
}

// ============================================================
//  ADMISSIONS FORM — saves to MongoDB
// ============================================================
async function handleEnquiry() {
  const parentName   = document.getElementById("adm-parent")?.value.trim();
  const studentName  = document.getElementById("adm-student")?.value.trim();
  const classApplied = document.getElementById("adm-class")?.value;
  const phone        = document.getElementById("adm-phone")?.value.trim();

  // Validate
  const fields = [
    document.getElementById("adm-parent"),
    document.getElementById("adm-student"),
    document.getElementById("adm-class"),
    document.getElementById("adm-phone")
  ];
  let valid = true;
  fields.forEach(f => {
    if (!f || !f.value.trim()) {
      if (f) f.style.borderColor = "#dc2626";
      setTimeout(() => { if(f) f.style.borderColor = ""; }, 2500);
      valid = false;
    }
  });
  if (!valid) return showToast("⚠️ Please fill in all fields", "#dc2626");

  try {
    const res = await fetch(`${API}/admissions/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentName, studentName, classApplied, phone })
    });
    const data = await res.json();
    if (res.ok) {
      showToast("✅ Enquiry submitted! We'll be in touch soon.");
      fields.forEach(f => { if(f) f.value = ""; });
    } else {
      showToast("❌ Submission failed. Please try again.", "#dc2626");
    }
  } catch (e) {
    showToast("❌ Cannot connect to server. Please call us directly.", "#dc2626");
  }
}

// ============================================================
//  ACTIVE NAV LINK on scroll
// ============================================================
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav-links a");

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => { a.style.color = ""; a.style.fontWeight = ""; });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && !active.classList.contains("nav-cta")) {
        active.style.color      = "var(--navy-700)";
        active.style.fontWeight = "600";
      }
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => activeObserver.observe(s));

// ============================================================
//  INIT — load everything on page load
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  loadFaculty();
  loadGallery();
  observeReveal();
});