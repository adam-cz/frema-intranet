import { Steps } from 'antd';

const { Step } = Steps;

const Kroky = ({ uzivatel }) => {
  return (
    <Steps current={!uzivatel ? 0 : 1}>
      <Step
        title={
          !uzivatel
            ? 'Čekám na identifikaci zaměstnance'
            : `Uživatel ${uzivatel.jmeno} načten`
        }
        description={
          !uzivatel
            ? 'Prosím přiložte svou čipovou kartu ke čtečce'
            : !uzivatel.procesy > 0
            ? 'Uživatel nemá žádné aktivní operace'
            : `Máte ${uzivatel.procesy.length} aktivní operace!`
        }
      />
      <Step
        title={'Načtení operace'}
        // subTitle={time.active ? `Zbývá ${time.time / 1000}s` : ''}
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
