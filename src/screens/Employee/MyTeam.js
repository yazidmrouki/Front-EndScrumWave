import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown, Modal } from "react-bootstrap";
import OurTeams from "../../components/Clients/OurTeams";
import PageHeader from "../../components/common/PageHeader";



import { FaRegFrown } from 'react-icons/fa';


function MyTeam() {
    const [members, setMembers] = useState([]);
    const rolle = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    const [NameTeam, setNameTeam] = useState();
    useEffect(() => {
        // Fonction pour récupérer les membres depuis le serveur
        const fetchMembers = async () => {
            try {
                // Remplacez l'URL ci-dessous par l'URL de votre endpoint pour récupérer les membres de l'équipe
                const response = await axios.get(`http://localhost:3000/api/${rolle}/my-team/${id}`);
    
                // Vérifier si aucune équipe n'est trouvée
                if (!response.data.team) {
                    // Afficher une toast de type warning
                    toast.warning('Aucune équipe n\'a été trouvée pour cet utilisateur.');
                    return;
                }
    
                const { developers, scrumMasters, productOwners } = response.data;
                
                setNameTeam(response.data.team.name);
                console.log(response.data);
                // Ajouter le rôle à chaque membre et les combiner en une seule liste
                const allMembers = [
                    ...developers.map(developer => ({ ...developer, role: 'Devellopeurs' })),
                    ...scrumMasters.map(scrumMaster => ({ ...scrumMaster, role: 'scrumMasters' })),
                    ...productOwners.map(productOwner => ({ ...productOwner, role: 'ProductOwners' }))
                ];
                
                // Mettre à jour l'état avec les membres récupérés
                setMembers(allMembers);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres de l\'équipe :', error);
                toast.error('Une erreur est survenue lors de la récupération des membres de l\'équipe.');
            }
        };
    
        // Appeler fetchMembers une seule fois après le premier rendu
        fetchMembers();
    }, []);
    

    if (!members.length) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
            <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
              <video
                width="256"
                height="256"
                preload="none"
                style={{
                  background: 'transparent',
                  backgroundImage: 'url(https://cdn-icons-png.flaticon.com/512/12317/12317792.png)',
                  backgroundPosition: '50% 50%',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '50%',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="https://cdn-icons-mp4.flaticon.com/512/12317/12317792.mp4" type="video/mp4" />
              </video>
              <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Team Found</h3>
              <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>It seems like you don't have any Team  yet. Contact your Product Owners if there are any problems!</p>
              <ToastContainer />
            </div>
          </div>
        );
    }
    return (
        <div className="container-xxl">
            <PageHeader headerTitle={NameTeam+" Membres"} />
            <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-1 row-cols-xl-1 row-cols-xxl-1 row-deck py-1 pb-4">

                {members.map((member, i) => (
                    <div key={"member" + i} className="col">
                        <OurTeams
                            {...member} // Passe toutes les propriétés de l'objet member comme des props
                        />
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default MyTeam;
