import { waitForAnimation } from './animate.js';

function initialize() {
    document.addEventListener(
        "portfolioPage",
        () => {
            addEventListeners();
            addFilterListeners();
        },
        false
    );
}

function addEventListeners() {
    const contentDropdowns = document.querySelectorAll('.dropdown');

    contentDropdowns.forEach(dropdown => {

        dropdown.addEventListener('click', (e) => {
            if (e.target === dropdown) {
                collapseContent(dropdown);
                animateChevron(dropdown.children[0]);
            };
        });
    });
}

function addFilterListeners() {
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.card');
    const groups = document.querySelectorAll('.dropdown');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;

            chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));

            cards.forEach(card => {
                const categories = card.dataset.cat.split(' ');
                card.hidden = !(filter === 'all' || categories.includes(filter));
            });

            // Hide a whole group when none of its cards match
            groups.forEach(group => {
                group.hidden = !group.querySelector('.card:not([hidden])');
            });
        });
    });
}

function animateChevron(element) {
    for (const child of element.children) {
        if (child.classList.contains("icons")) {
            const target = child.children[0];

            if (target.classList.contains('rotated')) {
                target.style.animation = `resetRotateDropdownIcon 0.25s ease forwards`;
                target.classList.remove('rotated');
                return;
            }
            target.style.animation = `rotateDropdownIcon 0.25s ease forwards`;
            target.classList.add('rotated');

            return;
        }
    }
}

function collapseContent(dropdown) {
    dropdown.style.pointerEvents = 'none';
    for (const child of dropdown.children) {
        if (child.classList.contains("dynamic-content")) {
            animateDropdown(child);
        }
    }
}

function animateDropdown(collapsible) {
    if (collapsible.classList.contains("hidden")) {
        collapsible.style.animation = `dropdownFadeIn 0.25s ease forwards`;
    }
    else {
        collapsible.style.animation = `dropdownFadeOut 0.25s ease forwards`;
    }

    waitForAnimation(collapsible).then(() => {
        collapsible.classList.toggle("hidden");
        collapsible.parentNode.style.pointerEvents = 'auto';
    });
}

initialize();
