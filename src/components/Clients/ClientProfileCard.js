import React, { useState, useEffect } from "react";
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import { toast } from 'react-toastify';
import ModalCard from "./ModalCard.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import './App.css';



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
       
        birthday: ""
    });
    const [modalOpen, setModalOpen] = useState(false);
    
    useEffect(() => {
      if (developerInfo) {
          setFormData({
              nom: developerInfo.nom,
              prenom: developerInfo.prenom,
              adresse: developerInfo.profileInfo.address,
              email: developerInfo.email,
              description: developerInfo.profileInfo.description,
              birthday: new Date(developerInfo.profileInfo.birthday).toISOString().split('T')[0],
          });
      }
  }, [developerInfo]);
  
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
  
          // Copie des données du formulaire
          const updatedFormData = { ...formData };
  
          // Conversion de la date de naissance au format yyyy/mm/jj
          if (updatedFormData.birthday) {
              const birthdayDate = new Date(updatedFormData.birthday);
              updatedFormData.birthday = `${birthdayDate.getFullYear()}/${String(birthdayDate.getMonth() + 1).padStart(2, '0')}/${String(birthdayDate.getDate()).padStart(2, '0')}`;
          }
  
          const response = await axios.put(`http://localhost:3000/api/${role}/UpdateInfo/${email}`, updatedFormData);
          console.log(updatedFormData);
          setIsModalOpen(false);
          console.log(response.data);
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
                console.log(response.data) ;             
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
      <div className="card-body d-flex teacher-fulldeatil position-relative">
        <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w-220 position-relative">
          <div className="position-relative">
            <img
              src={`http://localhost:3000/api/${role}/get-profile-photo/${email}`}
              alt=""
              className="avatar xl rounded-circle img-thumbnail shadow-sm"
            />
            <button
              className="camera-btn  bg-primary rounded-circle"
              title="Change photo"
              onClick={() => setModalOpen(true)}
            >
              <FontAwesomeIcon icon={faCamera} className="camera-icon rounded-circle" />
            </button>
            {modalOpen && <ModalCard closeModal={() => setModalOpen(false)} />}
          </div>
          <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
            <span className="text-muted">{developerInfo.email}</span>
            <button type="button" className="btn btn-outline-primary mt-5 edit-btn" onClick={() => setIsModalOpen(true)}>
              <i className="icofont-edit fs-6"> Modifier le profil</i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title text-center text-primary fw-bold mb-4">{developerInfo.prenom} {developerInfo.nom}</h5>
          
          <h6 className="card-subtitle mb-3 text-muted text-center">Bio</h6>
          <p className="card-text text-center mt-2 mb-4">{developerInfo.profileInfo?.description ?? "Aucune description disponible"}</p>
          <hr className="my-4" />
          <div className="row g-3">
            <div className="col-md-6 mb-3">
              <div className="info-item d-flex align-items-center">
                <i className="icofont-birthday-cake fs-3 me-3 text-primary"></i>
                <span className="fw-bold">
                  {developerInfo.profileInfo?.birthday 
                    ? new Date(developerInfo.profileInfo.birthday).toLocaleDateString('fr-CA') 
                    : "Aucune date de naissance"}
                </span>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="info-item d-flex align-items-center">
                <i className="icofont-address-book fs-3 me-3 text-primary"></i>
                <span className="fw-bold">
                  {developerInfo.profileInfo?.address ?? "Aucune adresse"}
                </span>
              </div>
            </div>
          </div>
        </div>
     
    </div>
  
<Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modifier le profil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        <label htmlFor="birthday" className="form-label">Date de naissance</label>
                        <input type="date" className="form-control" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Fermer</button>
            </Modal.Footer>
        </Modal>


</div>

    );
}

export default ClientProfileCard;
