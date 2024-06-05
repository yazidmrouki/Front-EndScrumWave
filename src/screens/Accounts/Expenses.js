import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Container, Row, Modal, Form, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import PageHeader from "../../components/common/PageHeader";

import moment from 'moment';
import 'moment-duration-format';
import './Datatable.css';
import TimeLeftCounter from './TimeLeftCounter';
import MeetingLinkCell from './MeetingLinkCell';
import { toast, ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css';
import { FaRegFrown } from 'react-icons/fa';

function Expenses() {
    const [isModal, setIsModal] = useState(false);
    const [dailyScrumData, setDailyScrumData] = useState([]);
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        startTime: '',
        meetingLink: ''
    });

    const [assignedProjects, setAssignedProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
 
    const teamId=localStorage.getItem('Assignedteam');
    const name=localStorage.getItem('name');
    const email=localStorage.getItem('email');
    
      
      
     console.log("hi"+teamId);
    const [isEditModal, setIsEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const handleEdit = (row) => {
        setEditItem(row);
        setIsEditModal(true);
    };

    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditItem({
          ...editItem,
          [name]: value
      });
  };
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
        if (!selectedProjectId || !editItem || !editItem._id) {
            console.error('Project ID or Edit Item ID not available');
            return;
        }

        const startTime = `${editItem.date}T${editItem.time}`;
        console.log('StartTime:', startTime);

        const updatedData = {
            dailyProgram: editItem.startTime || startTime,
            name,
            email,
            teamId
        };

        const response = await axios.put(`http://localhost:3000/api/scrumMasters/updatedailyscrum/${selectedProjectId}/${editItem._id}`, updatedData);

        setEditItem(null);
        setIsEditModal(false);
        setTimeout(function() {
            window.location.reload(); // Recharger la page
        }, 100);
      
    } catch (error) {
        console.error('Error updating DailyScrum:', error);
    }
};





const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('DailyScrum added:', selectedProjectId, formData.startTime, formData.meetingLink);
        if (selectedProjectId) {
            const response = await axios.post(`http://localhost:3000/api/scrumMasters/add-dailyscrum/${selectedProjectId}`, {
                dailyProgram: formData.startTime,
                name,
                email,
                teamId
            });

            setDailyScrumData([...dailyScrumData, response.data]);
            toast.success('Daily Scrum ajouté avec succès');
            setIsModal(false);
            setFormData({
                startTime: '',
                meetingLink: ''
            });
            setTimeout(function() {
                window.location.reload(); // Recharger la page
            }, 1);
        } else {
            toast.error('Erreur: aucun projet assigné sélectionné');
        }
    } catch (error) {
        toast.error(error.response.data);
        console.error('Erreur lors de l\'ajout du Daily Scrum :', error);
    }
};


const handleDelete = async (dailyScrumId) => {
    try {
        if (selectedProjectId) {
            await axios.delete(`http://localhost:3000/api/scrumMasters/delete-dailyscrum/${selectedProjectId}/${dailyScrumId}`, {
                data: {
                    name,
                    email,
                    teamId
                }
            });

            setDailyScrumData(dailyScrumData.filter(scrum => scrum._id !== dailyScrumId));
            setRows(rows.filter(row => row._id !== dailyScrumId));
            toast.success('Daily Scrum supprimé avec succès');
            setTimeout(function() {
                window.location.reload(); // Recharger la page
            }, 500);
        } else {
            toast.error('Erreur: aucun projet assigné sélectionné');
        }
    } catch (error) {
        toast.error('Erreur lors de la suppression du Daily Scrum');
        console.error('Erreur lors de la suppression du Daily Scrum :', error);
    }
};


    useEffect(() => {
      const fetchAssignedProjects = async () => {
          try {
              const response = await axios.get(`http://localhost:3000/api/scrumMasters/get-ProjectsAssigne/${teamId}`);
              setAssignedProjects(response.data);
              if (response.data.length > 0) {
                  setSelectedProjectId(response.data[0]._id);
              }
          } catch (error) {
              if (error.response) {
                  // La requête a été reçue, mais le serveur a répondu avec un code d'erreur
                  toast.warning(`Warning: ${error.response.data.message}`);
              } else if (error.request) {
                  // La requête a été effectuée, mais aucune réponse n'a été reçue
                  toast.error('Aucune réponse du serveur');
              } else {
                  // Une erreur s'est produite lors de la configuration de la requête
                  toast.error('Erreur de configuration de la requête'+error.message);
              }
          }
      };
  
      fetchAssignedProjects();
  }, [teamId]);
  

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value !== formData[name] ? value : prevFormData[name]
      }));
  };
  

  useEffect(() => {
    if (selectedProjectId) {
        axios.get(`http://localhost:3000/api/scrumMasters/get-daily/${selectedProjectId}`)
            .then((response) => {
                const sortedData = response.data.map((item) => {
                    const dailyMoment = moment(item.dailyProgram);
                    return {
                        date: dailyMoment.format('YYYY-MM-DD'),
                        time: dailyMoment.format('HH:mm'),
                        meetingLink: item.dailyUrl,
                        _id: item._id,
                        remainingTime: dailyMoment.diff(moment(), 'seconds'),
                        added: item.added,
                        annuler: item.annuler
                    };
                }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date décroissante
                
                setRows(sortedData);
            })
            .catch((error) => {
                console.warning('Error fetching Daily:', error);
            });
    }
}, [selectedProjectId]);


// ...



const columns = [
    {
        name: 'Date',
        selector: (row) => row.date,
        sortable: true,
        sortFunction: (a, b) => new Date(b.date) - new Date(a.date),
        minWidth: '150px',
        cell: (row) => <div className="date-cell">{row.date}</div>,
    },


    {
        name: 'Time',
        selector: (row) => row.time,
        sortable: true,
        minWidth: '150px',
        cell: (row) => <div className="time-cell">{row.time}</div>,
    },
    {
        name: 'Meeting Link',
        selector: (row) => row,
        sortable: true,
        minWidth: '200px',
        cell: (row) => <MeetingLinkCell row={row} />,
    },
    {
        name: 'Time Left',
        selector: (row) => row.remainingTime,
        sortable: true,
        minWidth: '150px',
        cell: (row) => (
            <TimeLeftCounter remainingTime={row.remainingTime} projectId={selectedProjectId} scrumId={row._id} added={row.added} />
        ),
    },
    {
        name: 'Actions',
        selector: (row) => row._id,
        cell: (row) => (
            <div className="btn-group" role="group" aria-label="Actions">
                {row.annuler ? (
                    <span className="no-action">No action remaining</span>
                ) : (
                    <>
                        <button className="btn btn-sm btn-primary me-2 action-btn" onClick={() => handleEdit(row)}>
                            <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button className="btn btn-sm btn-danger action-btn" onClick={() => handleDelete(row._id)}>
                            <i className="bi bi-trash"></i> Delete
                        </button>
                    </>
                )}
            </div>
        ),
        minWidth: '150px',
    },
    
    {
        name: 'Status',
        selector: (row) => row._id,
        cell: (row) => (
            <div className={`status-cell ${row.annuler ? 'status-reported' : (row.added ? 'status-complete' : 'status-pending')}`}>
                {row.annuler ? 'Reported' : (row.added ? 'Complete' : 'Daily Coming Soon')}
            </div>
        ),
        minWidth: '150px',
    }
];

   
      return (
        assignedProjects.length > 0 ? (
          <Container>
              <PageHeader
                  headerTitle="DailyScrum"
                  renderRight={() => (
                      <Button variant="dark" onClick={() => setIsModal(true)}>
                          <i className="icofont-plus-circle me-2 fs-6"></i> Programmer Daily Scrum
                      </Button>
                  )}
              />
              <ToastContainer></ToastContainer>
              <Row className="mt-4">
                  <div className="col-sm-12">
                      <DataTable
                          columns={columns}
                          data={rows}
                          defaultSortField="date"
                          defaultSortAsc={false} // Définir l'ordre de tri par défaut sur décroissant
                          pagination
                          selectableRows={false}
                          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                          highlightOnHover={true}
                      />
                  </div>
              </Row>

              <Modal show={isModal} onHide={() => setIsModal(false)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Programmer Daily Scrum</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleSubmit}>
                      <Modal.Body>
                          <Form.Group className="mb-3" controlId="formStartTime">
                              <Form.Label>Start Time</Form.Label>
                              <Form.Control
                                  type="datetime-local"
                                  name="startTime"
                                  value={formData.startTime}
                                  onChange={handleChange}
                                  required
                              />
                          </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={() => setIsModal(false)}>
                              Close
                          </Button>
                          <Button variant="primary" type="submit">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Form>
              </Modal>

              <Modal show={isEditModal} onHide={() => setIsEditModal(false)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Edit Daily Scrum</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleEditSubmit}>
                      <Modal.Body>
                          <Form.Group className="mb-3" controlId="formStartTime">
                              <Form.Label>Start Time</Form.Label>
                              <Form.Control
                                  type="datetime-local"
                                  name="startTime"
                                  value={editItem ? moment(editItem.startTime).format('YYYY-MM-DDTHH:mm') : ''}
                                  onChange={handleEditChange}
                                  required
                              />
                          </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={() => setIsEditModal(false)}>
                              Close
                          </Button>
                          <Button variant="primary" type="submit">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Form>
              </Modal>
          </Container>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '90vh', backgroundColor: '#f8f9fa' }}>
        <FaRegFrown size={64} color="#6c757d" className="mb-4 animate__animated animate__bounceIn" />
        <h3 className="text-secondary mb-3">No Project Found</h3>
        <p className="text-muted mb-4">It seems like you don't have any Project yet. Contact Your ProductOwners if there is any problemes !</p>
      
        <ToastContainer />
    </div>
      )
  );
}

export default Expenses;
