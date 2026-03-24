// ── NAV TOGGLE ──
const menuToggle = document.getElementById('mobile-menu');
const navOverlay = document.getElementById('nav-overlay');
 
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
});
 
document.querySelectorAll('[data-overlay-link]').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('is-active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});
 
// ── SCROLL HELPERS ──
const container = document.getElementById('main-container');
const sections = document.querySelectorAll('.snap-section');
const navLinks = document.querySelectorAll('.nav-link:not([data-overlay-link])');
 
// Detect which element is actually scrolling:
// On desktop the container has overflow-y:auto and a fixed height, so it scrolls.
// On mobile the media query sets height:auto and overflow:visible, so window scrolls.
function isContainerScrolling() {
    return getComputedStyle(container).overflowY === 'auto';
}
 
function getScrollTop() {
    return isContainerScrolling() ? container.scrollTop : window.scrollY;
}
 
// offsetTop relative to the scroll root (container or document)
function getSectionTop(sec) {
    if (isContainerScrolling()) {
        return sec.offsetTop;
    }
    // getBoundingClientRect is viewport-relative; add scrollY to get document-relative
    return sec.getBoundingClientRect().top + window.scrollY;
}
 
// ── ACTIVE NAV LINK ──
function setActive(id) {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
}
 
function onScroll() {
    const scrollTop = getScrollTop();
    let current = '';
    sections.forEach(sec => {
        if (scrollTop >= getSectionTop(sec) - 120) current = '#' + sec.id;
    });
    if (current) setActive(current);
}
 
container.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();
 
// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (isContainerScrolling()) {
            container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        } else {
            const top = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
 
// ── SLIDESHOW ──
const slides = ['images/logo_crop.png', 'images/bin_before_final.jpg', 'images/soap_bin.png', 'images/soap_bin2.png', 'images/bin_after.png'];
const slideshowEl = document.getElementById('slideshow-content');
let idx = 0;
 
if (slideshowEl) {
    slideshowEl.style.backgroundImage = `url('${slides[0]}')`;
    slideshowEl.style.opacity = '1';
 
    setInterval(() => {
        slideshowEl.style.opacity = '0';
        setTimeout(() => {
            idx = (idx + 1) % slides.length;
            slideshowEl.style.backgroundImage = `url('${slides[idx]}')`;
            slideshowEl.style.opacity = '1';
        }, 450);
    }, 4000);
}