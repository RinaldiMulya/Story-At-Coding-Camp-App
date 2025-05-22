const BASE_URL = 'https://story-api.dicoding.dev/v1';

const register = async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    return response.json();
};

const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export default { register, login };
