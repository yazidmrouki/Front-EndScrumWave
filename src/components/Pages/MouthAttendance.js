import React, { useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import { toast } from "react-toastify";  
import axios from "axios";

function MouthAttendance(props) {
    const { userId } = props;
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    useEffect(() => {
        const fetchMonthlyAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/monthly-attendance/${userId}`);
                const attendanceData = response.data.attendance;

                const months = attendanceData.map(entry => entry.month);
                const developersAttendance = attendanceData.map(entry => entry.développeurs);
                const scrumMastersAttendance = attendanceData.map(entry => entry.scrumMasters);
              
                setChartOptions({
                    chart: {
                        height: 320,
                        type: 'line',
                        toolbar: {
                            show: false,
                        },
                        title: {
                            text: 'Courbe de présence mensuelle', // Titre du graphique
                            align: 'center', // Alignement du titre (left, center, right)
                            style: {
                                fontSize: '20px', // Taille de police du titre
                                fontWeight: 'bold', // Poids de la police
                                fontFamily: 'Arial', // Famille de police
                                color: '#333', // Couleur du texte
                            }
                        },
                        colors: ['#FFA500', '#FFFF00'], // Couleurs pour les données
                    },
                    xaxis: {
                        categories: months,
                        tickAmount: 10,
                    },
                    yaxis: {
                        title: {
                            text: 'Nombre de présences'
                        },
                        labels: {
                            formatter: function(value) {
                                return parseInt(value, 10); // Convertit la valeur en nombre entier
                            }
                        }
                    },
                    stroke: {
                        width: 4,
                        curve: 'smooth',
                    },
                    markers: {
                        size: 3,
                        strokeWidth: 2,
                        hover: {
                            size: 7,
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                });
                
                
                setChartSeries([
                    { name: 'Développeurs', data: developersAttendance },
                    { name: 'Scrum Masters', data: scrumMastersAttendance }
                ]);
            } catch (error) {
                toast.warning('Erreur lors de la récupération des données d\'assiduité mensuelle');
            }
        };

        fetchMonthlyAttendance();
    }, [userId]);

    return (
        <div className="card">
         
            <div className="card-body">
                <div id="mouthAttendanceChart">
                    <ReactApexChart 
                        options={chartOptions} 
                        series={chartSeries} 
                        type={chartOptions?.chart?.type ?? "line"} 
                        height={chartOptions?.chart?.height ?? 350} 
                    />
                </div>
            </div>
        </div>
    );
}

export default MouthAttendance;
