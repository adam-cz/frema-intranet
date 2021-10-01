import './app.css';
import { Layout } from 'antd';

import { useState } from 'react';

import Kroky from './components/kroky/Kroky';
import CarovyKod from './components/carovyKod/CarovyKod';
import Karta from './components/karta/Karta';

const { Header, Content, Footer } = Layout;

function App() {
  const [uzivatel, setUzivatel] = useState(null);
  const [operace, setOperace] = useState(null);

  return (
    <Layout className="layout">
      <Header>
        <img src={'/frema_logo.svg'} className="logo-svg" alt="logo" />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <div className="steper">
            <Kroky uzivatel={uzivatel} operace={operace} />
          </div>
          <div className="detail">
            {uzivatel ? (
              <CarovyKod
                uzivatel={uzivatel}
                setUzivatel={setUzivatel}
                operace={operace}
                setOperace={setOperace}
              />
            ) : (
              <Karta uzivatel={uzivatel} setUzivatel={setUzivatel} />
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Frema a.s. ©2021</Footer>
    </Layout>
  );
}

export default App;
