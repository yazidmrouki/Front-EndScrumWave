import React from 'react';
import ReactApexChart from 'react-apexcharts';

function TicketStatus({ projectData }) {
  const sprintData = projectData; // Renommer projectData en sprintData

  if (!sprintData || sprintData.length === 0) {
    return <p>No data available</p>;
  }

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 400,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    xaxis: {
      categories: sprintData.map(sprint => sprint.sprintName),
    },
    colors: ["#FF4560", "#008FFB", "#00E396"],
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  const chartSeries = [
    { name: "To Do", data: sprintData.map(sprint => sprint.todoCount) },
    { name: "In Progress", data: sprintData.map(sprint => sprint.inProgressCount) },
    { name: "Completed", data: sprintData.map(sprint => sprint.completedCount) },
  ];

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={400}
    />
  );
}

export default TicketStatus;
