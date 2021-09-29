import { Table, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

const formatter = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
const columns = [
  {
    title: 'Jméno zaměstnance',
    dataIndex: 'jmeno',
    key: 'jmeno',
  },
  {
    title: 'Hodinová sazba',
    dataIndex: 'sazba',
    key: 'sazba',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Celkem vykázáno (min.)',
    dataIndex: 'vykazano',
    key: 'vykazano',
    render: (value) => Math.round(value),
  },
  {
    title: 'Mzda',
    dataIndex: 'mzda',
    key: 'mzda',
    render: (value) => formatter.format(value),
  },
  {
    title: 'Činnost',
    dataIndex: 'cinnost',
    key: 'cinnost',
    render: (value) =>
      !value ? (
        <Tag color="green">Všechny výkazy dokončeny</Tag>
      ) : (
        <Tag color="orange">Aktivních operací: {value}</Tag>
      ),
  },
];

const SeznamMzdy = ({ operaceFiltr: operace }) => {
  const [loading, setLoading] = useState(true);
  const [vykazy, setVykazy] = useState(null);

  //Zpracuje výkazy z operací pro účely zobrazení rozpisu mezd
  useEffect(() => {
    if (operace) {
      const vykazyHelper = [];
      //Iteruje operace a následně jejich výkazy
      operace.forEach((op) => {
        op.vykazy?.forEach((vykaz) => {
          //Pokud v pomocné prom. nenalezne zaměstnance, vytvoří ho a připraví si pole pro stroje/operace se kterými pracoval
          if (
            !vykazyHelper.find(
              (vykazHelper) => vykazHelper.id === vykaz.operator_id
            )
          )
            vykazyHelper.push({
              id: vykaz.operator_id,
              jmeno: vykaz.operator_jmeno,
              sazba: vykaz.hodinovaMzda,
              operace: [],
            });
          //Uloží si zaměstnance z aktuálního výkazu do proměnné
          const zamestnanec = vykazyHelper.find(
            (vykazHelper) => vykazHelper.id === vykaz.operator_id
          );
          //Pokud stroj/operace neexistuje, vytvoří si ho a připraví pole pro výkazy daného stroje a zaměstnance
          if (
            !zamestnanec.operace.find(
              (operace) => operace.stroj === vykaz.stroj
            )
          ) {
            zamestnanec.operace.push({
              stroj: vykaz.stroj,
              opv: op.opv,
              polozka: op.polozka,
              zdroj: op.zdroj,
              popis: op.popis,
              vykazy: [],
            });
          }
          //Vytvoří pomocnou prom. pro stroj/operaci
          const stroj = zamestnanec.operace.find(
            (operace) => operace.stroj === vykaz.stroj
          );
          //V případě, že je výkaz první nebo je ten poslední ukončen, vytvoří nový záznam
          if (
            stroj.vykazy.length === 0 ||
            stroj.vykazy[stroj.vykazy.length - 1].stop
          )
            stroj.vykazy.push({ start: vykaz.cas });
          //NEBO v případě, že předchozí výkaz neni ukončen, ukončí ho a dopočítá trvání výkazu
          else {
            stroj.vykazy[stroj.vykazy.length - 1].stop = vykaz.cas;
            stroj.vykazy[stroj.vykazy.length - 1].trvaniMin =
              (new Date(stroj.vykazy[stroj.vykazy.length - 1].stop) -
                new Date(stroj.vykazy[stroj.vykazy.length - 1].start)) /
              1000 /
              60;
            stroj.vykazy[stroj.vykazy.length - 1].mzda =
              (vykaz.hodinovaMzda *
                stroj.vykazy[stroj.vykazy.length - 1].trvaniMin) /
              60;
          }
        });
      });
      //Doplní celkové mzdy
      vykazyHelper.forEach((vykaz) => {
        vykaz.operace.forEach((stroj) => {
          stroj.vykazano = stroj.vykazy.reduce(
            (total, current) => total + (current?.trvaniMin || 0),
            0
          );
          stroj.mzda = stroj.vykazy.reduce(
            (total, current) => total + (current?.mzda || 0),
            0
          );
          stroj.cinnost = stroj.vykazy?.find((vykaz) => !vykaz.stop) || false;
        });
        vykaz.mzda = vykaz.operace.reduce(
          (total, current) => total + current.mzda,
          0
        );
        vykaz.vykazano = vykaz.operace.reduce(
          (total, current) => total + current.vykazano,
          0
        );
        vykaz.cinnost = vykaz.operace.filter((stroj) => stroj.cinnost).length;
      });
      console.log(vykazyHelper);
      setVykazy(vykazyHelper);
      setLoading(false);
    }
  }, [operace]);

  const expandedRowRender = (vykazy) => {
    const expandedRowRender = (stroje) => {
      const columns = [
        {
          title: 'Start',
          dataIndex: 'start',
          key: 'start',
          render: (value) =>
            DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT),
        },
        {
          title: 'Stop',
          dataIndex: 'stop',
          key: 'stop',
          render: (value) =>
            value
              ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)
              : 'Výkaz není ukončen',
        },
        {
          title: 'Délka (min.)',
          dataIndex: 'trvaniMin',
          key: 'trvaniMin',
          render: (value) => (value ? Math.round(value) : 'Výkaz není ukončen'),
        },
        {
          title: 'Mzda',
          dataIndex: 'mzda',
          key: 'mzda',
          render: (value) => formatter.format(value),
        },
        {
          title: 'Činnost',
          dataIndex: 'cinnost',
          key: 'cinnost',
          render: (value, record) =>
            record.stop ? (
              <Tag color="green">Výkaz ukončen</Tag>
            ) : (
              <Tag color="orange">Činnost probíhá...</Tag>
            ),
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={stroje.vykazy}
          pagination={false}
          rowKey="start"
        />
      );
    };
    const columns = [
      {
        title: 'Stroj',
        dataIndex: 'stroj',
        key: 'stroj',
        render: (value) => (value === 'null' ? 'Výchozí stroj' : value),
      },
      { title: 'Zdroj', dataIndex: 'zdroj', key: 'zdroj' },
      { title: 'Popis', dataIndex: 'popis', key: 'popis' },
      { title: 'OPV', dataIndex: 'opv', key: 'opv' },
      {
        title: 'Položka',
        dataIndex: 'polozka',
        key: 'polozka',
      },
      {
        title: 'Vykázáno na stroji (min.)',
        dataIndex: 'vykazano',
        key: 'vykazano',
        render: (value) => Math.round(value),
      },
      {
        title: 'Mzda na stroji',
        dataIndex: 'mzda',
        key: 'mzda',
        render: (value) => formatter.format(value),
      },
      {
        title: 'Činnost',
        dataIndex: 'cinnost',
        key: 'cinnost',
        render: (value) =>
          value ? (
            <Tag color="orange">
              Operace aktivní od{' '}
              {DateTime.fromISO(value.start).toLocaleString(
                DateTime.TIME_24_SIMPLE
              )}
            </Tag>
          ) : (
            <Tag color="green">Všechny výkazy dokončeny</Tag>
          ),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={vykazy.operace}
        expandable={{ expandedRowRender }}
        pagination={false}
        rowKey="stroj"
      />
    );
  };

  return (
    <div>
      {console.log(operace)}
      <Table
        dataSource={vykazy}
        columns={columns}
        loading={loading}
        expandable={{ expandedRowRender }}
        rowKey="jmeno"
      />
    </div>
  );
};

export default SeznamMzdy;
