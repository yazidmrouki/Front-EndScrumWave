import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import AuthIndex from "./screens/AuthIndex";
import MainIndex from "./screens/MainIndex";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const handleLogout = async (id, role ,setToken, navigate) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/${role}/signout`, {
      developerId: id,
   
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      localStorage.removeItem('token');
      setToken(null);


      setTimeout(() => {
      
        navigate("/template/my-task/react/sign-in");
      }, 50);

    
      
      // Attendez 500 millisecondes avant de recharger la page
      setTimeout(() => {
        window.location.reload(true);
      }, 1);
    } else {
      console.error('Erreur lors de la déconnexion :', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error.message);
  }
};


function App(props) {
  
  // Déclarer l'état pour stocker le token
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  const role= localStorage.getItem('role');

  useEffect(() => {
    // Exécuter une seule fois au montage du composant
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Si un token est présent dans le localStorage, le mettre à jour dans l'état
      setToken(storedToken);
    }
  }, []); 

  // Rediriger vers le chemin de connexion si le token est null
 
  const renderContent = () => {
    if (!token ) {
      // Si aucun token n'est présent ou s'il est vide, afficher le composant de connexion
      return (
        <div id="mytask-layout" className="theme-indigo">
          <AuthIndex />
        </div>
      );
    } 
      return (
        <div id="mytask-layout" className="theme-indigo">
          <Sidebar />
          <MainIndex />
        </div>
      );
    };

  return (
    <div>
      {renderContent()}
    </div>
  );

};

export default App;
