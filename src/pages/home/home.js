
export function initHome() {
    const scheduleButton = document.getElementById('schedule_btn');
    const manageButton = document.getElementById('manage_btn');
    const container = document.getElementById('home-content');

    async function loadSubView(path) {
        const jsPath = `${path}.js`;

        // Cargar el HTML
        const res = await fetch(`${path}.html`);
        container.innerHTML = await res.text();

        try {
            const module = await import(/* @vite-ignore */ jsPath);
            module.init();
        } catch (error) {
            console.error(`Error al cargar el script ${jsPath}:`, error);
        }
    }

    function setActive(buttonPressed) {
        if (buttonPressed === 'agendar') {
            scheduleButton.classList.replace('btn-secondary', 'btn-primary');
            manageButton.classList.replace('btn-primary', 'btn-secondary');
            loadSubView('/src/pages/home/schedule/schedule');
        } else {
            scheduleButton.classList.replace('btn-primary', 'btn-secondary');
            manageButton.classList.replace('btn-secondary', 'btn-primary');
            loadSubView('/src/pages/home/manage/manage');
        }
    }

    scheduleButton.addEventListener('click', () => setActive('agendar'));
    manageButton.addEventListener('click', () => setActive('gestionar'));

    setActive('agendar');
}