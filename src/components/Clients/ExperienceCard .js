import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const formatDate = (dateStr) => {
    if (!dateStr) return 'Présent';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const ExperienceCard = ({ experience }) => {
    return (
        <div className="experience-card primary">
            <div className="experience-icon">
                {/* Remplacer ceci par l'icône de la société si disponible */}
                <i class="fa fa-building" aria-hidden="true"></i>
            </div>
            <div className="experience-content primary">
                <h5 className="experience-title">{experience.title}</h5>
                <p className="experience-dates">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                    {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                </p>
            </div>
        </div>
    );
};

export default ExperienceCard;
