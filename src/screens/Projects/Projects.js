import React, { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import CurrenTProject from "../../components/Clients/CurrenTProject";
import AddNewUserModal from "../../components/common/AddNewUserModal";
import PageHeader from "../../components/common/PageHeader";
import axios from 'axios'; 
import { toast, ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css';

export const ProjectCardData = [];

function Projects(props) {
    const [isModal, setIsModal] = useState(false);
    const [isDeleteModal, setDeleteModal] = useState(false);
    const [isAddUserModal, setAddUserModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [editModeldata, setEditModeldata] = useState("");
    const [teams, setTeams] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [projects, setProjects] = useState([]);

    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ProductOwners/get-teams');
                setTeams(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes :' + error.response.data.message);
                toast.error("Erreur lors de la récupération des équipes." + error.response.data.message);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ProductOwners/get-Project', {
                    params: { emailPo: email }
                });
                setProjects(response.data);
                console.log(response.data);
                toast.success('ok');
            } catch (error) {
                console.error('Erreur lors de la récupération des projets :', error.response.data.message);
                toast.error("Erreur lors de la récupération des projets." + error.response.data.message);
            }
        };

        fetchProjects();
    }, [email]);

    const [formData, setFormData] = useState({
        projectName: "",
        projectCategory: "UI/UX Design",
        userStories: [],
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
    const handleDelete = async (projectId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/ProductOwners/delete-Project/${projectId}`);
            console.log(projectId);
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
            formDataToSend.append('projectCategory', formData.projectCategory);
            formDataToSend.append('projectStartDate', formData.projectStartDate);
            formDataToSend.append('projectEndDate', formData.projectEndDate);
            formDataToSend.append('projectAssignedTeams', formData.projectAssignedTeams);
            formDataToSend.append('budget', formData.budget);
            formDataToSend.append('priority', formData.priority);
            formDataToSend.append('description', formData.description);
          
            // Ajoutez également d'autres données si nécessaire
    
            const response = await axios.put(`http://localhost:3000/api/ProductOwners/update-Project/${formData.projectId}`, formDataToSend);
            if (response.status === 200) {
                // Mise à jour de l'état des projets après la mise à jour réussie
                const updatedProjects = projects.map(project => {
                    if (project._id === formData.projectId) {
                        console.log(project.projectAssignedTeams);
                        return { ...project, ...formData };
                       
                    }
                    return project;
                });
               
                setProjects(updatedProjects);
                setIsModal(false);
                toast.success("Projet mis à jour avec succès !");
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du projet :', error.response.data.message);
            toast.error("Erreur lors de la mise à jour du projet : " + error.response.data.message);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "projectAssignedTeams") {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };
    
    const handleFileChange = (e) => {
        const files = e.target.files;
        setSelectedFiles(files);
    };

    const handleModalOpen = (mode, data = {}) => {
        if (mode === "create") {
            setFormData({
                projectName: "",
                projectCategory: "UI/UX Design",
                userStories: [],
                productBacklog: [],
                projectStartDate: new Date().toISOString().split('T')[0],
                projectEndDate: new Date().toISOString().split('T')[0],
                projectAssignedTeams: "",
                budget: 0,
                priority: "",
                description: "",
                isEdit: false
            });
        } else if (mode === "edit") {
            setFormData({
                projectName: data.projectName || "",
                projectCategory: data.projectCategory || "UI/UX Design",
                userStories: [],
                productBacklog: [],
                projectStartDate: data.projectStartDate || new Date().toISOString().split('T')[0],
                projectEndDate: data.projectEndDate || new Date().toISOString().split('T')[0],
                projectAssignedTeams: data.projectAssignedTeams || "",
                budget: data.budget || 0,
                priority: data.priority || "",
                description: data.description || "",
                isEdit: true,
                projectId: data._id
            });
        }
        setIsModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("projectName", formData.projectName);
            formDataToSend.append("projectCategory", formData.projectCategory);
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

            const response = await axios.post('http://localhost:3000/api/ProductOwners/create-Project', formDataToSend);
         
            console.log(response.data);
            setIsModal(false);
            toast.success("Projet créé avec succès !");
        } catch (error) {
            console.error('Erreur lors de la création du projet :', error.response.data.message);
            toast.error("Erreur lors de la création du projet : " + error.response.data.message);
        }
    };

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
                                    <Nav.Link eventKey="Started">Started</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Approval">Approval</Nav.Link>
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
                                <div className="row g-3 gy-5 py-3 row-deck">
                                {projects.map((project, index) => (
    <div key={index} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
        <CurrenTProject  
            ProjectType={project.projectCategory}
            ProjectMembres ={project.projectAssignedTeams.numberOfMembers}
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
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </div>
            </Tab.Container>
            <Modal show={isModal} onHide={() => setIsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <div className="mb-3">
            <label htmlFor="projectName" className="form-label">Project Name</label>
            <input 
                type="text" 
                className="form-control" 
                id="projectName" 
                placeholder="Enter Project Name" 
                value={formData.projectName} 
                onChange={handleChange} 
                name="projectName" 
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Project Category</label>
            <select className="form-select" value={formData.projectCategory} onChange={handleChange} name="projectCategory">
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Website Design">Website Design</option>
                <option value="App Development">App Development</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Development">Development</option>
                <option value="Mobile">Mobile app</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Frontend Developement">Frontend Development</option>
                <option value="Software Testing">Software Testing</option>
                <option value="Marketing">Marketing</option>
                <option value="SEO">SEO</option>
           
            </select>
        </div>
        {!formData.isEdit && (
            <>
                <div className="mb-3">
                    <label htmlFor="userStories" className="form-label">User Stories</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="userStories" 
                        multiple 
                        onChange={handleFileChange} 
                        name="userStories" 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="productBacklog" className="form-label">Product Backlog</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="productBacklog" 
                        multiple 
                        onChange={handleFileChange} 
                        name="productBacklog" 
                    />
                </div>
            </>
        )}
<div className="deadline-form">
                    <form>
                        <div className="row g-3 mb-3">
                            <div className="col">
                                <label htmlFor="datepickerded" className="form-label">Project Start Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="datepickerded" 
                                    value={formData.projectStartDate} 
                                    min={new Date().toISOString().substr(0, 10)} // Minimum start date is today
                                    onChange={(e) => setFormData({ ...formData, projectStartDate: e.target.value })} 
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="datepickerdedone" className="form-label">Project End Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="datepickerdedone" 
                                    value={formData.projectEndDate} 
                                    min={formData.projectStartDate || new Date().toISOString().substr(0, 10)} // Minimum end date is the selected start date or today
                                    onChange={(e) => setFormData({ ...formData, projectEndDate: e.target.value })} 
                                />
                            </div>
                </div>
                <div className="row g-3 mb-3">
                <div className="col-sm-12">
    <label htmlFor="formFileMultipleone" className="form-label">Task Assign Teams</label>
    <select 
        className="form-select" 
        value={formData.projectAssignedTeams} 
        onChange={(e) => setFormData({ ...formData, projectAssignedTeams: e.target.value })} 
        name="projectAssignedTeams"
    >
        <option value="">Select Team</option>
        {teams.map((team) => (
            <option key={team._id} value={team._id}>{team.name}</option>
        ))}
    </select>
</div>

                </div>
            </form>
        </div>
        <div className="row g-3 mb-3">
            <div className="col-sm">
                <label htmlFor="formFileMultipleone" className="form-label">Budget</label>
                <input 
                    type="number" 
                    className="form-control" 
                    onChange={handleChange} 
                    name="budget" 
                    value={formData.budget} 
                />
            </div>
            <div className="col-sm">
                <label htmlFor="formFileMultipleone" className="form-label">Priority</label>
                <select 
                    className="form-select" 
                    onChange={handleChange} 
                    name="priority" 
                    value={formData.priority}
                >
                    <option value="Highest">Highest</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Lowest">Lowest</option>
                </select>
            </div>
        </div>
        <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea78" className="form-label">Description (optional)</label>
            <textarea 
                className="form-control" 
                id="exampleFormControlTextarea78" 
                rows="3" 
                placeholder="Add any extra details about the request" 
                onChange={handleChange} 
                name="description"
                value={formData.description}
            ></textarea>
        </div>
        </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => { setIsModal(false); setEditModeldata(""); }}>Done</button>
                    <button type="button" onClick={formData.isEdit ? handleUpdate : handleSubmit} className="btn btn-primary">{formData.isEdit ? "Update" : "Create"}</button>

                </Modal.Footer>
            </Modal>
            <Modal show={isDeleteModal} centered onHide={() => { setDeleteModal(false) }}>
    <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Delete Project</Modal.Title>
    </Modal.Header>
    <Modal.Body className="justify-content-center flex-column d-flex">
        <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
        <p className="mt-4 fs-5 text-center">You can only delete this item Permanently</p>
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
