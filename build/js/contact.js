function Initialize() {
    document.addEventListener(
        "contactPage",
        (e) => {
            createCaptchaTickbox();
            addEventListeners();
        },
        false
    );
}

function addEventListeners() {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        handleSubmit(event.target);
    });
}

function createCaptchaTickbox() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    document.body.appendChild(script);
}

function handleSubmit(formData) {
    const captcha = document.getElementById('g-recaptcha-response');
    const infoResult = document.getElementById('info-result');
    const successResult = document.getElementById('success-result');
    const errorResult = document.getElementById('error-result');

    infoResult.classList.add('hidden');
    successResult.classList.add('hidden');
    errorResult.classList.add('hidden');

    const invalidCaptcha = captcha.value === "" || captcha.value === null || captcha.value === undefined;
    
    if (!invalidCaptcha) {
        sendMessage(formData, captcha.value);
    }
    else {
        infoResult.classList.remove('hidden');
    }
}

async function sendMessage(formData, captchaValue) {
    const contactForm = document.getElementById('contact-form');
    const sendButton = document.getElementById('submit');
    const apiUrl = contactForm.getAttribute('action');
    const successResult = document.getElementById('success-result');
    const errorResult = document.getElementById('error-result');

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fname: formData.fname.value,
            lname: formData.lname.value,
            email: formData.email.value,
            subject: formData.subject.value,
            body: formData.message.value,
            captcha: captchaValue
        })
    }).then((data) => {
        if (data.status === 200) {
            successResult.classList.remove('hidden')
            handleSuccess(formData);
        }
        else {
            errorResult.classList.remove('hidden');
        }
        sendButton.innerHTML = "Send"
        sendButton.removeAttribute('disabled')
    });
}

function handleSuccess(formData) {
    formData.reset();
    grecaptcha.reset();
}

Initialize();
