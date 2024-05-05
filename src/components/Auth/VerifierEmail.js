import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeftSide from "./LeftSide";
function VerifierEmail() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Devellopeurs");
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate(); // Obtenir l'objet history

  const handleSubmit = async (event) => {
      event.preventDefault();

      const apiUrl = `http://localhost:3000/api/${role}/check-email?email=${email}`;

      try {
          const response = await axios.get(apiUrl);
          setEmailExists(response.data.exists);
          // Si l'e-mail existe, rediriger l'utilisateur vers l'étape de réinitialisation du mot de passe
          if (response.data.exists) {
              localStorage.setItem('role', role);
              localStorage.setItem('email', email);
              navigate(`${process.env.PUBLIC_URL}/Reset-password`);
          } else {
              // Si l'e-mail n'existe pas, afficher un toast
              toast.error("Cet e-mail n'existe pas.");
          }
      } catch (error) {
          console.error("Error checking email:", error);
      }
  };

  return (
    <div className="main p-2 py-3 p-xl-5 ">
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <div className="body d-flex p-0 p-xl-5">
        <div className="container-xxl">
            <div className="row g-0">
                <LeftSide />
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{ maxWidth: "32rem" }}>
        <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
          <div className="col-12 text-center mb-1 mb-lg-5">
            <h1>Forgot password?</h1>
            <span>
              Enter the email address you used when you joined and we'll send you instructions to reset your password.
            </span>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">Role</label>
              <select className="form-select form-select-lg" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Devellopeurs">Devellopeurs</option>
                <option value="scrumMasters">scrumMasters</option>
                <option value="ProductOwners">ProductOwners</option>
              </select>
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">
              SUBMIT
            </button>
          </div>
          {emailExists && (
            <div className="col-12 text-center mt-4">
              <span className="text-muted">
                Email exists.{" "}
                <Link to={`${process.env.PUBLIC_URL}/Reset-password`} className="text-secondary">
                  Reset Password
                </Link>
              </span>
            </div>
          )}
          <div className="col-12 text-center mt-4">
            <span className="text-muted">
              <Link to={`${process.env.PUBLIC_URL}/sign-in`} className="text-secondary">
                Back to Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    
  );
}

export default VerifierEmail;