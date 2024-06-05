import React, { useState, useEffect } from 'react'; // Commentez cette ligne

import { Modal, Nav, Tab } from "react-bootstrap";
import CurrenTProject from "../../components/Clients/CurrenTProject";
import AddNewUserModal from "../../components/common/AddNewUserModal";
import PageHeader from "../../components/common/PageHeader";
import axios from 'axios'; 
import { toast, ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css';


const filterProjects = (projects, setFilteredProjects) => {
    const now = new Date();
    const allProjects = projects;
    const toDoProjects = projects.filter(project => new Date(project.projectStartDate) > now);
    const inProgressProjects = projects.filter(project => new Date(project.projectStartDate) <= now && new Date(project.projectEndDate) >= now);
    const completedProjects = projects.filter(project => new Date(project.projectEndDate) < now || project.Delivered);

    setFilteredProjects({
        all: allProjects,
        toDo: toDoProjects,
        inProgress: inProgressProjects,
        completed: completedProjects
    });
};

function Projects(props) {
    const [isModal, setIsModal] = useState(false);
    const [isDeleteModal, setDeleteModal] = useState(false);
    const [isAddUserModal, setAddUserModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [editModeldata, setEditModeldata] = useState("");
    const [teams, setTeams] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [projects, setProjects] = useState([]);
    const [TeamsUpdate, setAvailableTeamsUpt] = useState([]);
    const [TeamsCreate, setAvailableTeamsCrt] = useState([]);
    const email = localStorage.getItem('email');



    const [formData, setFormData] = useState({
        projectName: "",
        projectCategory: "UI/UX Design",
        userStories: [],
        productBacklog: [],
        ClientName: "",
        projectStartDate: new Date().toISOString().split('T')[0],
        projectEndDate: new Date().toISOString().split('T')[0],
        projectAssignedTeams: "",
        budget: 0,
        priority: "",
        description: "",
        isEdit: false,
        projectId: ""
    });

useEffect(() => {
    const fetchTeams = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-teams/${email}`);
            setTeams(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes :' + error.response.data.message);
            toast.error("Erreur lors de la récupération des équipes." + error.response.data.message);
        }
    };

    fetchTeams();
}, [email]);


    useEffect(() => {

        if(!projects || projects.length==0) return ;


        if (!formData.isEdit) {
            // Filtrer les équipes sans projet assigné
            const teamsWithoutProjects = teams.filter(team => team.projects.length === 0);
         
          
            setAvailableTeamsCrt(teamsWithoutProjects);
        }// Inclure l'équipe actuellement assignée au projet en cours d'édition
// Inclure l'équipe actuellement assignée au projet en cours d'édition
const currentProjectTeam = teams.find(team => team._id === formData.projectAssignedTeams._id);


if (!currentProjectTeam) {
    console.error("Erreur : L'équipe actuellement assignée au projet n'a pas été trouvée.");
    console.log("assignedTeamId:", formData.projectAssignedTeams);
    console.log("teams IDs:", teams.map(team => team._id));
    return;
}

const teamIdsWithProjects = projects.map(project => project.projectAssignedTeams._id);

// Filtrer les équipes qui n'ont pas de projets assignés
const teamsWithoutProjects = teams.filter(team => !teamIdsWithProjects.includes(team._id));

const teamsWithAndWithoutProjects = [...teamsWithoutProjects];


teamsWithAndWithoutProjects.push(currentProjectTeam);

setAvailableTeamsUpt(teamsWithAndWithoutProjects);



        
        
    }, [teams, projects, formData.isEdit, formData.projectAssignedTeams]);
    
    
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Exécuter la requête
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Projects/${email}`);
                // Vérifier si response.data est défini
                if (response.data) {
                    // Mettre à jour l'état avec les données de la réponse
                    setProjects(response.data);
                    toast.success('ok');
                } else {
                    // Gérer le cas où response.data est nul
                    console.error("La réponse de la requête est vide.");
                    return;
                }
            } catch (error) {
                // Gérer les erreurs
                
                toast.warning("Warning :" + error.response.data.message);
            }
        };
    
        fetchProjects();
    }, [email]);
    
    

    const handleDelete = async (projectId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/ProductOwners/delete-Project/${projectId}`);
            
            if (response.status === 200) {
                // Mise à jour de l'état des projets après la suppression
                const updatedProjects = projects.filter(project => project._id !== projectId);
                setProjects(updatedProjects);
                toast.success("Projet supprimé avec succès !");
                window.location.reload();

            }
        } catch (error) {
            console.error('Erreur lors de la suppression du projet :', error.response.data.message);
            toast.error("Erreur lors de la suppression du projet : " + error.response.data.message);
        }
    };

    const handleUpdate = async () => {
        try {
            const formDataToSend = new FormData();
    
            // Ajoutez les données du formulaire à l'objet FormData
            formDataToSend.append('projectName', formData.projectName);
            formDataToSend.append('ClientName', formData.ClientName);
            formDataToSend.append('projectCategory', formData.projectCategory);
            formDataToSend.append('projectStartDate', formData.projectStartDate);
            formDataToSend.append('projectEndDate', formData.projectEndDate);
            formDataToSend.append('projectAssignedTeams', formData.projectAssignedTeams); // Ajoutez l'ID de l'équipe assignée
            formDataToSend.append('budget', formData.budget);
            formDataToSend.append('priority', formData.priority);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('projectId', formData.projectId); // Ajoutez l'ID du projet
    
            // Ajoutez les user stories et le product backlog
            for (let i = 0; i < selectedFiles.length; i++) {
                formDataToSend.append("userStories", selectedFiles[i]);
                formDataToSend.append("productBacklog", selectedFiles[i]);
            }
    
            console.log("projectAssignedTeams", formData.projectAssignedTeams._id);
    
            const response = await axios.put(`http://localhost:3000/api/ProductOwners/update-Project/${formData.projectId}`, formDataToSend);
            if (response.status === 200) {
                // Mise à jour de l'état des projets après la mise à jour réussie
                const updatedProjects = projects.map(project => {
                    if (project._id === formData.projectId) {
                        return { ...project, ...formData };
                    }
                    return project;
                });
    
                setProjects(updatedProjects);
                setIsModal(false);
                toast.success("Projet mis à jour avec succès !");
            }
        } catch (error) {
            console.warn('Erreur lors de la mise à jour du projet :', error.response.data.message);
            toast.error("Erreur lors de la mise à jour du projet : " + error.response.data.message);
        }
    };
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    
    const handleFileChange = (e) => {
        const files = e.target.files;
        setSelectedFiles(files);
    };

    const handleModalOpen = (mode, data = {}) => {
        if (mode === "create") {
            setModalHeader("Create Project");
            setFormData({
                projectName: "",
                projectCategory: "UI/UX Design",
                userStories: [],
                ClientName:"",
                productBacklog: [],
                projectStartDate: new Date().toISOString().split('T')[0],
                projectEndDate: new Date().toISOString().split('T')[0],
                projectAssignedTeams: "",
                budget: 0,
                priority: "",
                description: "",
                isEdit: false,
                projectId: ""
            });
        } else if (mode === "edit") {
            setModalHeader("Update Project");
            setFormData({
                projectName: data.projectName || "",
                projectCategory: data.projectCategory || "",
                ClientName: data.ClientName||"",
                userStories: data.userStories || [],
                productBacklog: data.productBacklog || [],
                projectStartDate: (data.projectStartDate instanceof Date ? data.projectStartDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
                projectEndDate: (data.projectEndDate instanceof Date ? data.projectEndDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
                projectAssignedTeams: data.projectAssignedTeams||  "",
                budget: data.budget || 0,
                priority: data.priority || "",
                description: data.description || "",
                isEdit: true,
                projectId: data._id || "" // Ajoutez une vérification pour data._id
            });
        }
        setIsModal(true);
    };
    

 
    const handleSubmit = async () => {
     
        if (!formData.projectName || !formData.projectCategory || !formData.projectStartDate || !formData.projectEndDate || !formData.projectAssignedTeams || !formData.budget || !formData.priority) {
            toast.error("Please fill out all required fields.");
            return;
        }
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("projectName", formData.projectName);
            formDataToSend.append("projectCategory", formData.projectCategory);
            formDataToSend.append('ClientName', formData.ClientName);
            formDataToSend.append("projectStartDate", formData.projectStartDate);
            formDataToSend.append("projectEndDate", formData.projectEndDate);
            formDataToSend.append("projectAssignedTeams", formData.projectAssignedTeams);
            formDataToSend.append("budget", formData.budget);
            formDataToSend.append("priority", formData.priority);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("emailPo", email);

            for (let i = 0; i < selectedFiles.length; i++) {
                formDataToSend.append("userStories", selectedFiles[i]);
            }

            for (let i = 0; i < selectedFiles.length; i++) {
                formDataToSend.append("productBacklog", selectedFiles[i]);
            }
         

        
            await axios.post('http://localhost:3000/api/ProductOwners/create-Project', formDataToSend);
          
            
            setIsModal(false);
            toast.success("Projet créé avec succès !");
        } catch (error) {
            console.error('Erreur lors de la création du projet :', error.response.data.message);
            toast.error("Erreur lors de la création du projet : " + error.response.data.message);
        }
    };
    const [filteredProjects, setFilteredProjects] = useState({
        all: [],
        toDo: [],
        inProgress: [],
        completed: []
    });

    


    useEffect(() => {
        if (projects) {
            filterProjects(projects, setFilteredProjects);
        }
    }, [projects]);
    
    
    const handleDeliver = async (projectId) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/ProductOwners/isDelivered/${projectId}`);
            
            if (response.status === 200) {
                // Mise à jour de l'état du projet après la livraison
                const updatedProjects = projects.map(project => {
                    if (project._id === projectId) {
                        return { ...project, delivered: true };
                    }
                    return project;
                });
    
                setProjects(updatedProjects);
                toast.success("Projet livré avec succès !");
               
            }
        } catch (error) {
            console.error('Erreur lors de la livraison du projet :', error.response.data.message);
            toast.error("Erreur lors de la livraison du projet : " + error.response.data.message);
        }
    };
    
    if (!teams || teams.length === 0) {
        return <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
        <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
          <video
            width="260"
            height="260"
            preload="none"
            style={{
              background: 'transparent',
              backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/14164/14164931.png)',
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
            <source src="https://cdn-icons-mp4.flaticon.com/512/14164/14164931.mp4" type="video/mp4" />
          </video>
          <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Teams Found</h3>
          <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like You didint Create Team yet. </p>
        
        </div>
      </div>;
      }

    return (
        <div className="container-xxl">
            <ToastContainer></ToastContainer>
            <Tab.Container defaultActiveKey="All">
                <PageHeader headerTitle="Projects"
                    renderRight={() => {
                        return <div className="d-flex py-2 project-tab flex-wrap w-sm-100">
                            <button type="button" className="btn btn-dark w-sm-100" onClick={() => { handleModalOpen("create"); setModalHeader("Create Project") }}><i className="icofont-plus-circle me-2 fs-6"></i>Create Project</button>
                            <Nav variant="pills" className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100">
                            <Nav.Item>
    <Nav.Link eventKey="All">All</Nav.Link>
</Nav.Item>
<Nav.Item>
    <Nav.Link eventKey="Started">To Do</Nav.Link>
</Nav.Item>
<Nav.Item>
    <Nav.Link eventKey="Approval">In Progress</Nav.Link>
</Nav.Item>
<Nav.Item>
    <Nav.Link eventKey="Completed">Completed</Nav.Link>
</Nav.Item>

                            </Nav>
                        </div>
                    }} />
                <div className="row align-items-center">
                    <div className="col-lg-12 col-md-12 flex-column">
                    <Tab.Content>

                        
    <Tab.Pane eventKey="All">
        {filteredProjects.all.length === 0 ? (
      
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
                <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
                  <video
                    width="260"
                    height="260"
                    preload="none"
                    style={{
                      background: 'transparent',
                      backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/14447/14447591.png)',
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
                    <source src="https://cdn-icons-mp4.flaticon.com/512/14447/14447591.mp4" type="video/mp4" />
                  </video>
                  <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Project Found</h3>
                  <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Project Created yet. </p>
                
                </div>
              </div>
          
        
        ) : (
            <div className="row g-3 gy-5 py-3 row-deck">
                {filteredProjects.all.map((project, index) => (
                    <div key={index} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <CurrenTProject  
                            ProjectType={project.projectCategory}
                            noSprint={project.sprints.length}
                            ProjectMembres={project.projectAssignedTeams.numberOfMembers}
                            TeamName={project.projectAssignedTeams.name}
                            ProjectName={project.projectName}
                            Delivered={project.Delivered }
                            ClientName={project.ClientName}
                            onClickDeliver={() => handleDeliver(project._id)}
                            onClickEdit={() => handleModalOpen("edit", project)}
                            onClickDelete={() => { setDeleteModal(true); setEditModeldata(project._id); }}
                            onClickAdd={() => { setAddUserModal(true) }}
                            budget={project.budget}
                            progres={project.progress}
                            priority={project.priority}
                            startDate={project.projectStartDate}
                            endDate={project.projectEndDate}
                        />
                    </div>
                ))}
            </div>
        )}
    </Tab.Pane>
    <Tab.Pane eventKey="Started">
        {filteredProjects.toDo.length === 0 ? (
             <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
             <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
               <video
                 width="260"
                 height="260"
                 preload="none"
                 style={{
                   background: 'transparent',
                   backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/12146/12146104.png)',
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
                 <source src="https://cdn-icons-mp4.flaticon.com/512/12146/12146104.mp4" type="video/mp4" />
               </video>
               <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Tickets Found</h3>
               <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Tickets Created yet. </p>
             
             </div>
           </div>
        ) : (
            <div className="row g-3 gy-5 py-3 row-deck">
                {filteredProjects.toDo.map((project, index) => (
                    <div key={index} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <CurrenTProject  
                            ProjectType={project.projectCategory}
                            noSprint={project.sprints.length}
                            ProjectMembres={project.projectAssignedTeams.numberOfMembers}
                            TeamName={project.projectAssignedTeams.name}
                            ProjectName={project.projectName}
                            onClickDeliver={() => handleDeliver(project._id)}
                            onClickEdit={() => handleModalOpen("edit", project)}
                            onClickDelete={() => { setDeleteModal(true); setEditModeldata(project._id); }}
                            onClickAdd={() => { setAddUserModal(true) }}
                            progres={project.progress}
                            budget={project.budget}
                            priority={project.priority}
                            startDate={project.projectStartDate}
                            endDate={project.projectEndDate}
                        />
                    </div>
                ))}
            </div>
        )}
    </Tab.Pane>
    <Tab.Pane eventKey="Approval">
        {filteredProjects.inProgress.length === 0 ? (
             <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
             <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
               <video
                 width="260"
                 height="260"
                 preload="none"
                 style={{
                   background: 'transparent',
                   backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/15700/15700517.png)',
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
                 <source src="https://cdn-icons-mp4.flaticon.com/512/15700/15700517.mp4" type="video/mp4" />
               </video>
               <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Tickets Found</h3>
               <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Tickets Created yet. </p>
             
             </div>
           </div>
        ) : (
            <div className="row g-3 gy-5 py-3 row-deck">
                {filteredProjects.inProgress.map((project, index) => (
                    <div key={index} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <CurrenTProject  
                            ProjectType={project.projectCategory}
                            noSprint={project.sprints.length}
                            ProjectMembres={project.projectAssignedTeams.numberOfMembers}
                            TeamName={project.projectAssignedTeams.name}
                            ProjectName={project.projectName}
                            progres={project.progress}
                            onClickEdit={() => handleModalOpen("edit", project)}
                            onClickDelete={() => { setDeleteModal(true); setEditModeldata(project._id); }}
                            onClickAdd={() => { setAddUserModal(true) }}
                            budget={project.budget}
                            priority={project.priority}
                            startDate={project.projectStartDate}
                            endDate={project.projectEndDate}
                        />
                    </div>
                ))}
            </div>
        )}
    </Tab.Pane>
    <Tab.Pane eventKey="Completed">
        {filteredProjects.completed.length === 0 ? (
             <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
             <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
               <video
                 width="260"
                 height="260"
                 preload="none"
                 style={{
                   background: 'transparent',
                   backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/11614/11614839.png)',
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
                 <source src="https://cdn-icons-mp4.flaticon.com/512/11614/11614839.mp4" type="video/mp4" />
               </video>
               <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Tickets Found</h3>
               <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Tickets Created yet. </p>
             
             </div>
           </div>
        ) : (
            <div className="row g-3 gy-5 py-3 row-deck">
                {filteredProjects.completed.map((project, index) => (
                    <div key={index} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <CurrenTProject  
                            ProjectType={project.projectCategory}
                            noSprint={project.sprints.length}
                            progres={project.progress}
                            Delivered={project.Delivered}
                            onClickDeliver={() => handleDeliver(project._id)}
                            ProjectMembres={project.projectAssignedTeams.numberOfMembers}
                            TeamName={project.projectAssignedTeams.name}
                            ProjectName={project.projectName}
                            onClickEdit={() => handleModalOpen("edit", project)}
                            onClickDelete={() => { setDeleteModal(true); setEditModeldata(project._id); }}
                            onClickAdd={() => { setAddUserModal(true) }}
                            budget={project.budget}
                            priority={project.priority}
                            startDate={project.projectStartDate}
                            endDate={project.projectEndDate}
                        />
                    </div>
                ))}
            </div>
        )}
    </Tab.Pane>
</Tab.Content>

                    </div>
                </div>
            </Tab.Container>

            <Modal centered className="modal-lg" show={isModal} onHide={() => setIsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3 p-3 needs-validation">
                        <div className="col-md-6">
                            <label htmlFor="projectName" className="form-label">Project Name</label>
                            <input type="text" className="form-control" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="projectCategory" className="form-label">Project Category</label>
                            <select className="form-select" id="projectCategory" name="projectCategory" value={formData.projectCategory} onChange={handleChange} required>
                            <option value="">Sélectionnez un type de projet</option>
                            <option value="Web Development">Développement Web</option>
  <option value="UI/UX Design">Design UI/UX</option>
  <option value="App Development">Développement d'Applications</option>
  <option value="Quality Assurance">Assurance Qualité</option>
  <option value="Development">Développement</option>

  <option value="Backend Development">Développement Backend</option>
  <option value="Frontend Development">Développement Frontend</option>
  <option value="Software Testing">Test Logiciel</option>
  <option value="Marketing">Marketing</option>
  <option value="SEO">SEO</option>
  <option value="Mobile Application">Application Mobile</option>
  <option value="Internet of Things (IoT)">Internet des Objets (IoT)</option>
  <option value="Game Development">Développement de Jeux</option>
  <option value="Artificial Intelligence / Machine Learning">Intelligence Artificielle / Machine Learning</option>
  <option value="Data Analysis / Data Science">Analyse de Données / Data Science</option>
  <option value="Embedded Systems">Systèmes Embarqués</option>
  <option value="Blockchain / Cryptocurrencies">Blockchain / Cryptomonnaies</option>
  <option value="Cybersecurity">Cybersécurité</option>
 
</select>

                        </div>
                        <div className="col-md-6">
                            <label htmlFor="projectStartDate" className="form-label">Project Start Date</label>
                            <input type="date" className="form-control" id="projectStartDate" name="projectStartDate" min={new Date().toISOString().split('T')[0]} value={formData.projectStartDate} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="projectEndDate" className="form-label">Project End Date</label>
                            <input type="date" className="form-control" id="projectEndDate" name="projectEndDate"   min={formData.projectStartDate} value={formData.projectEndDate} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="projectAssignedTeams" className="form-label">Assigned Teams</label>
                            <select className="form-select" defaultValue={formData.projectAssignedTeams ? formData.projectAssignedTeams._id : ""} id="projectAssignedTeams" name="projectAssignedTeams" onChange={handleChange} required>
    <option>Sélectionnez Teams Assigned</option>
    {formData.isEdit ? (
        // Mode édition
        TeamsUpdate.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
        ))
    ) : (
        // Mode création
        TeamsCreate.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
        ))
    )}
</select>


                        </div>
                        <div className="col-md-6">
                            <label htmlFor="budget" className="form-label">Budget</label>
                            <input type="number" className="form-control" id="budget" name="budget" value={formData.budget} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
    <label htmlFor="priority" className="form-label">Priorité</label>
    <select className="form-select" id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
        <option value="">Sélectionnez la priorité</option>
        <option value="High">Haute</option>
        <option value="Medium">Moyenne</option>
        <option value="Low">Basse</option>
    </select>
</div>
<div className="col-md-6">
                            <label htmlFor="ClientName" className="form-label">ClientName</label>
                            <input type="Text" className="form-control" id="ClientName" name="ClientName" value={formData.ClientName} onChange={handleChange} required />
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="userStories" className="form-label">User Stories</label>
                            <input type="file" className="form-control" id="userStories" name="userStories" multiple onChange={handleFileChange} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="productBacklog" className="form-label">Product Backlog</label>
                            <input type="file" className="form-control" id="productBacklog" name="productBacklog" multiple onChange={handleFileChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={formData.isEdit ? () => handleUpdate(formData.projectAssignedTeams._id) : handleSubmit}>
  {formData.isEdit ? "Update Project" : "Create Project"}
</button>

                </Modal.Footer>
            </Modal>

            <Modal show={isDeleteModal} centered onHide={() => { setDeleteModal(false) }}>
    <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Delete Project</Modal.Title>
    </Modal.Header>
    <Modal.Body className="justify-content-center flex-column d-flex">
       <div className="d-flex justify-content-center">
            <video
                width="180"
                height="180"
                preload="none"
                style={{
                    background: 'transparent',
                    backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/11677/11677511.png)',
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
                <source src="https://cdn-icons-mp4.flaticon.com/512/11677/11677511.mp4" type="video/mp4" />
            </video>
        </div>
        <p className="mt-4 fs-5">You can only delete this Project  Permanently</p>
    </Modal.Body>
    <Modal.Footer>
    <button type="button" className="btn btn-secondary" onClick={() => setDeleteModal(false)}>Cancel</button>
                    <button type="button" className="btn btn-danger color-fff" onClick={() => handleDelete(editModeldata)}>Delete</button>
    </Modal.Footer>
</Modal>
            <AddNewUserModal show={isAddUserModal} onClose={() => { setAddUserModal(false) }} />
        </div>
    )
}

export default Projects;
