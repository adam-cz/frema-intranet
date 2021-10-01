import { Steps } from 'antd';

const { Step } = Steps;

const Kroky = ({ uzivatel, operace }) => {
  return (
    <Steps>
      <Step
        title={'Čekám na identifikaci zaměstnance'}
        description={'Prosím přiložte svou čipovou kartu ke čtečce'}
      />
      <Step
        title={'Načtení operace'}
        // subTitle={time.active ? `Zbývá ${time.time / 1000}s` : ''}
        description={'Nejdřive je potřeba identifikovat zaměstnance'}
      />
    </Steps>
  );
};

export default Kroky;
