import { Row, Col, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const GrafZiskovost = ({ operace, objednavkaDetail: objednavka }) => {
  console.log(operace, objednavka);
  const naklady = {
    skutecne: operace.reduce(
      (total, current) => total + current.nakl_celkem,
      0
    ),
    planovane: operace.reduce(
      (total, current) => total + current.nakl_celkem_plan,
      0
    ),
  };
  const procenta = {
    skutecnost:
      ((objednavka.cena_bez_dph - naklady.skutecne) / objednavka.cena_bez_dph) *
      100,
    plan:
      ((objednavka.cena_bez_dph - naklady.planovane) /
        objednavka.cena_bez_dph) *
      100,
  };

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Statistic
            title="Fakturovaná cena"
            value={objednavka.cena_bez_dph}
            groupSeparator="."
            decimalSeparator=","
            suffix="Kč"
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Skutečné náklady"
            value={naklady.skutecne}
            precision={0}
            groupSeparator="."
            decimalSeparator=","
            suffix="Kč"
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Skutečný zisk"
            value={objednavka.cena_bez_dph - naklady.skutecne}
            precision={0}
            groupSeparator="."
            decimalSeparator=","
            suffix="Kč"
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Skutečná marže"
            value={procenta.skutecnost}
            precision={2}
            valueStyle={
              procenta.skutecnost > 0
                ? { color: '#3f8600' }
                : { color: '#cf1322' }
            }
            prefix={
              procenta.skutecnost > 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="%"
          />
        </Col>
        <Col span={12}></Col>
        <Col span={4}>
          <Statistic
            title="Plánované náklady"
            value={naklady.planovane}
            precision={0}
            groupSeparator="."
            decimalSeparator=","
            suffix="Kč"
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Plánovaný zisk"
            value={objednavka.cena_bez_dph - naklady.planovane}
            precision={0}
            groupSeparator="."
            decimalSeparator=","
            suffix="Kč"
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Plánovaná marže"
            value={procenta.plan}
            precision={2}
            valueStyle={
              procenta.plan > 0 ? { color: '#3f8600' } : { color: '#cf1322' }
            }
            prefix={
              procenta.plan > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
            suffix="%"
          />
        </Col>
        <Col span={8}></Col>
      </Row>
    </>
  );
};
export default GrafZiskovost;
