const routes = {
    404: "/html/404.html",
    "/": "/html/portfolio.html",
    "/portfolio": "/html/portfolio.html",
    "/about": "/html/about.html",
    "/blog": "/html/blog.html",
    "/contact": "/html/contact.html"
}

const route = (event) => {
    event = event || window.event;
    if (event.target.matches("[data-link]")) {
        event.preventDefault();
        window.history.pushState({}, "", event.target.href);
        handleLocation();
    }
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
