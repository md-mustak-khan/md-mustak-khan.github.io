/**
 * Resources & Research Tools Page Logic (resources.js)
 * Manages tool filtering, interactive subcategory pills, sidebar table of contents,
 * collapsible sub-nav groups, and accordion toggles.
 */

document.addEventListener('DOMContentLoaded', function() {
    const resourceSections = Array.from(document.querySelectorAll('.resource-item'));
    const searchInput = document.getElementById('resourceSearch');
    const navLinks = Array.from(document.querySelectorAll('#resourceNavList .protocol-nav-link'));
    const visibleToolCount = document.getElementById('visibleToolCount');
    const visibleSectionCount = document.getElementById('visibleSectionCount');
    const btnExpandAll = document.getElementById('btnExpandAll');
    const btnCollapseAll = document.getElementById('btnCollapseAll');
    const btnResetFilter = document.getElementById('btnResetFilter');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    // Active subcategory state per section
    const activeSubcatPerSection = {
        'resource-section-8': 'all',
        'resource-section-11': 'all'
    };

    function normalizeText(value) {
        return (value || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getSearchTerms(value) {
        const normalized = normalizeText(value);
        return normalized ? normalized.split(/\s+/).filter(Boolean) : [];
    }

    // Accordion toggle on section headers
    resourceSections.forEach(section => {
        const header = section.querySelector('.resource-item-header');
        const details = section.querySelector('.resource-details');
        const icon = section.querySelector('.resource-toggle-icon');

        if (header && details) {
            header.addEventListener('click', () => {
                const isCollapsed = section.classList.contains('is-collapsed') || details.style.display === 'none';
                if (isCollapsed) {
                    section.classList.remove('is-collapsed');
                    details.style.display = 'grid';
                    if (icon) icon.className = 'fas fa-chevron-up resource-toggle-icon';
                } else {
                    section.classList.add('is-collapsed');
                    details.style.display = 'none';
                    if (icon) icon.className = 'fas fa-chevron-down resource-toggle-icon';
                }
            });
        }
    });

    // Master Filter & Search Function
    function applyFilters() {
        const searchTerms = getSearchTerms(searchInput ? searchInput.value : '');
        let totalVisibleTools = 0;
        let totalVisibleSections = 0;

        resourceSections.forEach((section) => {
            const toolItems = Array.from(section.querySelectorAll('.tool-item'));
            const subcatHeaders = Array.from(section.querySelectorAll('.resource-subcategory'));
            const navLink = document.querySelector(`.protocol-nav-link[href="#${section.id}"]`);
            const activeSubcat = activeSubcatPerSection[section.id] || 'all';

            let visibleToolsInSection = 0;

            // Filter each tool
            toolItems.forEach((tool) => {
                const toolText = normalizeText(tool.textContent);
                const matchesSearch = searchTerms.length === 0 || searchTerms.every(t => toolText.includes(t));
                
                const toolSubcat = tool.getAttribute('data-subcat');
                const matchesSubcat = (activeSubcat === 'all') || (toolSubcat === activeSubcat);

                const isVisible = matchesSearch && matchesSubcat;
                tool.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) visibleToolsInSection++;
            });

            // Update subcategory headers visibility
            subcatHeaders.forEach((subcat) => {
                const subcatId = subcat.id || subcat.getAttribute('data-subcat-id');
                const matchesPill = (activeSubcat === 'all') || (subcatId === activeSubcat);

                if (!matchesPill) {
                    subcat.style.display = 'none';
                } else if (searchTerms.length === 0) {
                    subcat.style.display = 'block';
                } else {
                    // Check if any visible tool belongs to this subcategory
                    let hasVisibleChild = false;
                    let sibling = subcat.nextElementSibling;
                    while (sibling && !sibling.classList.contains('resource-subcategory')) {
                        if (sibling.classList.contains('tool-item') && sibling.style.display !== 'none') {
                            hasVisibleChild = true;
                            break;
                        }
                        sibling = sibling.nextElementSibling;
                    }
                    subcat.style.display = hasVisibleChild ? 'block' : 'none';
                }
            });

            // Section visibility
            if (visibleToolsInSection > 0) {
                section.style.display = 'block';
                totalVisibleTools += visibleToolsInSection;
                totalVisibleSections++;
                if (navLink) navLink.style.opacity = '1';
            } else {
                section.style.display = 'none';
                if (navLink) navLink.style.opacity = '0.35';
            }

            // Update section count badge / hint
            const filterBar = section.querySelector('.subcat-filter-container');
            if (filterBar) {
                const currentTextEl = filterBar.querySelector('.subcat-current-text');
                const resetBtn = filterBar.querySelector('.subcat-reset-btn');
                
                if (activeSubcat === 'all') {
                    if (currentTextEl) currentTextEl.innerHTML = `Showing <strong>${visibleToolsInSection}</strong> ${section.id === 'resource-section-11' ? 'databases' : 'tools'}`;
                    if (resetBtn) resetBtn.style.display = 'none';
                } else {
                    const activePill = filterBar.querySelector(`.subcat-pill[data-subcat="${activeSubcat}"]`);
                    const pillName = activePill ? activePill.textContent.trim().replace(/\d+$/, '').trim() : 'Category';
                    if (currentTextEl) currentTextEl.innerHTML = `Filtered by: <strong>${pillName}</strong> (${visibleToolsInSection} items)`;
                    if (resetBtn) resetBtn.style.display = 'inline-flex';
                }
            }
        });

        if (visibleToolCount) visibleToolCount.textContent = totalVisibleTools;
        if (visibleSectionCount) visibleSectionCount.textContent = totalVisibleSections;
    }

    // Function to set active subcategory for a section
    function setSectionSubcategory(sectionId, subcatId, shouldScroll = true) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Ensure section is open
        section.style.display = 'block';
        section.classList.remove('is-collapsed');
        const details = section.querySelector('.resource-details');
        const icon = section.querySelector('.resource-toggle-icon');
        if (details) details.style.display = 'grid';
        if (icon) icon.className = 'fas fa-chevron-up resource-toggle-icon';

        // Update state
        activeSubcatPerSection[sectionId] = subcatId;

        // Update filter pills UI
        const filterBar = section.querySelector('.subcat-filter-container');
        if (filterBar) {
            const pills = filterBar.querySelectorAll('.subcat-pill');
            pills.forEach(p => {
                const match = p.getAttribute('data-subcat') === subcatId;
                p.classList.toggle('active', match);
                if (match) {
                    p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }

        // Update sidebar sub-links UI
        const subLinks = document.querySelectorAll(`.nav-sub-link[data-section="${sectionId}"]`);
        subLinks.forEach(link => {
            const match = link.getAttribute('data-subcat') === subcatId;
            link.classList.toggle('active', match);
        });

        // Open collapsible nav group in sidebar
        const navGroup = sectionId === 'resource-section-8' ? document.getElementById('navGroupBio') :
                         sectionId === 'resource-section-11' ? document.getElementById('navGroupDb') : null;
        if (navGroup && subcatId !== 'all') {
            navGroup.classList.add('is-open');
        }

        applyFilters();

        if (shouldScroll) {
            const targetEl = (subcatId === 'all') ? section : (document.getElementById(subcatId) || section);
            const headerOffset = 95;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }

    // Bind filter pill clicks
    document.querySelectorAll('.subcat-filter-container').forEach(filterBar => {
        const sectionId = filterBar.getAttribute('data-for-section');
        
        filterBar.querySelectorAll('.subcat-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const subcatId = pill.getAttribute('data-subcat');
                setSectionSubcategory(sectionId, subcatId, false);
            });
        });

        const resetBtn = filterBar.querySelector('.subcat-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                setSectionSubcategory(sectionId, 'all', false);
            });
        }
    });

    // Bind sidebar accordion toggles
    document.querySelectorAll('.nav-sub-toggle').forEach(toggleBtn => {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const group = toggleBtn.closest('.nav-collapsible-group');
            if (group) {
                group.classList.toggle('is-open');
            }
        });
    });

    // Bind sidebar sub-links
    document.querySelectorAll('.nav-sub-link').forEach(subLink => {
        subLink.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = subLink.getAttribute('data-section');
            const subcatId = subLink.getAttribute('data-subcat');
            setSectionSubcategory(sectionId, subcatId, true);
        });
    });

    // Table of contents navigation click listeners
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target') || link.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.remove('is-collapsed');
                const details = targetSection.querySelector('.resource-details');
                const icon = targetSection.querySelector('.resource-toggle-icon');
                if (details) details.style.display = 'grid';
                if (icon) icon.className = 'fas fa-chevron-up resource-toggle-icon';

                // If section has subcategories and was previously filtered, reset to all
                if (activeSubcatPerSection[targetId]) {
                    activeSubcatPerSection[targetId] = 'all';
                    const filterBar = targetSection.querySelector('.subcat-filter-container');
                    if (filterBar) {
                        filterBar.querySelectorAll('.subcat-pill').forEach(p => {
                            p.classList.toggle('active', p.getAttribute('data-subcat') === 'all');
                        });
                    }
                    const group = targetId === 'resource-section-8' ? document.getElementById('navGroupBio') :
                                  targetId === 'resource-section-11' ? document.getElementById('navGroupDb') : null;
                    if (group) group.classList.add('is-open');
                }

                applyFilters();

                const headerOffset = 90;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }

    // Toolbar action listeners
    if (btnExpandAll) {
        btnExpandAll.addEventListener('click', () => {
            resourceSections.forEach(section => {
                section.classList.remove('is-collapsed');
                const details = section.querySelector('.resource-details');
                const icon = section.querySelector('.resource-toggle-icon');
                if (details) details.style.display = 'grid';
                if (icon) icon.className = 'fas fa-chevron-up resource-toggle-icon';
            });
            document.querySelectorAll('.nav-collapsible-group').forEach(g => g.classList.add('is-open'));
        });
    }

    if (btnCollapseAll) {
        btnCollapseAll.addEventListener('click', () => {
            resourceSections.forEach(section => {
                section.classList.add('is-collapsed');
                const details = section.querySelector('.resource-details');
                const icon = section.querySelector('.resource-toggle-icon');
                if (details) details.style.display = 'none';
                if (icon) icon.className = 'fas fa-chevron-down resource-toggle-icon';
            });
            document.querySelectorAll('.nav-collapsible-group').forEach(g => g.classList.remove('is-open'));
        });
    }

    if (btnResetFilter) {
        btnResetFilter.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            activeSubcatPerSection['resource-section-8'] = 'all';
            activeSubcatPerSection['resource-section-11'] = 'all';
            document.querySelectorAll('.subcat-pill').forEach(p => {
                p.classList.toggle('active', p.getAttribute('data-subcat') === 'all');
            });
            document.querySelectorAll('.nav-sub-link').forEach(l => l.classList.remove('active'));
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.style.opacity = '1';
            });
            applyFilters();
        });
    }

    // Scroll to top button
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    applyFilters();
});
