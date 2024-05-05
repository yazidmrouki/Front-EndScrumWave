import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import AuthIndex from "./screens/AuthIndex";
import MainIndex from "./screens/MainIndex";
import { useNavigate } from "react-router-dom";
function App(props) {
  // Déclarer l'état pour stocker le token
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Exécuter une seule fois au montage du composant
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Si un token est présent dans le localStorage, le mettre à jour dans l'état
      setToken(storedToken);
    }
  }, []); 

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    // Supprimer le token du localStorage et de l'état
    localStorage.removeItem('token');
    setToken(null);
    // Rediriger l'utilisateur vers la page de connexion
   navigate("/template/my-task/react/sign-in");
  };

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
            <button onClick={handleLogout} className="logout-btn>">Déconnecter</button>
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
