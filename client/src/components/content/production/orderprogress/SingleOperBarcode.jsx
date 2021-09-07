import React from 'react';

const SingleOperBarcode = ({ operace }) => {
  return (
    <div className="operace">
      <div className="kod">
        <div className="popis">{operace.popis}</div>
        <div>
          <svg className="barcode" ref={operace.barcodeRef} />
        </div>
      </div>
      <div className="info">
        <span>
          Zakázkový postup: <b>{operace.opv}</b>
        </span>
        <span>
          Číslo operace: <b>{operace.polozka}</b>
        </span>
        <span>
          Kusů k výrobě: <b>{operace.planvyroba}</b>
        </span>
        <span>
          Normovaných minut na kus: <b>{operace.minut_nor}</b>
        </span>
      </div>
    </div>
  );
};

export default SingleOperBarcode;
