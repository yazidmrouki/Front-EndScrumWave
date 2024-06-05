import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

function TicketsCountTodayChart() {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: []
    },
    colors: ['#FF5722'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Nombre de tickets créés aujourd\'hui par projet',
      align: 'center'
    },
    markers: {
      size: 6,
      colors: ['#FF5722'] // Couleur des marqueurs autour des points
    },
    yaxis: {
        min: 0,
        tickAmount: 2, // Ajustez le nombre de ticks sur l'axe des ordonnées
        labels: {
          formatter: function (value) {
            return value.toFixed(1); // Limite les nombres décimaux à une seule décimale
          }
        }}
  });

  useEffect(() => {
    const fetchTicketsCountToday = async () => {
      try {
        const emailPo = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/tickets-per-today/${emailPo}`);
        const chartData = Object.entries(response.data).map(([projectName, count]) => ({ x: projectName, y: count }));
        setData(chartData);
        setOptions(prevOptions => ({
          ...prevOptions,
          xaxis: { ...prevOptions.xaxis, categories: chartData.map(data => data.x) }
        }));
      } catch (error) {
        console.error('Error fetching tickets count today:', error);
      }
    };

    fetchTicketsCountToday();
  }, []);

  return (
    <div className="card">
      <div className="card-body">
      {data.length === 0 ? (
    
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh' }}>
    <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
      <video
        width="260"
        height="260"
        preload="none"
        style={{
          background: 'transparent',
          backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/12132/12132919.mp4)',
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0, 0, 0.1, 0.1)',
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://cdn-icons-mp4.flaticon.com/512/12132/12132919.mp4" type="video/mp4" />
      </video>
      <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Tickets Found</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Project Created  yet. </p>
    
    </div>
  </div> 

  ) : (
        <ReactApexChart options={options} series={[{ data }]} type="line" height={350} />

  )}
      </div>
    </div>
  );
}

export default TicketsCountTodayChart;
