"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useProtectedRoute = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait for auth to finish loading from localStorage
        if (loading) return;
        
        // If no user after loading, redirect to login
        if (!user || !user.token) {
            router.push("/login");
        }
    }, [loading, user, router]);
}