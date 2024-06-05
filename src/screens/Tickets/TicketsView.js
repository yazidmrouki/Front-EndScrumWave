import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Modal, Tab, Nav, Button, ButtonGroup, Carousel,Card } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiAlertCircle, FiMonitor } from "react-icons/fi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import './TicketView.css';

function TicketsView() {
  const [isModal, setIsModal] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [showOutputCaptureModal, setShowOutputCaptureModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState("");
  const [projectDetails, setProjectDetails] = useState({});
  const [projectTickets, setProjectTickets] = useState([]);
  const [bugDetails, setBugDetails] = useState({});
  const [outputs, setOutputs] = useState([]); // Nouvel état pour stocker les outputs du ticket sélectionné
  const [selectedSprintId, setSelectedSprintId] = useState(""); 
  const [selectedTicketId, setSelectedTicketId] = useState(""); 
  const [selectedOutputId,  setSelectedOutputId] = useState(""); 
  const [selectedOutput, setSelectedOutput] = useState(null); // Nouvel état pour stocker l'output sélectionné
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Nouvel état pour stocker l'index de l'image sélectionnée dans le carousel
  const [selectedTicketDetails, setSelectedTicketDetails] = useState({});
 const email=localStorage.getItem('email'); 
  const role=localStorage.getItem('role');
   
  useEffect(() => {

    if (role!=="ProductOwners") {
      return; 
    }
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/projects/names-ids/${email}`);
        setProjects(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching all projects:", error);
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
    if (!selectedProjectId) {
      return; // Ne rien faire si selectedProjectId est null
    }
  
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Project/${selectedProjectId}`);
  
        if (!response.data) {
          toast.warning("No project found", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }
  
        const projectData = response.data;
  
        // Vérifier si projectData contient la clé 'sprints'
        if (!projectData || !projectData.sprints || projectData.sprints.length === 0) {
          // Aucun sprint trouvé, gérer le cas ici
          console.warn("Aucun sprint trouvé pour ce projet");
          return;
        }
  
        const updatedProjectTickets = projectData.sprints.reduce((acc, sprint) => {
          // Vérifier si 'sprint.tickets' est défini et non vide
          if (!sprint.tickets || sprint.tickets.length === 0) {
            // Aucun ticket trouvé pour ce sprint, gérer le cas ici
            console.warn("Aucun ticket trouvé pour ce sprint");
            return acc;
          }
  
          const tickets = sprint.tickets.map(ticket => ({
            numTicket: "#TK-N"+ticket.numTicket,
            ticketInfo: ticket.ticketInfo,
            emailDeveloppeur: Array.isArray(ticket.emailDeveloppeur) ? ticket.emailDeveloppeur : [ticket.emailDeveloppeur],
            assignedstaff: Array.isArray(ticket.emailDeveloppeur) ? ticket.emailDeveloppeur.map((dev) => ({
              email: dev,
              image: `http://localhost:3000/api/Devellopeurs/get-profile-photo/${dev}`
            })) : [{
              email: ticket.emailDeveloppeur,
              image: `http://localhost:3000/api/Devellopeurs/get-profile-photo/${ticket.emailDeveloppeur}`
            }],
            dateCreation: "2045-05-05", 
            ticketState: ticket.ticketState,
            sprintId: sprint._id, 
            id: ticket._id,
            bug: ticket.bugDetails.type, // Nouvelle valeur pour la colonne "BUG"
            outputs: ticket.outputs, // Nouvelle valeur pour la colonne "OUTPUT"
          }));
          return acc.concat(tickets);
        }, []);
        setProjectTickets(updatedProjectTickets);
        
      } catch (error) {
        console.error("Error fetching project details:", error);
        // Afficher une erreur si la récupération des détails du projet échoue
        toast.error("Error fetching project details", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
  
    fetchProjectDetails();
  }, [selectedProjectId]);

  const handleProjectSelection = (projectId) => {
    setActiveProject(projectId);
    setSelectedProjectId(projectId);
  };
  const getColorClass = (ticketState) => {
    switch (ticketState) {
      case "In Progress":
        return "bg-info";
      case "To Do":
        return "bg-warning";
      case "Completed":
        return "bg-success";
      default:
        return "bg-light";
    }
  };

  const columnT = [
    {
      name: "TICKET ID",
      selector: (row) => row.numTicket,
      sortable: true,
      cell: (row) => (
        <a href="tickets-detail" className="fw-bold text-secondary">
          {row.numTicket}
        </a>
      ),
    },
    {
      name: "SUBJECT",
      selector: (row) => row.ticketInfo,
      sortable: true,
    },
    {
      name: 'ASSIGNED STAFF',
      selector: (row) => row.assignedstaff,
      sortable: true,
      cell: (row) => (
        <div>
          {row.assignedstaff.map((dev, index) => (
            <div key={index}>
              <div><img className="avatar rounded-circle" src={dev.image} alt="" /> <span className="fw-bold ms-">{dev.email}</span></div>
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "CREATED DATE",
      selector: (row) => row.dateCreation,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.ticketState,
      sortable: true,
      cell: (row) => (
        <span className={`badge ${getColorClass (row.ticketState) }`}>{row.ticketState}</span>
      ),
    },
    {
      name: "BUG",
      selector: (row) => row.bug,
      sortable: true,
      cell: (row) => (
        <span>
          {row.bug==="technical" ? 
            <i className="icofont-check-circled text-success me-1"></i> :
            <i className="icofont-close-circled text-danger me-1"></i>
          }
        </span>
      ),
    },
    {
      name: "OUTPUT",
      selector: (row) => row.outputs,
      sortable: true,
      cell: (row) => (
        <span>
          {row.outputs.length > 0 ?
            <i className="icofont-check-circled text-success me-1"></i> :
            <i className="icofont-close-circled text-danger me-1"></i>
          }
        </span>
      ),
    },
    {
      name: "ACTIONS",
      cell: (row) => (
        <ButtonGroup aria-label="Basic example" size="lg" className="mb-2">
          <Button variant="danger" size="sm" className="me-2" onClick={() => handleConsultBug(row)}><FiAlertCircle /></Button>
          <Button variant="success" size="sm" onClick={() => handleConsultOutput(row)}><FiMonitor /></Button>
        </ButtonGroup>
      ),
    },
  ];
  
  const conditionalRowStyles = [
   
      {
        when: row => row.bug==="technical",
        style: {
          color: '#00000',
          backgroundColor: '#ffbcbc',
        },
      },
      
 
  ];
  const handleCloseBugModal = () => {
    setShowBugModal(false);
    setBugDetails({});
  };
  const handleConsultBug = (row) => {
    setSelectedSprintId(row.sprintId);
    setSelectedTicketId(row.id);
    axios
      .get(
        `http://localhost:3000/api/Devellopeurs/get-bug/${selectedProjectId}/${row.sprintId}/${row.id}`
      )
      .then((response) => {
        const { description, screenshot, type } = response.data;
        // Vérifier si le type de bug est "Technical"
        if (type === "technical") {
          setShowBugModal(true);
          setBugDetails({ description, screenshot, type });
        } else {
          // Si ce n'est pas un bug technique, afficher un message d'avertissement
          toast.warning("No technical  bug found ", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        // Gérer les erreurs
        toast.warning("No bug found", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error fetching bug details:", error);
      });
  };
  
  useEffect(() => {
    if (outputs.length > 0) {
      setSelectedOutput(outputs[0]); // Définir le premier élément de la liste comme selectedOutput par défaut
      setSelectedImageIndex(0); // Réinitialiser l'index de l'image sélectionnée dans le carousel
    }
  }, [outputs]);

  const handleConsultOutput = (row) => {
    setSelectedOutputId(row.outputId);
    setSelectedTicketId(row.id);
    setSelectedSprintId(row.sprintId);
    // Récupérer les outputs du ticket sélectionné
    axios
      .get(
        `http://localhost:3000/api/Devellopeurs/outputs/${selectedProjectId}/${row.sprintId}/${row.id}`
      )
      .then((response) => {
        if (response.data.outputs.length === 0) {
          toast.warning("No outputs found", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          setShowOutputCaptureModal(true);
          setOutputs(response.data.outputs);
        }
      })
      .catch((error) => {
        console.error("Error fetching outputs:", error);
        toast.error("Erreur lors du chargement des sorties");
      });
  };
  const handleCloseOutputCaptureModal = () => {
    setShowOutputCaptureModal(false);
    setOutputs([]);
    setSelectedOutput(null);
    setSelectedImageIndex(0);
  };

  const handleConsultTicket = (row) => {
    setSelectedTicketDetails(row);
    setIsModal(true);
  };

  
  // Vérifier si projects est null ou vide
  if (!projects || projects.length === 0) {
    return <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
    <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
      <video
        width="260"
        height="260"
        preload="none"
        style={{
          background: 'transparent',
          backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/16104/16104409.png)',
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
        <source src="https://cdn-icons-mp4.flaticon.com/512/16104/16104409.mp4" type="video/mp4" />
      </video>
      <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Project Was  Created</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like You didint Create Project yet. </p>
    
    </div>
  </div>;
  }

  // Vérifier si selectedProjectId est null
  if (!selectedProjectId) {
    return <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
    <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
      <video
        width="260"
        height="260"
        preload="none"
        style={{
          background: 'transparent',
          backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/11681/11681396.png)',
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
        <source src="https://cdn-icons-mp4.flaticon.com/512/11681/11681396.mp4" type="video/mp4" />
      </video>
      <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Project Was  Created</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like You didint Create Project yet. </p>
    
    </div>
  </div>;
  }


  // Vérifier si projectTickets est null ou vide
  if (!projectTickets || projectTickets.length === 0) {
    return <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
    <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
      <video
        width="260"
        height="260"
        preload="none"
        style={{
          background: 'transparent',
          backgroundImage: 'urlhttps://cdn-icons-mp4.flaticon.com/512/15578/15578447.png)',
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
        <source src="https://cdn-icons-mp4.flaticon.com/512/15578/15578447.mp4" type="video/mp4" />
      </video>
      <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Tickets Found</h3>
      <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Tickets Created yet. </p>
    
    </div>
  </div>;
  }



  return (
    <div className="container-xxl">
      <ToastContainer/>
      <PageHeader
        headerTitle="Tickets"
        renderRight={() => (
          <div className="d-flex py-2 project-tab flex-wrap">
           
            <Tab.Container defaultActiveKey="1">
              <Nav variant="pills" className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100">
                {Array.isArray(projects) &&
                  projects.map((project, index) => (
                    <Nav.Item key={project._id}>
                      <Nav.Link
                        eventKey={index + 1} 
                        onClick={() => handleProjectSelection(project._id)}
                        className={`custom-nav-link ${activeProject === project._id ? 'active' : ''}`} 
                      >
                        {project.projectName}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
              </Nav>
            </Tab.Container>
          </div>
        )}
      />
      <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <DataTable
              title={projectDetails.projectName || ""}
              columns={columnT}
              data={projectTickets}
              defaultSortField="title"
              pagination
             
              selectableRowsHighlight
              onRowClicked={handleConsultTicket}
             
              highlightOnHover={true}
              conditionalRowStyles={conditionalRowStyles}
              noHeader={true}
            />
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={isModal}
        onHide={() => setIsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="mb-3">
          
               
            {selectedTicketDetails.assignedstaff && selectedTicketDetails.assignedstaff.map((dev, index) => (
              <div key={index} className="d-flex align-items-center">
              
        
              
         
              
              <img className="avatar rounded-circle ms-1" src={dev.image} alt="" style={{ width: "80px", height: "80px" }} />
             
              <span className="fw-bold  ms-5">{dev.email}</span>
            </div>
            
            
            ))}
          </div>
          <div className="mb-3">
            <label htmlFor="sub" className="form-label">
              Ticket ID
            </label>
            
            <input type="text" className="form-control" id="sub" value={selectedTicketDetails.numTicket} readOnly />
          </div>
          <div className="mb-3">
  <label htmlFor="sub" className="form-label">
    Subject
  </label>
  <textarea 
    className="form-control" 
    id="sub" 
    value={selectedTicketDetails.ticketInfo} 
    readOnly 
  />
</div>

         
          <div className="mb-3">
            <label htmlFor="sub" className="form-label">
              Created Date
            </label>
            <input type="text" className="form-control" id="sub" value={selectedTicketDetails.dateCreation} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="sub" className="form-label">
              Status
            </label>
            <input type="text" className="form-control" id="sub" value={selectedTicketDetails.ticketState} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="sub" className="form-label">
              Bug
            </label>
            <input type="text" className="form-control" id="sub" value={selectedTicketDetails.bug ? "Yes" : "No"} readOnly />
          </div>
          <div className="mb-3">
  <label htmlFor="sub" className="form-label">
    Output
  </label>
  <input type="text" className="form-control" id="sub" value={selectedTicketDetails.outputs && selectedTicketDetails.outputs.length > 0 ? "Yes" : "No"} readOnly />
</div>

        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => setIsModal(false)}>
            Done
          </button>
        </Modal.Footer>
      </Modal>

    
      <Modal show={showBugModal} onHide={handleCloseBugModal} centered>
  <Modal.Header closeButton className="bg-danger text-white">
    <Modal.Title className="d-flex align-items-center">
      <FontAwesomeIcon icon={faBug} className="me-2" />
      <span className="fs-5">Bug Details</span>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="bug-details">
    <div className="bug-type mb-4 text-center">
        <h5 className="text-danger fw-bold">{bugDetails.type} Bug Type</h5>
      </div>
      <div className="bug-description mb-4 border border-danger p-3">
      
        <p  className="bug-type mb-4 text-center"><strong >{bugDetails.description}</strong></p>
      </div>
      {bugDetails.screenshot && 
        <div className="bug-screenshot mb-4">
          <h5 className="text-danger">Screenshot</h5>
      
              <a href={`http://localhost:3000/api/Devellopeurs/get-ticket-screenshot/${selectedProjectId}/${selectedSprintId}/${selectedTicketId}`} target="_blank" rel="noopener noreferrer">
                <img src={`http://localhost:3000/api/Devellopeurs/get-ticket-screenshot/${selectedProjectId}/${selectedSprintId}/${selectedTicketId}`} alt="Bug Screenshot" className="img-thumbnail" style={{ width: "100%", cursor: "pointer" }} />
                <div className="overlay">
                  <div className="text">View</div>
                </div>
              </a>
            </div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseBugModal}>
            <FontAwesomeIcon icon={faWindowClose} className="me-2" />
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showOutputCaptureModal} onHide={handleCloseOutputCaptureModal} centered>
  <Modal.Header closeButton style={{ backgroundColor: "#28a745", color: "white", border: "none" }}>
    <Modal.Title>Output du ticket</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Carousel activeIndex={selectedImageIndex} onSelect={(selectedIndex) => { setSelectedOutput(outputs[selectedIndex]); setSelectedImageIndex(selectedIndex); }} interval={null}>
      {outputs.map((output, index) => (
        <Carousel.Item key={output._id}>
          <Card style={{ width: '100%' }}>
            <Card.Img variant="top" src={`http://localhost:3000/api/Devellopeurs/get-output/${selectedProjectId}/${selectedSprintId}/${selectedTicketId}/${output._id}`} alt={output.description} />
            <Card.Body>
              <Card.Title style={{ color: "#28a745", textAlign: "center" }}>{output.nameOutput}</Card.Title>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
    {selectedOutput && (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ color: "#28a745", textAlign: "center" }}>Output Description</h4>
        <p style={{ fontSize: "20px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
          {selectedOutput.description.length > 100 ? (
            <details>
              <summary>View more</summary>
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
    <Button variant="secondary" onClick={handleCloseOutputCaptureModal}>Close</Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default TicketsView;
