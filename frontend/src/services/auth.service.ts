import API from "../lib/axios";

interface Register {
    name: string,
    email: string,
    password: string
}

interface Login {
    email:string,
    password:string
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
        console.log("Login response in auth service:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed in auth service:", error);
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await API.get('/taskIt/users/allUsers');
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch users in auth service:", error);
        throw error;
    }
}