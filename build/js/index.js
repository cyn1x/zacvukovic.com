function app() {
    window.addEventListener("load", () => {
        addEventListeners();
    });

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme == "dark") {
        document.body.classList.toggle("dark-theme");
    } else if (currentTheme == "light") {
        document.body.classList.toggle("light-theme");
    }
}

function addEventListeners() {
    const navMenu = document.getElementById('menu-controls');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li');
    const themeIcon = document.getElementById('theme-icon');

    navLinksArray.forEach(link => {
        const mobileView = window.innerWidth < 768;
        
        link.addEventListener('click', () => {
            if (mobileView) {
                toggleMenu(navLinksContainer);
            }
        });
    });

    navMenu.addEventListener('click', () => {
        toggleMenu(navLinksContainer);
    });
    
    document.addEventListener('click', (event) => {
        const menuBars = document.getElementById('open-icon');
        const menuOpened = menuBars.classList.contains('hidden');
        const menuBarsClicked = navMenu.contains(event.target);

        if (event.target === themeIcon) {
            toggleTheme();
            return;
        }
        
        if (menuOpened) {
            if (!menuBarsClicked) {
                toggleMenu(navLinksContainer);
            }
        }
    });

    document.addEventListener(
        "onRender",
        (e) => {
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
        var theme = document.body.classList.contains("dark-theme")
          ? "dark"
          : "light";
      }
      localStorage.setItem("theme", theme);
}

function toggleMenu(navLinksContainer){
    const menuBars = document.getElementById('open-icon');
    const closedBars = document.getElementById('close-icon');
    const themeIcon = document.getElementById('theme-icon');

    if (menuBars.classList.contains('hidden')) {
        menuBars.classList.remove('hidden');
        closedBars.classList.add('hidden');

        themeIcon.style.animation = `iconFadeOut 0.25s ease forwards`;
    }
    else {
        menuBars.classList.add('hidden');
        closedBars.classList.remove('hidden');

        themeIcon.style.animation = `iconFadeIn 0.25s ease forwards`;
    }

    showMenuAnimation(navLinksContainer);
}

function showMenuAnimation(navLinksContainer) {
    const navLinks = document.querySelectorAll('.nav-links li');

    controlAppearance(navLinksContainer, `navMenuFade 0.5s ease forwards`);

    navLinks.forEach((link, index) => {
        controlAppearance(link, `navLinkFade 0.5s ease forwards ${index / 7 + 0.25}s`);
    });
}

function controlAppearance(item, animation) {
    if (item.style.animation) item.style.animation = "";
    else item.style.animation = `${animation}`;
}

app();
