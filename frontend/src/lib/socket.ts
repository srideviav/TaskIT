import {io,Socket} from "socket.io-client";

let socket:Socket | null = null ;

export const connectSocket = (token:string) =>{
    
    if(!socket){
        socket = io("http://localhost:5000",{
            auth:{token},
            transports:["websocket"],
            autoConnect: true,
        });

        socket.on("connect", () => {
            console.log("Socket connected successfully, ID:", socket?.id);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });
    }

    return socket;
}

export const getSocket =()=>{
    if(!socket){
        throw new Error("Socket not connected");
    }
    return socket;
}

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect();
        socket = null;
    }
}