import React from "react";
import  './Credential.css';
function ProjectCredentials (){
    const name = localStorage.getItem('name');
        return(
            <div className="card bg-lightyellow">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-12 col-md-5 col-lg-6 order-md-2">
                        <div className="video-container text-center p-4">
                            <video autoPlay muted loop className="img-fluid">
                                <source src="https://cdn-icons-mp4.flaticon.com/512/15594/15594571.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                    <div className="col-12 col-md-7 col-lg-6 order-md-1 px-4">
                        <div className="text-center text-md-start">
                            <h3 className="fw-bold">{name}</h3>
                            <p className="line-height-custom">
                                Welcome back, {name}. This dashboard is designed to make project tracking and management easier. Here, you can view your project details, monitor progress, and stay updated with real-time data. Let's get started on achieving your goals!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        )
    }


export default ProjectCredentials;