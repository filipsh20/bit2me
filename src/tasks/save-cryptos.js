const cryptoModel = require('../models/crypto-model');
const axios = require('axios');

const getCryptoPrice = async () => {
    try {
        const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
        const apiKey = '1c275ac2-5e42-49ab-80e1-2a5d199bbc03';
        const limit = 50;

        const response = await axios.get(url, {
            headers: { 'X-CMC_PRO_API_KEY': apiKey },
            params: { limit },
        });

        const cryptoMap = response.data.data.map(crypto => ({
            rank: crypto.cmc_rank,
            name: crypto.name,
            symbol: crypto.symbol,
            price: crypto.quote.USD.price,
            variation_24h: crypto.quote.USD.percent_change_24h,
            market_cap: crypto.quote.USD.market_cap,
            circulating_supply: crypto.circulating_supply,
            total_supply: crypto.total_supply,
        }));

        return cryptoMap;
    } catch (error) {
        console.error('Error al obtener los datos de las criptomonedas:', error.message);
        throw error;
    }
};

const getCryptoHistorical = async (symbol) => {
    const url = 'https://min-api.cryptocompare.com/data/v2/histoday'; 
    const fechaActual = new Date();

    try {
        const response = await axios.get(url, {
            params: {
                fsym: symbol,
                tsym: 'USD',
                toTs: Math.floor(fechaActual / 1000),
                limit: 365,
            },
        });

        const data = response.data.Data.Data;
        const last365days = data.map((element) => {
            const date = new Date(element.time * 1000);
            return { date: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`, price: element.open };
        });

        return last365days;
    } catch (error) {
        console.error('Error al obtener el historial de precios:', error.message);
        throw error;
    }
};

const saveCryptos = async () => {
    try {
        const cryptoData = await getCryptoPrice();
        const cryptoCollection = await cryptoModel.getCollection();

        for (const element of cryptoData) {
            const existingCrypto = await cryptoCollection.findOne({ symbol: element.symbol });
            const last365days = await getCryptoHistorical(element.symbol);
            element.last365days = last365days;
            if (existingCrypto) {
                await cryptoCollection.findOneAndUpdate({ symbol: element.symbol }, { $set: element });
            } else {
                await cryptoCollection.insertOne(element);
            }
        }
    } catch (error) {
        console.error('Error en la tarea cron:', error.message);
        throw error;
    }
};

module.exports = saveCryptos;
