import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeesAvailability(props) {
    const [stats, setStats] = useState(null);
    const id = props.id;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/attendance-stats/${id}`);
                // Récupérer les données de la réponse
                const data = response.data;
                // Stocker les données dans l'état
                setStats(data);
            } catch (error) {
                // Gérer les erreurs
                console.error('Une erreur est survenue lors de la récupération des détails :', error);
            }
        };

        fetchStats();
    }, [id]);

    return (
        <div className="card">
        <div className="card-body">
            <div className="row g-2 row-deck">
                <div className="col-md-6 col-sm-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <video className="icon-video" style={{ width: '55px', height: '55px' }} autoPlay loop muted>
                                <source src="https://cdn-icons-mp4.flaticon.com/512/16664/16664314.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <h6 className="mt-3 mb-0 fw-bold small-14">Attendance</h6>
                            <span className="text-muted">{stats ? stats.present : 0}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <video className="icon-video" style={{ width: '55px', height: '55px' }} autoPlay loop muted>
                                <source src="https://cdn-icons-mp4.flaticon.com/512/15594/15594572.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <h6 className="mt-3 mb-0 fw-bold small-14">Late Coming</h6>
                            <span className="text-muted">{stats ? stats.late : 0}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <video className="icon-video" style={{ width: '55px', height: '55px' }} autoPlay loop muted>
                                <source src="https://cdn-icons-mp4.flaticon.com/512/12340/12340785.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <h6 className="mt-3 mb-0 fw-bold small-14">Absent</h6>
                            <span className="text-muted">{stats ? stats.absent : 0}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6">
                    <div className="card">
                        <div className="card-body d-flex justify-content-between">
                            <div className="half-width">
                                <video className="icon-video" style={{ width: '55px', height: '55px' }} autoPlay loop muted>
                                    <source src="https://cdn-icons-mp4.flaticon.com/512/14984/14984690.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <h6 className="mt-3 mb-0 fw-bold small-14">Half</h6>
                                <span className="text-muted">{stats ? stats.halfDay : 0}</span>
                            </div>
                            <div className="half-width">
                                <video className="icon-video" style={{ width: '55px', height: '55px' }}autoPlay loop muted>
                                    <source src="https://cdn-icons-mp4.flaticon.com/512/14984/14984694.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <h6 className="mt-3 mb-0 fw-bold small-14">Full</h6>
                                <span className="text-muted">{stats ? stats.fullDay : 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default EmployeesAvailability;
