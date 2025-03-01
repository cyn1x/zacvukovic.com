import { waitForAnimation } from './animate.js';

function initialize() {
    document.addEventListener(
        "portfolioPage",
        () => {
            addEventListenrers();  
        },
        false
    );
}

function addEventListenrers() {
    const contentDropdowns = document.querySelectorAll('.content-dropdown');
    
    contentDropdowns.forEach(dropdown => {

        dropdown.addEventListener('click', (e) => {
            if (e.target === dropdown) {
                collapseContent(dropdown);
                animateChevron(dropdown.children[0]);
            };
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
        if (child.classList.contains("collapsible-content")) {
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
        
    waitForAnimation(collapsible).then( () => {
        collapsible.classList.toggle("hidden");
        collapsible.parentNode.style.pointerEvents = 'auto';
    });
}

initialize();
