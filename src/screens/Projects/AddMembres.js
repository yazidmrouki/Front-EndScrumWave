import React, { useState, useEffect } from "react";
import { Modal,Dropdown } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar8 from "../../assets/images/xs/avatar8.jpg";

function AddMembres(props) {
    const { onClose, show, teamId } = props;
    const [email, setEmail] = useState("");
    const [teamMembers, setTeamMembers] = useState({});

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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handleDeleteMember = async (memberId, memberRole) => {
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
        } catch (error) {
            console.error("Erreur lors de la suppression du membre :", error);
            toast.error("Erreur lors de la suppression du membre : " + error.response.data.message);
        }
    };
    
    const handleSendInvitation = async () => {
        try {
            await axios.post('http://localhost:3000/api/ProductOwners/add-developer', {
                teamId: teamId,
                developerEmail: email,
            });
            toast.success("Invitation envoyée avec succès!");
            setEmail(""); // Réinitialiser l'email après l'envoi
            // Rafraîchir la liste des membres de l'équipe après l'ajout
            fetchTeamMembers();
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'invitation au développeur :", error);
            toast.error("Erreur lors de l'envoi de l'invitation au développeur : " + error.response.data.message);
        }
    };

    return (
        <Modal centered size="lg" show={show} onHide={onClose} aria-labelledby="modal-title">
            <ToastContainer />
            <Modal.Header closeButton>
                <Modal.Title id="modal-title" className="fw-bold">Invitation d'employé</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="inviteby_email">
                    <div className="input-group mb-3">
                        <input type="email" className="form-control" placeholder="Entrez l'email" value={email} onChange={handleEmailChange} aria-label="Email" />
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
                                                    <i className="icofont-ui-settings  fs-6"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu-end">
                                                <li>
                                                <a className="dropdown-item" href="#!" onClick={() => handleDeleteMember(teamMembers.scrumMaster._id, 'scrumMaster')}>
    <i className="icofont-not-allowed fs-6 me-2"></i>Delete Member
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
                                                    <i className="icofont-ui-settings  fs-6"></i>
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
