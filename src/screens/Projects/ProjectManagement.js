
import { Modal,Dropdown } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import AllocatedTask from "../../components/Projects/AllocatedTask";
import RecentActivity from "../../components/Projects/RecentActivity";
import { Tabs,  TabContent,Form,Button} from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav, Tab,ButtonGroup} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Navs.css';
import TaskNestable1 from "../../components/Projects/TaskNestable1";
import ProjectDetails from "../../components/Projects/ProjectDetails";      
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegFrown } from 'react-icons/fa';
import ProjectIcons  from '../../assets/images/gallery/portfolio.gif';
 function Tasks() {
    const [activeSprint, setActiveSprint] = useState(null);
    const [sprintStartDate, setSprintStartDate] = useState("");
    const [sprintEndDate, setSprintEndDate] = useState("");
    const [activeProject, setActiveProject] = useState(null);
        const [projectDetails, setProjectDetails] = useState(null);
        const [sprints, setSprints] = useState([]);
        const [InProgressTaskData, setInProgressTaskData] = useState([]);
        const [needReviewData, setNeedReviewData] = useState([]);
        const [CompletedData, setCompletedData] = useState([]);
        const [isModal, setIsModal] = useState(false);
        const [bugChecked, setBugChecked] = useState(false); 
        const [isTicketModal, setIsTicketModal] = useState(false);
        const [sprintName, setSprintName] = useState("");
        const [selectedSprint, setSelectedSprint] = useState(null);
        const [selectedSprintId, setSelectedSprintId] = useState("");
        const [ticketState, setTicketState] = useState('To Do');
        const [selectedSprintIdForTickets, setSelectedSprintIdForTickets] = useState("");
        const [projects, setProjects] = useState([]);
        const [selectedProjectId, setSelectedProjectId] = useState("");
        const [isDeleteModal, setIsDeleteModal] = useState(false);
        const [selectedSprintIdToDelete, setSelectedSprintIdToDelete] = useState(null);
        const [noSprintsAvailable, setNoSprintsAvailable] = useState(false);
        const [projectDates, setProjectDates] = useState(null);
        const Assignedteam=localStorage.getItem("Assignedteam");
        const role=localStorage.getItem("role");
        const email=localStorage.getItem("email");
        const Name=localStorage.getItem("name");
        console.log("Assigned team "+Assignedteam);
     // États pour gérer la modal de mise à jour du sprint
     const [showUpdateModal, setShowUpdateModal] = useState(false);
     const [updatedSprintName, setUpdatedSprintName] = useState('');
     const [updatedSprintStartDate, setUpdatedSprintStartDate] = useState('');
     const [updatedSprintEndDate, setUpdatedSprintEndDate] = useState('');
     const [selectedSprintIdToUpdate, setSelectedSprintIdToUpdate] = useState(null);
 
     const [sprintStartDateUpt, setSprintStartDateUpt] = useState('');
     const [sprintEndDateUpt, setSprintEndDateUpt] = useState('');
 
  

    // Fonction pour fermer la modal de mise à jour du sprint
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
    };

    // Fonction pour mettre à jour le sprint
    const handleEditSprint = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/api/${role}/update-sprint/${selectedProjectId}/${selectedSprintIdToUpdate}`, {
                sprintName: updatedSprintName,
                sprintStartDate: updatedSprintStartDate,
                sprintEndDate: updatedSprintEndDate,
                nameActor: Name,
                email: email,
                // Autres données à envoyer si nécessaire pour mettre à jour le sprint
            });
        
            // Mettre à jour localement les détails du sprint si nécessaire
            // Fermer la modal de mise à jour du sprint
            handleCloseUpdateModal();
        } catch (error) {
            console.error('Error updating sprint:', error);
            // Gérer les erreurs si nécessaire
        }
    };

    const handleOpenUpdateModal = async (sprintId) => {
        setSelectedSprintIdToUpdate(sprintId);
        setShowUpdateModal(true);
        await fetchProjectDatesUpdate(selectedProjectId, sprintId);
    };
    
    // Fonction pour récupérer les dates de début et de fin du projet ainsi que du dernier sprint
    const fetchProjectDatesUpdate = async (projectId, sprintId) => {
        console.log("heaep azpodoaz" + projectId, sprintId);
        try {
            // Vérifier si les IDs ne sont pas vides
            if (!projectId || !sprintId) {
                // Si l'un des IDs est vide, ne rien faire et quitter la fonction
                return;
            }
            
            const response = await axios.get(`http://localhost:3000/api/${role}/projects/date-Update/${projectId}/${sprintId}`);
            const { startDate, endDate } = response.data;
            
            setSprintStartDateUpt(startDate);
            setSprintEndDateUpt(endDate);
        } catch (error) {
            console.error('Erreur lors de la récupération des dates du sprint:', error);
        }
    };
    


   // Appeler fetchProjectDates lorsque selectedProjectId change
useEffect(() => {
   
    fetchProjectDatesUpdate();
    console.log("Date "+ sprintEndDateUpt, sprintStartDate);
}, [selectedSprintIdToUpdate]);


      


        useEffect(() => {
          if(!Assignedteam) return ;
            const fetchAllProjects = async () => {
             
                try {
                    const response = await axios.get(`http://localhost:3000/api/${role}/projects/names-ids/${Assignedteam}`);
                  
                    setProjects(response.data);
                  
                    
                } catch (error) {
                    console.error('Error fetching all projects:', error);
                }
            };
    
            fetchAllProjects();
        }, []);
        useEffect(() => {
            if (!selectedProjectId && projects.length > 0) {
                setSelectedProjectId(projects[0]._id);
                
            }
        }, [selectedProjectId, projects]);
        useEffect(() => {
            if (!selectedSprintId && sprints.length > 0) {
                setSelectedSprintIdForTickets(sprints[0]._id);
            }
        }, [selectedSprintId, sprints]);
        
        useEffect(() => {

            const fetchProjectDetails = async () => {
                try {
                    if (!selectedProjectId) return;
    
    
                    // Fetch project details
                    const response = await axios.get(`http://localhost:3000/api/${role}/get-Project/${selectedProjectId}`);
    
                    if (!response.data) {
                        // Si la réponse est vide, affiche un avertissement
                        toast.warning('No project assigned', {
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        return ;
                    }
    
                    // Si la réponse n'est pas vide, met à jour les détails du projet
                    setProjectDetails(response.data);
                    console.log("selectedProjectId    :" + selectedProjectId);
    
                    // Fetch all sprints associated with the project
                    const sprintsResponse = await axios.get(`http://localhost:3000/api/${role}/get-Sprints/${selectedProjectId}`);
                    setSprints(sprintsResponse.data);
                } catch (error) {
                    console.error('Error fetching project details:', error);
                }
            };
    
            fetchProjectDetails();
        }, [selectedProjectId, setProjectDetails, setSprints]);
        
    const handleProjectSelection = (projectId) => {
        setSelectedProjectId(projectId);
    };

  

        const handleSprintSelection = (sprintId) => {
            setSelectedSprintIdForTickets(sprintId);
            console.log(" selectedSprintIdForTickets :"+selectedSprintIdForTickets);
            // Call the function to fetch tickets associated with the selected sprint
        
        };
        useEffect(() => {
            // Fonction pour récupérer les tickets depuis le backend
            const fetchTickets = async () => {
                try {
                    if (!selectedProjectId || !selectedSprintIdForTickets) return null;
        
                    const projectId = projectDetails ? projectDetails._id : null;
        
                    console.log("selectedSprintIdForTickets" + selectedSprintIdForTickets);
                    console.log("projectId:" + selectedProjectId);
        
                    const response = await axios.get(`http://localhost:3000/api/${role}/get-s-tickets/${selectedProjectId}/${selectedSprintIdForTickets}`);
                    const tickets = response.data;
                    console.log(response.data);
        
                    // Mapper les données des tickets dans le format attendu par le composant TaskNestable1
                    const inProgressTasks = tickets
                        .filter(ticket => ticket.ticketState === 'To Do')
                        .map(ticket => ({
                            ProjectId: selectedProjectId,
                            SprintId: selectedSprintIdForTickets,
                            idticket: ticket._id,
                            title: ticket.typeTicket,
                            status: ticket.priority,
                            etat: ticket.ticketState,
                            dateCreation: ticket.dateCreation,
                            bug: ticket.bug,
                            noSprint: ticket.noSprint,
                            numTicket: ticket.numTicket,
                            type: "grag",
                            Data: "MEDI1UM",
                            attachment: ticket.attachment,
                            NameDev: ticket.emailDeveloppeur,
                            emailDeveloppeur: ticket.emailDeveloppeur,
                            ticketInfo: ticket.ticketInfo
                        }));
        
                    const needReviewTasks = tickets
                        .filter(ticket => ticket.ticketState === 'In Progress')
                        .map(ticket => ({
                            idticket: ticket._id,
                            ProjectId: selectedProjectId,
                            SprintId: selectedSprintIdForTickets,
                            type: "grag",
                            Data: "MEDIUM1need",
                            title: ticket.typeTicket,
                            status: ticket.priority,
                            dateCreation: ticket.dateCreation,
                            bug: ticket.bug,
                            etat: ticket.ticketState,
                            noSprint: ticket.noSprint,
                            numTicket: ticket.numTicket,
                            attachment: ticket.attachment,
                            NameDev: ticket.emailDeveloppeur,
                            emailDeveloppeur: ticket.emailDeveloppeur,
                            ticketInfo: ticket.ticketInfo
                        }));
        
                    const completedTasks = tickets
                        .filter(ticket => ticket.ticketState === 'Completed')
                        .map(ticket => ({
                            idticket: ticket._id,
                            ProjectId: selectedProjectId,
                            SprintId: selectedSprintIdForTickets,
                            title: ticket.typeTicket,
                            status: ticket.priority,
                            etat: ticket.ticketState,
                            dateCreation: ticket.dateCreation,
                            bug: ticket.bug,
                            noSprint: ticket.noSprint,
                            numTicket: ticket.numTicket,
                            type: "grag",
                            Data: "MEDIUM1need",
                            attachment: ticket.bug,
                            NameDev: ticket.emailDeveloppeur,
                            emailDeveloppeur: ticket.emailDeveloppeur,
                            ticketInfo: ticket.ticketInfo
                        }));
        
                    // Mettre à jour les états locaux avec les données mappées
                    setInProgressTaskData(inProgressTasks);
                    setNeedReviewData(needReviewTasks);
                    setCompletedData(completedTasks);
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                }
            };
        
            if (selectedSprintIdForTickets && projectDetails) {
                fetchTickets();
            }
        }, [selectedSprintIdForTickets, projectDetails, selectedProjectId]);
        
        
        useEffect(() => {
            // Cette fonction met à jour la valeur par défaut de la case à cocher "Bug"
            setBugChecked(false);
        }, [isTicketModal]); // Déclencher lorsque le modal de création de ticket est ouvert
    
        const createTicket = () => {
            const projectId = projectDetails._id; // Get the project ID
            const sprintId = selectedSprintIdForTickets; // Get the selected sprint ID
            const typeTicket = document.getElementById('typeTicket').value;
            const emailDeveloppeur = email;
            const priority = document.getElementById('priority').value;
            const ticketInfo = document.getElementById('ticketInfo').value;
            const ticketState = document.getElementById('ticketState').value;
            axios.post(`http://localhost:3000/api/${role}/create-ticket/${selectedProjectId}/${sprintId}`, {
                typeTicket,
                emailDeveloppeur,
                priority,
                ticketInfo,
                bug: bugChecked, // Utilisation de l'état du champ "Bug"
                ticketState,
                nameActor:Name, // Ajout du nom de l'acteur
                email:email
            })
            .then(response => {
                console.log('New ticket created:', response.data);
                setIsTicketModal(false); // Fermer le modal de création de ticket
                // Autres actions à effectuer ici si nécessaire
            })
            .catch(error => {
                console.error('Error creating ticket:', error);
                // Gérer les erreurs si nécessaire
            });
        };
   
        const createSprint = () => {

            const sprintName = document.getElementById('exampleFormControlInput77').value;
            {console.log("End "+  sprintEndDate,sprintStartDate, sprintName,Name, email,selectedProjectId) } 
axios.post(`http://localhost:3000/api/${role}/Create-Sprint/${selectedProjectId}`, { sprintName: sprintName ,
nameActor: Name,
 email:email,  
 sprintStartDate: sprintStartDate,
sprintEndDate: sprintEndDate })
            .then(response => {
                console.log('New sprint created:', response.data);
                setIsModal(false); // Fermer la modal après la création du sprint
                // Vous pouvez effectuer d'autres actions ici si nécessaire
            })
            .catch(error => {
                console.error('Error creating sprint:', error);
                // Gérer les erreurs si nécessaire
            });
    };
      
    const handleDelete = async (sprintId) => {
        try {
          await axios.delete(`http://localhost:3000/api/${role}/delete-sprint/${selectedProjectId}/${sprintId}`, {
            data: { nameActor: Name, email: email }
          });
          // Actualiser la liste des sprints après la suppression
          const updatedSprints = sprints.filter(sprint => sprint._id !== sprintId);
          setSprints(updatedSprints);
          // Fermer la modal de suppression après la suppression du sprint
          setIsDeleteModal(false);
        } catch (error) {
          console.error('Error deleting sprint:', error);
        }
      };
      

    const openDeleteModal = (sprintId) => {
        
     
        setSelectedSprintIdToDelete(sprintId);
        setIsDeleteModal(true);
   
   
    };


   // Fonction pour récupérer les dates du projet
   const fetchProjectDates = async () => {
    try {
        if (!selectedProjectId) return;
        const response = await axios.get(`http://localhost:3000/api/${role}/projects/dates/${selectedProjectId}`);
        setProjectDates(response.data);

        
    } catch (error) {
        console.error('Error fetching project dates:', error);
    }
};
const handleCreateSprintClick = () => {
    if (projectDates.projectEndDate === projectDates.sprintEndDate) {
        // Afficher l'avertissement
        toast.warning('Warning: No days left for sprint planning');
    } else {
        // Ouverture de la modal pour créer un sprint
        setIsModal(true);
    }
};




// Appeler fetchProjectDates lorsque selectedProjectId change
useEffect(() => {
    fetchProjectDates();
}, [selectedProjectId]);

    return (

        projectDetails ? (
        <div className="container-xxl">
           <ToastContainer/>
<PageHeader headerTitle="Project Details"
                renderRight={() => {
                    return  <div className="col-auto d-flex w-sm-100">
                    <ButtonGroup>
                    { sprints.length > 0 && (
  <Dropdown className="d-inline mx-2">
    <Dropdown.Toggle className="btn btn-dark btn-set-task w-sm-100" id="dropdown-basic">
      <i className="icofont-trash me-2 fs-6"></i>Delete Sprint
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {sprints.map(sprint => (
        <Dropdown.Item key={sprint._id} onClick={() => openDeleteModal(sprint._id)}>
          {sprint.sprintName}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
)}
{ sprints.length > 0 && (
  <Dropdown className="d-inline mx-2">
    <Dropdown.Toggle className="btn bg-secondary btn-set-task w-sm-100" id="dropdown-basic">
      <i className="icofont-edit me-2 fs-6 "></i>Update Sprint
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {sprints.map(sprint => (
        <Dropdown.Item key={sprint._id} onClick={() =>handleOpenUpdateModal(sprint._id)}>
          {sprint.sprintName}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
)}

                        <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle className="btn btn-dark btn-set-task w-sm-100"   onClick={handleCreateSprintClick} id="dropdown-basic">
                     
                            <i className="icofont-plus-circle me-2 fs-6"></i>Create Sprint
                  
                        </Dropdown.Toggle>
                        </Dropdown>
                    </ButtonGroup>
         
                    <Dropdown className="d-inline mx-2">
                        <Tab.Container defaultActiveKey="1">
    <Nav variant="pills" className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100">
        {Array.isArray(projects) && projects.map((project, index) => (
            <Nav.Item key={project._id}>
                <Nav.Link
                    eventKey={index + 1} // Index commence à partir de 0, donc nous ajoutons 1
                    onClick={() => handleProjectSelection(project._id)}
                    className={`custom-nav-link ${activeProject === project._id ? 'active' : ''}`} // Ajouter la classe active si l'élément est sélectionné
                >
                    {project.projectName}
                </Nav.Link>
            </Nav.Item>
        ))}
    </Nav></Tab.Container>    </Dropdown>
                    </div>
                    
                }}

                
            />

<Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
    <Modal.Header closeButton>
        <Modal.Title>Modifier le Sprint</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    
        <Form.Group controlId="formSprintName">
            <Form.Label>Nouveau Nom du Sprint</Form.Label>
            <Form.Control type="text" placeholder="Entrez le nouveau nom du sprint" value={updatedSprintName} onChange={(e) => setUpdatedSprintName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formSprintStartDate">
            <Form.Label>Nouvelle Date de Début du Sprint</Form.Label>
            <Form.Control type="date" value={updatedSprintStartDate} onChange={(e) => setUpdatedSprintStartDate(e.target.value)} min={sprintStartDateUpt} max={sprintEndDateUpt} />


            {console.log("Sprintupdate"+sprintStartDateUpt, sprintEndDateUpt)}
        </Form.Group>
        <Form.Group controlId="formSprintEndDate">
            <Form.Label>Nouvelle Date de Fin du Sprint</Form.Label>
            <Form.Control type="date" value={updatedSprintEndDate} onChange={(e) => setUpdatedSprintEndDate(e.target.value)} min={updatedSprintStartDate} max={sprintEndDateUpt } />
        </Form.Group>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Annuler
        </Button>
        <Button variant="primary" onClick={handleEditSprint}>
            Enregistrer les modifications
        </Button>
    </Modal.Footer>
</Modal>
<Modal show={isDeleteModal} centered onHide={() => setIsDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Delete Sprint</Modal.Title>
                </Modal.Header>
                <Modal.Body className="justify-content-center flex-column d-flex">
                    <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
                    <p className="mt-4 fs-5 text-center">You can only delete this Sprint Permanently</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModal(false)}>Cancel</button>
                    <button type="button" className="btn btn-danger color-fff" onClick={() => handleDelete(selectedSprintIdToDelete)}>Delete</button>
                </Modal.Footer>
            </Modal>
               
            <div className="row clearfix g-3">
                <div className="col-lg-12 col-md-12 flex-column">
                    <div className="row g-3 row-deck">
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                        
                        <ProjectDetails 
    projectName={projectDetails.projectName ?? "Default Project Name"}    
    projectCategory={projectDetails.projectCategory ?? "Default Category"} 
    projectStartDate={projectDetails.projectStartDate ?? "Default Start Date"} 
    projectEndDate={projectDetails.projectEndDate ?? "Default End Date"}  
    projectAssignedTeams={projectDetails.projectAssignedTeams?.name ?? "Default Team Name"}       
    budget={projectDetails.budget ?? 0}
    priority={projectDetails.priority ?? "Default Priority"} 
    emailProductOwner={projectDetails.emailPo ?? "Default Product Owner Email"} 
sprints={projectDetails.sprints}


/>



                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6"><RecentActivity projectId={selectedProjectId} /></div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12"> {projectDetails && (
                                <AllocatedTask 
                                    userStories={projectDetails.userStories}
                                    productBacklog={projectDetails.productBacklog}
                                />
                            )}</div>
                    </div>
                    <PageHeader
            headerTitle="Tickets Management"
            renderRight={() => (
                <Tab.Container defaultActiveKey="1">
                <Nav variant="pills" className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100">
                    {sprints.map((sprint, index) => (
                        <Nav.Item key={sprint._id}>
                            <Nav.Link
                                eventKey={index + 1}
                                onClick={() => handleSprintSelection(sprint._id)}
                                className={`custom-nav-link ${activeSprint === sprint._id ? 'active' : ''}`}
                            >
                                {sprint.sprintName}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
                </Tab.Container>
            )}
        />


  {projectDetails && projectDetails.sprints.length === 0 ? (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '30vh' }}>
      <img
src="https://cdn-icons-png.flaticon.com/512/5108/5108574.png"
width={130}
height={100}
alt="icon"
className="mb-4 animate__animated animate__bounceIn"
/>

      <h3 className="text-secondary mb-3">No Sprint Found</h3>
   
    
      <ToastContainer />
  </div>
  ) : (
    <div>
      <TaskNestable1
        InProgressTaskData={InProgressTaskData}
        needReviewData={needReviewData}
        CompletedData={CompletedData}
      />
      <button className="btn bg-secondary w-100 d-flex justify-content-center align-items-center " onClick={() => { setIsTicketModal(true) }}>
        <i className="icofont-ui-add me-2"></i>
        <span className="fs-5">Add Ticket</span>
      </button>
    </div>
  )}

</div>
</div>
           

<Modal show={isModal} onHide={() => setIsModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title className="fw-bold text-center">Create Sprint</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="mb-3">
      <label htmlFor="exampleFormControlInput77" className="form-label">
        Sprint Name
      </label>
      <input
        type="text"
        className="form-control"
        id="exampleFormControlInput77"
        placeholder="Enter Sprint Name"
        onChange={(e) => setSprintName(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="exampleFormControlInput78" className="form-label">
        Start Date
      </label>
      <input
    type="date"
    className="form-control"
    id="exampleFormControlInput78"
    
    min={projectDates.projectStartDate}


    max={projectDates && projectDates.projectEndDate}
    onChange={(e) => setSprintStartDate(e.target.value)}
/>

      
    </div>
    <div className="mb-3">
      <label htmlFor="exampleFormControlInput79" className="form-label">
        End Date
      </label>
      <input
        type="date"
        className="form-control"
        id="exampleFormControlInput79"
        min={sprintStartDate} // Utilise la date de début du sprint comme minimum
        max={projectDates.projectEndDate}
        onChange={(e) => setSprintEndDate(e.target.value)}
      />
  
    </div>
  </Modal.Body>
  <Modal.Footer className="justify-content-center">
    <button type="button" className="btn btn-secondary me-2" onClick={() => setIsModal(false)}>
      Cancel
    </button>
    <button type="button" className="btn btn-primary" onClick={createSprint}>
      Create
    </button>
  </Modal.Footer>
</Modal>

            <Modal show={isTicketModal} onHide={() => setIsTicketModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-center">Créer un ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="typeTicket" className="form-label">Type de Ticket</label>
            <input type="text" className="form-control" id="typeTicket" placeholder="Entrez le type de ticket" defaultValue="Web" />
          </div>
          <div className="mb-3">
            <label htmlFor="emailDeveloppeur"  hidden className="form-label">Email du Développeur</label>
            <input type="email" className="form-control" id="emailDeveloppeur"  hidden placeholder="Entrez l'email du développeur" defaultValue="r@Vermeg.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priorité</label>
            <select className="form-select" id="priority" defaultValue="Haute">
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Faible</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ticketState" className="form-label">État du Ticket</label>
            <select className="form-select" id="ticketState" value={ticketState} onChange={(e) => setTicketState(e.target.value)}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="sprint" className="form-label">Select Sprint</label>
            <select className="form-select" id="sprint" value={selectedSprintId} onChange={(e) => setSelectedSprintId(e.target.value)}>
              <option value="">Select a sprint</option>
              {sprints.map(sprint => (
                <option key={sprint._id} value={sprint._id}>{sprint.sprintName}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ticketInfo" className="form-label">Information sur le Ticket</label>
            <textarea className="form-control" id="ticketInfo" rows="3" placeholder="Entrez les informations sur le ticket" defaultValue="Implémenter la fonctionnalité XYZ"></textarea>
          </div>
          
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-secondary me-2" onClick={() => setIsTicketModal(false)}>Annuler</button>
          <button type="button" className="btn btn-primary" onClick={createTicket}>Créer</button>
        </Modal.Footer>
      </Modal>

        </div>
    ) : (
       
        
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '60vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <div className="text-center">
        <img
          src={ProjectIcons}
          width={200}
          height={200}
          alt="icon"
          className="mb-4 animate__animated animate__bounceIn"
          style={{
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            background: 'transparent',
          }}
        />
        <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Project Found</h3>
        <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
          It seems like you don't have any projects yet. Contact your Product Owners if there are any problems!
        </p>
      </div>
      <ToastContainer />
    </div>
      
      )
      
    )
   
}


export default Tasks;