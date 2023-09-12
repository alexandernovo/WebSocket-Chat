const express = require('express');
const http = require('http');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { requestLogger, errorHandler } = require('./Middleware/middleware');
const cors = require('cors');
const port = process.env.PORT;
const userRoute = require('./Routes/UserRoute');
const authRoute = require('./Routes/AuthRoutes');
const chatRoute = require('./Routes/ChatRoute');
const DbConnect = require('./Config/Database');
const path = require('path'); // Import the path module

class ChatApp {
    constructor(port) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupStaticFiles();
    }

    setupMiddlewares() {
        this.app.use(requestLogger);
        this.app.use(cors());
        this.app.use(express.json());
    }

    setupRoutes() {
        const userRouteInstance = new userRoute();
        const authRouteInstance = new authRoute();
        const chatRouteInstance = new chatRoute();

        this.app.use('/api/users', userRouteInstance.getRouter());
        this.app.use('/api/authToken', authRouteInstance.getRouter());
        this.app.use('/api/chat', chatRouteInstance.getRouter());

        this.app.use(errorHandler);
    }

    setupStaticFiles() {
        this.app.use(express.static('public'));
    }

    start() {
        const connectDB = new DbConnect();
        connectDB.connect()
            .then(() => {
                this.server.listen(this.port, () => {
                    console.log(`Server is running on port ${this.port}`);
                });
            })
            .catch(error => {
                console.error('Database connection error:', error);
            });
    }
}

const app = new ChatApp(port);
app.start();
