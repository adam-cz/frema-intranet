import { Steps } from 'antd';

const { Step } = Steps;

const Steper = ({ step, time }) => {
  return (
    <Steps current={step}>
      <Step
        title={step ? 'Dokončeno' : 'Čekám na identifikaci zaměstnance'}
        description={
          step
            ? 'Zaměstnanec načten'
            : 'Prosím přiložte svou čipovou kartu ke čtečce'
        }
      />
      <Step
        title={step ? 'Čekám na načtení operace' : 'Načtení operace'}
        subTitle={time ? `Zbývá ${time / 1000}s` : ''}
        description={
          step
            ? 'Načtěte prosím čárový kód operace'
            : 'Nejdřive je potřeba identifikovat zaměstnance'
        }
      />
    </Steps>
  );
};

export default Steper;
