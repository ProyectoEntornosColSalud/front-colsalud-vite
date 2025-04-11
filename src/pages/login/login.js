import {API_BASE_URL} from "../../config.js";
import {navigate} from "../../main.js"

export function init() {
    document.getElementById("submit_btn").addEventListener('click', async (e) => {
        e.preventDefault();

        const username = document.getElementById('document_number').value;
        const password = document.getElementById('password').value;
        const body = JSON.stringify({username, password})

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: body
        });

        if (response.ok) {
            localStorage.setItem("Authorization", response.headers.get('Authorization'))
            navigate("/citas")
        } else {
            document.getElementById('document_number').classList.add('border', 'border-success-subtle');
            document.getElementById('msg').innerText = 'Información incorrecta, por favor verifique sus credenciales';
            document.getElementById('password').classList.add('border', 'border-success-subtle');
            console.error('Login failed');
        }
    });

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
}


