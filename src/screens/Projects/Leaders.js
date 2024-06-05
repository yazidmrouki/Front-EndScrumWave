import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddMembres from './AddMembres';
import PageHeader from '../../components/common/PageHeader';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Modal.css';
function Leaders() {
  const [rows, setRows] = useState([]);
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const email = localStorage.getItem('email');
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModal3, setIsModal3] = useState(false);
  const [isUpdateUserModal, setIsUpdateUserModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
   
    productOwnerEmail: email,
    scrumMasterEmail: "",
    developerEmails: "",
    workType: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/ProductOwners/create-team", formData)
   
      .then((response) => {
        console.log('Team created successfully:', response.data);
      setShowCreateTeamModal(false);
      toast.success('Team created successfully');
      window.location.reload();
        // Vous pouvez ajouter du code pour actualiser les données du tableau si nécessaire
      })
      .catch((error) => {
        console.log(formData);
        console.error('Error creating team:', error);
        toast.error('Error creating team: ' + error.response.data.message);
      });
  };

  const handleDeleteTeam = (teamId) => {
    setTeamToDelete(teamId);
    setDeleteModal(true);
  };
  
  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;
  
    try {
      const response = await axios.delete(`http://localhost:3000/api/ProductOwners/delete-team/${teamToDelete}`);
      console.log('Team deleted successfully');
      toast.success('Team deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Error deleting team');
    } finally {
      setDeleteModal(false);
      setTeamToDelete(null);
    }
  };
  

  const handleRowClicked = (row) => {
    setSelectedTeam(row);
    setIsModal3(true);
  };

  
  
  const handleUpdateTeam = () => {
    axios
      .put(`http://localhost:3000/api/ProductOwners/update-team/${selectedTeam.id}`, {
        name: formData.teamName,
        workType: formData.workType,
      })
      .then((response) => {
        console.log('Team updated successfully:', response.data);
        setIsUpdateUserModal(false);
        toast.success('Team updated successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating team:', error);
        toast.error('Error updating team');
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/ProductOwners/get-teams/${email}`)
      .then((response) => {
        setRows(
          response.data.map((team) => ({
            id: team._id,
            teamName: team.name,
            leadername: team.productOwner.nom,
            image: `http://localhost:3000/api/ProductOwners/get-profile-photo/${team.productOwner.email}`,
            project: team.projects && team.projects.length > 0 
      ? team.projects.map(project => project.projectName).join(',') 
      : 'No Project Found',
            totaltask: team.totalProjects,
            email: team.productOwner.email,
            assignedstaff: [
              ...team.developer.map((dev) => `http://localhost:3000/api/Devellopeurs/get-profile-photo/${dev.email}`),
              `http://localhost:3000/api/ScrumMasters/get-profile-photo/${team.scrumMaster.email}`,
            ],
            typeWork: team.workType,
          }))
        );console.log(response.data);
      } )
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });
  }, []);
  
  const LeadersListData = {
    title: 'Teams List',
    columns: [
      {
        name: 'Team Name',
        selector: (row) => row.teamName,
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Product Owner Name',
        selector: (row) => row.leadername,
        sortable: true,
        cell: (row) => (
          <div className="d-flex align-items-center">
            <img className="avatar rounded-circle me-2" src={row.image} alt="" style={{ width: '40px', height: '40px' }} />{' '}
            <span className="fw-bold">{row.leadername}</span>
          </div>
        ),
        minWidth: '250px',
      },
      {
        name: 'Project',
        selector: (row) => row.project,
        sortable: true,
        minWidth: '200px',
      },
      {
        name: 'Total Projects',
        selector: (row) => row.totaltask,
        sortable: true,
        minWidth: '150px',
      },
      {
        name: 'Assigned Staff',
        selector: () => { },
        sortable: true,
        cell: (row) => (
          <div className="avatar-list avatar-list-stacked">
            {row.assignedstaff.map((d, i) => (
              <img key={'staff-' + i} className="avatar rounded-circle sm" src={d} alt="" style={{ width: '30px', height: '30px' }} />
            ))}
            <span className="avatar rounded-circle text-center pointer sm add-icon">
              <i className="icofont-ui-add"></i>
            </span>
          </div>
        ),
        minWidth: '250px',
      },
      {
        name: 'Product Owner Email',
        selector: (row) => row.email,
        sortable: true,
        minWidth: '200px',
      },
      {
        name: 'Type Team',
        selector: (row) => row.typeWork,
        sortable: true,
        cell: (row) => <span className="badge bg-success">{row.typeWork}</span>,
        minWidth: '150px',
      },
    ],
  };
  


  return (
<div className="container-xxl">
  <ToastContainer />
  <PageHeader
    headerTitle="Teams"
    renderRight={() => (
      <div className="d-flex py-2 project-tab flex-wrap">
        <Button variant="dark" className="w-100" onClick={() => setShowCreateTeamModal(true)}>
          <i className="icofont-plus-circle me-2 fs-6"></i>Create Teams
        </Button>
      </div>
    )}
  />
  {rows&& rows.length > 0 ? (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <DataTable
              title="Teams List"
              columns={LeadersListData.columns}
              data={rows}
              defaultSortField="teamName"
              pagination
              selectableRows={false}
              highlightOnHover
              onRowClicked={handleRowClicked}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
   
 <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
      <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
        <video
          width="300"
          height="300"
          preload="none"
          style={{
            background: 'transparent',
            backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/14256/14256589.png)',
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
          <source src="https://cdn-icons-mp4.flaticon.com/512/14256/14256589.mp4" type="video/mp4" />
        </video>
        <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Teams Was Created</h3>
        <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like You didint Create Team yet. </p>
      
      </div>
    </div>

  )}


      <Modal show={showCreateTeamModal} onHide={() => setShowCreateTeamModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTeamName">
              <Form.Label>Team Name</Form.Label>
              <Form.Control type="text" placeholder="Enter team name" name="name" onChange={handleFormChange} />
            </Form.Group>
           
            <Form.Group controlId="formProductOwnerEmail">
              <Form.Label>Product Owner Email</Form.Label>
            <Form.Control type="email" placeholder="Enter Product Owner email" name="productOwnerEmail" value={email} onChange={handleFormChange} readOnly />

            </Form.Group>
            <Form.Group controlId="formScrumMasterEmail">
              <Form.Label>Scrum Master Email</Form.Label>
              <Form.Control type="email" placeholder="Enter Scrum Master email" name="scrumMasterEmail" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group controlId="formDeveloperEmails">
              <Form.Label>Developer Emails</Form.Label>
              <Form.Control type="text" placeholder="Enter developer emails separated by commas" name="developerEmails" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group controlId="formWorkType">
              <Form.Label>Work Type</Form.Label>
              <Form.Control as="select" name="workType" onChange={handleFormChange}>
                <option value="">Select work type</option>
                <option value="Web">Web</option>
                <option value="AI">AI</option>
                <option value="BI">BI</option>
                <option value="CyberSecurity">CyberSecurity</option>
                <option value="SE">SE</option>
                <option value="Gaming">Gaming</option>
                <option value="IOT">IOT</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary  mb-3"  style={{ marginTop: "20px" }} type="submit">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>



      <Modal show={isModal3} size="lg" onHide={() => setIsModal3(false)} centered>
  <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
    <Modal.Title style={{ color: '#333', fontWeight: 'bold' }}>Team Details</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ padding: '2rem' }}>
    <div className="modal-card-container">
      <div className="modal-card modal-card-primary">
        <video
           width="90"
           height="90"
          preload="none"
          style={{
            background: 'transparent',
            backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/11919/11919480.png)',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem', // Ajout de marge en bas
          }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn-icons-mp4.flaticon.com/512/11919/11919480.mp4" type="video/mp4" />
        </video>
        {/* Contenu de la première colonne (Add Employee) */}
        <Button variant="primary" onClick={() => setIsAddUserModal(true)}>Add Employee</Button>
      </div>
      <div className="modal-card modal-card-secondary">
      <video
           width="90"
           height="90"
          preload="none"
          style={{
            background: 'transparent',
            backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/16275/16275743.png)',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem', // Ajout de marge en bas
          }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn-icons-mp4.flaticon.com/512/16275/16275743.mp4" type="video/mp4" />
        </video>
        {/* Contenu de la deuxième colonne (Edit Team) */}
        <Button variant="warning" onClick={() => setIsUpdateUserModal(true)}>Update Team</Button>
      </div>
      <div className="modal-card modal-card-danger">
        <video
          width="90"
          height="90"
          preload="none"
          style={{
            background: 'transparent',
            backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/12134/12134200.png)',
            backgroundPosition: '50% 50%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem', // Ajout de marge en bas
          }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn-icons-mp4.flaticon.com/512/12134/12134200.mp4" type="video/mp4" />
        </video>
        {/* Contenu de la troisième colonne (Delete Team) */}
        <Button variant="danger" onClick={() => handleDeleteTeam(selectedTeam.id)}>Delete Team</Button>

      </div>
    </div>
    {/* Ajoutez ici les détails de l'équipe, tels que le nom, le type de travail, etc. */}
  </Modal.Body>
</Modal>



      <Modal show={isUpdateUserModal} onHide={() => setIsUpdateUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="updateTeamName">
              <Form.Label>Name Teams</Form.Label>
              <Form.Control type="text" placeholder="Enter team name" value={formData.teamName} onChange={(e) => setFormData({ ...formData, teamName: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="updateWorkType">
              <Form.Label>TypeWork</Form.Label>
              <Form.Control as="select" value={formData.workType} onChange={(e) => setFormData({ ...formData, workType: e.target.value })}>
                <option value="">Select work type</option>
                <option value="Web">Web</option>
                <option value="AI">AI</option>
                <option value="BI">BI</option>
                <option value="CyberSecurity">CyberSecurity</option>
                <option value="SE">SE</option>
                <option value="Gaming">Gaming</option>
                <option value="IOT">IOT</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsUpdateUserModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateTeam}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      <AddMembres show={isAddUserModal} onClose={() => setIsAddUserModal(false)} teamId={selectedTeam ? selectedTeam.id : null} />



      <Modal show={isDeleteModal} centered onHide={() => setDeleteModal(false)}>
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
    <p className="mt-4 fs-5">You can only delete this Project Permanently</p>
  </Modal.Body>
  <Modal.Footer>
    <button type="button" className="btn btn-secondary" onClick={() => setDeleteModal(false)}>Cancel</button>
    <button type="button" className="btn btn-danger" onClick={confirmDeleteTeam}>Delete</button>
  </Modal.Footer>
</Modal>



    </div>
  );
}

export default Leaders;
