import './App.css';
import React, { useEffect, useState } from 'react'; 
import Card from './Components/Card';

function App() {
  const [gasStations, setGasStations] = useState([]);
  const [todays, setTodays] = useState([]);
  const url = 'https://us-east-2.aws.neurelo.com/rest/gas_stations'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'X-API-KEY': process.env.API_KEY
        };
        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        let currentDate = new Date()
        let cD = currentDate;
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        currentDate = `${year}-${month}-${day}`;

        let prevDate = new Date(currentDate)
        //note: the number 4 should be changed to the difference
        //between the current date and the last fetched date
        //this is a band-aid solution for now and if you run the
        //scraper every day then this would be - 1, not  - 4
        prevDate.setDate(cD.getDate() - 4);

        const prevYear = prevDate.getFullYear();
        const prevMonth = String(prevDate.getMonth() + 1).padStart(2, '0');
        const prevDay = String(prevDate.getDate()).padStart(2, '0');
        prevDate = `${prevYear}-${prevMonth}-${prevDay}`;

        const data = await response.json();
        let records = data.data;
        let t = records.filter(station => station.date.includes(currentDate))
        let p = records.filter(station => station.date.includes(prevDate))
        t.forEach(todayRecord => {
          const yesterdayRecord = p.find(yesterdayRecord => yesterdayRecord.name === todayRecord.name);
          if (yesterdayRecord) {
            let t_p = parseFloat(todayRecord.s_p.substring(1));
            let y_p = parseFloat(yesterdayRecord.s_p.substring(1));
            const priceDifference = t_p - y_p;
            todayRecord.trend = priceDifference.toFixed(2);
            console.log(todayRecord.trend)
          } 
        });
        setGasStations(p)
        setTodays(t);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <h1>Gas Stations</h1>
      <div className="card-container">
        {todays && todays.map((station, index) => (
          <Card
            key={index}
            name={station.name}
            address={station.address}
            date={station.date}
            price={station.s_p}
            trend={station.trend}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
