// ── PROJECT HERO GLITCH (chromatic aberration on hover) ──
document.querySelectorAll('.project-hero').forEach(hero => {
  const img = hero.querySelector('img');
  if (img) hero.style.setProperty('--img-url', `url("${img.getAttribute('src')}")`);
});

// ── SERIES EXPAND ──
document.querySelectorAll('.project-hero.series .series-cover').forEach(cover => {
  cover.addEventListener('click', () => {
    cover.closest('.project-hero').classList.toggle('expanded');
  });
});

// ── WORK OVERLAY ──
const workOverlay = document.getElementById('work-overlay');
const navWorkLink = document.getElementById('nav-work-link');
const workClose = document.getElementById('work-close');

function openWork(e) {
  if (e) e.preventDefault();
  workOverlay.classList.add('open');
}
function closeWork() {
  workOverlay.classList.remove('open');
}

if (navWorkLink) navWorkLink.addEventListener('click', openWork);
if (workClose) workClose.addEventListener('click', closeWork);
document.querySelectorAll('.work-row').forEach(row => {
  row.addEventListener('click', closeWork);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeWork();
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
  legPhase += Math.min(speed * 0.3, 1.1);
  const s = Math.sin(legPhase);
  const a = 4;
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
