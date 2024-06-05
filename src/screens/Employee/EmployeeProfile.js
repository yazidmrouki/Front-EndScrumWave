import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import ClientProfileCard from "../../components/Clients/ClientProfileCard";
import PageHeader from "../../components/common/PageHeader";
import CurrentClientProject from "../../components/Clients/CurrentClientProject";
import PersonalInformations from "../../components/Employees/PersonalInformations";
import ExperienceCard from "../../components/Employees/ExperienceCard";

import { FaRegFrown } from 'react-icons/fa';

import DataTable from "react-data-table-component";
import  './App.css';

function EmployeeProfile() {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const AssignedTeam = localStorage.getItem("Assignedteam");
    const [projects, setProjects] = useState([]);


    useEffect(() => {
        const fetchProjects = async () => {
           

            try {
                let response;
                if (role === 'ProductOwners') {
                    response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Projects/${email}`);
                } else if (role === 'Devellopeurs' || role === 'scrumMasters') {
                    response = await axios.get(`http://localhost:3000/api/${role}/get-ProjectsAssigne/${AssignedTeam}`);
                }

                const fetchedProjects = response.data || [];
                setProjects(fetchedProjects);
              
            } catch (error) {
             
            }
        };

        fetchProjects();
    }, [email, role, AssignedTeam]);



    const getProjectStatus = (startDate, endDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (today < start) return "To Do";
        if (today >= start && today <= end) return "In Progress";
        if (today > end) return "Completed";
    };

    const columns = [
        {
            name: "NO",
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "PROJECT",
            selector: row => row.projectName,
            sortable: true,
        },
        {
            name: "START DATE",
            selector: row => new Date(row.projectStartDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: "END DATE",
            selector: row => new Date(row.projectEndDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: "BUDGET",
            selector: row => row.budget,
            sortable: true,
        },
        {
            name: "STATUS",
            selector: row => getProjectStatus(row.projectStartDate, row.projectEndDate),
            sortable: true,
            cell: row => {
                const status = getProjectStatus(row.projectStartDate, row.projectEndDate);
                const statusClass = status === "In Progress" ? "bg-warning" : status === "Completed" ? "bg-success" : "bg-secondary";
                return <span className={`badge ${statusClass}`}>{status}</span>;
            }
        }
    ];

    return (
        <div className="container-xxl">
        <PageHeader headerTitle={`${role} Profile`} />
        <div className="row g-3">
          <div className="col-xl-8 col-lg-12 col-md-12">
            <ClientProfileCard designation="Web Developer" details="Employee Id : 00001" />
            <h6 className="fw-bold py-3 mb-3">Current Work Project</h6>
            <div className="teachercourse-list mb-3">
              <div className="row g-3 gy-5 pt-3 row-deck">
                {projects.length === 0 ? (
                  <div className="text-center no-projects-found">
                    <FaRegFrown size={64} className="mb-4 animate__animated animate__bounceIn" />
                    <h3 className="text-secondary mb-3">No Project Found</h3>
                    <p className="text-muted mb-4">It seems like you don't have any projects yet. Contact your Product Owners if there are any problems!</p>
                  </div>
                ) : (
                  role === 'ProductOwners' ? (
                    <DataTable
                      title="Projects"
                      columns={columns}
                      data={projects}
                      defaultSortField="title"
                      pagination
                      selectableRows={false}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover
                    />
                  ) : (
                    <div className="row g-3 gy-1 py-1 row-deck">
                      {projects.map((project) => (
                        <CurrentClientProject
                          key={project._id}
                          Delivered={project.Delivered}
                          ProjectType={project.projectCategory}
                          noSprint={project.sprints?.length || 0}
                          ProjectMembres={project.projectAssignedTeams?.numberOfMembers || 0}
                          TeamName={project.projectAssignedTeams?.name || 'Unknown Team'}
                          ProjectName={project.projectName}
                          budget={project.budget}
                          progres={project.progress}
                          priority={project.priority}
                          startDate={project.projectStartDate}
                          endDate={project.projectEndDate}
                        />
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-12 col-md-12">
            <PersonalInformations />
            <ExperienceCard />
          </div>
        </div>
      </div>
    );
}

export default EmployeeProfile;
