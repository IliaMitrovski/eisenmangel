// ── PHOTO CARD GLITCH (chromatic aberration on hover) ──
document.querySelectorAll('.photo-card').forEach(card => {
  const img = card.querySelector('img');
  if (img) card.style.setProperty('--img-url', `url("${img.getAttribute('src')}")`);
});

// ── ANT CURSOR ──
const ant = document.getElementById('ant-cursor');
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let ax = mx, ay = my;
let lastX = mx, lastY = my;
let legPhase = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

const legsA = document.querySelectorAll('.leg-a');
const legsB = document.querySelectorAll('.leg-b');
const legsABaseX2 = Array.from(legsA).map(leg => parseFloat(leg.getAttribute('x2')));
const legsBBaseX2 = Array.from(legsB).map(leg => parseFloat(leg.getAttribute('x2')));

function animateLegs(dx, dy) {
  const speed = Math.sqrt(dx * dx + dy * dy);
  legPhase += Math.min(speed * 0.18, 0.55);
  const s = Math.sin(legPhase);
  const a = 3;
  legsA.forEach((leg, i) => leg.setAttribute('x2', legsABaseX2[i] + s * a));
  legsB.forEach((leg, i) => leg.setAttribute('x2', legsBBaseX2[i] - s * a));
}

function tick() {
  ax += (mx - ax) * 0.16;
  ay += (my - ay) * 0.16;
  const dx = ax - lastX;
  const dy = ay - lastY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  ant.style.left = ax + 'px';
  ant.style.top  = ay + 'px';
  ant.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  animateLegs(dx, dy);
  lastX = ax;
  lastY = ay;
  requestAnimationFrame(tick);
}
tick();

// ── SCROLL SKEW ──
const skewImgs = document.querySelectorAll('.skew-img');
let lastScroll = window.scrollY;
let skewTarget = 0;
let skewCurrent = 0;
let skewTimer = null;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const delta = scrollY - lastScroll;
  lastScroll = scrollY;
  skewTarget = Math.max(-8, Math.min(8, delta * 0.18));
  clearTimeout(skewTimer);
  skewTimer = setTimeout(() => { skewTarget = 0; }, 150);
}, { passive: true });

function skewLoop() {
  skewCurrent += (skewTarget - skewCurrent) * 0.12;
  skewImgs.forEach(img => {
    img.style.transform = `skewY(${skewCurrent.toFixed(3)}deg) scale(1.06)`;
  });
  requestAnimationFrame(skewLoop);
}
skewLoop();

// ── DOT NAV ──
const dots = document.querySelectorAll('.dot');
const sectionIds = ['cover', 'projects', 'about', 'contact'];
const sections = sectionIds.map(id => document.getElementById(id));

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`.dot[data-target="${entry.target.id}"]`);
      if (dot) dot.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => { if (s) io.observe(s); });
