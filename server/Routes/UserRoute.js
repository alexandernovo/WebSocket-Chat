const express = require('express');
const UserController = require('../Controller/UserController');
const multer = require('multer'); // Add Multer
const { storage } = require('../Middleware/middleware');

class UserRoute {
    constructor() {
        this.router = express.Router();
        this.storage = multer({ storage: storage });
        this.setupRoutes();
    }

    setupRoutes() {
        const userController = new UserController();
        this.router.post('/', userController.createUser.bind(userController));
        this.router.post('/auth', userController.auth.bind(userController));
        this.router.post('/uploadPhoto', this.storage.single('image'), userController.upload.bind(userController));
        this.router.get('/session', userController.getSession.bind(userController));
        this.router.get('/search', userController.getSearch.bind(userController));
        this.router.get('/getContact', userController.getContact.bind(userController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserRoute;
