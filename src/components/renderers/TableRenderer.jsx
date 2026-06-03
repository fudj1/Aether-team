import { Card, Table } from 'antd';

const defaultColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];

const defaultData = [
    {
        key: '1',
        name: 'Ivan',
        role: 'Manager',
    },
    {
        key: '2',
        name: 'Anna',
        role: 'Administrator',
    },
];

const TableRenderer = ({ component }) => {
    const columns = component.data?.columns || defaultColumns;
    const dataSource = component.data?.rows || defaultData;

    return (
        <Card className="min-h-full min-w-full" title={component.props?.title || 'Таблица'}>
            <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
            />
        </Card>
    );
};

export default TableRenderer;