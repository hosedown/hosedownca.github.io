// -----------------------------------------------------
// COMMON ELEMENTS
// -----------------------------------------------------
const menuToggle = document.getElementById('mobile-menu');
const navContent = document.querySelector('.nav-content');
const navLinks = document.querySelectorAll('.nav-link');
const container = document.getElementById('main-container');
const sections = document.querySelectorAll('.snap-section');
const slideshowElem = document.getElementById('slideshow-content');


// -----------------------------------------------------
// 1) MOBILE MENU TOGGLE
// -----------------------------------------------------
if (menuToggle && navContent) {
    menuToggle.addEventListener('click', () => {
        navContent.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
    });
}


// -----------------------------------------------------
// 2) NAV CLICK SCROLL (MOBILE-SAFE & OFFSET-CORRECT)
// -----------------------------------------------------
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (!targetElement || !container) return;

        // Scroll relative to container (NO nav subtraction)
        container.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });

        setActiveLink(targetId);

        // Close mobile menu if open
        navContent.classList.remove('active');
        menuToggle.classList.remove('is-active');
    });
});


// -----------------------------------------------------
// 3) ACTIVE SECTION DETECTION (STABLE + SMOOTH)
// -----------------------------------------------------
function setActiveLink(id) {
    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === id
        );
    });
}

function updateActiveOnScroll() {
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;

    let closestSection = null;
    let smallestDistance = Infinity;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        // PURE distance (no nav offset subtraction)
        const distance = Math.abs(rect.top - containerTop);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestSection = section;
        }
    });

    if (closestSection) {
        setActiveLink(`#${closestSection.id}`);
    }
}


// -----------------------------------------------------
// 4) SCROLL THROTTLING (PREVENTS JUMPY ACTIVE STATE)
// -----------------------------------------------------
let ticking = false;

function requestScrollUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveOnScroll();
            ticking = false;
        });
        ticking = true;
    }
}

if (container) {
    container.addEventListener('scroll', requestScrollUpdate);
}

window.addEventListener('resize', updateActiveOnScroll);

// Initial sync
updateActiveOnScroll();


// -----------------------------------------------------
// 5) SLIDESHOW (CLEAN + SAFE)
// -----------------------------------------------------
const slideLinks = [
    'images/bin_before.png',
    'images/soap_bin.png',
    'images/soap_bin2.png'
];

let slideIndex = 0;

function showSlides() {
    if (!slideshowElem) return;

    slideshowElem.style.opacity = '0';

    setTimeout(() => {
        slideIndex = (slideIndex + 1) % slideLinks.length;
        slideshowElem.style.backgroundImage = `url('${slideLinks[slideIndex]}')`;
        slideshowElem.style.opacity = '1';
    }, 400);
}

if (slideshowElem) {
    slideshowElem.style.backgroundImage = `url('${slideLinks[0]}')`;
    setInterval(showSlides, 4000);
}