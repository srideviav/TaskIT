"use client";

import { useEffect, useState, useRef } from "react";
import { connectSocket, getSocket } from "../lib/socket";

interface Member {
    userId: string;
    name: string;
}

const useSocket = (projectId: {projectId:string}, token: string) => {

    const [activeMembers, setActiveMembers] = useState<Member[]>([]);
    const hasJoinedRef = useRef<string | null>(null);
    const socketRef = useRef<any>(null);

    console.log("projectId :", projectId.projectId)

    useEffect(() => {
        if(!projectId?.projectId || !token) return;

        socketRef.current = connectSocket(token);
        const socket = socketRef.current;
        
        const handleActiveMember = (members: Member[]) => {
            console.log("active members received:", members);
            setActiveMembers(members);
        };

        // Add listener
        socket.on("activeMember", handleActiveMember);

        const joinProject = () => {
            console.log("Attempting to join project:", projectId.projectId);
            socket.emit("joinProject", projectId.projectId, token);
            hasJoinedRef.current = projectId.projectId;
        };

        // Join if we haven't joined this project OR if we need to rejoin
        if(hasJoinedRef.current !== projectId.projectId){
            if(socket.connected){
                joinProject();
            } else {
                // Wait for connection
                const onConnect = () => {
                    joinProject();
                    socket.off("connect", onConnect);
                };
                socket.on("connect", onConnect);
            }
        }
        
        return () => {
            // Only leave the project, don't disconnect the socket
            if(hasJoinedRef.current === projectId.projectId){
                try {
                    socket.emit("leaveProject", projectId.projectId);
                    console.log("left the project:", projectId.projectId);
                    socket.off("activeMember", handleActiveMember);
                    hasJoinedRef.current = null;
                } catch(err) {
                    console.error("Error leaving project:", err);
                }
            }
        }
    }, [projectId.projectId, token]);
    
    return{activeMembers};
}

export default useSocket;