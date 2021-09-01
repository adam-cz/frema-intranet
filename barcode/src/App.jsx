import { Layout } from 'antd';
import './app.css';
import Steper from './components/steper/Steper';
import { useState } from 'react';
import Details from './components/details/Details';

const { Header, Content, Footer } = Layout;

function App() {
  const [step, setStep] = useState(0);
  return (
    <Layout className="layout">
      <Header>
        <img src={'/frema_logo.svg'} className="logo-svg" alt="logo" />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <div className="steper">
            <Steper step={step} />
          </div>
          <div className="detail">
            <Details step={step} setStep={setStep} />
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Frema a.s. ©2021</Footer>
    </Layout>
  );
}

export default App;
