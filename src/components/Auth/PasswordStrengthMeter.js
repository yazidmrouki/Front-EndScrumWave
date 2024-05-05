const PasswordStrengthMeter = ({ password }) => {
    // Conditions spécifiées
    const containsUpperCase = /[A-Z]/.test(password);
    const containsNumberOrSpecialChar = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const isOfSufficientLength = password.length >= 8;
    const isVeryGoodLength = password.length > 14;
  
    // Calcul du score de force en fonction du nombre de conditions remplies
    let strengthScore = 0;
    if (containsUpperCase) strengthScore++;
    if (containsNumberOrSpecialChar) strengthScore++;
    if (isOfSufficientLength) strengthScore++;
    if (isVeryGoodLength) strengthScore++;
  
    // Mapping du score de force à une étiquette
    let strengthLabel;
    switch (strengthScore) {
      case 0:
        strengthLabel = 'Very weak';
        break;
      case 1:
        strengthLabel = 'Weak';
        break;
      case 2:
        strengthLabel = 'Fair';
        break;
      case 3:
        strengthLabel = 'Good';
        break;
      case 4:
        strengthLabel = 'Very good';
        break;
      default:
        strengthLabel = 'Strong';
        break;
    }
  
    // Calcul de la largeur de la barre de progression en fonction du score de force
    const num = (strengthScore / 4) * 100;
  
    // Détermination de la couleur de la barre de progression en fonction du score de force
    let progressColor;
    if (strengthScore === 0) {
      progressColor = '#828282';
    } else if (strengthScore === 1) {
      progressColor = '#EA1111';
    } else if (strengthScore === 2) {
      progressColor = '#FFAD00';
    } else if (strengthScore === 3) {
      progressColor = '#9bc158';
    } else {
      progressColor = '#00b500';
    }
  
    return (
      <>
        <div className="progress" style={{ height: '7px' }}>
          <div className="progress-bar" style={{ width: `${num}%`, background: progressColor, height: '100%' }}></div>
        </div>
        <p style={{ color: progressColor }}>{strengthLabel}</p>
      </>
    );
  };
  
  export default PasswordStrengthMeter;
  