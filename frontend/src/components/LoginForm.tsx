"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData);
            login(data);
            console.log("Login successful:", data);
            router.push("/dashboard");
        }
        catch (error) {
            console.error("Login failed:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-xl w-96">
            <h2 className="text-2xl font-bold mb-6">
                Login
            </h2>
            <div className="flex flex-col gap-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />
                <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                    Login
                </button>
            </div>
        </form>
    );
}

