const mongoose = require('mongoose');

class ChatModel {
    constructor() {
        this.ChatMessage = mongoose.model('ChatMessage', new mongoose.Schema(
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                receiver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                message: {
                    type: String,
                    required: true
                }
            },
            {
                timestamps: true
            }
        ));
    }

    async createChatMessage(data) {
        try {
            const chatMessage = new this.ChatMessage(data);
            return await chatMessage.save();
        } catch (error) {
            throw error;
        }
    }

    async getChatMessages(senderId, receiverId) {
        try {
            return await this.ChatMessage.find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId }
                ]
            }).sort('createdAt');
        } catch (error) {
            throw error;
        }
    }
    async getMessages(sender_id) {
        try {
            // Retrieve all messages involving the sender_id, sorted by createdAt in descending order
            const messages = await this.ChatMessage.find({
                $or: [
                    { receiver: sender_id },
                    { sender: sender_id }
                ]
            })
                .sort({ createdAt: -1 })
                .populate('sender receiver')
                .exec();

            // Process the messages to group them by conversation or extract the latest messages
            const groupedMessages = {}; // Object to store grouped messages

            messages.forEach((message) => {
                const otherUserId = message.sender.equals(sender_id)
                    ? message.receiver
                    : message.sender;

                if (!groupedMessages[otherUserId]) {
                    groupedMessages[otherUserId] = [];
                }

                groupedMessages[otherUserId].push(message);
            });

            // Extract the latest message from each conversation
            const latestMessages = Object.values(groupedMessages).map((conversationMessages) => {
                return conversationMessages[0]; // Assuming messages are sorted by createdAt
            });

            return latestMessages;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ChatModel;
