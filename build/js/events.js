const onRenderEvent = new Event("onRender");
const contactPageEvent = new Event("contactPage");
const nowPageEvent = new Event("nowPage");
const portfolioPageEvent = new Event("portfolioPage");

function dispatchEvent(uri) {
    switch (uri) {
    case '/render':
        document.dispatchEvent(onRenderEvent);
        break;
    case '/portfolio':
        document.dispatchEvent(portfolioPageEvent);
        break;
    case '/now':
        document.dispatchEvent(nowPageEvent);
        break;
    case '/contact':
        document.dispatchEvent(contactPageEvent);
        break;
    default:
        break;
    }
}

export { dispatchEvent };
