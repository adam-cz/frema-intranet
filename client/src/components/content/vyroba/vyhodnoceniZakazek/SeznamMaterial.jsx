import React from 'react';

const SeznamMaterial = ({ operaceFiltr: operace }) => {
  return <div>{operace && console.log(operace)}Materiál</div>;
};

export default SeznamMaterial;
