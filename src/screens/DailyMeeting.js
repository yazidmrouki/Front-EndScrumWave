import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import './Main.css';

function DailyMeeting({ projectId }) {
  const [dailyMeeting, setDailyMeeting] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [meetingTimePassed, setMeetingTimePassed] = useState(false);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!projectId) {
      return; // Si projectId est vide, ne fait rien
    }

    const fetchDailyMeetingData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${role}/get-daily/${projectId}`);
        const now = moment(); // Date actuelle
        let closestMeeting = null;

        response.data.forEach((item) => {
          const dailyMoment = moment(item.dailyProgram);
          const remainingTime = dailyMoment.diff(now, 'seconds');
          if (remainingTime >= 0 && (!closestMeeting || remainingTime < closestMeeting.remainingTime)) {
            closestMeeting = {
              date: dailyMoment.format('YYYY-MM-DD'),
              time: dailyMoment.format('HH:mm'),
              meetingLink: item.dailyUrl,
              _id: item._id,
              remainingTime: remainingTime,
              added: item.added,
              annuler: item.annuler
            };
          }
        });

        setDailyMeeting(closestMeeting);
      } catch (error) {
        console.error('Error fetching Daily:', error);
      }
    };

    fetchDailyMeetingData();
  }, [projectId, role]);

  useEffect(() => {
    if (!projectId) {
      return; // Si projectId est vide, ne fait rien
    }

    const checkDailyMeeting = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${role}/check-daily/${projectId}`);
        const { found, meetingUrl } = response.data;

        if (found) {
          // Si une réunion quotidienne est trouvée
          setShowJoinButton(true);
          // Si l'URL de la réunion est fournie, mettre à jour le lien de la réunion
          if (meetingUrl) {
            setDailyMeeting(prevState => ({ ...prevState, meetingLink: meetingUrl }));
          }
        } else {
          // Si aucune réunion quotidienne n'est trouvée, cacher le bouton
          setShowJoinButton(false);
        }
      } catch (error) {
        console.error('Error checking daily meeting:', error);
      }
    };

    // Appeler la vérification de la réunion quotidienne chaque seconde
    const intervalId = setInterval(checkDailyMeeting, 1000);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, [projectId, role]);

  useEffect(() => {
    if (!dailyMeeting) {
      return; // Si dailyMeeting est vide, ne fait rien
    }

    const meetingTime = new Date(dailyMeeting.date + 'T' + dailyMeeting.time);
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = meetingTime - now;
      if (timeDiff > 0) {
        setCountdown(timeDiff);
      } else {
        setMeetingTimePassed(true);
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [dailyMeeting]);

  const handleJoinMeeting = () => {
    if (!dailyMeeting || !dailyMeeting.meetingLink) {
      toast.warning('URL not added For this moment ');
      return;
    }
    window.location.href = dailyMeeting.meetingLink;
  };

  return (
    <div className="meeting-container">
      {(showJoinButton && (
        <button className={`join-meeting-btn ${meetingTimePassed && dailyMeeting ? 'circle' : ''}`} onClick={handleJoinMeeting}>
          Join Daily 
        </button>
      ))}
      {!showJoinButton && (
        <div className={`circle bg-secondary ${countdown && countdown <= 300000 ? 'blinking' : ''}`}>
          <p>{formatTime(countdown)}</p>
        </div>
      )}
    </div>
  );}

function formatTime(timeInMs) {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}

export default DailyMeeting;
