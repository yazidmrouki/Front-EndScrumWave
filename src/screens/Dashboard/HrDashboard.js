import React ,{useState,useEffect}from "react"; 
import Employeesavaibility from "../../components/Dashboard/Employeesavaibility";
import HignlighterCard from "../../components/Dashboard/HignlighterCard";
import InterviewCard from "../../components/Dashboard/InterviewCard";
import TopPerformers from "../../components/Dashboard/TopPerformers";
import UpcommingInterviews from "../../components/Dashboard/UpcommingInterviews";
import GeneralChartCard from "../../components/Dashboard/GeneralChartCard";
import { EmployeeInfoChartData,TotalEmployeesChartData,TopHiringSourcesChartData } from "../../components/Data/DashboardData";
import MouthAttendance from "../../components/Pages/MouthAttendance"; 
import EmployeeType from "../../components/Pages/EmployeeType";
import TopSources from "../../components/Pages/TopSources";
import AnnualAttendance from "../../components/Dashboard/AnnualAttendance";
import axios from "axios";
import TypeStats from "../../components/Dashboard/TypeStats";
function HrDashboard (){
    const id=localStorage.getItem('id');
    const [details, setDetails] = useState(null); // État pour stocker les détails récupérés

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/details`);
                // Récupérer les données de la réponse
                const data = response.data;
                // Stocker les données dans l'état
                setDetails(data);
            } catch (error) {
                // Gérer les erreurs
                console.error('Une erreur est survenue lors de la récupération des détails :', error);
            }
        };
    
        fetchDetails();
    }, []);
    


        return(
            <div className="container-xxl">
               
                <div className="row clearfix g-3">
                    <div className="col-xl-8 col-lg-12 col-md-12 flex-column">
                        <div className="row g-3">
                            <div className="col-md-12">
                               
                                <MouthAttendance  userId={id} />
                            </div>
                            <div className="col-md-6">
                                <Employeesavaibility id={id}/>
                            </div>
                            <div className="col-md-6">
                              <EmployeeType/>

                            </div>
                            <div className="col-md-12">
                              <TopSources/>
                            </div>
                            <div className="col-md-12">
                             <AnnualAttendance/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-12 col-md-12">
                        <div className="row g-3">
                            <div className="col-md-6 col-lg-6 col-xl-12"><HignlighterCard App={details ? (details.projectCount ? details.projectCount : 0) : 0}/></div>
                            <div className="col-md-6 col-lg-6 col-xl-12 flex-column">
                                <InterviewCard    Numbres={1} value={details ? (details.employeeCount ? details.employeeCount : 0) : 0} iconClass="icofont-users-alt-2 fs-5" label="Employees " chartClass="icofont-users-social fs-3 text-muted"/>
                                <InterviewCard    Numbres={2} value={details ? (details.teamCount? details.teamCount : 0) : 0} iconClass="icofont-holding-hands fs-5" label="Teams" chartClass="icofont-field-group fs-3 text-muted"/>
                            </div>
                            <div className="col-md-12 col-lg-12 col-xl-12"><UpcommingInterviews /></div>
                            <div className="col-md-12 col-lg-12 col-xl-12"><TypeStats /></div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <TopPerformers />
                    </div>
                </div>
            </div>
        )
    }


export default HrDashboard;