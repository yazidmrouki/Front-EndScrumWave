import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import ReactFlagsSelect from 'react-flags-select';
import './Css.css';
function PersonalInformations() {
    const [personalInfo, setPersonalInfo] = useState({
        nationality: "",
        emergencyNumber: "",
        gmail: "",
        etat: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({
        nationality: "",
        emergencyNumber: "",
        gmail: "",
        etat: ""
    });

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedInfo({ ...updatedInfo, [name]: value });
    };

    const handleUpdatePersonalInfo = async () => {
        try {
            const email = localStorage.getItem('email');
            const role = localStorage.getItem('role');
            const response = await axios.put(`http://localhost:3000/api/${role}/updatePersonalInfo/${email}`, updatedInfo);
            setPersonalInfo(response.data.developer.profileInfo);
            handleCloseModal();
        } catch (error) {
            console.error("Error updating personal information:", error);
        }
    };

    useEffect(() => {
        const getPersonalInfo = async () => {
            try {
                const email = localStorage.getItem('email');
                const role = localStorage.getItem('role');
                const response = await axios.get(`http://localhost:3000/api/${role}/GetInfo?email=${email}`);
                setPersonalInfo(response.data.profileInfo);
                setUpdatedInfo({
                    nationality: response.data.profileInfo.nationality,
                    emergencyNumber: response.data.profileInfo.emergencyNumber,
                    gmail: response.data.profileInfo.gmail,
                    etat: response.data.profileInfo.etat
                });
            } catch (error) {
                console.error("Error fetching personal information:", error);
            }
        };

        getPersonalInfo();
    }, []);

    return (
        <div className="card mb-3 custom-card">
            <div className="card-header py-3 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
            <h6 className="mb-0 fw-bold">Personal Information</h6>
            <button type="button" className="btn btn-outline-primary" onClick={handleShowModal}>
                <i className="icofont-edit fs-6"> Modifier </i>
            </button>
        </div>
    

        <div className="card-body">
          <ul className="list-unstyled">
            <li className="row align-items-center mb-3">
              <div className="col-sm-6">
                <span className="mb-0 fw-bold">Nationality</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">{personalInfo.nationality}</span>
              </div>
            </li>
            <li className="row align-items-center mb-3">
              <div className="col-sm-6">
                <span className="mb-0 fw-bold">Emergency Number</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">{personalInfo.emergencyNumber}</span>
              </div>
            </li>
            <li className="row align-items-center mb-3">
              <div className="col-sm-6">
                <span className="mb-0 fw-bold">Email</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">{personalInfo.gmail}</span>
              </div>
            </li>
            <li className="row align-items-center mb-3">
              <div className="col-sm-6">
                <span className="mb-0 fw-bold">Status</span>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">{personalInfo.etat}</span>
              </div>
            </li>
          </ul>
        </div>
      

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier les informations personnelles</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="nationality" className="form-label">Nationalité</label>
                        <ReactFlagsSelect
                          searchPlaceholder="Search countries"
                            searchable
                            selected={updatedInfo.nationality}
                            onSelect={(code) => setUpdatedInfo({ ...updatedInfo, nationality: code  })}
                           
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emergencyNumber" className="form-label">Numéro d'urgence</label>
                        <input type="text" className="form-control" id="emergencyNumber" name="emergencyNumber" value={updatedInfo.emergencyNumber} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gmail" className="form-label">Gmail</label>
                        <input type="text" className="form-control" id="gmail" name="gmail" value={updatedInfo.gmail} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
    <label htmlFor="etat" className="form-label">État</label>
    <select className="form-select" id="etat" name="etat" value={updatedInfo.etat} onChange={handleInputChange}>
        <option value="Étudiant">Étudiant</option>
        <option value="Stagiaire">Stagiaire</option>
        <option value="Employé">Employé</option>
        <option value="Loyer Employé">Loyer Employé</option>
        <option value="Alternance">Alternance</option>
    </select>
</div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePersonalInfo}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PersonalInformations;
