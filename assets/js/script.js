// Custom modern cursor
const pointerMedia = window.matchMedia('(pointer: fine)');

if (pointerMedia.matches) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';

    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorDot);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const updateCursor = () => {
        ringX += (mouseX - ringX) * 0.2;
        ringY += (mouseY - ringY) * 0.2;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });

    document.querySelectorAll('a, .btn, .nav-link, .social-link, .research-card, .education-item, .experience-item, .certificate-item, .sidebar-card, .nav-toggle, .social-link-footer').forEach((element) => {
        element.addEventListener('mouseenter', () => {
            cursorRing.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('cursor-hover');
        });
    });

    updateCursor();
}

const root = document.documentElement;

function applyTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', safeTheme);
    document.body.setAttribute('data-theme', safeTheme);

    const themeButton = document.querySelector('.i04');
    if (themeButton) {
        if (safeTheme === 'dark') {
            themeButton.classList.add('on');
        } else {
            themeButton.classList.remove('on');
        }
    }
}

const preferredTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(preferredTheme);

const themeSwitchNode = document.querySelector('.i04');
if (themeSwitchNode) {
    themeSwitchNode.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', nextTheme);
        applyTheme(nextTheme);
    });
}

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Log that the script is loaded
console.log('Research Portfolio JavaScript loaded successfully');

const heroTypingTarget = document.getElementById('hero-typing-target');

if (heroTypingTarget) {
    const words = (heroTypingTarget.getAttribute('data-words') || 'Biochemistry, Molecular Biology, Bioinformatics')
        .split(',')
        .map(word => word.trim())
        .filter(Boolean);

    if (words.length > 0) {
        heroTypingTarget.textContent = words[0];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeLoop = () => {
            const currentWord = words[wordIndex];

            if (!isDeleting) {
                heroTypingTarget.textContent = currentWord.slice(0, charIndex + 1);
                charIndex += 1;

                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(typeLoop, 1400);
                    return;
                }
            } else {
                heroTypingTarget.textContent = currentWord.slice(0, charIndex - 1);
                charIndex -= 1;

                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }

            const speed = isDeleting ? 60 : 100;
            setTimeout(typeLoop, speed);
        };

        setTimeout(typeLoop, 600);
    }
}

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Hamburger Animation
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.classList.toggle('change');
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.classList.remove('change');
        });
    });
});

// Keep navbar styling aligned with the updated modern white theme
const navbar = document.querySelector('.navbar');
if (navbar) {
    navbar.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.08)';
}

// Research Card Animation
const researchCards = document.querySelectorAll('.research-card');
researchCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


// Dynamic Button Effects
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.style.cursor = 'pointer';
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

// Social Link Hover Effects
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Dynamic Year in Footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Set current year in footer copyright
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Md. Mustak Khan. All Rights Reserved.`;
    }
});

// Parallax Effect for Cover Section
document.addEventListener('mousemove', (e) => {
    const coverSection = document.querySelector('.cover-section');
    if (coverSection) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        coverSection.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    }
});

// Animation on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.research-section, .connection-section');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.querySelectorAll('.research-section, .connection-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Trigger animations on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Timeline reveal animation for rows using IntersectionObserver for smooth, performant reveals
function initTimelineRowsObserver() {
    const rows = document.querySelectorAll('.design-1.tpl-A .row');
    if ('IntersectionObserver' in window && rows.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        rows.forEach(row => observer.observe(row));
    } else {
        // fallback
        rows.forEach(row => row.classList.add('in-view'));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineRowsObserver);
} else {
    initTimelineRowsObserver();
}

// Dynamic Research Interest Cards
const researchInterests = [
    {
        icon: 'fas fa-dna',
        title: 'C. elegans Research',
        description: 'Using C. elegans as a model organism to study effects of plant-derived compounds and synthetic molecules'
    },
    {
        icon: 'fas fa-microscope',
        title: 'Microbiology',
        description: 'Exploring microbial systems and their applications in biotechnology and health'
    },
    {
        icon: 'fas fa-seedling',
        title: 'Plant Research',
        description: 'Investigating nutritional composition and antioxidant properties of plant-derived samples'
    },
    {
        icon: 'fas fa-laptop-code',
        title: 'Bioinformatics',
        description: 'Computational approaches to drug design, vaccine development, and cancer bioinformatics'
    }
];

// Function to dynamically generate research cards (for future use)
function generateResearchCards() {
    const researchGrid = document.querySelector('.research-grid');
    if (researchGrid && researchGrid.children.length === 0) {
        researchInterests.forEach(interest => {
            const card = document.createElement('div');
            card.className = 'research-card';
            card.innerHTML = `
                <i class="${interest.icon}"></i>
                <h3>${interest.title}</h3>
                <p>${interest.description}</p>
            `;
            researchGrid.appendChild(card);
        });
    }
}

// Call the function to ensure cards are present
generateResearchCards();

// Dynamic Navbar Active Link
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || 
            (link.getAttribute('href') === 'index.html' && current === '')) {
            link.classList.add('active');
        }
    });
});


// Reveal animations for timeline mind-map
function initTimelineReveal() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if ('IntersectionObserver' in window && timelineItems.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        timelineItems.forEach(item => observer.observe(item));
    } else {
        // Fallback: reveal all
        timelineItems.forEach(item => item.classList.add('in-view'));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelineReveal);
} else {
    initTimelineReveal();
}

// Initialize collapsible paragraphs inside timeline cards
function initTimelineCollapsibles() {
    const cards = document.querySelectorAll('.timeline-section.design-1.tpl-A .card');
    cards.forEach(card => {
        if (card.dataset.collapsibleInitialized) return;
        const paras = Array.from(card.querySelectorAll('p'));
        if (!paras.length) return;

        // Wrap all paragraph nodes into a collapsible container
        const wrapper = document.createElement('div');
        wrapper.className = 'collapsible-content';

        paras.forEach(p => wrapper.appendChild(p));

        card.appendChild(wrapper);

        // Add a chevron indicator inside the card-tags row (right-aligned opposite the tag badge)
        const cardTags = card.querySelector('.card-tags');
        if (cardTags && !card.querySelector('.card-chevron')) {
            const chevron = document.createElement('div');
            chevron.className = 'card-chevron';
            chevron.setAttribute('aria-hidden', 'true');
            chevron.innerHTML = '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            cardTags.appendChild(chevron);
        }

        // We intentionally do NOT add a "Read more" button. Clicking the card toggles expansion.
        // Ensure initial accessibility attribute
        card.setAttribute('aria-expanded', 'false');
        card.dataset.collapsibleInitialized = '1';
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTimelineCollapsibles();
    });
} else {
    initTimelineCollapsibles();
}

// Initialize generic interactivity for sections and boxes
function initInteractiveSections() {
    const selectors = [
        '.card',
        '.research-card',
        '.contact-card',
        '.timeline-section.design-1.tpl-A .card',
        '.education-item',
        '.experience-item',
        '.certificate-item',
        '.sidebar-card',
        '.research-grid .research-card'
    ];

    const elements = new Set();
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => elements.add(el)));

    elements.forEach(el => {
        if (el.dataset.interactiveInit) return;
        el.classList.add('interactive-card');

        // Hover visual already handled in CSS, but ensure accessible hover state
        el.addEventListener('mouseenter', () => el.classList.add('hovered'));
        el.addEventListener('mouseleave', () => el.classList.remove('hovered'));

        // Make focusable if not naturally focusable
        const focusable = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
        if (!focusable.includes((el.tagName || '').toUpperCase())) {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        }

        // Keyboard: Enter/Space to toggle expansion if details exist
        el.addEventListener('keydown', (ev) => {
            const target = ev.target;
            const isFormControl = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes((target.tagName || '').toUpperCase());
            if (isFormControl) return;

            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                toggleInteractiveExpand(el);
            }
        });

        // Click toggles expansion for elements that have multiple paragraphs or an explicit details container
        el.addEventListener('click', (e) => {
            // Avoid toggling when clicking links or buttons inside the card
            if (e.target.closest('a, button, input, textarea, select')) return;
            toggleInteractiveExpand(el);
        });

        // If element has multiple paragraphs, consolidate extra paragraphs into an interactive-details block
        const paras = Array.from(el.querySelectorAll('p'));
        if (paras.length > 1 && !el.querySelector('.interactive-details')) {
            const details = document.createElement('div');
            details.className = 'interactive-details';

            // move all paras except the first
            paras.slice(1).forEach(p => details.appendChild(p));

            el.appendChild(details);

            // Add toggle button unless already present (timeline has its own)
            if (!el.querySelector('.collapse-toggle') && !el.querySelector('.interactive-toggle')) {
                const btn = document.createElement('button');
                btn.className = 'interactive-toggle';
                btn.type = 'button';
                btn.textContent = 'Read more';
                btn.setAttribute('aria-expanded', 'false');
                btn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const expanded = el.classList.toggle('is-expanded');
                    btn.textContent = expanded ? 'Show less' : 'Read more';
                    btn.setAttribute('aria-expanded', expanded);
                });
                el.appendChild(btn);
            }
        }

        el.dataset.interactiveInit = '1';
    });

    // Helper to toggle expansion state for a card
    function toggleInteractiveExpand(el) {
        // If there is an explicit details block, toggle .is-expanded
        const details = el.querySelector('.interactive-details') || el.querySelector('.collapsible-content') || el.querySelector('.resource-details');
        if (details) {
            const isExpanded = el.classList.toggle('is-expanded');
            // toggle the inner details container so CSS transitions run
            try { details.classList.toggle('expanded', isExpanded); } catch (e) {}
            // update aria attribute on the card for accessibility
            el.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            // rotate chevron to indicate expanded / collapsed state
            const chevron = el.querySelector('.card-chevron');
            if (chevron) chevron.classList.toggle('rotated', isExpanded);
            // update any buttons inside (hidden by CSS but keep attributes consistent)
            const btn = el.querySelector('.interactive-toggle, .collapse-toggle');
            if (btn) {
                btn.textContent = isExpanded ? (btn.dataset.showLessText || 'Show less') : (btn.dataset.showMoreText || 'Read more');
                btn.setAttribute('aria-expanded', isExpanded);
            }
            return;
        }

        // Otherwise, perform a small pulse effect
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 420);
    }
}

// Run the interactive initializer after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveSections);
} else {
    initInteractiveSections();
}

// Animate expertise bars when the Expertise section scrolls into view
function initExpertiseBarAnimation() {
    const section = document.querySelector('.expertise-section');
    if (!section) return;

    const spans = Array.from(document.querySelectorAll('.expertise-bar span'));
    if (!spans.length) return;

    // capture target widths and collapse bars initially
    spans.forEach(sp => {
        const inlineWidth = sp.getAttribute('style') || sp.style.width || '';
        // extract percentage from inline style if present
        let target = '';
        if (inlineWidth && inlineWidth.includes('width')) {
            // e.g. 'width: 88%'
            const m = inlineWidth.match(/width\s*:\s*([0-9.]+%)/);
            if (m) target = m[1];
        }
        // fallback to computed width (rare)
        if (!target) {
            const cs = window.getComputedStyle(sp);
            target = cs.width; // px value; we'll ignore pixel fallback
        }
        sp.dataset._targetWidth = target;
        sp.style.width = '0%';
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // animate each span to its target
                spans.forEach(sp => {
                    const target = sp.dataset._targetWidth || sp.style.width || '';
                    if (!target) return;
                    // if target is in px, convert to percentage relative to container
                    if (target.indexOf('%') === -1) {
                        // compute percent from parent width
                        const parent = sp.parentElement;
                        const parentW = parent.getBoundingClientRect().width;
                        const px = parseFloat(target);
                        if (parentW > 0 && px) {
                            const pct = Math.round((px / parentW) * 100) + '%';
                            sp.style.width = pct;
                        }
                    } else {
                        sp.style.width = target;
                    }
                    // add animated class to move gradient
                    sp.classList.add('animated');
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(section);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpertiseBarAnimation);
} else {
    initExpertiseBarAnimation();
}

// ── Scroll-driven spine fill: glowing bar grows as you scroll ──────────────
function initSpineScrollFill() {
    const spine = document.querySelector('.timeline-section.design-1.tpl-A .spine');
    if (!spine) return;

    // Inject the glowing progress bar element
    let progressEl = spine.querySelector('.spine-progress');
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'spine-progress at-zero';
        spine.insertBefore(progressEl, spine.firstChild);
    }

    // Collect all dot elements and their parent dotcol containers
    const dotcols = Array.from(spine.querySelectorAll('.row .dotcol'));
    const dots    = dotcols.map(dc => dc.querySelector('.dot'));

    function update() {
        const spineRect = spine.getBoundingClientRect();
        const spineTop    = spineRect.top;
        const spineHeight = spineRect.height;

        // The "trigger point" moves at 65% from the top of the viewport
        const triggerY = window.innerHeight * 0.65;

        // How far has the trigger point passed into the spine?
        const rawFill = triggerY - spineTop;

        if (rawFill <= 0) {
            // Haven't reached the spine yet
            progressEl.style.height = '0px';
            progressEl.classList.add('at-zero');
            dots.forEach(d => d && d.classList.remove('dot-lit'));
            return;
        }

        const fillPx = Math.min(rawFill, spineHeight);
        progressEl.style.height = fillPx + 'px';
        progressEl.classList.toggle('at-zero', fillPx < 4);

        // Light up each dot whose centre the fill bar has passed
        dotcols.forEach((dc, i) => {
            const dot = dots[i];
            if (!dot) return;
            const dcRect = dc.getBoundingClientRect();
            // Centre of the dot relative to the top of the spine
            const dotCenter = (dcRect.top + dcRect.height / 2) - spineRect.top;
            dot.classList.toggle('dot-lit', fillPx >= dotCenter);
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update(); // initial run
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpineScrollFill);
} else {
    initSpineScrollFill();
}

// ── Scroll-to-Top Button (injected automatically if not present in page) ──
function initScrollTopButton() {
    if (document.querySelector('.scroll-top-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.id = 'scrollTopBtn';
    btn.title = 'Scroll to top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    const onScroll = () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollTopButton);
} else {
    initScrollTopButton();
}
