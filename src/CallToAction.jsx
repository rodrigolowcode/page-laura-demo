import React, { useState } from 'react';
import './CallToAction.css';

function CallToAction() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const countryData = {
    '+1': { maxLength: 14, format: (number) => formatUSNumber(number) },  // US
    '+44': { maxLength: 15, format: (number) => formatUKNumber(number) }, // UK
    '+55': { maxLength: 15, format: (number) => formatBRNumber(number) }, // Brazil
    '+49': { maxLength: 15, format: (number) => number }, // Germany (Simplified)
    '+81': { maxLength: 13, format: (number) => formatJPNumber(number) }, // Japan
    '+351': { maxLength: 13, format: (number) => formatPTNumber(number) }, // Portugal
  };

    // Formatting functions (Simplified for demonstration)
  function formatUSNumber(number) {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return number;
  }

  function formatUKNumber(number) {
      const cleaned = ('' + number).replace(/\D/g, '');
      const match = cleaned.match(/^(\d{5})(\d{6})$/);
      if(match){
          return match[1] + ' ' + match[2];
      }
      return number;
  }

  function formatBRNumber(number) {
      const cleaned = ('' + number).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5}|\d{4})(\d{4})$/);
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return number;
  }

    function formatJPNumber(number) {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2,3})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return number;
  }

  function formatPTNumber(number) {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return number;
  }

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
    setPhoneNumber(''); // Clear the number when country changes
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleInputChange = (event) => {
    const inputNumber = event.target.value;
    const maxLength = countryData[countryCode]?.maxLength || 15; // Default maxLength

    // Basic input sanitization: Remove non-numeric characters
    let cleanedNumber = inputNumber.replace(/[^\d\s()-]/g, '');

    // Apply country-specific formatting
    cleanedNumber = countryData[countryCode] ? countryData[countryCode].format(cleanedNumber) : cleanedNumber;

    // Enforce maximum length
    const truncatedNumber = cleanedNumber.slice(0, maxLength);

    setPhoneNumber(truncatedNumber);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCallClick = () => {
    if (phoneNumber.trim() === '') {
      alert('Digite um número válido');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const fullPhoneNumber = countryCode + phoneNumber.replace(/\D/g, '');
    const requestBody = {
      phoneNumber: fullPhoneNumber,
    };

    fetch('https://primary-production-f625.up.railway.app/webhook/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Chamada iniciada com sucesso!');
        } else {
          setErrorMessage(`Erro: ${response.status}`);
        }
        setPhoneNumber('');
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(`Erro de rede: ${error}`);
        setLoading(false);
      });
  };

  return (
    <div className="call-to-action">
      <h1>Seja bem-vindo(a) à página de demonstração da Laura</h1>
      <p className="intro-text">
        Digite seu número de telefone abaixo e clique no botão para experimentar a conversa com a Laura
      </p>
      <div className="phone-input-container">
        <select
          value={countryCode}
          onChange={handleCountryCodeChange}
          className="country-code-select"
        >
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+55">🇧🇷 +55</option>
          <option value="+49">🇩🇪 +49</option>
          <option value="+81">🇯🇵 +81</option>
          <option value="+351">🇵🇹 +351</option>
        </select>
        <input
          type="tel"
          placeholder="(XX) XXXX-XXXX"
          value={phoneNumber}
          onChange={handleInputChange}
          className="phone-input"
        />
      </div>
      <button
        onClick={handleCallClick}
        className="call-button"
        disabled={loading}
      >
        {loading ? 'Iniciando...' : 'Iniciar conversa'}
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="explanatory-text">
        Observação: A Laura é uma tecnologia em desenvolvimento e este é um modo de demonstração, ela pode apresentar erros e falhas. Agradecemos sua compreensão e feedback.
      </p>
    </div>
  );
}

export default CallToAction;
