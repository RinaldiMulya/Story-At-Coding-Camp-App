import AuthAPI from '../../api/authApi';
import { saveToken } from '../../utils/index';

export default class LoginPage {
    async render() {
        return `
        <section class="container max-w-md mx-auto py-10">
            <h2 class="text-2xl font-bold mb-4">Login</h2>
            <form id="loginForm" class="space-y-4">
            <input type="email" name="email" placeholder="Email" required class="w-full p-2 border rounded" />
            <input type="password" name="password" placeholder="Password" required class="w-full p-2 border rounded" />
            <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded">Login</button>
            </form>
            <h2>Belum punya akun? <a href="#/register" class="text-blue-600">Daftar di sini</a></h2>
        </section>
    `;
    }

    async afterRender() {
        const form = document.querySelector('#loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.email.value;
            const password = form.password.value;

            const result = await AuthAPI.login(email, password);
            if (!result.error) {
                saveToken(result.loginResult.token);
                alert('Login berhasil!');
                window.location.href = '/'; // redirect ke home
            } else {
                alert('Login gagal: ' + result.message);
            }
        });
    }
}
