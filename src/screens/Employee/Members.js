import React, { useState, useEffect } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import OurClients from "../../components/Clients/OurClients";
import PageHeader from "../../components/common/PageHeader";
import { MembersData } from "../../components/Data/AppData";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import Avatar7 from "../../assets/images/xs/avatar7.jpg";
function Members() {

    const [isModal, setIsModal] = useState(false);
    const [members, setMembers] = useState([]);
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    // Fonction pour récupérer les membres depuis le serveur
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/ProductOwners/developers-and-scrum-masters');
            const { developers, scrumMasters } = response.data;
             
           
            
            // Ajouter le rôle pour chaque membre
            const allMembers = [
                ...developers.map(member => ({ ...member, role: 'Devellopeurs' })), // Rôle "Dev" pour chaque développeur
                ...scrumMasters.map(member => ({ ...member, role: 'scrumMasters' })) // Rôle "Scrum Master" pour chaque Scrum Master
            ];
            
            // Mettre à jour l'état avec les membres et leurs rôles
            setMembers(allMembers);
        } catch (error) {
            console.error('Erreur lors de la récupération des membres :', error);
            // Gérer les erreurs
        }
    };

   
    // Appeler fetchMembers une seule fois après le premier rendu
    useEffect(() => {
        fetchMembers();
    }, []);

    
    if (!members.length) {
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
              <ToastContainer />
            </div>
          </div>
        );
    }

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Membres" />
            <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
                {members.map((member, i) => (
                    <div key={"member" + i} className="col">
                        <OurClients
                            {...member} // Passe toutes les propriétés de l'objet member comme des props
                        />
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    )
}


export default Members;