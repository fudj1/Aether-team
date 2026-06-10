import { Card } from 'antd';
import { Column, Pie, Line } from '@ant-design/charts';

const defaultData = [
    { type: 'Jan', value: 120 },
    { type: 'Feb', value: 90 },
    { type: 'Mar', value: 140 },
];

const ChartRenderer = ({ component }) => {
    const type = component.type;

    const data = component.data?.rows || defaultData;

    const color =
        component.props?.color ||
        '#1677ff';

    let chart = null;

    const pieColors = {
        '#1677ff': [
            '#1677ff',
            '#4096ff',
            '#69b1ff',
            '#91caff',
            '#bae0ff',
        ],

        '#52c41a': [
            '#52c41a',
            '#73d13d',
            '#95de64',
            '#b7eb8f',
            '#d9f7be',
        ],

        '#f5222d': [
            '#f5222d',
            '#ff4d4f',
            '#ff7875',
            '#ffa39e',
            '#ffccc7',
        ],

        '#fa8c16': [
            '#fa8c16',
            '#ffa940',
            '#ffc069',
            '#ffd591',
            '#ffe7ba',
        ],
    };

    if (type === 'pie-chart') {
        chart = (
            <Pie
                data={data}
                angleField="value"
                colorField="type"
                height={250}
                scale={{
                    color: {
                        range:
                            pieColors[color] ||
                            pieColors['#1677ff'],
                    },
                }}
            />
        );
    }
    if (type === 'line-chart') {
        chart = (
            <Line
                data={data}
                xField="type"
                yField="value"
                height={250}
                style={{
                    stroke: color,
                    lineWidth: 3,
                }}
            />
        );
    }
    if (type === 'histogram') {
        chart = (
            <Column
                data={data}
                xField="type"
                yField="value"
                height={250}
                style={{
                    fill: color,
                }}
            />
        );
    }
    return (
        <Card
            title={
                component.props?.title ||
                'График'
            }
        >
            {chart}
        </Card>
    );
};

export default ChartRenderer;