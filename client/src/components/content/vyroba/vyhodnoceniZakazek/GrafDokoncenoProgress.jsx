import { Bullet } from '@ant-design/charts';

const GrafDokoncenoProgress = ({ operaceFiltr: operace }) => {
  console.log(operace);
  var data = [
    {
      title: 'Dokončenost',
      ranges: [100],
      measures: [50],
      target: 85,
    },
  ];
  var config = {
    data: data,
    measureField: 'measures',
    rangeField: 'ranges',
    targetField: 'target',
    xField: 'title',
    color: {
      range: '#f0efff',
      measure: '#5B8FF9',
      target: '#3D76DD',
    },
    xAxis: { line: null },
    yAxis: false,
    layout: 'vertical',
    label: {
      measure: {
        position: 'middle',
        style: { fill: '#fff' },
      },
    },
    legend: {
      custom: true,
      position: 'bottom',
      items: [
        {
          value: 'Vykázané operace',
          name: 'Vykázané operace',
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
