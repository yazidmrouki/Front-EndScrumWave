import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GoogleImg from "../../assets/images/google.svg";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeftSide from "./LeftSide";

function SignIn (){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Devellopeurs');

    useEffect(() => {
        const timeout = setTimeout(() => {
            toast.dismiss();
        }, 5000); // Masquer l'alerte après 5 secondes

        return () => clearTimeout(timeout);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Envoyer une requête POST au backend avec les informations d'identification
            const response = await axios.post(`http://localhost:3000/api/${role}/signin`, {
                email: email,
                password: password
            });

            // Stocker le token renvoyé par le backend dans le localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', role);
            localStorage.setItem('email', email);
            toast.success('Connexion réussie !');
            // Rediriger l'utilisateur vers la page appropriée après la connexion
        

            // Rediriger l'utilisateur vers la page appropriée après un délai de 2 secondes
            setTimeout(() => {
                window.location.href = `${process.env.PUBLIC_URL}/hr-dashboard`;
            }, 800);
        } catch (error) {
            toast.error(error.response.data.message); // Afficher l'erreur avec toast.error
        }
    };

    const handleSignUpClick = () => {
        // Rediriger l'utilisateur vers la page d'inscription
        window.location.href = `${process.env.PUBLIC_URL}/sign-up`;
    };

    const handleForgotPasswordClick = () => {
        // Rediriger l'utilisateur vers la page de récupération de mot de passe
        window.location.href = `${process.env.PUBLIC_URL}/Verifier-email`;
    };

    return(
        <div className="main p-2 py-3 p-xl-5 ">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="body d-flex p-0 p-xl-5">
                <div className="container-xxl">
                    <div className="row g-0">
                        <LeftSide />
                        <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                            <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{maxWidth: "32rem"}}>
                                <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
                                    <div className="col-12 text-center mb-1 mb-lg-5">
                                        <h1>Sign in</h1>
                                        <span>Free access to our dashboard.</span>
                                    </div>
                                    <div className="col-12 text-center mb-4">
                                        <a className="btn btn-lg btn-outline-secondary btn-block" href="#!">
                                            <span className="d-flex justify-content-center align-items-center">
                                                <img className="avatar xs me-2" src={GoogleImg} alt="Imag Description" />
                                                Sign in with Google
                                            </span>
                                        </a>
                                        <span className="dividers text-muted mt-4">OR</span>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-2">
                                            <label className="form-label">Email address</label>
                                            <input type="email" className="form-control form-control-lg" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-2">
                                            <div className="form-label">
                                                <span className="d-flex justify-content-between align-items-center">
                                                    Password
                                                    <Link className="text-secondary" to="password-reset" onClick={handleForgotPasswordClick}>Forgot Password?</Link>
                                                </span>
                                            </div>
                                            <input type="password" className="form-control form-control-lg" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-2">
                                            <label className="form-label">Role</label>
                                            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                                                <option value="Devellopeurs">Devellopeurs</option>
                                                <option value="ProductOwners">ProductOwners</option>
                                                <option value="scrumMasters">scrumMasters</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center mt-4">
                                        <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase" atl="signin">SIGN IN</button>
                                    </div>
                                    <div className="col-12 text-center mt-4">
                                        <span className="text-muted">Don't have an account yet? <span className="text-secondary" onClick={handleSignUpClick}>Sign up here</span></span>
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

export default SignIn;
