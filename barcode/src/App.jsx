import './app.css';
import { Layout, Tag } from 'antd';

import { useState, useEffect } from 'react';
import * as api from './api';

import Kroky from './components/kroky/Kroky';
import CarovyKod from './components/carovyKod/CarovyKod';
import Karta from './components/karta/Karta';

//Udává dobu v sekundách kdy se po načtení uživatele přepne interface z načítání čár. kódu zpět k načtení uživatele
const initOdpocet = 10;
const { Header, Content, Footer } = Layout;

function App() {
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [uzivatel, setUzivatel] = useState(null);
  const [odpocet, setOdpocet] = useState({
    initValue: initOdpocet,
    value: initOdpocet,
  });

  useEffect(() => {
    if (offline) {
      console.log('interval');
      const offlineInterval = setInterval(() => {
        api.ping().then(({ data }) => {
          console.log(data);
          setOffline(false);
          clearInterval(offlineInterval);
          console.log('spojení obnoveno');
        });
      }, 10000);
    }
  }, [offline]);

  return (
    <Layout className="layout">
      <Header className="header">
        <div>
          <img src={'/frema_logo.svg'} className="logo-svg" alt="logo" />
        </div>
        <div>
          {!offline ? (
            <Tag color="green">Terminál je ONLINE</Tag>
          ) : (
            <Tag color="red">Terminál je v OFFLINE režimu</Tag>
          )}
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <div className="steper">
            <Kroky uzivatel={uzivatel} odpocet={odpocet} />
          </div>
          <div className="detail">
            {uzivatel ? (
              <CarovyKod
                uzivatel={uzivatel}
                setUzivatel={setUzivatel}
                odpocet={odpocet}
                setOdpocet={setOdpocet}
                offline={offline}
                setOffline={setOffline}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <Karta
                setUzivatel={setUzivatel}
                loading={loading}
                setLoading={setLoading}
                offline={offline}
                setOffline={setOffline}
              />
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Frema a.s. ©2021</Footer>
    </Layout>
  );
}

export default App;
