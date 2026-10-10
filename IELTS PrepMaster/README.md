# 🎓 IELTS PrepMaster — সম্পূর্ণ ফ্রি IELTS রিসোর্স ও মাস্টার প্রিপারেশন হাব

> **বর্ণনা / বিবরণ:** ২,৯৪৯টি শব্দার্থের ইন্টারেক্টিভ ড্রিল, ৫৭টি মূল পিডিএফ বই, পরীক্ষকদের ব্যান্ড রুব্রিক্স এবং ইনস্ট্যান্ট স্কোর কনভার্টার — IELTS পরীক্ষার্থীদের জন্য সম্পূর্ণ উন্মুক্ত ও স্বয়ংসম্পূর্ণ প্রস্তুতি পোর্টাল।  
> **Version:** 2.0 (Balanced Flat Bengali Design System)  
> **Author & Developer:** **Md. Mustak Khan** (Chittagong, Bangladesh)  
> **Contact & Profiles:** 📧 [Email](mailto:mustakkhan.bmb.cu@gmail.com) | 🌐 [Website](https://md-mustak-khan.github.io/) | 💼 [LinkedIn](https://www.linkedin.com/in/md-mustak-khan) | 📱 [+880 1308-584945](tel:+8801308584945)  
> **Status:** Production-Ready & GitHub Pages Deployable  
> **Architecture:** Unified Single-Page Application (SPA) combining **VocabMaster Pro (২,৯৪৯ শব্দার্থ)**, **A to Z IELTS Master Guide**, **৫৭টি ডিজিটাল মূল বইয়ের লাইব্রেরি**, এবং **ব্যান্ড স্কোর ক্যালকুলেটর**।

---

## 🎨 Visual Design System & Aesthetics
This platform is crafted according to a balanced, soft, and modern flat design language tailored for Bangladeshi IELTS candidates:

* **Vibe:** Balanced · Soft
* **Rhythm:** 4px grid · Soft corners (`12px` / `16px`) · **Flat (No shadows)**
* **Color Palette:**
  * **Primary:** `#111827` (Deep Obsidian / Black-Blue)
  * **Accent:** `#C50C2F` (Crimson Red / High-Contrast Focus)
  * **Surface:** `#F3F4F6` (Clean Soft Warm Gray)
  * **Elevated / Border:** `#D1D5DB` (Subtle 1px Borders)
  * **Text:** `#000000` (High Legibility Ink Black)
  * **Muted:** `#9CA3AF` (Secondary Neutral)
* **Typography:**
  * **Display & Bangla Headlines:** Hind Siliguri (900 Heavy, 1.05 line-height, -3px tracking)
  * **Card & Section Headers:** Baloo 2 (700 Bold / 900 Extra Bold)
  * **Reading Passages & Body Text:** Plus Jakarta Sans & Hind Siliguri (500 Medium, 1.6–1.8 line-height)
  * **Monospace & Timers:** JetBrains Mono (Exam Timer & Question Coordinates)

---

## 🌟 4 Core Master Pillars

### 1. 🏛️ Cambridge Practice Tests (Authentic CD-IELTS Simulation)
- **40 Complete Examination Tests** covering **Cambridge 10 through 19 Academic** (Tests 1–4 each).
- **Computer-Delivered Reading Simulator**:
  - Split-screen computer-delivered layout with draggable center divider.
  - Interactive Passage 1, 2, and 3 switching with completion indicators.
  - Multi-color highlighter tools (Yellow, Green, Cyan) and clear highlight option.
  - Interactive inputs: `TRUE / FALSE / NOT GIVEN`, `YES / NO / NOT GIVEN`, Single & Multi-select MCQ, Summary & Sentence Completion text inputs.
  - 40-question bottom palette ribbon with Answered, Flagged, and Active question tracking.
  - Instant auto-grading scorecard with raw score, official Band Score (0–9), and question-by-question review table.
  - Built-in Academic Vocabulary Assistant with contextual Bangla definitions.
- **Listening Simulator**:
  - Web Audio Synthesizer speech player with speed control (`0.85x`, `1.0x`, `1.15x`, `1.3x`).
  - Sections 1 through 4 with authentic question forms and table completions.
  - Synchronized Audio Script mode with highlighted answer clues.
- **Writing Studio**:
  - Task 1 (150 words / 20 mins) and Task 2 (250 words / 40 mins) countdown timers.
  - Real-time word counter with circular progress ring toward required word limits.
  - Authentic task prompts (charts, tables, maps, essays) with high-scoring Band 9 model answers and examiner commentaries.
  - 4-criteria Band Descriptor Rubric Checklist (TR, CC, LR, GRA).
- **Speaking Studio**:
  - Part 1 introduction interview topics with suggested high-scoring phrases.
  - Part 2 Cue Cards with 1-minute preparation countdown timer, digital scratchpad notes, and 2-minute speaking timer.
  - **In-Browser Audio Voice Recorder**: Record your voice through your microphone with real-time waveform visualization. Supports cross-browser WebM/MP4 playback and download for self-evaluation.
  - Part 3 deep academic discussion questions with high-band collocations.
- **Official Band Score Calculator & History Logger**:
  - Raw score to Band Score converter (0 to 40 questions).
  - 4-skills Overall Band Average calculator with official IELTS rounding rules (`.25` rounds up to `.5`, `.75` rounds up to whole band).
  - Persistent practice history log stored in `localStorage`.

---

### 2. 🧠 Vocab & Drill Master (2,949 IELTS Words & Drills)
- **Explore & Search Database**:
  - **2,949 high-frequency IELTS words** with English definitions, synonyms, and **Bengali (বাংলা) meanings**.
  - Natural British English text-to-speech pronunciation buttons.
  - Difficulty badges (Band 6–9), star bookmarking, and mastered tracking.
- **3D Interactive Flashcards**:
  - Realistic 3D flip card animations with audio pronunciation.
  - Spaced Repetition (SRS) review buttons: "Still Learning" vs "Mastered".
  - Deck filters and shuffle functionality.
- **Quiz Arena**:
  - Timed Multiple-Choice quizzes with 15-second countdown timer and score multipliers.
  - Web Audio API synthesizer chime sound effects.
  - Detailed mistake review accordion and "Practice Missed Words" mode.
- **Listening Spelling Drill**:
  - Audio listen & spell drill modeled after Listening Sections 1 and 4.
  - British pronunciation audio playback with letter-reveal hint system.
  - Continuous spelling streak tracking.
- **Bookmark Export**:
  - Export all your starred/bookmarked vocabulary items as a JSON study list.

---

### 3. 📘 A to Z IELTS Master Preparation Guide
- **Test Overview & Structure**:
  - Comprehensive comparison between IELTS Academic and General Training.
  - Detailed duration breakdown, question counts, test day guidelines, and Computer-Delivered interface mechanics.
- **Official Band Descriptors & Rubrics**:
  - Complete Raw-to-Band score lookup tables for Reading & Listening (Band 5.0 to Band 9.0).
  - Writing Task 1 & Task 2 official 4-pillar rubrics (Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).
  - Speaking official 4-pillar rubrics (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation).
- **Module-by-Module Band 9 Strategies**:
  - **Reading**: Skimming vs Scanning, keyword locating, handling T/F/NG vs Y/N/NG, heading matching, time management (The 17-20-23 Rule).
  - **Listening**: 30-second preview keyword prediction, identifying audio signposts & transitional cues, catching distractor traps, singular/plural and spelling accuracy.
  - **Writing**: Task 1 four-paragraph structure (Paraphrased intro, dynamic overview, body paragraphs with comparative figures) & Task 2 four-paragraph essay models (Opinion, Discussion, Problem-Solution, Direct Question).
  - **Speaking**: Part 1 answer expansion (Answer + Reason + Detail), Part 2 cue card 1-min preparation PPF (Past, Present, Future) technique, Part 3 academic hedging & nuance.
  - **Grammar & Foundation**: Complex sentences (relative, conditional, concessive), passive voice for Task 1 reports, modal verbs for academic hedging.
- **Strategic Preparation Roadmaps**:
  - **30-Day Intensive Crash Plan** (For intermediate test-takers aiming for Band 7+).
  - **60-Day Comprehensive Mastery Plan** (Target Band 7.5 to 8.5).
  - **90-Day Complete Beginner to Band 8 Blueprint** (Full linguistic foundation + all 40 Cambridge tests).

---

### 4. 📚 Master Materials & PDF Library (57 Indexed Books)
Direct access to all **57 PDF preparation materials** in your workspace across 7 categories:
1. **01. Cambridge Tests (22 Books)**: CAM 10 to 20 Academic + Cambridge Listening 1–17 Master Collection.
2. **02. Vocabulary & Idioms (17 Books)**: 1,200 words, 800 idioms, Next-Gen Vocab, Collocations, Map vocab.
3. **03. Writing (5 Books)**: Liz's essay ideas, 1,000 Quick Writing Ideas, Task 2 Ideas, Task 1 Vocab, Paraphrasing.
4. **04. Speaking (1 Book)**: Kiran Makkar 2025 Speaking Cue Cards (Jan-Apr 2025).
5. **05. Reading (2 Books)**: General Reading Actual Tests, রিডিং সহজে বোঝার কৌশল.
6. **06. Grammar & Foundation (6 Books)**: Munzereen Shahid ঘরে বসে IELTS প্রস্তুতি, Mindset Foundation, Common Mistakes, Complex Sentences.
7. **07. Magazines & Extra Reading (4 Books)**: The Economist, Time Magazine, Elon Musk Biography, 1001 Inventions.

- **Universal Built-in PDF Reader**: Click "Read" on any card to view the PDF directly inside the application's clean reader modal, or pop it out into a new tab!
- **Instant Live Search**: Real-time filtering across book titles, categories, authors, and keywords.

---

## 🛠️ Resolved Issues & Architectural Optimizations (v2.0)

| Issue / Error | Root Cause | Resolution |
| :--- | :--- | :--- |
| **Header & Hero Overlap** | Dynamic height variance of multi-row sticky header | Unified header with nowrap flex, horizontal touch scrolling, and intelligent auto-collapse of hero banner upon test/drill start. |
| **Shadows vs Flat Aesthetic** | 77 legacy box-shadow rules in CSS | Neutralized all box-shadows into a pure 1px flat border system (`#D1D5DB`) with soft radii. |
| **Undefined CSS Variables** | `--book-gradient` missing in `:root` | Added `--book-gradient` and `--accent-gradient` tokens with dark obsidian and crimson values. |
| **Duplicate Fullscreen Button** | Duplicate button IDs in HTML | Removed redundant `<button id="fullscreenToggleBtn">` and unified into `#masterFullscreenToggle`. |
| **PDF Modal Conflict** | Duplicate `openPdfModal` in sub-engines | Consolidated into a single global reader resolving relative paths for all 57 books. |
| **Speaking Recorder MIME Type** | Fixed `.webm` on unsupported browsers | Added dynamic candidate checking (`audio/webm`, `audio/mp4`, `audio/wav`). |
| **Empty Search Invisibility** | Hardcoded white text on light surface | Converted empty state card to responsive Bengali text with high contrast. |

---

## 🚀 How to Run

### Option 1: Direct File (Recommended - 100% Offline)
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Brave, Mozilla Firefox):
```
file:///f:/Mustak/IELTS/index.html
```

### Option 2: Local Web Server
If you prefer running via a local HTTP server:
```powershell
# Using Node.js
npx serve f:/Mustak/IELTS

# Or using Python
python -m http.server 8080 --directory "f:/Mustak/IELTS"
```
Then navigate to: `http://localhost:8080/index.html`

---

## 📁 Project Architecture & Preservation Guarantee
Both original applications have been **100% preserved without deleting or modifying any data**:
- `cambridge_app/`: Untouched standalone Cambridge practice suite.
- `vocab_app/`: Untouched standalone VocabMaster suite.
- `index.html`: Merged master platform entry point.
- `master.css`: Unified styling system (Flat, Bengali tokens, zero shadows).
- `master.js`: Master orchestration script combining all engines.
- `materials_data.js`: Structured dataset for all 57 workspace PDF materials.
- `PLAN.md`: Comprehensive audit and roadmap specification.
- `images/`: Listening diagrams, reading illustrations, and writing charts.
- `01` through `07`: All original PDF folders and books intact.


---

## 🌐 Curated Awesome IELTS Resources & Mega Web Directory

A comprehensive collection of world-class IELTS websites, mock test portals, practice suites, podcasts, and YouTube channels:

### 🏛️ Official & Practice Mocks
* [IELTS Online Tests (Free Timed Mocks)](https://ieltsonlinetests.com/) - Full-length mock tests online under timed exam conditions.
* [British Council Official Practice Tests](https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests) - Free official listening, reading, writing, and speaking tests.
* [Cambridge Official Practice Tests](https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/) - Authentic examination samples from Cambridge English.
* [Cambridge IELTS Books (1 - 15)](https://ieltspracticeonline.com/download-all-cambridge-ielts-books-pdfaudio-1-14/) - Cambridge test collection with audios.

### 🎧 Listening Practice & Accents
* [Mini-IELTS Listening Tests](http://mini-ielts.com/listening) - Short bite-sized listening tests with instant scores.
* [184 IELTS Listening Tests](https://practicepteonline.com/ielts-listening-tests/) - Massive collection of 184 full-length listening tests.
* [IELTS UP Listening Practice](https://ielts-up.com/listening/ielts-listening-practice.html) - Section-by-section questions with answers.
* [High Level Listening](http://www.highlevellistening.com/) - Advanced listening practice and lessons.
* [Exam English](http://examenglish.com/IELTS/IELTS_listening.html) - Free practice tests for IELTS listening.
* [BBC Programmes](http://www.bbc.co.uk/programmes/b006qykl) - Authentic native audio streams.
* [BBC Learning English](http://learnenglish.britishcouncil.org/en/listen-and-watch) - British Council multimedia material.
* [Speech Accent Archive](http://accent.gmu.edu/) - Analyze and practice diverse global accents.

### 📖 Reading (Academic & General)
* [Mini-IELTS Reading Tests](http://mini-ielts.com/reading) - Quick timed reading passages and questions.
* [225 IELTS Academic Reading Tests](https://practicepteonline.com/ielts-reading-tests/) - 225 full-length Academic reading tests.
* [100 IELTS General Reading Tests](https://practicepteonline.com/ielts-general-reading-tests/) - 100 General Training reading tests.
* [IELTS UP Academic Reading Tests](https://ielts-up.com/reading/ielts-reading-practice.html#academic) - Academic reading practice and breakdowns.
* [IELTS UP General Reading Tests](https://ielts-up.com/reading/ielts-reading-practice.html#general) - GT reading strategies.
* [Tim Ferriss Speed Reading](https://www.huffingtonpost.com/tim-ferriss/speed-reading_b_5317784.html) - Techniques to increase reading speed.

### ✍️ Writing Task 1 & 2
* [248 Band 9 IELTS Essays](http://www.ielts-practice.org/band-9-essays/) - Enormous archive of 248 authentic Band 9 essays.
* [100+ Band 8 IELTS Essays](http://www.ielts-practice.org/band-8-essays/) - Over 100 Band 8 model essays with detailed breakdowns.
* [Collection of Writing Topics (Writing9)](https://writing9.com/ielts-writing-task-2-topics) - Real exam essay prompts and peer reviews.
* [Improve Your Writing Score](http://www.ielts-practice.org/ielts-writing/) - Essential tips to elevate Task 1 and 2 scoring.
* [Model Essays with Feedback](https://www.ieltsbuddy.com/ielts-sample-essays.html) - Evaluated essays with examiner commentary.
* [IELTS Writing Task 1 for Academic](https://www.ieltsbuddy.com/ielts-writing-task-1.html) - Reports for charts, graphs, maps, and processes.
* [IELTS Letter Writing Tips (GT)](https://ieltsliz.com/ielts-letter-writing-essential-tips/) - Formal, semi-formal, and informal letter structures.
* [IELTS Writing Vocabulary](https://ielts-up.com/writing/ielts-vocabulary-writing.html) - High-scoring academic vocabulary for writing.
* [IELTS from 6 to 9](https://ielts69.com/) - Strategies to push writing scores to band 8–9.

### 🗣️ Speaking
* [IELTS Speaking Part 1 Topics (Liz)](https://ieltsliz.com/ielts-speaking-part-1-topics/) - Full list of Part 1 questions and answers.
* [IELTS Speaking Part 2 Topics (Liz)](https://ieltsliz.com/ielts-speaking-part-2-topics/) - Current Cue Card topics with model speeches.
* [IELTS Speaking Part 3 Topics (Liz)](https://ieltsliz.com/ielts-speaking-part-3-topics-2/) - In-depth discussion questions.
* [IELTS Speaking Vocabulary](https://ielts-up.com/speaking/ielts-vocabulary-speaking.html) - Lexical resource collocations for speaking.
* [Cambly](https://www.cambly.com/) - 1-on-1 on-demand English practice with native speakers.
* [Verbling](https://www.verbling.com/) - Professional online language tutors.
* [GetspokenApp](http://www.getspokenapp.com/) - Spoken English coaching and practice.
* [IELTS Speaking UK](http://www.ieltsspeaking.co.uk/) - Topic-based speaking exercises and vocabulary flashcards.
* [SpeakingIELTS](http://www.speakingielts.com/) - Online speaking test simulator.

### 🧠 Vocabulary & Podcasts
* [Quizlet](https://quizlet.com) - Flashcards and spaced-repetition vocabulary learning (Web/iOS/Android).
* [Forvo](http://forvo.com/) - Pronunciation guide recorded by native speakers.
* [All Ears English Podcast](https://www.allearsenglish.com/) - High-energy English conversations and exam tips.
* [ELLLO](http://elllo.org/) - English Listening Lesson Library Online (3,000+ free audio lessons).
* [Espresso English](https://www.espressoenglish.net/) - Short, practical daily English lessons.

### 📺 Top YouTube Channels & Portals
* [IELTS Liz](https://www.youtube.com/user/ieltsliz) - Comprehensive test prep lessons and band 9 model answers.
* [Official IELTS Channel](https://www.youtube.com/user/IELTSOfficial) - Official test format walk-throughs and tips.
* [engVid](https://www.engvid.com/) - Free video lessons covering grammar, vocabulary, and IELTS.
* [IELTS Simon](http://ielts-simon.com/ielts-help-and-english-pr/) - Daily tips from an ex-examiner.
* [IELTS Advantage](http://ieltsadvantage.com/) - Chris Pell's Band 7-9 strategy guides.
* [IELTS Buddy](http://www.ieltsbuddy.com/) - Comprehensive lesson plans and model essays.
* [IELTS Material](http://ieltsmaterial.com/) - Study guides, books, and practice tests.
* [IELTS-exam.net](https://www.ielts-exam.net/) - Extensive free preparation exercises.
* [Ryan's IELTS Blog](http://ieltsielts.com/more/study-plans/) - Study plans and strategy guides.
* [CanadaVisa Free Tests](http://www.canadavisa.com/ielts/free-practice-tests.html) - Free self-assessment practice tests.
* [Self Study Materials](http://selfstudymaterials.com/) - Downloadable self-study resources.
* [Blog de Cristina](http://www.cristinacabal.com/) - English teaching and learning blog.
* [Dialect Blog](http://dialectblog.com/) - Dialects and accents archive.

---

*Crafted for Excellence · Band 9 Preparation Suite · IELTS PrepMaster Ultimate*  
*Designed & Developed by **Md. Mustak Khan** | Chittagong, Bangladesh | [mustakkhan.bmb.cu@gmail.com](mailto:mustakkhan.bmb.cu@gmail.com)*
