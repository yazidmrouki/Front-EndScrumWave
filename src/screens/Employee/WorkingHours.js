import React, { useState, useEffect } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkingHours = ({ PoId }) => {
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/getWorking-progress/${PoId}`);
        
        if (response.data === null || response.data.length === 0) {
          toast.warning("No employees");
          setMonthlyData([]);
          return;
        }
        
        setMonthlyData(response.data.monthlyData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données mensuelles :", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, [PoId]);

  if (monthlyData === null) {
    return <div>Loading...</div>;
  }

  // Arrondir les valeurs à l'entier le plus proche
  const roundedMonthlyData = Object.entries(monthlyData).reduce((acc, [key, value]) => {
    acc[key] = {
      totalworkHours: Math.round(value.totalworkHours),
      totalProgress: Math.round(value.totalProgress),
    };
    return acc;
  }, {});

  const options = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["#008FFB", "#FF4560"],
    series: [
      {
        name: "Working Hours",
        type: "column",
        data: Object.values(roundedMonthlyData).map((month) => month.totalworkHours),
      },
      {
        name: "Progress",
        type: "line",
        data: Object.values(roundedMonthlyData).map((month) => month.totalProgress),
      },
    ],
    stroke: {
      width: [0, 4],
    },
    labels: Object.keys(roundedMonthlyData),
    xaxis: {
      type: "category",
    },
    yaxis: [
      {
        title: {
          text: "Working Hours",
        },
      },
      {
        opposite: true,
        title: {
          text: "Progress",
        },
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Employees Stats</h6>
      </div>
      {monthlyData.length === 0 ? (
        <div className="card-body">
          <p>No Employees</p>
        </div>
      ) : (
        <div className="card-body">
          <ApexCharts options={options} series={options.series} type="line" height={350} />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default WorkingHours;
