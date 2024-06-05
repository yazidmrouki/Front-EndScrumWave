// AnalogClockDisplay.js
import React from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

function AnalogClockDisplay({ time }) {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return <Clock value={date} />;
}

export default AnalogClockDisplay;
