"use client";

import ProjectList from "@/src/components/ProjectList";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";

export default function ProjectsPage() {
    // useProtectedRoute();
    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            <ProjectList />
        </div>
    );
}