const routes = {
    '/citas': {view: '/src/pages/home/home.html'},
    '/ingresar': {view: '/src/pages/login/login.html'},
    '/registrarse': {view: '/src/pages/register/register.html'}
};

const routeModules = {
    '/citas': async () => {
        const module = await import('./pages/home/home.js');
        module.initHome();
    },
    '/ingresar': () => import('./pages/login/login.js'),
    '/registrarse': () => import('./pages/register/register.js')
};

async function loadView(path) {
    let route = routes[path];
    if (!route) return;

    const res = await fetch(route.view);
    document.getElementById('app').innerHTML = await res.text();

    if (routeModules[path]) {
        routeModules[path]();
    }
}

export function navigate(path) {
    const finalPath = routes[path] ? path : '/citas';
    history.pushState(null, null, finalPath);
    loadView(finalPath);
}

// Interceptar clics en links con data-link
document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        navigate(e.target.getAttribute('href'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    navigate(location.pathname);
});

window.addEventListener('popstate', () => {
    navigate(location.pathname);
});