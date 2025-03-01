import { animate, waitForAnimation } from './animate.js';

function app() {
    window.addEventListener("load", () => {
        addEventListeners();
    });
    
    // Detect preferred theme and set appropriate theme icon
    const darkThemeIcon = document.getElementById('dark-theme-icon');
    const lightThemeIcon = document.getElementById('light-theme-icon');

    // Prioritise saved theme from cache if already set by user. Otherwise, default to browser theme
    const savedPrefs = localStorage.getItem("theme");
    const browserPrefs = window.matchMedia("(prefers-color-scheme: dark)");

    const prefersDarkTheme = savedPrefs != null ? savedPrefs == "dark" : browserPrefs.matches;

    if (prefersDarkTheme) {
        document.body.classList.toggle("dark-theme");
        lightThemeIcon.parentNode.classList.add('hidden'); 
        darkThemeIcon.parentNode.classList.remove('hidden');
    } else {
        document.body.classList.toggle("light-theme");
        darkThemeIcon.parentNode.classList.add('hidden'); 
        lightThemeIcon.parentNode.classList.remove('hidden');
    }
}

function addEventListeners() {
    const navMenu = document.getElementById('menu-controls');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li');

    // Only monitor nav menu links for clicks when in mobile view
    navLinksArray.forEach(link => {
        const mobileView = window.innerWidth < 768;

        link.addEventListener('click', () => {
            if (mobileView) {
                toggleMenu(navMenu, navLinksContainer);
            }
        });
    });

    // Nav menu is used in mobile view
    navMenu.addEventListener('click', () => {
        toggleMenu(navMenu, navLinksContainer);
    });

    

    // Catch-all event listener for clicks
    document.addEventListener('click', (event) => {
        const menuBars = document.getElementById('open-icon');
        const menuOpened = menuBars.classList.contains('hidden');
        const menuBarsClicked = navMenu.contains(event.target);

        if (event.target.parentNode.classList.contains("theme-icon-container")) {
            animateThemeIcon(event.target.parentNode.id);
            toggleTheme();
            return;
        }

        if (menuOpened) {
            // Pointer events not tied to the menu icon still closes the menu
            if (!menuBarsClicked) {
                toggleMenu(navMenu, navLinksContainer);
            }
        }
    });

    // Always scroll to the top when navigating pages
    document.addEventListener(
        "onRender",
        () => {
            document.body.scrollTo(0, 0);
        },
        false
    );
}

function toggleTheme() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (prefersDarkScheme.matches) {
        document.body.classList.toggle("light-theme");
        var theme = document.body.classList.contains("light-theme")
            ? "light"
            : "dark";
    } else {
        document.body.classList.toggle("dark-theme");
        theme = document.body.classList.contains("dark-theme")
            ? "dark"
            : "light";
    }
    localStorage.setItem("theme", theme);
}

function animateThemeIcon(id) {
    const darkThemeIcon = document.getElementById('dark-theme-icon');
    const lightThemeIcon = document.getElementById('light-theme-icon'); 

    if (id === "dark-theme-container") {
        darkThemeIcon.parentNode.style.animation = `iconFadeOut 0.25s ease forwards`;
         
        waitForAnimation(darkThemeIcon.parentNode).then( () => {
            darkThemeIcon.parentNode.classList.add('hidden'); 
            lightThemeIcon.parentNode.classList.remove('hidden');
            lightThemeIcon.parentNode.style.animation = `iconFadeIn 0.25s ease forwards`;
        });
    }
    else {
        lightThemeIcon.parentNode.style.animation = `iconFadeOut 0.25s ease forwards`;
        
        waitForAnimation(lightThemeIcon.parentNode).then( () => {
            lightThemeIcon.parentNode.classList.add('hidden'); 
            darkThemeIcon.parentNode.classList.remove('hidden');
            darkThemeIcon.parentNode.style.animation = `iconFadeIn 0.25s ease forwards`;
        });
    }
}

function toggleMenu(navMenu, navLinksContainer) {
    const menuBars = document.getElementById('open-icon');
    const closedBars = document.getElementById('close-icon');

    // Prevent animation from being aborted if clicked again too quickly
    navMenu.style.pointerEvents = 'none';

    if (menuBars.classList.contains('hidden')) {
        animate(closedBars, `scaleOut 0.3s ease forwards`);

        waitForAnimation(closedBars).then( () => {
            menuBars.classList.remove('hidden');
            menuBars.parentNode.classList.remove('hidden');
            closedBars.classList.add('hidden');
            closedBars.parentNode.classList.add('hidden');
            menuBars.style.animation = `scaleIn 0.3s ease forwards`;

            navMenu.style.pointerEvents = 'auto';
        });
    }
    else {
        animate(menuBars, `scaleOut 0.3s ease forwards`);
        
        waitForAnimation(menuBars).then( () => {
            closedBars.classList.remove('hidden');
            closedBars.parentNode.classList.remove('hidden');
            menuBars.classList.add('hidden');
            menuBars.parentNode.classList.add('hidden');
            closedBars.style.animation = `scaleIn 0.3s ease forwards`;
    
            navMenu.style.pointerEvents = 'auto';
        });
    }

    showMenuAnimation(navLinksContainer);
}

function showMenuAnimation(navLinksContainer) {
    const navLinks = document.querySelectorAll('.nav-links li');

    animate(navLinksContainer, `navMenuFade 0.5s ease forwards`);

    navLinks.forEach((link, index) => {
        animate(link, `navLinkFade 0.5s ease forwards ${index / 7 + 0.25}s`);
    });
}

app();
