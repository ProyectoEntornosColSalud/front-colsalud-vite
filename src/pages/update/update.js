import {API_BASE_URL} from "../../config.js";

export function init() {
    loadValues()
    update()
}

const loadValues = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("name").value = data.name;
            document.getElementById("last_name").value = data.last_name;
            document.getElementById("genre").value = data.gender
            document.getElementById("birth_date").value = data.birth_date;
            document.getElementById("document_type").value = data.doc_type;
            document.getElementById("document_number").value = data.doc_number;
            document.getElementById("document_number").disabled = true;
            document.getElementById("email").value = data.email;
            document.getElementById("tel").value = data.phone;
        }
    } catch (error) {
        console.error("Error fetching user appointments:", error);
    }
}

const update = async () => {
    document.getElementById('btn_update').addEventListener('click', async (e) => {
        e.preventDefault()
        // Obtener los datos del formulario
        const documentType = document.getElementById("document_type").value;
        const name = document.getElementById("name").value;
        const lastName = document.getElementById("last_name").value;
        const genre = document.getElementById("genre").value;
        const birthDate = document.getElementById("birth_date").value;
        const email = document.getElementById("email").value;
        const tel = document.getElementById("tel").value;


        const request = {
            "name": name,
            "last_name": lastName,
            "gender": genre,
            "birth_date": birthDate,
            "doc_type": documentType,
            "email": email,
            "phone": tel,
        }
        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('Authorization')}`
                },
                body: JSON.stringify(request)
            });

            if (response.ok) {
                const span = document.getElementById('error_register_message')
                span.classList.remove('text-danger')
                span.classList.add('text-success')
                span.textContent = "Usuario actualizado correctamente"
                document.getElementById('btn_update').disabled = true
            } else {
                const errorData = await response.json();
                document.getElementById('error_register_message').textContent = errorData.message || "Error desconocido";
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
        }
    })
}

