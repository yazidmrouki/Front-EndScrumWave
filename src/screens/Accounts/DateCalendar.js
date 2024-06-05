// DateCalendar.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function DateCalendar({ date }) {
  const formattedDate = new Date(date);
  return (
    <div className="calendar-container">
      <Calendar
        value={formattedDate}
        tileDisabled={() => true} // Désactive toutes les dates
        showNeighboringMonth={false}
      />
    </div>
  );
}

export default DateCalendar;
