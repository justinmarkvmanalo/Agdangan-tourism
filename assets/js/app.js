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
});
