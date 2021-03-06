import { Alert, Descriptions, Row, Col, Space } from 'antd';
import { useState, useEffect } from 'react';
import prepocetVykazyZamestnance from '../../../../utils/prepocetStatistikyZamestnance';

const DetailZamestnance = ({ zamestnanci, vykazy }) => {
  /*

Jmeno
Celkova odpracovaná mzda
fond práce
z toho vykazano
z toho prestavky
produktivita (vyuziti pracovni doby)
produktivita (cas vykazu vs plan)

*/
  const [data, setData] = useState(null);

  useEffect(() => {
    if (vykazy) {
      setData(prepocetVykazyZamestnance(vykazy, zamestnanci));
    }
  }, [vykazy]);

  return (
    <div>
      {zamestnanci.length > 1 && (
        <Alert
          message="Zobrazená data zahrnují všechny zaměstnance z vybraného časového rozmezí. Pro statistiky konkrétního zaměstnance nastavte filtr"
          type="warning"
          showIcon
        />
      )}
      <Row>
        <Col span={8}>
          <Descriptions colon={1} title="Obecné informace"></Descriptions>
        </Col>
        <Col span={8}>
          <Descriptions colon={1} title="Časové údaje"></Descriptions>
        </Col>
        <Col span={8}>
          <Descriptions colon={1} title="Mzdové údaje"></Descriptions>
        </Col>
      </Row>
    </div>
  );
};

export default DetailZamestnance;
