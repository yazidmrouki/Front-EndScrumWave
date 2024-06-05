import React, { useEffect, useState } from "react";
import { Card, Row, Col,Tabs,Tab,Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faMoneyBillAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FiInfo } from "react-icons/fi";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegFrown } from 'react-icons/fa';
function ProjectDetails({
  projectName,
  projectCategory,
  projectStartDate,
  projectEndDate,
  projectAssignedTeams,
  budget,
  priority,
  emailProductOwner,
  sprints,
}) {
  const [daysLeft, setDaysLeft] = useState(null);
  const [activeTab, setActiveTab] = useState('project');


  useEffect(() => {
    setDaysLeft(calculateDaysLeft(projectEndDate));
  }, [projectEndDate]);

  const calculateDaysLeft = (endDate) => {
    const endDateObj = new Date(endDate);
    const currentDate = new Date();
    const differenceInTime = endDateObj.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
  };
  
  const handleSprintsTabClick = () => {
    if (!sprints || sprints.length === 0) {
      toast.warn("La liste des sprints est vide !");
    }
  };



  return (



<Card className="project-card ">
 
<Card.Header className={activeTab === 'project' ? 'bg-primary' : 'bg-secondary'}>
  <Tabs
    id="controlled-tabs"
    activeKey={activeTab}
    onSelect={(key) => setActiveTab(key)}
    className="w-100 justify-content-between text-white"
    style={{ height: '100%' }}
  >
    <Tab
      eventKey="project"
      title={<span className={`text-center ${activeTab === 'project' ? 'text-primary font-weight-bold' : 'text-white'}`}>Project Details</span>}
      style={{ height: '100%', width: '50%', opacity: activeTab === 'project' ? 1 : 0.5, transition: 'opacity 0.3s ease-in-out' }}
    />
    <Tab
      eventKey="sprints"
      title={<span className={`text-center ${activeTab === 'sprints' ? 'text-secondary font-weight-bold' : 'text-white'}`}>Sprints</span>}
      style={{ height: '100%', width: '50%', opacity: activeTab === 'sprints' ? 1 : 0.5, transition: 'opacity 0.3s ease-in-out' }}
    />
  </Tabs>
</Card.Header>


      <Card.Body className="mem-list">
        {activeTab === 'project' ? (
          <Row>
            <Col>
              <div className="project-info">
                <div className="info-item">
                  <span className="info-label"> Project Name:</span>
                  <span className="info-value">  {projectName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{projectCategory}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Start Date:</span>
                  <span className="info-value">{new Date(projectStartDate).toLocaleDateString("fr-CA")}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">End Date:</span>
                  <span className="info-value">{new Date(projectEndDate).toLocaleDateString("fr-CA")}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Assigned Teams:</span>
                  <span className="info-value">{projectAssignedTeams}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Budget:</span>
                  <span className="info-value">{budget}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Priority:</span>
                  <span className="info-value">{priority}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Product Owner Email:</span>
                  <span className="info-value">{emailProductOwner}</span>
                </div>
                {daysLeft !== null && (
                  <div className="info-item">
                    <span className="info-label">Days Left:</span>
                    <span className="info-value">{daysLeft} Days</span>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              {sprints && sprints.length > 0 ? (
                sprints.map((sprint, index) => (
                  <Card key={index} className="sprint-card mb-3 " > 
                    <Card.Header className="bg-secondary text-white  d-flex align-items-center">
                      <h5 className="mb-0 me-3 ">{sprint.sprintName}</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="sprint-info">
                        <div className="info-item">
                          <span className="info-label">Start Date:</span>
                          <span className="info-value">{new Date(sprint.sprintStartDate).toLocaleDateString("fr-CA")}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">End Date:</span>
                          <span className="info-value">{new Date(sprint.sprintEndDate).toLocaleDateString("fr-CA")}</span>
                        </div>
                        {sprint.sprintEndDate && (
                          <div className="info-item">
                            <span className="info-label">Days Left:</span>
                            <span className="info-value">{calculateDaysLeft(sprint.sprintEndDate)} Days </span>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '35vh' }}>
                <img
  src="https://cdn-icons-png.flaticon.com/512/5108/5108574.png"
  width={75}
  height={75}
  alt="icon"
  className="mb-4 animate__animated animate__bounceIn"
/>

                <h3 className="text-secondary mb-3">No Sprint Found</h3>
             
              
                <ToastContainer />
            </div>
              )}
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};
     


export default ProjectDetails;
