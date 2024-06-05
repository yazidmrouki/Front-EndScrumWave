import React, { useState, useEffect } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineConsoleSql } from 'react-icons/ai';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PageHeader from "../../components/common/PageHeader";
import './Card.css';
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}



function Holidays() {
    const productOwnerId = localStorage.getItem("id"); 
    const email= localStorage.getItem("email"); 
    const [isModal, setIsModal] = useState(false);
    const [isEditModalData, setIsEditModalData] = useState("");
    const [holidays, setHolidays] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [isAllTeams, setIsAllTeams] = useState(false);
    const [originalHolidayData, setOriginalHolidayData] = useState({});

    useEffect(() => {
        fetchHolidays();
        fetchTeams();
    }, []);

    const fetchHolidays = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/holidays/get-holidays/${productOwnerId}`);
            
            // Vérifiez si response.data existe avant de le formater
            if (response.data) {
                const formattedHolidays = response.data.map((holiday) => ({
                    id: holiday._id,
                    startDate: formatDate(holiday.startDate),
                    endDate: formatDate(holiday.endDate),
                    name: holiday.name,
                    teamIds: holiday.teamId,
                    teamNames: holiday.teamName
                }));
                setHolidays(formattedHolidays);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des vacances :', error);
        }
    };
    

    const fetchTeams = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/ProductOwners/get-teams/${email}`);
            setTeams(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes :' + error.response.data.message);
            toast.error("Erreur lors de la récupération des équipes." + error.response.data.message);
        }
    };

    const deleteHoliday = async (id,teamId,email) => {
        try {
            console.log(id,teamId)
            await axios.delete(`http://localhost:3000/api/ProductOwners/delete-holidays/${teamId}/${id}/${email}`);
            fetchHolidays();
            toast.success("Holiday deleted successfully!");
        } catch (error) {
            console.error('Erreur lors de la suppression de la vacance :', error);
            toast.error("Failed to delete holiday!");
        }
    };

    const updateHoliday = async () => {
        try {
            const updatedHolidayData = { ...isEditModalData };
            updatedHolidayData.name = updatedHolidayData.name || originalHolidayData.name;
            updatedHolidayData.startDate = updatedHolidayData.startDate || originalHolidayData.startDate;
            updatedHolidayData.endDate = updatedHolidayData.endDate || originalHolidayData.endDate;
         
          
    
           
            console.log(updatedHolidayData)
            await axios.put(`http://localhost:3000/api/ProductOwners/update-holidays/${updatedHolidayData.teamIds}/${updatedHolidayData.id}/${email}`, updatedHolidayData);
    
            setIsModal(false);
            fetchHolidays();
            toast.success("Holiday updated successfully!");
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la vacance :', error);
            toast.error("Failed to update holiday!");
        }
    };
    const addHoliday = async () => {
        if (!isEditModalData.name || !isEditModalData.startDate || !isEditModalData.endDate || (!selectedTeam && !isAllTeams)) {
            toast.error("Please fill in all fields!");
            return;
        }
    
        // Vérifier la durée de l'événement
        const startDate = new Date(isEditModalData.startDate);
        const endDate = new Date(isEditModalData.endDate);
        const diffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (diffInDays > 7) {
            toast.error("Event duration cannot exceed 7 days!");
            return;
        }
    
        const teamIds = isAllTeams ? [] : [selectedTeam];
        const teamNames = isAllTeams ? [] : [teams.find(team => team._id === selectedTeam)?.name];
    
        try {
            await axios.post(`http://localhost:3000/api/ProductOwners/add-holidays/${email}`, { 
                ...isEditModalData, 
                teamIds, 
                teamNames,
                isAllTeams
            });
            setIsModal(false);
            fetchHolidays();
            toast.success("Holiday added successfully!");
        } catch (error) {
            console.error('Error adding holiday:', error);
            toast.error("Failed to add holiday!");
        }
    };
    
const openModalForEdit = (holiday) => {
    const startDate = new Date(holiday.startDate);
    const endDate = new Date(holiday.endDate);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    setIsEditModalData({
        ...holiday,
        startDate: formattedStartDate,
        endDate: formattedEndDate
    });

    // Set selectedTeam and isAllTeams based on holiday.teamId
    if (holiday.teamId) {
        setSelectedTeam(holiday.teamId);
        setIsAllTeams(false);
    } else {
        setSelectedTeam("");
        setIsAllTeams(true);
    }

    setIsModal(true);
    setOriginalHolidayData({ ...holiday });
};
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    
    
    const openModalForAdd = () => {
        setIsEditModalData({
            name: "",
            startDate: "",
            endDate: ""
        });
        setSelectedTeam("");
        setIsAllTeams(false);
        setIsModal(true);
        // Réinitialiser les données originales de la vacance
        setOriginalHolidayData({});
    };
    const handleStartDateChange = (e) => {
        const startDate = new Date(e.target.value);
        const endDate = new Date(isEditModalData.endDate);
    
        if (endDate && (endDate - startDate) / (1000 * 60 * 60 * 24) > 7) {
            toast.error("Event duration cannot exceed 7 days!");
            return;
        }
    
        setIsEditModalData({ ...isEditModalData, startDate: e.target.value });
    };
    
    const handleEndDateChange = (e) => {
        const startDate = new Date(isEditModalData.startDate);
        const endDate = new Date(e.target.value);
    
        if (startDate && (endDate - startDate) / (1000 * 60 * 60 * 24) > 7) {
            toast.error("Event duration cannot exceed 7 days!");
            return;
        }
    
        setIsEditModalData({ ...isEditModalData, endDate: e.target.value });
    };
    

        const getBackgroundImage = (eventType) => {
          
            switch (eventType) {
                case 'Réunion d\'équipe':
                    return  'https://img.freepik.com/vecteurs-libre/coach-parlant-devant-public-mentor-presentant-graphiques-rapports-reunion-employes-lors-formation-commerciale-seminaire-conference-illustration-vectorielle-pour-presentation-conference-education_74855-8294.jpg?w=1380&t=st=1716203218~exp=1716203818~hmac=16cf0914c91718503c502d2589b4c7e5ad67a149388873d5f1eebe9fc96bb4a5';
                case 'Journées d\'intégration':
                    return 'https://i.pinimg.com/564x/a6/3d/f0/a63df0d89eee2f7cc46e34b2fcc6a049.jpg';
                case 'Journée de formation':
                    return 'https://www.azprojet.fr/wp-content/uploads/2021/02/895.png'; 
                case 'Événement social':
                    return  'https://img.freepik.com/vecteurs-premium/concept-vecteur-calendrier-social-isometrique_516005-360.jpg';
                case 'Hackathon':
                    return 'https://img.freepik.com/free-vector/hackathon-technology-infographic-with-flat-icons_88138-961.jpg' ;
                case 'Sprint Plannig':
                    return 'https://conceptboard.com/wp-content/uploads/Blog_header_Sprint_Planning.png';
                case 'Sprint Review' :
                    return 'https://hygger.io/guides/wp-content/uploads/2021/02/sprint-reviews.jpg' ;
                case 'Sprint Retrospective':
                    return 'https://media.licdn.com/dms/image/D4E22AQH2ZK28cKDO3g/feedshare-shrink_800/0/1711980587762?e=2147483647&v=beta&t=C42a-Ze0RFAStdLTgNcwMI9PKlG9CQby5BcdK3no_-0';
                    case 'Session de brainstorming':
                        return 'https://as1.ftcdn.net/v2/jpg/02/29/00/60/1000_F_229006002_cU571eahX8iugQahAEK7UvKJgEk90plT.jpg';
                default:
                    return ; // Une image par défaut si le type d'événement n'est pas trouvé
            }
        };


    return (
        <div className="container-xxl">
        <PageHeader headerTitle="Events" renderRight={() => (
            <div className="col-auto d-flex w-sm-100">
                <Button variant="dark" className="btn-set-task w-sm-100 me-2" onClick={openModalForAdd}>
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add Events
                </Button>
            </div>
        )} />

        <div className="container-xxl">
            <div className="row clearfix g-3">
                {holidays.length === 0 ? (
                   <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '75vh', backgroundColor: '#f8f9fa' }}>
                   <div className="main-icon-without-slide icon-png-container pd-lv4 icon-mp4-container" style={{ textAlign: 'center' }}>
                     <video
                       width="260"
                       height="260"
                       preload="none"
                       style={{
                         background: 'transparent',
                         backgroundImage: 'url(https://cdn-icons-mp4.flaticon.com/512/15332/15332437.jpg)',
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
                       <source src="https://cdn-icons-mp4.flaticon.com/512/15332/15332437.mp4" type="video/mp4" />
                     </video>
                     <h3 className="text-secondary mb-3" style={{ fontWeight: 'bold', fontSize: '24px' }}>No Events Found</h3>
                     <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>it's seems like there is no Events Created   yet. </p>
                     <ToastContainer />
                   </div>
                 </div> 
                ) : (
                    holidays.map((holiday, index) => (
                        <div key={index} className="col-lg-4">
                            <Card className="shadow card mb-4 border-0 lift event-card">
                                <Card.Img 
                                    variant="top" 
                                    src={getBackgroundImage(holiday.name)} 
                                    className="event-card-background" 
                                />

                                <Card.Body>
                                    <Card.Title className="text-center">{holiday.title}</Card.Title>
                                    <div className="mb-3 event-details">
                                        <div className="event-detail">
                                            <div className="detail-label">Date:</div>
                                            <div className="detail-value">{holiday.startDate} - {holiday.endDate}</div>
                                        </div>
                                        <div className="event-detail">
                                            <div className="detail-label">Type d'événement :</div>
                                            <div className="detail-value">{holiday.name}</div>
                                        </div>
                                        <div className="event-detail">
                                            <div className="detail-label">Équipe :</div>
                                            <div className="detail-value">{holiday.teamNames}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <Button variant="outline-secondary me-2" onClick={() => openModalForEdit(holiday)}>
                                            <AiOutlineEdit className="me-1" /> Modifier
                                        </Button>
                                        <Button variant="outline-secondary" onClick={() => deleteHoliday(holiday.id, holiday.teamIds, email)}>
                                            <AiOutlineDelete className="me-1" /> Supprimer
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
 


            <Modal centered show={isModal} onHide={() => { setIsModal(false); setIsEditModalData(""); setSelectedTeam(""); setIsAllTeams(false); }} animation={true}>
    <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{isEditModalData.id ? "Edit" : "Add"} Holiday</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <div className="mb-3">
            <label className="form-label">Event Type</label>
            <select 
                className="form-control" 
                value={isEditModalData.name || ""}  // Mettre à jour la valeur avec les données actuelles
                onChange={(e) => setIsEditModalData({ ...isEditModalData, name: e.target.value })}
            >
                <option value="">Select Event Type</option>
                <option value="Réunion d'équipe">Réunion d'équipe</option>
                <option value="Journées d'intégration">Journée de d'integration</option>
                <option value="Session de brainstorming">Session de brainstorming</option>
                <option value="Journée de formation">Journée de formation</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Sprint Plannig">Sprint Plannig</option>
                <option value="Sprint Review">Sprint Review</option>
                <option value="Sprint Retrospective">Sprint Retrospective</option>
                <option value="Événement social">Événement social</option>
            </select>
        </div>

        <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input 
    type="date" 
    className="form-control" 
    placeholder="Start Date" 
    value={isEditModalData.startDate || ""} 
    min={new Date().toISOString().split('T')[0]} 
    onChange={handleStartDateChange} 
/>
        </div>
        <div className="mb-3">
            <label className="form-label">End Date</label>
          
<input 
    type="date" 
    className="form-control" 
    placeholder="End Date" 
    value={isEditModalData.endDate || ""} 
    onChange={handleEndDateChange} 
    min={isEditModalData.startDate} 
/>
        </div>
        
   
        <input type="hidden" value={isEditModalData.id || ""} />

       
        {!isEditModalData.id && (
            <div className="mb-3">
                <label className="form-label">Teams</label>
                <select className="form-control" value={isAllTeams ? "all" : selectedTeam} onChange={(e) => {
                    if (e.target.value === "all") {
                        setIsAllTeams(true);
                        setSelectedTeam("");
                    } else {
                        setIsAllTeams(false);
                        setSelectedTeam(e.target.value);
                    }
                }}>
                    <option value="">Select Team</option>
                    <option value="all">All Teams</option>
                    {teams.map(team => (
                        <option key={team._id} value={team._id}>{team.name}</option>
                    ))}

                </select>
            </div>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setIsModal(false)}>Close</Button>
        <Button variant="primary" onClick={isEditModalData.id ? updateHoliday : addHoliday}>{isEditModalData.id ? "Update" : "Add"} Holiday</Button>
    </Modal.Footer>
</Modal>


            <ToastContainer />
        </div>
    );
}

export default Holidays;
