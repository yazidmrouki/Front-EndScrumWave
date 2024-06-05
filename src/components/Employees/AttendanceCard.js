import React, { useEffect, useState } from "react";
import axios from "axios";

function AttendanceCard() {
  const [membersAttendance, setMembersAttendance] = useState([]);
  const id=localStorage.getItem('id');
  useEffect(() => {
    // Fonction pour récupérer les données d'assiduité des membres
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-monthday-members/${id}`); // Remplacez "your_poid_here" par le véritable identifiant du product owner
        setMembersAttendance(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'assiduité des membres :", error);
      }
    };

    fetchAttendanceData();
  }, []); // Utilisez une dépendance vide pour vous assurer que cette fonction est appelée une seule fois après le rendu initial

  if (!membersAttendance.length) {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
        <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
          <video
            width="260"
            height="260"
            preload="none"
            style={{
              background: 'transparent',
              backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/15374/15374784.png)',
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
            <source src="https://cdn-icons-mp4.flaticon.com/512/15374/15374784.mp4" type="video/mp4" />
          </video>
          <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Employee Found</h3>
          <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Employee found  yet. </p>
        
        </div>
      </div>
    );
}

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="atted-info d-flex mb-3 flex-wrap">
          <div className="full-present me-2">
            <i className="icofont-check-circled text-success me-1"></i>
            <span>Full Day Present</span>
          </div>
          <div className="Half-day me-2">
            <i className="icofont-wall-clock text-warning me-1"></i>
            <span>Half Day Present</span>
          </div>
        
             <div className="absent me-2">
            <i className="icofont-close-circled text-danger me-1"></i>
            <span>Full Day Absence</span>
          </div>
          {/* Légende pour les jours non attendus */}
          
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Employee</th>
                {/* Ajoutez ici les en-têtes pour les jours */}
                {Array.from({ length: 31 }, (_, index) => (
                  <th key={index + 1}>{index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Parcourez les données d'assiduité des membres et affichez-les */}
              {membersAttendance.map((member, index) => (
                <tr key={index}>
                  <td>
                    <span className="fw-bold small">{member.email}</span>
                  </td>
                  {/* Affichez l'assiduité pour chaque jour */}
                  {member.attendanceMonth.map((day, index) => (
                    <td key={index}>
                      {/* Vérifiez si le jour est dans le passé ou le futur */}
                      {index + 1 <= new Date().getDate() ? (
                        // Si le jour est dans le passé, affichez l'assiduité normalement
                        day.status === "Present" ? (
                          <i className="icofont-check-circled text-success"></i>
                        ) : day.status === "Half Present" ? (
                          <i className="icofont-wall-clock text-warning"></i>
                        ) : (
                          <i className="icofont-close-circled text-danger"></i>
                        )
                      ) : (
                        // Si le jour est dans le futur, affichez un indicateur pour les jours non attendus
                        <span style={{ color: "black" }}>N/A</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceCard;
