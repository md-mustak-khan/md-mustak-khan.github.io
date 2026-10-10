/**
 * ===================================================================
 * IELTS MASTER PRO - MASTER PORTAL & ORCHESTRATION SCRIPT
 * Seamlessly manages Pillars (Cambridge Tests, VocabMaster, Prep Guide, Library)
 * ===================================================================
 */

window.IELTSMaster = (function () {
  'use strict';

  const validPillars = ['home', 'vocab', 'guide', 'resources', 'library', 'calculator'];
  let savedPillar = null;
  try {
    savedPillar = localStorage.getItem('ielts_master_pillar');
  } catch (e) {}

  if (!savedPillar || !validPillars.includes(savedPillar)) {
    savedPillar = 'home';
    try { localStorage.setItem('ielts_master_pillar', 'home'); } catch (e) {}
  }

  const state = {
    currentPillar: savedPillar,
    libraryFilter: 'all',
    librarySearch: '',
    guideTab: 'format'
  };

  const dom = {
    masterPillarsNav: document.getElementById('masterPillarsNav'),
    pillarBtns: document.querySelectorAll('.pillar-nav-btn'),
    pillarContainers: document.querySelectorAll('.pillar-container'),
    
    // Context toolbars
    calculatorToolbar: document.getElementById('calculatorContextToolbar'),
    homeToolbar: document.getElementById('homeContextToolbar'),
    vocabToolbar: document.getElementById('vocabContextToolbar'),
    guideToolbar: document.getElementById('guideContextToolbar'),
    libraryToolbar: document.getElementById('libraryContextToolbar'),

    // Guide
    guideTabs: document.querySelectorAll('.guide-tab-btn'),
    guideSections: document.querySelectorAll('.guide-content-section'),

    // Master Library
    libraryGrid: document.getElementById('masterMaterialsGrid'),
    librarySearchInput: document.getElementById('masterLibSearchInput'),
    libraryChips: document.querySelectorAll('.lib-filter-chip'),
    libraryTotalCount: document.getElementById('masterLibTotalCount'),

    // Universal PDF Modal
    pdfModal: document.getElementById('pdfViewerModal'),
    pdfTitle: document.getElementById('pdfViewerTitle'),
    pdfSubtitle: document.getElementById('pdfViewerSubtitle'),
    pdfIframe: document.getElementById('pdfViewerIframe'),
    btnClosePdf: document.getElementById('btnClosePdfModal'),
    btnExternalPdf: document.getElementById('btnOpenPdfExternal'),

    // Toast
    toast: document.getElementById('appToast'),

    // Fullscreen
    btnFullscreen: document.getElementById('masterFullscreenToggle')
  };

  function init() {
    setupPillarNavigation();
    setupGuideNavigation();
    setupMasterLibrary();
    setupUniversalPdfModal();
    setupFullscreen();
    setupHeroControls();
    setupThemeToggle();
    setupStudyStreak();
    setupMobileDrawer();
    setupGlobalSearch();
    setupBandScoreCalculator();
    setupWordOfTheDay();
    setupServiceWorker();
    setupLanguageListener();
    syncHeaderHeight();

    // Switch to initial saved pillar
    switchPillar(state.currentPillar);
  }

  // ==================== BILINGUAL LANGUAGE LISTENER ====================
  function setupLanguageListener() {
    window.addEventListener('ielts-lang-changed', (e) => {
      const isEnglish = e.detail?.isEnglish || (e.detail?.lang === 'en');
      const streakSuffix = document.querySelector('[data-i18n="streak_days_suffix"]');
      if (streakSuffix) {
        streakSuffix.textContent = isEnglish ? 'Days' : 'দিন';
      }
    });
  }


  // ==================== HERO BANNER CONTROLS ====================
  function setupHeroControls() {
    const btnClose = document.getElementById('btnCloseHero');
    const btnOpen = document.getElementById('btnOpenHero');
    const heroCard = document.getElementById('heroMainCard');
    const collapsedBar = document.getElementById('heroCollapsedBar');

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        toggleHeroBanner(false);
      });
    }

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        toggleHeroBanner(true);
      });
    }

    if (localStorage.getItem('ielts_hero_collapsed') === 'true') {
      if (heroCard) heroCard.style.display = 'none';
      if (collapsedBar) collapsedBar.style.display = 'flex';
    }
  }

  function toggleHeroBanner(show) {
    const heroCard = document.getElementById('heroMainCard');
    const collapsedBar = document.getElementById('heroCollapsedBar');
    if (show) {
      if (heroCard) heroCard.style.display = 'grid';
      if (collapsedBar) collapsedBar.style.display = 'none';
      localStorage.setItem('ielts_hero_collapsed', 'false');
    } else {
      if (heroCard) heroCard.style.display = 'none';
      if (collapsedBar) collapsedBar.style.display = 'flex';
      localStorage.setItem('ielts_hero_collapsed', 'true');
    }
  }

  function startTestFromHero(pillarName) {
    switchPillar(pillarName || 'vocab');
    setTimeout(() => {
      const mainEl = document.getElementById('mainContent');
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }

    // ==================== MASTER PILLARS SWITCHER ====================
  function setupPillarNavigation() {
    dom.pillarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pillar = btn.dataset.pillar;
        switchPillar(pillar);
      });
    });
  }

  function switchPillar(pillarName) {
    if (pillarName === 'cambridge' || pillarName === 'tests') pillarName = 'library';
    const validPillars = ['home', 'vocab', 'guide', 'resources', 'library', 'calculator'];
    if (!validPillars.includes(pillarName)) {
      pillarName = 'home';
    }

    state.currentPillar = pillarName;
    try {
      localStorage.setItem('ielts_master_pillar', pillarName);
    } catch (e) {}

    // Update Master Top Tabs
    document.querySelectorAll('.pillar-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pillar === pillarName);
    });

    // Update Drawer Links
    document.querySelectorAll('.drawer-link-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pillar === pillarName);
    });

    // Update Pillar Containers - explicitly manage display property
    const containers = document.querySelectorAll('.pillar-container');
    let foundActive = false;
    containers.forEach(container => {
      const isCurrent = (container.id === `pillar-${pillarName}`);
      container.classList.toggle('active', isCurrent);
      if (isCurrent) {
        foundActive = true;
        container.style.display = 'block';
        container.style.visibility = 'visible';
      } else {
        container.style.display = 'none';
      }
    });

    // Fallback if none matched
    if (!foundActive) {
      const homeEl = document.getElementById('pillar-home') || document.getElementById('pillar-vocab');
      if (homeEl) {
        homeEl.classList.add('active');
        homeEl.style.display = 'block';
        homeEl.style.visibility = 'visible';
      }
    }

    // Toggle Context Toolbars
    const toolbarMap = {
      home: document.getElementById('homeContextToolbar'),
      vocab: document.getElementById('vocabContextToolbar'),
      guide: document.getElementById('guideContextToolbar'),
      resources: document.getElementById('resourcesContextToolbar'),
      library: document.getElementById('libraryContextToolbar'),
      calculator: document.getElementById('calculatorContextToolbar')
    };

    Object.entries(toolbarMap).forEach(([key, tb]) => {
      if (!tb) return;
      const isCurrent = (key === pillarName);
      tb.classList.toggle('active', isCurrent);
      if (isCurrent) {
        tb.style.setProperty('display', 'flex', 'important');
      } else {
        tb.style.setProperty('display', 'none', 'important');
      }
    });
  }

  // ==================== A TO Z PREP GUIDE ====================
  function setupGuideNavigation() {
    document.querySelectorAll('.guide-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.guide;
        document.querySelectorAll('.guide-tab-btn').forEach(t => t.classList.toggle('active', t.dataset.guide === target));
        dom.guideSections.forEach(s => s.classList.toggle('active', s.id === `guide-${target}`));
      });
    });

    setupAwesomeResourcesDirectory();
  }

  function setupAwesomeResourcesDirectory() {
    const filterPills = document.querySelectorAll('.res-filter-pill');
    const searchInput = document.getElementById('resDirSearchInput');
    const moduleSections = document.querySelectorAll('.res-module-section');

    if (!filterPills.length || !moduleSections.length) return;

    let activeFilter = 'all';

    function applyFilterAndSearch() {
      const q = (searchInput ? searchInput.value : '').trim().toLowerCase();

      moduleSections.forEach(section => {
        const mod = section.dataset.module;
        const matchesModule = (activeFilter === 'all' || activeFilter === mod);
        let visibleCountInModule = 0;

        const tiles = section.querySelectorAll('.res-tile');
        tiles.forEach(tile => {
          const cat = tile.dataset.category;
          const kw = (tile.dataset.keywords || '').toLowerCase();
          const title = (tile.querySelector('.res-tile-title')?.textContent || '').toLowerCase();
          const desc = (tile.querySelector('.res-tile-desc')?.textContent || '').toLowerCase();

          const matchesCat = (activeFilter === 'all' || activeFilter === cat);
          const matchesQuery = !q || kw.includes(q) || title.includes(q) || desc.includes(q);

          if (matchesCat && matchesQuery) {
            tile.style.display = 'flex';
            visibleCountInModule++;
          } else {
            tile.style.display = 'none';
          }
        });

        if (matchesModule && visibleCountInModule > 0) {
          section.style.display = 'flex';
        } else {
          section.style.display = 'none';
        }
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.dataset.resFilter || 'all';
        applyFilterAndSearch();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilterAndSearch);
    }
  }

  // ==================== MASTER MATERIALS & PDF LIBRARY ====================
  function setupMasterLibrary() {
    if (!window.IELTS_MATERIALS_DATA || !dom.libraryGrid) return;

    // Filter Chips
    dom.libraryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dom.libraryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.libraryFilter = chip.dataset.cat;
        renderLibraryBooks();
      });
    });

    // Search input
    if (dom.librarySearchInput) {
      dom.librarySearchInput.addEventListener('input', (e) => {
        state.librarySearch = e.target.value.trim().toLowerCase();
        renderLibraryBooks();
      });
    }

    renderLibraryBooks();
  }

  const LIBRARY_CATEGORIES = [
    {
      id: '01. Cambridge Tests',
      titleBn: 'ক্যামব্রিজ অফিসিয়াল প্র্যাকটিস টেস্টস',
      titleEn: 'Cambridge Authentic Practice Tests',
      subtitleBn: 'ক্যামব্রিজ আইইএলটিএস ১০ থেকে ১৯ ও জেনারেল ট্রেনিং অফিসিয়াল টেস্ট সিরিজ',
      subtitleEn: 'Official Cambridge IELTS examination test series 10-19 & General Training',
      icon: 'fa-graduation-cap',
      badgeClass: 'badge-cyan',
      color: '#0891B2',
      bgLight: 'rgba(8, 145, 178, 0.08)'
    },
    {
      id: '02. Vocabulary & Idioms',
      titleBn: 'ভোকাবুলারি, ইডিয়মস ও কলোকেশনস',
      titleEn: 'Vocabulary, Idioms & Collocations',
      subtitleBn: 'ব্যান্ড ৮-৯ এর জন্য অ্যাডভান্সড শব্দভাণ্ডার, ব্যারনস ৮০০, ইডিয়মস ও ফ্রেজাল ভার্বস',
      subtitleEn: 'High-band vocabulary masteries, Barron 800, collocations & idiomatic expressions',
      icon: 'fa-spell-check',
      badgeClass: 'badge-indigo',
      color: '#4F46E5',
      bgLight: 'rgba(79, 70, 229, 0.08)'
    },
    {
      id: '03. Writing',
      titleBn: 'রাইটিং টাস্ক ১ ও ২ মাস্টার কালেকশন',
      titleEn: 'IELTS Writing Task 1 & Task 2 Master Collection',
      subtitleBn: 'ব্যান্ড ৯ মডেল এসে, গ্রাফ/চার্ট বিশ্লেষণ ও মাক্কার রাইটিং আইডিয়াস',
      subtitleEn: 'Band 9 model essays, graph/chart analysis and Makkar writing ideas',
      icon: 'fa-pen-nib',
      badgeClass: 'badge-purple',
      color: '#9333EA',
      bgLight: 'rgba(147, 51, 234, 0.08)'
    },
    {
      id: '04. Speaking',
      titleBn: 'স্পিকিং কিউ কার্ড ও ইন্টারভিউ গাইড',
      titleEn: 'IELTS Speaking Cue Cards & Interview Guides',
      subtitleBn: 'লেটেস্ট মাক্কার স্পিকিং ২০২৫ ফাইনাল ভার্সন ও পার্ট ১-৩ মডেল উত্তর',
      subtitleEn: 'Latest Makkar Speaking 2025 final edition with Part 1-3 model responses',
      icon: 'fa-microphone',
      badgeClass: 'badge-pink',
      color: '#DB2777',
      bgLight: 'rgba(219, 39, 119, 0.08)'
    },
    {
      id: '05. Reading',
      titleBn: 'রিডিং স্কিলস ও টেকনিকস',
      titleEn: 'Reading Skills & Speed Techniques',
      subtitleBn: 'স্কিমিং, স্ক্যানিং, ট্রু/ফলস/নট গিভেন স্ট্র্যাটেজি ও স্পিড রিডিং গাইড',
      subtitleEn: 'Skimming, scanning, True/False/Not Given mastery and speed reading guides',
      icon: 'fa-glasses',
      badgeClass: 'badge-emerald',
      color: '#059669',
      bgLight: 'rgba(5, 150, 105, 0.08)'
    },
    {
      id: '06. Grammar & Foundation',
      titleBn: 'গ্রামার ও বেসিক ফাউন্ডেশন',
      titleEn: 'Grammar & Foundation Mastery',
      subtitleBn: 'রেমন্ড মার্ফি ইংলিশ গ্রামার ইন ইউজ, সাইফুরস পাসপোর্ট ও বাক্য গঠনের নিয়ম',
      subtitleEn: 'Raymond Murphy English Grammar in Use and sentence structuring guides',
      icon: 'fa-cubes',
      badgeClass: 'badge-amber',
      color: '#D97706',
      bgLight: 'rgba(217, 119, 6, 0.08)'
    },
    {
      id: '07. Magazines & Extra Reading',
      titleBn: 'ম্যাগাজিন ও অতিরিক্ত রিডিং',
      titleEn: 'International Magazines & Extra Reading',
      subtitleBn: 'রিডার্স ডাইজেস্ট, ন্যাশনাল জিওগ্রাফিক, স্টিভ জবসের জীবনী ও ব্যাকগ্রাউন্ড জ্ঞান',
      subtitleEn: 'Reader’s Digest, National Geographic, Steve Jobs biography and background reading',
      icon: 'fa-newspaper',
      badgeClass: 'badge-blue',
      color: '#2563EB',
      bgLight: 'rgba(37, 99, 235, 0.08)'
    }
  ];

  function toBnDigits(num) {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, d => bn[d]);
  }

  function renderLibraryBooks() {
    if (!window.IELTS_MATERIALS_DATA || !dom.libraryGrid) return;

    let items = window.IELTS_MATERIALS_DATA;

    // Category Filter
    if (state.libraryFilter && state.libraryFilter !== 'all') {
      items = items.filter(b => b.category === state.libraryFilter || b.badge.toLowerCase() === state.libraryFilter.toLowerCase());
    }

    // Search Filter
    if (state.librarySearch) {
      items = items.filter(b => 
        (b.title && b.title.toLowerCase().includes(state.librarySearch)) ||
        b.filename.toLowerCase().includes(state.librarySearch) || 
        b.description.toLowerCase().includes(state.librarySearch) ||
        b.category.toLowerCase().includes(state.librarySearch) ||
        (b.badge && b.badge.toLowerCase().includes(state.librarySearch))
      );
    }

    if (dom.libraryTotalCount) {
      dom.libraryTotalCount.textContent = items.length;
    }

    if (items.length === 0) {
      dom.libraryGrid.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem; color: #94a3b8; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card);">
          <i class="fa-solid fa-file-circle-question" style="font-size: 3rem; margin-bottom: 1rem; color: #64748b;"></i>
          <h3 style="color: var(--primary); font-size: 1.25rem; margin-bottom: 0.5rem;">
            <span class="lang-bn-only">কোনো বই পাওয়া যায়নি</span>
            <span class="lang-en-only">No materials matched your search</span>
          </h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            <span class="lang-bn-only">অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা "সব বই" নির্বাচন করুন।</span>
            <span class="lang-en-only">Try searching for a different keyword or select "All Books".</span>
          </p>
        </div>
      `;
      return;
    }

    function renderBookCard(book) {
      const safeTitle = escapeHtml(book.title || book.filename.replace('.pdf', ''));
      const safeDesc = escapeHtml(book.description);
      const sizeStr = book.size_mb > 0 ? `${book.size_mb} MB` : 'PDF Document';
      const driveDirectUrl = book.gdrive_url || window.IELTS_GDRIVE_URL || 'https://drive.google.com/drive/folders/1Rqj5kBawXG6yC3gFM6im76Ac8IxO0aPx?usp=sharing';

      return `
        <div class="material-card">
          <div class="material-card-top">
            <div class="material-icon-box">
              <i class="fa-solid ${book.icon || 'fa-file-pdf'}"></i>
            </div>
            <span class="material-category-tag ${book.badgeColor || 'badge-cyan'}">${book.badge || 'PDF'}</span>
          </div>

          <h3 class="material-title" title="${safeTitle}">
            <a href="${driveDirectUrl}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
          </h3>
          <p class="material-desc">${safeDesc}</p>

          <div class="material-card-footer">
            <span class="material-size"><i class="fa-solid fa-hard-drive"></i> ${sizeStr}</span>
            <div class="material-actions">
              <a href="${driveDirectUrl}" target="_blank" rel="noopener noreferrer" class="btn-open-gdrive" title="Open in Google Drive: ${safeTitle}">
                <i class="fa-brands fa-google-drive"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }

    let html = '';
    LIBRARY_CATEGORIES.forEach(cat => {
      // Category filter check
      if (state.libraryFilter && state.libraryFilter !== 'all' && state.libraryFilter !== cat.id) {
        return;
      }

      // Filter books belonging to this category
      const catBooks = items.filter(b => b.category === cat.id);
      if (catBooks.length === 0) return;

      const countBn = toBnDigits(catBooks.length);
      const countEn = catBooks.length;

      html += `
        <section class="library-category-section" id="cat-sec-${cat.id.replace(/[^a-zA-Z0-9]/g, '-')}">
          <div class="library-section-header">
            <div class="library-section-title-wrap">
              <div class="library-section-icon" style="background: ${cat.bgLight}; color: ${cat.color};">
                <i class="fa-solid ${cat.icon}"></i>
              </div>
              <div class="library-section-heading">
                <h2>
                  <span class="lang-bn-only">${cat.titleBn}</span>
                  <span class="lang-en-only">${cat.titleEn}</span>
                </h2>
                <p class="library-section-subtitle">
                  <span class="lang-bn-only">${cat.subtitleBn}</span>
                  <span class="lang-en-only">${cat.subtitleEn}</span>
                </p>
              </div>
            </div>
            <div class="library-section-badge">
              <i class="fa-solid fa-book-bookmark"></i>
              <span class="lang-bn-only">${countBn}টি বই</span>
              <span class="lang-en-only">${countEn} Books</span>
            </div>
          </div>

          <div class="materials-grid">
            ${catBooks.map(renderBookCard).join('')}
          </div>
        </section>
      `;
    });

    dom.libraryGrid.innerHTML = html;
  }

  // ==================== UNIVERSAL PDF MODAL ====================
  function setupUniversalPdfModal() {
    if (dom.btnClosePdf) {
      dom.btnClosePdf.addEventListener('click', closePdfModal);
    }

    if (dom.pdfModal) {
      dom.pdfModal.addEventListener('click', (e) => {
        if (e.target === dom.pdfModal) closePdfModal();
      });
    }
  }

  const GOOGLE_DRIVE_FOLDER_URL = window.IELTS_GDRIVE_URL || 'https://drive.google.com/drive/folders/1Rqj5kBawXG6yC3gFM6im76Ac8IxO0aPx?usp=sharing';

  function openPdfModal(filePath, title, drivePreview, driveUrl) {
    if (!dom.pdfModal) return;
    dom.pdfTitle.textContent = title || 'IELTS Preparation Material';
    dom.pdfSubtitle.textContent = `Document: ${title || ''}`;
    
    // Specific direct book URL on Google Drive
    const targetDriveUrl = driveUrl || GOOGLE_DRIVE_FOLDER_URL;
    
    // If online on GitHub Pages/Web, load the direct Google Drive preview embed!
    const isOnline = window.location.protocol === 'http:' || window.location.protocol === 'https:';
    if (isOnline && drivePreview) {
      dom.pdfIframe.src = drivePreview;
    } else {
      dom.pdfIframe.src = filePath;
    }

    if (dom.btnExternalPdf) {
      dom.btnExternalPdf.href = isOnline && targetDriveUrl ? targetDriveUrl : filePath;
    }
    const btnGDrive = document.getElementById('btnOpenPdfGDrive');
    if (btnGDrive) {
      btnGDrive.href = targetDriveUrl;
      btnGDrive.title = `Direct Google Drive: ${title}`;
    }
    dom.pdfModal.style.display = 'flex';
  }

  function closePdfModal() {
    if (!dom.pdfModal) return;
    dom.pdfModal.style.display = 'none';
    dom.pdfIframe.src = '';
  }

  // ==================== FULLSCREEN CONTROLLER ====================
  function setupFullscreen() {
    if (!dom.btnFullscreen) return;
    dom.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // ==================== TOAST HELPER ====================
  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #f43f5e; margin-right: 0.55rem; font-size: 1rem;"></i><span>${escapeHtml(msg)}</span>`;
    dom.toast.style.display = 'inline-flex';
    dom.toast.style.alignItems = 'center';
    if (dom.toast._timer) clearTimeout(dom.toast._timer);
    dom.toast._timer = setTimeout(() => {
      dom.toast.style.display = 'none';
    }, 3400);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', init);


  // ==================== DYNAMIC HEADER HEIGHT SYNC ====================
  function syncHeaderHeight() {
    const header = document.getElementById('masterAppHeader');
    if (header) {
      const h = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    }
  }
  window.addEventListener('resize', syncHeaderHeight);
  window.addEventListener('orientationchange', syncHeaderHeight);

  // ==================== THEME TOGGLE (DARK / LIGHT) ====================
  function setupThemeToggle() {
    const savedTheme = localStorage.getItem('ielts_theme') || 'light';
    applyTheme(savedTheme);

    const btn = document.getElementById('masterThemeToggle');
    const drawerBtn = document.getElementById('drawerThemeToggle');

    [btn, drawerBtn].forEach(b => {
      if (b) {
        b.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          const next = current === 'dark' ? 'light' : 'dark';
          applyTheme(next);
        });
      }
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('ielts_theme', theme);

    const icon = document.querySelector('#masterThemeToggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    const drawerIcon = document.querySelector('#drawerThemeToggle i');
    if (drawerIcon) {
      drawerIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  // ==================== STUDY STREAK TRACKER ====================
  function setupStudyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('ielts_last_study_date');
    let streak = parseInt(localStorage.getItem('ielts_study_streak') || '1', 10);

    if (lastDate && lastDate !== today) {
      const last = new Date(lastDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    }

    localStorage.setItem('ielts_last_study_date', today);
    localStorage.setItem('ielts_study_streak', streak.toString());

    const badge = document.getElementById('streakCount');
    if (badge) badge.textContent = streak;
    const drawerBadge = document.getElementById('drawerStreakCount');
    if (drawerBadge) drawerBadge.textContent = streak;
  }

  // ==================== MOBILE NAVIGATION DRAWER ====================
  function setupMobileDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const btnOpen = document.getElementById('masterMobileMenuToggle');
    const btnClose = document.getElementById('btnCloseMobileDrawer');
    const searchBtn = document.getElementById('drawerSearchBtn');

    if (btnOpen && drawer) {
      btnOpen.addEventListener('click', () => {
        drawer.style.display = 'flex';
      });
    }

    const closeDrawer = () => {
      if (drawer) drawer.style.display = 'none';
    };

    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (e.target === drawer) closeDrawer();
      });
    }

    document.querySelectorAll('.drawer-link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pillar = btn.dataset.pillar;
        switchPillar(pillar);
        closeDrawer();
        document.querySelectorAll('.drawer-link-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        closeDrawer();
        openGlobalSearchModal();
      });
    }
  }

  // ==================== GLOBAL SEARCH SYSTEM (Ctrl+K) ====================
  let searchFilterCategory = 'all';

  function setupGlobalSearch() {
    const modal = document.getElementById('globalSearchModal');
    const trigger = document.getElementById('globalSearchTrigger');
    const closeBtn = document.getElementById('btnCloseSearchModal');
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('globalSearchClear');
    const filterPills = document.querySelectorAll('#searchFilterPills .search-filter-pill');

    if (trigger) {
      trigger.addEventListener('click', openGlobalSearchModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeGlobalSearchModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGlobalSearchModal();
      });
    }

    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
        renderSearchResults('');
      });
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal && modal.style.display === 'flex') {
          closeGlobalSearchModal();
        } else {
          openGlobalSearchModal();
        }
      } else if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeGlobalSearchModal();
      }
    });

    // Category pills
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        searchFilterCategory = pill.dataset.filter || 'all';
        if (input) renderSearchResults(input.value.trim());
      });
    });

    // Suggestion chips
    document.querySelectorAll('.search-suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        if (input) {
          input.value = query;
          input.focus();
          renderSearchResults(query);
        }
      });
    });

    // Live search input
    let debounceTimer;
    if (input) {
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          renderSearchResults(e.target.value.trim());
        }, 120);
      });
    }
  }

  function openGlobalSearchModal() {
    const modal = document.getElementById('globalSearchModal');
    const input = document.getElementById('globalSearchInput');
    if (modal) {
      modal.style.display = 'flex';
      if (input) {
        input.value = '';
        input.focus();
        renderSearchResults('');
      }
    }
  }

  function closeGlobalSearchModal() {
    const modal = document.getElementById('globalSearchModal');
    if (modal) modal.style.display = 'none';
  }

  function renderSearchResults(query) {
    const container = document.getElementById('globalSearchResults');
    const countEl = document.getElementById('searchResultsCount');
    if (!container) return;

    const isEn = document.documentElement.getAttribute('data-lang') === 'en';
    if (!query) {
      container.innerHTML = `
        <div class="search-placeholder-state">
          <i class="fa-solid fa-keyboard placeholder-icon"></i>
          <p class="placeholder-title">${isEn ? 'Search Cambridge tests, 2,949 vocabulary terms, guides, or books...' : 'ক্যামব্রিজ টেস্ট, ২,৯৪৯ শব্দার্থ, গাইড বা বই খুঁজুন...'}</p>
          <div class="search-suggestions">
            <span>${isEn ? 'Popular:' : 'জনপ্রিয়:'}</span>
            <button class="search-suggestion-chip" data-query="Cambridge 19">Cambridge 19</button>
            <button class="search-suggestion-chip" data-query="tennis">Tennis</button>
            <button class="search-suggestion-chip" data-query="copper">Copper</button>
            <button class="search-suggestion-chip" data-query="Makkar">Makkar</button>
            <button class="search-suggestion-chip" data-query="Band 8">Band 8</button>
          </div>
        </div>
      `;
      if (countEl) countEl.textContent = '';
      container.querySelectorAll('.search-suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const q = chip.dataset.query;
          const inp = document.getElementById('globalSearchInput');
          if (inp) {
            inp.value = q;
            inp.focus();
            renderSearchResults(q);
          }
        });
      });
      return;
    }

    const qLower = query.toLowerCase();
    const results = [];

    // 1. Search Cambridge Tests
    if (searchFilterCategory === 'all' || searchFilterCategory === 'cambridge') {
      if (window.CAMBRIDGE_TESTS_DATA && window.CAMBRIDGE_TESTS_DATA.tests) {
        Object.entries(window.CAMBRIDGE_TESTS_DATA.tests).forEach(([key, t]) => {
          const p1Title = (t.reading && t.reading.passages && t.reading.passages[0]) ? t.reading.passages[0].title : '';
          const p2Title = (t.reading && t.reading.passages && t.reading.passages[1]) ? t.reading.passages[1].title : '';
          const p3Title = (t.reading && t.reading.passages && t.reading.passages[2]) ? t.reading.passages[2].title : '';
          const fullText = `${t.testTitle || ''} Cambridge ${t.bookNumber || ''} Test ${t.testNumber || ''} ${p1Title} ${p2Title} ${p3Title}`.toLowerCase();

          if (fullText.includes(qLower)) {
            results.push({
              type: 'cambridge',
              badge: `Cambridge ${t.bookNumber} • Test ${t.testNumber}`,
              icon: 'fa-graduation-cap',
              title: t.testTitle || `Cambridge ${t.bookNumber} Test ${t.testNumber}`,
              desc: p1Title ? `Passage 1: ${p1Title}` : 'Full Authentic CD-IELTS Practice Test',
              action: () => {
                closeGlobalSearchModal();
                window.IELTSMaster.jumpToCambridgeTest(key);
              }
            });
          }
        });
      }
    }

    // 2. Search Vocabulary Words
    if (searchFilterCategory === 'all' || searchFilterCategory === 'vocab') {
      const vocabSource = window.VOCAB_DATA || window.IELTS_ALL_VOCAB || (state.allWords || []);
      if (Array.isArray(vocabSource)) {
        let vocabMatches = 0;
        for (const w of vocabSource) {
          if (vocabMatches >= 25) break;
          const wordText = `${w.word || ''} ${w.bangla || ''} ${w.meaning || ''} ${w.category || ''}`.toLowerCase();
          if (wordText.includes(qLower)) {
            vocabMatches++;
            results.push({
              type: 'vocab',
              badge: w.category || 'Vocab',
              icon: 'fa-brain',
              title: `${w.word} — ${w.bangla || ''}`,
              desc: w.meaning || w.example || 'Academic IELTS Word',
              action: () => {
                closeGlobalSearchModal();
                switchPillar('vocab');
                setTimeout(() => {
                  const inp = document.getElementById('searchInput') || document.querySelector('.search-box input');
                  if (inp) {
                    inp.value = w.word;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }, 100);
              }
            });
          }
        }
      }
    }

    // 3. Search Guides & Roadmaps
    if (searchFilterCategory === 'all' || searchFilterCategory === 'guide') {
      const guideItems = [
        { title: 'Test Overview & Format', desc: 'IELTS Academic vs General, 4 Modules Timing & Scoring Structure', tab: 'format' },
        { title: 'Band Descriptors & Official Rubrics', desc: 'Writing Task 1 & 2 (TR, CC, LR, GRA) and Speaking (FC, LR, GRA, PR)', tab: 'rubrics' },
        { title: 'Band 9 Module Strategies', desc: 'Reading True/False/Not Given, Heading Matching, Listening Signposts', tab: 'strategies' },
        { title: '30/60/90-Day Study Roadmaps', desc: 'Step-by-step revision timetable for Working Professionals & Students', tab: 'roadmaps' },
        { title: 'IELTS Online Tests (Free Mocks)', desc: 'Timed computer-delivered mock tests, instant scoring and analytics', tab: 'resources' },
        { title: '248 Band 9 IELTS Essays & 100+ Band 8', desc: 'Comprehensive model answers archive with examiner commentary', tab: 'resources' },
        { title: 'Writing9 Collection of Essay Topics', desc: 'Real recent IELTS exam writing task 2 topics and peer essays', tab: 'resources' },
        { title: '225 Academic Reading Tests & 100 General', desc: 'Huge collection of reading passages with questions and answers', tab: 'resources' },
        { title: '184 IELTS Listening Tests & Mini-IELTS', desc: 'Listening audio tests with answer keys and scripts', tab: 'resources' },
        { title: 'IELTS Liz Speaking Part 1, 2, 3 Topics', desc: 'Comprehensive speaking questions, cue cards and band 9 vocabulary', tab: 'resources' },
        { title: 'IELTS Simon Daily Lessons & Model Essays', desc: 'Ex-examiner advice, Band 9 Task 1 & 2 writing structures', tab: 'resources' },
        { title: 'Cambly & Verbling Speaking Practice', desc: '1-on-1 on-demand English practice with native speaking tutors', tab: 'resources' },
        { title: 'Quizlet & Forvo Vocabulary Tools', desc: 'Spaced repetition flashcards and native speaker pronunciation guide', tab: 'resources' }
      ];
      guideItems.forEach(item => {
        if (`${item.title} ${item.desc}`.toLowerCase().includes(qLower)) {
          results.push({
            type: 'guide',
            badge: 'Guide',
            icon: 'fa-compass',
            title: item.title,
            desc: item.desc,
            action: () => {
              closeGlobalSearchModal();
              switchPillar('guide');
              const tabBtn = document.querySelector(`.guide-tab-btn[data-guide="${item.tab}"]`);
              if (tabBtn) tabBtn.click();
            }
          });
        }
      });
    }

    // 4. Search Materials Library (41 PDFs)
    if (searchFilterCategory === 'all' || searchFilterCategory === 'library') {
      if (window.IELTS_MATERIALS_DATA) {
        window.IELTS_MATERIALS_DATA.forEach(book => {
          const bookText = `${book.title || ''} ${book.category || ''} ${book.author || ''} ${book.description || ''}`.toLowerCase();
          if (bookText.includes(qLower)) {
            results.push({
              type: 'library',
              badge: book.category || 'PDF Book',
              icon: 'fa-book-bookmark',
              title: book.title,
              desc: book.author ? `By ${book.author} • ${book.pages || ''} Pages` : (book.description || 'PDF Resource'),
              action: () => {
                closeGlobalSearchModal();
                switchPillar('library');
                const bookTitle = book.title || (book.filename ? book.filename.replace('.pdf', '') : 'PDF Document');
                openPdfModal(book.rel_path, bookTitle, book.gdrive_preview, book.gdrive_url);
              }
            });
          }
        });
      }
    }

    if (countEl) {
      countEl.textContent = isEn
        ? `${results.length} result${results.length === 1 ? '' : 's'} found`
        : `${results.length}টি ফলাফল পাওয়া গেছে`;
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-placeholder-state">
          <i class="fa-solid fa-face-meh placeholder-icon"></i>
          <p class="placeholder-title">${isEn ? `No matching results found for "${escapeHtml(query)}"` : `"${escapeHtml(query)}" এর সাথে কোনো ফলাফল মেলেনি`}</p>
          <p style="font-size: 0.8rem; margin-top: 0.25rem;">${isEn ? 'Check your spelling or try searching with alternative keywords.' : 'বানান পরীক্ষা করুন অথবা অন্য কোনো কীওয়ার্ড দিয়ে চেষ্টা করুন।'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map((r, i) => `
      <div class="search-result-item" data-index="${i}">
        <div class="search-result-icon">
          <i class="fa-solid ${r.icon}"></i>
        </div>
        <div class="search-result-info">
          <div class="search-result-title">
            ${escapeHtml(r.title)}
            <span class="search-result-badge">${escapeHtml(r.badge)}</span>
          </div>
          <div class="search-result-desc">${escapeHtml(r.desc)}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.search-result-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        if (results[idx] && results[idx].action) {
          results[idx].action();
        }
      });
    });
  }

  // ==================== SERVICE WORKER REGISTRATION ====================
  function setupServiceWorker() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('IELTS PrepMaster Service Worker Active:', reg.scope))
        .catch(err => console.log('Service worker registration note:', err));
    }
  }

  
  // ==================== BAND SCORE CALCULATOR ====================
  function setupBandScoreCalculator() {
    const segReading = document.getElementById('segReading');
    const segListening = document.getElementById('segListening');
    const rawScoreRange = document.getElementById('rawScoreRange');
    const scoreDisplayPill = document.getElementById('scoreDisplayPill');
    const calcBandNumber = document.getElementById('calcBandNumber');
    const calcBandLevel = document.getElementById('calcBandLevel');
    const calcBandDesc = document.getElementById('calcBandDesc');
    const conversionTableTitle = document.getElementById('conversionTableTitle');
    const conversionTableWrapper = document.getElementById('conversionTableWrapper');
    const inputScoreReading = document.getElementById('inputScoreReading');
    const inputScoreListening = document.getElementById('inputScoreListening');
    const inputScoreWriting = document.getElementById('inputScoreWriting');
    const inputScoreSpeaking = document.getElementById('inputScoreSpeaking');
    const overallBandOutput = document.getElementById('overallBandOutput');
    const btnClearHistory = document.getElementById('btnClearHistory');
    const historyList = document.getElementById('historyList');

    if (!rawScoreRange) return;

    let calcSkill = 'academicReading';
    let rawScore = 35;

    const bandScoreTables = {
      academicReading: [
        { raw: "39-40", band: 9.0, level: "Expert User", desc: "Fully operational command of language, fluent and accurate." },
        { raw: "37-38", band: 8.5, level: "Very Good User", desc: "Fully operational with only occasional unsystematic inaccuracies." },
        { raw: "35-36", band: 8.0, level: "Very Good User", desc: "Handles complex detailed argumentation well with operational command." },
        { raw: "33-34", band: 7.5, level: "Good User", desc: "Generally handles complex language well with detailed reasoning." },
        { raw: "30-32", band: 7.0, level: "Good User", desc: "Operational command with occasional inaccuracies and misunderstandings." },
        { raw: "27-29", band: 6.5, level: "Competent User", desc: "Generally effective command despite some inaccuracies in unfamiliar topics." },
        { raw: "23-26", band: 6.0, level: "Competent User", desc: "Can understand reasonably complex language and overall meaning." },
        { raw: "19-22", band: 5.5, level: "Modest User", desc: "Partial command, copes with overall meaning in most situations." },
        { raw: "15-18", band: 5.0, level: "Modest User", desc: "Partial command, makes frequent mistakes but grasps basic ideas." },
        { raw: "13-14", band: 4.5, level: "Limited User", desc: "Basic competence limited to familiar, straightforward situations." },
        { raw: "10-12", band: 4.0, level: "Limited User", desc: "Frequent problems in understanding and expression; no complex structures." },
        { raw: "8-9", band: 3.5, level: "Extremely Limited User", desc: "Conveys and understands only general meaning with breakdown in communication." },
        { raw: "6-7", band: 3.0, level: "Extremely Limited User", desc: "Understands only general meaning in very familiar situations." },
        { raw: "4-5", band: 2.5, level: "Intermittent User", desc: "Great difficulty understanding spoken and written English." },
        { raw: "0-3", band: 2.0, level: "Non User", desc: "Essentially no ability to use the language beyond isolated words." }
      ],
      generalReading: [
        { raw: "40-40", band: 9.0, level: "Expert User", desc: "Fully operational command of language, fluent and accurate." },
        { raw: "39-39", band: 8.5, level: "Very Good User", desc: "Fully operational with only occasional unsystematic inaccuracies." },
        { raw: "37-38", band: 8.0, level: "Very Good User", desc: "Handles complex detailed argumentation well with operational command." },
        { raw: "36-36", band: 7.5, level: "Good User", desc: "Generally handles complex language well with detailed reasoning." },
        { raw: "34-35", band: 7.0, level: "Good User", desc: "Operational command with occasional inaccuracies and misunderstandings." },
        { raw: "32-33", band: 6.5, level: "Competent User", desc: "Generally effective command despite some inaccuracies in unfamiliar topics." },
        { raw: "30-31", band: 6.0, level: "Competent User", desc: "Can understand reasonably complex language and overall meaning." },
        { raw: "27-29", band: 5.5, level: "Modest User", desc: "Partial command, copes with overall meaning in most situations." },
        { raw: "23-26", band: 5.0, level: "Modest User", desc: "Partial command, makes frequent mistakes but grasps basic ideas." },
        { raw: "19-22", band: 4.5, level: "Limited User", desc: "Basic competence limited to familiar, straightforward situations." },
        { raw: "15-18", band: 4.0, level: "Limited User", desc: "Frequent problems in understanding and expression." },
        { raw: "12-14", band: 3.5, level: "Extremely Limited User", desc: "Conveys and understands only general meaning with breakdown in communication." },
        { raw: "9-11", band: 3.0, level: "Extremely Limited User", desc: "Understands only general meaning in very familiar situations." },
        { raw: "6-8", band: 2.5, level: "Intermittent User", desc: "Great difficulty understanding written English." },
        { raw: "0-5", band: 2.0, level: "Non User", desc: "Essentially no ability to use language beyond isolated words." }
      ],
      listening: [
        { raw: "39-40", band: 9.0, level: "Expert User", desc: "Fully operational command of language, perfectly fluent understanding." },
        { raw: "37-38", band: 8.5, level: "Very Good User", desc: "Fully operational with only occasional unsystematic inaccuracies." },
        { raw: "35-36", band: 8.0, level: "Very Good User", desc: "Handles complex detailed information well with operational command." },
        { raw: "32-34", band: 7.5, level: "Good User", desc: "Generally handles complex language well with detailed reasoning." },
        { raw: "30-31", band: 7.0, level: "Good User", desc: "Operational command with occasional inaccuracies and minor slips." },
        { raw: "26-29", band: 6.5, level: "Competent User", desc: "Generally effective command despite some inaccuracies in unfamiliar accents." },
        { raw: "23-25", band: 6.0, level: "Competent User", desc: "Can understand reasonably complex language in everyday and academic context." },
        { raw: "18-22", band: 5.5, level: "Modest User", desc: "Partial command, copes with overall meaning in familiar settings." },
        { raw: "16-17", band: 5.0, level: "Modest User", desc: "Partial command, makes frequent mistakes but understands main ideas." },
        { raw: "13-15", band: 4.5, level: "Limited User", desc: "Basic competence limited to familiar, straightforward situations." },
        { raw: "10-12", band: 4.0, level: "Limited User", desc: "Frequent problems in understanding and expression." },
        { raw: "8-9", band: 3.5, level: "Extremely Limited User", desc: "Conveys and understands only general meaning with breakdown." },
        { raw: "6-7", band: 3.0, level: "Extremely Limited User", desc: "Understands only general meaning in very familiar situations." },
        { raw: "4-5", band: 2.5, level: "Intermittent User", desc: "Great difficulty understanding spoken English." },
        { raw: "0-3", band: 2.0, level: "Non User", desc: "Essentially no ability to understand language beyond isolated words." }
      ]
    };

    function getBand(skill, score) {
      const table = bandScoreTables[skill] || bandScoreTables.academicReading;
      for (const row of table) {
        const parts = row.raw.split('-').map(n => parseInt(n, 10));
        const min = parts[0];
        const max = parts.length > 1 ? parts[1] : parts[0];
        if (score >= min && score <= max) {
          return row;
        }
      }
      return { raw: "0", band: 0, level: "Did Not Attempt", desc: "No answers given" };
    }

    function updateCalculatedBand() {
      const info = getBand(calcSkill, rawScore);
      if (calcBandNumber) calcBandNumber.textContent = info.band.toFixed(1);
      if (calcBandLevel) calcBandLevel.textContent = info.level;
      if (calcBandDesc) calcBandDesc.textContent = info.desc;
    }

    function renderConversionTable() {
      if (!conversionTableWrapper) return;
      const table = bandScoreTables[calcSkill] || bandScoreTables.academicReading;
      let html = `
        <table class="conversion-table">
          <thead>
            <tr>
              <th>Raw Score (/40)</th>
              <th>IELTS Band</th>
              <th>Proficiency Level</th>
            </tr>
          </thead>
          <tbody>
      `;
      table.forEach(r => {
        html += `
          <tr>
            <td>${r.raw}</td>
            <td class="band-cell">Band ${r.band.toFixed(1)}</td>
            <td>${r.level}</td>
          </tr>
        `;
      });
      html += '</tbody></table>';
      conversionTableWrapper.innerHTML = html;
    }

    function updateOverallBand() {
      if (!inputScoreReading || !overallBandOutput) return;
      const r = parseFloat(inputScoreReading.value) || 0;
      const l = parseFloat(inputScoreListening ? inputScoreListening.value : 0) || 0;
      const w = parseFloat(inputScoreWriting ? inputScoreWriting.value : 0) || 0;
      const s = parseFloat(inputScoreSpeaking ? inputScoreSpeaking.value : 0) || 0;

      const avg = (r + l + w + s) / 4;
      const remainder = avg % 1;
      let rounded = Math.floor(avg);

      if (remainder >= 0.75) {
        rounded += 1.0;
      } else if (remainder >= 0.25) {
        rounded += 0.5;
      }

      overallBandOutput.textContent = rounded.toFixed(1);
      const ruleNote = document.getElementById('overallRoundRule');
      if (ruleNote) {
        ruleNote.textContent = `(Average ${avg.toFixed(2)} → Official Band ${rounded.toFixed(1)})`;
      }
      updateTargetGap(rounded, r, l, w, s);
    }

    function updateTargetGap(currentOverall, r, l, w, s) {
      const targetSelect = document.getElementById('targetBandGoalSelect');
      const gapFeedback = document.getElementById('targetGapFeedback');
      if (!targetSelect || !gapFeedback) return;

      const target = parseFloat(targetSelect.value) || 7.5;
      const diff = target - currentOverall;
      const isEnglish = (document.documentElement.getAttribute('data-lang') === 'en');

      if (diff <= 0) {
        gapFeedback.innerHTML = `
          <div style="color: var(--success); font-weight: 700;">
            <i class="fa-solid fa-circle-check"></i> ${isEnglish ? 'Target Achieved!' : 'অভিনন্দন! আপনি আপনার টার্গেট ব্যান্ড স্পর্শ করেছেন।'}
          </div>
          <div style="margin-top: 0.35rem; color: var(--text-muted);">
            ${isEnglish ? `Your current average (${currentOverall.toFixed(1)}) meets or exceeds your goal (${target.toFixed(1)}). Maintain consistency with full timed practice tests!` : `আপনার বর্তমান ব্যান্ড (${currentOverall.toFixed(1)}) কাঙ্ক্ষিত লক্ষ্য (${target.toFixed(1)}) পূর্ণ করেছে। ধারাবাহিকতা বজায় রাখতে নিয়মিত টেস্ট দিন।`}
          </div>
        `;
      } else {
        const lowestSkill = [
          { name: isEnglish ? 'Writing' : 'রাইটিং', val: w },
          { name: isEnglish ? 'Speaking' : 'স্পিকিং', val: s },
          { name: isEnglish ? 'Reading' : 'রিডিং', val: r },
          { name: isEnglish ? 'Listening' : 'লিসেনিং', val: l }
        ].sort((a, b) => a.val - b.val)[0];

        gapFeedback.innerHTML = `
          <div style="color: var(--accent); font-weight: 700;">
            <i class="fa-solid fa-arrow-trend-up"></i> ${isEnglish ? `Score Gap: +${diff.toFixed(1)} Band Needed` : `টার্গেট গ্যাপ: আরও +${diff.toFixed(1)} ব্যান্ড বৃদ্ধি প্রয়োজন`}
          </div>
          <div style="margin-top: 0.35rem; color: var(--text-primary);">
            ${isEnglish ? `Your current overall is <strong>${currentOverall.toFixed(1)}</strong>. Target is <strong>${target.toFixed(1)}</strong>. Fastest point gain: Elevate <strong>${lowestSkill.name}</strong> (currently ${lowestSkill.val.toFixed(1)}) by at least +0.5 to trigger official round-up!` : `আপনার বর্তমান ব্যান্ড <strong>${currentOverall.toFixed(1)}</strong> এবং টার্গেট <strong>${target.toFixed(1)}</strong>। সবচেয়ে দ্রুত স্কোরের জন্য আপনার সর্বনিম্ন মডিউল <strong>${lowestSkill.name}</strong> (${lowestSkill.val.toFixed(1)}) এ অন্তত +০.৫ ব্যান্ড বাড়ান।`}
          </div>
        `;
      }
    }

    const segGeneralReading = document.getElementById('segGeneralReading');

    function setSkill(skill, titleHtml) {
      calcSkill = skill;
      [segReading, segGeneralReading, segListening].forEach(btn => {
        if (btn) btn.classList.toggle('active', btn.dataset.calc === skill);
      });
      if (conversionTableTitle) conversionTableTitle.innerHTML = titleHtml;
      updateCalculatedBand();
      renderConversionTable();
    }

    if (segReading) {
      segReading.addEventListener('click', () => {
        setSkill('academicReading', '<i class="fa-solid fa-table-list text-accent"></i> Academic Reading Score Table');
      });
    }

    if (segGeneralReading) {
      segGeneralReading.addEventListener('click', () => {
        setSkill('generalReading', '<i class="fa-solid fa-table-list text-accent"></i> General Training Reading Score Table');
      });
    }

    if (segListening) {
      segListening.addEventListener('click', () => {
        setSkill('listening', '<i class="fa-solid fa-table-list text-accent"></i> Listening Score Table');
      });
    }

    const targetSelect = document.getElementById('targetBandGoalSelect');
    if (targetSelect) {
      targetSelect.addEventListener('change', updateOverallBand);
    }

    if (rawScoreRange) {
      rawScoreRange.addEventListener('input', (e) => {
        rawScore = parseInt(e.target.value, 10);
        if (scoreDisplayPill) scoreDisplayPill.textContent = `${rawScore} / 40`;
        updateCalculatedBand();
      });
    }

    [inputScoreReading, inputScoreListening, inputScoreWriting, inputScoreSpeaking].forEach(inp => {
      if (inp) inp.addEventListener('input', updateOverallBand);
    });

    if (btnClearHistory) {
      btnClearHistory.addEventListener('click', () => {
        if (historyList) {
          historyList.innerHTML = '<p class="empty-history-text">History cleared.</p>';
        }
      });
    }

    // Initial render
    updateCalculatedBand();
    renderConversionTable();
    updateOverallBand();
  }

  // ==================== WORD OF THE DAY (HOME HUB WIDGET) ====================
  const highYieldWords = [
    { word: "Profound", pos: "Adjective", bangla: "গভীর, সুদূরপ্রসারী, অত্যন্ত অর্থপূর্ণ", meaning: "Very great or intense; having or showing great knowledge or insight.", example: "The discovery of DNA had a profound impact on biology." },
    { word: "Ubiquitous", pos: "Adjective", bangla: "সর্বব্যাপী, যা সব জায়গায় পাওয়া যায়", meaning: "Present, appearing, or found everywhere.", example: "Smartphones have become ubiquitous in daily life." },
    { word: "Mitigate", pos: "Verb", bangla: "উপশম করা, তীব্রতা কমানো", meaning: "Make something bad less severe, serious, or painful.", example: "Urgent green policies are vital to mitigate climate change." },
    { word: "Exemplary", pos: "Adjective", bangla: "অনুকরণীয়, দৃষ্টান্তমূলক", meaning: "Serving as a desirable model; representing the best of its kind.", example: "Her exemplary dedication earned highest praise." },
    { word: "Pervasive", pos: "Adjective", bangla: "বিস্তৃত, অনুপ্রবেশকারী", meaning: "Spreading widely throughout an area or a group of people.", example: "Social media has a pervasive influence on society." },
    { word: "Corroborate", pos: "Verb", bangla: "সত্যায়িত করা, সমর্থন করা", meaning: "Confirm or give support to a statement, theory, or finding.", example: "Recent empirical studies corroborate this hypothesis." },
    { word: "Detrimental", pos: "Adjective", bangla: "ক্ষতিকর, অনিষ্টকর", meaning: "Tending to cause harm or damage.", example: "Excessive stress has a detrimental effect on mental health." },
    { word: "Feasible", pos: "Adjective", bangla: "সম্ভবপর, বাস্তবসম্মত", meaning: "Possible to do easily or conveniently.", example: "Renewable energy provides a highly feasible solution." },
    { word: "Disparity", pos: "Noun", bangla: "বৈষম্য, পার্থক্য", meaning: "A great difference or inequality.", example: "Economic disparity between urban and rural areas persists." },
    { word: "Pragmatic", pos: "Adjective", bangla: "বাস্তবধর্মী, বাস্তববাদী", meaning: "Dealing with things sensibly and realistically based on practical considerations.", example: "We need a pragmatic approach to solve traffic congestion." }
  ];

  let currentWotdIndex = 0;

  function setupWordOfTheDay() {
    const elWord = document.getElementById('wotdWord');
    const elPos = document.getElementById('wotdPos');
    const elBangla = document.getElementById('wotdBangla');
    const elMeaning = document.getElementById('wotdMeaning');
    const elExample = document.getElementById('wotdExample');
    const btnNext = document.getElementById('btnNextWordOfTheDay');
    const btnAudio = document.getElementById('wotdAudioBtn');

    if (!elWord) return;

    function renderWord(index) {
      const item = highYieldWords[index % highYieldWords.length];
      elWord.textContent = item.word;
      elPos.textContent = item.pos;
      elBangla.textContent = item.bangla;
      elMeaning.textContent = item.meaning;
      elExample.textContent = `"${item.example}"`;
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        currentWotdIndex = (currentWotdIndex + 1) % highYieldWords.length;
        renderWord(currentWotdIndex);
      });
    }

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const item = highYieldWords[currentWotdIndex % highYieldWords.length];
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(item.word);
          utter.lang = 'en-GB';
          utter.rate = 0.9;
          window.speechSynthesis.speak(utter);
        } else {
          showToast('Audio: ' + item.word);
        }
      });
    }

    renderWord(currentWotdIndex);
  }

  return {
    switchPillar,
    toggleHeroBanner,
    startTestFromHero,
    openPdf: openPdfModal,
    showToast,
    jumpToVocabTab(tabName) {
      switchPillar('vocab');
      const tabBtn = document.querySelector(`.nav-tab-btn[data-tab="${tabName}"]`);
      if (tabBtn) tabBtn.click();
    },
    jumpToGuideTab(guideName) {
      switchPillar('guide');
      const tabBtn = document.querySelector(`.guide-tab-btn[data-guide="${guideName}"]`);
      if (tabBtn) tabBtn.click();
    },
    filterLibraryCat(catName) {
      switchPillar('library');
      const chip = document.querySelector(`.lib-filter-chip[data-cat="${catName}"]`);
      if (chip) chip.click();
    },
    jumpToCambridgeTest(testId) {
      const isEn = document.documentElement.getAttribute('data-lang') === 'en';
      showToast(isEn ? 'Opening Cambridge Test Simulator archive.' : 'ক্যামব্রিজ টেস্ট সিমুলেটর আলাদা আর্কাইভে সংরক্ষিত আছে।');
      window.open('cambridge_app/index.html', '_blank');
    },
    jumpToVocabCategory(catName) {
      switchPillar('vocab');
      const chip = document.querySelector(`.chip-btn[data-cat="${catName}"]`);
      if (chip) chip.click();
    }
  };
})();

/**
 * ===================================================================
 * CAMBRIDGE EXAM SIMULATOR - ARCHIVED STANDALONE BRIDGE
 * Complete 40-test simulation preserved in cambridge_app/ and archive/
 * ===================================================================
 */
window.IELTSApp = {
  isArchived: true,
  openArchiveApp: function () {
    window.open('cambridge_app/index.html', '_blank');
  }
};

/**
 * ============================================================
 * IELTS VOCABMASTER PRO - APPLICATION LOGIC
 * ============================================================
 */

(function () {
  'use strict';

  // -----------------------------------------------------------
  // STATE MANAGEMENT
  // -----------------------------------------------------------
  const state = {
    allWords: [],
    filteredWords: [],
    currentPage: 1,
    pageSize: 24,
    searchQuery: '',
    selectedCategory: 'all',
    onlyStarred: false,
    onlyMastered: false,
    onlyBangla: false,
    sortBy: 'default',
    
    // User persistence
    starredIds: new Set(JSON.parse(localStorage.getItem('ielts_starred') || '[]')),
    masteredIds: new Set(JSON.parse(localStorage.getItem('ielts_mastered') || '[]')),
    
    // Flashcard Deck State
    fcDeck: [],
    fcIndex: 0,
    fcFlipped: false,
    
    // Quiz State
    quizQuestions: [],
    quizIndex: 0,
    quizScore: 0,
    quizStreak: 0,
    quizBestStreak: 0,
    quizAnswered: false,
    quizMode: 'mixed',
    quizDeck: 'all',
    quizLength: 10,
    quizTimerEnabled: true,
    quizTimerSeconds: 15,
    quizTimerRemaining: 15,
    quizTimerInterval: null,
    quizMistakes: [],
    
    // Spelling Drill State
    spellingWord: null,
    spellingStreak: 0,
    spellingHintsUsed: 0
  };

  // -----------------------------------------------------------
  // AUDIO SYNTHESIZER (WEB AUDIO API & SPEECH SYNTHESIS)
  // -----------------------------------------------------------
  const audio = {
    ctx: null,
    
    initAudioContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },

    playChime(success = true) {
      try {
        this.initAudioContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (success) {
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(160, now + 0.12);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      } catch (e) {
        // AudioContext not allowed or unsupported, graceful ignore
      }
    },

    pronounce(text) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-GB';

      const voices = window.speechSynthesis.getVoices();
      const ukVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB')) ||
                      voices.find(v => v.lang.includes('en'));
      if (ukVoice) utterance.voice = ukVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // -----------------------------------------------------------
  // INITIALIZATION
  // -----------------------------------------------------------
  async function init() {
    setupEventListeners();

    if (window.VOCAB_DATA && Array.isArray(window.VOCAB_DATA) && window.VOCAB_DATA.length > 0) {
      state.allWords = window.VOCAB_DATA;
      onDataLoaded();
    } else {
      try {
        const res = await fetch('all_vocab.json');
        state.allWords = await res.json();
        onDataLoaded();
      } catch (err) {
        console.error('Error loading vocabulary dataset:', err);
      }
    }
  }

  function onDataLoaded() {
    updateHeaderStats();
    updateCategoryCounts();
    applyFilters();
    initFlashcards();
    initQuiz();
    nextSpellingWord();
  }

  // -----------------------------------------------------------
  // HEADER & STATS
  // -----------------------------------------------------------
  function updateHeaderStats() {
    document.getElementById('headerMasteredCount').textContent = state.masteredIds.size;
    document.getElementById('headerStarredCount').textContent = state.starredIds.size;
    document.getElementById('totalWordsStat').textContent = state.allWords.length.toLocaleString();
    const statBn = document.getElementById('statBanglaAvailable');
    if (statBn) {
      const bnCount = state.allWords.filter(w => w.meaning_bn && w.meaning_bn.trim().length > 0).length;
      statBn.textContent = bnCount.toLocaleString();
    }
  }

  function savePersistence() {
    localStorage.setItem('ielts_starred', JSON.stringify(Array.from(state.starredIds)));
    localStorage.setItem('ielts_mastered', JSON.stringify(Array.from(state.masteredIds)));
    updateHeaderStats();
  }

  const categoryGuides = {
    'all': {
      titleBn: 'সব শব্দ (২,৯৪৯টি)',
      titleEn: 'All Words (2,949)',
      icon: 'fa-layer-group',
      focusBn: 'IELTS জেনারেল ও একাডেমিক পূর্ণাঙ্গ প্রস্তুতি',
      focusEn: 'IELTS General & Academic Master Preparation',
      descBn: 'IELTS পরীক্ষায় Band 7.5+ পাওয়ার জন্য Lexical Resource অত্যন্ত গুরুত্বপূর্ণ। এখানে ক্যামব্রিজ অফিসিয়াল রিডিং টেস্ট, আইইএলটিএস অ্যাডভান্টেজ প্যারাফ্রেজিং, রাইটিং টাস্ক ১ চার্ট ডেসক্রিপশন এবং স্পিকিং ইডিয়মসের সম্পূর্ণ ভাণ্ডার রয়েছে।',
      descEn: 'Comprehensive IELTS vocabulary repository covering authentic Cambridge academic readings, high-impact paraphrasing synonyms, writing task 1 descriptors, and natural idiomatic expressions for Band 7.5+ Lexical Resource.'
    },
    'Reading Vocab': {
      titleBn: 'রিডিং ভোকাবুলারি (১,৭৯৪টি)',
      titleEn: 'Reading Vocab (1,794)',
      icon: 'fa-book-open',
      focusBn: 'Cambridge 18, 19 ও Academic Reading প্যাসেজ',
      focusEn: 'Cambridge 18, 19 & Academic Reading Passages',
      descBn: 'ক্যামব্রিজ ১৮, ১৯ এবং বিগত বছরের আসল একাডেমিক প্যাসেজ থেকে সংগৃহীত। রিডিং টেস্টে দ্রুত স্কিমিং-স্ক্যানিং এবং ট্রিকি প্যারাফ্রেজ ধরতে এই শব্দগুলো পড়া আবশ্যক, যাতে প্যাসেজের জটিল বৈজ্ঞানিক ও সামাজিক কনটেক্সট সহজে বোধগম্য হয়।',
      descEn: 'Extracted directly from authentic Cambridge 18, 19, and academic reading passages. Crucial for recognizing tricky synonyms, scientific registers, and context clues across Passages 1, 2, and 3 under timed exam pressure.'
    },
    'IELTS Advantage 50': {
      titleBn: 'আইইএলটিএস অ্যাডভান্টেজ ৫০ (৫০টি)',
      titleEn: 'IELTS Advantage 50 (50)',
      icon: 'fa-graduation-cap',
      focusBn: 'Chris Pell (IELTS Advantage) হাই-ইমপ্যাক্ট সিনোনিমস',
      focusEn: 'Chris Pell (IELTS Advantage) High-Impact Synonyms',
      descBn: 'জনপ্রিয় IELTS Advantage ইউটিউব চ্যানেলের (ক্রিস পেল) ফর্মুলা অনুযায়ী প্রস্তুতকৃত ৫০টি অতি-উচ্চ ফ্রিকোয়েন্সির শব্দ ও প্যারাফ্রেজ জোড়া। পরীক্ষায় একই সাধারণ শব্দ বারবার ব্যবহার না করে এই সিনোনিমগুলো ব্যবহার করলে Writing Task 2 ও Speaking-এ তাৎক্ষণিকভাবে ব্যান্ড স্কোর বৃদ্ধি পায়।',
      descEn: 'Sourced from Chris Pell\'s renowned IELTS Advantage methodology. 50 high-yield, natural paraphrasing pairs to replace repetitive basic words and secure high Band 7.5 - 9 Lexical Resource in Writing Task 2 & Speaking Part 3.'
    },
    'Task 1 Vocabulary': {
      titleBn: 'টাস্ক ১ ভোকাবুলারি (২৯টি)',
      titleEn: 'Task 1 Vocabulary (29)',
      icon: 'fa-chart-line',
      focusBn: 'Academic Writing Task 1 ট্রেন্ডস ও ডেটা ডেসক্রিপশন',
      focusEn: 'Academic Writing Task 1 Trends & Data Description',
      descBn: 'Academic Writing Task 1-এর লাইন গ্রাফ, বার চার্ট, পাই চার্ট ও টেবিল বর্ণনার জন্য অপরিহার্য। ট্রেন্ড পরিবর্তন (soar, plummet, plateau, fluctuate) এবং অনুপাত ও শতকরা হারের নিখুঁত বর্ণনা দিতে এই শব্দগুলো ছাড়া Band 7+ পাওয়া অসম্ভব।',
      descEn: 'Essential trend verbs (plummet, fluctuate, soar, plateau), degree modifiers, and proportional expressions strictly needed for Academic Writing Task 1 visual reports and data summaries.'
    },
    'Idioms & Phrases': {
      titleBn: '৮০০ আমেরিকান ইডিয়মস (৭৩৭টি)',
      titleEn: '800 Idioms & Phrases (737)',
      icon: 'fa-quote-left',
      focusBn: 'Speaking Part 1, 2 & 3 ন্যাচারাল ফ্লুয়েন্সি',
      focusEn: 'Speaking Parts 1, 2 & 3 Natural Fluency',
      descBn: 'IELTS Speaking ব্যান্ড ডেসক্রিপ্টরে Band 7+ পাওয়ার জন্য "uses some less common and idiomatic vocabulary naturally" একটি স্পষ্ট ক্রাইটেরিয়া। স্পিকিং টেস্টে সাবলীল ও নেটিভদের মতো শোনাতে এই ইডিয়মসগুলো ব্যবহৃত হয়।',
      descEn: 'Directly targets the official IELTS Speaking Band 7+ descriptor ("uses less common and idiomatic vocabulary naturally"). Essential for sounding spontaneous and natural in Parts 1, 2 & 3.'
    },
    'Map & Directions': {
      titleBn: 'ম্যাপ ও ডিরেকশন (১৬২টি)',
      titleEn: 'Map & Directions (162)',
      icon: 'fa-compass',
      focusBn: 'Listening Section 2 ম্যাপ ও প্ল্যান লেবেলিং',
      focusEn: 'Listening Section 2 Map & Plan Labelling',
      descBn: 'Listening Section 2-তে প্রায়ই ম্যাপ ও প্ল্যান লেবেলিং প্রশ্ন আসে। স্থান, দিক ও অবস্থান নির্দেশক শব্দ (adjacent, roundabout, pedestrian crossing, north-west) না জানলে সহজে মার্ক হারানো যায়।',
      descEn: 'Directly tested in IELTS Listening Section 2 (map and plan labelling). Mastering spatial orientation terms (opposite, adjacent, clockwise, cul-de-sac) prevents losing easy marks.'
    },
    'Topic Vocabulary': {
      titleBn: 'টপিক ভোকাবুলারি (১৬৮টি)',
      titleEn: 'Vocab by Topics (168)',
      icon: 'fa-comments',
      focusBn: 'Writing Task 2 ও Speaking থিমেটিক টপিকস',
      focusEn: 'Writing Task 2 & Speaking Thematic Topics',
      descBn: 'Writing Task 2 এবং Speaking Part 3-এর সর্বাধিক কমন টপিকসমূহ (Environment, Technology, Health, Education)। গভীর ও তথ্যবহুল যুক্তি তুলে ধরতে এই টপিক-ভিত্তিক শব্দগুলো সাহায্য করে।',
      descEn: 'High-frequency thematic clusters (Environment, AI & Tech, Healthcare, Education) required to construct nuanced, coherent arguments in essays and formal speaking.'
    }
  };

  function updateCategoryGuide(cat) {
    const guide = categoryGuides[cat] || categoryGuides['all'];
    const badgeEl = document.getElementById('catGuideBadge');
    const focusEl = document.getElementById('catGuideFocus');
    const descEl = document.getElementById('catGuideDesc');

    if (badgeEl) {
      badgeEl.innerHTML = `<i class="fa-solid ${guide.icon}"></i> <span class="lang-bn-only">${guide.titleBn}</span><span class="lang-en-only">${guide.titleEn}</span>`;
    }
    if (focusEl) {
      focusEl.innerHTML = `<span class="lang-bn-only">${guide.focusBn}</span><span class="lang-en-only">${guide.focusEn}</span>`;
    }
    if (descEl) {
      descEl.innerHTML = `<span class="lang-bn-only">${guide.descBn}</span><span class="lang-en-only">${guide.descEn}</span>`;
    }
  }

  function updateCategoryCounts() {
    document.getElementById('countAll').textContent = state.allWords.length.toLocaleString();
    
    // Dynamically calculate and set badge counts for all category chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      const cat = chip.dataset.cat;
      if (cat && cat !== 'all') {
        let count = 0;
        if (cat === 'Reading Vocab') {
          count = state.allWords.filter(w => 
            w.category === 'Reading Vocab' || 
            w.category === 'Cambridge Tests' || 
            w.category === 'Reading Topic Vocabulary' ||
            (w.source && (w.source.includes('Cambridge') || w.source.includes('Reading')))
          ).length;
        } else if (cat === 'Task 1 Vocabulary') {
          count = state.allWords.filter(w => 
            w.category === 'Task 1 Vocabulary' || 
            w.category === 'Writing Task 1 Essentials' ||
            (w.source && w.source.includes('Task 1'))
          ).length;
        } else if (cat === 'IELTS Advantage 50') {
          count = state.allWords.filter(w => 
            w.category === 'IELTS Advantage 50' || 
            (w.source && w.source.includes('IELTS Advantage'))
          ).length;
        } else {
          count = state.allWords.filter(w => w.category === cat || (w.source && w.source.includes(cat))).length;
        }
        const countSpan = chip.querySelector('.chip-count');
        if (countSpan) countSpan.textContent = count.toLocaleString();
      }
    });

    updateCategoryGuide(state.selectedCategory || 'all');
  }

  // -----------------------------------------------------------
  // EVENT LISTENERS & NAVIGATION
  // -----------------------------------------------------------
  function setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        const targetView = document.getElementById('view-' + btn.dataset.tab);
        if (targetView) targetView.classList.add('active');
      });
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
      state.currentPage = 1;
      applyFilters();
    });

    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClearBtn.style.display = 'none';
      state.currentPage = 1;
      applyFilters();
      searchInput.focus();
    });

    // Category Chips
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.selectedCategory = chip.dataset.cat;
        state.currentPage = 1;
        updateCategoryGuide(state.selectedCategory);
        applyFilters();
      });
    });

    // Sub Filters
    const filterStarredBtn = document.getElementById('filterStarredBtn');
    filterStarredBtn.addEventListener('click', () => {
      state.onlyStarred = !state.onlyStarred;
      filterStarredBtn.classList.toggle('active', state.onlyStarred);
      state.currentPage = 1;
      applyFilters();
    });

    const filterMasteredBtn = document.getElementById('filterMasteredBtn');
    filterMasteredBtn.addEventListener('click', () => {
      state.onlyMastered = !state.onlyMastered;
      filterMasteredBtn.classList.toggle('active', state.onlyMastered);
      state.currentPage = 1;
      applyFilters();
    });

    const filterBanglaOnlyBtn = document.getElementById('filterBanglaOnlyBtn');
    filterBanglaOnlyBtn.addEventListener('click', () => {
      state.onlyBangla = !state.onlyBangla;
      filterBanglaOnlyBtn.classList.toggle('active', state.onlyBangla);
      state.currentPage = 1;
      applyFilters();
    });

    // Sort Dropdown
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });

    // Export Button
    document.getElementById('exportDataBtn').addEventListener('click', exportBookmarks);

    // Flashcard Scene Flip
    const cardScene = document.getElementById('cardScene');
    const flashcardInner = document.getElementById('flashcardInner');
    const fcFlipBtn = document.getElementById('fcFlipBtn');

    const toggleFlip = () => {
      state.fcFlipped = !state.fcFlipped;
      flashcardInner.classList.toggle('is-flipped', state.fcFlipped);
    };

    cardScene.addEventListener('click', (e) => {
      if (!e.target.closest('.pronounce-btn')) {
        toggleFlip();
      }
    });
    fcFlipBtn.addEventListener('click', toggleFlip);

    // Flashcard Navigation
    document.getElementById('fcPrevBtn').addEventListener('click', () => changeFlashcard(-1));
    document.getElementById('fcNextBtn').addEventListener('click', () => changeFlashcard(1));
    document.getElementById('fcShuffleBtn').addEventListener('click', shuffleFlashcards);

    // Flashcard Deck Select
    document.getElementById('fcDeckSelect').addEventListener('change', (e) => {
      loadFlashcardDeck(e.target.value);
    });

    // Flashcard Audio
    document.getElementById('fcFrontAudioBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const current = state.fcDeck[state.fcIndex];
      if (current) audio.pronounce(current.word);
    });
    document.getElementById('fcBackAudioBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const current = state.fcDeck[state.fcIndex];
      if (current) audio.pronounce(current.word);
    });

    // Flashcard Star / Master
    document.getElementById('fcToggleStarBtn').addEventListener('click', () => {
      const current = state.fcDeck[state.fcIndex];
      if (!current) return;
      toggleStar(current.id);
      updateFlashcardStatusButtons();
    });
    document.getElementById('fcToggleMasterBtn').addEventListener('click', () => {
      const current = state.fcDeck[state.fcIndex];
      if (!current) return;
      toggleMastered(current.id);
      updateFlashcardStatusButtons();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      const activeTab = document.querySelector('.nav-tab-btn.active')?.dataset.tab;

      if (activeTab === 'flashcards') {
        if (e.code === 'Space') {
          e.preventDefault();
          toggleFlip();
        } else if (e.code === 'ArrowRight') {
          changeFlashcard(1);
        } else if (e.code === 'ArrowLeft') {
          changeFlashcard(-1);
        }
      } else if (activeTab === 'quiz') {
        // Quiz keybindings: 1-4 or A-D
        const optKeys = {
          'Digit1': 0, 'Numpad1': 0, 'KeyA': 0,
          'Digit2': 1, 'Numpad2': 1, 'KeyB': 1,
          'Digit3': 2, 'Numpad3': 2, 'KeyC': 2,
          'Digit4': 3, 'Numpad4': 3, 'KeyD': 3
        };
        if (e.code in optKeys && !state.quizAnswered) {
          e.preventDefault();
          const btns = document.querySelectorAll('#quizOptionsList .quiz-opt-btn');
          const idx = optKeys[e.code];
          if (btns[idx]) btns[idx].click();
        } else if ((e.code === 'Space' || e.code === 'Enter') && state.quizAnswered) {
          e.preventDefault();
          const nextBtn = document.getElementById('quizNextBtn');
          if (nextBtn && nextBtn.classList.contains('show')) nextBtn.click();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          document.getElementById('quizAudioBtn')?.click();
        }
      }
    });

    // Quiz Arena Smart Controls
    document.getElementById('quizModeSelect')?.addEventListener('change', (e) => {
      state.quizMode = e.target.value;
      initQuiz();
    });

    document.getElementById('quizDeckSelect')?.addEventListener('change', (e) => {
      state.quizDeck = e.target.value;
      initQuiz();
    });

    document.getElementById('quizLengthSelect')?.addEventListener('change', (e) => {
      state.quizLength = parseInt(e.target.value, 10) || 10;
      initQuiz();
    });

    document.getElementById('quizTimerToggleBtn')?.addEventListener('click', () => {
      state.quizTimerEnabled = !state.quizTimerEnabled;
      const btn = document.getElementById('quizTimerToggleBtn');
      const text = document.getElementById('timerToggleText');
      const badge = document.getElementById('quizTimerBadge');
      if (btn) btn.classList.toggle('active', state.quizTimerEnabled);
      if (text) text.textContent = state.quizTimerEnabled ? 'Timer: 15s' : 'Timer: Off';
      if (badge) badge.style.display = state.quizTimerEnabled ? 'inline-flex' : 'none';
      if (!state.quizTimerEnabled) {
        stopQuizTimer();
      } else if (!state.quizAnswered) {
        startQuizTimer();
      }
    });

    document.getElementById('quizRestartBtn')?.addEventListener('click', () => {
      initQuiz();
    });

    document.getElementById('quizNextBtn')?.addEventListener('click', nextQuizQuestion);

    document.getElementById('quizAudioBtn')?.addEventListener('click', () => {
      const q = state.quizQuestions[state.quizIndex];
      if (q && q.targetWord) audio.pronounce(q.targetWord);
      else if (q && q.item) audio.pronounce(q.item.word);
    });

    // Results Actions
    document.getElementById('resultsPlayAgainBtn')?.addEventListener('click', () => {
      initQuiz();
    });

    document.getElementById('resultsRetryMissedBtn')?.addEventListener('click', () => {
      if (state.quizMistakes && state.quizMistakes.length > 0) {
        retryMissedQuiz();
      }
    });

    document.getElementById('resultsExploreVocabBtn')?.addEventListener('click', () => {
      document.querySelector('.nav-tab-btn[data-tab="browse"]')?.click();
    });

    // Spelling Drill Controls
    const spellingInput = document.getElementById('spellingInput');
    const spellingSubmitBtn = document.getElementById('spellingSubmitBtn');
    const spellingAudioBtn = document.getElementById('spellingAudioBtn');
    const spellingHintBtn = document.getElementById('spellingHintBtn');
    const spellingSkipBtn = document.getElementById('spellingSkipBtn');
    const spellingDeckSelect = document.getElementById('spellingDeckSelect');

    if (spellingDeckSelect) {
      spellingDeckSelect.addEventListener('change', () => {
        state.spellingStreak = 0;
        updateSpellingScore();
        nextSpellingWord();
      });
    }

    spellingAudioBtn.addEventListener('click', () => {
      if (state.spellingWord) audio.pronounce(state.spellingWord.word);
    });
    spellingSubmitBtn.addEventListener('click', checkSpelling);
    spellingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkSpelling();
    });
    spellingHintBtn.addEventListener('click', showSpellingHint);
    spellingSkipBtn.addEventListener('click', () => {
      state.spellingStreak = 0;
      updateSpellingScore();
      nextSpellingWord();
    });
  }

  // -----------------------------------------------------------
  // FILTER & RENDER WORD CARDS
  // -----------------------------------------------------------
  function applyFilters() {
    let result = state.allWords;

    // Category filter
    if (state.selectedCategory !== 'all') {
      const cat = state.selectedCategory;
      if (cat === 'Reading Vocab') {
        result = result.filter(item => 
          item.category === 'Reading Vocab' || 
          item.category === 'Cambridge Tests' || 
          item.category === 'Reading Topic Vocabulary' ||
          (item.source && (item.source.includes('Cambridge') || item.source.includes('Reading')))
        );
      } else if (cat === 'Task 1 Vocabulary') {
        result = result.filter(item => 
          item.category === 'Task 1 Vocabulary' || 
          item.category === 'Writing Task 1 Essentials' ||
          (item.source && item.source.includes('Task 1'))
        );
      } else if (cat === 'IELTS Advantage 50') {
        result = result.filter(item => 
          item.category === 'IELTS Advantage 50' || 
          (item.source && item.source.includes('IELTS Advantage'))
        );
      } else {
        result = result.filter(item => item.category === cat || (item.source && item.source.includes(cat)));
      }
    }

    // Bookmarked filter
    if (state.onlyStarred) {
      result = result.filter(item => state.starredIds.has(item.id));
    }

    // Mastered filter
    if (state.onlyMastered) {
      result = result.filter(item => state.masteredIds.has(item.id));
    }

    // Bangla filter
    if (state.onlyBangla) {
      result = result.filter(item => item.meaning_bn && item.meaning_bn.trim().length > 0);
    }

    // Text search
    if (state.searchQuery) {
      const q = state.searchQuery;
      result = result.filter(item => {
        const w = (item.word || '').toLowerCase();
        const mEn = (item.meaning_en || '').toLowerCase();
        const mBn = (item.meaning_bn || '').toLowerCase();
        const syns = (item.synonyms || []).join(' ').toLowerCase();
        return w.includes(q) || mEn.includes(q) || mBn.includes(q) || syns.includes(q);
      });
    }

    // Sorting
    if (state.sortBy === 'az') {
      result.sort((a, b) => a.word.localeCompare(b.word));
    } else if (state.sortBy === 'za') {
      result.sort((a, b) => b.word.localeCompare(a.word));
    } else if (state.sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    state.filteredWords = result;
    renderWordCards();
    renderPagination();
  }

  function renderWordCards() {
    const grid = document.getElementById('wordsGrid');
    grid.innerHTML = '';

    const start = (state.currentPage - 1) * state.pageSize;
    const end = Math.min(start + state.pageSize, state.filteredWords.length);
    const pageItems = state.filteredWords.slice(start, end);

    const resultsInfo = document.getElementById('resultsCount');
    if (state.filteredWords.length === 0) {
      resultsInfo.textContent = 'No matching words found';
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Vocabulary Found</h3>
          <p>Try clearing your search query or selecting a different category filter.</p>
        </div>
      `;
      return;
    }

    resultsInfo.textContent = `Showing ${(start + 1).toLocaleString()} - ${end.toLocaleString()} of ${state.filteredWords.length.toLocaleString()} words`;

    const fragment = document.createDocumentFragment();

    pageItems.forEach(item => {
      const isStarred = state.starredIds.has(item.id);
      const isMastered = state.masteredIds.has(item.id);

      const card = document.createElement('article');
      card.className = `word-card ${isMastered ? 'mastered' : ''} ${isStarred ? 'starred' : ''}`;
      card.dataset.id = item.id;

      // Badges
      let categoryBadgeClass = 'badge-blue';
      if (item.category.includes('Idiom')) categoryBadgeClass = 'badge-amber';
      else if (item.category.includes('Listening')) categoryBadgeClass = 'badge-green';

      const synonymsHtml = (item.synonyms && item.synonyms.length > 0)
        ? `<div class="synonyms-container">
            ${item.synonyms.slice(0, 4).map(s => `<span class="synonym-pill">${escapeHtml(s)}</span>`).join('')}
           </div>`
        : '';

      const banglaHtml = (item.meaning_bn && item.meaning_bn.trim().length > 0)
        ? `<div class="card-bangla-meaning bn-font">${escapeHtml(item.meaning_bn)}</div>`
        : '';

      const exampleHtml = (item.example && item.example.trim().length > 0)
        ? `<div class="card-example">"${escapeHtml(item.example)}"</div>`
        : '';

      card.innerHTML = `
        <div class="card-header">
          <div class="word-title-group">
            <div class="word-title">
              <span>${escapeHtml(item.word)}</span>
              <button class="pronounce-btn" title="Listen Pronunciation" data-word="${escapeHtml(item.word)}">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            <span class="card-source-tag">${escapeHtml(item.sub_category || item.source || '')}</span>
          </div>
          <div class="card-actions">
            <button class="icon-action-btn star-btn ${isStarred ? 'active' : ''}" title="Bookmark Word" data-id="${item.id}">
              <i class="${isStarred ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
            <button class="icon-action-btn check-btn ${isMastered ? 'active' : ''}" title="Mark as Mastered" data-id="${item.id}">
              <i class="${isMastered ? 'fa-solid' : 'fa-regular'} fa-circle-check"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          ${banglaHtml}
          ${item.meaning_en ? `<div class="card-english-def">${escapeHtml(item.meaning_en)}</div>` : ''}
          ${synonymsHtml}
          ${exampleHtml}
        </div>

        <div class="card-footer">
          <span class="badge-tag ${categoryBadgeClass}">${escapeHtml(item.category)}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">
            ${escapeHtml(item.difficulty || 'Band 7-8')}
          </span>
        </div>
      `;

      // Pronounce click
      card.querySelector('.pronounce-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        audio.pronounce(item.word);
      });

      // Star click
      card.querySelector('.star-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStar(item.id);
        const btn = card.querySelector('.star-btn');
        const active = state.starredIds.has(item.id);
        btn.classList.toggle('active', active);
        btn.querySelector('i').className = active ? 'fa-solid fa-star' : 'fa-regular fa-star';
        card.classList.toggle('starred', active);
      });

      // Mastered click
      card.querySelector('.check-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMastered(item.id);
        const btn = card.querySelector('.check-btn');
        const active = state.masteredIds.has(item.id);
        btn.classList.toggle('active', active);
        btn.querySelector('i').className = active ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle-check';
        card.classList.toggle('mastered', active);
      });

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  function renderPagination() {
    const container = document.getElementById('paginationControls');
    container.innerHTML = '';

    const totalPages = Math.ceil(state.filteredWords.length / state.pageSize);
    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.disabled = state.currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderWordCards();
        renderPagination();
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    });
    container.appendChild(prevBtn);

    // Page Number Window
    let startPage = Math.max(1, state.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
      const firstBtn = createPageBtn(1);
      container.appendChild(firstBtn);
      if (startPage > 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.color = 'var(--text-muted)';
        container.appendChild(dots);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      container.appendChild(createPageBtn(p));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.color = 'var(--text-muted)';
        container.appendChild(dots);
      }
      container.appendChild(createPageBtn(totalPages));
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.disabled = state.currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderWordCards();
        renderPagination();
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    });
    container.appendChild(nextBtn);
  }

  function createPageBtn(pageNum) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${pageNum === state.currentPage ? 'active' : ''}`;
    btn.textContent = pageNum;
    btn.addEventListener('click', () => {
      state.currentPage = pageNum;
      renderWordCards();
      renderPagination();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    });
    return btn;
  }

  function toggleStar(id) {
    if (state.starredIds.has(id)) {
      state.starredIds.delete(id);
    } else {
      state.starredIds.add(id);
    }
    savePersistence();
  }

  function toggleMastered(id) {
    if (state.masteredIds.has(id)) {
      state.masteredIds.delete(id);
    } else {
      state.masteredIds.add(id);
    }
    savePersistence();
  }

  // -----------------------------------------------------------
  // 3D FLASHCARDS ENGINE
  // -----------------------------------------------------------
  function initFlashcards() {
    loadFlashcardDeck('all');
  }

  function loadFlashcardDeck(deckKey) {
    if (deckKey === 'all') {
      state.fcDeck = [...state.allWords];
    } else if (deckKey === 'starred') {
      state.fcDeck = state.allWords.filter(w => state.starredIds.has(w.id));
    } else if (deckKey === 'Reading Vocab') {
      state.fcDeck = state.allWords.filter(w => 
        w.category === 'Reading Vocab' || 
        w.category === 'Cambridge Tests' || 
        w.category === 'Reading Topic Vocabulary' ||
        (w.source && (w.source.includes('Cambridge') || w.source.includes('Reading')))
      );
    } else if (deckKey === 'Task 1 Vocabulary') {
      state.fcDeck = state.allWords.filter(w => 
        w.category === 'Task 1 Vocabulary' || 
        w.category === 'Writing Task 1 Essentials' ||
        (w.source && w.source.includes('Task 1'))
      );
    } else if (deckKey === 'IELTS Advantage 50') {
      state.fcDeck = state.allWords.filter(w => 
        w.category === 'IELTS Advantage 50' || 
        (w.source && w.source.includes('IELTS Advantage'))
      );
    } else {
      state.fcDeck = state.allWords.filter(w => w.category === deckKey || (w.source && w.source.includes(deckKey)));
    }

    if (state.fcDeck.length === 0) {
      state.fcDeck = [...state.allWords];
    }

    state.fcIndex = 0;
    renderFlashcard();
  }

  function shuffleFlashcards() {
    for (let i = state.fcDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.fcDeck[i], state.fcDeck[j]] = [state.fcDeck[j], state.fcDeck[i]];
    }
    state.fcIndex = 0;
    renderFlashcard();
  }

  function changeFlashcard(delta) {
    if (state.fcDeck.length === 0) return;
    state.fcFlipped = false;
    document.getElementById('flashcardInner').classList.remove('is-flipped');

    state.fcIndex = (state.fcIndex + delta + state.fcDeck.length) % state.fcDeck.length;
    setTimeout(() => {
      renderFlashcard();
    }, 150);
  }

  function renderFlashcard() {
    const card = state.fcDeck[state.fcIndex];
    if (!card) return;

    // Progress
    const total = state.fcDeck.length;
    const currentNum = state.fcIndex + 1;
    document.getElementById('fcCounter').textContent = `Card ${currentNum.toLocaleString()} of ${total.toLocaleString()}`;
    document.getElementById('fcProgressBar').style.width = `${(currentNum / total) * 100}%`;

    // Front Face
    document.getElementById('fcFrontCategory').textContent = card.category;
    document.getElementById('fcFrontWord').textContent = card.word;
    document.getElementById('fcFrontDifficulty').textContent = card.difficulty || 'Band 7-8';

    // Back Face
    const backBangla = document.getElementById('fcBackBangla');
    if (card.meaning_bn && card.meaning_bn.trim().length > 0) {
      backBangla.textContent = card.meaning_bn;
      backBangla.style.display = 'block';
    } else {
      backBangla.style.display = 'none';
    }

    document.getElementById('fcBackMeaning').textContent = card.meaning_en || (card.synonyms ? card.synonyms.join(', ') : '');

    const backExample = document.getElementById('fcBackExample');
    if (card.example && card.example.trim().length > 0) {
      backExample.textContent = `"${card.example}"`;
      backExample.style.display = 'block';
    } else {
      backExample.style.display = 'none';
    }

    const synCount = card.synonyms ? card.synonyms.length : 0;
    document.getElementById('fcBackSynonymsCount').textContent = synCount > 0 ? `${synCount} Synonyms & Collocations` : card.source;

    updateFlashcardStatusButtons();
  }

  function updateFlashcardStatusButtons() {
    const card = state.fcDeck[state.fcIndex];
    if (!card) return;

    const starBtn = document.getElementById('fcToggleStarBtn');
    const isStarred = state.starredIds.has(card.id);
    starBtn.innerHTML = `<i class="${isStarred ? 'fa-solid' : 'fa-regular'} fa-star" style="color: ${isStarred ? '#fbbf24' : 'inherit'}"></i> ${isStarred ? 'Bookmarked' : 'Bookmark'}`;

    const masterBtn = document.getElementById('fcToggleMasterBtn');
    const isMastered = state.masteredIds.has(card.id);
    masterBtn.innerHTML = `<i class="${isMastered ? 'fa-solid' : 'fa-regular'} fa-circle-check" style="color: ${isMastered ? 'var(--success)' : 'inherit'}"></i> ${isMastered ? 'Mastered' : 'Mark Mastered'}`;
  }

  // -----------------------------------------------------------
  // QUIZ ARENA ENGINE (SMART, MODERN & 100% ENGLISH OPTIONS)
  // -----------------------------------------------------------
  function initQuiz(customQuestions = null) {
    stopQuizTimer();
    state.quizScore = 0;
    state.quizStreak = 0;
    state.quizBestStreak = 0;
    state.quizIndex = 0;
    state.quizMistakes = [];

    const playCard = document.getElementById('quizPlayCard');
    const resultsCard = document.getElementById('quizResultsCard');
    if (playCard) playCard.style.display = 'flex';
    if (resultsCard) resultsCard.style.display = 'none';

    if (customQuestions && Array.isArray(customQuestions) && customQuestions.length > 0) {
      state.quizQuestions = customQuestions;
    } else {
      generateQuizSet();
    }

    renderQuizQuestion();
  }

  function generateQuizSet() {
    let pool = state.allWords;

    // Filter by selected deck
    if (state.quizDeck === 'starred') {
      pool = state.allWords.filter(w => state.starredIds.has(w.id));
      if (pool.length === 0) {
        alert('You do not have any bookmarked words yet. Showing questions from All Words.');
        pool = state.allWords;
        const deckSel = document.getElementById('quizDeckSelect');
        if (deckSel) deckSel.value = 'all';
        state.quizDeck = 'all';
      }
    } else if (state.quizDeck === 'Reading Vocab') {
      pool = state.allWords.filter(w => 
        w.category === 'Reading Vocab' || 
        w.category === 'Cambridge Tests' || 
        w.category === 'Reading Topic Vocabulary' ||
        (w.source && (w.source.includes('Cambridge') || w.source.includes('Reading')))
      );
    } else if (state.quizDeck === 'Task 1 Vocabulary') {
      pool = state.allWords.filter(w => 
        w.category === 'Task 1 Vocabulary' || 
        w.category === 'Writing Task 1 Essentials' ||
        (w.source && w.source.includes('Task 1'))
      );
    } else if (state.quizDeck === 'IELTS Advantage 50') {
      pool = state.allWords.filter(w => 
        w.category === 'IELTS Advantage 50' || 
        (w.source && w.source.includes('IELTS Advantage'))
      );
    } else if (state.quizDeck !== 'all') {
      pool = state.allWords.filter(w => w.category === state.quizDeck || (w.source && w.source.includes(state.quizDeck)));
      if (pool.length === 0) pool = state.allWords;
    }

    // Ensure pool items have an English word and some English definition/synonyms
    let candidates = pool.filter(w => w.word && w.word.trim().length > 1 && ((w.meaning_en && w.meaning_en.trim().length > 2) || (w.synonyms && w.synonyms.length > 0)));
    if (candidates.length < 5) {
      // Fallback to allWords if category is too narrow
      candidates = state.allWords.filter(w => w.word && w.word.trim().length > 1 && ((w.meaning_en && w.meaning_en.trim().length > 2) || (w.synonyms && w.synonyms.length > 0)));
    }

    // Shuffle and pick target count
    const count = Math.min(state.quizLength || 10, candidates.length);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, count);

    // Build question set based on quiz mode
    const distractorPool = state.allWords.filter(w => w.word && w.word.trim().length > 1);

    state.quizQuestions = selectedItems.map(item => {
      let mode = state.quizMode;
      if (mode === 'mixed') {
        const availableModes = ['def_to_word'];
        if (item.meaning_en && item.meaning_en.trim().length > 5 && !item.meaning_en.startsWith('Frequently tested')) {
          availableModes.push('word_to_def');
        }
        if (item.synonyms && item.synonyms.length > 0) availableModes.push('synonym');
        if (item.example && item.example.length > 15 && item.example.toLowerCase().includes(item.word.toLowerCase())) availableModes.push('sentence');
        mode = availableModes[Math.floor(Math.random() * availableModes.length)];
      }

      // 1. Definition ➔ Word Match
      if (mode === 'def_to_word' || !item.meaning_en) {
        const promptType = 'IELTS DEFINITION ➔ WORD MATCH';
        const questionText = 'Which academic word matches this definition?';
        const targetClue = item.meaning_en || (item.synonyms ? `Similar to: ${item.synonyms.join(', ')}` : 'Academic vocabulary concept');
        const correctOpt = item.word;

        // 3 Distractor words
        const distractors = [];
        const used = new Set([item.word.toLowerCase()]);
        while (distractors.length < 3) {
          const rand = distractorPool[Math.floor(Math.random() * distractorPool.length)];
          const rw = rand.word.trim();
          if (!used.has(rw.toLowerCase()) && rw.length > 1) {
            used.add(rw.toLowerCase());
            distractors.push(rw);
          }
        }

        const options = [
          { text: correctOpt, correct: true },
          { text: distractors[0], correct: false },
          { text: distractors[1], correct: false },
          { text: distractors[2], correct: false }
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'def_to_word',
          promptType,
          questionText,
          targetClue,
          targetWord: item.word,
          showWordDirectly: false,
          correctOption: correctOpt,
          options,
          item
        };
      }

      // 2. Word ➔ English Definition
      if (mode === 'word_to_def') {
        const promptType = 'WORD ➔ ENGLISH DEFINITION';
        const questionText = 'Select the correct English definition for:';
        const targetClue = '';
        const correctOpt = item.meaning_en;

        // 3 Distractor definitions
        const distractors = [];
        const used = new Set([item.meaning_en.toLowerCase()]);
        const defPool = state.allWords.filter(w => w.meaning_en && w.meaning_en.trim().length > 5 && !w.meaning_en.startsWith('Frequently tested') && w.id !== item.id);
        while (distractors.length < 3 && defPool.length >= 3) {
          const rand = defPool[Math.floor(Math.random() * defPool.length)];
          const rd = rand.meaning_en.trim();
          if (!used.has(rd.toLowerCase())) {
            used.add(rd.toLowerCase());
            distractors.push(rd);
          }
        }

        const options = [
          { text: correctOpt, correct: true },
          { text: distractors[0] || 'A distinct feature or phenomenon in context', correct: false },
          { text: distractors[1] || 'To make something greater in amount or degree', correct: false },
          { text: distractors[2] || 'An ongoing process of progressive development', correct: false }
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'word_to_def',
          promptType,
          questionText,
          targetClue,
          targetWord: item.word,
          showWordDirectly: true,
          correctOption: correctOpt,
          options,
          item
        };
      }

      // 3. Synonym Challenge
      if (mode === 'synonym') {
        const promptType = 'ACADEMIC SYNONYM CHALLENGE';
        const questionText = 'Which is the closest English synonym for:';
        const targetClue = '';
        const correctOpt = (item.synonyms && item.synonyms.length > 0)
          ? item.synonyms[0]
          : item.meaning_en;

        const distractors = [];
        const used = new Set([correctOpt.toLowerCase(), item.word.toLowerCase()]);
        while (distractors.length < 3) {
          const rand = distractorPool[Math.floor(Math.random() * distractorPool.length)];
          let cand = (rand.synonyms && rand.synonyms.length > 0) ? rand.synonyms[0] : rand.word;
          cand = cand.trim();
          if (!used.has(cand.toLowerCase()) && cand.length > 1) {
            used.add(cand.toLowerCase());
            distractors.push(cand);
          }
        }

        const options = [
          { text: correctOpt, correct: true },
          { text: distractors[0], correct: false },
          { text: distractors[1], correct: false },
          { text: distractors[2], correct: false }
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'synonym',
          promptType,
          questionText,
          targetClue,
          targetWord: item.word,
          showWordDirectly: true,
          correctOption: correctOpt,
          options,
          item
        };
      }

      // 4. Sentence Completion (Academic Cloze)
      if (mode === 'sentence') {
        const promptType = 'ACADEMIC SENTENCE CLOZE';
        const questionText = 'Complete the academic sentence with the best word:';
        
        // Blank out target word in sentence
        const escWord = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`\\b${escWord}\\b`, 'gi');
        const clozeSentence = item.example ? item.example.replace(re, '_______') : `The study examined how _______ influences the final outcome.`;

        const correctOpt = item.word;

        const distractors = [];
        const used = new Set([item.word.toLowerCase()]);
        while (distractors.length < 3) {
          const rand = distractorPool[Math.floor(Math.random() * distractorPool.length)];
          const rw = rand.word.trim();
          if (!used.has(rw.toLowerCase()) && rw.length > 1) {
            used.add(rw.toLowerCase());
            distractors.push(rw);
          }
        }

        const options = [
          { text: correctOpt, correct: true },
          { text: distractors[0], correct: false },
          { text: distractors[1], correct: false },
          { text: distractors[2], correct: false }
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'sentence',
          promptType,
          questionText,
          targetClue: `"${clozeSentence}"`,
          targetWord: item.word,
          showWordDirectly: false,
          correctOption: correctOpt,
          options,
          item
        };
      }

      // Fallback
      return {
        type: 'def_to_word',
        promptType: 'IELTS VOCABULARY MATCH',
        questionText: 'Which word matches this description?',
        targetClue: item.meaning_en || 'Academic term',
        targetWord: item.word,
        showWordDirectly: false,
        correctOption: item.word,
        options: [{ text: item.word, correct: true }],
        item
      };
    });
  }

  function startQuizTimer() {
    stopQuizTimer();
    if (!state.quizTimerEnabled) {
      const badge = document.getElementById('quizTimerBadge');
      if (badge) badge.style.display = 'none';
      return;
    }

    state.quizTimerRemaining = state.quizTimerSeconds || 15;
    const badge = document.getElementById('quizTimerBadge');
    const timerText = document.getElementById('quizTimerText');
    if (badge) {
      badge.style.display = 'inline-flex';
      badge.classList.remove('warning');
    }
    if (timerText) timerText.textContent = `${state.quizTimerRemaining}s`;

    state.quizTimerInterval = setInterval(() => {
      state.quizTimerRemaining--;
      if (timerText) timerText.textContent = `${state.quizTimerRemaining}s`;

      if (state.quizTimerRemaining <= 5 && badge) {
        badge.classList.add('warning');
      }

      if (state.quizTimerRemaining <= 0) {
        stopQuizTimer();
        handleQuizTimeout();
      }
    }, 1000);
  }

  function stopQuizTimer() {
    if (state.quizTimerInterval) {
      clearInterval(state.quizTimerInterval);
      state.quizTimerInterval = null;
    }
    const badge = document.getElementById('quizTimerBadge');
    if (badge) badge.classList.remove('warning');
  }

  function renderQuizQuestion() {
    state.quizAnswered = false;
    const q = state.quizQuestions[state.quizIndex];
    if (!q) {
      showQuizCompletion();
      return;
    }

    const total = state.quizQuestions.length;
    const currentNum = state.quizIndex + 1;

    // Header info
    document.getElementById('quizCounterText').textContent = `Question ${currentNum} of ${total}`;
    document.getElementById('quizScoreText').textContent = `Score: ${state.quizScore}`;
    document.getElementById('quizStreakText').textContent = `Streak: ${state.quizStreak}`;
    document.getElementById('quizModeBadge').textContent = q.promptType;
    document.getElementById('quizPromptType').textContent = q.promptType;
    document.getElementById('quizDifficultyTag').textContent = q.item?.difficulty || 'Band 7.5+';

    // Progress bar
    const progressPercent = (currentNum / total) * 100;
    document.getElementById('quizProgressFill').style.width = `${progressPercent}%`;

    // Streak flame animation
    const fireIcon = document.querySelector('.streak-fire');
    if (fireIcon) fireIcon.classList.toggle('active', state.quizStreak >= 2);

    // Question content
    const questionTextEl = document.getElementById('quizQuestionText');
    const targetRowEl = document.getElementById('quizTargetRow');
    const targetWordEl = document.getElementById('quizTargetWord');

    if (q.showWordDirectly) {
      questionTextEl.textContent = q.questionText;
      targetWordEl.textContent = q.targetWord;
      targetRowEl.style.display = 'flex';
    } else {
      questionTextEl.textContent = q.questionText;
      targetWordEl.textContent = q.targetClue;
      targetWordEl.style.fontSize = q.targetClue.length > 50 ? '1.25rem' : '1.7rem';
      targetRowEl.style.display = 'flex';
    }

    // Hide explanation and next button
    const expCard = document.getElementById('quizExplanationCard');
    if (expCard) expCard.style.display = 'none';

    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) nextBtn.classList.remove('show');

    // Render 4 English Option Buttons
    const optionsList = document.getElementById('quizOptionsList');
    optionsList.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${letters[idx]}</span>
        <span style="flex-grow: 1;">${escapeHtml(opt.text)}</span>
      `;

      btn.addEventListener('click', () => {
        if (state.quizAnswered) return;
        handleQuizAnswer(opt, btn, q);
      });

      optionsList.appendChild(btn);
    });

    // Start 15s Timer
    startQuizTimer();
  }

  function handleQuizAnswer(selectedOpt, clickedBtn, q) {
    state.quizAnswered = true;
    stopQuizTimer();

    const optionsList = document.getElementById('quizOptionsList');
    const allOptBtns = optionsList.querySelectorAll('.quiz-opt-btn');

    // Disable all options
    allOptBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedOpt.correct;
    const expCard = document.getElementById('quizExplanationCard');
    const expStatus = document.getElementById('explanationStatus');

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      audio.playChime(true);
      state.quizScore += 10;
      state.quizStreak += 1;
      if (state.quizStreak > state.quizBestStreak) {
        state.quizBestStreak = state.quizStreak;
      }

      // Bonus points for streaks
      if (state.quizStreak >= 3) {
        state.quizScore += 5;
      }

      expStatus.className = 'explanation-status correct';
      expStatus.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>Correct! +10 Points ${state.quizStreak >= 3 ? '🔥 Streak Bonus (+5)!' : ''}</span>
      `;
    } else {
      clickedBtn.classList.add('wrong');
      audio.playChime(false);
      state.quizStreak = 0;

      // Highlight correct answer
      allOptBtns.forEach(b => {
        if (b.textContent.includes(q.correctOption)) {
          b.classList.add('correct');
        }
      });

      // Record mistake for review
      state.quizMistakes.push({
        word: q.item.word,
        meaning_en: q.item.meaning_en,
        meaning_bn: q.item.meaning_bn,
        question: q.showWordDirectly ? q.targetWord : q.targetClue,
        chosen: selectedOpt.text,
        correct: q.correctOption,
        item: q.item
      });

      expStatus.className = 'explanation-status wrong';
      expStatus.innerHTML = `
        <i class="fa-solid fa-circle-xmark"></i>
        <span>Incorrect. Correct Answer: <strong>${escapeHtml(q.correctOption)}</strong></span>
      `;
    }

    // Populate Detailed Academic Explanation Card
    populateExplanationCard(q.item);

    if (expCard) expCard.style.display = 'flex';

    // Show Next Button
    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) {
      nextBtn.classList.add('show');
      nextBtn.focus();
    }

    // Update dynamic stats
    document.getElementById('quizScoreText').textContent = `Score: ${state.quizScore}`;
    document.getElementById('quizStreakText').textContent = `Streak: ${state.quizStreak}`;
  }

  function handleQuizTimeout() {
    state.quizAnswered = true;
    const q = state.quizQuestions[state.quizIndex];
    if (!q) return;

    audio.playChime(false);
    state.quizStreak = 0;

    const optionsList = document.getElementById('quizOptionsList');
    const allOptBtns = optionsList.querySelectorAll('.quiz-opt-btn');
    allOptBtns.forEach(b => {
      b.disabled = true;
      if (b.textContent.includes(q.correctOption)) {
        b.classList.add('correct');
      }
    });

    // Record mistake
    state.quizMistakes.push({
      word: q.item.word,
      meaning_en: q.item.meaning_en,
      meaning_bn: q.item.meaning_bn,
      question: q.showWordDirectly ? q.targetWord : q.targetClue,
      chosen: 'Timed out (15s exceeded)',
      correct: q.correctOption,
      item: q.item
    });

    const expCard = document.getElementById('quizExplanationCard');
    const expStatus = document.getElementById('explanationStatus');
    expStatus.className = 'explanation-status wrong';
    expStatus.innerHTML = `
      <i class="fa-solid fa-hourglass-end"></i>
      <span>Time Expired! The correct answer was: <strong>${escapeHtml(q.correctOption)}</strong></span>
    `;

    populateExplanationCard(q.item);
    if (expCard) expCard.style.display = 'flex';

    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) {
      nextBtn.classList.add('show');
      nextBtn.focus();
    }

    document.getElementById('quizStreakText').textContent = `Streak: 0`;
  }

  function populateExplanationCard(item) {
    if (!item) return;
    document.getElementById('expWordName').textContent = item.word;
    document.getElementById('expWordPos').textContent = item.part_of_speech || (item.word.includes(' ') ? 'phrase' : 'academic word');
    document.getElementById('expWordPhonetic').textContent = item.pronunciation ? `[${item.pronunciation}]` : '';

    const defEl = document.getElementById('expMeaningEn');
    defEl.innerHTML = `<strong>English Definition:</strong> ${escapeHtml(item.meaning_en || 'High-frequency academic term used in Cambridge IELTS.')}`;

    const synEl = document.getElementById('expSynonyms');
    const synList = document.getElementById('expSynonymsList');
    if (item.synonyms && item.synonyms.length > 0) {
      synList.textContent = item.synonyms.join(', ');
      synEl.style.display = 'block';
    } else {
      synEl.style.display = 'none';
    }

    const exEl = document.getElementById('expExample');
    const exText = document.getElementById('expExampleText');
    if (item.example && item.example.trim().length > 0) {
      exText.textContent = item.example;
      exEl.style.display = 'block';
    } else {
      exEl.style.display = 'none';
    }

    const bnText = document.getElementById('expMeaningBnText');
    if (item.meaning_bn && item.meaning_bn.trim().length > 0) {
      bnText.textContent = item.meaning_bn;
      document.getElementById('expMeaningBn').style.display = 'flex';
    } else {
      document.getElementById('expMeaningBn').style.display = 'none';
    }
  }

  function nextQuizQuestion() {
    state.quizIndex++;
    if (state.quizIndex >= state.quizQuestions.length) {
      showQuizCompletion();
    } else {
      renderQuizQuestion();
    }
  }

  function showQuizCompletion() {
    stopQuizTimer();

    const playCard = document.getElementById('quizPlayCard');
    const resultsCard = document.getElementById('quizResultsCard');
    if (playCard) playCard.style.display = 'none';
    if (resultsCard) resultsCard.style.display = 'flex';

    const total = state.quizQuestions.length;
    const correctCount = total - state.quizMistakes.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Projected IELTS Band Equivalent
    let band = 'Band 5.5 (Keep Practicing)';
    let title = 'Quiz Complete!';
    let subtitle = 'Consistent daily practice will push you to Band 8+!';
    let trophyColor = '#94a3b8';

    if (accuracy === 100) {
      band = 'IELTS Band 9.0 (Expert)';
      title = 'Master Class Performance! 🏆';
      subtitle = 'Flawless execution! You demonstrated native-level academic vocabulary mastery.';
      trophyColor = '#fbbf24';
      audio.playChime(true);
    } else if (accuracy >= 80) {
      band = 'IELTS Band 8.5 (Very Good)';
      title = 'Outstanding Performance! 🌟';
      subtitle = 'You have a command of complex academic vocabulary and subtle nuances.';
      trophyColor = '#34d399';
      audio.playChime(true);
    } else if (accuracy >= 70) {
      band = 'IELTS Band 7.5 (Good)';
      title = 'Great Job! 🎯';
      subtitle = 'Solid grasp of key IELTS terminology. Review missed words to climb higher.';
      trophyColor = '#60a5fa';
    } else if (accuracy >= 50) {
      band = 'IELTS Band 6.5 (Competent)';
      title = 'Good Effort! 📚';
      subtitle = 'You know the core terms. Practice flashcards and re-take the drill.';
      trophyColor = '#f59e0b';
    }

    document.getElementById('resultsBandBadge').textContent = band;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsSubtitle').textContent = subtitle;
    document.querySelector('.trophy-circle').style.color = trophyColor;
    document.querySelector('.trophy-circle').style.borderColor = trophyColor;

    // Metrics
    document.getElementById('resFinalScore').textContent = state.quizScore;
    document.getElementById('resAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resBestStreak').textContent = state.quizBestStreak;
    document.getElementById('resCorrectCount').textContent = `${correctCount} / ${total}`;

    // Review Mistakes Section
    const reviewSection = document.getElementById('resultsReviewSection');
    const reviewList = document.getElementById('reviewItemsList');
    const retryMissedBtn = document.getElementById('resultsRetryMissedBtn');

    if (state.quizMistakes.length > 0) {
      reviewSection.style.display = 'block';
      retryMissedBtn.style.display = 'inline-flex';
      document.getElementById('reviewCount').textContent = state.quizMistakes.length;
      reviewList.innerHTML = '';

      state.quizMistakes.forEach((m, i) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'review-item-card';
        itemCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${i + 1}. ${escapeHtml(m.word)}</strong>
            <span style="font-size: 0.88rem; color: #B91C1C; font-weight: 700;">Your answer: <em>${escapeHtml(m.chosen)}</em></span>
          </div>
          <div style="color: #047857; font-size: 0.95rem; font-weight: 700; margin-top: 0.2rem;">
            <i class="fa-solid fa-check"></i> Correct: <strong>${escapeHtml(m.correct)}</strong>
          </div>
          ${m.meaning_bn ? `<div class="card-bangla-meaning lang-bn-only" style="color: #FDA4AF; font-size: 0.95rem; font-family: 'Hind Siliguri', sans-serif; font-weight: 700; margin-top: 0.25rem;">বাংলা অর্থ: ${escapeHtml(m.meaning_bn)}</div>` : ''}
        `;
        reviewList.appendChild(itemCard);
      });
    } else {
      reviewSection.style.display = 'none';
      retryMissedBtn.style.display = 'none';
    }
  }

  function retryMissedQuiz() {
    if (!state.quizMistakes || state.quizMistakes.length === 0) return;
    const missedItems = state.quizMistakes.map(m => m.item);
    
    // Generate questions for these missed items
    const distractorPool = state.allWords.filter(w => w.word && w.word.trim().length > 1);
    const newQuestions = missedItems.map(item => {
      const correctOpt = item.word;
      const distractors = [];
      const used = new Set([item.word.toLowerCase()]);
      while (distractors.length < 3) {
        const rand = distractorPool[Math.floor(Math.random() * distractorPool.length)];
        const rw = rand.word.trim();
        if (!used.has(rw.toLowerCase())) {
          used.add(rw.toLowerCase());
          distractors.push(rw);
        }
      }
      const options = [
        { text: correctOpt, correct: true },
        { text: distractors[0], correct: false },
        { text: distractors[1], correct: false },
        { text: distractors[2], correct: false }
      ].sort(() => 0.5 - Math.random());

      return {
        type: 'def_to_word',
        promptType: 'RE-TEST: MISSED VOCABULARY',
        questionText: 'Which academic word matches this definition?',
        targetClue: item.meaning_en || (item.meaning_bn ? `Academic term: ${item.meaning_bn}` : 'IELTS Term'),
        targetWord: item.word,
        showWordDirectly: false,
        correctOption: correctOpt,
        options,
        item
      };
    });

    initQuiz(newQuestions);
  }

  // ==================== WORD OF THE DAY (HOME HUB WIDGET) ====================
  const highYieldWords = [
    { word: "Profound", pos: "Adjective", bangla: "গভীর, সুদূরপ্রসারী, অত্যন্ত অর্থপূর্ণ", meaning: "Very great or intense; having or showing great knowledge or insight.", example: "The discovery of DNA had a profound impact on biology." },
    { word: "Ubiquitous", pos: "Adjective", bangla: "সর্বব্যাপী, যা সব জায়গায় পাওয়া যায়", meaning: "Present, appearing, or found everywhere.", example: "Smartphones have become ubiquitous in daily life." },
    { word: "Mitigate", pos: "Verb", bangla: "উপশম করা, তীব্রতা কমানো", meaning: "Make something bad less severe, serious, or painful.", example: "Urgent green policies are vital to mitigate climate change." },
    { word: "Exemplary", pos: "Adjective", bangla: "অনুকরণীয়, দৃষ্টান্তমূলক", meaning: "Serving as a desirable model; representing the best of its kind.", example: "Her exemplary dedication earned highest praise." },
    { word: "Pervasive", pos: "Adjective", bangla: "বিস্তৃত, অনুপ্রবেশকারী", meaning: "Spreading widely throughout an area or a group of people.", example: "Social media has a pervasive influence on society." },
    { word: "Corroborate", pos: "Verb", bangla: "সত্যায়িত করা, সমর্থন করা", meaning: "Confirm or give support to a statement, theory, or finding.", example: "Recent empirical studies corroborate this hypothesis." },
    { word: "Detrimental", pos: "Adjective", bangla: "ক্ষতিকর, অনিষ্টকর", meaning: "Tending to cause harm or damage.", example: "Excessive stress has a detrimental effect on mental health." },
    { word: "Feasible", pos: "Adjective", bangla: "সম্ভবপর, বাস্তবসম্মত", meaning: "Possible to do easily or conveniently.", example: "Renewable energy provides a highly feasible solution." },
    { word: "Disparity", pos: "Noun", bangla: "বৈষম্য, পার্থক্য", meaning: "A great difference or inequality.", example: "Economic disparity between urban and rural areas persists." },
    { word: "Pragmatic", pos: "Adjective", bangla: "বাস্তবধর্মী, বাস্তববাদী", meaning: "Dealing with things sensibly and realistically based on practical considerations.", example: "We need a pragmatic approach to solve traffic congestion." }
  ];

  let currentWotdIndex = 0;

  function setupWordOfTheDay() {
    const elWord = document.getElementById('wotdWord');
    const elPos = document.getElementById('wotdPos');
    const elBangla = document.getElementById('wotdBangla');
    const elMeaning = document.getElementById('wotdMeaning');
    const elExample = document.getElementById('wotdExample');
    const btnNext = document.getElementById('btnNextWordOfTheDay');
    const btnAudio = document.getElementById('wotdAudioBtn');

    if (!elWord) return;

    function renderWord(index) {
      const item = highYieldWords[index % highYieldWords.length];
      elWord.textContent = item.word;
      elPos.textContent = item.pos;
      elBangla.textContent = item.bangla;
      elMeaning.textContent = item.meaning;
      elExample.textContent = `"${item.example}"`;
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        currentWotdIndex = (currentWotdIndex + 1) % highYieldWords.length;
        renderWord(currentWotdIndex);
      });
    }

    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const item = highYieldWords[currentWotdIndex % highYieldWords.length];
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(item.word);
          utter.lang = 'en-GB';
          utter.rate = 0.9;
          window.speechSynthesis.speak(utter);
        } else {
          showToast('Audio pronunciation: ' + item.word);
        }
      });
    }

    renderWord(currentWotdIndex);
  }

  // -----------------------------------------------------------
  // LISTENING SPELLING DRILL ENGINE
  // -----------------------------------------------------------
  function nextSpellingWord() {
    const deckSelect = document.getElementById('spellingDeckSelect');
    const selectedDeck = deckSelect ? deckSelect.value : 'all';

    let pool = state.allWords;
    if (selectedDeck === 'starred') {
      pool = state.allWords.filter(w => state.starredIds.has(w.id));
      if (pool.length === 0) {
        showToast(state.isBengaliMode ? 'কোনো বুকমার্ক করা শব্দ নেই!' : 'No bookmarked words found!');
        if (deckSelect) deckSelect.value = 'all';
        pool = state.allWords;
      }
    } else if (selectedDeck !== 'all') {
      pool = state.allWords.filter(w => w.category === selectedDeck || (selectedDeck === 'Reading Vocab' && (w.category === 'Reading Vocab' || w.category.includes('Cambridge') || w.category.includes('Reading'))));
    }

    // Filter clean single words without space and hyphen, min 3 chars
    let cleanPool = pool.filter(w => 
      w.word && 
      w.word.length >= 3 && 
      !w.word.includes(' ') && 
      !w.word.includes('-')
    );
    if (cleanPool.length === 0) cleanPool = pool;
    if (cleanPool.length === 0) return;

    state.spellingWord = cleanPool[Math.floor(Math.random() * cleanPool.length)];
    state.spellingHintsUsed = 0;

    const input = document.getElementById('spellingInput');
    if (input) {
      input.value = '';
      input.disabled = false;
      input.focus();
    }

    const feedback = document.getElementById('spellingFeedback');
    if (feedback) feedback.innerHTML = '';

    const catHint = document.getElementById('spellingCategoryHint');
    if (catHint) {
      catHint.textContent = `Category: ${state.spellingWord.sub_category || state.spellingWord.category} (${state.spellingWord.word.length} letters)`;
    }

    // Automatically speak the word
    setTimeout(() => {
      audio.pronounce(state.spellingWord.word);
    }, 300);
  }

  function checkSpelling() {
    if (!state.spellingWord) return;
    const input = document.getElementById('spellingInput');
    const userVal = input.value.trim().toLowerCase();
    const correct = state.spellingWord.word.trim().toLowerCase();
    const feedback = document.getElementById('spellingFeedback');

    if (!userVal) return;

    if (userVal === correct) {
      audio.playChime(true);
      state.spellingStreak++;
      feedback.style.color = 'var(--success)';
      feedback.innerHTML = `
        <div class="spelling-success-msg">
          <i class="fa-solid fa-circle-check"></i>
          <span><span class="lang-bn-only">চমৎকার!</span><span class="lang-en-only">Excellent!</span> <strong>${escapeHtml(state.spellingWord.word)}</strong> <span class="lang-bn-only">সঠিক হয়েছে!</span><span class="lang-en-only">is correct!</span></span>
        </div>
      `;
      updateSpellingScore();
      input.disabled = true;
      setTimeout(nextSpellingWord, 1300);
    } else {
      audio.playChime(false);
      state.spellingStreak = 0;
      updateSpellingScore();

      feedback.innerHTML = `
        <div class="spelling-wrong-prompt">
          <div class="wrong-alert-line">
            <i class="fa-solid fa-circle-xmark"></i>
            <span><span class="lang-bn-only">বানানটি সঠিক হয়নি!</span><span class="lang-en-only">Incorrect spelling!</span> (<em>"${escapeHtml(input.value.trim())}"</em>)</span>
          </div>
          <div class="wrong-query-line">
            <span class="lang-bn-only">আপনি কি সঠিক উত্তরটি দেখতে চান?</span>
            <span class="lang-en-only">Would you like to reveal the correct answer?</span>
          </div>
          <div class="wrong-action-row">
            <button type="button" class="btn-reveal-spelling" id="btnRevealSpellingAnswer">
              <i class="fa-solid fa-eye"></i> <span class="lang-bn-only">সঠিক উত্তর দেখুন</span><span class="lang-en-only">Reveal Answer</span>
            </button>
            <button type="button" class="btn-retry-spelling" id="btnRetrySpelling">
              <i class="fa-solid fa-rotate-left"></i> <span class="lang-bn-only">আবার চেষ্টা করুন</span><span class="lang-en-only">Try Again</span>
            </button>
          </div>
        </div>
      `;

      const btnReveal = document.getElementById('btnRevealSpellingAnswer');
      const btnRetry = document.getElementById('btnRetrySpelling');

      if (btnReveal) {
        btnReveal.addEventListener('click', showRevealedSpellingWord);
      }
      if (btnRetry) {
        btnRetry.addEventListener('click', () => {
          feedback.innerHTML = '';
          input.disabled = false;
          input.select();
          input.focus();
        });
      }
    }
  }

  function showRevealedSpellingWord() {
    if (!state.spellingWord) return;
    const feedback = document.getElementById('spellingFeedback');
    const input = document.getElementById('spellingInput');
    if (input) input.disabled = true;

    feedback.innerHTML = `
      <div class="spelling-revealed-card">
        <div class="revealed-header">
          <i class="fa-solid fa-lightbulb"></i>
          <span><span class="lang-bn-only">সঠিক উত্তর ও উচ্চারণ:</span><span class="lang-en-only">Correct Answer & Pronunciation:</span></span>
        </div>
        <div class="revealed-word-box">
          <span class="revealed-word-title">${escapeHtml(state.spellingWord.word)}</span>
          <button type="button" class="pronounce-btn" id="btnSpellingListenRevealed" title="Listen Pronunciation">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
        ${state.spellingWord.meaning_bn ? `<div class="revealed-meta card-bangla-meaning lang-bn-only"><i class="fa-solid fa-language"></i> বাংলা অর্থ: <strong>${escapeHtml(state.spellingWord.meaning_bn)}</strong></div>` : ''}
        ${state.spellingWord.meaning_en ? `<div class="revealed-meta"><i class="fa-solid fa-book"></i> Meaning: ${escapeHtml(state.spellingWord.meaning_en)}</div>` : ''}
        <div class="revealed-actions-row">
          <button type="button" class="spelling-next-btn" id="btnSpellingNextRevealed">
            <span class="lang-bn-only">পরবর্তী শব্দ</span><span class="lang-en-only">Next Word</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    audio.pronounce(state.spellingWord.word);

    const btnListen = document.getElementById('btnSpellingListenRevealed');
    if (btnListen) {
      btnListen.addEventListener('click', () => audio.pronounce(state.spellingWord.word));
    }

    const btnNext = document.getElementById('btnSpellingNextRevealed');
    if (btnNext) {
      btnNext.addEventListener('click', nextSpellingWord);
    }
  }

  function showSpellingHint() {
    if (!state.spellingWord) return;
    const word = state.spellingWord.word;
    const feedback = document.getElementById('spellingFeedback');
    feedback.style.color = '#38bdf8';
    
    // Reveal first and last letter
    const hint = word[0] + ' _ '.repeat(Math.max(1, word.length - 2)) + word[word.length - 1];
    feedback.textContent = `Hint: ${hint}`;
    audio.pronounce(word);
  }

  function updateSpellingScore() {
    document.getElementById('spellingScore').textContent = `Streak: ${state.spellingStreak}`;
  }

  // -----------------------------------------------------------
  // EXPORT BOOKMARKED WORDS
  // -----------------------------------------------------------
  function exportBookmarks() {
    const starred = state.allWords.filter(w => state.starredIds.has(w.id));
    if (starred.length === 0) {
      alert('You have not bookmarked any words yet! Click the star icon on any card to add it to your study list.');
      return;
    }

    const blob = new Blob([JSON.stringify(starred, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts_bookmarked_words_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // -----------------------------------------------------------
  // UTILITY
  // -----------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM load
  document.addEventListener('DOMContentLoaded', init);
})();
