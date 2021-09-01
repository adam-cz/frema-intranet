import { Steps } from 'antd';

const { Step } = Steps;

const Steper = ({ step }) => {
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
        subTitle={step ? 'Zbývá 00:00:08' : ''}
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
