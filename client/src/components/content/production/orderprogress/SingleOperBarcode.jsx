import React from 'react';

const SingleOperBarcode = ({ operace }) => {
  return (
    <div class="operace">
      <div class="kod">
        <div class="popis">{operace.popis}</div>
        <div>
          <svg class="barcode" ref={operace.barcodeRef} />
        </div>
      </div>
      <div class="info">
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
