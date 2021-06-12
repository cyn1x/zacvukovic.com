require('dotenv').config()

const App = () => {
    Initialise();
}

const Initialise = () => {
    window.addEventListener("load", () => {
        AddEventListeners()
    });
}

const AddEventListeners = () => {
    const navMenuBars = document.querySelector('.fa-bars')
    const navLinksContainer = document.querySelector('.nav-links')
    const navLinksArray = document.querySelectorAll('.nav-links li')
    const contactForm = document.getElementById('contact-form')

    navLinksArray.forEach(link => {
        const mobileView = window.innerWidth < 768;
        
        link.addEventListener('click', () => {
            if (mobileView) ToggleMenu(navMenuBars, navLinksContainer)
        });
    });

    navMenuBars.addEventListener('click', () => {
        ToggleMenu(navMenuBars, navLinksContainer)
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault()

        handleSubmit(event.target)
    })

    document.addEventListener('click', (event) => {
        const menuOpened = navMenuBars.classList.contains('fa-times')
        const menuBarsClicked = navMenuBars.contains(event.target)

        if (menuOpened)
            if (!menuBarsClicked)
                ToggleMenu(navMenuBars, navLinksContainer)
    });
}

const ToggleMenu = (navMenuBars, navLinksContainer) => {
    navMenuBars.classList.toggle('fa-times')
    navLinksContainer.classList.toggle('nav-active')

    PerformAnimation(navLinksContainer);
}

const PerformAnimation = (navLinksContainer) => {
    navLinks = document.querySelectorAll('.nav-links li')

    controlAppearance(navLinksContainer, `navMenuFade 0.5s ease forwards`)

    navLinks.forEach((link, index) => {
        controlAppearance(link, `navLinkFade 0.5s ease forwards ${index / 7 + 0.25}s`)
    });
}

const controlAppearance = (item, animation) => {
    if (item.style.animation) item.style.animation = ""
    else item.style.animation = `${animation}`
}

const handleSubmit = (formData) => {
    const captcha = document.getElementById('g-recaptcha-response')

    if (captcha.value === "" || captcha.value === null || captcha.value === undefined) {

        return
    }

    sendMessage(formData, captcha.value)
}

const sendMessage = (formData, captchaValue) => {
    const sendButton = document.getElementById('send-button')

    sendButton.innerHTML = ('<i class="fa fa-circle-o-notch fa-spin"></i>Sending')
    sendButton.setAttribute('disabled', 'true')

    fetch(process.env.CONTACT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fname: formData.fname.value,
            lname: formData.lname.value,
            email: formData.email.value,
            subject: formData.subject.value,
            body: formData.body.value,
            captcha: captchaValue
        })
    }).then((data) => {
        if (data.status === 200) {
            sendButton.innerHTML = '<i class="fas fa-check"></i>Sent'
            handleSuccess(formData, sendButton)

            return
        }

        sendButton.innerHTML = '<i class="fas fa-times"></i>Error'
        sendButton.removeAttribute('disabled')
        handleError(sendButton)
    })
}

const handleSuccess = (formData, sendButton) => {
    setTimeout(() => {
        formData.reset()
        sendButton.innerHTML = "Send"
        sendButton.removeAttribute('disabled')
    }, 5000);
}

const handleError = (sendButton) => {
    setTimeout(() => {
        sendButton.innerHTML = "Send"
        sendButton.removeAttribute('disabled')
    }, 5000);
}

App()
