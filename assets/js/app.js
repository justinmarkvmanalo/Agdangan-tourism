document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const siteNav = document.querySelector('[data-site-nav]');
    const yearTarget = document.querySelector('[data-current-year]');
    const searchForms = document.querySelectorAll('[data-search-form]');

    if (yearTarget) {
        yearTarget.textContent = new Date().getFullYear();
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    searchForms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = form.querySelector('input')?.value.trim();

            if (!query) {
                return;
            }

            window.alert(`Search placeholder: "${query}"`);
        });
    });

    const carousel = document.querySelector('[data-carousel]');
    const slides = carousel ? Array.from(carousel.querySelectorAll('[data-carousel-slide]')) : [];
    const dots = carousel ? Array.from(carousel.querySelectorAll('[data-carousel-dot]')) : [];

    if (carousel && slides.length > 1) {
        let activeIndex = 0;

        const setSlide = (index) => {
            activeIndex = index;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        const advanceSlide = () => {
            setSlide((activeIndex + 1) % slides.length);
        };

        let autoplay = window.setInterval(advanceSlide, 4000);

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                setSlide(dotIndex);
                window.clearInterval(autoplay);
                autoplay = window.setInterval(advanceSlide, 4000);
            });
        });
    }
});
