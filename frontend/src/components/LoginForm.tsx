"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use Link for faster navigation
import { loginUser } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";
import { message } from "antd";

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false); // Track request status

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
        setLoading(true); // Start loading

        try {
            const signIn = await loginUser(formData);

            if (signIn.message === "Invalid email or password") {
                message.error("Invalid email or password");
                return;
            }
            const data = signIn.data;
            console.log("data login :", data)
            login(data);
            message.success("Logged in successfully!");
            router.push("/projects");
        } catch (error: any) {
            message.error(error.response?.data?.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-xl w-96">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <div className="flex flex-col gap-4">
                <input
                    type="email"
                    name="email"
                    required // Simple HTML5 validation
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                    disabled={loading}
                    className={`p-3 rounded-lg text-white transition-colors ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="flex items-center gap-2 mt-2">
                    <span className="text-gray-600">Don't have an account?</span>
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Register here
                    </Link>
                </div>
            </div>
        </form>
    );
}