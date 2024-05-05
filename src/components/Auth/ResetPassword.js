import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import LeftSide from "./LeftSide";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const storedRole = localStorage.getItem("role");
  const storedEmail = localStorage.getItem("email");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Réinitialiser les erreurs
      setErrors({});

      // Vérification que les mots de passe correspondent
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
    
        
        return;
      }

      const response = await axios.post(`http://localhost:3000/api/${storedRole}/reset-password-email`, {
        email: storedEmail,
        password: password
      });

      if (response.status === 200) {
        toast.success("Email envoyé avec les instructions de réinitialisation");
        window.location.href = `${process.env.PUBLIC_URL}/sign-in`;
      } else {
        console.error("Error sending email:", response.data);
        toast.error("Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.password) {
       

        toast.error(error.response.data.errors.password);
        
      } else {
        toast.error("Erreur lors de l'envoi de l'email: " + error.response.data.error);
      }
      if (error.response && error.response.data && error.response.data.errors) {
       
        setErrors(error.response.data.errors);
     
    }

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
                    <h1>Réinitialiser le mot de passe</h1>
                    <span>Entrez l'adresse email que vous avez utilisée lors de votre inscription et votre nouveau mot de passe. Nous vous enverrons un email avec un lien pour confirmer la réinitialisation de votre mot de passe.</span>
                  </div>
                  <div className="col-12">
                                        <div className="mb-2">
                                            <label className="form-label">Password</label>
                                            <input type="password" className={`form-control form-control-lg ${errors && errors.password ? 'is-invalid' : ''}`} placeholder="8+ characters required" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <br></br>
                                            <PasswordStrengthMeter password={password} />
                                            {errors && errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                           
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-2">
                                            <label className="form-label">Confirm password</label>
                                            <input type="password" className={`form-control form-control-lg ${errors && errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="8+ characters required" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            {errors && errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                        </div>
                                    </div>
                  
                  <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">Envoyer</button>
                  </div>
                  <div className="col-12 text-center mt-4">
                    <span className="text-muted">
                      <Link to={`${process.env.PUBLIC_URL}/sign-in`} className="text-secondary">Retour à la connexion</Link>
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

export default ResetPassword;
