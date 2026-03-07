"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useProtectedRoute = () => {
    const { user } = useAuth();
    const router = useRouter();
    console.log("ussssssssss",user)
    const token = user?.token;
    console.log("tooooooooooooooo",token)
    useEffect(() => {
        if (!token ) {
            router.push("/login");
        }
    }, [token, router]);
}