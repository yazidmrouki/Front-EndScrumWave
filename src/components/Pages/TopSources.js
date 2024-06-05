import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { toast } from 'react-toastify';

function TopSources() {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchTeamMembersCount = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/team-members-count/${email}`);
                const teamMembersData = response.data;

                const teamNames = Object.keys(teamMembersData);

                // Définir les couleurs pour chaque type de membre d'équipe
                const colorsByType = {
                    'Po': '#ff6b6b',               // Product Owner en rouge
                    'Scrum': '#48dbfb',            // Scrum en bleu
                    'UI/UX Design': '#1dd1a1',   // Website Design en vert
                    'App Development': '#feca57',  // App Development en jaune
                    'Quality Assurance': '#ff9ff3',// Quality Assurance en rose
                    'Development': '#1abc9c',      // Development en turquoise
                    'Backend Development': '#ff6348',// Backend Development en orange
                    'Software Testing': '#a29bfe', // Software Testing en violet
                    'Marketing': '#6c5ce7',        // Marketing en violet foncé
                    'SEO': '#fd79a8',              // SEO en rose foncé
                    'Other': '#cccccc',            // Autre en gris
                };

                const types = Object.keys(colorsByType);

                // Initialiser les séries de données pour chaque type
                const series = types.map(type => ({
                    name: type,
                    data: teamNames.map(teamName => {
                        const teamData = teamMembersData[teamName];
                        return teamData[type] || 0;
                    }),
                    color: colorsByType[type]
                }));

                // Initialiser les options du graphique
                const options = {
                    chart: {
                        type: 'bar',
                        height: 300,
                        width: 300,
                        stacked: true,
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: true
                        }
                    },
                    colors: Object.values(colorsByType),
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom',
                                offsetX: -10,
                                offsetY: 0
                            }
                        }
                    }],
                    xaxis: {
                        categories: teamNames,
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    fill: {
                        opacity: 1
                    }
                };

                // Mettre à jour les options et les séries de données du graphique
                setChartOptions(options);
                setChartSeries(series);
            } catch (error) {
                toast.error('Erreur lors de la récupération des données des membres par équipe');
            }
        };

        fetchTeamMembersCount();
    }, [email]);

    return (
        <div className="card">
            <div className="card-header">
            <h3 className="card-title text-center" style={{ fontWeight: 'bold' }}>Top Sources Teams  </h3>
        </div>
            <div className="card-body">
                <div id="topSourcesChart">
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="bar"
                        height={chartOptions?.chart?.height ?? 300}
                    />
                </div>
            </div>
        </div>
    );
}

export default TopSources;
