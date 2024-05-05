import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios';
import moment from 'moment';

function BigCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/holidays/get-holidays');
      const formattedEvents = response.data.map(holiday => ({
        id: holiday._id,
        title: `${holiday.name} ${moment(holiday.startDate).format('HH:mm dddd')}`, 
        start: moment(holiday.startDate).format('YYYY-MM-DD'), 
        end: moment(holiday.endDate).add(1, 'day').format('YYYY-MM-DD'), 
        allDay: true 
      }));

      // Ajouter un événement pour chaque mardi
      const currentDate = moment().startOf('week');
      while (currentDate.day(2).isBefore(moment().endOf('week'))) {
        formattedEvents.push({
          id: 'mardi-' + currentDate.format('YYYY-MM-DD'),
          title: 'Meeting',
          start: currentDate.format('YYYY-MM-DD'),
          allDay: true,
          color: 'blue' // Ajout de la couleur bleue
        });
      }

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  };

  return (
    <div className="card">
      <div className="py-3 px-3">
        <FullCalendar 
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events}
        />
      </div>
    </div>
  );
}

export default BigCalendar;
