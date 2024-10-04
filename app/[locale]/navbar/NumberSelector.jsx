// NumberSelector.js
import React from 'react';

const NumberSelector = ({ selectedNumber, onNumberChange }) => {
  return (
    <div>
      <label htmlFor="number-select">Choisissez un nombre :</label>
      <select
        id="number-select"
        value={selectedNumber}
        onChange={(e) => onNumberChange(e.target.value ? Number(e.target.value) : '')} // Mettez à jour le nombre ou laissez vide
      >
        <option value="">Sélectionnez un nombre</option> {/* Option vide pour indiquer aucune sélection */}
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={13}>13</option>
      </select>
    </div>
  );
};

export default NumberSelector;
