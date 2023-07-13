const contactPageEvent = new Event("contactPage");

function dispatchEvent(uri) {
    switch(uri) {
        case '/contact':
            document.dispatchEvent(contactPageEvent);
            break;
        default:
            break
    }
}

export { dispatchEvent }
