/* ========================================
   script.js — Editorial Insight & Story
   ======================================== */

// ── Navbar: 스크롤 시 배경 처리 ──────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── 모바일 메뉴 토글 ─────────────────────────────
const menuBtn = document.getElementById('menu-btn');
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
const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

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
window.toggleArchive = function () {
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

// ── YouTube: JSON fetch & 동적 렌더링 ────────────
(async function renderYouTube() {
  // 날짜를 "YYYY.MM.DD" 형식으로 변환
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  }

  // 아카이브 썸네일 카드 HTML 생성
  function buildArchiveCard(video, hidden) {
    const hiddenClass = hidden ? ' archive-hidden hidden' : '';
    return `
      <a href="${video.url}" target="_blank" rel="noopener" class="group block${hiddenClass}">
        <div class="aspect-video bg-neutral-900 mb-3 border border-cream/10 overflow-hidden relative">
          <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt=""
               class="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out">
          <div class="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div class="w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center shadow-lg">
              <svg class="w-4 h-4 text-forest ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
        <h5 class="text-[0.85rem] font-medium leading-snug text-cream/80 group-hover:text-cream transition-colors line-clamp-2">${video.title}</h5>
        <p class="text-[0.65rem] text-cream/30 mt-1.5 font-serif italic">${formatDate(video.date)}</p>
      </a>`;
  }

  try {
    const res = await fetch('youtube_data.json');
    const data = await res.json();
    const { mainId, videos } = data;

    // 날짜 내림차순 정렬
    const sorted = [...videos].sort((a, b) => new Date(b.date) - new Date(a.date));

    const mainVideo = sorted.find(v => v.id === mainId);
    const archiveVideos = sorted; // mainId 영상도 아카이브에 포함

    // ── Signature Insight 렌더링 ──
    const sigContainer = document.getElementById('signature-insight-container');
    if (sigContainer && mainVideo) {
      const descHtml = mainVideo.description
        ? mainVideo.description
          .split('\n')
          .filter(l => l.trim())
          .map(l => `<p class="mb-4">${l}</p>`)
          .join('')
        : '';

      sigContainer.innerHTML = `
        <div class="aspect-video w-full border border-cream/10 editorial-shadow bg-black">
          <iframe class="w-full h-full"
            src="https://www.youtube.com/embed/${mainVideo.id}"
            title="${mainVideo.title}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
        <div class="flex flex-col h-full justify-center">
          <span class="inline-block px-3 py-1 border border-cream/30 text-[0.65rem] tracking-[0.2em] uppercase text-cream/70 mb-5 w-fit rounded-full">Weekly Opinion</span>
          <h4 class="text-xl md:text-2xl font-medium leading-snug text-cream mb-2">${mainVideo.title}</h4>
          <div class="text-sm text-cream/40 font-serif italic mb-6 border-b border-cream/10 pb-4">${formatDate(mainVideo.date)}</div>
          <div class="text-cream/80 text-sm leading-relaxed font-light">${descHtml}</div>
        </div>`;
    }

    // ── Broadcast Archive 렌더링 ──
    const grid = document.getElementById('archive-grid');
    const toggleBtn = document.getElementById('archive-toggle-btn');
    if (grid) {
      const VISIBLE_COUNT = 5; // 첫 번째 행에 보여줄 개수
      const html = archiveVideos
        .map((v, i) => buildArchiveCard(v, i >= VISIBLE_COUNT))
        .join('');
      grid.innerHTML = html;

      // 숨겨진 항목이 없으면 버튼 숨김
      if (archiveVideos.length <= VISIBLE_COUNT && toggleBtn) {
        toggleBtn.style.display = 'none';
      }
    }
  } catch (e) {
    console.warn('youtube_data.json 로드 실패:', e);
  }
})();

