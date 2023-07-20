const app = require("express")();
const server = require('http').createServer(app);
const dotenv = require('dotenv').config();
const cron = require('node-cron');
const saveCryptos = require("./tasks/save-cryptos");
const cryptoModel = require('./models/crypto-model');
const cors = require('cors');
const serverSockets = require('./sockets');

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));

// Routes
app.get('/', async (req, res) => {
    const cryptoCollection = await cryptoModel.getCollection();
    const cryptoInfo = await cryptoCollection.findOne({});
    console.log(cryptoInfo);
});

// Cron tasks
cron.schedule('* * * * *', saveCryptos);

//Starting servers
server.listen(process.env.SERVER_PORT, () => { console.log(`Server running on port ${process.env.SERVER_PORT}`); });
serverSockets(server);