const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

var activeProjectMembers = {};

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next(new Error("Token required"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  })

  io.on("connection", (socket) => {
    socket.on("joinProject", (projectId, token ) => {
      socket.join(projectId);

      if(!activeProjectMembers[projectId]){
        activeProjectMembers[projectId] = [];
      }

      // Check if user is already in the project to prevent duplicates
      const existingMember = activeProjectMembers[projectId].find(
        member => member.socketId === socket.user.id
      );

      if(!existingMember){
        activeProjectMembers[projectId].push({
          socketId: socket.user.id,
          user: socket.user,
          token
        });
 
      } else {
        console.log("User already in project, skipping duplicate");
      }
      
       
      io.to(projectId).emit(
        "activeMember", activeProjectMembers[projectId].map(m=>m.user)
      );      
    });

    socket.on("taskCreatedFE", (task) => {
       const projectId = typeof task.projectId === 'object' 
        ? task.projectId._id 
        : task.projectId;
          
      // Emit to all sockets in the project room
      io.to(projectId).emit("taskCreatedFE", task);     
     });

     socket.on("taskUpdatedFE", (task) => {
       const projectId = typeof task.projectId === 'object' 
        ? task.projectId._id 
        : task.projectId;
            
      // Emit to all sockets in the project room
      io.to(projectId).emit("taskUpdatedFE", task);
          });

    socket.on("taskDeletedFE", (task) => {
       
       const projectId = typeof task.projectId === 'object' 
        ? task.projectId._id 
        : task.projectId;
           
      io.to(projectId).emit("taskDeleted", task);
      
      console.log("taskDeleted emitted successfully");
    });

    socket.on("leaveProject", (projectId) => {
      console.log("User", socket.user.id, "leaving project", projectId);
      
      if(activeProjectMembers[projectId]){
        activeProjectMembers[projectId] = activeProjectMembers[projectId]
          .filter(member => member.socketId !== socket.user.id);
        
        socket.leave(projectId);
        
        io.to(projectId).emit("activeMember", activeProjectMembers[projectId].map(m=>m.user));
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
      
      // Remove user from all projects
      for(const projectId in activeProjectMembers){
        const initialLength = activeProjectMembers[projectId].length;
        
        activeProjectMembers[projectId] = activeProjectMembers[projectId]
          .filter(member => member.socketId !== socket.user.id);
        
        // Only emit if user was actually in this project
        if(activeProjectMembers[projectId].length < initialLength){
          io.to(projectId).emit("activeMember", activeProjectMembers[projectId].map(m=>m.user));
        }
      }
    });
  });

  return io;
}

const getIO = () => {
  if (!io) {
    throw new Error("socket.io is not initialized")
  }
  return io;
}

module.exports = { initSocket, getIO };