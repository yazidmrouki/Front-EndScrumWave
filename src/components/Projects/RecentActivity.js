import React from "react";
import { Card } from "react-bootstrap";

function RecentActivity() {
    return (
        <Card>
            <Card.Header className="bg-primary text-white">
            <h5 className="mb-0 fw-bold">Recent Activity</h5>
            </Card.Header>
            <Card.Body className="mem-list">
                <div className="timeline-item ti-danger border-bottom ms-2">
                    <div className="d-flex">
                        <span className="avatar d-flex justify-content-center align-items-center rounded-circle light-success-bg">RH</span>
                        <div className="flex-fill ms-3">
                            <div className="mb-1"><strong>Rechard Add New Task</strong></div>
                            <span className="d-flex text-muted">20Min ago</span>
                        </div>
                    </div>
                </div>
                <div className="timeline-item ti-info border-bottom ms-2">
                    <div className="d-flex">
                        <span className="avatar d-flex justify-content-center align-items-center rounded-circle bg-careys-pink">SP</span>
                        <div className="flex-fill ms-3">
                            <div className="mb-1"><strong>Shipa Review Completed</strong></div>
                            <span className="d-flex text-muted">40Min ago</span>
                        </div>
                    </div>
                </div>
                <div className="timeline-item ti-info border-bottom ms-2">
                    <div className="d-flex">
                        <span className="avatar d-flex justify-content-center align-items-center rounded-circle bg-careys-pink">MR</span>
                        <div className="flex-fill ms-3">
                            <div className="mb-1"><strong>Mora Task To Completed</strong></div>
                            <span className="d-flex text-muted">1Hr ago</span>
                        </div>
                    </div>
                </div>
                <div className="timeline-item ti-success ms-2">
                    <div className="d-flex">
                        <span className="avatar d-flex justify-content-center align-items-center rounded-circle bg-lavender-purple">FL</span>
                        <div className="flex-fill ms-3">
                            <div className="mb-1"><strong>Fila Add New Task</strong></div>
                            <span className="d-flex text-muted">1Day ago</span>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default RecentActivity;
