const onRenderEvent = new Event("onRender");
const contactPageEvent = new Event("contactPage");

function dispatchEvent(uri) {
    switch(uri) {
        case '/contact':
            document.dispatchEvent(contactPageEvent);
            break;
        case '/render':
            document.dispatchEvent(onRenderEvent);
            break;
        default:
            break;
    }
}

export { dispatchEvent }
