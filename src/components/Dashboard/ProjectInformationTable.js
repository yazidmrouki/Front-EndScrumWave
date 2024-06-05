import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './ProjectInformationTable.css'; // Assurez-vous d'importer le fichier CSS pour le style



function ProjectInformationTable() {
  const [projects, setProjects] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Projects/${email}`);
        const fetchedProjects = response.data || [];
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [email]);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Haute':
        return 'bg-danger';
      case 'Moyenne':
        return 'bg-warning';
      case 'Basse':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold">Project Information</h6>
        </div>
      </div>
      <div className="card-body">
        <div id="myProjectTable_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
          <div className="row">
            <div className="col-sm-12">
              <div className="table-responsive">
                <table
                  id="myProjectTable"
                  className="table table-hover align-middle mb-0 nowrap dataTable no-footer dtr-inline"
                  role="grid"
                  aria-describedby="myProjectTable_info"
                >
                  <thead>
                    <tr role="row">
                      <th className="sorting_asc" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-sort="ascending" aria-label="Title: activate to sort column descending">Title</th>
                      <th className="sorting" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-label="Date Start: activate to sort column ascending">Date Start</th>
                      <th className="sorting" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-label="Deadline: activate to sort column ascending">Deadline</th>
                      <th className="dt-body-right sorting" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-label="Leader: activate to sort column ascending">Leader</th>
                      <th className="sorting" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-label="Completion: activate to sort column ascending">Completion</th>
                      <th className="dt-body-right sorting" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-label="Stage: activate to sort column ascending">Stage</th>
                      <th className="sorting" tabIndex="0" aria-controls="myProjectTable" rowSpan="1" colSpan="1" aria-label="Number of Members: activate to sort column ascending">Team Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={project._id} role="row" className="odd">
                        <td tabIndex="0" className="sorting_1">
                          <a href={`/projects/${project._id}`}>{project.projectName}</a>
                        </td>
                        <td>{new Date(project.projectStartDate).toLocaleDateString()}</td>
                        <td>{new Date(project.projectEndDate).toLocaleDateString()}</td>
                        <td className="dt-body-right">
                          <img
                            src={`http://localhost:3000/api/Productowners/get-profile-photo/${project.emailPo}`}
                            alt="Avatar"
                            className="avatar sm rounded-circle me-2"
                          />
                          <a href="#!">{project.emailPo || 'N/A'}</a>
                        </td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              aria-valuenow={project.progress || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ width: `${project.progress || 0}%` }}
                            >
                              {project.progress || 0}%
                            </div>
                          </div>
                        </td>
                        <td className="dt-body-right">
                          <span className={`badge ${getPriorityBadgeClass(project.priority)}`}>
                            {project.priority}
                          </span>
                        </td>
                        <td>{project.teams.length > 0 ? project.teams[0].numberOfMembers : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectInformationTable;
