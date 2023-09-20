const express = require('express');
const ChatController = require('../Controller/ChatController');

class ChatRoute {

    constructor() {
        this.router = express.Router();
        this.chatController = new ChatController();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/sendMessage', this.chatController.sendMessage.bind(this.chatController));
        this.router.get('/getMessage', this.chatController.getMessage.bind(this.chatController));
        this.router.get('/getMessages', this.chatController.getMessages.bind(this.chatController));
    }
    handleSocket(io, socket) {
        this.chatController.socketController(io, socket);
    }
    getRouter() {
        return this.router;
    }
}

module.exports = ChatRoute;
