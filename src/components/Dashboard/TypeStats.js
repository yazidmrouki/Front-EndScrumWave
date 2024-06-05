import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { toast } from 'react-toastify';

function TypeStats() {
    const [typeStats, setTypeStats] = useState({});

    useEffect(() => {
        const fetchTypeStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ProductOwners/type-stats');
                setTypeStats(response.data);
            } catch (error) {
                toast.error('Erreur lors de la récupération des statistiques des types de développeurs et des Scrum Masters');
            }
        };

        fetchTypeStats();
    }, []);

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const chartOptions = {
        chart: {
            type: 'pie',
            height: 350,
        },
        labels: Object.keys(typeStats),
        colors: Object.keys(typeStats).map(() => generateRandomColor()), // Utiliser des couleurs aléatoires uniques
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chartSeries = Object.values(typeStats);

    return (
        <div className="card"  style={{ height: '464px' }}>
            <div className="card-header">
                <h3 className="card-title text-center">Statistiques Types</h3>
            </div>
            <div className="card-body">
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="pie"
                    height={350}
                />
            </div>
        </div>
    );
}

export default TypeStats;
