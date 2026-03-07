"use client";

import MembersList from "@/src/components/MembersList";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";

export default function UsersPage() {
    useProtectedRoute();
    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            <MembersList />
        </div>
    );
}