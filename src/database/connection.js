const { MongoClient } = require('mongodb');

class Connection {
    constructor() {
        this.client = new MongoClient(process.env.DB);
        this.connection = null;
    }

    async connect(dbName, collName) {
        try {
            if (!this.connection) {
                await this.client.connect();
                this.connection = this.client.db(dbName).collection(collName)
            }
            return this.connection;
        } catch (error) {
            throw new Error(`Error connecting to MongoDB: ${error}`);
        }
    }
}

module.exports = Connection;;