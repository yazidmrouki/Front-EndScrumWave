import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketStatus from './TicketStatus'; // Importez la composante TicketStatus contenant le graphique
import './ticketStatus.css';
function TicketView() {
  const emailPo = localStorage.getItem('email');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjectNamesIds = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/projects/names-ids/${emailPo}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching project names and IDs:', error);
      }
    };

    if (emailPo) {
      fetchProjectNamesIds();
    }
  }, [emailPo]);

  useEffect(() => {
    if (selectedProjectId) {
      const fetchProjectDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/ProductOwners/product-projects/${selectedProjectId}`);
          setSelectedProject(response.data);
        } catch (error) {
          console.error('Error fetching project details:', error);
        }
      };
      fetchProjectDetails();
    }
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
  };

  
return (
  
      <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Ticket Status</h6>
  
     
          <select className="custom-select" onChange={handleProjectChange} value={selectedProjectId}>
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.projectName}
              </option>
            ))}
          </select>
       
    </div>
    <div className="card-body">
      <div id="annualAttendanceChart" style={{ position: 'relative' }}>
 
        {selectedProjectId && selectedProject ? (
          <TicketStatus projectData={selectedProject} />
        ) : (
          
            <div style={{
                position: 'relative',
                width: '250px', // Adjust the size as needed
                height: '250px', // Adjust the size as needed
                borderRadius: '50%', // Make it circular
                overflow: 'hidden', // Hide overflow for circular shape
                display: 'inline-block', // Ensure it behaves like an inline element
                verticalAlign: 'middle' // Align it vertically in the middle
            }}>
                <video 
                    autoPlay 
                    loop 
                    muted 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover' // Ensure video fills the circular container
                    }}>
                    <source src="https://cdn-icons-mp4.flaticon.com/512/15578/15578497.mp4" type="video/mp4" />
                </video>
            </div>
        )}
      </div>
    </div>
  </div>
);

      
  
  

}

export default TicketView;
