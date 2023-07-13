function App() {
    window.addEventListener("load", () => {
        AddEventListeners();
    });
}

function AddEventListeners() {
    const navMenuBars = document.querySelector('.fa-bars');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li');

    navLinksArray.forEach(link => {
        const mobileView = window.innerWidth < 768;
        
        link.addEventListener('click', () => {
            if (mobileView) {
                ToggleMenu(navMenuBars, navLinksContainer);
            }
        });
    });

    navMenuBars.addEventListener('click', () => {
        ToggleMenu(navMenuBars, navLinksContainer);
    });
    
    document.addEventListener('click', (event) => {
        const menuOpened = navMenuBars.classList.contains('fa-times');
        const menuBarsClicked = navMenuBars.contains(event.target);
        
        if (menuOpened) {
            if (!menuBarsClicked) {
                ToggleMenu(navMenuBars, navLinksContainer);
            }
        }
    });
}

function ToggleMenu(navMenuBars, navLinksContainer){
    navMenuBars.classList.toggle('fa-times');

    ShowMenuAnimation(navLinksContainer);
}

function ShowMenuAnimation(navLinksContainer) {
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

App();
