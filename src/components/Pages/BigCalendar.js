import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import moment from 'moment';
import { toast, ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css';
import { red } from "@mui/material/colors";
import { cookieStorageManager } from "@chakra-ui/react";
import './Calender.css';
function BigCalendar() {
  const [events, setEvents] = useState([]);
  const teamId = localStorage.getItem("Assignedteam");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const productOwnerId = localStorage.getItem("id");
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [dailyEvents, setDailyEvents] = useState([]);
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [formattedEvents, setFormattedEvents] = useState([]);
  const [Sunday, setSunday] = useState([]);

  useEffect(() => {
    if (!teamId ) return;

    const fetchAssignedProjects = async () => {
      try {
        let response;
        if (role === 'ProductOwners') {
          response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Projects/${email}`);
        } else if (role === 'Devellopeurs' || role === 'scrumMasters') {
          if (!teamId) {
            toast.warning('Aucun projet assigné.');
            return;
          }
          response = await axios.get(`http://localhost:3000/api/${role}/get-ProjectsAssigne/${teamId}`);
        }
      
        const projects = response.data;
      
        if (!projects || projects.length === 0) {
          toast.warning('Aucun projet assigné.');
          
          return;
        }

        setAssignedProjects(projects);
      } catch (error) {
        toast.warning('Warning  lors de la récupération des projets assignés ');
      }
    };

    fetchAssignedProjects();
  }, [teamId, role, email]);

  useEffect(() => {
    
  
    const fetchDailyEvents = async () => {
      try {
     
        const dailyEventsPromises = assignedProjects.map(async project => {
          const projectId = project._id;
       
          const dailyScrumResponse = await axios.get(`http://localhost:3000/api/${role}/get-daily/${projectId}`);
          
          const dailyScrumEvents = dailyScrumResponse.data.map(item => {
            const isCancelled = item.annuler ? 'Annulée' : '';
            const meetingTitle = isCancelled ? `Réunion annulée - ${item.projectName ?? ""}` : `Réunion - ${item.projectName ?? ""}`;
            
            return {
              id: item._id,
              title: `${meetingTitle} - ${moment(item.dailyProgram).format('HH:mm:ss')}H`,
              start: moment(item.dailyProgram).format('YYYY-MM-DD') + 'T' + moment(item.dailyProgram).format('HH:mm:ss'),
              allDay: true,
              color: isCancelled ? 'red' : 'green',
              textColor: "black",
              borderColor: '#000000',
              className: 'daily-scrum-event',
              extendedProps: {
                textColor: "black",
                fontWeight: "bold",
                fontSize: "16px",
              projectName: project.name ?? "",


                isCancelled: isCancelled
              }
            };
            
          });

          return dailyScrumEvents;
        });

        const allDailyEvents = await Promise.all(dailyEventsPromises);
        const flatEvents = allDailyEvents.flat();
        setDailyEvents(flatEvents);
      } catch (error) {
        console.error('Error fetching daily events:', error);
      }
    };

    fetchDailyEvents();
  }, [assignedProjects, ,role]);

  useEffect(() => {
    if (!teamId && role !== 'ProductOwners') return;

    const fetchHolidays = async () => {
      try {
        let holidayResponse;

        if (role === 'ProductOwners' && productOwnerId) {
          holidayResponse = await axios.get(`http://localhost:3000/api/holidays/get-holidays/${productOwnerId}`);
        } else if (teamId) {
          holidayResponse = await axios.get(`http://localhost:3000/api/holidays/get-holidays-team/${teamId}`);
        } else {
          return;
        }

        const formattedEvents = holidayResponse.data.map(holiday => ({
          id: holiday._id,
          title: holiday.teamName ? `${holiday.name} - ${holiday.teamName}` : holiday.name,
          start: moment(holiday.startDate).format('YYYY-MM-DD'),
          end: moment(holiday.endDate).add(1, 'day').format('YYYY-MM-DD'),
          allDay: true,
          color: 'bleu'
        }));

        setFormattedEvents(formattedEvents);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Erreur 404 : Ressource non trouvée.', error);
        } else {
          console.error('Erreur lors de la récupération des événements :', error);
        }
      }
    };

    fetchHolidays();
  }, [teamId, role, productOwnerId]);

  useEffect(() => {
    let currentYear = moment().year();
    let startOfYear = moment().startOf('year').year(currentYear);
    let endOfYear = moment().endOf('year').year(currentYear);

    if (moment().isAfter(endOfYear)) {
      currentYear++;
      startOfYear = moment().startOf('year').year(currentYear);
      endOfYear = moment().endOf('year').year(currentYear);
    }

    const fetchDailyRoutine = async () => {
      let weeklyEvents = [];
      for (let weekStart = moment(startOfYear); weekStart.isBefore(endOfYear); weekStart.add(1, 'month')) {
        const weekEnd = moment(weekStart).endOf('isoWeek');
        try {
          const dailyRoutineResponse = await axios.get('http://localhost:3000/api/ProductOwners/get-journees');
          const dailyRoutine = dailyRoutineResponse.data;
          const eventsForWeek = dailyRoutine.map(day => {
            const currentDay = moment(weekStart).day(day.jour);
            if (currentDay.isBefore(weekEnd)) {
              let events = [];
              if (day.punchinTime) {
                events.push({
                  title: `Punchin Time - ${day.punchinTime}`,
                  start: currentDay.format('YYYY-MM-DD') + 'T' + moment(day.punchinTime, 'HH:mm').format('HH:mm:ss'),
                  allDay: false,
                  color: 'green'
                });
              }
              if (day.breackTime) {
                events.push({
                  title: `Break Time - ${day.breackTime}`,
                  start: currentDay.format('YYYY-MM-DD') + 'T' + moment(day.breackTime, 'HH:mm').format('HH:mm:ss'),
                  allDay: false,
                  color: 'orange'
                });
              }
              if (day.punchoutTime) {
                events.push({
                  title: `Punchout Time - ${day.punchoutTime}`,
                  start: currentDay.format('YYYY-MM-DD') + 'T' + moment(day.punchoutTime, 'HH:mm').format('HH:mm:ss'),
                  allDay: false,
                  color: 'red'
                });
              }
             
              return events;
            } else {
              return [];
            }
          }).flat();
          weeklyEvents = weeklyEvents.concat(eventsForWeek);
        } catch (error) {
          console.error('Erreur lors de la récupération des événements :', error);
        }
      }
      setWeeklyEvents(weeklyEvents);
    };

    fetchDailyRoutine();
  }, []);

  useEffect(() => {
    const fetchSundayEvents = async () => {
      try {
        const currentYear = moment().year();
        const startOfYear = moment().startOf('year').year(currentYear);
        const endOfYear = moment().endOf('year').year(currentYear);
  
        const sundaysOfYear = [];
        for (let date = moment(startOfYear); date.isBefore(endOfYear); date.add(1, 'day')) {
          if (date.day() === 0) { // Vérifie si le jour est un dimanche (0 correspond au dimanche)
            sundaysOfYear.push({
              start: date.format("YYYY-MM-DD"),
              rendering: 'background',
              display: 'background',
              color:  '#c62828',
              textColor: 'black'
            });
          }
        }
        setSunday(sundaysOfYear);
       // Ajoutez les événements de dimanche à la liste d'événements principale
      } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
      }
    };
  
    fetchSundayEvents();
  }, []);
  

  
  useEffect(() => {
    setEvents([...dailyEvents, ...weeklyEvents, ...formattedEvents, ...Sunday]);
  }, [dailyEvents, weeklyEvents, formattedEvents, Sunday]);

  return (
    <div className="card">
      <div className="py-3 px-3">
        <FullCalendar 
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events}
          eventDisplay="auto"
        
          dayMaxEvents={1} // Remplace eventLimit
        />
        <ToastContainer />
      </div>
    </div>
  );
}

export default BigCalendar;
