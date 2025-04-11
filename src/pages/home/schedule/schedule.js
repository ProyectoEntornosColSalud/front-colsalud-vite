import {API_BASE_URL} from "../../../config.js";

let selectedSpecialty = {id: 0, name: ''};
let selectedDoctor = {id: 0, name: ''};
let selectedDate;

export function init() {
    fetchSpecialties()
    fetchDoctorsBySpecialtyEvent()
    schedule()
    filter()
}

const fetchSpecialties = async () => {
    const select = document.getElementById("select_especialidad");
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/specialties`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            data.forEach(specialty => {
                const option = document.createElement("option");
                option.value = specialty.id;
                option.text = specialty.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error fetching specialties:", error);
    }
}


const fetchDoctorsBySpecialtyEvent = async () => {
    const select = document.getElementById("select_especialidad");
    select.addEventListener("change", async (event) => {
        const specialtyId = event.target.value
        selectedSpecialty['id'] = specialtyId
        selectedSpecialty['name'] = event.target.options[event.target.selectedIndex].text;
        const lista = document.getElementById('div_doctors')
        lista.innerHTML = 'Cargando ...'
        document.getElementById('filtro').classList.add('d-none')
        const datesContainer = document.getElementById("dates_list")
        datesContainer.innerHTML = 'Selecciona un doctor para consultar horarios disponibles';
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/doctors?specialty=${specialtyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                lista.innerHTML = '';
                data.forEach(doctor => {
                    const doctorOption = document.createElement('div');
                    doctorOption.classList.add('card', 'card-body', 'cursor-pointer')
                    doctorOption.style.cursor = 'pointer';
                    doctorOption.textContent = doctor.name;
                    doctorOption.dataset.id = doctor.id;
                    // 👉 Evento para cuando se hace clic en un doctor
                    doctorOption.addEventListener('click', async () => {
                        selectedDoctor['id'] = doctor.id
                        selectedDoctor['name'] = doctor.name
                        document.getElementById('filtro').classList.add('d-none')
                        await cargarHorarios(doctor.id);
                    });

                    lista.appendChild(doctorOption);
                });
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    });
}

const cargarHorarios = async (doctorId, day) => {
    const filter = document.getElementById('filtro')
    const datesContainer = document.getElementById("dates_list")
    datesContainer.innerHTML = 'Cargando ...';

    try {
        const response = await fetch(`${API_BASE_URL}/appointments/dates?doctor=${doctorId}&day=${day || ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            },
        });

        if (response.ok) {
            datesContainer.innerHTML = '';
            const data = await response.json()
            const dates = data.available;
            filter.classList.remove('d-none')

            dates.forEach(isoDate => {
                const fecha = new Date(isoDate);

                const dia = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });

                const hora = fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });

                const item = document.createElement('div');
                item.classList.add('card', 'card-body', 'horario_option', 'cursor-pointer', 'text-center');
                item.style.cursor = 'pointer';
                item.textContent = `${dia} - ${hora}`;
                item.addEventListener('click', () => {
                    selectedDate = isoDate
                    const modalBody = document.querySelector('#staticBackdrop .modal-body');
                    modalBody.textContent = `Vas a agendar la cita para ${selectedSpecialty['name']} con el doctor(a) ${selectedDoctor['name']} el ${dia} a las ${hora}`;
                    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
                    modal.show();
                    document.getElementById('staticBackdrop').focus();
                });
                datesContainer.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
}

const schedule = () => {
    const btn = document.getElementById('agendar_btn')
    btn.addEventListener(
        'click', async () => {
            const response = await fetch(`${API_BASE_URL}/appointments/schedule?doctor=${selectedDoctor["id"]}&specialty=${selectedSpecialty["id"]}&date=${selectedDate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
                },
            });

            if (response.ok) {
                // Cerrar el modal
                const modalElement = document.getElementById('staticBackdrop');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
                const toastElement = document.getElementById('snackbar');
                const toast = new bootstrap.Toast(toastElement);
                toast.show();
                cargarHorarios(selectedDoctor['id'])
            }
        }
    )
}

const filter = async () => {
    const inputDia = document.getElementById("filtro_dia");

    function getMinFecha() {
        const now = new Date();
        const hora = now.getHours();

        // Si son las 7 PM (19) o más, usar mañana como mínimo
        if (hora >= 19) {
            now.setDate(now.getDate() + 1);
        }

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }

    // Al cargar la página, setear min
    inputDia.min = getMinFecha();
    const clearFilterBtn = document.getElementById('clean_filter_btn')
    inputDia.addEventListener("change", async () => {
        if (!inputDia.value)
            clearFilterBtn.classList.add('d-none')
        else
            clearFilterBtn.classList.remove('d-none')
        await cargarHorarios(selectedDoctor['id'], inputDia.value);
    })
    clearFilterBtn.addEventListener("click", async (event) => {
        event.preventDefault()
        inputDia.value = ''
        await cargarHorarios(selectedDoctor['id'])
    })
}
