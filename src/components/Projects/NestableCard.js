import React, { useState ,useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPencilAlt, faExclamationCircle,faAngleRight ,faBug,faWindowClose, faCheckCircle, faTicketAlt, faEllipsisV, faTrashAlt, faEye, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, Modal, Button, Form, Carousel } from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./NestableCard.css";



function NestableCard(props) {
    const {  idticket, ProjectId ,SprintId,title, status,etat,dateCreation, bug, numTicket, NameDev, emailDeveloppeur, ticketInfo } = props.data;
      const role=props.role;
     
const [isHovered, setIsHovered] = useState(false);
const [showModal, setShowModal] = useState(false);
const [editedTicketInfo, setEditedTicketInfo] = useState(ticketInfo);
const [isDeleteModal, setIsDeleteModal] = useState(false);
const [showBugModal, setShowBugModal] = useState(false);
const [bugDetails, setBugDetails] = useState({ type:" " ,description: "", screenshot: "" });
const [showCreateBugModal, setShowCreateBugModal] = useState(false);
const [bugType, setBugType] = useState('');
const [bugDescription, setBugDescription] = useState('');
const [bugScreenshot, setBugScreenshot] = useState(null);
const [showOutputModal, setShowOutputModal] = useState(false);

const [outputDescription, setOutputDescription] = useState('');
const [outputCapture, setOutputCapture] = useState(null);
const [selectedOutput, setSelectedOutput] = useState(null);
const [selectedImageIndex, setSelectedImageIndex] = useState(0);
const [showOutputCaptureModal, setShowOutputCaptureModal] = useState(false);
const [outputs, setOutputs] = useState([]);
const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
const [nameOutput, setNameOutput] = useState('');
const email=localStorage.getItem("email");
const Name=localStorage.getItem("name");
const handleOutputMouseEnter = () => {
    setShowDeleteDropdown(true);
  };

  const handleOutputMouseLeave = () => {
    setShowDeleteDropdown(false);
  };
const handleDeleteOutput = (outputId) => {
    axios
      .delete(
        `http://localhost:3000/api/Devellopeurs/delete-output/${ProjectId}/${SprintId}/${idticket}/${outputId}`,
        {
          data: { nameActor: Name, email: email }
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("Output deleted successfully");
          toast.success("Output supprimé avec succès");
          setShowOutputCaptureModal(false);
          window.location.reload(); // Rafraîchir la page après la suppression de l'output
        } else {
          // Erreur lors de la suppression de l'output
          console.error("Failed to delete output");
          toast.error("Erreur lors de la suppression de l'output");
        }
      })
      .catch((error) => {
        console.error("Error deleting output:", error);
        toast.error(
          "Une erreur est survenue lors de la suppression de l'output"
        );
      });
  };
useEffect(() => {
    // Sélectionner le premier output par défaut
    if (outputs.length > 0) {
      setSelectedOutput(outputs[0]);
    }
  }, [outputs]);

const handleCloseOutputCaptureModal = () => {
    setShowOutputCaptureModal(false);
  setSelectedOutput(null);
  setSelectedImageIndex(0);
};

const handleOutputClick = (output, index) => {
  setSelectedOutput(output);
  setSelectedImageIndex(index);
};

const handleOpenOutputCaptureModal = () => {
    axios.get(`http://localhost:3000/api/Devellopeurs/outputs/${ProjectId}/${SprintId}/${idticket}`)
        .then(response => {
            setOutputs(response.data.outputs);
         
            setShowOutputCaptureModal(true);
        })
        .catch(error => {
            console.error('Error fetching outputs:', error);
            toast.error('Erreur lors du chargement des sorties');
        });
};




const handleOutputCaptureChange = (event) => {
    setOutputCapture(event.target.files[0]);
};

const handleOutputDescriptionChange = (event) => {
    setOutputDescription(event.target.value);
};
const handlenameOutputChange = (event) => {
    setNameOutput(event.target.value);
};

const handleCloseOutputModal = () => {
    
    setShowOutputModal(false);
    setNameOutput('');
    setOutputDescription('');
    setOutputCapture(null);
};

const handleSubmitOutput = () => {
  const formData = new FormData();
  formData.append("output", outputCapture);
  formData.append("description", outputDescription);
  formData.append("nameOutput", nameOutput);
  formData.append("nameActor", Name);
  formData.append("email",  email);
  axios.post(`http://localhost:3000/api/Devellopeurs/create-output/${ProjectId}/${SprintId}/${idticket}`, formData, {
      headers: {
          "Content-Type": "multipart/form-data",
      }
     
  })
  .then(response => {
      console.log('Output uploaded successfully');
      toast.success('Output ajouté avec succès');
      handleCloseOutputModal();
      window.location.reload();
  })
  .catch(error => {
      console.error('Error uploading output:', error);
      toast.error('Erreur lors de l\'ajout de l\'output');
  });
};

const handleOpenOutputModal = () => {
    setShowOutputModal(true);
};
const handleBugScreenshotChange = (event) => {
    setBugScreenshot(event.target.files[0]);
};
const handleBugTypeChange = (event) => {
    setBugType(event.target.value);
};

const handleBugDescriptionChange = (event) => {
    setBugDescription(event.target.value);
};
const handleCloseCreateBugModal = () => {
    setShowCreateBugModal(false);
    setBugType('');
    setBugDescription('');
    setBugScreenshot(null);
};

const handleSubmitBug = () => {
  const formData = new FormData();
  formData.append("screenshot", bugScreenshot);
  formData.append("bugType", bugType); // Utiliser la même clé que celle définie dans votre backend
  formData.append("description", bugDescription);
  formData.append("nameActor", Name);
  formData.append("email",  email);
  console.log("fiel " + bugScreenshot + " type " + bugType + " des" + bugDescription)
  axios.post(`http://localhost:3000/api/Devellopeurs/create-bug/${ProjectId}/${SprintId}/${idticket}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
   
  })
    .then(response => {
      console.log('Bug created successfully');
      toast.success('Bug créé avec succès');
      handleCloseCreateBugModal();
      window.location.reload();
    })
    .catch(error => {
      console.error('Error creating bug:', error);
      toast.error('Erreur lors  de la création du Bug');
      console.log(error.response.data); // Afficher l'erreur retournée par le serveur
    });
};




const handleCreateBug = () => {
    setShowCreateBugModal(true);
};

const handleCloseBugModal = () => {
    setShowBugModal(false);
};

const handleDeleteBug = () => {
  axios.delete(`http://localhost:3000/api/Devellopeurs/delete-bug/${ProjectId}/${SprintId}/${idticket}`, {
      data: { nameActor: Name, email: email } // Ajout de nameActor et email
  })
  .then(response => {
      if (response.status === 200) {
          console.log('Bug deleted successfully');
          toast.success('Bug supprimé avec succès');
          setShowBugModal(false);
      } else {
          console.error('Failed to delete bug');
          toast.error('Erreur lors de la suppression du bug');
      }
  })
  .catch(error => {
      console.error('Error deleting bug:', error);
      toast.error('Une erreur est survenue lors de la suppression du bug');
  });
};
const handleOpenBugModal = () => {
    setShowBugModal(true);
    // Récupérer les détails du bug
    if (bug) {
        axios.get(`http://localhost:3000/api/Devellopeurs/get-bug/${ProjectId}/${SprintId}/${idticket}`)
            .then(response => {
                const { description, screenshot,type } = response.data;

                setBugDetails({ description, screenshot,type});
            })
            .catch(error => {
                console.error('Error fetching bug details:', error);
            });
    }
};
const handleOpenModal = () => {
    setShowModal(true);
};

const handleOpenDeleteModal = () => {
    setIsDeleteModal(true);
};
const handleCloseDeleteModal = () => {
    setIsDeleteModal(false);
};


const handleCloseModal = () => {
    setShowModal(false);
};

const handleTicketInfoChange = (event) => {
    setEditedTicketInfo(event.target.value);
};

const handleSaveChanges = () => {
    // Envoyer une requête PUT pour mettre à jour le ticketInfo
    axios.put(`http://localhost:3000/api/Devellopeurs/update-ticket-Info/${ProjectId}/${SprintId}/${idticket}`, { ticketInfo: editedTicketInfo,nameActor:Name,email:email })
        .then(response => {
            
            console.log('TicketInfo updated successfully');
            toast.success('TicketInfo mis à jour avec succès');
            window.location.reload(); // Afficher un toast de succès
            handleCloseModal(); // Fermer la modal après avoir enregistré les modifications
        })
        .catch(error => {
            console.error('Error updating ticketInfo:', error);
            toast.error('Erreur lors de la mise à jour du TicketInfo'); // Afficher un toast d'erreur
            // Gérer les erreurs de mise à jour du ticketInfo
        });
};

const handleMouseEnter = () => {
    setIsHovered(true);
};

const handleMouseLeave = () => {
    setIsHovered(false);
};
    // État pour gérer l'affichage du menu déroulant
    const [showMoveOptions, setShowMoveOptions] = useState(false);

    const handleMoveTicket = (nouvelEtat) => {
        console.log(nouvelEtat);
        // Vérifier si le ticket est déplacé vers "To Do" ou "In Progress" et s'il a une sortie
        if ((nouvelEtat === "To Do" || nouvelEtat === "In Progress")&& outputs.length>0) {
          // Supprimer toutes les sorties du ticket
          axios
            .delete(
              `http://localhost:3000/api/Devellopeurs/delete-all-outputs/${ProjectId}/${SprintId}/${idticket}`
            )
            .then((response) => {
              if (response.status === 200) {
                console.log("All outputs deleted successfully");
                toast.success("Toutes les sorties du ticket ont été supprimées avec succès");
                
                // Déplacer le ticket
                moveTicket(nouvelEtat);
              } else {
                console.error("Failed to delete all outputs");
                toast.error("Erreur lors de la suppression de toutes les sorties du ticket");
              }
            })
            .catch((error) => {
              console.error("Error deleting all outputs:", error);
              toast.error("Une erreur est survenue lors de la suppression de toutes les sorties du ticket");
            });
        } else {
          // Déplacer le ticket
          moveTicket(nouvelEtat);
        }
      };
      
      const moveTicket = (nouvelEtat) => {
        // Déplacer le ticket
        axios
          .put(
            `http://localhost:3000/api/Devellopeurs/move-ticket/${ProjectId}/${SprintId}/${idticket}`,
            { nouvelEtat ,nameActor: Name, email: email}
          )
          .then((response) => {
            if (response.status === 200) {
              console.log("Ticket moved successfully");
              toast.success("Ticket déplacé avec succès");
              window.location.reload();
            } else {
              console.error("Failed to move ticket");
              toast.error("Erreur lors du déplacement du ticket");
            }
          })
          .catch((error) => {
            console.error("Error moving ticket:", error);
            toast.error("Une erreur est survenue lors du déplacement du ticket");
          });
      };
      
    // Modifier la fonction handleMoveOptionSelect pour appeler handleMoveTicket avec le nouvel état sélectionné
    const handleMoveOptionSelect = (eventKey) => {
        switch (eventKey) {
            case "toDo":
                console.log("toDo");
                handleMoveTicket("To Do");
                break;
            case "inProgress":
            console.log("inProgress");
                handleMoveTicket("In Progress");
                break;
            case "completed":
                console.log("completed");
                handleMoveTicket("Completed");
                break;
            default:
                console.log(`Unhandled move option: ${eventKey}`);
        }
    };
    useEffect(() => {
        // Récupérer les sorties
        axios
          .get(
            `http://localhost:3000/api/Devellopeurs/outputs/${ProjectId}/${SprintId}/${idticket}`
          )
          .then((response) => {
            setOutputs(response.data.outputs);
          })
          .catch((error) => {
            console.error("Error fetching outputs:", error);
            toast.error("Erreur lors du chargement des sorties");
          });
      }, [ProjectId, SprintId, idticket]);
    
    const getStatusBadgeClass = (status) => {
        let badgeClass = "badge";
    
        switch (status) {
            case "Haute":
                badgeClass += " bg-danger"; // Badge vert pour le statut Haut
                break;
            case "Moyenne":
                badgeClass += " bg-warning"; // Badge jaune pour le statut Moyen
                break;
            case "Faible":
                badgeClass += " bg-success"; // Badge rouge pour le statut Faible
                break;
            default:
                badgeClass += " bg-secondary"; // Badge gris pour les autres statuts
                break;
        }
    
        return badgeClass;
    };

    const handleDeleteTicket = () => {
      axios
        .delete(
          `http://localhost:3000/api/Devellopeurs/delete-ticket/${ProjectId}/${SprintId}/${idticket}`,
          {
            data: { nameActor: Name, email: email }
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            console.log("Ticket deleted successfully");
            toast.success("Ticket supprimé avec succès");
            setIsDeleteModal(false);
            window.location.reload(); // Rafraîchir la page après la suppression du ticket
          } else {
            // Erreur lors de la suppression du ticket
            console.error("Failed to delete ticket");
            toast.error("Erreur lors de la suppression du ticket");
          }
        })
        .catch((error) => {
          console.error("Error deleting ticket:", error);
          if (error.response) {
            // La requête a été faite et le serveur a répondu avec un code d'erreur
            console.error("Server Error:", error.response.data);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
          } else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error("Request Error:", error.request);
          } else {
            // Une erreur est survenue lors de la configuration de la requête
            console.error("Request Setup Error:", error.message);
          }
          toast.error(
            "Une erreur est survenue lors de la suppression du ticket"
          );
        });
    };
    

    return (
       
        <div className="nestable-card">
            <div className="task-info d-flex align-items-center justify-content-between">
                <h6 className="title"> {title} </h6>
                <div className="task-priority">
                    <div className="avatar-list avatar-list-stacked">
                        
                        <img className="large-avatar" src={`http://localhost:3000/api/Devellopeurs/get-profile-photo/${emailDeveloppeur}`} alt="" />
                    </div>
                    <br></br>
                    <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
                </div>
                
            </div>
            <br></br>
            <div className="ticket-body">
          
           
           
        
                  <div className={isHovered ? "ticket-info  hovered " : "ticket-info"} onClick={handleOpenModal} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="ticket-info-wrapper">
                        <div className={isHovered ? "ticket-info hovered" : "ticket-info"} onClick={handleOpenModal} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <span className="ticket-info-text">{ticketInfo}</span>
                            {isHovered && (
                                <FontAwesomeIcon icon={faPencilAlt}   />
                            )}
                        </div>
                     
                    </div>
                    </div>
             
        <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                {role === "scrumMasters" ? ( <Modal.Title>Consulter TicketInfo</Modal.Title>) : (
                     <Modal.Title>Modifier TicketInfo</Modal.Title>
                )}
                 
                </Modal.Header>
                <Modal.Body>
                {role === "scrumMasters" ? ( <textarea className="form-control" value={editedTicketInfo} readOnly onChange={handleTicketInfoChange}></textarea>) : (
                    <textarea className="form-control" value={editedTicketInfo} onChange={handleTicketInfoChange}></textarea>
                )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    {role === "scrumMasters" ? null : (
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Enregistrer
                    </Button>)}
                </Modal.Footer>
            </Modal>
                <ToastContainer></ToastContainer>


                {role === "scrumMasters" ? null : (
                   
              
                <Dropdown className="custom-dropdown">
                    <Dropdown.Toggle variant="none" className="custom-dropdown-toggle">
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item eventKey="delete" onClick={handleOpenDeleteModal}>
    Supprimer
    <FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: '10px' }} className="dropdown-icon" />

   
   {/* */}
                        </Dropdown.Item>
                        {etat === "Completed" && (

                        <Dropdown.Divider/>
                        )}
                        {etat === "Completed" && (
                                 
                                 <Dropdown.Item  className="dropdown-item" onClick={handleOpenOutputModal}>
                                Ajouter Output</Dropdown.Item>
                                 
                             
                         )}

                        {etat === "Completed" && outputs.length > 0 && ( 
                            
                <Dropdown.Item onClick={handleOpenOutputCaptureModal}>
                   Consulter Output
                </Dropdown.Item>
                        )}
        

            {etat === "Completed" && outputs.length > 0 &&(


<Dropdown.Item
  onMouseEnter={() => setShowDeleteDropdown(true)}
  onMouseLeave={() => setShowDeleteDropdown(false)}
>
  Supprimer Output
  <FontAwesomeIcon
    icon={faAngleRight}
    style={{ marginLeft: "15px" }}
  />
  {showDeleteDropdown && (
    <div className="btn-group dropright">
      <button
        type="button"
        className="btn btn-secondary dropdown-toggle"
        hidden
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded={showDeleteDropdown}
      >
        Supprimer Output
      </button>
      <div
        className={`dropdown-menu${showDeleteDropdown ? " show" : ""}`}
        onMouseEnter={() => setShowDeleteDropdown(true)}
        onMouseLeave={() => setShowDeleteDropdown(false)}
      >
        {outputs.map((output) => (
          <button className="dropdown-item" onClick={() =>handleDeleteOutput(output._id)}>
            {output.nameOutput}
          </button>
        ))}
      </div>
    </div>
  )}
</Dropdown.Item>

       
              )}
                        <Dropdown.Divider />
                        <Dropdown.Item
                            eventKey="moveToToDo"
                            onMouseEnter={() => setShowMoveOptions(true)}
                            onMouseLeave={() => setShowMoveOptions(false)}
                        >
                              Déplacer    vers    <FontAwesomeIcon icon={faAngleRight} style={{ marginLeft: '15px' }} />
                            {etat === "To Do" && (
    <div className="btn-group dropright">
        <button type="button" className="btn btn-secondary dropdown-toggle"  hidden data-toggle="dropdown" aria-haspopup="true" aria-expanded={showMoveOptions}>
            Déplacer
        </button>
        <div className={`dropdown-menu${showMoveOptions ? " show" : ""}`} onMouseEnter={() => setShowMoveOptions(true)} onMouseLeave={() => setShowMoveOptions(false)}>
            <button className="dropdown-item" onClick={() => handleMoveOptionSelect("inProgress")}>In Progress</button>
            <button className="dropdown-item" onClick={() => handleMoveOptionSelect("completed")}>Completed</button>
        </div>
    </div>
)}
{etat=== "In Progress" && (
    <div className="btn-group dropright">
        <button type="button" className="btn btn-secondary dropdown-toggle" hidden data-toggle="dropdown" aria-haspopup="true" aria-expanded={showMoveOptions}>
            Déplacer
        </button>
        <div className={`dropdown-menu${showMoveOptions ? " show" : ""}`} onMouseEnter={() => setShowMoveOptions(true)} onMouseLeave={() => setShowMoveOptions(false)}>
            <button className="dropdown-item" onClick={() => handleMoveOptionSelect("toDo")}>To Do</button>
            <button className="dropdown-item" onClick={() => handleMoveOptionSelect("completed")}>Completed</button>
        </div>
    </div>
)}
{etat === "Completed" && (
    <div className="btn-group dropright">
        <button type="button" className="btn btn-secondary dropdown-toggle"  hidden data-toggle="dropdown" aria-haspopup="true" aria-expanded={showMoveOptions}>
            Déplacer
        </button>
        <div className={`dropdown-menu${showMoveOptions ? " show" : ""}`} onMouseEnter={() => setShowMoveOptions(true)} onMouseLeave={() => setShowMoveOptions(false)}>
            <button className="dropdown-item" onClick={() => handleMoveOptionSelect("toDo")}>To Do</button>
            <button className="dropdown-item" onClick={() => handleMoveOptionSelect("inProgress")}>In Progress</button>
        </div>
    </div>
)}


                        </Dropdown.Item>
                        {bug && (
                                <Dropdown.Item eventKey="viewBug" onClick={handleOpenBugModal}>
                                  Details Bugs 
                                   
                                </Dropdown.Item>
                                
                                
                            )}

{bug && bugDetails.type === "non-technical" && (
  <Dropdown.Item eventKey="viewBug" onClick={handleOpenBugModal}>
    Consulter Bug
  </Dropdown.Item>
)}
                              {bug && (
                                <Dropdown.Item eventKey="deleteBug" onClick={handleDeleteBug}>
                                    Supprimer le bug
                                   
                                </Dropdown.Item>
                            )}
                             {!bug && (
                                <Dropdown.Item eventKey="createBug" onClick={handleCreateBug}>
                                    Créer un Bug
                                  
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                )}

                
                 </div>
                <br></br>
                <div className="info-container">

                    <div className="info-item ">
                        <FontAwesomeIcon icon={faCalendarAlt} className="info-icon" />
                        <div className="info-label">Date de création </div>
                        <div className="info-value">{format(new Date(dateCreation), "d MMMM yyyy", { locale: fr })}</div>
                    </div>

                    
                    {bug ? (
        <div className="info-item">
          <FontAwesomeIcon icon={faBug} className="info-icon text-danger" />
          <div className="info-label text-danger">Problème</div>
          <div className="info-value">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />
          </div>
        </div>
      ) : outputs.length > 0 ? (
        <div className="info-item">
          <FontAwesomeIcon icon={faCheckCircle} className="info-icon text-success" />
          <div className="info-label text-success">Outputs</div>
          <div className="info-value">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
          </div>
        </div>
      ) : (
        <></>
      )}




                    <div className="info-item ">
                        <FontAwesomeIcon icon={faTicketAlt} className="info-icon" />
                        <div className="info-label">Numéro de ticket  {numTicket} </div>
                        <div className="info-value"> </div>
                    </div>


                </div>
                <div className="col-sm text-end">
                <div className="small text-truncate py-1 px-2 rounded-1 d-inline-block fw-bold small bg-secondary">
  {NameDev}
</div>


                </div>
                <Modal show={showOutputModal} onHide={handleCloseOutputModal}>
  <Modal.Header closeButton>
    <Modal.Title>Ajouter une sortie</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group>
      <Form.Label>Description</Form.Label>
      <Form.Control as="textarea" rows={3} value={outputDescription} onChange={handleOutputDescriptionChange} />
    </Form.Group>
    <Form.Group>
      <Form.Label>NameOutput</Form.Label>
      <Form.Control type="text" placeholder="Entrez le nom de la sortie" value={nameOutput} onChange={handlenameOutputChange} />
    </Form.Group>
    <Form.Group>
      <Form.Label>Capture d'écran</Form.Label>
      <Form.Control type="file" onChange={handleOutputCaptureChange} />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseOutputModal}>
      Annuler
    </Button>
    <Button variant="primary" onClick={handleSubmitOutput}>
      Enregistrer
    </Button>
  </Modal.Footer>
</Modal>

                <Modal show={showBugModal} onHide={handleCloseBugModal}>
  <Modal.Header closeButton className="bg-danger text-white">
    <Modal.Title>
      <FontAwesomeIcon icon={faBug} className="me-2" />
      Détails du Problème
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="bug-details">
      <div className="bug-type">
        <h5 className="text-danger mb-3">Type du Problème:</h5>
        <p>{bugDetails.type}</p>
      </div>
      <div className="bug-description">
        <h5 className="text-danger mb-3">Description du Problème:</h5>
        <p>{bugDetails.description}</p>
      </div>
     
      {bugDetails.screenshot && 
       <div className="bug-screenshot">
       <h5 className="text-danger mb-3">Capture d'écran :</h5>
 
    
    <a href={`http://localhost:3000/api/Devellopeurs/get-ticket-screenshot/${ProjectId}/${SprintId}/${idticket}`} target="_blank" rel="noopener noreferrer">
      <img src={`http://localhost:3000/api/Devellopeurs/get-ticket-screenshot/${ProjectId}/${SprintId}/${idticket}`} alt="Bug Screenshot" className="img-thumbnail" style={{ width: "100%", cursor: "pointer" }} />
      <div className="overlay">
        <div className="text">Consulter</div>
      </div>
    </a>
  </div>
}


    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseBugModal}>
      <FontAwesomeIcon icon={faWindowClose} className="me-2" />
      Fermer
    </Button>
  </Modal.Footer>
</Modal>

                <Modal show={showCreateBugModal} onHide={handleCloseCreateBugModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Definir un Probléme</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            
                            <Form.Group>
    <Form.Label>Type de Probléme :</Form.Label>
    <Form.Control as="select" value={bugType} onChange={handleBugTypeChange}>
        <option value="">Choisissez le type de Probléme</option>
        <option value="technical">Technical</option>
        <option value="non-technical">Non-Technical</option>
    </Form.Control>


                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description du Probléme</Form.Label>
                                <Form.Control as="textarea" rows={3} value={bugDescription} onChange={handleBugDescriptionChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Capture d'écran:</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleBugScreenshotChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCreateBugModal}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={handleSubmitBug}>
                            Créer
                        </Button>
                    </Modal.Footer>
                </Modal>
         

                <Modal
        show={showOutputCaptureModal}
        onHide={handleCloseOutputCaptureModal}
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#28a745", color: "white", border: "none" }}
        >
          <Modal.Title>Output du ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <Carousel
            activeIndex={selectedImageIndex}
            onSelect={(selectedIndex) => {
              setSelectedOutput(outputs[selectedIndex]);
              setSelectedImageIndex(selectedIndex);
            }}
            interval={null}
          >
            {outputs.map((output, index) => (
              <Carousel.Item key={output._id}>
                <h4 style={{ color: "#28a745", textAlign: "center" }}>
              {output.nameOutput}
           </h4>
                <img
                  className="d-block w-100"
                  src={`http://localhost:3000/api/Devellopeurs/get-output/${ProjectId}/${SprintId}/${idticket}/${output._id}`}
                  alt={output.description}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          {selectedOutput && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ color: "#28a745", textAlign: "center" }}>
                Description Output
              </h4>
              <p
                style={{
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                  textAlign: "center",
                }}
              >
                {selectedOutput.description.length > 100 ? (
                  <details>
                    <summary>Voir plus</summary>
                    <p>{selectedOutput.description}</p>
                  </details>
                ) : (
                  selectedOutput.description
                )}
              </p>
            </div>
          )}

        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOutputCaptureModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={isDeleteModal} centered onHide={() => setIsDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Supprimer le Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            Vous ne pourrez supprimer ce ticket définitivement
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteTicket}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
       </div>
    );
}

export default NestableCard;