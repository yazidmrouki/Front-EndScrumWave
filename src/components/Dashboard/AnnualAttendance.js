import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { toast } from 'react-toastify';

function AnnualAttendance() {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ProductOwners/annual-attendance');
                const attendanceData = response.data;

                // Process the attendance data to fit the heatmap format
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const days = Array.from({ length: 31 }, (_, i) => i + 1);

                // Initialize series data
                const series = months.map((month, monthIndex) => {
                    const monthData = attendanceData.find(data => data.month === monthIndex);
                    const dayData = days.map(day => {
                        const dayRecord = monthData?.days.find(record => record.day === day);
                        return {
                            x: day,
                            y: dayRecord ? dayRecord.attendancePercentage : 0,
                            isUpcoming: dayRecord ? dayRecord.isUpcoming : false
                        };
                    });
                    return {
                        name: month,
                        data: dayData
                    };
                });

                setChartOptions({
                    chart: {
                        type: 'heatmap',
                        height: 450,
                    },
                    plotOptions: {
                        heatmap: {
                            shadeIntensity: 0.5,
                            colorScale: {
                                ranges: [
                                    { from: 0, to: 25, name: 'Low', color: '#00A100' },
                                    { from: 26, to: 50, name: 'Medium', color: '#128FD9' },
                                    { from: 51, to: 75, name: 'High', color: '#FFB200' },
                                    { from: 76, to: 100, name: 'Extreme', color: '#FF0000' }
                                ]
                            }
                        }
                    },
                    xaxis: {
                        categories: days,
                        title: {
                            text: 'Days'
                        }
                    },
                    yaxis: {
                        categories: months,
                        title: {
                            text: 'Months'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                            const data = w.config.series[seriesIndex].data[dataPointIndex];
                            if (data.isUpcoming) {
                                return '';
                            }
                            return value;
                        },
                        style: {
                            colors: ['#000000']
                        },
                        dropShadow: {
                            enabled: true,
                            top: 1,
                            left: 1,
                            blur: 1,
                            opacity: 0.45
                        }
                    },
                    tooltip: {
                        custom: function({ series, seriesIndex, dataPointIndex, w }) {
                            const data = w.config.series[seriesIndex].data[dataPointIndex];
                            if (data.isUpcoming) {
                                return '<div class="apexcharts-tooltip-text" style="color: #fff; background: #000;">Upcoming Day</div>';
                            }
                            return `<div class="apexcharts-tooltip-text">${series[seriesIndex][dataPointIndex]}%</div>`;
                        }
                    }
                });

                setChartSeries(series);
            } catch (error) {
                toast.error('Erreur lors de la récupération des données d\'attendance annuelle');
            }
        };

        fetchAttendanceData();
    }, []);

    return (
        <div className="card">
        <div className="card-header">
            <h3 className="card-title text-center" style={{ fontWeight: 'bold' }}>Annual Attendance Heatmap</h3>
        </div>
        <div className="card-body">
            <div id="annualAttendanceChart">
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="heatmap"
                    height={chartOptions?.chart?.height ?? 450}
                />
            </div>
        </div>
    </div>
    );
}

export default AnnualAttendance;
