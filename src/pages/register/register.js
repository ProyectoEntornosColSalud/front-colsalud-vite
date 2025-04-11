import {API_BASE_URL} from "../../config.js";
import {navigate} from "../../main.js";

export function init() {
    // Establecer valores por defecto en los inputs
    document.getElementById("document_type").value = "CC";
    document.getElementById("document_number").value = "1234567890";
    document.getElementById("name").value = "Nombre";
    document.getElementById("last_name").value = "Apellido";
    document.getElementById("genre").value = "hombre";
    document.getElementById("birth_date").value = "2000-01-01";
    document.getElementById("email").value = "correo@example.com";
    document.getElementById("tel").value = "1234567890";
    document.getElementById("password").value = "password123";
    document.getElementById("password_confirm").value = "password123";
    addFormSubmitEvent();
    addToggleShowPasswordButtonEvent();
}


function addFormSubmitEvent() {
    const errorRegisterMessage = document.getElementById("error_register_message")
    document.getElementById("form_register").addEventListener("submit", async function (event) {
        event.preventDefault();


        // Obtener los datos del formulario
        const documentType = document.getElementById("document_type").value;
        const documentNumber = document.getElementById("document_number").value;
        const name = document.getElementById("name").value;
        const lastName = document.getElementById("last_name").value;
        const genre = document.getElementById("genre").value;
        const birthDate = document.getElementById("birth_date").value;
        const email = document.getElementById("email").value;
        const tel = document.getElementById("tel").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password_confirm").value;


        const request = {
            "doc_type": documentType,
            "doc_number": documentNumber,
            "name": name,
            "last_name": lastName,
            "birth_date": birthDate,
            "gender": genre,
            "email": email,
            "phone": tel,
            "password": password
        }
        if (password !== passwordConfirm) {
            errorRegisterMessage.textContent = "las contraseñas no coinciden"
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request)
            });

            if (response.ok) {
                navigate("/citas")
            } else {
                const errorData = await response.json();
                errorRegisterMessage.textContent = errorData.message || "Error desconocido";
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            errorRegisterMessage.textContent = "No se pudo conectar con el servidor.";
        }
    });
}


function addToggleShowPasswordButtonEvent() {
    document.getElementById("toggle_password").addEventListener("click", function () {
        const passwordInput = document.getElementById("password");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.textContent = "🔒";
        } else {
            passwordInput.type = "password";
            this.textContent = "👀";
        }
    });

    document.getElementById("toggle_password_confirm").addEventListener("click", function () {
        const passwordInput = document.getElementById("password_confirm");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.textContent = "🔒";
        } else {
            passwordInput.type = "password";
            this.textContent = "👀";
        }
    });
}


let today = new Date();
let maxDate = today.toISOString().split('T')[0]; // Fecha máxima (hoy)
let minDate = new Date(today.getFullYear() - 127, today.getMonth(), today.getDate())
    .toISOString().split('T')[0]; // Fecha mínima (18 años atrás)

let birthdateInput = document.getElementById("birth_date");
birthdateInput.setAttribute("max", maxDate); // Restringe fecha futura
birthdateInput.setAttribute("min", minDate); // Restringe menores de 18