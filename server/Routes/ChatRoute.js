const express = require('express');
const ChatController = require('../Controller/ChatController');

class ChatRoute {

    constructor() {
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        const chatController = new ChatController();
        this.router.post('/sendMessage', chatController.sendMessage.bind(chatController));
        this.router.get('/getMessage', chatController.getMessage.bind(chatController));
        this.router.get('/getMessages', chatController.getMessages.bind(chatController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ChatRoute;
