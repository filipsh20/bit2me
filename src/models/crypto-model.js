const Connection = require('../database/connection');

const dbName = 'bit2me';
const collName = 'cryptos';

class CryptoModel {
    static async getCollection() {
        try {
            const connection = new Connection();
            return await connection.connect(dbName, collName);
        } catch (error) {
            throw new Error(`Error getting MongoDB collection: ${error}`);
        }
    }
}

module.exports = CryptoModel;