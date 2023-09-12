const mongoose = require('mongoose');

class UserModel {
    constructor() {
        this.User = mongoose.model('User', new mongoose.Schema(
            {
                firstname: {
                    type: String,
                    required: [true, 'First name is required']
                },
                lastname: {
                    type: String,
                    required: [true, 'Last name is required']
                },
                username: {
                    type: String,
                    required: [true, 'Username is required']
                },
                password: {
                    type: String,
                    required: [true, 'Password is required']
                }, image: {
                    type: String,
                },
            },
            {
                timestamps: true
            }
        ));
    }

    async createUser(data) {
        try {
            const user = new this.User(data);
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await this.User.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, data) {
        try {
            return await this.User.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await this.User.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    //pass and object here, example {username : username}
    async getColumn(data) {
        try {
            return await this.User.findOne(data);
        } catch (error) {
            throw error;
        }
    }

    async findWhere(data) {
        try {
            return await this.User.find(data);
        } catch (error) {
            throw error;
        }
    }


}

module.exports = UserModel;
