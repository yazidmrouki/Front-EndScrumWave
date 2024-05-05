import React from "react";
import { ProgressBar } from "react-bootstrap";
import { FiActivity,FiEdit, FiTrash2, FiPaperclip, FiClock, FiUsers, FiDollarSign, FiAlertTriangle, FiList } from "react-icons/fi";

function CurrenTProject(props) {
    const { ProjectType,  ProjectName,TeamName, onClickEdit, onClickDelete, budget, priority, startDate, endDate, ProjectMembres } = props;

    // Correspondance entre les types de projet et les icônes/logos
    const projectIcons = {
        "WEB": { logo: "icofont-web", logoBg: "light-info-bg" },
        "UI/UX Design": { logo: "icofont-paint", logoBg: "light-info-bg" },
        "App Development": { logo: "icofont-computer", logoBg: "light-primary-bg" },
        "Quality Assurance": { logo: "icofont-settings-alt", logoBg: "light-success-bg" },
        "Development": { logo: "icofont-code-alt", logoBg: "light-danger-bg" },
        "Mobile": { logo: "icofont-stock-mobile", logoBg: "light-success-bg" },
        "Backend Development": { logo: "icofont-dashboard-we", logoBg: "light-danger-bg" },
        "Frontend Developement": { logo: "icofont-interface", logoBg: "light-primary-bg" },
        "Software Testing": { logo: "icofont-bug", logoBg: "light-success-bg" },
        "Marketing": { logo: "icofont-megaphone", logoBg: "light-info-bg" },
        "SEO": { logo: "icofont-business-man-alt-2", logoBg: "light-warning-bg" }
    };

    // Récupérer l'icône et l'arrière-plan de logo correspondant au type de projet
    const { logo, logoBg } = projectIcons[ProjectType] || { logo: "", logoBg: "" };

    // Calculer le nombre de jours restants
    const currentDate = new Date();
    const endProjectDate = new Date(endDate);
    const daysLeft = Math.floor((endProjectDate - currentDate) / (1000 * 60 * 60 * 24));

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mt-5">
                    <div className="lesson_name">
                        <div className={"project-block " + logoBg}>
                            <i className={logo}></i>
                        </div>
                        <span className="small text-muted project_name fw-bold">{TeamName}</span>
                        <h6 className="mb-0 fw-bold fs-6 mb-2">{ ProjectName}</h6>
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                        <button type="button" className="btn btn-outline-secondary" onClick={onClickEdit}><FiEdit /></button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onClickDelete}><FiTrash2 /></button>
                    </div>
                </div>
                <div className="row g-2 pt-4">
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                        <i class="icofont-money-bag"></i>
                            <span className="ms-2">{budget} Budget</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <FiList /> {/* Use FiList for Sprint */}
                            <span className="ms-2">Sprint 4</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <FiAlertTriangle /> {/* Use FiAlertTriangle for Priority */}
                            <span className="ms-2">{priority} Priority</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <FiUsers /> {/* Use FiUsers for Project Members */}
                            <span className="ms-2">{ProjectMembres} Members</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <FiClock /> {/* Use FiClock for Start Date */}
                            <span className="ms-2">Start Date: {new Date(startDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <FiClock /> {/* Use FiClock for End Date */}
                            <span className="ms-2">End Date: {new Date(endDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                        <FiActivity />
                            <span className="ms-2">ProjectType {ProjectType}</span>
                        </div>
                    </div>
                </div>
                <div className="dividers-block"></div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className="small fw-bold mb-0">Progress</h4>
                    <span className="small light-danger-bg p-1 rounded"><FiClock /> {daysLeft} Days Left</span>
                </div>
                <ProgressBar style={{ height: "8px" }}>
                    <ProgressBar variant="secondary" now={15} style={{ width: "25%" }} />
                    <ProgressBar variant="secondary" now={30} style={{ width: "25%", marginLeft: 10 }} />
                    <ProgressBar variant="secondary" now={10} style={{ width: "25%", marginLeft: 10 }} />
                </ProgressBar>
            </div>
        </div>
    );
}

export default CurrenTProject;
