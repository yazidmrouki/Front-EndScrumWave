import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ExperienceCard() {
    const [experiences, setExperiences] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    useEffect(() => {
        // Récupérer l'email et le rôle du localStorage
       
        // Vérifier si l'email est disponible
        if (email && role) {
            // Effectuer une requête pour récupérer les expériences du développeur
            axios.post(`http://localhost:3000/api/${role}/get-experiences`, { email })
                .then(response => {
                    // Mettre à jour l'état avec les expériences récupérées
                    setExperiences(response.data.experiences);
                })
                .catch(error => {
                    console.error('Error fetching experiences:', error);
                });
        }
    }, []); 

    const handleAddExperience = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddExperienceSubmit = (e) => {
        e.preventDefault();
    
        // Check if any field is empty
        if (!formData.title || !formData.company || !formData.startDate || !formData.endDate || !formData.description) {
            toast.error("Veuillez remplir tous les champs.");
            return; // Exit the function early if any field is empty
        }
    
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        axios.post(`http://localhost:3000/api/${role}/add-experience`, { email, ...formData })
            .then(response => {
                console.log('New experience added successfully:', response.data);
                setExperiences([...experiences, response.data.newExperience]);
                handleCloseModal();
            })
            .catch(error => {
                console.error('Error adding new experience:', error);
            });
    };
    

    return (

        <div className="card mb-4 custom-card">
             <ToastContainer />
             <div className="card-header py-3 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
                
                    <h6 className="mb-0 fw-bold ">Experience</h6>
                 
                    <button type="button" className="btn btn-outline-primary" onClick={handleAddExperience}>
                <i className="icofont-edit fs-6"> Ajouter Experience </i>
            </button>
                </div>
           
            <div className="card-body">
                {experiences.map((experience, index) => (
                    <div key={index} className={`timeline-item border-bottom ms-2 ${getClassName(index)}`}>
                        <div className="d-flex">
                            <span className={`avatar d-flex justify-content-center align-items-center rounded-circle ${getAvatarClassName(index)}`}>{experience.company.slice(0, 2)}</span>
                            <div className="flex-fill ms-3">
                                <div className="mb-1"><strong>{experience.company}</strong></div>
                                <span className="d-flex text-muted">{new Date(experience.startDate).toLocaleDateString()} - {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Present'}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {experiences.length === 0 && <p>No experiences found.</p>}
            </div>
            <Modal show={isModalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une nouvelle expérience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleAddExperienceSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Titre</label>
                            <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="company" className="form-label">Société</label>
                            <input type="text" className="form-control" id="company" name="company" value={formData.company} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Date de début</label>
                            <input type="date" className="form-control" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">Date de fin</label>
                            <input type="date" className="form-control" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Ajouter</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

function getClassName(index) {
    switch (index % 4) {
        case 0:
            return 'ti-danger';
        case 1:
            return 'ti-info';
        case 2:
            return 'ti-success';
        case 3:
            return 'ti-warning';
        default:
            return '';
    }
}

function getAvatarClassName(index) {
    switch (index % 4) {
        case 0:
            return 'light-success-bg';
        case 1:
            return 'bg-careys-pink';
        case 2:
            return 'bg-lavender-purple';
        case 3:
            return 'light-success-bg';
        default:
            return '';
    }
}

export default ExperienceCard;
