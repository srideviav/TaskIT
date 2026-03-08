"use client";

import ProjectList from "@/src/components/ProjectList";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import useSocket from "@/src/hooks/useSocket";
import { AuthContext } from "@/src/context/authContext";
import { useContext } from "react";

export default function ProjectsPage(projectId:string) {
    const auth = useContext(AuthContext);
    const token = auth?.user?.token.toString();
     useProtectedRoute();
    useSocket(projectId,token);

    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            <ProjectList />
        </div>
    );
}