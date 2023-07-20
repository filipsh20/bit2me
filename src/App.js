import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { io } from 'socket.io-client';

import styles from './styles/dashboard.module.css';

const App = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pointer, setPointer] = useState('Bitcoin');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    const handleSocketConnect = () => {
      console.log('Connected');
    };

    const handleSocketDisconnect = () => {
      console.log('Disconnected');
    };

    const handleSocketData = (event) => {
      setChartData(event[0].last365days);
      setData(event);
    };

    socket.on('connect', handleSocketConnect);
    socket.on('disconnect', handleSocketDisconnect);
    socket.on('cryptos', handleSocketData);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRowClick = (item) => {
    setPointer(item.name);
    setChartData(item.last365days);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.containerTable}>
        <h1 className={styles.title}>Portafolios</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>Rank</th>
              <th className={styles.headerCell}>Token</th>
              <th className={styles.headerCell}>Precio</th>
              <th className={styles.headerCell}>Market cap</th>
              <th className={styles.headerCell}>Circulating supply</th>
              <th className={styles.headerCell}>Total supply</th>
              <th className={styles.headerCell}>24h</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.name}
                className={styles.row}
                onClick={() => handleRowClick(item)}
              >
                <td>{item.rank}</td>
                <td>{item.name} ({item.symbol})</td>
                <td>{item.price}$</td>
                <td>{item.market_cap}</td>
                <td>{item.circulating_supply}</td>
                <td>{item.total_supply}</td>
                <td>{item.variation_24h}% {item.variation_24h > 0 ? <div class={styles.arrowUp}>&#x2206;</div> : <div class={styles.arrowDown}>&#x25BC;</div>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.containerChart}>
        <div className={styles.chart}>
          <h1 className={styles.titleChart}>{pointer}</h1>
          <LineChart width={600} height={300} data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid stroke="#f5f5f5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default App;