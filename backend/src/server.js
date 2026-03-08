require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db.config");
const { initSocket } = require("./config/socket.config");

const { errorHandler } = require("./middlewares/error.middleware");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const PORT = process.env.PORT ;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const server = http.createServer(app);

connectDB();

// ✅ Initialize Socket AFTER server is created
initSocket(server);

// Routes
app.use("/taskIt/users", userRoutes);
app.use("/taskIt/projects", projectRoutes);
app.use("/taskIt/tasks", taskRoutes);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});