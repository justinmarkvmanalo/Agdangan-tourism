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
    const prevButton = carousel?.querySelector('[data-carousel-prev]');
    const nextButton = carousel?.querySelector('[data-carousel-next]');

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

        const goToPrevious = () => {
            setSlide((activeIndex - 1 + slides.length) % slides.length);
        };

        const restartAutoplay = () => {
            window.clearInterval(autoplay);
            autoplay = window.setInterval(advanceSlide, 4000);
        };

        let autoplay = window.setInterval(advanceSlide, 4000);

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                setSlide(dotIndex);
                restartAutoplay();
            });
        });

        prevButton?.addEventListener('click', () => {
            goToPrevious();
            restartAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            advanceSlide();
            restartAutoplay();
        });
    }

    const highlightsGallery = document.querySelector('[data-highlights-gallery]');
    const highlightCards = highlightsGallery
        ? Array.from(highlightsGallery.querySelectorAll('[data-highlight-card]'))
        : [];
    const highlightsPrev = highlightsGallery?.querySelector('[data-highlights-prev]');
    const highlightsNext = highlightsGallery?.querySelector('[data-highlights-next]');

    if (highlightsGallery && highlightCards.length > 2) {
        let activeHighlight = 1;

        const wrapIndex = (index) => {
            if (index < 0) {
                return highlightCards.length - 1;
            }

            if (index >= highlightCards.length) {
                return 0;
            }

            return index;
        };

        const updateHighlights = (index) => {
            activeHighlight = wrapIndex(index);
            const leftIndex = wrapIndex(activeHighlight - 1);
            const rightIndex = wrapIndex(activeHighlight + 1);

            highlightCards.forEach((card, cardIndex) => {
                card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden-left', 'is-hidden-right');
                card.tabIndex = -1;

                if (cardIndex === activeHighlight) {
                    card.classList.add('is-center');
                    card.setAttribute('aria-hidden', 'false');
                    card.tabIndex = 0;
                    return;
                }

                if (cardIndex === leftIndex) {
                    card.classList.add('is-left');
                    card.setAttribute('aria-hidden', 'false');
                    card.tabIndex = 0;
                    return;
                }

                if (cardIndex === rightIndex) {
                    card.classList.add('is-right');
                    card.setAttribute('aria-hidden', 'false');
                    card.tabIndex = 0;
                    return;
                }

                const distanceGoingLeft = (activeHighlight - cardIndex + highlightCards.length) % highlightCards.length;
                const hiddenClass = distanceGoingLeft < highlightCards.length / 2
                    ? 'is-hidden-left'
                    : 'is-hidden-right';

                card.classList.add(hiddenClass);
                card.setAttribute('aria-hidden', 'true');
            });
        };

        highlightCards.forEach((card) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('is-left')) {
                    updateHighlights(activeHighlight - 1);
                    return;
                }

                if (card.classList.contains('is-right')) {
                    updateHighlights(activeHighlight + 1);
                }
            });

            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                }

                event.preventDefault();
                card.click();
            });
        });

        highlightsPrev?.addEventListener('click', () => {
            updateHighlights(activeHighlight - 1);
        });

        highlightsNext?.addEventListener('click', () => {
            updateHighlights(activeHighlight + 1);
        });

        updateHighlights(activeHighlight);
    }
});
