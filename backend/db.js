const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'CampusEats';

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

function closeConnection() {
    client.close();
    console.log('MongoDB connection closed');
}

module.exports = {
    connectToDatabase,
    closeConnection,
    client
};
