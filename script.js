/* ========================================
   script.js — Editorial Insight & Story
   ======================================== */

// ── Navbar: 스크롤 시 배경 처리 ──────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── 모바일 메뉴 토글 ─────────────────────────────
const menuBtn    = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ── 스크롤 애니메이션 ────────────────────────────
const scrollEls = document.querySelectorAll('.scroll-animate');
const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // 스킬 바 트리거
    entry.target.querySelectorAll('.skill-bar').forEach(bar => {
      const w = bar.getAttribute('data-width');
      setTimeout(() => { bar.style.width = w + '%'; }, 280);
    });

    appearObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

scrollEls.forEach(el => appearObserver.observe(el));

// ── 앵커 스무스 스크롤 ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── 현재 섹션 기반 네비 활성화 ───────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#navbar a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('nav-active', active);
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => navObserver.observe(s));

// ── Footer 연도 자동 업데이트 ─────────────────────
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Media: Archive Expand ────────────────────────
window.toggleArchive = function() {
  const hiddenItems = document.querySelectorAll('.archive-hidden');
  const btn = document.getElementById('archive-toggle-btn');
  
  hiddenItems.forEach(item => {
    item.classList.remove('hidden');
    // Fade-in animation
    requestAnimationFrame(() => {
        item.style.opacity = '0';
        requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.8s ease';
            item.style.opacity = '1';
        });
    });
  });
  
  if (btn) btn.style.display = 'none';
};
