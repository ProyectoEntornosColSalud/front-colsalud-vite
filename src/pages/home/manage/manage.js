import {API_BASE_URL} from "../../../config.js";

export function init() {
    loadUserAppointments()
}

window.cancelarCita = async (id) => {
    console.log("Cancelar cita con ID:", id);
    // Lógica de cancelación
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
            console.log(data)
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
                            <td> ${getActionButton(cita.appointmentId, cita.status)} </td>
                             `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Error fetching user appointments:", error);
    }

    function getActionButton(appointmentId, status) {
        switch (status) {
            case 'CANCELADA':
                return '<span class="text-secondary">Cancelada</span>';
            case 'ASISTIDA':
                return '<span class="text-success">Asistida</span>';
            default:
                return `<a class="text-danger link-underline-danger cancelar-cita" data-id="${appointmentId}" style="cursor: pointer" onclick="cancelarCita(${appointmentId})">Cancelar</a>`

        }
    }
}