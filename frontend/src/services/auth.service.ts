import API from "../lib/axios";

interface Register {
    name: String,
    email: String,
    password: String
}

interface Login {
    email: String,
    password: String
}

export const registerUser = async (user: Register) => {
    try {
        const response = await API.post('/taskIt/users/register', user);
        return response.data;
    } catch (error) {
        console.error("Registration failed in auth service:", error);
        throw error;
    }
}

export const loginUser = async (user: Login) => {
    try {
        const response = await API.post('/taskIt/users/login', user);
        return response.data.data;
    } catch (error) {
        console.error("Login failed in auth service:", error);
        throw error;
    }
}