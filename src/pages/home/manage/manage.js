import {API_BASE_URL} from "../../../config.js";

export function init() {
    loadUserAppointments()
    addCancelAction()
}

const askForCancelAppointment = (id) => {
    // Insertar contenido dinámico en el modal
    const modalBody = document.querySelector('#staticBackdrop .modal-body');
    modalBody.textContent = `¿Estás seguro de que deseas cancelar la cita?`;
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    modal.show();
    document.getElementById('staticBackdrop').focus();
}


const loadUserAppointments = async () => {

    try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            const loadingSpan = document.getElementById("loading");
            if (!loadingSpan) return;
            if (data.length === 0) {
                loadingSpan.innerText = 'Parece que no tienes citas programadas'
                return
            }
            loadingSpan.classList.add('d-none')
            document.getElementById('table-container').classList.remove('d-none')
            const tbody = document.querySelector("table tbody");
            tbody.innerHTML = '';
            data.forEach((cita, index) => {
                const fecha = new Date(cita.time);
                const dia = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });
                const hora = fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                });

                const row = document.createElement("tr");
                row.innerHTML = `
                        <td>${cita.specialtyName}</td>
                        <td>${cita.doctorName}</td>
                        <td>${dia}</td>
                        <td>${hora}</td>
                    `;

                const actionTd = document.createElement('td');
                if (cita.status === 'CANCELADA') {
                    actionTd.innerHTML = '<span class="text-secondary fw-bold">Cancelada</span>';
                } else if (cita.status === 'PERDIDA') {
                    actionTd.innerHTML = '<span class="text-danger fw-bold">Perdida</span>';
                } else if (cita.status === 'ASISTIDA') {
                    actionTd.innerHTML = '<span class="text-success fw-bold">Asistida</span>';
                } else {
                    const cancelLink = document.createElement('a');
                    cancelLink.textContent = 'Cancelar';
                    cancelLink.href = '#';
                    cancelLink.classList.add('text-danger', 'link-underline-danger');
                    cancelLink.style.cursor = 'pointer';
                    cancelLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        const btn = document.getElementById('cancelar_btn')
                        btn.dataset.ap_id = cita.appointmentId
                        askForCancelAppointment(cita.appointmentId);
                    });
                    actionTd.appendChild(cancelLink);
                }
                row.appendChild(actionTd);
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error fetching user appointments:", error);
    }
}

const addCancelAction = () => {
    const btn = document.getElementById('cancelar_btn')
    btn.addEventListener(
        'click', async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/appointments/cancel?appointment=${btn.dataset.ap_id}`, {
                    method: 'PUT', headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
                    },
                });
                if (response.ok) {
                    const modalElement = document.getElementById('staticBackdrop');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                    const toastElement = document.getElementById('snackbar');
                    const toast = new bootstrap.Toast(toastElement);
                    toast.show();
                    loadUserAppointments()
                }
            } catch (error) {
                console.error("Error fetching user appointments:", error);
            }
        }
    )
}
