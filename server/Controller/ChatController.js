const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Chat = require('../Models/ChatModel');
const verifyToken = require('../utils/verifyToken');

class ChatController {

    constructor() {
        this.chatModel = new Chat(); // Define userModel as an instance property
    }

    sendMessage = asyncHandler(async (req, res) => {
        const token = req.headers.authorization;
        const { receiverID, message } = req.body;

        if (!token) {
            return res.status(401).json({ status: 'invalid', message: 'Token not provided' });
        }
        try {
            const decoded = verifyToken(token);
            try {
                const data = {
                    sender: decoded.userId,
                    receiver: receiverID,
                    message: message
                }
                const chat = await this.chatModel.createChatMessage(data);
                res.status(201).json({ status: 'success', message: 'Chat Send Successfully', data: chat });
            } catch (error) {
                res.status(500).json({ message: 'Error sending message.' });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    });

    getMessage = asyncHandler(async (req, res) => {
        const token = req.headers.authorization;
        const { receiverID } = req.query;
        console.log(receiverID)
        if (!token) {
            return res.status(401).json({ status: 'invalid', message: 'Token not provided' });
        }
        try {
            const decoded = verifyToken(token);
            try {
                const chat = await this.chatModel.getChatMessages(decoded.userId, receiverID);
                res.status(201).json({ status: 'success', message: 'Chat Messages Get', data: chat });
            } catch (error) {
                res.status(500).json({ message: 'Error getting chat messages.' });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    });

    getMessages = asyncHandler(async (req, res) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ status: 'invalid', message: 'Token not provided' });
        }
        try {
            const decoded = verifyToken(token);
            try {
                const messages = await this.chatModel.getMessages(decoded.userId);
                // Prepend process.env.URL to each message.image URL
                messages.forEach(message => {
                    ['receiver', 'sender'].forEach(role => {
                        if (message[role]?.image && !message[role].image.startsWith('http://') && !message[role].image.startsWith('https://')) {
                            message[role].image = `${process.env.URL}/${message[role].image}`;
                        }
                    });
                });

                res.status(201).json({ status: 'success', message: 'Messages Get', data: { messages, token: decoded.userId } });
            } catch (error) {
                res.status(500).json({ message: 'Error getting messages.' });
            }
        } catch (error) {
            res.status(500).json({ message: error });
        }
    });

}

module.exports = ChatController;
