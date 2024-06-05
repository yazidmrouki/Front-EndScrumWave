import React from "react";
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";

import SignIn from "../components/Auth/SignIn";
import Page404 from "../components/Auth/Page404";
import Signup from "../components/Auth/Signup";
import ResetPassword from "../components/Auth/ResetPassword";
import VerifierEmail from "../components/Auth/VerifierEmail";

const AuthIndex = () => {
  // Vérifier si le token est vide
  const token = localStorage.getItem('token');
  if (!token) {
    // Si le token est vide, rediriger vers le composant AuthIndex
    return (
      <ReactRoutes>
        <Route path={`${process.env.PUBLIC_URL}/`} element={<SignIn />} />
        <Route path={`${process.env.PUBLIC_URL}/sign-in`} element={<SignIn />} />
        <Route path={`${process.env.PUBLIC_URL}/sign-up`} element={<Signup />} />
        <Route path={`${process.env.PUBLIC_URL}/Verifier-email`} element={<VerifierEmail />} />
        <Route path={`${process.env.PUBLIC_URL}/Reset-password`} element={<ResetPassword />} />
        <Route path="*" element={<SignIn />} />
      </ReactRoutes>
    );
  }

  
};

export default AuthIndex;
