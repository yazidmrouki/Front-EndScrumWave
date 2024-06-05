import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactApexChart from "react-apexcharts";

const Dashboard = ({ selectedProjectId }) => {
  const [sprintTickets, setSprintTickets] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartOptions1, setChartOptions1] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [chartSeries1, setChartSeries1] = useState([]);
  const [bugTypeOptions, setBugTypeOptions] = useState({});
  const [bugTypeSeries, setBugTypeSeries] = useState([]);

  const fetchProjectDetailsForDashboard = async () => {
    try {
      if (!selectedProjectId) return;

      const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Project/${selectedProjectId}`);

      if (!response.data) {
        toast.warning("No project assigned", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const projectData = response.data;

      const updatedSprintTickets = projectData.sprints.map(sprint => {
        const totalTickets = sprint.tickets.length;
        const nonTechnicalBugs = sprint.tickets.filter(ticket => ticket.bugDetails.type === "non-technical").length;
        const technicalBugs = sprint.tickets.filter(ticket => ticket.bugDetails.type === "technical").length;
        const nonTechnicalPercentage = totalTickets === 0 ? 0 : ((nonTechnicalBugs / totalTickets) * 100).toFixed(2);
        const technicalPercentage = totalTickets === 0 ? 0 : ((technicalBugs / totalTickets) * 100).toFixed(2);
        const completedTickets = sprint.tickets.filter(ticket => ticket.ticketState === "Completed").length;
        const inProgressTickets = sprint.tickets.filter(ticket => ticket.ticketState === "In Progress").length;
        const toDoTickets = totalTickets - completedTickets - inProgressTickets;
        return {
          sprintName: sprint.sprintName,
          totalTickets: totalTickets,
          nonTechnicalBugs: nonTechnicalBugs,
          technicalBugs: technicalBugs,
          nonTechnicalPercentage: nonTechnicalPercentage,
          technicalPercentage: technicalPercentage,
          sprintStartDate: sprint.sprintStartDate,
          sprintEndDate: sprint.sprintEndDate,
          completedTickets: completedTickets,
          inProgressTickets: inProgressTickets,
          toDoTickets: toDoTickets
        };
      });

      setSprintTickets(updatedSprintTickets);

      // Chart for ticket types
      setChartOptions({
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: updatedSprintTickets.map(ticket => ticket.sprintName),
        },
        yaxis: {
          title: {
            text: 'Number of Tickets'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      });

    // Chart for ticket comparison (using radar)
setChartOptions1({
  chart: {
    type: 'radar',
    height: 350
  },
  xaxis: {
    categories: ['Completed Tickets', 'In Progress Tickets', 'To Do Tickets'],
  },
  yaxis: {
    title: {
      text: 'Number of Tickets'
    }
  },
  fill: {
    opacity: 0.3
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      }
    }
  }
});

// Créer une série de données dynamiquement pour chaque sprint
const seriesData = updatedSprintTickets.map(ticket => ({
  name: ticket.sprintName,
  data: [ticket.completedTickets, ticket.inProgressTickets, ticket.toDoTickets]
}));

// Ajouter une série de données pour chaque sprint
setChartSeries1(seriesData);
      setChartSeries([
        {
          name: 'Total Tickets',
          data: updatedSprintTickets.map(ticket => ticket.totalTickets)
        },
        {
          name: 'Non-Technical Bugs',
          data: updatedSprintTickets.map(ticket => ticket.nonTechnicalBugs)
        },
        {
          name: 'Technical Bugs',
          data: updatedSprintTickets.map(ticket => ticket.technicalBugs)
        }
      ]);

      // Chart for bug types
      setBugTypeOptions({
        chart: {
          type: 'donut',
          height: 350
        },
        labels: ['Non-Technical Bugs', 'Technical Bugs'],
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
      });

      setBugTypeSeries(updatedSprintTickets.map(ticket => [ticket.nonTechnicalBugs, ticket.technicalBugs]));

    } catch (error) {
      console.error("Error fetching project details for dashboard:", error);
      console.log("Axios error details:", error.response.data);
    }
  };

  useEffect(() => {
    fetchProjectDetailsForDashboard();
  }, [selectedProjectId]);

  // Fonction pour calculer la durée totale du projet en jours
  const calculateProjectDuration = () => {
    if (sprintTickets.length === 0) return 0;
    const projectStartDate = new Date(sprintTickets[0].sprintStartDate);
    const projectEndDate = new Date(sprintTickets[sprintTickets.length - 1].sprintEndDate);
    return Math.abs(projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24);
  };

  // Calculer les données pour le graphique de progrès des sprints avec couleur différente pour chaque sprint
  const sprintProgressData = sprintTickets.map(sprint => {
    const sprintStartDate = new Date(sprint.sprintStartDate);
    const sprintEndDate = new Date(sprint.sprintEndDate);
    const elapsedDays = Math.ceil((Date.now() - sprintStartDate) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, Math.ceil((sprintEndDate - Date.now()) / (1000 * 60 * 60 * 24)));

    // Vérifier si sprint.tickets est défini
    const tasksCompleted = sprint.tickets ? sprint.tickets.filter(ticket => ticket.status === "Completed").length : 0;
    const tasksInProgress = sprint.tickets ? sprint.tickets.filter(ticket => ticket.status === "In Progress").length : 0;
    const tasksToDo = sprint.tickets ? sprint.tickets.length - tasksCompleted - tasksInProgress : 0;

    // Couleur en fonction des jours passés
    let fillColor;
    if (elapsedDays >= 0) {
      // Si les jours passés sont positifs, alors le sprint a déjà commencé
      // La couleur dépendra du pourcentage de jours passés par rapport à la durée totale du sprint
      const progressPercentage = (elapsedDays / (elapsedDays + remainingDays)) * 100;
      fillColor = `hsl(${progressPercentage}, 100%, 50%)`; // Utilisation de l'espace de couleur HSL pour générer des couleurs dynamiques
    } else {
      // Si les jours passés sont négatifs, le sprint n'a pas encore commencé
      fillColor = '#00E396'; // Couleur verte pour les jours restants
    }

    return {
      x: sprint.sprintName,
      y: [sprintStartDate.getTime(), sprintEndDate.getTime()],
      fillColor: fillColor,
      strokeColor: fillColor,
      progressPercentage: ((sprintEndDate - sprintStartDate) / (calculateProjectDuration() * 24 * 60 * 60 * 1000)) * 100,
      remainingDays: remainingDays,
      tasksCompleted: tasksCompleted,
      tasksInProgress: tasksInProgress,
      tasksToDo: tasksToDo
    };
  });

  // Options du graphique de progrès des sprints
  const sprintProgressChartOptions = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      show: false,
    },
  };

  // Série de données pour le graphique de progrès des sprints
  const sprintProgressChartSeries = [{
    data: sprintProgressData,
  }];

  return (
    <div>
      <div>
        <div className="card mb-4 border-0 lift">
          <div className="card-body">
            <h2>Dashboard</h2>
            <h3>Project Tickets</h3>
            <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
          </div>
        </div>

        <div className="card mb-4 border-0 lift">
          <div className="card-body">
            <h2>Dashboard</h2>
            <h3>Ticket Comparison per Sprint</h3>
            <ReactApexChart options={chartOptions1} series={chartSeries1} type="radar" height={650} />
          </div>
        </div>

        <div className="card mb-4 border-0 lift">
          <div className="card-body">
            <h3>Sprint Progress</h3>
            <ReactApexChart options={sprintProgressChartOptions} series={sprintProgressChartSeries} type="rangeBar" height={350} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {sprintTickets.slice(0, 2).map((sprint, index) => (
              <div key={index} className="card mb-4 border-0 lift">
                <div className="card-body">
                  <h3>{sprint.sprintName} Bug Types</h3>
                  <ReactApexChart options={bugTypeOptions} series={[sprint.nonTechnicalBugs, sprint.technicalBugs]} type="donut" height={350} />
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-6">
            {sprintTickets.slice(2).map((sprint, index) => (
              <div key={index} className="card mb-4 border-0 lift">
                <div className="card-body">
                  <h3>{sprint.sprintName} Bug Types</h3>
                  <ReactApexChart options={bugTypeOptions} series={[sprint.nonTechnicalBugs, sprint.technicalBugs]} type="donut" height={350} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
