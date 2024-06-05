
import { Modal,Dropdown } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import AllocatedTask from "../../components/Projects/AllocatedTask";
import RecentActivity from "../../components/Projects/RecentActivity";
import { Tabs,  TabContent,Alert} from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav, Tab } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Navs.css';
import TaskNestable1 from "../../components/Projects/TaskNestable1";
import ProjectDetails from "../../components/Projects/ProjectDetails";      
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { To } from "react-flags-select";
import { FaRegFrown } from 'react-icons/fa';

 function Tasks() {
    const [activeSprint, setActiveSprint] = useState(null);

    const [activeProject, setActiveProject] = useState(null);
        const [projectDetails, setProjectDetails] = useState(null);
        const [sprints, setSprints] = useState([]);
        const [InProgressTaskData, setInProgressTaskData] = useState([]);
        const [needReviewData, setNeedReviewData] = useState([]);
        const [CompletedData, setCompletedData] = useState([]);
        const [isModal, setIsModal] = useState(false);
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
         const role=localStorage.getItem("role");
          const Assignedteam=localStorage.getItem("Assignedteam");


        useEffect(() => {


            const fetchAllProjects = async () => {
                
                try {
                    const response = await axios.get(`http://localhost:3000/api/scrumMasters/projects/names-ids/${Assignedteam}`);
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
                    const response = await axios.get(`http://localhost:3000/api/scrumMasters/get-Project/${selectedProjectId}`);
    
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
                    const sprintsResponse = await axios.get(`http://localhost:3000/api/scrumMasters/get-Sprints/${selectedProjectId}`);
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
                    const projectId = projectDetails._id;
                    console.log("selectedSprintIdForTickets"+selectedSprintIdForTickets);
                    console.log("projectId:"+selectedProjectId);
                    const response = await axios.get(`http://localhost:3000/api/scrumMasters/get-s-tickets/${selectedProjectId}/${selectedSprintIdForTickets}`);
                    const tickets = response.data;
                    console.log(response.data);
                    // Mapper les données des tickets dans le format attendu par le composant TaskNestable1
                    const inProgressTasks = tickets
                        .filter(ticket => ticket.ticketState === 'To Do')
                        .map(ticket => ({
                            ProjectId:selectedProjectId,
                            SprintId:selectedSprintIdForTickets,
                            idticket: ticket._id, // Assurez-vous que chaque ticket a un ID unique
                            title: ticket.typeTicket,
                            status: ticket.priority,
                            etat:ticket.ticketState,
                            dateCreation:ticket.dateCreation,
                            bug:ticket.bug,
                            noSprint:ticket.noSprint,
                            numTicket:ticket.numTicket,
                            type:"grag",
                            bugDetails:ticket.bugDetails,
                            Data:"MEDI1UM",
                            attachment: ticket.attachment,
                            NameDev: ticket.emailDeveloppeur,
                            emailDeveloppeur: ticket.emailDeveloppeur,
                            ticketInfo: ticket.ticketInfo
                            // Ajoutez d'autres attributs si nécessaire
                        }));

                    const needReviewTasks = tickets
                        .filter(ticket => ticket.ticketState === 'In Progress')
                        .map(ticket => ({
                            idticket: ticket._id,
                            ProjectId:selectedProjectId,
                            SprintId:selectedSprintIdForTickets,
                            type:"grag",
                             Data:"MEDIUM1need",
                            title: ticket.typeTicket,
                            bugDetails:ticket.bugDetails,
                            status: ticket.priority,
                            dateCreation:ticket.dateCreation,
                            bug:ticket.bug,
                            etat:ticket.ticketState,
                            noSprint:ticket.noSprint,
                            numTicket:ticket.numTicket,
                            attachment: ticket.attachment,
                            NameDev: ticket.emailDeveloppeur,
                            emailDeveloppeur: ticket.emailDeveloppeur,
                            ticketInfo: ticket.ticketInfo
                        }));
                    const completedTasks = tickets
                        .filter(ticket => ticket.ticketState === 'Completed')
                        .map(ticket => ({
                            idticket: ticket._id,
                            ProjectId:selectedProjectId,
                            SprintId:selectedSprintIdForTickets,
                            title: ticket.typeTicket,
                            status: ticket.priority,
                            etat:ticket.ticketState,
                            dateCreation:ticket.dateCreation,
                            bug:ticket.bug,
                            bugDetails:ticket.bugDetails.
                            description,
                            noSprint:ticket.noSprint,
                            numTicket:ticket.numTicket,
                            type:"grag",
                            Data:"MEDIUM1need",
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
        }, [selectedSprintIdForTickets, projectDetails,selectedProjectId]);

        
        const createTicket = () => {
            const projectId = projectDetails._id; // Get the project ID
            const sprintId = selectedSprintId; // Get the selected sprint ID
            const typeTicket = document.getElementById('typeTicket').value;
            const emailDeveloppeur = document.getElementById('emailDeveloppeur').value;
            const priority = document.getElementById('priority').value;
            const ticketInfo = document.getElementById('ticketInfo').value;
            const bug = document.getElementById('bug').checked;
            const ticketState= document.getElementById('ticketState').value;
            console.log("selectedProjectId    :"+selectedProjectId);
            axios.post(`http://localhost:3000/api/ProductOwners/Create-tickets/${selectedProjectId}/${sprintId}`, {
                typeTicket,
                emailDeveloppeur,
                priority,
                ticketInfo,
                bug,
                ticketState
            })
            .then(response => {
                console.log('New ticket created:', response.data);
                setIsTicketModal(false); // Close the ticket creation modal
                // You can perform other actions here if needed
            })
            .catch(error => {
                console.error('Error creating ticket:', error);
                // Handle errors if necessary
            });
        };  
   
        const createSprint = () => {

            const sprintName = document.getElementById('exampleFormControlInput77').value;
             
axios.post(`http://localhost:3000/api/ProductOwners/Create-Sprint/${selectedProjectId}`, { sprintName: sprintName })
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

          
            await axios.delete(`http://localhost:3000/api/ProductOwners/delete-sprints/${selectedProjectId}/${sprintId}`);
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

    const handleNoSprints = () => {
        setNoSprintsAvailable(true);
        toast.warning("Ce projet n'a aucun sprint assigné.", {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    return (

        projectDetails ? (
        <div className="container-xxl">
           <ToastContainer/>
<PageHeader headerTitle="Tasks Management"
                renderRight={() => {
                    return <div className="col-auto d-flex w-sm-100">
               
                        
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
    </Nav></Tab.Container>
                    </div>
                    
                }}

                
            />


               
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
            headerTitle="Tasks Management"
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
    <div className="text-center">
      <FaRegFrown size={64} color="#6c757d" className="mb-4 animate__animated animate__bounceIn" />
      <h3 className="text-primary mb-3">No Sprint Found</h3>
    </div>
  ) : (
   
      <TaskNestable1
        InProgressTaskData={InProgressTaskData}
        needReviewData={needReviewData}
        CompletedData={CompletedData}
      />
     
  )}

                </div>
            </div>
            




        </div>
    ) : (
       
        <div className="no-projects-message">
            <ToastContainer></ToastContainer>
        <Alert variant="warning" className="text-center">
            <i className="icofont-warning-alt fs-3 me-2"></i>
            No project assigned
        </Alert>
    </div>
      )
      
    )
   
}


export default Tasks;