import './Barcode.css';
import { useRef } from 'react';
import SingleOperBarcode from './SingleOperBarcode';

export const Barcodes = ({ data: operace }) => {
  const postupy = [...new Set(operace.map((operace) => operace.opv.trim()))];
  const pocet = useRef(null);

  const setPocet = (operace, postup) => {
    pocet.current = operace.filter(
      (op) =>
        op.opv.trim() === postup && op.stredisko !== 999 && op.stredisko !== 500
    ).length;
  };

  return (
    <div className="page">
      {postupy.map((postup) => (
        <div className="zalamovani">
          {setPocet(operace, postup)}
          {pocet.current > 0 && (
            <h1 className="nadpis">Operace pro ZP {postup}</h1>
          )}
          {operace.map((operace) => {
            if (
              operace.opv.trim() === postup &&
              operace.stredisko !== 999 && //vynecha vyvadeni z vyroby
              operace.stredisko !== 500 // vynecha kooperace
            )
              return (
                <SingleOperBarcode
                  operace={operace}
                  key={`${operace.opv}_${operace.polozka}`}
                />
              );
          })}
        </div>
      ))}
    </div>
  );
};
