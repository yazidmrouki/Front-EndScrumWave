import React, { useState, useEffect, useRef } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar8 from "../../assets/images/xs/avatar8.jpg";
import Select from "react-select";

import CreatableSelect from "react-select/creatable";

function AddMembres(props) {
    const { onClose, show, teamId } = props;
    const [email, setEmail] = useState("");
    const [teamMembers, setTeamMembers] = useState({});
    const [developersWithoutTeam, setDevelopersWithoutTeam] = useState([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);

    const dropdownRef = useRef(null);

   
    const fetchDevelopersWithoutTeam = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/ProductOwners/developers-without-team`);
            setDevelopersWithoutTeam(response.data);
            toast.success("Développeurs sans équipe récupérés avec succès!");
        } catch (error) {
            console.error("Erreur lors de la récupération des développeurs sans équipe :", error);
            toast.error("Erreur lors de la récupération des développeurs sans équipe : " + error.response.data.message);
        }
    };

    useEffect(() => {
        if (show) {
            fetchDevelopersWithoutTeam();
        }
    }, [show]);

    const handleCreateDeveloper = async (inputValue) => {
        try {
            // Envoyer une requête pour créer un développeur avec l'email inputValue
            await axios.post('http://localhost:3000/api/ProductOwners/create-developer', {
                email: inputValue
            });
            // Rafraîchir la liste des développeurs sans équipe après la création
            fetchDevelopersWithoutTeam();
            toast.success("Développeur créé avec succès!");
        } catch (error) {
            console.error("Erreur lors de la création du développeur :", error);
            toast.error("Erreur lors de la création du développeur : " + error.response.data.message);
        }
    };

    const handleSendInvitation = async () => {
        if (selectedDeveloper) {
            try {
                // Envoyer une invitation au développeur sélectionné
                await axios.post('http://localhost:3000/api/ProductOwners/add-developer', {
                    teamId: teamId,
                    developerEmail: selectedDeveloper.value,
                });
                toast.success("Invitation envoyée avec succès!");
                // Réinitialiser la sélection après l'envoi de l'invitation
                setSelectedDeveloper(null);
                // Rafraîchir la liste des membres de l'équipe après l'ajout
                setTimeout(() => {
                    window.location.reload(true);
                  }, 1500);
                fetchTeamMembers();

             
            } catch (error) {
                console.error("Erreur lors de l'envoi de l'invitation au développeur :", error);
                toast.error("Erreur lors de l'envoi de l'invitation au développeur : " + error.response.data.message);
            }
        } else {
            toast.error("Veuillez sélectionner un développeur !");
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-team-members/${teamId}`);
            setTeamMembers(response.data);
            

            toast.success("Membres de l'équipe récupérés avec succès!");
        } catch (error) {
            console.error("Erreur lors de la récupération des membres de l'équipe :", error);
            toast.error("Erreur lors de la récupération des membres de l'équipe : " + error.response.data.message);
        }
    };

    useEffect(() => {
        if (show) {
            fetchTeamMembers();
        }
    }, [show, teamId]);
  
    const handleDeleteMember = async (memberId, memberRole) => {
        console.log("testester"+memberRole)      ; 
        
        try {
            await axios.delete('http://localhost:3000/api/ProductOwners/remove-member', {
                data: {
                    teamId: teamId,
                    memberId: memberId,
                    memberRole: memberRole
                }
            });
            toast.success("Membre supprimé avec succès!");
          
            // Rafraîchir la liste des membres de l'équipe après la suppression
            fetchTeamMembers();

            setTimeout(() => {
                window.location.reload(true);
              }, 1000);
        } catch (error) {
            console.error("Erreur lors de la suppression du membre :", error);
            toast.error("Erreur lors de la suppression du membre : " + error.response.data.message);
        }
    };
    
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: "680px", // Définir la largeur fixe ici
        }),
    };
    
    

    return (
        <Modal centered size="lg" show={show} onHide={onClose} aria-labelledby="modal-title">
            <ToastContainer />
            <Modal.Header closeButton>
                <Modal.Title id="modal-title" className="fw-bold">Invitation d'employé</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="inviteby_email">
                    <div ref={dropdownRef} className="input-group mb-3">
                        <Select
                            options={developersWithoutTeam.map(developer => ({
                                value: developer.email,
                                label: (
                                    <div className="d-flex align-items-center flex-column flex-sm-column flex-md-row">
                                        <div className="no-thumbnail mb-2 mb-md-0">
                                        {developer.email ? (
                                            <img className="avatar lg rounded-circle" src={`http://localhost:3000/api/Devellopeurs/get-profile-photo/${developer.email}`} alt="Avatar" />
                                        ) : (
                                            <img className="avatar lg rounded-circle" src="chemin_vers_avatar8.jpg" alt="Avatar8" />
                                        )}
                                    </div>
                                    <div className="flex-fill ms-3 text-truncate">
                                        <h6 className="mb-0 fw-bold">{developer.nom}</h6>
                                        <span className="text-muted">{developer.email}</span>
                                    </div>
                                    </div>
                                )
                            }))}
                            onChange={setSelectedDeveloper}
                            value={selectedDeveloper}
                            isClearable
                            placeholder="Sélectionner un développeur"
                            styles={customStyles} // Appliquer les styles personnalisés ici
                            components={{ IndicatorSeparator: () => null }} // Pour supprimer le séparateur
                        />
                        <button className="btn btn-primary" onClick={handleSendInvitation}>Envoyer</button>
                    </div>
                </div>
                <div className="members_list">
                    <h6 className="fw-bold">Employés</h6>
                    <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
                        <li className="list-group-item py-3 text-center text-md-start">
                            <div className="d-flex align-items-center flex-column flex-sm-column flex-md-row">
                                <div className="no-thumbnail mb-2 mb-md-0">
                                    {teamMembers.productOwner && teamMembers.productOwner.email ? (
                                        <img className="avatar lg rounded-circle" src={`http://localhost:3000/api/ProductOwners/get-profile-photo/${teamMembers.productOwner.email}`} alt="Avatar" />
                                    ) : (
                                        <img className="avatar lg rounded-circle" src="chemin_vers_avatar8.jpg" alt="Avatar8" />
                                    )}
                                </div>
                                <div className="flex-fill ms-3 text-truncate">
                                    <h6 className="mb-0 fw-bold">{teamMembers.productOwner && teamMembers.productOwner.nom}</h6>
                                    <span className="text-muted">{teamMembers.productOwner && teamMembers.productOwner.email}</span>
                                </div>
                                <span className="badge bg-info d-flex align-items-center">
                                       Product Owner
                                    </span>
                            </div>
                        </li>
                        <li className="list-group-item py-3 text-center text-md-start">
                            <div className="d-flex align-items-center flex-column flex-sm-column flex-md-row">
                                <div className="no-thumbnail mb-2 mb-md-0">
                                    {teamMembers.scrumMaster && teamMembers.scrumMaster.email ? (
                                        <img className="avatar lg rounded-circle" src={`http://localhost:3000/api/Scrummasters/get-profile-photo/${teamMembers.scrumMaster.email}`} alt="Avatar" />
                                    ) : (
                                        <img className="avatar lg rounded-circle" src="chemin_vers_avatar8.jpg" alt="Avatar8" />
                                    )}
                                </div>
                                <div className="flex-fill ms-3 text-truncate">
                                    <h6 className="mb-0 fw-bold">{teamMembers.scrumMaster && teamMembers.scrumMaster.nom}</h6>
                                    <span className="text-muted">{teamMembers.scrumMaster && teamMembers.scrumMaster.email}</span>
                                </div>
                                <span className="badge bg-warning d-flex align-items-center">
                                        Scrum Master
                                    </span>
                                <div className="btn-group">
                                    <Dropdown className="btn-group">
                                    <Dropdown.Toggle as="button" className="btn bg-transparent dropdown-toggle">
  <video
    width="50"
    height="50"
    preload="none"
    style={{
      borderRadius: '50%',
      display: 'block',
      transition: 'none', /* Désactiver les transitions en ligne */
      pointerEvents: 'none' /* Désactiver l'interaction avec la souris en ligne */
    }}
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="https://cdn-icons-mp4.flaticon.com/512/14183/14183445.mp4" type="video/mp4" />
  </video>
</Dropdown.Toggle>



                                        <Dropdown.Menu className="dropdown-menu-end">
                                            <li>
                                                <a className="dropdown-item" href="#!" onClick={() => handleDeleteMember(teamMembers.scrumMaster._id, 'scrumMaster')}>
                                                    <i className="fa fa-trash fs-6 me-2"></i>Delete Member
                                                </a>
                                            </li>
                                            <li><a className="dropdown-item" href="#!"><i className="icofont-not-allowed fs-6 me-2"></i>Report Membre</a></li>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </li>
                        {teamMembers.developers && teamMembers.developers.map((developer, index) => (
                            <li key={index} className="list-group-item py-3 text-center text-md-start">
                                <div className="d-flex align-items-center flex-column flex-sm-column flex-md-row">
                                    <div className="no-thumbnail mb-2 mb-md-0">
                                        {developer.email ? (
                                            <img className="avatar lg rounded-circle" src={`http://localhost:3000/api/Devellopeurs/get-profile-photo/${developer.email}`} alt="Avatar" />
                                        ) : (
                                            <img className="avatar lg rounded-circle" src="chemin_vers_avatar8.jpg" alt="Avatar8" />
                                        )}
                                    </div>
                                    <div className="flex-fill ms-3 text-truncate">
                                        <h6 className="mb-0 fw-bold">{developer.nom}</h6>
                                        <span className="text-muted">{developer.email}</span>
                                    </div>
                                    <span className="badge bg-success d-flex align-items-center">
                                        Développeur
                                    </span>
                                    <div className="btn-group">
                                        <Dropdown className="btn-group">
                                        <Dropdown.Toggle as="button" className="btn bg-transparent dropdown-toggle">
  <video
    width="50"
    height="50"
    preload="none"
    style={{
      background: 'transparent',
      borderRadius: '50%',
      display: 'block',
      transition: 'none', /* Désactiver les transitions en ligne */
      pointerEvents: 'none' /* Désactiver l'interaction avec la souris en ligne */
    }}
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="https://cdn-icons-mp4.flaticon.com/512/14183/14183445.mp4" type="video/mp4" />
  </video>
</Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu-end">
                                                <li>
                                                    <a className="dropdown-item" href="#!" onClick={() => handleDeleteMember(developer._id, 'developer')}>
                                                        <i className="icofont-not-allowed fs-6 me-2"></i>Delete Member
                                                    </a>
                                                </li>
                                                <li><a className="dropdown-item" href="#!"><i className="icofont-not-allowed fs-6 me-2"></i>Report Membre</a></li>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddMembres;
