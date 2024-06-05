import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { color } from 'framer-motion';

const TodayTimeUtilisation = () => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'radialBar',
      height: 350,
      
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        
        }
      }
    },
    labels: ['Percentage'],
    
  });

  const [chartSeries, setChartSeries] = useState([0]);

  useEffect(() => {
    const id = localStorage.getItem('id');

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-WorkingToday/${id}`);
        const { workingPercentage } = response.data;
        

        // Update chart series with working percentage
        setChartSeries([workingPercentage]);

        // Update chart options (if needed)
        const newChartOptions = { ...chartOptions }; // Copy existing options
        // Modify options as needed
        // Example: newChartOptions.chart.height = 400;
        setChartOptions(newChartOptions);

        console.log("workingPercentage", workingPercentage);
      } catch (error) {
        console.error('Error fetching working percentage:', error);
      }
    };

    fetchData();
  }, [chartOptions]); // Add chartOptions to dependency array to re-run effect when options change

  return (
    <div className="apex-chart "> {/* Ajout de la classe bg-primary */}
      <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height={350} />
    </div>
  );
};

export default TodayTimeUtilisation;
