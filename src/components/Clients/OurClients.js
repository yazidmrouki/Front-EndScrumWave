import React, { useState, useEffect } from "react";
import { Modal,Badge,Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faPhone, faBirthdayCake, faMapMarkerAlt, faCalendarAlt, faInfoCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function OurClients(props) {
    const { role, nom, type, email, prenom, phone, profileInfo, experiences, _id, attendanceData } = props;
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    console.log(props.attendanceData);

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

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/ProductOwners/removeMember/${_id}`);
            if (response.status === 200) {
                console.log("Client deleted successfully");
                // Mettre à jour l'interface utilisateur ou effectuer d'autres actions nécessaires après la suppression
            } else {
                console.error("Error deleting client");
            }
        } catch (error) {
            console.error("Error deleting client", error);
        }
        // Fermer la modal de suppression après la suppression réussie
        setShowDeleteModal(false);
    };

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
                <button className="btn btn-delete btn-M position-absolute top-0 end-0" onClick={() => setShowDeleteModal(true)}>
    <i className="icofont icofont-close text-danger fs-3"></i>
</button>


                    <h6 className="mb-0 mt-2 fw-bold d-block fs-6">{email}</h6>
                    <span className="bg-secondary py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1"> {type ? type : 'ScrumMaster'}</span>
                    <div className="video-setting-icon mt-3 pt-3 border-top">
                        <p>{props.profileInfo.description}</p>
                    </div>
                    <div className="d-flex flex-wrap align-items-center  ct-btn-set">
                        <button
                            className="btn btn-dark btn-sm mt-1"
                            onClick={() => setShowModal(true)}
                        >
                            <i className=" icofont-invisible me-2 fs-6"></i>More Details
                        </button>
                    </div>
                </div>
            </div>

         
            <Modal centered show={showModal} onHide={closeModal} animation={true} className="custom-modal">
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="fw-bold">More Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
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
                        <h3 className="text-primary mb-3">Expériences</h3>
                        <ul className="list-group">
                            {experiences.map((experience, index) => (
                                <li key={index} className="list-group-item mb-3">
                                    <div className="experience-title">
                                        <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-secondary" />
                                        <strong>{experience.title}</strong> chez {experience.company}
                                    </div>
                                    <div className="experience-date">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-secondary" /> Début: {experience.startDate} - Fin: {experience.endDate || 'Présent'}
                                    </div>
                                    <div className="experience-description">
                                        {experience.description}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} centered onHide={() => setShowDeleteModal(false)}>
    <Modal.Header closeButton className="bg-danger text-light">
        <Modal.Title className="fw-bold danger">Delete Member</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
        <div className="d-flex justify-content-center">
            <video
                width="180"
                height="180"
                preload="none"
                style={{
                    background: 'transparent',
                    backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/14256/14256582.png)',
                    backgroundPosition: '50% 50%',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0, 0, 0.1, 0.1)',
                }}
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="https://cdn-icons-mp4.flaticon.com/512/14256/14256582.mp4" type="video/mp4" />
            </video>
        </div>
        <p className="mt-4 fs-5">You can only delete this Member Permanently</p>
    </Modal.Body>
    <Modal.Footer className="bg-dark">
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </Modal.Footer>
</Modal>

        </div>
    );
}

export default OurClients;
