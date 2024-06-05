import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'; // Importer Chart depuis react-apexcharts
import axios from 'axios';

function EmployeeType() {
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'donut',
        },
        labels: ['Developers', 'Scrum Masters'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            show: true,
        },
        colors: ['var(--chart-color4)', 'var(--chart-color3)'],
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#ffffff'], // Couleur du texte en blanc
            },
            formatter: function (val, opts) {
                return `${opts.w.config.series[opts.seriesIndex]}%`; // Afficher le pourcentage dans les sections du donut
            }
        },
    });
    const [chartSeries, setChartSeries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ProductOwners/roles-distribution');
                const data = response.data;
                console.log('Données récupérées :', data);

                const totalEmployees = data.developers + data.scrumMasters;
                const devPercentage = ((data.developers / totalEmployees) * 100).toFixed(2);
                const scrumPercentage = ((data.scrumMasters / totalEmployees) * 100).toFixed(2);

                console.log('Pourcentage de développeurs :', devPercentage);
                console.log('Pourcentage de Scrum Masters :', scrumPercentage);

                // Mettre à jour les séries avec les pourcentages
                setChartSeries([parseFloat(devPercentage), parseFloat(scrumPercentage)]);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de distribution des rôles :', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="card" style={{ height: '335px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-body">
            <div id="employeeTypeChart">
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    height={300} // Ajuster la hauteur du graphique
                />
            </div>
        </div>
    </div>
    );
}

export default EmployeeType;
