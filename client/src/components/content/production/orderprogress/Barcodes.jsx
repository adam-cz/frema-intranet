import React from 'react';
import { useBarcode } from 'react-barcodes';
import './Barcode.css';
import SingleOperBarcode from './SingleOperBarcode';

const options = {
  displayValue: false,
  height: 50,
  width: 1.8,
};

export const Barcodes = ({ data }) => {
  const operace = data.map((operace) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { inputRef: barcodeRef } = useBarcode({
      value: `${operace.opv.trim()}_${operace.polozka}_${operace.stroj}`,
      options,
    });
    return { ...operace, barcodeRef };
  });

  return (
    <>
      <div className="page">
        {operace.map((operace) => (
          <SingleOperBarcode operace={operace} key={operace.barcode} />
        ))}
      </div>
    </>
  );
};
