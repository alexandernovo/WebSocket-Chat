const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Chat = require('../Models/ChatModel');
const verifyToken = require('../utils/verifyToken');

class ChatController {

    constructor() {
        this.chatModel = new Chat();
        this.onlineUsers = new Set();

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

    socketController = (io, socket) => {

        socket.on('setOnlineUsers', (token) => {
            const bearerToken = `Bearer ${token}`;
            const decoded = verifyToken(bearerToken);
            if (decoded) {
                this.onlineUsers.add(decoded.userId);
                this.updateOnlineUsers(io);
            }
        });

        socket.on('privateMessage', async (data) => {
            const { receiver, message, senderToken } = data;

            try {
                const bearerToken = `Bearer ${senderToken}`;
                const decoded = verifyToken(bearerToken);
                if (decoded) {
                    const chatData = {
                        sender: decoded.userId,
                        receiver,
                        message
                    };

                    try {
                        const chat = await this.chatModel.createChatMessage(chatData);
                        if (decoded.userId == receiver) {
                            io.to(`${decoded.userId}_to_${receiver}`).emit('Messages', chat);
                        } else {
                            io.to(`${decoded.userId}_to_${receiver}`).emit('Messages', chat);
                            io.to(`${receiver}_to_${decoded.userId}`).emit('Messages', chat);
                        }
                        try {
                            const chatPop = await this.chatModel.populateMessage(chat);
                            if (decoded.userId == receiver) {
                                io.emit(`${decoded.userId}`, chatPop)
                            } else {
                                io.emit(`${decoded.userId}`, chatPop)
                                io.emit(`${receiver}`, chatPop)
                            }
                        } catch (error) {
                            console.log('Cannot Emit Side Messages');
                        }
                    } catch (error) {
                        console.log('Cannot Emit Messages');
                    }

                } else {
                    console.error('Invalid sender token');
                }
            } catch (error) {
                console.error('Error handling private message:', error);
            }
        });

        socket.on('joinRoom', async (data) => {
            if (data) {
                const { sender, receiver } = data;
                const bearerToken = `Bearer ${sender}`;
                const decoded = verifyToken(bearerToken);
                if (decoded) {
                    socket.join(`${decoded.userId}_to_${receiver}`);
                    console.log('Join Room Send:', receiver);
                }
            }

        })

        socket.on('disconnect', () => {
            console.log('A user disconnected from the WebSocket.');

            // Remove user from the online users set
            this.onlineUsers.delete(socket.id);

            // Notify all clients about the updated online users
            this.updateOnlineUsers(io);
        });
    }

    updateOnlineUsers(io) {
        io.emit('onlineUsers', Array.from(this.onlineUsers));
    }

}

module.exports = ChatController;
