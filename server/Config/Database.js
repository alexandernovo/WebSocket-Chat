const mongoose = require('mongoose');

class DatabaseConnector {
    async connect() {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}

module.exports = DatabaseConnector;
