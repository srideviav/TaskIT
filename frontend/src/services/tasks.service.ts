import API from "../lib/axios";

interface Task {
    title: string,
    description: string,
    status: string,
    assignee: string,
}

export const createTask = async (task: Task) => {
    try {
        const response = await API.post(`/taskIt/tasks/create`, task);
        return response.data;
    } catch (error) {
        console.error("Failed to create task:", error);
        throw error;
    }
};

export const getAllTasks = async (projectId: String) => {
    try {
        const response = await API.get(`/taskIt/tasks/getAll/${projectId}`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch all tasks:", error);
        throw error;
    }
};

export const getTask = async (taskId: String) => {
    try {
        const response = await API.get(`/taskIt/tasks/getByProject/${taskId}`);
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch tasks by project:", error);
        throw error;
    }
};

export const updateTask = async (taskId: String, task: Task) => {
    try {
        const response = await API.put(`/taskIt/tasks/update/${taskId}`, task);
        return response.data;
    } catch (error) {
        console.error("Failed to update task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId: String) => {
    try {
        const response = await API.delete(`/taskIt/tasks/delete/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete task:", error);
        throw error;
    }
};