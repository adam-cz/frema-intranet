import './Barcode.css';
import { useRef } from 'react';
import SingleOperBarcode from './SingleOperBarcode';

export const Barcodes = ({ data: operace }) => {
  const postupy = [...new Set(operace.map((operace) => operace.opv.trim()))];
  const pocet = useRef(null);
  console.log(operace);
  const setPocet = (operace, postup) => {
    pocet.current = operace.filter(
      (op) =>
        op.opv.trim() === postup && op.stredisko !== 999 && op.stredisko !== 500
    ).length;
  };

  return (
    <div className="page">
      {postupy.map((postup) => (
        <div className="zalamovani" key={postup.opv}>
          {setPocet(operace, postup)}
          {pocet.current > 0 && (
            <>
              <h1
                style={{ marginBottom: '5px' }}
                key={postup}
                className="nadpis"
              >
                Číslo ZP {postup}
              </h1>
              <p style={{ marginBottom: '0px' }}>
                Objednávka: <b>{operace[0].objednavka} </b>
              </p>
              <p>
                Výkres:
                <b>
                  {operace.find((operace) => operace.opv === postup).vykres}
                </b>
              </p>
            </>
          )}
          {[...operace]
            .sort((a, b) => parseInt(a.polozka) - parseInt(b.polozka))
            .map(
              (operace) =>
                operace.opv.trim() === postup &&
                operace.stredisko !== 999 && //vynecha vyvadeni z vyroby
                operace.stredisko !== 500 && ( // vynecha kooperace
                  <SingleOperBarcode
                    operace={operace}
                    key={`${operace.opv}_${operace.polozka}_${operace.stroj}`}
                  />
                )
            )}
        </div>
      ))}
    </div>
  );
};
