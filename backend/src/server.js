
const express = require('express');
const connectDB = require('./config/db.config');
const dotenv = require('dotenv');
const {errorHandler} = require('./middlewares/error.middleware');
const userRoutes = require('./routes/user.routes');
dotenv.config({silent: true});

const PORT = process.env.PORT ;

const app = express();
connectDB();

app.use(express.json());

app.use('/taskIt/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});