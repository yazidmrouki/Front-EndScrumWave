import { Dropdown } from "react-bootstrap";
import Avatar1 from "../../assets/images/xs/avatar1.jpg";
import Avatar2 from "../../assets/images/xs/avatar2.jpg";
import Avatar3 from "../../assets/images/xs/avatar3.jpg";
import Avatar4 from "../../assets/images/xs/avatar4.jpg";
import Avatar5 from "../../assets/images/xs/avatar5.jpg";
import Avatar6 from "../../assets/images/xs/avatar6.jpg";
import Avatar7 from "../../assets/images/xs/avatar7.jpg";
import Avatar8 from "../../assets/images/xs/avatar8.jpg";
import ProfileImg from "../../assets/images/profile_av.png";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import AddNewUserModal from "./AddNewUserModal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import './css.css';
import {handleLogout } from "../../App";
function Header() {
    const [isAddUserModa, setIsAddUserModa] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const id = localStorage.getItem('id');
   const Name=localStorage.getItem("name");
  const email=localStorage.getItem("email");
  const role =localStorage.getItem("role");
  const Assignedteam=localStorage.getItem("Assignedteam");
  const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchNotifications = async () => {
            if (!Assignedteam || !id) return;
            try {
                let response;
                if (role === 'Devellopeurs' || role === 'scrumMasters') {
                    response = await axios.get(`http://localhost:3000/api/notification/get-notif-team/${Assignedteam}`);
                    console.log(response.data)
                } else if (role === 'ProductOwners') {
                    response = await axios.get(`http://localhost:3000/api/notification/get-notif-Allteamsassigned/${id}`);
                }
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications(); // Effectue la première requête lors de la mise en place de l'effet

        // Met à jour les notifications toutes les 10 secondes
        const intervalId = setInterval(fetchNotifications, 10000);

        // Nettoie l'intervalle lorsque le composant est démonté ou lorsque l'ID ou le rôle change
        return () => clearInterval(intervalId);
    }, [id, role, Assignedteam]);

    // Filtrer les notifications datant d'aujourd'hui ou des dernières 24 heures
    const currentDate = new Date();
    const recentNotifications = notifications.filter(notification => {
        const notificationDate = new Date(notification.date);
        const diffInTime = currentDate.getTime() - notificationDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays <= 1;
    });

    

    return (

        <div className="header">
            <nav className="navbar py-4">
                
                <div className="container-xxl">

                    <div className="h-right d-flex align-items-center order-1">

                        
                        <Dropdown className="notifications px-0 px-md-0">
                            <Dropdown.Toggle as="a" className="nav-link dropdown-toggle pulse">
                                <i className="icofont-alarm fs-2"></i>
                                <span className="badge bg-danger">{recentNotifications.length}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className=" dropdown-menu p-0 m-0">
                                <div className="card border-0 p-10 w380">
                                    <div className="card-header border-0 p-3">
                                        <h5 className="mb-0 font-weight-light d-flex justify-content-between">
                                            <span>Notifications</span>
                                            <span className="badge ">{recentNotifications.length}</span>
                                        </h5>
                                    </div>
                                    <div className="tab-content card-body">
                                        
    <div className="tab-pane fade show active">
    {!notifications || notifications.length === 0 ? (
          <div className="no-notifications">
            <p className="no-notifications-message">No notifications available.</p>
            <video className="no-notifications-video" autoPlay loop muted>
              <source src="https://cdn-icons-mp4.flaticon.com/512/13896/13896289.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
            <ul className="list-unstyled list mb-0">
                {notifications.map((notification, index) => (
                    <li key={index} className="py-2 mb-1 border-bottom">
                        <a className="d-flex">
                            <img
                                className="avatar rounded-circle"
                                src={`http://localhost:3000/api/${notification.actorType}/get-profile-photo/${notification.emailActor}`}
                                alt=""
                            />
                            <div className="flex-fill ms-2">
                                <p className="d-flex justify-content-between mb-0">
                                    <span className="font-weight-bold">{notification.emailActor}</span>
                                    <small>{formatDistanceToNow(new Date(notification.date))}</small>
                                </p>
                                <span>{notification.actionType}</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        )}
    </div>
</div>

                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="dropdown user-profile ms-2 ms-sm-3 d-flex align-items-center">
                            <div className="u-info me-2">
                                <p className="mb-0 text-end line-height-sm "><span className="font-weight-bold">{Name}</span></p>
                                <small>{role}</small>
                            </div>
                            <Dropdown.Toggle as="a" className="nav-link dropdown-toggle pulse p-0">
                                <img className="avatar lg rounded-circle img-thumbnail"   src={`http://localhost:3000/api/${role}/get-profile-photo/${email}`}alt="profile" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-1 m-0">
                                <div className="card border-0 w280">
                                    <div className="card-body pb-0">
                                        <div className="d-flex py-1">
                                            <img className="avatar rounded-circle"  src={`http://localhost:3000/api/${role}/get-profile-photo/${email}`}alt="profile" />
                                            <div className="flex-fill ms-3">
                                                <p className="mb-0"><span className="font-weight-bold">Dylan Hunter</span></p>
                                                <small className="">{email}</small>
                                            </div>
                                        </div>

                                        <div><hr className="dropdown-divider border-dark" /></div>
                                    </div>
                                    <div className="list-group m-2 ">

                                    {role === "Devellopeurs" && (
                                            <Link to="/template/my-task/react/ProjectManagement" className="list-group-item list-group-item-action border-0 ">
                                                <i className="icofont-tasks fs-5 me-3"></i>Scrum-Wave
                                            </Link>
                                        )}
                                        {role === "ProductOwners" && (
                                            <Link to="/template/my-task/react/hr-dashboard" className="list-group-item list-group-item-action border-0 ">
                                                <i className="icofont-tasks fs-5 me-3"></i>View Dashboard
                                            </Link>
                                        )}
                                        {role === "scrumMasters" && (
                                            <Link to="/template/my-task/react/tickets-detail" className="list-group-item list-group-item-action border-0 ">
                                                <i className="icofont-tasks fs-5 me-3"></i>View Tickets
                                            </Link>
                                        )}

                                        <Link to="members" className="list-group-item list-group-item-action border-0 "><i className="icofont-ui-user-group fs-6 me-3"></i>members</Link>
                                       
                                        <button onClick={() => handleLogout(id, role, setToken, navigate)} className="list-group-item list-group-item-action border-0">
                                            <i className="icofont-logout fs-6 me-3"></i>Signout
                                        </button>
                                      
                                    </div>
                                </div>
                             
                            </Dropdown.Menu>
                        </Dropdown>
                     

                    <button className="navbar-toggler p-0 border-0 menu-toggle order-3"
                        onClick={() => {
                            var side = document.getElementById("mainSideMenu");
                            if (side) {
                                if (side.classList.contains("open")) {
                                    side.classList.remove("open")
                                } else {
                                    side.classList.add("open")
                                }
                            }
                        }}
                    >
                        <span className="fa fa-bars"></span>
                    </button>
                    </div>

                    <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">
                        <div className="input-group flex-nowrap input-group-lg">
                            <button type="button" className="input-group-text" id="addon-wrapping"><i className="fa fa-search"></i></button>
                            <input type="search" className="form-control" placeholder="Search" aria-label="search" aria-describedby="addon-wrapping" />
                            <button type="button" className="input-group-text add-member-top" onClick={() => { setIsAddUserModa(true) }}><i className="fa fa-plus"></i></button>
                        </div>
                    </div>

                </div>
            </nav>
            <AddNewUserModal show={isAddUserModa} onClose={() => { setIsAddUserModa(false) }} />
        </div>
        
    )
}




export default Header;  