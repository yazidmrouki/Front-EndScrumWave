import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function TimeLeftCounter({ remainingTime, projectId, scrumId, added }) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);
  const [blink, setBlink] = useState(false); // État pour le clignotement
  const [showModal, setShowModal] = useState(false); // État pour l'affichage du modal
  const [dailyUrl, setDailyUrl] = useState('');
  const [urlAdded, setUrlAdded] = useState(added);

  const teamId=localStorage.getItem('Assignedteam');
  const name=localStorage.getItem('name');
  const email=localStorage.getItem('email');
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Effectuer l'appel Axios pour vérifier l'état du daily
      axios.get(`http://localhost:3000/api/scrumMasters/check-daily-status/${projectId}/${scrumId}`, {
        params: {
          email,
          name,
          teamId
        }
      })
        .then(response => {
          const { openModal, annuler } = response.data;
          
          // Si openModal est vrai, afficher le modal
          if (openModal) {
            setShowModal(true);
          }
          // Si le daily a été annulé, fermer le modal
          if (annuler) {
            setShowModal(false);
          }
        })
        .catch(error => {
          console.error('Error checking daily status:', error);
        });
    }, 1000); // Appel toutes les secondes
  
    // Nettoyer l'intervalle lorsque le composant est démonté ou lorsque showModal devient faux
    return () => clearInterval(intervalId);
  }, [projectId, scrumId, email, name, teamId]);
  
  


  const handleSubmit = (e) => {
    e.preventDefault();
    // Effectuer l'appel Axios pour ajouter l'URL et mettre à jour l'état added
    axios.put(`http://localhost:3000/api/scrumMasters/update-UrlAndAdded/${projectId}/${scrumId}` , { 
      dailyUrl, 
      added: true,
      email, // Ajouter l'e-mail
      name, // Ajouter le nom
      teamId // Ajouter l'ID de l'équipe
    })
      .then(response => {
        console.log(response.data);
        setShowModal(false);
        // Recharger la page après une demi-seconde
        setTimeout(() => {
          window.location.reload(); 
        }, 500);
      })
      .catch(error => {
        console.error('Error updating daily URL:', error);
      });
  };








  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Si timeLeft est compris entre 0 et 600 secondes, activer le clignotement
    if (timeLeft > 0 && timeLeft <= 600) {
      const blinkInterval = setInterval(() => {
        setBlink(prevBlink => !prevBlink);
      }, 500);
      return () => clearInterval(blinkInterval);
    } else if (timeLeft <= 0) {
      setBlink(true);
    }
  }, [timeLeft]);

  let color = '#28a745';
  if (timeLeft <= 600 && timeLeft > 0) {
    color = blink ? 'red' : 'transparent';
  } else if (timeLeft <= 0) {
    color = 'red';
  }


  return (
    <div className="time-left-cell">
      <div className="progress-circle">
        <svg width="100" height="100">
          <circle
            className="progress-ring-circle"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <text x="50%" y="50%" textAnchor="middle" fill={color}>
            {timeLeft > 0 ? formatTime(timeLeft) : '00:00:00'}
          </text>
        </svg>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        className="attention-modal"
      >
        <Modal.Header>
          <Modal.Title>Attention!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="attention-message">Remplir le Meeting, le temps est écoulé!</p>
          <p>Temps écoulé: {formatTime(Math.abs(timeLeft))}</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTeamName">
              <Form.Label>Meeting URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter meeting URL"
                value={dailyUrl}
                onChange={(e) => setDailyUrl(e.target.value)}
              />
            </Form.Group>
            <Button variant="danger" type="submit">
              Add URL
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

export default TimeLeftCounter;