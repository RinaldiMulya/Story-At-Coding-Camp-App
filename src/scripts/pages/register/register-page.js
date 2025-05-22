import AuthAPI from '../../api/authApi';
import { saveToken } from '../../utils/index';

export default class RegisterPage {
    async render() {
        return `
        <section class="container max-w-md mx-auto py-10">
            <h2 class="text-2xl font-bold mb-4">Register</h2>
            <form id="registerForm" class="space-y-4">
                <input type="text" name="username" placeholder="Name" required class="w-full p-2 border rounded" />
                <input type="email" name="email" placeholder="Email" required class="w-full p-2 border rounded" />
                <input type="password" name="password" placeholder="Password" required class="w-full p-2 border rounded" />
                <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded">Register</button>
            </form>
        </section>
    `;
    }

    async afterRender() {
        const form = document.querySelector('#registerForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = form.username.value;
            const email = form.email.value;
            const password = form.password.value;

            const result = await AuthAPI.register(username, email, password);
            if (!result.error) {
                alert('Registrasi berhasil! Silakan login.');
                window.location.hash = '#/login'; // redirect ke halaman login
            } else {
                alert('Registrasi gagal: ' + result.message);
            }
        });
    }
}
