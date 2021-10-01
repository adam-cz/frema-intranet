export const translate = (char) => {
  console.log(char);
  if (char === 48) return '0';
  if (char === 49) return '1';
  if (char === 50) return '2';
  if (char === 51) return '3';
  if (char === 52) return '4';
  if (char === 53) return '5';
  if (char === 54) return '6';
  if (char === 55) return '7';
  if (char === 56) return '8';
  if (char === 57) return '9';
  if (char === 16) return '';
  if (char === 189) return '_';
  if (char === 69) return 'e';
  if (char === 73) return 'i';
  if (char === 76) return 'l';
  if (char === 77) return 'm';
  if (char === 78) return 'n';
  if (char === 79) return 'o';
  if (char === 80) return 'p';
  if (char === 85) return 'u';

  return String.fromCharCode(char);
};
