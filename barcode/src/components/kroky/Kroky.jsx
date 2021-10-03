import { Steps } from 'antd';

const { Step } = Steps;

const Kroky = ({ uzivatel, odpocet }) => {
  return (
    <Steps current={!uzivatel ? 0 : 1}>
      <Step
        title={
          !uzivatel
            ? 'Čekám na identifikaci uživatele'
            : uzivatel.jmeno
            ? `Uživatel ${uzivatel.jmeno} načten`
            : 'Uživatel uložen k pozdější identifikaci'
        }
        description={
          !uzivatel
            ? 'Prosím přiložte svou čipovou kartu ke čtečce'
            : uzivatel.procesy
            ? !uzivatel.procesy > 0
              ? 'Uživatel nemá žádné aktivní operace'
              : `Máte ${uzivatel.procesy.length} aktivní operace!`
            : ''
        }
      />
      <Step
        title={'Načtení operace'}
        subTitle={uzivatel ? `Zbývá ${odpocet.value}s` : null}
        description={
          !uzivatel
            ? 'čekám na identifikaci uživatele'
            : 'Načtěte prosím čárový kód operace'
        }
      />
    </Steps>
  );
};

export default Kroky;
