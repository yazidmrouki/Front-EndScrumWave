import React from "react";
import { ProgressBar,Button } from "react-bootstrap";
import { FiActivity,FiEdit, FiTrash2, FiClock, FiUsers, FiAlertTriangle, FiList, FiUser  } from "react-icons/fi";

function CurrenTProject(props) {
    const { ProjectType, Delivered ,ClientName ,progres, ProjectName,noSprint,TeamName,onClickDeliver,onClickEdit, onClickDelete, budget, priority, startDate, endDate, ProjectMembres } = props;

    // Correspondance entre les types de projet et les icônes/logos
    const projectIcons = {
        "UI/UX Design": { logo: "icofont-paint", logoBg: "light-info-bg" },
        "App Development": { logo: "icofont-computer", logoBg: "light-primary-bg" },
        "Quality Assurance": { logo: "icofont-settings-alt", logoBg: "light-success-bg" },
        "Development": { logo: "icofont-code-alt", logoBg: "light-danger-bg" },
        "Mobile": { logo: "icofont-stock-mobile", logoBg: "light-success-bg" },
        "Backend Development": { logo:" icofont-dashboard", logoBg: "light-danger-bg" },
       "Frontend Development": { logo: "icofont-interface", logoBg: "bg-secondary" },
        "Software Testing": { logo: "icofont-bug", logoBg: "light-success-bg" },
        "Marketing": { logo: "icofont-megaphone", logoBg: "light-info-bg" },
        "SEO": { logo: "icofont-business-man-alt-2", logoBg: "light-warning-bg" },
        "Web Development": { logo: "icofont-web", logoBg: "light-info-bg" },
        "Mobile Application": { logo: "icofont-mobile", logoBg: "light-success-bg" },
        "Internet of Things (IoT)": { logo: "icofont-wifi", logoBg: "light-warning-bg" },
        "Game Development": { logo: "icofont-game", logoBg: "light-primary-bg" },
        "Artificial Intelligence / Machine Learning": { logo: "icofont-robot", logoBg: "light-info-bg" },
        "Data Analysis / Data Science": { logo: "icofont-chart-bar-graph", logoBg: "light-success-bg" },
        "Embedded Systems": { logo: "icofont-electron", logoBg: "light-danger-bg" },
        "Blockchain / Cryptocurrencies": { logo: "icofont-bitcoin", logoBg: "light-primary-bg" },
        "Cybersecurity": { logo: "icofont-shield", logoBg: "light-warning-bg" },
        "Enterprise Software Development": { logo: "icofont-business", logoBg: "light-info-bg" }
    };
    const progressValue = Math.min(Math.max(progres, 0), 100);
    // Récupérer l'icône et l'arrière-plan de logo correspondant au type de projet
    const { logo, logoBg } = projectIcons[ProjectType] || { logo: "", logoBg: "" };

    // Calculer le nombre de jours restants
    const currentDate = new Date();
    const endProjectDate = new Date(endDate);
    const daysLeft = Math.floor((endProjectDate - currentDate) / (1000 * 60 * 60 * 24));
    const displayProgress = progres != null ? progres : 0;
    return (
        <div className="card">
            <div className="card-body position-relative">
            {Delivered && (
    <div 
        style={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)",
            width: "100px", 
            height: "100px",
            borderRadius: "50%",
           
            backgroundSize: "cover", // Assurez-vous que l'image couvre tout le cercle
            backgroundColor: "bg-secondary", // Vert transparent
            zIndex: "9999", // Assurez-vous que le cercle est au-dessus du contenu de la carte
            textAlign: "center", // Centrer le texte
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <video autoPlay loop muted className="video-background" width="300" height="200">
    <source src="https://cdn-icons-mp4.flaticon.com/512/15577/15577944.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>

    </div>
)}

   <div className="d-flex align-items-center justify-content-between mt-5">
                    <div className="lesson_name">
                        <div className={"project-block " + logoBg}>
                            <i className={logo}></i>
                        </div>
                        <span className="small text-muted project_name fw-bold">{TeamName}</span>
                        <h6 className="mb-0 fw-bold fs-6 mb-2">{ ProjectName}</h6>
                        
                        <span className="client-name bg-secondary">
              <FiUser /> {/* Utiliser FiUser comme icône de client */}
              Client  {ClientName}
            </span> {/* Ajout du ClientName ici */}
                    </div>
                    
                </div>
                <div className="row g-2 pt-4">
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                        <i className="icofont-money-bag"></i>
                            <span className="ms-2">{budget} Budget</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <FiList /> {/* Use FiList for Sprint */}
                            <span className="ms-2"> Sprint {noSprint} </span>
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
                    <span className={`small ${daysLeft > 0 ? "bg-secondary" : "light-danger-bg"} p-1 rounded`}><FiClock /> {daysLeft} Days Left</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
      <ProgressBar style={{ height: "8px", flexGrow: 1 }}>
        <ProgressBar animated variant="warning" now={progressValue} style={{ width: `${progres}%`, backgroundColor: "#28a745" }} />
      </ProgressBar>
      <span style={{ marginLeft: "8px", color: "#000000" }}>{ displayProgress}%</span>
    </div>
            </div>
        </div>
    );
}

export default CurrenTProject;
