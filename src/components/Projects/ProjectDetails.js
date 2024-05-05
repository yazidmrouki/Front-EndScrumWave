import React, { useEffect, useState } from "react";
import { Card, ProgressBar, Row, Col } from "react-bootstrap";

function ProjectDetails({ projectName, projectCategory, projectStartDate, projectEndDate, projectAssignedTeams, budget, priority, emailProductOwner }) {
    const [daysLeft, setDaysLeft] = useState(null);

    useEffect(() => {
        // Fonction pour calculer le nombre de jours restants
        const calculateDaysLeft = () => {
            const endDate = new Date(projectEndDate);
            const currentDate = new Date();
            const differenceInTime = endDate.getTime() - currentDate.getTime();
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            return differenceInDays;
        };

        // Mettre à jour le nombre de jours restants
        setDaysLeft(calculateDaysLeft());
    }, [projectEndDate]);

    return (
        <Card>
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0 fw-bold">Project Details</h5>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col>
                        <h6 className="mb-1">Project Name:</h6>
                        <p className="text-muted">{projectName}</p>
                    </Col>
                    <Col>
                        <h6 className="mb-1">Category:</h6>
                        <p className="text-muted">{projectCategory}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <p className="mb-1"><strong>Start Date:</strong> {projectStartDate}</p>
                        <p className="mb-1"><strong>End Date:</strong> {projectEndDate}</p>
                    </Col>
                    <Col>
                        <p className="mb-1"><strong>Assigned Teams:</strong> {projectAssignedTeams}</p>
                        <p className="mb-1"><strong>Budget:</strong> {budget}</p>
                        <p className="mb-1"><strong>Priority:</strong> {priority}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="mb-1"><strong>Product Owner Email:</strong> {emailProductOwner}</p>
                    </Col>
                    <Col>
                        {daysLeft !== null && (
                            <p className="mb-1"><strong>Days Left:</strong> {daysLeft}</p>
                        )}
                    </Col>
                </Row>
                <br></br>
                <hr className="my-4" />
                
                {/* Insérez ici votre code pour la progression des tâches */}
            </Card.Body>
        </Card>
    );
}

export default ProjectDetails;
