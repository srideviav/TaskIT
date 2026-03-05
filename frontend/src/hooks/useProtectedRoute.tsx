import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useProtectedRoute = () => {
    const { user } = useAuth();
    const router = useRouter();

    const token = user?.token;
    useEffect(() => {
        if (!token ) {
            router.push("/login");
        }
    }, [token, router]);
}