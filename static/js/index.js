function app() {
    window.addEventListener("load", () => {
        addEventListeners();
    });
}

function addEventListeners() {
    const navMenuBars = document.getElementById('menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li');

    navLinksArray.forEach(link => {
        const mobileView = window.innerWidth < 768;
        
        link.addEventListener('click', () => {
            if (mobileView) {
                toggleMenu(navLinksContainer);
            }
        });
    });

    navMenuBars.addEventListener('click', () => {
        toggleMenu(navLinksContainer);
    });
    
    document.addEventListener('click', (event) => {
        const menuBars = document.getElementById('open-icon');
        const menuOpened = menuBars.classList.contains('hidden');
        const menuBarsClicked = navMenuBars.contains(event.target);
        
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

function toggleMenu(navLinksContainer){
    const menuBars = document.getElementById('open-icon');
    const closedBars = document.getElementById('close-icon');

    if (menuBars.classList.contains('hidden')) {
        menuBars.classList.remove('hidden');
        closedBars.classList.add('hidden');
    }
    else {
        menuBars.classList.add('hidden');
        closedBars.classList.remove('hidden');
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
