const fs = require('fs');
const path = require('path');

const srcHtml = fs.readFileSync('index.html', 'utf8');

// First let's create a backup of original index.html
if (!fs.existsSync('archive')) {
  fs.mkdirSync('archive');
}
fs.writeFileSync('archive/index_original_backup.html', srcHtml, 'utf8');
console.log('Backed up original index.html to archive/index_original_backup.html');

// Define extraction boundaries
const lines = srcHtml.split('\n');

// 1. Head & Top Header up to </header>
// Let's find </header>
let headerEndLine = -1;
for (let i = 0; i < 350; i++) {
  if (lines[i].includes('</header>')) {
    headerEndLine = i;
    break;
  }
}
console.log('Header ends at line:', headerEndLine + 1);

// 2. Hero Section from line after headerEndLine to before <main
let heroStartLine = headerEndLine + 1;
let mainStartLine = -1;
for (let i = 350; i < 400; i++) {
  if (lines[i].includes('<main class="main-content" id="mainContent">')) {
    mainStartLine = i;
    break;
  }
}
console.log('Main starts at line:', mainStartLine + 1);

// 3. Main end and Footer
let mainEndLine = -1;
for (let i = lines.length - 1; i >= 6000; i--) {
  if (lines[i].includes('</main>')) {
    mainEndLine = i;
    break;
  }
}
console.log('Main ends at line:', mainEndLine + 1);

// Pillar start lines
const pillarStarts = {};
lines.forEach((l, i) => {
  if (l.includes('<div class="pillar-container active" id="pillar-home">') || l.includes('id="pillar-home"')) pillarStarts.home = i;
  if (l.includes('id="pillar-vocab"')) pillarStarts.vocab = i;
  if (l.includes('id="pillar-guide"')) pillarStarts.guide = i;
  if (l.includes('id="pillar-resources"')) pillarStarts.resources = i;
  if (l.includes('id="pillar-library"')) pillarStarts.library = i;
  if (l.includes('id="pillar-calculator"')) pillarStarts.calculator = i;
});
console.log('Pillar starts:', pillarStarts);

// Extract content of each pillar:
// home: pillarStarts.home to pillarStarts.vocab - 1 (or find where pillar-home ends)
// Let's verify closing divs for each pillar
function getPillarContent(pillarId, startLine, nextStartLine) {
  let slice = lines.slice(startLine, nextStartLine).join('\n');
  return slice;
}

let homeContent = lines.slice(pillarStarts.home, pillarStarts.vocab).join('\n');
// In homeContent, remove Practice History tag:
homeContent = homeContent.replace(
  /<span class="feature-tag"><i class="fa-solid fa-clock-rotate-left"><\/i> <span class="lang-bn-only">স্কোর হিস্ট্রি ও প্রোগ্রেস লগ<\/span><span class="lang-en-only">Score History & Progress Log<\/span><\/span>\s*/g,
  ''
);

let vocabContent = lines.slice(pillarStarts.vocab, pillarStarts.guide).join('\n');
let guideContent = lines.slice(pillarStarts.guide, pillarStarts.resources).join('\n');
let resourcesContent = lines.slice(pillarStarts.resources, pillarStarts.library).join('\n');
let libraryContent = lines.slice(pillarStarts.library, pillarStarts.calculator).join('\n');
let calcContent = lines.slice(pillarStarts.calculator, mainEndLine).join('\n');

// In calcContent, remove Practice History & Score Log (#historyCard):
const historyCardRegex = /<!-- Practice History Log -->[\s\S]*?<div class="history-card" id="historyCard">[\s\S]*?<\/div>\s*<\/div>/;
// Let's check exact match for historyCard in calcContent:
const historyCardIndex = calcContent.indexOf('<div class="history-card" id="historyCard">');
if (historyCardIndex !== -1) {
  const historyCardEnd = calcContent.indexOf('</div>\n        </div>', historyCardIndex);
  if (historyCardEnd !== -1) {
    const toRemove = calcContent.slice(historyCardIndex, historyCardEnd + 6); // up to </div> of historyCard
    console.log('Found historyCard in calculator, length:', toRemove.length);
    calcContent = calcContent.replace(toRemove, '');
  } else {
    // try matching by </p>\s*</div>\s*</div>
    const pEnd = calcContent.indexOf('</p>', historyCardIndex);
    const div1 = calcContent.indexOf('</div>', pEnd);
    const div2 = calcContent.indexOf('</div>', div1 + 6);
    if (div2 !== -1) {
      const toRemove = calcContent.slice(historyCardIndex, div2 + 6);
      console.log('Found historyCard via secondary match, length:', toRemove.length);
      calcContent = calcContent.replace(toRemove, '');
    }
  }
}

// Clean up any remaining comment
calcContent = calcContent.replace(/<!-- Practice History Log -->\s*/g, '');

console.log('Sanitized home and calculator contents');

const pageConfigs = [
  {
    key: 'home',
    filename: 'index.html',
    title: 'সম্পূর্ণ ফ্রি IELTS রিসোর্স ও মাস্টার প্রিপারেশন হাব | IELTS PrepMaster',
    pillarContent: homeContent
  },
  {
    key: 'home_alias',
    filename: 'home.html',
    title: 'সম্পূর্ণ ফ্রি IELTS রিসোর্স ও মাস্টার প্রিপারেশন হাব | IELTS PrepMaster',
    pillarContent: homeContent
  },
  {
    key: 'vocab',
    filename: 'vocab.html',
    title: '২,৯৪০টি IELTS শব্দার্থ ড্রিল ও ভোকাবুলারি মাস্টার | IELTS PrepMaster',
    pillarContent: vocabContent
  },
  {
    key: 'guide',
    filename: 'guide.html',
    title: 'A to Z IELTS মাস্টার প্রস্তুতি গাইড ও কৌশল | IELTS PrepMaster',
    pillarContent: guideContent
  },
  {
    key: 'resources',
    filename: 'resources.html',
    title: '৪৪+ সেরা অনলাইন IELTS প্রস্তুতি রিসোর্স | IELTS PrepMaster',
    pillarContent: resourcesContent
  },
  {
    key: 'library',
    filename: 'library.html',
    title: '৪০টি মূল ক্যামব্রিজ ও IELTS বই লাইব্রেরি | IELTS PrepMaster',
    pillarContent: libraryContent
  },
  {
    key: 'calculator',
    filename: 'calculator.html',
    title: 'অফিশিয়াল IELTS Band Score ক্যালকুলেটর ও কনভার্টার | IELTS PrepMaster',
    pillarContent: calcContent
  }
];

// Base parts:
const headAndNavPart = lines.slice(0, headerEndLine + 1).join('\n');
const heroPart = lines.slice(headerEndLine + 1, mainStartLine + 1).join('\n');
const footerAndScriptsPart = lines.slice(mainEndLine).join('\n');

function buildPage(cfg) {
  const activeKey = (cfg.key === 'home_alias') ? 'home' : cfg.key;
  
  // 1. Process head & header
  let headerHtml = headAndNavPart;
  
  // Replace <title>
  headerHtml = headerHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${cfg.title}</title>`);
  
  // Set body data-page
  headerHtml = headerHtml.replace('<body>', `<body data-page="${activeKey}">`);
  
  // Center navigation links: update href and active class
  // Replace buttons with links that have href to the appropriate html file
  const navRegex = /<nav class="master-pillars-nav"[\s\S]*?<\/nav>/;
  const newNav = `<nav class="master-pillars-nav" id="masterPillarsNav" aria-label="Master Pillars">
        <a href="index.html" class="pillar-nav-btn ${activeKey === 'home' ? 'active' : ''}" data-pillar="home" id="pillarBtnHome">
          <i class="fa-solid fa-house"></i> <span data-i18n="pillar_home">হোম হাব</span>
        </a>
        <a href="vocab.html" class="pillar-nav-btn ${activeKey === 'vocab' ? 'active' : ''}" data-pillar="vocab" id="pillarBtnVocab">
          <i class="fa-solid fa-brain"></i> <span data-i18n="pillar_vocab">ভোকাবুলারি (২,৯৪০)</span>
        </a>
        <a href="guide.html" class="pillar-nav-btn ${activeKey === 'guide' ? 'active' : ''}" data-pillar="guide" id="pillarBtnGuide">
          <i class="fa-solid fa-compass"></i> <span data-i18n="pillar_guide">A to Z গাইড</span>
        </a>
        <a href="resources.html" class="pillar-nav-btn ${activeKey === 'resources' ? 'active' : ''}" data-pillar="resources" id="pillarBtnResources">
          <i class="fa-solid fa-globe"></i> <span data-i18n="pillar_resources">অনলাইন রিসোর্স (৪৪)</span>
        </a>
        <a href="library.html" class="pillar-nav-btn ${activeKey === 'library' ? 'active' : ''}" data-pillar="library" id="pillarBtnLibrary">
          <i class="fa-solid fa-book-bookmark"></i> <span data-i18n="pillar_library">বই লাইব্রেরি (৪০)</span>
        </a>
        <a href="calculator.html" class="pillar-nav-btn ${activeKey === 'calculator' ? 'active' : ''}" data-pillar="calculator" id="pillarBtnCalculator">
          <i class="fa-solid fa-calculator"></i> <span data-i18n="pillar_calculator">ব্যান্ড ক্যালকুলেটর</span>
        </a>
      </nav>`;
  headerHtml = headerHtml.replace(navRegex, newNav);

  // Update contextual toolbars visibility
  // 0. Home
  headerHtml = headerHtml.replace(
    'id="homeContextToolbar"',
    activeKey === 'home'
      ? 'id="homeContextToolbar" class="context-toolbar-content active" style="display: flex !important;"'
      : 'id="homeContextToolbar" class="context-toolbar-content" style="display: none !important;"'
  );
  // 1. Vocab
  headerHtml = headerHtml.replace(
    'id="vocabContextToolbar" style="display: none !important;"',
    activeKey === 'vocab'
      ? 'id="vocabContextToolbar" class="context-toolbar-content active" style="display: flex !important;"'
      : 'id="vocabContextToolbar" class="context-toolbar-content" style="display: none !important;"'
  );
  // 2. Guide
  headerHtml = headerHtml.replace(
    'id="guideContextToolbar" style="display: none !important;"',
    activeKey === 'guide'
      ? 'id="guideContextToolbar" class="context-toolbar-content active" style="display: flex !important;"'
      : 'id="guideContextToolbar" class="context-toolbar-content" style="display: none !important;"'
  );
  // 3. Resources
  headerHtml = headerHtml.replace(
    'id="resourcesContextToolbar" style="display: none !important;"',
    activeKey === 'resources'
      ? 'id="resourcesContextToolbar" class="context-toolbar-content active" style="display: flex !important;"'
      : 'id="resourcesContextToolbar" class="context-toolbar-content" style="display: none !important;"'
  );
  // 4. Library
  headerHtml = headerHtml.replace(
    'id="libraryContextToolbar" style="display: none !important;"',
    activeKey === 'library'
      ? 'id="libraryContextToolbar" class="context-toolbar-content active" style="display: flex !important;"'
      : 'id="libraryContextToolbar" class="context-toolbar-content" style="display: none !important;"'
  );
  // 5. Calculator
  headerHtml = headerHtml.replace(
    'id="calculatorContextToolbar" style="display: none !important;"',
    activeKey === 'calculator'
      ? 'id="calculatorContextToolbar" class="context-toolbar-content active" style="display: flex !important;"'
      : 'id="calculatorContextToolbar" class="context-toolbar-content" style="display: none !important;"'
  );

  // Update brand-group click
  headerHtml = headerHtml.replace(
    'onclick="window.IELTSMaster.switchPillar(\'home\')"',
    'onclick="window.location.href=\'index.html\'"'
  );

  // Update Drill Practice button in header
  headerHtml = headerHtml.replace(
    'onclick="window.IELTSMaster.startTestFromHero(\'vocab\')"',
    'onclick="window.location.href=\'vocab.html\'"'
  );

  // 2. Main content
  // Ensure the pillar container has active class and display style
  let pageContent = cfg.pillarContent;
  pageContent = pageContent.replace(`id="pillar-${activeKey}"`, `id="pillar-${activeKey}" class="pillar-container active" style="display: block; visibility: visible;"`);

  // If on home, update links on stat cards and gateway buttons to point to new files
  if (activeKey === 'home') {
    pageContent = pageContent.replace(/window\.IELTSMaster\.switchPillar\('vocab'\)/g, "window.location.href='vocab.html'");
    pageContent = pageContent.replace(/window\.IELTSMaster\.switchPillar\('guide'\)/g, "window.location.href='guide.html'");
    pageContent = pageContent.replace(/window\.IELTSMaster\.switchPillar\('library'\)/g, "window.location.href='library.html'");
    pageContent = pageContent.replace(/window\.IELTSMaster\.switchPillar\('resources'\)/g, "window.location.href='resources.html'");
    pageContent = pageContent.replace(/window\.IELTSMaster\.switchPillar\('calculator'\)/g, "window.location.href='calculator.html'");
  }

  // 3. Footer & Modals
  let footerHtml = footerAndScriptsPart;
  
  // Update mobile drawer links
  const drawerLinksRegex = /<div class="drawer-links">[\s\S]*?<\/div>/;
  const newDrawerLinks = `<div class="drawer-links">
        <a href="index.html" class="drawer-link-btn ${activeKey === 'home' ? 'active' : ''}" data-pillar="home">
          <i class="fa-solid fa-house"></i> <span><span class="lang-bn-only">হোম হাব</span><span class="lang-en-only">Home Hub</span></span>
        </a>
        <a href="vocab.html" class="drawer-link-btn ${activeKey === 'vocab' ? 'active' : ''}" data-pillar="vocab">
          <i class="fa-solid fa-brain"></i> <span><span class="lang-bn-only">Vocab & Drills (২,৯৪০)</span><span class="lang-en-only">Vocab & Drills (2,940)</span></span>
        </a>
        <a href="guide.html" class="drawer-link-btn ${activeKey === 'guide' ? 'active' : ''}" data-pillar="guide">
          <i class="fa-solid fa-compass"></i> <span><span class="lang-bn-only">A to Z গাইডলাইন</span><span class="lang-en-only">A to Z Complete Guide</span></span>
        </a>
        <a href="resources.html" class="drawer-link-btn ${activeKey === 'resources' ? 'active' : ''}" data-pillar="resources">
          <i class="fa-solid fa-globe"></i> <span><span class="lang-bn-only">অনলাইন রিসোর্স (৪৪টি)</span><span class="lang-en-only">Online Resources (44)</span></span>
        </a>
        <a href="library.html" class="drawer-link-btn ${activeKey === 'library' ? 'active' : ''}" data-pillar="library">
          <i class="fa-solid fa-book-bookmark"></i> <span><span class="lang-bn-only">পিডিএফ লাইব্রেরি (৪০টি)</span><span class="lang-en-only">PDF Library (40)</span></span>
        </a>
        <a href="calculator.html" class="drawer-link-btn ${activeKey === 'calculator' ? 'active' : ''}" data-pillar="calculator">
          <i class="fa-solid fa-calculator"></i> <span><span class="lang-bn-only">ব্যান্ড ক্যালকুলেটর</span><span class="lang-en-only">Band Calculator</span></span>
        </a>
      </div>`;
  footerHtml = footerHtml.replace(drawerLinksRegex, newDrawerLinks);

  // Return full HTML
  return `${headerHtml}\n${heroPart}\n${pageContent}\n${footerHtml}`;
}

// Generate all pages
pageConfigs.forEach(cfg => {
  const fullHtml = buildPage(cfg);
  fs.writeFileSync(cfg.filename, fullHtml, 'utf8');
  console.log(`Generated ${cfg.filename} (${(fullHtml.length / 1024).toFixed(1)} KB)`);
});
