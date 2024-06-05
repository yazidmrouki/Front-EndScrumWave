import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import './Categorie.css';

function ProjectCategoryDonut() {
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      const emailPo = localStorage.getItem('email'); // Récupérer l'email du PO depuis le localStorage
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/categories/${emailPo}`);
        setProjectData(response.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: projectData.map(project => project.category),
    colors: ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#FFC107'], // Define your own color scheme
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        colors: ['#ffffff'], // White color for the labels
      },
      formatter: (val, opts) => {
        return `${val.toFixed(2)}%`;
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      formatter: (seriesName, opts) => {
        return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex].toFixed(2)}%`;
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}%`
      }
    }
  };

  const chartSeries = projectData.map(project => parseFloat(project.percentage));

  return (



    
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Project Categories</h6>
      </div>
      {projectData.length === 0 ? (
    
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh' }}>
    <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
      <video
        width="260"
        height="260"
        preload="none"
        style={{
          background: 'transparent',
          backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/11677/11677506.jpg)',
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
        <source src="https://cdn-icons-mp4.flaticon.com/512/11677/11677506.mp4" type="video/mp4" />
      </video>
      <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Project Found</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Project Created   yet. </p>
    
    </div>
  </div> 

  ) : (
      <div className="card-body">
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={350} />
      </div>
    
  )}
    </div>
  );
}

export default ProjectCategoryDonut;
