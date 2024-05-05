import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import AddMembres from './AddMembres';
import PageHeader from '../../components/common/PageHeader';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Leaders() {
  const [rows, setRows] = useState([]);
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const email = localStorage.getItem('email');

  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModal3, setIsModal3] = useState(false);
  const [isUpdateUserModal, setIsUpdateUserModal] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    project: [],
    productOwnerEmail: "",
    scrumMasterEmail: "",
    developerEmails: [],
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
        console.error('Error creating team:', error);
        toast.error('Error creating team: ' + error.response.data.message);
      });
  };


  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this team?');
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`http://localhost:3000/api/ProductOwners/delete-team/${teamId}`);
      console.log('Team deleted successfully');
      toast.success('Team deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Error deleting team');
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
      .get('http://localhost:3000/api/ProductOwners/get-teams')
      .then((response) => {
        setRows(
          response.data.map((team) => ({
            id: team._id,
            teamName: team.name,
            leadername: team.productOwner.nom,
            image: `http://localhost:3000/api/ProductOwners/get-profile-photo/${team.productOwner.email}`,
            project: team.Project,
            totaltask: team.TolalProject,
            email: team.productOwner.email,
            assignedstaff: [
              ...team.developer.map((dev) => `http://localhost:3000/api/Devellopeurs/get-profile-photo/${dev.email}`),
              `http://localhost:3000/api/ScrumMasters/get-profile-photo/${team.scrumMaster.email}`,
            ],
            typeWork: team.workType,
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });
  }, []);

  return (
    <div className="container-xxl">
      <ToastContainer />
      <PageHeader
        headerTitle="Teams"
        renderRight={() => (
          <div className="d-flex py-2 project-tab flex-wrap w-sm-100">
            <button type="button" className="btn btn-dark w-sm-100" onClick={() => setShowCreateTeamModal(true)}>
              <i className="icofont-plus-circle me-2 fs-6"></i>Create Teams
            </button>
          </div>
        )}
      />
      <div className="row clearfix g-3">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <DataTable
                title="Teams List"
                columns={LeadersListData.columns}
                data={rows}
                defaultSortField="title"
                pagination
                selectableRows={false}
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
                onRowClicked={handleRowClicked}
              />
            </div>
          </div>
        </div>
      </div>
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
            <Form.Group controlId="formProject">
              <Form.Label>Project</Form.Label>
              <Form.Control type="text" placeholder="Enter projects separated by commas" name="project" onChange={handleFormChange} />
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
            <Button variant="primary" type="submit">
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
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <Button variant="primary" onClick={() => setIsAddUserModal(true)}>Add Employee</Button>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="warning" onClick={() => setIsUpdateUserModal(true)}>Update Team</Button>
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

    </div>
  );
}

const LeadersListData = {
  title: 'Teams List',
  columns: [
    {
      name: 'TeamName',
      selector: (row) => row.teamName,
      sortable: true,
    },
    {
      name: 'LEADER NAME (ProductOwner)',
      selector: (row) => row.leadername,
      sortable: true,
      cell: (row) => (
        <div>
          <img className="avatar rounded-circle" src={row.image} alt="" />{' '}
          <span className="fw-bold ms-1">{row.leadername}</span>
        </div>
      ),
      minWidth: '250px',
    },
    {
      name: 'PROJECT',
      selector: (row) => row.project,
      sortable: true,
    },
    {
      name: 'TOTAL Project',
      selector: (row) => row.totaltask,
      sortable: true,
    },
    {
      name: 'ASSIGNED STAFF',
      selector: () => { },
      sortable: true,
      cell: (row) => {
        return (
          <div className="avatar-list avatar-list-stacked px-3">
            {row.assignedstaff.map((d, i) => (
              <img key={'fibd' + i} className="avatar rounded-circle sm" src={d} alt="" />
            ))}
            <span className="avatar rounded-circle text-center pointer sm">
              <i className="icofont-ui-add"></i>
            </span>
          </div>
        );
      },
    },
    {
      name: 'Leader EMAIL (ProductOwner)',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'TypeTeam',
      selector: (row) => row.typeWork,
      sortable: true,
      cell: (row) => <span className="badge bg-success">{row.typeWork}</span>,
    },
  ],
  rows: [
    {
      teamName:'',
      leadername: '',
      image: null,
      project: '',
      totaltask: '',
      email: '',
      assignedstaff: [],
      typeWork: '',
    },
  ],
};

export default Leaders;
