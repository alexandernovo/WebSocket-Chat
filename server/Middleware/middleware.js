const express = require('express');
const multer = require('multer'); // Add Multer

const requestLogger = (req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
    // console.error(err.stack);
    // res.status(500).send('Something went wrong!');
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/Assets/Profile'); // Set the folder where you want to store the files
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + file.originalname; // Generate a unique file name
        cb(null, fileName);
    },
});


module.exports = { requestLogger, errorHandler, storage };
