import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "react-bootstrap";

function AllocatedTask({ userStories, productBacklog }) {
  const [fileNames, setFileNames] = useState({ userStories: [], productBacklog: [] });

  // Mettre à jour les noms de fichiers lorsque les props userStories et productBacklog changent
  useState(() => {
      setFileNames({ userStories: userStories, productBacklog: productBacklog });
  }, [userStories, productBacklog]);

  // Fonction pour télécharger un fichier
  const downloadFile = async (fileName) => {
      try {
          const response = await axios.get(`http://localhost:3000/api/ProductOwners/download/${fileName}`, {
              responseType: 'blob', // Indique que la réponse est un fichier
          });

          // Obtenez le type MIME à partir des en-têtes de réponse
          const contentType = response.headers['content-type'];

          // Créez une URL pour le fichier
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Créez un élément de lien pour le téléchargement
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);

          // Ajoutez le lien à la page et déclenchez le téléchargement
          document.body.appendChild(link);
          link.click();
      } catch (error) {
          console.error('Erreur lors du téléchargement du fichier :', error);
      }
  };

  // Affichage des noms des fichiers (pour vérification)
  console.log("userStories:", fileNames.userStories);
  console.log("productBacklog:", fileNames.productBacklog);

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0 fw-bold">Project Description</h5>
      </Card.Header>
      <Card.Body>
        <p className="mb-4">
          This project aims to revolutionize the user experience in online shopping by implementing cutting-edge UI/UX designs.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
          <Button variant="primary" className="me-md-2 mb-2 mb-md-0" onClick={() => downloadFile(fileNames.userStories[0])}>
            <span className="me-2">Download User Stories</span>
            <span className="badge bg-primary">New</span>
          </Button>
          <Button variant="secondary" onClick={() => downloadFile(fileNames.productBacklog[0])}>
            <span className="me-2">Download Product Backlog</span>
            <span className="badge bg-secondary">New</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AllocatedTask;
