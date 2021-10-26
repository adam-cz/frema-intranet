import './app.css';
import { Layout, Tag, Row, Col } from 'antd';

import { useState, useEffect } from 'react';
import * as api from './api';

import Kroky from './components/kroky/Kroky';
import CarovyKod from './components/carovyKod/CarovyKod';
import Karta from './components/karta/Karta';
import AktivniProcesy from './components/aktivniProcesy/AktivniProcesy';

//Udává dobu v sekundách kdy se po načtení uživatele přepne interface z načítání čár. kódu zpět k načtení uživatele
const initOdpocet = 10;
const { Header, Content, Footer } = Layout;

function App() {
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [uzivatel, setUzivatel] = useState(null);
  const [odpocet, setOdpocet] = useState({
    initValue: initOdpocet,
    value: initOdpocet,
  });
  const uploadVykazy = async () => {
    let vykazy = JSON.parse(localStorage.getItem('vykazy'));
    console.log(vykazy);
    if (vykazy) {
      while (vykazy.length > 0) {
        try {
          const vykaz = vykazy.shift();
          const uzivatel = await api.verifyCardId(vykaz.uzivatel.rfid);
          if (uzivatel.data.status === 'error')
            console.log(`Uživatel s RFID ${vykaz.uzivatel.rfid} neexistuje`);
          if (uzivatel.data.status === 'success') {
            const operace = await api.setProces(
              vykaz.scanKod,
              uzivatel.data.employee,
              vykaz.cas
            );
            console.log(
              uzivatel.data.employee.jmeno,
              ' - ',
              operace.data.message
            );
          }
        } catch (err) {
          console.log('Neočekávaná chyba ', err);
        }
      }
      if (vykazy.length > 0)
        localStorage.setItem('vykazy', JSON.stringify(vykazy));
      else localStorage.clear();
    }
  };

  useEffect(() => {
    const isAvailable = async (interval) => {
      const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, 300, 'Request timed out');
      });
      const request = api.ping();
      return Promise.race([timeout, request])
        .then(async (response) => {
          if (offline) {
            if (interval) clearInterval(interval);
            setOffline(false);
            await uploadVykazy();
          }
          console.log('Spojení aktivní');
        })
        .catch((error) => {
          if (!offline) setOffline(true);
          console.log(error);
          console.log('Připojení není dostupné');
        });
    };
    if (!offline) isAvailable();
    if (offline) {
      const interval = setInterval(() => isAvailable(interval), 10000);
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
          <Row justify="center" align="middle">
            <Col span={8}>
              {uzivatel?.procesy.length > 0 && (
                <AktivniProcesy uzivatel={uzivatel} />
              )}
            </Col>
            <Col span={8}>
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
            </Col>
            <Col span={8}></Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Frema a.s. ©2021</Footer>
    </Layout>
  );
}

export default App;
