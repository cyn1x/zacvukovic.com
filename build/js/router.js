import { dispatchEvent } from './events.js';

const findStaticRouteByPath = (path) => routes.staticRoutes.find(route => route.path === path);

const routeToRegexExpression = (path) => {

    for (const route of Object.values(routes.dynamicRoutes)) {

        const regexPattern = route.path.replace(/:(\w+)/g, (_, name) => `(?<${name}>[^/]+)`);
        const regex = new RegExp(`^${regexPattern}$`);
        const match = path.match(regex);

        if (match?.groups)
            return route.url.replace(/:(\w+)/g, (_, name) => match.groups[name] || '');
    }

    return undefined;
};

const routes = {
    staticRoutes: [
        { path: 404, url: "/html/404.html" },
        { path: '/', url: '/html/about.html' },
        { path: '/about', url: '/html/about.html' },
        { path: '/now', url: '/html/now.html' },
        { path: '/portfolio', url: '/html/portfolio.html' },
        { path: '/contact', url: '/html/contact.html' },
        { path: '/blog', url: '/html/blog.html' },
    ],
    dynamicRoutes: [
        { path: '/portfolio/:id', url: '/html/portfolio/:id.html' },
        { path: '/blog/:year/:id', url: '/html/blog/:year/:id.html' },
    ]
};

// Handle all links with the data-link attribute
async function route(event) {
    event = event || window.event;
    if (event.currentTarget.matches(".data-link")) {
        event.preventDefault();
        const href = event.currentTarget.href ? event.currentTarget.href : event.currentTarget.value;
        window.history.pushState({}, "", href);
        await handleLocation();
    }
}

async function handleLocation() {
    const path = window.location.pathname;

    // Check if the requested path matches a static route
    const staticRoute = findStaticRouteByPath(path);
    if (staticRoute) {
        console.log(staticRoute.url);
        await render(staticRoute.url);
        dispatchEvent(path);

        return;
    }

    // Check if the requested path matches a dynamic route
    const uri = routeToRegexExpression(path);
    if (!uri) {
        render(findStaticRouteByPath(404).url);
        return;
    }

    const url = (typeof process !== 'undefined') ? uri : `/search${uri}`;
    await fetch(url).then((res) => {

        console.log(res);

        if (res.status === 200) {
            render(uri);
            dispatchEvent(path);

            return;
        }

        // This dynamic route does not exist on the server
        render(findStaticRouteByPath(404).url);
    });

}


async function render(route) {
    const main = document.getElementsByTagName("main");
    main[0].innerHTML = "<svg viewBox=\"0 0 100 100\" class=\"loading\"><circle></circle></svg>";

    const html = await fetch(route).then((data) => data.text());
    main[0].innerHTML = html;
    dispatchEvent('/render');
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
