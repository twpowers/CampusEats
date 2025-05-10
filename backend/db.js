const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/CampusEats';
async function connectToDatabase() {
    try {
        await mongoose.connect(uri);

        console.log('Connected successfully to MongoDB server');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

function closeConnection() {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
}

module.exports = {
    connectToDatabase,
    closeConnection,
    mongoose
};
