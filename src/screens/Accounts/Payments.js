import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import axios from "axios"; // Importer axios pour effectuer des requêtes HTTP
import { toast } from "react-toastify"; // Importer toast pour afficher des notifications

const columns = [
    {
        name: "NO",
        selector: (row, index) => <a href="invoices" className="fw-bold text-secondary">{"#0000"}{index+1}</a>,
        sortable: true,
    },
    {
        name: "PROJECT",
        selector: row => row.projectName,
        sortable: true,
    },
    {
        name: "CLIENT NAME",
        selector: row => row.ClientName,
        sortable: true,
    },
    {
        name: "DATE START",
        selector: row => new Date(row.projectStartDate).toLocaleDateString(),
        sortable: true,
    },
    {
        name: "DATE END",
        selector: row => new Date(row.projectEndDate).toLocaleDateString(),
        sortable: true,
    },
    {
        name: "AMOUNT",
        selector: row => row.budget,
        sortable: true,
    },
    {
        name: "STATUS",
        selector: "status",
        sortable: true,
        cell: row => {
            if (!row.Delivered && new Date(row.projectEndDate) < new Date()) {
                return (
                    <span className="badge bg-lavender-purple">
                        Draft
                    </span>
                );
            } else if (!row.Delivered && new Date(row.projectEndDate) >= new Date()) {
                return (
                    <span className="badge bg-warning">
                        Pending
                    </span>
                );
            } else if (row.Delivered) {
                return (
                    <span className="badge bg-success">
                        Paid
                    </span>
                );
            }
        },
    },
];

function Payments() {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const AssignedTeam = localStorage.getItem("Assignedteam");
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-Projects/${email}`); // Assurez-vous de remplacer cet URL par l'URL correcte de votre API
                setProjects(response.data);
                toast.success("Projects fetched successfully");
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || "Unknown error";
                
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Payments" />
            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    {projects.length === 0 ? (
                      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
                      <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
                        <video
                          width="300"
                          height="300"
                          preload="none"
                          style={{
                            background: 'transparent',
                            backgroundImage: 'https://cdn-icons-mp4.flaticon.com/512/14732/14732268.png)',
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
                          <source src="https://cdn-icons-mp4.flaticon.com/512/14732/14732268.mp4" type="video/mp4" />
                        </video>
                        <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Business Plan </h3>
                        <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like You didint Create Project yet. </p>
                      
                      </div>
                    </div>
                    ) : (
                        <DataTable
                            title="Projects"
                            columns={columns}
                            data={projects}
                            defaultSortField="title"
                            pagination
                            selectableRows={false}
                            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Payments;
