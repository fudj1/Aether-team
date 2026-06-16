import { Card, Table, Tag } from 'antd';

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

    const preparedColumns = columns.map((column) => {
        const preparedColumn = {
            ...column,

            sorter:
                component.data?.settings?.sortable
                    ? (a, b) =>
                        String(
                            a[column.dataIndex] || ''
                        ).localeCompare(
                            String(
                                b[column.dataIndex] || ''
                            )
                        )
                    : false,
        };

        if (column.type === 'status') {
            preparedColumn.render = (value) => {
                let color = 'default';

                if (value === 'Оплачен') {
                    color = 'green';
                }

                if (value === 'В работе') {
                    color = 'orange';
                }

                if (value === 'Отменен') {
                    color = 'red';
                }

                return (
                    <Tag color={color}>
                        {value}
                    </Tag>
                );
            };
        }

        return preparedColumn;
    });

    return (
        <Card
            className="min-h-full min-w-full"
            title={component.props?.title || 'Таблица'}
        >
            <Table
                columns={preparedColumns}
                dataSource={dataSource}
                pagination={
                    component.data?.settings?.pagination
                        ? {
                            pageSize:
                                component.data?.settings?.pageSize || 5,
                        }
                        : false
                }
            />
        </Card>
    );
};

export default TableRenderer;