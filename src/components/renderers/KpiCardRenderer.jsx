import { Card, Statistic } from 'antd';

const KpiCardRenderer = ({ component }) => {
    return (
        <Card
            style={{
                height: '100%',
            }}
        >
            <Statistic
                title={component.props?.title}
                value={component.data?.value}
                suffix={component.data?.suffix}
                valueStyle={{
                    color:
                        component.props?.color ||
                        '#1677ff',
                }}
            />
        </Card>
    );
};

export default KpiCardRenderer;