import React, { useState, useEffect } from 'react';
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/common/Header";
import Expenses from "./Accounts/Expenses";
import Invoices from "./Accounts/Invoices";
import Payments from "./Accounts/Payments";
import HrDashboard from "./Dashboard/HrDashboard";
import ProjectDashboard from "./Dashboard/ProjectDashboard";
import Attendance from "./Employee/Attendance";
import AttendanceEmployees from "./Employee/AttendanceEmployees";
import Departments from "./Employee/Departments";
import EmployeeProfile from "./Employee/EmployeeProfile";
import Holidays from "./Employee/Holidays";
import LeaveRequest from "./Employee/LeaveRequest";
import Members from "./Employee/Members";
import ClientProfile from "./Our Clients/ClientProfile";
import Clients from "./Our Clients/Clients";
import Salaryslip from "./Payroll/Salaryslip";
import Leaders from "./Projects/Leaders";
import Projects from "./Projects/Projects";
import ViewProject from "./Projects/ViewProject";
import ProjectManagement from  "./Projects/ProjectManagement";   
import Timesheet from "./Projects/Timesheet";
import TicketsDetail from "./Tickets/TicketsDetail";
import TicketsView from "./Tickets/TicketsView";
import Alerts from "./UIComponents/Alerts";
import Calendar from "./App/Calendar";
import ChatApp from "./App/ChatApp";
import ApexCharts from "./OtherPages/ApexCharts";
import FormsExample from "./OtherPages/FormsExample";
import TablesExample from "./OtherPages/TablesExample";
import ReviewsPage from "./OtherPages/ReviewsPage";
import Icons from "./OtherPages/Icons";
import Widgets from "./OtherPages/Widgets";
import Badges from "./UIComponents/Badges";
import Breadcrumb from "./UIComponents/Breadcrumb";
import Buttons from "./UIComponents/Buttons";
import Cards from "./UIComponents/Cards";
import Carousel from "./UIComponents/Carousel";
import Collapse from "./UIComponents/Collapse";
import Dropdowns from "./UIComponents/Dropdowns";
import ListGroup from "./UIComponents/ListGroup";
import ModalUI from "./UIComponents/ModalUI";
import NavsUI from "./UIComponents/NavsUI";
import NavbarUI from "./UIComponents/NavbarUI";
import PaginationUI from "./UIComponents/PaginationUI";
import PopoversUI from "./UIComponents/PopoversUI";
import ProgressUI from "./UIComponents/ProgressUI";
import Scrollspy from "./UIComponents/Scrollspy";
import SpinnersUI from "./UIComponents/SpinnersUI";
import ToastsUI from "./UIComponents/ToastsUI";
import StaterPage from "./Stater/StaterPage";
import PageHeader1 from "../components/common/PageHeader1";
import Documentation from "./Documentation/Documentation";
import Changelog from "./Changelog/Changelog";
import Help from "./Dashboard/Help";
import PrivateRoute from "../components/common/PrivateRoute";
import MyTeam from "./Employee/MyTeam";
import DailyMeeting from "./DailyMeeting";
import { toast, ToastContainer } from "react-toastify";  
import 'react-toastify/dist/ReactToastify.css';


function MainIndex(props) {
    const { activekey, isAuthenticated } = props;
    const teamId = localStorage.getItem("Assignedteam");
    const role = localStorage.getItem("role");
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        // Vérifiez si l'utilisateur a le rôle "Développeur" et teamId n'est pas vide avant de continuer
        if (role !== "Devellopeurs" || !teamId) return;

        const fetchAssignedProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/${role}/get-ProjectsAssigne/${teamId}`);
                const projects = response.data;

                if (projects && projects.length > 0) {
                    setAssignedProjects(projects);
                    setSelectedProjectId(projects[0]?._id); // Sélectionnez le premier projet par défaut
                } else {
                    setAssignedProjects([]);
                    setSelectedProjectId(null);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des projets assignés:", error);
                // Vous pouvez afficher une notification d'erreur ici si nécessaire
            }
        };

        fetchAssignedProjects();
    }, [teamId, role]);

    const renderDailyMeeting = () => {
        if (role === "Devellopeurs" && teamId) {
            return <DailyMeeting projectId={selectedProjectId} />;
        }
    };

    return (
        <div className="main px-lg-4 px-md-4">
          {renderDailyMeeting()}
          {activekey !== "/chat-app" ? activekey === "/documentation" ? <PageHeader1 /> : <Header /> : ""}
          <div className="body d-flex py-lg-3 py-md-2">
            <ReactRoutes>
             <Route path={`${process.env.PUBLIC_URL}/members-profile`} element={<EmployeeProfile />} />
             <Route path={`${process.env.PUBLIC_URL}/`} element={<EmployeeProfile />} /> 




              {role === "Devellopeurs" && (
            <>
            <Route path={`${process.env.PUBLIC_URL}/Myteam`} element={<MyTeam />} />
              <Route path={`${process.env.PUBLIC_URL}/ProjectManagement`} element={ <ProjectManagement/>} />
            
            </>
          )}




              {role === "scrumMasters" && (
                <>
                 <Route path={`${process.env.PUBLIC_URL}/Myteam`} element={<MyTeam />} />
                  <Route path={`${process.env.PUBLIC_URL}/tickets-detail`} element={<TicketsDetail />} />
                  <Route path={`${process.env.PUBLIC_URL}/tasks`} element={<ViewProject />} />
                  <Route path={`${process.env.PUBLIC_URL}/expenses`} element={<Expenses />} />
                  <Route exact path={`${process.env.PUBLIC_URL}/tasks`} element={<ViewProject/>} />
                </>
              )}
  {role === "ProductOwners" && (
                <>
                
                <Route exact path={`${process.env.PUBLIC_URL}/hr-dashboard` } element={<HrDashboard/>} isAuthenticated={isAuthenticated}  />
                <Route exact path={`${process.env.PUBLIC_URL}/project-dashboard`} element={<ProjectDashboard/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/projects`} element={<Projects/>} />
               
              
               
                <Route exact path={`${process.env.PUBLIC_URL}/leaders`} element={<Leaders/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/tickets-view`} element={<TicketsView/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/members`} element={<Members/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/holidays`} element={<Holidays/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/attendance-employees`} element={<AttendanceEmployees/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/attendance`} element={<Attendance/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/payments`} element={<Payments/>} />
                </>
              )}




          
              <Route path={`${process.env.PUBLIC_URL}/calander`} element={<Calendar />} />
              <Route path={`${process.env.PUBLIC_URL}/chat-app`} element={<ChatApp />} />
            
              <Route path="*" element={<Navigate to={`${process.env.PUBLIC_URL}/members-profile`} replace />} />




             
              
                
                

              
                <Route exact path={`${process.env.PUBLIC_URL}/stater-page`} element={<StaterPage/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/documentation`} element={<Documentation/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/changelog`} element={<Changelog/>} />
                <Route exact path={`${process.env.PUBLIC_URL}/help`} element={<Help/>} />
            </ReactRoutes>
            </div>
        </div>
    )
}


export default MainIndex;