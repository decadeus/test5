// components/RowCount.js
import React from 'react';

const RowCount = ({ count }) => {
  return (
    <div className="text-sm text-gray-700 mb-4">
      Nombre de lignes: {count}
    </div>
  );
};

export default RowCount;
