/* ============================================================
   UDIPTA KUMAR PORTFOLIO — script.js
   Cursor · Loader · Canvas · Typing · Scroll animations
   ============================================================ */

// ─── LOADER ───────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Trigger hero animations
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
    // Start stat counters
    startCounters();
  }, 2000);
});
document.body.style.overflow = 'hidden';

// ─── CUSTOM CURSOR ────────────────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .about-card, .cert-card, .edu-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ─── NAV ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── HERO CANVAS (PARTICLES) ──────────────────────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '108,99,255' : '0,212,255';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

// Mouse influence on particles
let mx = W / 2, my = H / 2;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;
});

function initParticles() {
  const count = Math.min(Math.floor(W * H / 8000), 120);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── TYPING ANIMATION ─────────────────────────────────────────
const roles = [
  'Software Development Engineer',
  'Backend Engineer',
  'ML Systems Developer',
  'API Architect',
  'Problem Solver'
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedRole');

function typeRole() {
  const current = roles[roleIdx];
  if (isDeleting) {
    charIdx--;
    typedEl.textContent = current.substring(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeRole, 400);
      return;
    }
    setTimeout(typeRole, 45);
  } else {
    charIdx++;
    typedEl.textContent = current.substring(0, charIdx);
    if (charIdx === current.length) {
      setTimeout(() => { isDeleting = true; typeRole(); }, 2000);
      return;
    }
    setTimeout(typeRole, 80);
  }
}
setTimeout(typeRole, 2500);

// ─── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el);
});

// Also observe sections for skill bars
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ─── STAT COUNTERS ────────────────────────────────────────────
function startCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = eased * target;
      el.textContent = isDecimal ? val.toFixed(2) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(update);
  });
}

// ─── PARALLAX ─────────────────────────────────────────────────
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroContent = document.querySelector('.hero-content');
      const heroImg = document.querySelector('.hero-image-wrap');
      if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      if (heroImg && window.innerWidth > 768) heroImg.style.transform = `translateY(calc(-50% + ${scrollY * 0.08}px))`;
      ticking = false;
    });
    ticking = true;
  }
});

// ─── 3D TILT ON PROJECT CARDS ─────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth <= 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    // Only tilt when not flipped
    if (!card.querySelector('.project-card-inner').style.transform.includes('180')) {
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── ABOUT CARD HOVER SOUND (subtle) ──────────────────────────
// Using Web Audio API for a very faint hover tick
let audioCtx;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTick() {
  try {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 1200;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('mouseenter', () => playTick());
});
document.addEventListener('click', () => initAudio(), { once: true });

// ─── CONTACT FORM ─────────────────────────────────────────────
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<span>Sending...</span>';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.innerHTML = '<span>✓ Message Sent!</span>';
    btn.style.opacity = '1';
    btn.style.background = 'linear-gradient(135deg, #00d4ff, #6c63ff)';
    form.reset();
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
      btn.style.background = '';
    }, 3000);
  }, 1200);
});

// ─── SMOOTH ACTIVE NAV HIGHLIGHT ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

// ─── GLITCH TEXT EFFECT ON HERO NAME ─────────────────────────
const heroName = document.querySelector('.hero-name');
let glitchTimeout;
if (heroName) {
  heroName.addEventListener('mouseenter', () => {
    heroName.style.textShadow = '2px 0 var(--accent-2), -2px 0 var(--accent-3)';
    clearTimeout(glitchTimeout);
    glitchTimeout = setTimeout(() => {
      heroName.style.textShadow = '';
    }, 500);
  });
}

// ─── SECTION GRADIENT BACKGROUNDS ─────────────────────────────
// Add subtle moving gradient to certain sections
function addAmbientGlow() {
  const sections = document.querySelectorAll('.skills-section, .projects-section');
  sections.forEach(section => {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute;top:0;left:0;right:0;bottom:0;
      background:radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.04) 0%, transparent 60%),
                 radial-gradient(ellipse at 70% 30%, rgba(0,212,255,0.03) 0%, transparent 60%);
      pointer-events:none;z-index:0;
    `;
    section.style.position = section.style.position || 'relative';
    section.prepend(glow);
  });
}
addAmbientGlow();

// ─── HERO IMAGE MOUSE FOLLOW GLOW ─────────────────────────────
const heroSection = document.getElementById('hero');
const imageGlow = document.querySelector('.image-glow');
if (heroSection && imageGlow) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    const imgWrap = document.querySelector('.hero-image-wrap');
    if (imgWrap && window.innerWidth > 768) {
      imgWrap.style.transform = `translateY(calc(-50% + ${y * 0.5}px)) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
    }
  });
  heroSection.addEventListener('mouseleave', () => {
    const imgWrap = document.querySelector('.hero-image-wrap');
    if (imgWrap) imgWrap.style.transform = 'translateY(-50%)';
  });
}

// ─── PAGE LOAD PERFORMANCE MARKS ──────────────────────────────
console.log(
  '%c Udipta Kumar Portfolio ',
  'background:linear-gradient(135deg,#6c63ff,#00d4ff);color:white;padding:8px 16px;border-radius:4px;font-family:monospace;font-size:14px;font-weight:bold'
);
console.log('%c Built with precision & purpose.', 'color:#6c63ff;font-family:monospace;');