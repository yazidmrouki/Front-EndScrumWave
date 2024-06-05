import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "react-bootstrap";

function UpcommingInterviews() {
    const [dailyScrumData, setDailyScrumData] = useState([]);
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchDailyScrumData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/daily-scrums/${email}`);
                setDailyScrumData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réunions quotidiennes :', error);
            }
        };

        fetchDailyScrumData();
    }, []);

    return (
        <div > 
           <Card className="shadow-lg" style={{ height: '800px' }}>
           <Card.Header className="bg-primary mb-3 text-white"> {/* Réduire la marge inférieure */}
                <h5 className="mb-5 fw-bold">Daily Scrums</h5>
            </Card.Header>
                <Card.Body className="mem-list">
                {Object.entries(dailyScrumData).map(([projectId, projectData]) => (
            <div key={projectId}>
                <Card className="mb-3">
                    <Card.Header className="py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                        <div className="d-flex align-items-center">
                            <img className="avatar lg rounded-circle img-thumbnail me-3" src={`http://localhost:3000/api/scrumMasters/get-profile-photo/${projectData.scrumMasterEmail}`} alt="profile" />
                            <div>
                                <h6 className="mb-0 fw-bold">{projectData.projectName}</h6>
                                <span className="text-muted">Scrum Master: {projectData.scrumMasterEmail}</span>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {projectData.dailyScrums.map((dailyScrum, index) => (
                            <div key={index} className="flex-grow-1">
                                <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                                    <div className="d-flex align-items-center flex-fill">
                                        <div className="d-flex flex-column ps-3">
                                            <h6 className={`fw-bold mb-0 small-14 ${dailyScrum.status === 'Completed' ? 'text-success' : dailyScrum.status === 'Upcoming' ? 'text-warning' : 'text-danger'}`}>
                                                {dailyScrum.status === 'Completed' ? 'Completed' : dailyScrum.status === 'Upcoming' ? 'Upcoming' : 'Cancelled'}
                                            </h6>
                                            <span className="text-muted">{dailyScrum.status === 'Completed' ? 'Completed' : dailyScrum.status === 'Upcoming' ? 'Upcoming' : 'Cancelled'}</span>
                                        </div>
                                    </div>
                                    <div className="time-block text-truncate">
                                        <i className="icofont-clock-time"></i> {formatDate(dailyScrum.dailyProgram)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </div>
        ))}
                </Card.Body>
            </Card>
        </div>
    );
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

export default UpcommingInterviews;
