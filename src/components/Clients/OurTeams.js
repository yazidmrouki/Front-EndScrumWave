import React, { useState, useEffect } from 'react';
import { Modal, Badge, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faPhone, faBirthdayCake, faMapMarkerAlt, faCalendarAlt,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


function OurClients(props) {
    const { role, nom, type, email, prenom, phone, profileInfo, experiences, _id } = props;
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/${role}/isConnected/${_id}`);
                setIsConnected(response.data.isConnected);
            } catch (error) {
                console.error("Error fetching connected status", error);
            }
        };
        fetchData();
    }, [role, _id]);

    
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="card teacher-card">
        <div className="card-body d-flex">
            <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                <div style={{ position: "relative", display: "inline-block" }}>
                {isConnected ? (
                      <div className="position-absolute start-150 translate-middle badge rounded-circle bg-success big-badge" style={{ left: '70%', bottom: '-10%', transform: 'translate(-50%, 50%)', width: '30px', height: '30px' }}>
                      <span className="visually-hidden">Online</span>
                  </div>
                  
                    ) : (
                        <div className="position-absolute start-150 translate-middle badge rounded-circle bg-danger big-badge" style={{ left: '70%', bottom: '-10%', transform: 'translate(-50%, 50%)', width: '30px', height: '30px' }}>
                        <span className="visually-hidden">Offline</span>
                    </div>
                    )}
                    <img src={`http://localhost:3000/api/${role}/get-profile-photo/${email}`} alt="" className="avatar xl rounded-circle img-thumbnail shadow-sm" />
                   
                    </div>
                    <div className="about-info d-flex align-items-center mt-1 justify-content-center flex-column">
                        <h6 className="mb-0 fw-bold d-block fs-6 mt-2">{nom} {prenom}</h6>
                        <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                            <Badge pill bg={isConnected ? "success" : "danger"} style={{ backgroundColor: isConnected ? '#4CAF50' : '#F44336' }}>
                                {isConnected ? "Online" : "Offline"}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
             
                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">{email}</h6>
                    <span className="bg-secondary py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1"> {type ? type : 'ScrumMaster'}</span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                        <p>{props.profileInfo.description}</p>
                    </div>
                    <div className="d-flex flex-wrap align-items-center ct-btn-set">
                        <button
                            className="btn btn-dark btn-sm mt-1"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="icofont-invisible me-2 fs-6"></i>More Details
                        </button>
                    </div>
                </div>
            </div>

          <Modal show={showModal} onHide={closeModal} centered>
            <Modal.Body className="custom-modal-body">
                {/* Your modal content */}
                <div className="user-profile mb-4">
                    <h2 className="text-primary mb-3">User Details</h2>
                    <div className="user-detail-item">
                        <FontAwesomeIcon icon={faEnvelope} className="me-2 text-secondary" /> Email: {email}
                    </div>
                    <div className="user-detail-item">
                        <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" /> Type: {type}
                    </div>
                    <div className="user-detail-item">
                        <FontAwesomeIcon icon={faPhone} className="me-2 text-secondary" /> Téléphone: {phone}
                    </div>
                    <div className="user-detail-item">
                        <FontAwesomeIcon icon={faBirthdayCake} className="me-2 text-secondary" /> Date de Naissance: {profileInfo.birthday}
                    </div>
                    <div className="user-detail-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-secondary" /> Adresse: {profileInfo.address}
                    </div>
                </div>
                <div className="user-experiences">
                    <h2 className="text-primary mb-3">Expériences</h2>
                    <ul className="list-group">
                        {experiences.map((experience, index) => (
                            <li key={index} className="list-group-item mb-3 shadow-sm border-0 rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-secondary" />
                                    <h5 className="mb-0">{experience.title}</h5>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-secondary" />
                                    <small className="text-muted">
                                        Début: {new Date(experience.startDate).toLocaleDateString()} - Fin: {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Présent'}
                                    </small>
                                </div>
                                <p className="text-secondary">{experience.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>
          
        </div>
    );
}

export default OurClients;
