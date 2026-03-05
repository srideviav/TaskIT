"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../services/auth.service";
import { toast } from "react-toastify";

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
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
             const data =await registerUser(formData);
             if (data.message === "User already exists") {
                console.log("User already exists. Please login.");
                toast.error("User already exists. Please login.");
                return;
            }else {
                toast.success("Registration successful! Please login.");
                router.push("/login");
            }
            
        } catch (error) {
            console.error("Registration failed:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-[420px]">
            <h2 className="text-2xl font-bold mb-6">
                Create Account
            </h2>
            <div className="flex flex-col gap-4">

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />
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
                    Register
                </button>
            </div>
        </form>
    );
}