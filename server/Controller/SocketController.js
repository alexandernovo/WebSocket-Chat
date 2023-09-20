// const Chat = require('../Models/ChatModel');

class SocketController {

    constructor(io) {
        this.io = io;
        this.onlineUsers = new Set();  // Set to store online users
        // this.chatModel = new Chat();
    }

    handleConnection(socket) {
        console.log('A user connected to the WebSocket.');

        socket.on('setOnlineUsers', (userID) => {
            this.onlineUsers.add(userID);
        });

        socket.on('privateMessage', (receiver, message, senderToken) => {
            const saveMessage = async (receiver, message, senderToken) => {
                const bearerToken = 'Bearer ' + senderToken;
                const decoded = verifyToken(bearerToken);

                if (decoded) {
                    const data = {
                        sender: decoded.userId,
                        receiver: receiver,
                        message: message
                    }
                    try {
                        const chat = await this.chatModel.createChatMessage(data);
                        if (chat) {
                            const chatMessages = await this.chatModel.getChatMessages(decoded.userId, receiverID);
                            io.to(receiver).emit('Messages', { newMessages: chatMessages });
                        }
                    } catch (error) {
                        console.error('Error creating chat message:', error);
                    }
                } else {
                    console.error('Invalid sender token');
                }
            }
            saveMessage(receiver, message, senderToken);
        });

        this.updateOnlineUsers();

        socket.on('chatMessage', (msg) => {
            console.log('Received message:', msg);
            this.io.emit('chatmessage', msg);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected from the WebSocket.');

            // Remove user from the online users set
            this.onlineUsers.delete(socket.id);

            // Notify all clients about the updated online users
            this.updateOnlineUsers();
        });
    }

    updateOnlineUsers() {
        this.io.emit('onlineUsers', Array.from(this.onlineUsers));
    }

}

module.exports = SocketController;
