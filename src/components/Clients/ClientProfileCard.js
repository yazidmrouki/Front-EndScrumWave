import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import { toast } from 'react-toastify';
import ModalCard from "./ModalCard.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';




import "react-image-crop/dist/ReactCrop.css";

function ClientProfileCard() {
    const [developerInfo, setDeveloperInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        adresse: "",
        email: "",
        description: "",
        phone: "",
        birthday: ""
    });
    const [modalOpen, setModalOpen] = useState(false);

  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem('email');
          
            const role = localStorage.getItem('role');
            const response = await axios.put(`http://localhost:3000/api/${role}/UpdateInfo?email=${email}`, formData);
            console.log(response.data);
            setIsModalOpen(false);
            toast.success("Profil mis à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
            toast.error("Une erreur s'est produite lors de la mise à jour du profil");
        }
    };

    
   
    
      
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const email = localStorage.getItem('email');
                const role = localStorage.getItem('role');
                const response = await axios.get(`http://localhost:3000/api/${role}/GetInfo?email=${email}`);
                setDeveloperInfo(response.data);
                setLoading(false);
                // Vérifier les données du développeur

            } catch (error) {
                console.error("Erreur lors de la récupération des informations du développeur :", error);
            }
        };
    

        fetchData();
        
    }, []);
    

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <div className="card teacher-card mb-3">
            <div className="card-body d-flex teacher-fulldeatil">
                <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                <div className="bg-gray-900 text-gray-400 min-h-screen p-4">
                <div className="position-relative">
               
                <img src={`http://localhost:3000/api/${role}/get-profile-photo/${email}`} alt="" className="avatar xl rounded-circle img-thumbnail shadow-sm" />
              
              <div className="circle-camera-icon">  <button
         className=" rounded-circle top-[-5px]"
          title="Change photo"
          onClick={() => setModalOpen(true)}
          
        >
                    <FontAwesomeIcon icon={faCamera} className=" camera-icon  rounded-circle" />

              </button>
                </div>
                {modalOpen && (
        <ModalCard
        
          closeModal={() => setModalOpen(false)}
        />
      )}
              
           
              </div> </div>
          
                    <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
                        <h6 className="mb-0 fw-bold d-block fs-6">{`${developerInfo.nom} ${developerInfo.prenom}`}</h6>
                        <span className="text-muted small">{developerInfo.email}</span>
                        <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Modifier le profil</button>
                        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Modifier le profil</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleProfileSubmit}>
                                <form onSubmit={handleProfileSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nom" className="form-label">Nom</label>
                                        <input type="text" className="form-control" id="nom" name="nom" value={formData.nom} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="prenom" className="form-label">Prénom</label>
                                        <input type="text" className="form-control" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="adresse" className="form-label">Adresse</label>
                                        <input type="text" className="form-control" id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Téléphone</label>
                                        <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="birthday" className="form-label">Date de naissance</label>
                                        <input type="date" className="form-control" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                                </form>
                                </form>
                             
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fermer</button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="teacher-info border-start ps-xl-4 ps-md-4 ps-sm-4 ps-4 w-100">
                    <p className="mt-2 small">{developerInfo.profileInfo?.description ?? "Aucune description disponible"}</p>
                    <div className="row g-2 pt-2">
                        <div className="col-xl-5">
                            <div className="d-flex align-items-center">
                                <i className="icofont-ui-touch-phone"></i>
                                <span className="ms-2 small">{developerInfo.profileInfo?.phone ?? "Aucun numéro de téléphone"}</span>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="d-flex align-items-center">
                                <i className="icofont-birthday-cake"></i>
                                <span className="ms-2 small">{developerInfo.profileInfo?.birthday ?? "Aucune date de naissance"}</span>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="d-flex align-items-center">
                                <i className="icofont-address-book"></i>
                                <span className="ms-2 small">{developerInfo.profileInfo?.address ?? "Aucune adresse"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientProfileCard;
