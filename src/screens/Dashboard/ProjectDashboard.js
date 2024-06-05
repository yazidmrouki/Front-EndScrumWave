import React, { useState, useEffect } from 'react';
import BrandInfoSmallcard from "../../components/Dashboard/BrandInfoSmallcard";
import TicketView from "../../components/Dashboard/TicketView";
import GeneralChartCard from "../../components/Dashboard/GeneralChartCard";
import GeneralChartCardDropDown from "../../components/Dashboard/GeneralChartCardDropDown";
import ProjectCredentials from "../../components/Dashboard/ProjectCredentials";
import ProjectInformationTable from "../../components/Dashboard/ProjectInformationTable";
import TaskCard from "../../components/Dashboard/TaskCard";
import ProjectCategoryDonut from "../../components/Pages/ProjectCategoryDonut";
import TicketsCountTodayChart from "../../components/Dashboard/TicketsCountTodayChart";
import ProjectTimeline from "../../components/Dashboard/ProjectTimeline";

import axios from 'axios';

function ProjectDashboard() {
    const [projectDetails, setProjectDetails] = useState({});
    const emailPo = localStorage.getItem('email');

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ProductOwners/Project-Details/${emailPo}`);
                setProjectDetails(response.data);
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, [emailPo]);

        return(

            <div className="container-xxl">
               <div className="row g-3 mb-3 row-deck">
    <div className="col-md-6 col-lg-3">
        <TaskCard label="Total Task" value={projectDetails.totalTasks} iconClass="bi bi-journal-check fs-4" />
    </div>
    <div className="col-md-6 col-lg-3">
        <TaskCard label="Completed Task" value={projectDetails.completedTasks} iconClass="bi bi-list-check fs-4" />
    </div>
    <div className="col-md-6 col-lg-3">
        <TaskCard label="Progress Task" value={projectDetails.inProgressTasks} iconClass="bi bi-clipboard-data fs-4" />
    </div>
    <div className="col-md-6 col-lg-3">
        <TaskCard label="To Do Task"  value={projectDetails.toDoTasks}  iconClass="bi bi-clipboard-data fs-4" />
    </div>
</div>

                <div className="row g-3 mb-3 row-deck">
                    <div className="col-md-12 col-lg-8 col-xl-7 col-xxl-7">
                        <TicketView/>
                    </div>
                    <div className="col-md-12 col-lg-4 col-xl-5 col-xxl-5">
                        <ProjectCredentials />
                    </div>
                    
                </div>
                <div className="row g-3 mb-3 row-deck">
                    <div className="col-md-12 col-lg-4">
                    <ProjectCategoryDonut/> 
                    </div>
                    
                    <div className="col-md-12 col-lg-8">
                      <ProjectTimeline/>
                    </div>

                    <div className="col-md-15 col-lg-14">
                <TicketsCountTodayChart />
                    </div>

                </div>
                <div className="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 row-cols-xxl-4">
                    <div className="col">
                        <BrandInfoSmallcard title="Total Projects" value={projectDetails.totalProjects} iconClass="icofont-data fs-3" />
                    </div>
                    <div className="col">
                        <BrandInfoSmallcard title="Coming Projects" value={projectDetails.comingProjects} iconClass="icofont-chart-flow fs-3" />
                    </div>
                    <div className="col">
                        <BrandInfoSmallcard title="Progress Projects" value={projectDetails.progressProjects} iconClass="icofont-chart-flow-2 fs-3" />
                    </div>
                    <div className="col">
                        <BrandInfoSmallcard title="Finished Projects" value={projectDetails.finishedFiles} iconClass="icofont-tasks fs-3" />
                    </div>
                </div>
                <div className="row g-3 mb-3 row-deck">
                    <div className="col-md-12">
                        <ProjectInformationTable />
                    </div>
                </div>

            </div>
        )
    }


export default ProjectDashboard;