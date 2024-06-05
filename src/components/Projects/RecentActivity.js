import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegFrown } from 'react-icons/fa';


function RecentActivity({ projectId }) {
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchRecentActivities(projectId);
    }, [projectId]);

    const fetchRecentActivities = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/Devellopeurs/recent-activities/${projectId}`);
            const data = await response.json();
            setRecentActivities(data.recentActivities);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `il y a ${seconds} secondes`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `il y a ${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `il y a ${hours} heures`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `il y a ${days} jours`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `il y a ${weeks} semaines`;
        const months = Math.floor(days / 30);
        if (months < 12) return `il y a ${months} mois`;
        const years = Math.floor(months / 12);
        return `il y a ${years} années`;
    };

    const getRandomColor = () => {
        const colors = [ 'ti-warning', 'ti-primary'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Card>
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0 fw-bold">Recent Activity</h5>
            </Card.Header>
            <Card.Body className="mem-list">
                {recentActivities.length === 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '30vh' }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/6897/6897309.png"
                            width={130}
                            height={100}
                            alt="icon"
                            className="mb-4 animate__animated animate__bounceIn"
                        />
                        <h3 className="text-secondary mb-3">No Sprint Found</h3>
                        <ToastContainer />
                    </div>
                ) : (
                    recentActivities.map((activity) => (
                        <div key={activity._id} className={`timeline-item border-bottom ms-2 ${getRandomColor()}`}>
                            <div className="d-flex">
                                <span className="avatar d-flex justify-content-center align-items-center rounded-circle light-success-bg">
                                    <img className="large-avatar" src={`http://localhost:3000/api/Devellopeurs/get-profile-photo/${activity.email}`} alt="" />
                                </span>
                                <div className="flex-fill ms-3">
                                    <div className="mb-1"><strong>{activity.nameActor}</strong> {activity.actionInfo}</div>
                                    <span className="d-flex text-muted">{formatDate(activity.date)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </Card.Body>
        </Card>
    );
}

export default RecentActivity;
