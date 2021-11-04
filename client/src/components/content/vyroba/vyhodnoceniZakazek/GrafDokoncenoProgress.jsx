import { Bullet } from '@ant-design/charts';
import { AlipaySquareFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const GrafDokoncenoProgress = ({ operaceFiltr: operace }) => {
  console.log(operace);

  const data = [
    {
      title: 'Operace',
      plan_vyroba: [
        operace.reduce((total, current) => total + current.planvyroba, 0),
      ],
      odvedeno: [
        operace.reduce((total, current) => total + current.odvedeno, 0),
      ],
    },
  ];
  const config = {
    data: data,
    meta: {
      ve_vyrobe: {
        values: [
          operace.reduce((total, current) => total + current.vevyrobe, 0),
        ],
      },
    },
    measureField: 'odvedeno',
    rangeField: 'plan_vyroba',
    targetField: 've_vyrobe',
    xField: 'title',
    layout: 'vertical',
    color: {
      range: '#f0efff',
      measure: '#5B8FF9',
      target: '#3D76DD',
    },
    xAxis: { line: null },
    yAxis: {
      tickMethod: function tickMethod(_ref) {
        var max = _ref.max;
        var interval = Math.ceil(max / 5);
        return [0, interval, interval * 2, interval * 3, interval * 4, max];
      },
    },
    legend: {
      custom: true,
      position: 'bottom',
      items: [
        {
          value: 'Dokončenost',
          name: 'Dokončenost',
          marker: {
            symbol: 'square',
            style: {
              fill: '#5B8FF9',
              r: 5,
            },
          },
        },
      ],
    },
  };
  return <Bullet {...config} />;
};
export default GrafDokoncenoProgress;
