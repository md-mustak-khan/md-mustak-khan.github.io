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
      titleBn: 'সব শব্দ (২,৯৪০টি)',
      titleEn: 'All Words (2,940)',
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
    },
  };

  function updateCategoryGuide(cat) {
    const guide = categoryGuides[cat] || categoryGuides['all'];
    const badgeEl = document.getElementById('catGuideBadge');
    const focusEl = document.getElementById('catGuideFocus');
    const descEl = document.getElementById('catGuideDesc');

    if (badgeEl) {
      badgeEl.innerHTML = `<i class="fa-solid ${guide.icon}"></i> <span>${guide.titleEn}</span>`;
    }
    if (focusEl) {
      focusEl.textContent = guide.focusEn;
    }
    if (descEl) {
      descEl.textContent = guide.descEn;
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
            <span style="font-size: 0.8rem; color: #fca5a5;">Your answer: <em>${escapeHtml(m.chosen)}</em></span>
          </div>
          <div style="color: #6ee7b7; font-size: 0.9rem;">
            <i class="fa-solid fa-check"></i> Correct: <strong>${escapeHtml(m.correct)}</strong>
          </div>
          ${m.meaning_bn ? `<div style="color: #7dd3fc; font-size: 0.85rem;" class="bn-font">বাংলা: ${escapeHtml(m.meaning_bn)}</div>` : ''}
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
          <span>Excellent! <strong>${escapeHtml(state.spellingWord.word)}</strong> is correct!</span>
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
            <span>Incorrect spelling! (<em>"${escapeHtml(input.value.trim())}"</em>)</span>
          </div>
          <div class="wrong-query-line">
            <span>Would you like to reveal the correct answer? / আপনি কি সঠিক উত্তরটি দেখতে চান?</span>
          </div>
          <div class="wrong-action-row">
            <button type="button" class="btn-reveal-spelling" id="btnRevealSpellingAnswer">
              <i class="fa-solid fa-eye"></i> Reveal Answer / উত্তর দেখুন
            </button>
            <button type="button" class="btn-retry-spelling" id="btnRetrySpelling">
              <i class="fa-solid fa-rotate-left"></i> Try Again / আবার চেষ্টা করুন
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
          <span>Correct Answer & Pronunciation / সঠিক উত্তর:</span>
        </div>
        <div class="revealed-word-box">
          <span class="revealed-word-title">${escapeHtml(state.spellingWord.word)}</span>
          <button type="button" class="pronounce-btn" id="btnSpellingListenRevealed" title="Listen Pronunciation">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
        ${state.spellingWord.meaning_bn ? `<div class="revealed-meta card-bangla-meaning"><i class="fa-solid fa-language"></i> বাংলা অর্থ: <strong>${escapeHtml(state.spellingWord.meaning_bn)}</strong></div>` : ''}
        ${state.spellingWord.meaning_en ? `<div class="revealed-meta"><i class="fa-solid fa-book"></i> Meaning: ${escapeHtml(state.spellingWord.meaning_en)}</div>` : ''}
        <div class="revealed-actions-row">
          <button type="button" class="spelling-next-btn" id="btnSpellingNextRevealed">
            Next Word / পরবর্তী শব্দ <i class="fa-solid fa-arrow-right"></i>
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
