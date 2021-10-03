import { useBarcode } from 'react-barcodes';

const options = {
  displayValue: false,
  height: 50,
  width: 1.8,
};

const SingleOperBarcode = ({ operace }) => {
  const barcodes = operace.stroje.map((stroj) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { inputRef: barcodeRef } = useBarcode({
      value: `${operace.opv.trim()}_${operace.polozka}_${stroj.nazev}`,
      options,
    });
    return { nazev: stroj.nazev, barcodeRef };
  });

  return (
    <div className="operace">
      <div className="kod">
        <div className="popis">{operace.popis}</div>
        <div>
          {barcodes.map((barcode) => (
            <div className="barcode-divider">
              <b>{barcode.nazev !== 'NULL' && barcode.nazev}</b>
              <svg className="barcode" ref={barcode.barcodeRef} />
            </div>
          ))}
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
