const { Server } = require("socket.io");
const cron = require('node-cron');
const cryptoModel = require('./models/crypto-model');

const serverSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL
        }
    });

    const emitCryptosToClient = async () => {
        try {
            const cryptoCollection = await cryptoModel.getCollection();
            const cryptosInfo = await cryptoCollection.find({}).toArray();
            io.emit("cryptos", cryptosInfo);
        } catch (error) {
            console.error("Error while emitting cryptos to client:", error);
        }
    };

    io.on("connection", async (socket) => {
        try {
            await emitCryptosToClient();
            cron.schedule('* * * * *', emitCryptosToClient);
        } catch (error) {
            console.error("Error on socket connection:", error);
        }
    });
};

module.exports = serverSockets;
