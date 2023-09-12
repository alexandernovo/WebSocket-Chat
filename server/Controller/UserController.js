const asyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');


class UserController {

    constructor() {
        this.userModel = new User(); // Define userModel as an instance property
    }
    //Register Users
    createUser = asyncHandler(async (req, res) => {
        const { firstname, lastname, username, password, confirmpassword } = req.body;

        try {
            const data = await this.userModel.getColumn({ username: username });

            if (password !== confirmpassword) {
                return res.status(400).json({ errorCall: 'password', message: 'Password do not match.' });
            }

            try {
                const existingUser = await this.userModel.getColumn({ username: username });

                if (existingUser) {
                    return res.status(400).json({ errorCall: 'username', message: 'Username is already taken.' });
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = await this.userModel.createUser({
                        firstname,
                        lastname,
                        username,
                        password: hashedPassword
                    });

                    res.status(201).json({ status: 'success', message: 'Register Successfully', id: newUser.id });

                } catch (error) {
                    res.status(500).json({ message: 'Error creating user.' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Error checking existing username.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user data.' });
        }
    });


    //Login Auth
    auth = asyncHandler(async (req, res) => {
        const { username, password } = req.body;

        try {
            const existingUser = await this.userModel.getColumn({ username: username });

            if (!existingUser) {
                return res.status(401).json({ errorCall: 'username', message: 'Username does not exist.' });
            }

            try {
                const passwordMatch = await bcrypt.compare(password, existingUser.password);

                if (passwordMatch) {
                    // Passwords match, generate a JWT token
                    const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                    return res.status(200).json({ status: 'success', message: 'Authentication successful.', token });
                } else {
                    // Passwords do not match
                    return res.status(401).json({ errorCall: 'password', message: 'Incorrect password.' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Error during password comparison.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error during authentication.' });
        }
    });

    //session data
    getSession = asyncHandler(async (req, res) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: 'invalid', message: 'Token not provided' });
        }
        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
            const data = await this.userModel.getUserById(decoded.userId);

            if (data.image) {
                data.image = `${process.env.URL}/${data.image}`;
            }

            return res.status(200).json({ status: 'valid', message: 'Authenticated', data: data });
        } catch (error) {
            return res.status(401).json({ status: 'invalid', message: 'Token is not valid' });
        }
    })

    //search
    getSearch = asyncHandler(async (req, res) => {
        const searchInput = req.query.search;
        try {
            const searchResults = await this.userModel.findWhere({
                $or: [
                    { firstname: { $regex: searchInput, $options: 'i' } },
                    { lastname: { $regex: searchInput, $options: 'i' } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ['$firstname', ' ', '$lastname'] },
                                regex: searchInput,
                                options: 'i'
                            }
                        }
                    }
                ]
            });

            searchResults.forEach(search => {
                if (search.image) {
                    search.image = `${process.env.URL}/${search.image}`;
                }
            });

            res.status(200).json({ status: 'success', message: 'Search results retrieved successfully.', data: searchResults });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error searching for users.', error: error.message });
        }
    })

    getContact = asyncHandler(async (req, res) => {
        const id = req.query.id;
        try {
            const contact = await this.userModel.getColumn({ _id: id });
            if (contact.image) {
                contact.image = `${process.env.URL}/${contact.image}`;
            }
            res.status(200).json({ status: 'success', message: 'Contact Retrieved.', data: contact });
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: 'Error searching for contact.', error: error.message });

        }
    })

    upload = asyncHandler(async (req, res) => {
        const token = req.headers.authorization;
        const { path } = req.file;
        if (!token) {
            return res.status(401).json({ status: 'invalid', message: 'Token not provided' });
        }
        try {
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
            try {
                const updatedUser = await this.userModel.updateUser(decoded.userId, {
                    image: `${path.replace(/^public[\\/]/, '').replace(/\\/g, '/')}`,
                });
                res.status(200).json({ status: 'success', message: 'Upload Successfully.', image: `${path}` });
            }
            catch (error) {
                return res.status(401).json({ status: 'invalid', message: 'Cannot Upload' });
            }
        }
        catch (error) {
            return res.status(401).json({ status: 'invalid', message: 'Token is not valid' });
        }
    })
}

module.exports = UserController;
