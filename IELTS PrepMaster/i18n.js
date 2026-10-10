/**
 * IELTS PREPMASTER - BILINGUAL (BENGALI & ENGLISH) TRANSLATION ENGINE
 * Default Language: Bengali ('bn')
 * International / Non-Bengali Mode: English ('en')
 * Author & Developer: Md. Mustak Khan, Chittagong, Bangladesh
 */

(function () {
  'use strict';

  const translations = {
    bn: {
      // Document Metadata
      page_title: 'সম্পূর্ণ ফ্রি IELTS রিসোর্স ও মাস্টার প্রিপারেশন হাব | IELTS PrepMaster',

      // Top Notice Strip
      top_creator: 'Md. Mustak Khan',
      top_words_count: '২,৯৪০টি শব্দার্থ ড্রিল',
      top_books_count: '৪০টি মূল বই',
      top_calc_badge: 'ব্যান্ড ৯ ক্যালকুলেটর',
      
      // Brand
      brand_title: 'IELTS PrepMaster',
      brand_subtitle: 'Band 9 Preparation Suite',
      
      // Navigation Pillars
      pillar_home: 'হোম হাব',
      pillar_tests: 'ক্যামব্রিজ টেস্ট (৪০)',
      pillar_vocab: 'ভোকাবুলারি (২,৯৪০)',
      pillar_guide: 'A to Z গাইড',
      pillar_resources: 'অনলাইন রিসোর্স (৪৪)',
      pillar_library: 'বই লাইব্রেরি (৪০)',
      pillar_calculator: 'ব্যান্ড ক্যালকুলেটর',

      // Header Actions
      search_placeholder_short: 'খুঁজুন...',
      search_btn_text: 'খুঁজুন...',
      streak_days_suffix: 'দিন',
      drill_practice: 'ড্রিল প্র্যাকটিস',
      drill_practice_title: 'ভোকাবুলারি ড্রিল শুরু করুন',
      lang_btn: 'বাং',
      lang_toggle_title: 'ভাষা পরিবর্তন / Switch Language (বাং / EN)',
      theme_toggle_title: 'ডার্ক / লাইট থিম পরিবর্তন',
      fullscreen_toggle_title: 'ফুলস্ক্রিন মোড',
      drawer_lang_btn: 'Language: English',
      menu_title: 'মেনু খুলুন',

      // Context Sub-Bars
      home_subbar_tag: 'অল-ইন-ওয়ান ব্যান্ড ৯ প্রস্তুতি প্ল্যাটফর্ম • ৪টি মূল সেকশন ও ফিচার হাব',
      home_subbar_vocab: 'ভোকাবুলারি',
      home_subbar_guide: 'গাইডলাইন',
      home_subbar_library: '৪০ বই',
      home_subbar_calc: 'ক্যালকুলেটর',
      res_subbar_text: 'ইন্টারনেট সেরা ৪৪+ ফ্রি IELTS অনলাইন প্রিপারেশন রিসোর্স ও এক্সামিনার পোর্টাল',
      res_chip_listening: '১৮৪ লিসেনিং টেস্ট',
      res_chip_reading: '৩২৫ রিডিং টেস্ট',
      res_chip_writing: '২৪৮ মডেল এসে',
      library_subbar_text: 'ওয়ার্কস্পেসের ৪০টি সম্পূর্ণ মূল বই ও ডিজিটাল ম্যাটেরিয়ালস সংরক্ষিত',
      calc_subbar_text: 'অফিশিয়াল IELTS Band Score ক্যালকুলেটর ও কনভার্টার (IDP & Cambridge স্ট্যান্ডার্ড)',

      // Hero Section
      hero_badge: 'অল-ইন-ওয়ান ব্যান্ড ৯ প্রস্তুতি প্ল্যাটফর্ম',
      hero_title_1: 'সম্পূর্ণ ফ্রি',
      hero_title_2: 'রিসোর্স ও',
      hero_title_3: 'মাস্টার',
      hero_title_4: 'প্রিপারেশন হাব',
      hero_headline_html: 'সম্পূর্ণ ফ্রি <span class="highlight-red">IELTS</span> রিসোর্স ও<br>মাস্টার <span class="highlight-red">প্রিপারেশন হাব</span>',
      hero_creator_prefix: 'প্রস্তুতকারক:',
      hero_website: 'ওয়েবসাইট',
      hero_email: 'ইমেইল',
      hero_sub_desc: '২,৯৪০টি শব্দার্থের ইন্টারেক্টিভ ড্রিল, ৪০টি মূল পিডিএফ বই, পরীক্ষকদের ব্যান্ড রুব্রিক্স এবং ইনস্ট্যান্ট স্কোর কনভার্টার — IELTS পরীক্ষার্থীদের জন্য সম্পূর্ণ উন্মুক্ত ও স্বয়ংসম্পূর্ণ প্রস্তুতি পোর্টাল।',
      btn_start_vocab: 'ভোকাবুলারি ড্রিল শুরু করুন',
      btn_hero_vocab: 'ভোকাবুলারি ড্রিল শুরু করুন',
      btn_hero_library: '৪০টি বই ও আর্কাইভ দেখুন',
      btn_open_guide: 'A to Z গাইড দেখুন',
      btn_collapse_hero: 'ব্যানার লুকান',
      hero_collapsed_badge: 'ব্যান্ড ৯ প্রস্তুতি',
      hero_collapsed_text: 'সম্পূর্ণ ফ্রি IELTS রিসোর্স ও মাস্টার প্রিপারেশন হাব — ২,৯৪০ ভোকাবুলারি, ৪০টি মূল বই, A to Z গাইডলাইন ও ব্যান্ড ক্যালকুলেটর | Md. Mustak Khan, Chittagong',
      hero_collapsed_text_html: '<strong>সম্পূর্ণ ফ্রি IELTS রিসোর্স ও মাস্টার প্রিপারেশন হাব</strong> — ২,৯৪০ ভোকাবুলারি, ৪০টি মূল বই, A to Z গাইডলাইন ও ব্যান্ড ক্যালকুলেটর | Md. Mustak Khan, Chittagong',
      btn_expand_hero: 'ব্যানার দেখুন',
      hero_faq_title: 'Hi! How can we help your prep?',
      hero_faq_pill_1: 'বাংলা অর্থসহ ২,৯৪০ শব্দ শিখতে চান?',
      hero_faq_pill_2: 'ব্যান্ড ৯ রাইটিং ও স্পিকিং গাইডলাইন দরকার?',
      hero_faq_pill_3: 'মুনজেরিন শহীদ ও মাক্কার ২০২৫ বই পড়তে চান?',
      hero_faq_pill_4: 'র-স্কোর থেকে অফিশিয়াল ব্যান্ড হিসাব করবেন?',

      // Home Hub Modules
      hub_stat_vocab_num: '২,৯৪০',
      hub_stat_vocab_lbl: 'ভোকাবুলারি ও ড্রিলস',
      hub_stat_guide_num: '৫টি মডিউল',
      hub_stat_guide_lbl: 'A to Z মাস্টার গাইড',
      hub_stat_books_num: '৪০টি বই',
      hub_stat_books_lbl: 'ডিজিタル লাইব্রেরি',
      hub_stat_res_num: '৪৪টি',
      hub_stat_res_lbl: 'অনলাইন রিসোর্স',
      hub_stat_calc_num: 'Band 9.0',
      hub_stat_calc_lbl: 'অফিশিয়াল ক্যালকুলেটর',
      hub_sec_title: 'প্রধান সেকশন ও গুরুত্বপূর্ণ সুবিধাসমূহ',
      hub_sec_sub: 'যেকোনো সেকশনে এক ক্লিকে যেতে নিচের কার্ডে ক্লিক করুন অথবা সরাসরি প্রয়োজনীয় ফিচার ওপেন করুন',
      hub_search_placeholder: 'প্ল্যাটফর্মে যেকোনো কিছু খুঁজুন...',
      
      // Gateway Cards
      card_vocab_badge: '২,৯৪০ শব্দার্থ • বাংলা অর্থসহ',
      card_vocab_title: '১. ভোকাবুলারি ও ইন্টারেক্টিভ ড্রিলস হাব',
      card_vocab_desc: 'Reading Vocab, IELTS Advantage 50, Task 1 Trends, 800 Idioms এবং Map Directions সহ ২,৯৪০টি ভেরিফাইড শব্দার্থ বাংলা অর্থ ও সিনোনিম সহ মাস্টার করুন।',
      card_vocab_btn: 'ভোকাবুলারি ড্রিল খুলুন',

      card_guide_badge: 'অফিশিয়াল ফরম্যাট ও পরীক্ষকদের রুব্রিক্স',
      card_guide_title: '২. সম্পূর্ণ A to Z কমপ্লিট মাস্টার গাইডলাইন',
      card_guide_desc: 'একাডেমিক ও জিটি ফরম্যাট, র-স্কোর কনভার্সন টেবিল, পরীক্ষকদের ব্যান্ড রুব্রিক্স এবং ৩০/৬০/৯০ দিনের রোডম্যাপ।',
      card_guide_btn: 'মাস্টার গাইডলাইন পড়ুন',

      card_resources_badge: 'বিশ্বের সেরা ভেরিফাইড পোর্টাল',
      card_resources_title: '৩. বিশ্বসেরা ৪৪+ অনলাইন রিসোর্স হাব',
      card_resources_desc: 'মিনি-আইইএলটিএস, ক্যাম্বলি, ব্রিটিশ কাউন্সিল, লিজ, আইইএলটিএসনেক্সট এবং ক্যামব্রিজ ১-২১ প্র্যাকটিস টেস্ট লিংক।',
      card_resources_btn: 'অনলাইন রিসোর্স দেখুন',

      card_library_badge: '৪০টি মূল বই সংরক্ষিত',
      card_library_title: '৪. ডিজিটাল IELTS ম্যাটেরিয়ালস লাইব্রেরি',
      card_library_desc: 'ক্যামব্রিজ ১০-২০ একাডেমিক বই, সাইফুর্স ভোকাবুলারি, মুনজেরিন শহীদ এবং মাক্কার ২০২৫ কিউ-কার্ড সরাসরি পড়ুন।',
      card_library_btn: 'পিডিএফ লাইব্রেরি খুলুন',

      card_calc_badge: 'আইডিপি ও ক্যামব্রিজ স্ট্যান্ডার্ড',
      card_calc_title: '৫. অফিশিয়াল ব্যান্ড স্কোর ক্যালকুলেটর',
      card_calc_desc: 'লিসেনিং ও রিডিং এর র-স্কোর (০-৪০) থেকে তাৎক্ষণিকভাবে অফিশিয়াল আইইএলটিএস ব্যান্ড স্কোরে রূপান্তর করুন।',
      card_calc_btn: 'ব্যান্ড স্কোর হিসাব করুন',

      // Feature Tags
      feat_flashcards: '৩D ফ্ল্যাশকার্ড অ্যারেনা',
      feat_quiz: 'কুইজ চ্যালেঞ্জ',
      feat_spelling: 'লিসেনিং ও বানান ড্রিল',
      feat_bookmarks: 'বুকমার্ক ও মাস্টারি ট্র্যাক',
      feat_pronounce: 'অডিও প্রোনাউন্সিয়েশন',
      feat_export: 'JSON এক্সপোর্ট',
      feat_ac_gt: 'AC vs GT পার্থক্য',
      feat_timing: 'টাইমিং ও টেস্ট ফরম্যাট',
      feat_rubrics: 'ব্যান্ড রুব্রিক্স বিশ্লেষণ',
      feat_roadmaps: '৩০/৬০/৯০ দিন রোডম্যাপ',
      feat_traps: 'কমন ভুল ও ট্রিকি ফাঁদ',
      quick_jump_label: 'সরাসরি যান:',

      // Word of the Day Widget
      wotd_title: 'আজকের নির্বাচিত শব্দ',
      wotd_badge: 'Word of the Day',
      wotd_next: 'পরবর্তী শব্দ',
      wotd_practice_btn: 'সম্পূর্ণ ভোকাবুলারি তালিকায় যান',

      // Quick Band Lookup Widget
      quick_band_title: 'কুইক ব্যান্ড স্কোর লুকআপ',
      quick_band_desc: 'র-স্কোর এবং তার সমতুল্য অফিসিয়াল আইইএলটিএস ব্যান্ড:',
      quick_band_btn: 'পূর্ণাঙ্গ ক্যালকুলেটরে যান',

      // Vocab Section
      vocab_hero_title: 'মাস্টার করুন <span>২,৯৪০টি আইইএলটিএস শব্দ</span> বাংলা ও প্রসঙ্গ সহ',
      vocab_hero_desc: 'ক্যামব্রিজ ১৮, ১৯ এবং রিডিং প্যাসেজ সমৃদ্ধ Reading Vocab (১,৭৯৪টি), IELTS Advantage Top 50 প্যারাফ্রেজিং, Writing Task 1 ট্রেন্ডস, 800 American Idioms এবং Band 8 Map Directions সম্বলিত ভেরিফাইড ডাটাবেস।',
      vocab_stat_total: 'মোট শব্দার্থ',
      vocab_stat_modules: 'কোর মডিউল',
      vocab_stat_bangla: 'বাংলা অর্থসহ',
      vocab_stat_map: 'ম্যাপ ও ডিরেকশন টার্মস',
      tab_browse: 'শব্দতালিকা ব্রাউজ',
      tab_flashcards: '৩ডি ফ্ল্যাশ কার্ডস',
      tab_quiz: 'কুইজ অ্যারেনা',
      tab_spelling: 'স্পেলিং ড্রিল',
      search_vocab_placeholder: 'শব্দ, অর্থ বা ক্যাটাগরি খুঁজুন (যেমন: Cambridge, Environment, Academic)...',
      all_categories: 'সব ক্যাটাগরি',
      filter_all_words: 'সব শব্দ',
      filter_starred: 'বুকমার্ক করা',
      filter_mastered: 'আয়ত্ত করা',
      filter_bangla: 'বাংলা অর্থসহ',
      btn_flip_card: 'কার্ড উল্টান (স্পেসবার)',
      btn_next_card: 'পরবর্তী কার্ড',
      btn_prev_card: 'পূর্ববর্তী কার্ড',
      btn_spelling_check: 'উত্তর যাচাই করুন',
      spelling_placeholder: 'সঠিক বানানটি লিখুন...',

      // Guide Section
      guide_hero_title: 'সম্পূর্ণ <span>A to Z IELTS মাস্টার গাইডলাইন</span>',
      guide_hero_sub: 'ব্যান্ড ৭.৫ থেকে ৯.০ অর্জনের জন্য অফিসিয়াল ফরম্যাট, র-স্কোর কনভার্সন টেবিল, পরীক্ষকদের রুব্রিক্স এবং হাই-ইল্ড মডিউল স্ট্র্যাটেজি।',
      guide_tab_format: '১. পরীক্ষার ফরম্যাট ও টাইমিং',
      guide_tab_rubrics: '২. এক্সামিনার ব্যান্ড রুব্রিক্স',
      guide_tab_prep: '৩. ব্যান্ড ৯ প্রিপারেশন রোডম্যাপ',
      guide_tab_traps: '৪. ট্রিকি ফাঁদ ও ভুলসমূহ',

      // Calculator Section
      calc_hero_title: 'Official IELTS Band Score Calculator & Converter',
      calc_hero_sub: 'আইডিপি ও ক্যামব্রিজ ইংলিশ গ্রেডিং স্ট্যান্ডার্ড অনুযায়ী তাৎক্ষণিক র-স্কোর থেকে ব্যান্ড স্কোর রূপান্তর।',
      calc_input_title: 'র-স্কোর ইনপুট',
      calc_listening_label: 'Listening র-স্কোর (০-৪০)',
      calc_reading_acad: 'Academic Reading (০-৪০)',
      calc_reading_gt: 'General Reading (০-৪০)',
      calc_writing_label: 'Writing ব্যান্ড (০-৯)',
      calc_speaking_label: 'Speaking ব্যান্ড (০-৯)',
      calc_overall_title: 'আপনার সম্ভাব্য ওভারঅল ব্যান্ড স্কোর',

      // Library Section
      lib_hero_title: 'ডিজিটাল IELTS ম্যাটেরিয়ালস লাইব্রেরি',
      lib_hero_sub: 'আপনার ফোল্ডারে থাকা ৪০টি মূল বই ও প্রস্তুতি সহায়ক পিডিএফ — অফিসিয়াল প্র্যাকটিস বুকস, ভোকাবুলারি, রাইটিং গাইড ও স্পিকিং কিউ কার্ড।',
      lib_search_placeholder: 'বই বা ডকুমেন্টের নাম দিয়ে ফিল্টার করুন (যেমন: Cambridge 18, Makkar, Idioms)...',
      lib_total_label: 'পিডিএফ বই সংরক্ষিত',
      btn_read_pdf: 'পড়ুন',

      // Resources Section
      res_hero_title: 'বিশ্বসেরা ৪৪+ ফ্রি অনলাইন IELTS রিসোর্স হাব',
      res_hero_sub: 'লিসেনিং, রিডিং, রাইটিং, স্পিকিং, ভোকাবুলারি, পডকাস্ট ও আন্তর্জাতিক এক্সামিনারদের সেরা পোর্টালসমূহের একীভূত উন্মুক্ত ডিরেক্টরি।',
      res_pill_all: 'সব রিসোর্স',
      res_pill_listening: 'লিসেনিং',
      res_pill_reading: 'রিডিং',
      res_pill_writing: 'রাইটিং',
      res_pill_speaking: 'স্পিকিং',
      res_pill_media: 'অডিও/ভিডিও',
      res_pill_portals: 'সেরা পোর্টাল',
      res_search_placeholder: 'রিসোর্স খুঁজুন (যেমন: Mini-IELTS, Cambly, Liz, IELTSNext)...',
      btn_visit_resource: 'ভিজিট করুন',

      // Drawer & Search Modal
      drawer_streak_title: 'দিন একটানা প্রস্তুতি!',
      drawer_streak_sub: 'প্রতিদিন অন্তত ১টি টেস্ট বা ২০টি শব্দ শিখুন',
      drawer_search: 'গ্লোবাল সার্চ (Ctrl+K)',
      drawer_theme: 'ডার্ক / লাইট মোড',
      search_modal_placeholder: '২,৯৪০ শব্দার্থ, প্রস্তুতি গাইড বা ৪০টি মূল বই খুঁজুন... (যেমন: Academic, Band 7, Makkar)',
      search_clear_title: 'মুছে ফেলুন',
      search_close_title: 'বন্ধ করুন (Esc)',
      search_filter_all: 'সব কিছু (All)',
      search_type_prompt: 'কী খুঁজতে চান টাইপ করুন',
      search_popular_label: 'জনপ্রিয়:',
      shortcut_navigate: 'নেভিগেট',
      shortcut_open: 'ওপেন করুন',
      shortcut_close: 'বন্ধ করুন',

      // Toasts
      toast_switched_en: 'Switched to Non-Bengali Mode (English)',
      toast_switched_bn: 'বাংলা মোডে পরিবর্তন করা হয়েছে',

      // Footer
      footer_desc: '২,৯৪০+ ভোকাবুলারি, ৪০টি মূল বইয়ের ডিজিটাল লাইব্রেরি, এ টু জেড গাইডলাইন এবং ইনস্ট্যান্ট ব্যান্ড স্কোর কনভার্টার সমন্বিত একটি সম্পূর্ণ উন্মুক্ত ব্যান্ড ৯ প্রস্তুতি প্ল্যাটফর্ম।',
      footer_creator_tag: 'পরিকল্পনা ও উন্নয়ন',
      footer_rights: '© ২০২৬ IELTS PrepMaster • সর্বস্বত্ব সংরক্ষিত।',
      footer_credit: 'পরিকল্পনা ও নির্মাণে: Md. Mustak Khan, চট্টগ্রাম, বাংলাদেশ।'
    },

    en: {
      // Document Metadata
      page_title: 'Free IELTS Resources & Band 9 Master Preparation Hub | IELTS PrepMaster',

      // Top Notice Strip
      top_creator: 'Md. Mustak Khan',
      top_words_count: '2,940 Vocab Drills',
      top_books_count: '40 Master Books',
      top_calc_badge: 'Band 9 Calculator',
      
      // Brand
      brand_title: 'IELTS PrepMaster',
      brand_subtitle: 'Band 9 Preparation Suite',
      
      // Navigation Pillars
      pillar_home: 'Home Hub',
      pillar_tests: 'Cambridge Tests (40)',
      pillar_vocab: 'Vocabulary (2,940)',
      pillar_guide: 'A to Z Guide',
      pillar_resources: 'Online Resources (44)',
      pillar_library: 'Book Library (40)',
      pillar_calculator: 'Band Calculator',

      // Header Actions
      search_placeholder_short: 'Search...',
      search_btn_text: 'Search...',
      streak_days_suffix: 'Days',
      drill_practice: 'Practice Drills',
      drill_practice_title: 'Start Vocabulary Drills',
      lang_btn: 'EN',
      lang_toggle_title: 'Switch Language / ভাষা পরিবর্তন (EN / বাং)',
      theme_toggle_title: 'Toggle Dark / Light Theme',
      fullscreen_toggle_title: 'Toggle Fullscreen',
      drawer_lang_btn: 'Language: বাংলা',
      menu_title: 'Open Menu',

      // Context Sub-Bars
      home_subbar_tag: 'All-in-One Band 9 Preparation Platform • 4 Core Sections & Feature Hub',
      home_subbar_vocab: 'Vocabulary',
      home_subbar_guide: 'Guidelines',
      home_subbar_library: '40 Books',
      home_subbar_calc: 'Calculator',
      res_subbar_text: "Internet's Best 44+ Free IELTS Online Preparation Resources & Examiner Portals",
      res_chip_listening: '184 Listening Tests',
      res_chip_reading: '325 Reading Tests',
      res_chip_writing: '248 Model Essays',
      library_subbar_text: '40 Complete Authentic Master Books & Digital Materials Preserved',
      calc_subbar_text: 'Official IELTS Band Score Calculator & Converter (IDP & Cambridge Standard)',

      // Hero Section
      hero_badge: 'ALL-IN-ONE BAND 9 PREPARATION PLATFORM',
      hero_title_1: 'Completely Free',
      hero_title_2: 'IELTS Resources &',
      hero_title_3: 'Master',
      hero_title_4: 'Preparation Hub',
      hero_headline_html: 'Completely Free <span class="highlight-red">IELTS</span> Resources &<br>Master <span class="highlight-red">Preparation Hub</span>',
      hero_creator_prefix: 'Author & Developer:',
      hero_website: 'Website',
      hero_email: 'Email',
      hero_sub_desc: '2,940 interactive vocabulary drills, 40 authentic PDF master books, official Band 9 examiner rubrics, and instant score converter — a comprehensive self-study portal for IELTS candidates.',
      btn_start_vocab: 'Start Vocabulary Drills',
      btn_hero_vocab: 'Start Vocabulary Drills',
      btn_hero_library: 'Explore 40 Books & Archive',
      btn_open_guide: 'Explore A to Z Guide',
      btn_collapse_hero: 'Hide Banner',
      hero_collapsed_badge: 'Band 9 Suite',
      hero_collapsed_text: 'Complete Free IELTS Resources & Master Preparation Hub — 2,940 Vocab, 40 PDF Books, A to Z Guidelines & Calculator | Md. Mustak Khan',
      hero_collapsed_text_html: '<strong>Complete Free IELTS Resources & Master Preparation Hub</strong> — 2,940 Vocab, 40 PDF Books, A to Z Guidelines & Calculator | Md. Mustak Khan',
      btn_expand_hero: 'View Banner',
      hero_faq_title: 'Hi! How can we help your prep?',
      hero_faq_pill_1: 'Want to master 2,940 vocabulary words with drills?',
      hero_faq_pill_2: 'Need official Band 9 Writing & Speaking guidelines?',
      hero_faq_pill_3: 'Want to read Cambridge & Makkar 2025 books?',
      hero_faq_pill_4: 'Calculate official band score from raw scores?',

      // Home Hub Modules
      hub_stat_vocab_num: '2,940',
      hub_stat_vocab_lbl: 'Vocabulary & Drills',
      hub_stat_guide_num: '5 Modules',
      hub_stat_guide_lbl: 'A to Z Master Guide',
      hub_stat_books_num: '40 Books',
      hub_stat_books_lbl: 'Digital Library',
      hub_stat_res_num: '44 Sites',
      hub_stat_res_lbl: 'Online Resources',
      hub_stat_calc_num: 'Band 9.0',
      hub_stat_calc_lbl: 'Official Calculator',
      hub_sec_title: 'Core Study Pillars & Features',
      hub_sec_sub: 'Click any card below to jump directly into your targeted study module',
      hub_search_placeholder: 'Search anything across platform...',
      
      // Gateway Cards
      card_vocab_badge: '2,940 Vocabulary • Interactive Drills',
      card_vocab_title: '1. Vocabulary & Interactive Drills Hub',
      card_vocab_desc: 'Master 2,940 high-yield vocabulary items curated from Reading Vocab, IELTS Advantage 50, Task 1 Trends, 800 Idioms, and Map Directions with full audio and definitions.',
      card_vocab_btn: 'Open Vocabulary Drills',

      card_guide_badge: 'Official Format & Examiner Scoring Rubrics',
      card_guide_title: '2. Complete A to Z IELTS Master Guidelines',
      card_guide_desc: 'Official exam timing, AC vs GT formats, raw score conversion tables, band descriptor criteria (TR, CC, LR, GRA), and 30/60/90-day study roadmaps.',
      card_guide_btn: 'Read Master Guidelines',

      card_resources_badge: "World's Best Verified Preparation Portals",
      card_resources_title: "3. World's Top 44+ Online Resources Hub",
      card_resources_desc: 'One-click access to verified portals for Mini-IELTS, Cambly, British Council, Liz, IELTSNext, and Cambridge 1-21 online interactive mock tests.',
      card_resources_btn: 'Explore Online Resources',

      card_library_badge: '40 Authentic Digital Books Preserved',
      card_library_title: '4. Digital IELTS Materials & Books Library',
      card_library_desc: 'Authentic Cambridge 10-20 Academic books, Makkar Speaking cue cards, grammar references, and reading magazines in full high-quality PDF.',
      card_library_btn: 'Open PDF Library',

      card_calc_badge: 'IDP & Cambridge English Grading Standard',
      card_calc_title: '5. Official Band Score Calculator & Converter',
      card_calc_desc: 'Instant raw score (0-40) to band score conversion with overall round-off logic compliant with official IDP and Cambridge English guidelines.',
      card_calc_btn: 'Calculate Band Score',

      // Feature Tags
      feat_flashcards: '3D Flashcard Arena',
      feat_quiz: 'Quiz Challenge',
      feat_spelling: 'Listening & Spelling Drills',
      feat_bookmarks: 'Bookmarks & Mastery Tracking',
      feat_pronounce: 'Audio Pronunciation',
      feat_export: 'JSON Export',
      feat_ac_gt: 'AC vs GT Differences',
      feat_timing: 'Timing & Structure',
      feat_rubrics: 'Band Descriptor Rubrics',
      feat_roadmaps: '30/60/90-Day Roadmaps',
      feat_traps: 'Common Traps & Pitfalls',
      quick_jump_label: 'Quick Jump:',

      // Word of the Day Widget
      wotd_title: 'Selected Word of the Day',
      wotd_badge: 'Word of the Day',
      wotd_next: 'Next Word',
      wotd_practice_btn: 'View Complete Vocabulary Bank',

      // Quick Band Lookup Widget
      quick_band_title: 'Quick Band Score Lookup',
      quick_band_desc: 'Raw score thresholds compliant with IDP & Cambridge English standards:',
      quick_band_btn: 'Open Full Calculator',

      // Vocab Section
      vocab_hero_title: 'Master <span>2,940 IELTS Words</span> with Context & Drills',
      vocab_hero_desc: 'Complete vocabulary database extracted from Cambridge 18, 19, Academic Reading Vocab (1,794), IELTS Advantage Top 50 Paraphrasing, Writing Task 1 Trends, 800 American Idioms, and Band 8 Map Directions.',
      vocab_stat_total: 'Total Vocabulary',
      vocab_stat_modules: 'Core Modules',
      vocab_stat_bangla: 'Definitions Available',
      vocab_stat_map: 'Map & Direction Terms',
      tab_browse: 'Browse Word Bank',
      tab_flashcards: '3D Flashcards',
      tab_quiz: 'Quiz Arena',
      tab_spelling: 'Spelling Drills',
      search_vocab_placeholder: 'Search words, definitions, or categories (e.g., Cambridge, Environment, Academic)...',
      all_categories: 'All Categories',
      filter_all_words: 'All Words',
      filter_starred: 'Starred',
      filter_mastered: 'Mastered',
      filter_bangla: 'Has Definitions',
      btn_flip_card: 'Flip Card (Spacebar)',
      btn_next_card: 'Next Card',
      btn_prev_card: 'Previous Card',
      btn_spelling_check: 'Check Answer',
      spelling_placeholder: 'Type the correct spelling...',

      // Guide Section
      guide_hero_title: 'Complete <span>A to Z IELTS Master Guidelines</span>',
      guide_hero_sub: 'Official exam structures, raw-to-band conversion matrices, examiner scoring criteria, and high-yield preparation roadmaps for Band 7.5 to 9.0.',
      guide_tab_format: '1. Test Format & Timing',
      guide_tab_rubrics: '2. Examiner Band Rubrics',
      guide_tab_prep: '3. Band 9 Preparation Roadmap',
      guide_tab_traps: '4. Common Pitfalls & Traps',

      // Calculator Section
      calc_hero_title: 'Official IELTS Band Score Calculator & Converter',
      calc_hero_sub: 'Instant raw-to-band conversion compliant with IDP, British Council, and Cambridge English grading standards.',
      calc_input_title: 'Raw Score Inputs',
      calc_listening_label: 'Listening Raw Score (0-40)',
      calc_reading_acad: 'Academic Reading (0-40)',
      calc_reading_gt: 'General Reading (0-40)',
      calc_writing_label: 'Writing Band (0-9)',
      calc_speaking_label: 'Speaking Band (0-9)',
      calc_overall_title: 'Your Estimated Overall Band Score',

      // Library Section
      lib_hero_title: 'Digital IELTS Materials & PDF Library',
      lib_hero_sub: '40 authentic PDF books in your library — Official Cambridge Practice Tests, vocabulary compilations, writing templates, and speaking cue cards.',
      lib_search_placeholder: 'Filter by book name or category (e.g., Cambridge 18, Makkar, Idioms)...',
      lib_total_label: 'PDF Books Preserved',
      btn_read_pdf: 'Read PDF',

      // Resources Section
      res_hero_title: 'World Top 44+ Free Online IELTS Resources Hub',
      res_hero_sub: 'Curated directory of top portals for Listening, Reading, Writing, Speaking, Vocabulary, Podcasts, and Cambridge 1-21 online mocks.',
      res_pill_all: 'All Resources',
      res_pill_listening: 'Listening',
      res_pill_reading: 'Reading',
      res_pill_writing: 'Writing',
      res_pill_speaking: 'Speaking',
      res_pill_media: 'Audio / Video',
      res_pill_portals: 'Top Portals',
      res_search_placeholder: 'Search resources (e.g., Mini-IELTS, Cambly, Liz, IELTSNext)...',
      btn_visit_resource: 'Visit Portal',

      // Drawer & Search Modal
      drawer_streak_title: 'Days Active Streak!',
      drawer_streak_sub: 'Learn at least 20 words or 1 test daily',
      drawer_search: 'Global Search (Ctrl+K)',
      drawer_theme: 'Dark / Light Theme',
      search_modal_placeholder: 'Search 2,940 vocabulary words, prep guides, or 40 books... (e.g., Academic, Band 7, Makkar)',
      search_clear_title: 'Clear search',
      search_close_title: 'Close (Esc)',
      search_filter_all: 'All Items',
      search_type_prompt: 'Type to search anything',
      search_popular_label: 'Popular:',
      shortcut_navigate: 'Navigate',
      shortcut_open: 'Open',
      shortcut_close: 'Close',

      // Toasts
      toast_switched_en: 'Switched to Non-Bengali Mode (English)',
      toast_switched_bn: 'বাংলা মোডে পরিবর্তন করা হয়েছে',

      // Footer
      footer_desc: 'An open-access Band 9 IELTS preparation platform featuring 2,940 vocabulary drills, 40 digital master books, comprehensive guidelines, and instant band calculators.',
      footer_creator_tag: 'Architect & Lead Developer',
      footer_rights: '© 2026 IELTS PrepMaster • All Rights Reserved.',
      footer_credit: 'Designed & Developed by Md. Mustak Khan, Chittagong, Bangladesh.'
    }
  };

  class IELTSLanguageEngine {
    constructor() {
      // Default language is Bengali ('bn') unless specified in localStorage
      let saved = null;
      try {
        saved = localStorage.getItem('ielts_lang');
      } catch (e) {}
      this.currentLang = (saved === 'en' || saved === 'bn') ? saved : 'bn';
    }

    init() {
      this.applyLanguage(this.currentLang, false);
      this.setupListeners();
    }

    t(key) {
      const dict = translations[this.currentLang] || translations.bn;
      return dict[key] || translations.bn[key] || key;
    }

    getLang() {
      return this.currentLang;
    }

    isEnglish() {
      return this.currentLang === 'en';
    }

    setLanguage(lang, notify = true) {
      if (lang !== 'bn' && lang !== 'en') lang = 'bn';
      this.currentLang = lang;
      try {
        localStorage.setItem('ielts_lang', lang);
      } catch (e) {}

      this.applyLanguage(lang, notify);

      // Trigger custom event for master.js & app modules
      window.dispatchEvent(new CustomEvent('ielts-lang-changed', { 
        detail: { 
          lang, 
          isEnglish: lang === 'en',
          t: (k) => this.t(k)
        } 
      }));
    }

    toggleLanguage() {
      const nextLang = this.currentLang === 'bn' ? 'en' : 'bn';
      this.setLanguage(nextLang, true);
    }

    applyLanguage(lang, notify = false) {
      document.documentElement.setAttribute('data-lang', lang);
      document.documentElement.lang = lang;
      const dict = translations[lang] || translations.bn;

      // Update document title
      if (dict.page_title) {
        document.title = dict.page_title;
      }

      // Update button indicators
      const indicator = document.getElementById('masterLangIndicator');
      if (indicator) {
        indicator.textContent = lang === 'bn' ? 'বাং' : 'EN';
      }

      const masterBtn = document.getElementById('masterLangToggle');
      if (masterBtn && dict.lang_toggle_title) {
        masterBtn.title = dict.lang_toggle_title;
      }

      const drawerLangText = document.getElementById('drawerLangText');
      if (drawerLangText) {
        drawerLangText.textContent = lang === 'bn' ? 'Language: English' : 'Language: বাংলা';
      }

      // Update all elements with data-i18n (text content)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
          el.textContent = dict[key];
        }
      });

      // Update elements with data-i18n-html (inner HTML)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
          el.innerHTML = dict[key];
        }
      });

      // Update input placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
          el.placeholder = dict[key];
        }
      });

      // Update element titles
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) {
          el.title = dict[key];
        }
      });

      // Show toast if requested
      if (notify && window.IELTSMaster && typeof window.IELTSMaster.showToast === 'function') {
        const toastMsg = lang === 'en' ? dict.toast_switched_en : dict.toast_switched_bn;
        window.IELTSMaster.showToast(toastMsg);
      }
    }

    setupListeners() {
      const btnToggle = document.getElementById('masterLangToggle');
      if (btnToggle) {
        // Remove existing listener clone if any
        btnToggle.replaceWith(btnToggle.cloneNode(true));
        const newBtn = document.getElementById('masterLangToggle');
        if (newBtn) {
          newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLanguage();
          });
        }
      }

      const drawerBtn = document.getElementById('drawerLangToggle');
      if (drawerBtn) {
        drawerBtn.replaceWith(drawerBtn.cloneNode(true));
        const newDrawerBtn = document.getElementById('drawerLangToggle');
        if (newDrawerBtn) {
          newDrawerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLanguage();
          });
        }
      }
    }
  }

  window.IELTS_TRANSLATIONS = translations;
  window.IELTS_I18N = new IELTSLanguageEngine();

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.IELTS_I18N.init());
  } else {
    window.IELTS_I18N.init();
  }
})();
