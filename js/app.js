const app = () => {
    Initialise();
}

const Initialise = () => {
    window.addEventListener("load", () => {
        AddEventListeners();
    });
}

AddEventListeners = () => {
    const navMenuBars = document.querySelector('.fa-bars');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li');

    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) ToggleMenu(navMenuBars, navLinksContainer);
        })
    })

    navMenuBars.addEventListener('click', () => {
        ToggleMenu(navMenuBars, navLinksContainer);
    })
}

ToggleMenu = (navMenuBars, navLinksContainer) => {
    navMenuBars.classList.toggle("fa-times");
    navLinksContainer.classList.toggle('nav-active');

    PerformAnimation();
}

PerformAnimation = () => {
    navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = "";
        }
        else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
        }
    });
}

app();
