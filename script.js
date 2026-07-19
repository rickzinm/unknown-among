// ===== CUSTOM CURSOR =====
const cursorDot = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.classList.add('cursor-dot');
cursorRing.classList.add('cursor-ring');
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .about-card, .tier, .rule-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '50px';
    cursorRing.style.height = '50px';
    cursorRing.style.borderColor = 'rgba(255,255,255,0.8)';
    cursorDot.style.transform = 'translate(-50%,-50%) scale(2)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '30px';
    cursorRing.style.height = '30px';
    cursorRing.style.borderColor = 'rgba(255,255,255,0.5)';
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 40;

function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');

  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const duration = Math.random() * 20 + 15;
  const delay = Math.random() * 15;
  const opacity = Math.random() * 0.4 + 0.1;

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    animation-duration: ${duration}s;
    animation-delay: -${delay}s;
    opacity: ${opacity};
  `;

  particlesContainer.appendChild(p);
}

for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const startVal = 0;

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Counter
      if (entry.target.classList.contains('stat-item')) {
        const numEl = entry.target.querySelector('.stat-number');
        const target = parseInt(numEl.getAttribute('data-target'));
        animateCounter(numEl, target);
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.about-card, .rule-item, .tier, .stat-item, .reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== GLITCH TEXT EFFECT =====
const heroTitle = document.querySelector('.hero-title .line-1');
if (heroTitle) {
  setInterval(() => {
    if (Math.random() < 0.15) {
      heroTitle.style.animation = 'none';
      heroTitle.offsetHeight; // reflow
      heroTitle.style.animation = 'glitch 0.3s ease';
    }
  }, 3000);
}

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const bgText = document.querySelector('.hero-bg-text');
  const symbolContainer = document.querySelector('.symbol-container');

  if (bgText) bgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
  if (symbolContainer) symbolContainer.style.transform = `translateY(${scrolled * 0.15}px)`;
});

// ===== CARD HOVER TILT =====
document.querySelectorAll('.about-card, .tier').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== SECTION REVEAL WITH DELAYS =====
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => {
        entry.target.style.animationDelay = '0ms';
        entry.target.classList.add('visible');
      }, parseInt(delay));
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-delay]').forEach(el => cardObserver.observe(el));

// ===== TERMINAL TYPING EFFECT =====
const terminal = document.querySelector('.terminal-block');
if (terminal) {
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const questions = document.querySelectorAll('.t-question');
        questions.forEach((q, i) => {
          q.style.opacity = '0';
          q.style.transform = 'translateX(-8px)';
          q.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          setTimeout(() => {
            q.style.opacity = '1';
            q.style.transform = 'translateX(0)';
          }, 600 + i * 180);
        });
        termObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  termObserver.observe(terminal);
}

// ===== PROCESS STEP ANIMATE =====
const psObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const dots = entry.target.querySelectorAll('.ps-dot');
      dots.forEach((dot, i) => {
        setTimeout(() => {
          dot.style.transition = 'all 0.4s ease';
          dot.classList.add('active');
        }, i * 300);
      });
      psObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.process-timeline').forEach(el => psObserver.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (scrollY >= top && scrollY < bottom && link) {
      document.querySelectorAll('.nav-links a').forEach(l => l.style.color = '');
      link.style.color = 'white';
    }
  });
});

// ===== HERO ENTRANCE =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ===== BUTTON RIPPLE =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.cssText = `
      position: absolute;
      width: 0; height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: translate(-50%, -50%);
      left: ${x}px; top: ${y}px;
      animation: rippleAnim 0.6s ease forwards;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { width: 300px; height: 300px; opacity: 0; }
  }
`;
document.head.appendChild(style);
