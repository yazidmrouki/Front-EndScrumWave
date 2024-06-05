import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

function ProjectTimeline() {
  const [projectTimeline, setProjectTimeline] = useState([]);

  useEffect(() => {
    const fetchProjectTimeline = async () => {
      try {
        const emailPo = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/project-timeline/${emailPo}`);
        setProjectTimeline(response.data);
      } catch (error) {
        console.error('Error fetching project timeline:', error);
      }
    };

    fetchProjectTimeline();
  }, []);

  const chartOptions = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      }
    },
    xaxis: {
      type: 'datetime'
    },
    fill: {
      opacity: 0.6,
      type: 'solid'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
  };

  const chartSeries = [{
    name: 'Project Timeline',
    data: projectTimeline.map(project => ({
      x: project.projectName,
      y: [
        new Date(project.startDate).getTime(),
        new Date(project.endDate).getTime()
      ]
    }))
  }];

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Project Timeline</h6>
        </div>
      </div>
      <div className="card-body">

      {projectTimeline.length === 0 ? (
    
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh' }}>
    <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
      <video
        width="260"
        height="260"
        preload="none"
        style={{
          background: 'transparent',
          backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/16046/16046006.mp4)',
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
        <source src="https://cdn-icons-mp4.flaticon.com/512/16046/16046006.mp4" type="video/mp4" />
      </video>
      <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Project Found</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Project Created   yet. </p>
    
    </div>
  </div> 

  ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="rangeBar" height={350} />
    

  )}
  
  </div>
  </div>
);
}

export default ProjectTimeline;
