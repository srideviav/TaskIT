import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const initSocket = () => {
    if (socket?.connected) {
        return socket;
    }

    const token = getToken();
    if (!token) {
        console.warn("No token available for socket connection");
        return null;
    }

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", {
        auth: {
            token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const joinProject = (projectId: string) => {
    if (socket?.connected) {
        socket.emit("joinProject", projectId);
        console.log(`Joined project: ${projectId}`);
    } else {
        console.warn("Socket not connected");
    }
};

// Task-related socket events
export const onTaskCreated = (callback: (task: any) => void) => {
    if (socket) {
        socket.on("taskCreated", callback);
    }
};

export const onTaskUpdated = (callback: (task: any) => void) => {
    if (socket) {
        socket.on("taskUpdated", callback);
    }
};

export const onTaskDeleted = (callback: (task: any) => void) => {
    if (socket) {
        socket.on("taskDeleted", callback);
    }
};

// Remove task event listeners
export const offTaskCreated = (callback: (task: any) => void) => {
    if (socket) {
        socket.off("taskCreated", callback);
    }
};

export const offTaskUpdated = (callback: (task: any) => void) => {
    if (socket) {
        socket.off("taskUpdated", callback);
    }
};

export const offTaskDeleted = (callback: (task: any) => void) => {
    if (socket) {
        socket.off("taskDeleted", callback);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
