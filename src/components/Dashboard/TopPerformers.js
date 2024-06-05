import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar2 from "../../assets/images/lg/avatar2.jpg";
import Avatar3 from "../../assets/images/lg/avatar3.jpg";
import Avatar5 from "../../assets/images/lg/avatar5.jpg";
import Avatar8 from "../../assets/images/lg/avatar8.jpg";
import Avatar9 from "../../assets/images/lg/avatar9.jpg";
import Avatar12 from "../../assets/images/lg/avatar12.jpg";
import './Css.css';
function TopPerformers() {
  const [topDev, setTopDev] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [completedTickets, setCompletedTickets] = useState(0);
  const [firstDev, setFirstDev] = useState(null); // État pour suivre le premier développeur
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/ProductOwners/top-developers/${email}`
        );
        setTopDev(response.data.TopDev);
        setTotalTickets(response.data.totalTickets);
        setCompletedTickets(response.data.completedTickets);
        // Définir le premier développeur
        if (response.data.TopDev.length > 0) {
          setFirstDev(response.data.TopDev[0].email);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card light-danger-bg">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Top Performers</h6>
      </div>
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-12 col-lg-4 col-xl-4 col-xxl-2">
            <p>
              You have {totalTickets}{" "}
              <span className="fw-bold">tickets </span> in total.
            </p>
            <div className="d-flex  justify-content-between text-center">
              <div className="">
                <h3 className="fw-bold">{totalTickets}</h3>
                <span className="small">Total Tickets</span>
              </div>
              <div className="">
                <h3 className="fw-bold">{completedTickets}</h3>
                <span className="small">Tickets Completed</span>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-10">
            <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-6 row-deck top-performer">
            {topDev.map((dev, index) => (
  <div className="col" key={index}>
    <div
      className={`card shadow ${
        dev.email === firstDev ? "start-animation" : ""
      }`}
    >
      {index === 0 && ( // Check if the current developer is the first developer
        <div className="award-icon">
          <video className="award-video" autoPlay loop muted>
            <source src="https://cdn-icons-mp4.flaticon.com/512/13311/13311751.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {index === 1 && ( // Check if the current developer is the second developer
        <div className="award-icon">
          <video className="award-video" autoPlay loop muted>
            <source src="https://cdn-icons-mp4.flaticon.com/512/13311/13311714.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <div className="card-body text-center d-flex flex-column justify-content-center">
        <img
          className="avatar lg rounded-circle img-thumbnail mx-auto"
          src={`http://localhost:3000/api/Devellopeurs/get-profile-photo/${dev.email}`}
          alt="profile"
        />
        <h6 className="fw-bold my-2 small-14">{dev.email}</h6>
        <span className="text-muted mb-2">@{dev.type}</span>
        <h4 className="fw-bold text-primary fs-3">
          {Math.round(dev.score)}%
        </h4>
      </div>
    </div>
  </div>
))}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopPerformers;
