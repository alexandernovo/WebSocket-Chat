const express = require('express');
const AuthController = require('../Controller/AuthController');

class AuthRoutes {

    constructor() {
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        const authController = new AuthController();
        this.router.post('/', authController.auth.bind(authController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AuthRoutes;
