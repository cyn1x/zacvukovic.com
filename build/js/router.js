import { dispatchEvent } from './events.js';

const findStaticRouteByPath = (path) => routes.staticRoutes.find(route => route.path === path);
const routeToRegexExpression = (path, route) => path.match(new RegExp(`^${route.path.replace(/:\w+/g, '(.+)')}$`));

const routes = {
    staticRoutes: [
        { path: 404, url: "/html/404.html" },
        { path: '/', url: '/html/portfolio.html' },
        { path: '/about', url: '/html/about.html' },
        { path: '/blog', url: '/html/blog.html' },
        { path: '/contact', url: '/html/contact.html' },
        { path: '/portfolio', url: '/html/portfolio.html' }
    ],
    dynamicRoutes: [
        { path: '/portfolio/:id', url: '/html/portfolio/:id.html' },
        { path: '/blog/:id', url: '/html/blog/:id.html' }
    ]
}

// Handle all links with the data-link attribute
async function route(event) {
    event = event || window.event;
    if (event.currentTarget.matches(".data-link")) {
        event.preventDefault();
        window.history.pushState({}, "", event.currentTarget.href);
        await handleLocation();
    }
}

async function handleLocation() {
    const path = window.location.pathname;

    // Check if the requested path matches a static route
    const staticRoute = findStaticRouteByPath(path);
    if (staticRoute) {
        await render(staticRoute.url);
        dispatchEvent(path);
        
        return;
    }

    // Check if the requested path matches a dynamic route
    const route = routes.dynamicRoutes.find(route => {
        const match = routeToRegexExpression(path, route);
        if (match) {
            route.url.replace(/:\w+/g, match[1]);
            
            return true;
        }
    });

    // If a dynamic route was found, fetch the data from the server and render the page
    if (route) {
        const match = routeToRegexExpression(path, route);
        const uri = route.url.replace(/:\w+/g, match[1]);
        
        const apiUrl = (typeof process !== 'undefined') ? uri : `/search${uri}`
        await fetch(apiUrl).then((res) => {
            if (res.status === 200) {
                render(uri);
                dispatchEvent(path);
            }
            else {
                // This dynamic route does not exist on the server
                render(findStaticRouteByPath(404).url);
            }
        });

        return;
    }
    
    // If no route was found, render the 404 page
    render(findStaticRouteByPath(404).url);
}

async function render(route) {
    const html = await fetch(route).then((data) => data.text());
    document.getElementsByTagName("main")[0].innerHTML = html;
    dispatchEvent('/render');
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
