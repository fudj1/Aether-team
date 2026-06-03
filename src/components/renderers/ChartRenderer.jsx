import { Card } from 'antd';
import { Column, Pie, Line } from '@ant-design/charts';
import { useEffect, useRef } from 'react';

const defaultData = [
  { type: 'Jan', value: 120 },
  { type: 'Feb', value: 90 },
  { type: 'Mar', value: 140 },
];

const ChartRenderer = ({ component }) => {


  const type = component.type;

  const data = component.data?.rows || defaultData;

  let ChartComponent = Column;

  if (type === 'line-chart') {
    ChartComponent = Line;
  }

  if (type === 'pie-chart') {
    ChartComponent = Pie;
  }

  const config =
    type === 'pie-chart' ? {
        data,
        angleField: 'value',
        colorField: 'type',
        height: 250,
      } 
      : {
        data,
        xField: 'type',
        yField: 'value',
        height: 250,
      };

  return (
    <Card className="min-h-full min-w-full" title={component.props?.title || 'График'}>
      <ChartComponent className="min-h-full min-w-full" {...config} />
    </Card>
  );
};

export default ChartRenderer;