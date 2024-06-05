import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import axios from 'axios';
import Chart from "react-apexcharts";
import { EmployessYearlyStatusData } from "../../components/Data/ChartData";
import RecentActivityCard from "../../components/Employees/RecentActivityCard";
import StatisticsCard from "../../components/Employees/StatisticsCard";

import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import WorkingHours from "./WorkingHours";
import TodayTimeUtilisation from "../../components/Employees/ProgresToday";


export const TimeAttendanceData = {
  title: "Time Attendance",
  columns: [
    {
      name: "Numéro de Compte",
      selector: (row, index) => index + 1,
      sortable: true
    },
    {
      name: "Jour",
      selector: row => row.jour,
      sortable: true,
    },
    {
      name: "Heure d'Embauche",
      selector: row => row.punchinTime,
      sortable: true,
    },
    {
      name: "Heure de Débauche",
      selector: row => <span className="text-danger">{row.punchoutTime}</span>,
      sortable: true,
    },
    {
      name: "Temps de Pause",
      selector: row => <span className="text-danger">{row.breackTime}</span>,
      sortable: true,
    },
    {
      name: "Demi-Journée",
      selector: row => <i className={`icofont-close-circled ${row.halfDay ? 'text-success' : 'text-danger'}`}></i>,
      sortable: true
    },
    {
      name: "Journée Complète",
      selector: row => <i className={`icofont-close-circled ${row.fullDay ? 'text-success' : 'text-danger'}`}></i>,
      sortable: true
    },
    {
      name: "Heures Supplémentaires",
      selector: row => <span className="text-success">{row.overTime}</span>,
      sortable: true,
    },
    {
      name: "Production Totale",
      selector: row => row.total
    }
  ]
};

function AttendanceEmployees() {
  const [dayRoutineToday, setDayRoutineToday] = useState({});
  const [dayRoutines, setDayRoutines] = useState([]);
  const [selectedDayRoutine, setSelectedDayRoutine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = localStorage.getItem('id');
  const email=localStorage.getItem('email');
  const [workingPercentage, setWorkingPercentage] = useState(0);

  const [formData, setFormData] = useState({
    punchinTime: "",
    punchoutTime: "",
    breackTime: "",
    halfDay: false,
    fullDay: false,
    overTime: "",
    total: ""
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/ProductOwners/update-journee/${selectedDayRoutine._id}/${email}`, formData);
      toast.success('Routine updated successfully');
      setIsModalOpen(false);
      fetchData(); // Re-fetch data after update
    } catch (error) {
      console.error('Error updating routine:', error);
      toast.error('Error updating routine');
    }
  };

  const handleRowClick = (row) => {
    setSelectedDayRoutine(row);
    setFormData({
      punchinTime: row.punchinTime,
      punchoutTime: row.punchoutTime,
      breackTime: row.breackTime,
      halfDay: row.halfDay,
      fullDay: row.fullDay,
      overTime: row.overTime,
      total: row.total
    });
    setIsModalOpen(true);
  };

  const fetchData = () => {
    axios.get('http://localhost:3000/api/ProductOwners/get-journees')
      .then((response) => {
        setDayRoutines(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching day routines:', error);
      });
  };

  const fetchDayRoutineToday = () => {
    const currentDay = getCurrentDay().toLowerCase(); // Mettre en minuscules pour la comparaison
    console.log(currentDay);

    const todayRoutine = dayRoutines
      .map(dayRoutine => {
        console.log("hello " + dayRoutine.jour); // Afficher le jour original
        console.log("hello word " + dayRoutine.jour.toLowerCase()); // Afficher le jour en minuscules
        console.log("Comparing " + dayRoutine.jour.toLowerCase() + " with " + currentDay); // Afficher la comparaison
        if (dayRoutine.jour.toLowerCase() === currentDay) {
          return dayRoutine;
        }
        return null; // Retourner null si pas de correspondance
      })
      .filter(dayRoutine => dayRoutine !== null)[0]; // Filtrer les nulls et prendre le premier élément

    console.log(dayRoutines);
    console.log("Current Day:", currentDay.toLowerCase());
    setDayRoutineToday(todayRoutine);
    console.log("Routine du jour : " + JSON.stringify(todayRoutine, null, 2));
  };

  // Fonction pour obtenir le jour actuel
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    return days[date.getDay()];
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDayRoutineToday();
  }, [dayRoutines]);

  const [currentDate, setCurrentDate] = useState("");

  // Fonction pour obtenir la date actuelle au format spécifié
  const getCurrentFormattedDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    // Mettre à jour la date actuelle lors du chargement du composant
    setCurrentDate(getCurrentFormattedDate());
  }, []);


  useEffect(() => {
 
// Function to fetch today's working percentage from backend
const fetchWorkingPercentage = () => {
  // Assuming you store PoId in localStorage
  axios.get(`http://localhost:3000/api/ProductOwners/get-WorkingToday/${id}`)
    .then((response) => {
      const { workingPercentage } = response.data;
      setWorkingPercentage(workingPercentage);
      console.log("workingPercentage", workingPercentage); // Corrected console.log statement
    })
    .catch((error) => {
      console.error('Error fetching working percentage:', error);
    });
};
fetchWorkingPercentage();
}, []); 
// Effect to fetch today's working percentage

// Removed workingPercentage from dependencies since it's not used here

// Update chart options with today's working percentage
// Update chart options with today's working percentage
const TodayTimeUtilisationData = (workingPercentage) => ({
  options: {
    chart: {
      height: 350, // Increase height for a larger display
      type: ' donut',
    },
    colors: ['#FFA726'], // Use a vibrant color for the chart
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%', // Use percentage for size
        },
        dataLabels: {
          name: {
            fontSize: '22px',
            color: '#333',
            offsetY: -10
          },
          value: {
            fontSize: '16px',
            color: '#777',
            offsetY: 5,
            formatter: function (val) {
              return val + '%';
            }
          }
        }
      },
    },
    stroke: {
      lineCap: 'round'
    },
    series: [workingPercentage ? workingPercentage : 0], // Ensure workingPercentage is a number
    labels: ['Working'],
  }
});





      return (
        <div className="container-xxl">
        <ToastContainer />
        <PageHeader headerTitle="Attendance Employees" />
  
        <div className="row align-item-center row-deck g-3 mb-3">
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="timesheet-info d-flex align-items-center justify-content-between flex-wrap">
                  <div className="intime d-flex align-items-center mt-2">
                    <i className="icofont-finger-print fs-4 color-light-success"></i>
                    <span className="fw-bold ms-1">Punch In: {dayRoutineToday?.punchinTime || 'N/A'} Hr</span>
                  </div>
                  <div className="outtime mt-2 w-sm-100">
                    <button type="button" className="btn btn-dark w-sm-100">
                      <i className="icofont-foot-print me-2"></i>Punch Out
                    </button>
                  </div>
                </div>
               <TodayTimeUtilisation/>
                <div className="timesheet-info d-flex align-items-center justify-content-around flex-wrap">
                  <div className="intime d-flex align-items-center">
                    <i className="icofont-lunch fs-3 color-lavender-purple"></i>
                    <span className="fw-bold ms-1">Break: {dayRoutineToday?.breackTime || 'N/A'} Hr</span>
                  </div>
                  <div className="intime d-flex align-items-center">
                    <i className="icofont-ui-timer fs-4 color-light-success"></i>
                    <span className="fw-bold ms-1">Punch Out: {dayRoutineToday?.punchoutTime || 'N/A'} Hr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
            <WorkingHours PoId={id} />
          </div>
        </div>
  
        <div className="row clearfix g-3">
          <div className="col-sm-12">
            <DataTable
              title="Attendance List"
              columns={TimeAttendanceData.columns}
              data={dayRoutines}
              defaultSortField="title"
              pagination
              selectableRows={false}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
              onRowClicked={handleRowClick}
            />
          </div>
        </div>
  
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedDayRoutine ? "Edit" : "Add"} Day Routine</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              {/* Les champs de formulaire ici */}
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>{' '}
              <Button variant="primary" type="submit">Save changes</Button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  export default AttendanceEmployees;