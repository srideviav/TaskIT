"use client";

import { useState } from "react";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import TaskDetail from "@/src/components/TaskDetail";

export default function TasksPage() {
    useProtectedRoute();

    // 1. Manage the state for the modal
    const [isOpen, setIsOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<any>(null);

    return (
        <div className="flex flex-1 items-center justify-center bg-gray-50">
            {/* 2. Only render if currentTask exists (to satisfy TS) */}
            {currentTask && (
                <TaskDetail 
                    open={isOpen}
                    task={currentTask}
                    onClose={() => setIsOpen(false)}
                    onTaskUpdated={() => {/* refresh logic */}}
                />
            )}
            
            <button onClick={() => {
                setCurrentTask({ _id: "123", title: "Test" });
                setIsOpen(true);
            }}>
                View Task
            </button>
        </div>
    );
}