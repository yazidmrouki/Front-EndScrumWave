import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";

import Page404 from "../components/Auth/Page404";
import SignIn from "../components/Auth/SignIn";
import Signup from "../components/Auth/Signup";
import ResetPassword from "../components/Auth/ResetPassword";
import VerifierEmail from "../components/Auth/VerifierEmail";

const AuthIndex = () => {
    
    return(
    
                    
                    <ReactRoutes>
                    <Route exact path={`${process.env.PUBLIC_URL}/`} element={<SignIn/>} /> 
                        <Route exact path={`${process.env.PUBLIC_URL}/sign-in`} element={<SignIn/>} /> 
                        <Route exact path={`${process.env.PUBLIC_URL}/sign-up`} element={<Signup/>} />
                        <Route exact path={`${process.env.PUBLIC_URL}/Verifier-email`} element={<VerifierEmail/>} />
                        <Route exact path={`${process.env.PUBLIC_URL}/Reset-password`} element={<ResetPassword/>} />
                        <Route exact pathz={`${process.env.PUBLIC_URL}/page-404`} element={<Page404/>} />
                    </ReactRoutes>
                   
    )
}

export default AuthIndex