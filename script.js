// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Log that the script is loaded
console.log('Research Portfolio JavaScript loaded successfully');

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

// Keep navbar consistently deep blue at all times
const navbar = document.querySelector('.navbar');
navbar.style.backgroundColor = '#050046'; // Very deep blue
navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'; // Consistent shadow

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
    const elements = document.querySelectorAll('.bio-section, .research-section, .connection-section');
    
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
document.querySelectorAll('.bio-section, .research-section, .connection-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Trigger animations on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

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

// Resources Page Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Collapsible resource sections
    const resourceHeaders = document.querySelectorAll('.resource-item > h3');
    resourceHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const resourceDetails = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (resourceDetails.style.display === 'none') {
                resourceDetails.style.display = 'block';
                if (icon) icon.classList.remove('fa-chevron-down');
                if (icon) icon.classList.add('fa-chevron-up');
            } else {
                resourceDetails.style.display = 'none';
                if (icon) icon.classList.remove('fa-chevron-up');
                if (icon) icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Search functionality for resources
    const searchInput = document.getElementById('resource-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const resourceItems = document.querySelectorAll('.resource-item');
            
            resourceItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Expand/Collapse all functionality
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() {
            const resourceDetails = document.querySelectorAll('.resource-details');
            const icons = document.querySelectorAll('.resource-item > h3 i');
            
            resourceDetails.forEach(detail => {
                detail.style.display = 'block';
            });
            
            icons.forEach(icon => {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            });
        });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() {
            const resourceDetails = document.querySelectorAll('.resource-details');
            const icons = document.querySelectorAll('.resource-item > h3 i');
            
            resourceDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            icons.forEach(icon => {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            });
        });
    }
});
