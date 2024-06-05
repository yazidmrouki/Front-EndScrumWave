import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

function AllocatedTask({ userStories, productBacklog }) {
  const [fileNames, setFileNames] = useState({ userStories: [], productBacklog: [] });

  useEffect(() => {
    setFileNames({ userStories: userStories, productBacklog: productBacklog });
  }, [userStories, productBacklog]);

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/ProductOwners/download/${fileName}`, {
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'];
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
    }
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0 fw-bold">Project Description</h5>
      </Card.Header>
      <Card.Body>
        <p className="mb-4">
        Dans le cadre de la méthodologie ScrumWave, les user stories sont des descriptions concises des besoins fonctionnels du logiciel, formulées de manière accessible pour les utilisateurs finaux. Elles captent les objectifs utilisateurs essentiels et guident le développement du produit. Le sprint backlog, quant à lui, est une sélection spécifique de ces user stories, choisies pour être réalisées lors d'un sprint donné. Ensemble, ces éléments permettent à l'équipe de développement de rester concentrée sur la livraison incrémentielle de fonctionnalités tout en répondant aux besoins des utilisateurs finaux.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
          <Button variant="primary" className="me-md-2 mb-2 mb-md-0" onClick={() => downloadFile(fileNames.userStories[0])}>
            <FaDownload className="me-2" /> Télécharger les histoires utilisateur
          </Button>
          <Button className="bg-secondary" onClick={() => downloadFile(fileNames.productBacklog[0])}>
            <FaDownload className="me-2" /> Télécharger le backlog produit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AllocatedTask;
