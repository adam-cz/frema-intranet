export const isRfid = (rfid) => {
  const rfidRegex = new RegExp(/^\d{8}$/);
  return rfidRegex.test(rfid);
};

export const isBarcode = (barcode) => {
  const barcodeRegex = new RegExp(/^\d{10}_\d{1,3}_[A-Z0-9 ]+$/);
  return barcodeRegex.test(barcode);
};
