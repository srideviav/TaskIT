import { useEffect, useState } from "react";
import { 
    initSocket, 
    getSocket, 
    joinProject as joinProjectSocket,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    offTaskCreated,
    offTaskUpdated,
    offTaskDeleted,
} from "../lib/socket";
import { Socket } from "socket.io-client";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = initSocket();
        setSocket(socketInstance);

        if (socketInstance) {
            const handleConnect = () => setIsConnected(true);
            const handleDisconnect = () => setIsConnected(false);

            socketInstance.on("connect", handleConnect);
            socketInstance.on("disconnect", handleDisconnect);

            if (socketInstance.connected) {
                setIsConnected(true);
            }

            return () => {
                socketInstance.off("connect", handleConnect);
                socketInstance.off("disconnect", handleDisconnect);
            };
        }
    }, []);

    const joinProject = (projectId: string) => {
        if (socket?.connected) {
            joinProjectSocket(projectId);
        }
    };

    return { socket, isConnected, joinProject };
};

export const useTaskSocket = (onTaskCreatedCallback?: (task: any) => void, onTaskUpdatedCallback?: (task: any) => void, onTaskDeletedCallback?: (task: any) => void) => {
    useEffect(() => {
        initSocket();
        
        if (onTaskCreatedCallback) {
            onTaskCreated(onTaskCreatedCallback);
            return () => offTaskCreated(onTaskCreatedCallback);
        }
    }, [onTaskCreatedCallback]);

    useEffect(() => {
        if (onTaskUpdatedCallback) {
            onTaskUpdated(onTaskUpdatedCallback);
            return () => offTaskUpdated(onTaskUpdatedCallback);
        }
    }, [onTaskUpdatedCallback]);

    useEffect(() => {
        if (onTaskDeletedCallback) {
            onTaskDeleted(onTaskDeletedCallback);
            return () => offTaskDeleted(onTaskDeletedCallback);
        }
    }, [onTaskDeletedCallback]);
};
