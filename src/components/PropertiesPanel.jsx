import {
    Card,
    Input,
    Select,
    Button,
    Switch,
    InputNumber,
    Divider,
    Popconfirm
} from 'antd';
import { Trash2 } from 'lucide-react';

const PropertiesPanel = ({
    selectedComponent,
    onUpdate,
    onDelete,
}) => {
    if (!selectedComponent) {
        return (
            <div className="p-4 text-gray-400">
                Выберите компонент
            </div>
        );
    }

    const updateTitle = (value) => {
        onUpdate(selectedComponent.id, {
            props: {
                ...selectedComponent.props,
                title: value,
            },
        });
    };

    const updateColor = (value) => {
        onUpdate(selectedComponent.id, {
            props: {
                ...selectedComponent.props,
                color: value,
            },
        });
    };

    const updateKpiValue = (value) => {
        onUpdate(selectedComponent.id, {
            data: {
                ...selectedComponent.data,
                value: Number(value) || 0,
            },
        });
    };

    const updateKpiSuffix = (value) => {
        onUpdate(selectedComponent.id, {
            data: {
                ...selectedComponent.data,
                suffix: value,
            },
        });
    };

    return (
        <div className="p-4">
            <Card title="Свойства">
                <div className="mb-3">
                    <div className="mb-1">
                        Заголовок
                    </div>

                    <Input
                        value={
                            selectedComponent.props?.title || ''
                        }
                        onChange={(e) =>
                            updateTitle(e.target.value)
                        }
                    />
                </div>

                {selectedComponent.type !== 'table' && (
                    <div>
                        <div className="mb-1">
                            Цвет
                        </div>

                        <Select
                            className="w-full"
                            value={
                                selectedComponent.props?.color ||
                                '#1677ff'
                            }
                            onChange={updateColor}
                            options={[
                                {
                                    value: '#1677ff',
                                    label: 'Синий',
                                },
                                {
                                    value: '#52c41a',
                                    label: 'Зеленый',
                                },
                                {
                                    value: '#f5222d',
                                    label: 'Красный',
                                },
                                {
                                    value: '#fa8c16',
                                    label: 'Оранжевый',
                                },
                            ]}
                        />
                    </div>
                )}

                {selectedComponent.type === 'kpi-card' && (
                    <>
                        <div className="mt-4">
                            <div className="mb-1">
                                Значение
                            </div>

                            <Input
                                value={selectedComponent.data?.value ?? ''}
                                onChange={(e) =>
                                    updateKpiValue(e.target.value)
                                }
                            />
                        </div>

                        <div className="mt-4">
                            <div className="mb-1">
                                Суффикс
                            </div>

                            <Input
                                value={
                                    selectedComponent.data?.suffix || ''
                                }
                                onChange={(e) =>
                                    updateKpiSuffix(e.target.value)
                                }
                                placeholder="%"
                            />
                        </div>
                    </>
                )}

                {selectedComponent.type === 'table' && (
                    <>
                        <Divider>Колонки</Divider>

                        {(selectedComponent.data?.columns || []).map(
                            (column, index) => (
                                <Card
                                    key={column.key}
                                    size="small"
                                    className="mb-2"
                                >
                                    <Input
                                        className="mb-2"
                                        placeholder="Название"
                                        value={column.title}
                                        onChange={(e) => {
                                            const columns = [
                                                ...(selectedComponent.data?.columns || [])
                                            ];

                                            columns[index] = {
                                                ...columns[index],
                                                title: e.target.value,
                                            };

                                            onUpdate(selectedComponent.id, {
                                                data: {
                                                    ...selectedComponent.data,
                                                    columns,
                                                },
                                            });
                                        }}
                                    />

                                    <Select
                                        className="w-full mb-2"
                                        value={column.type || 'text'}
                                        onChange={(value) => {
                                            const columns = [
                                                ...(selectedComponent.data?.columns || [])
                                            ];

                                            columns[index] = {
                                                ...columns[index],
                                                type: value,
                                            };

                                            onUpdate(selectedComponent.id, {
                                                data: {
                                                    ...selectedComponent.data,
                                                    columns,
                                                },
                                            });
                                        }}
                                        options={[
                                            {
                                                value: 'text',
                                                label: 'Текст',
                                            },
                                            {
                                                value: 'number',
                                                label: 'Число',
                                            },
                                            {
                                                value: 'date',
                                                label: 'Дата',
                                            },
                                            {
                                                value: 'status',
                                                label: 'Статус',
                                            },
                                        ]}
                                    />

                                    <Button
                                        danger
                                        block
                                        onClick={() => {
                                            const columns =
                                                (selectedComponent.data?.columns || [])
                                                    .filter((_, i) => i !== index);

                                            onUpdate(selectedComponent.id, {
                                                data: {
                                                    ...selectedComponent.data,
                                                    columns,
                                                },
                                            });
                                        }}
                                    >
                                        Удалить колонку
                                    </Button>
                                </Card>
                            )
                        )}

                        <Button
                            block
                            type="primary"
                            className="mb-4"
                            onClick={() => {
                                const columns = [
                                    ...(selectedComponent.data?.columns || [])
                                ];

                                const id =
                                    `col${columns.length + 1}`;

                                columns.push({
                                    title: `Колонка ${columns.length + 1}`,
                                    dataIndex: id,
                                    key: id,
                                    type: 'text',
                                });

                                onUpdate(selectedComponent.id, {
                                    data: {
                                        ...selectedComponent.data,
                                        columns,
                                    },
                                });
                            }}
                        >
                            Добавить колонку
                        </Button>

                        <Divider>Строки</Divider>

                        <Button
                            block
                            onClick={() => {
                                const rows = [
                                    ...(selectedComponent.data?.rows || [])
                                ];

                                const row = {
                                    key: crypto.randomUUID(),
                                };

                                (selectedComponent.data?.columns || [])
                                    .forEach((column) => {
                                        row[column.dataIndex] = '';
                                    });

                                rows.push(row);

                                onUpdate(selectedComponent.id, {
                                    data: {
                                        ...selectedComponent.data,
                                        rows,
                                    },
                                });
                            }}
                        >
                            Добавить строку
                        </Button>
                        <Divider>Данные</Divider>

                        {(selectedComponent.data?.rows || []).map(
                            (row, rowIndex) => (
                                <Card
                                    key={row.key}
                                    size="small"
                                    className="mb-2"
                                >
                                    {(selectedComponent.data?.columns || []).map(
                                        (column) => (
                                            <div
                                                key={column.key}
                                                className="mb-2"
                                            >
                                                <div className="mb-1">
                                                    {column.title}
                                                </div>

                                                {column.type === 'status' ? (
                                                    <Select
                                                        className="w-full"
                                                        value={row[column.dataIndex]}
                                                        options={[
                                                            {
                                                                value: 'Новый',
                                                                label: 'Новый',
                                                            },
                                                            {
                                                                value: 'В работе',
                                                                label: 'В работе',
                                                            },
                                                            {
                                                                value: 'Оплачен',
                                                                label: 'Оплачен',
                                                            },
                                                            {
                                                                value: 'Отменен',
                                                                label: 'Отменен',
                                                            },
                                                        ]}
                                                        onChange={(value) => {

                                                            const rows = [
                                                                ...(selectedComponent.data?.rows || [])
                                                            ];

                                                            rows[rowIndex] = {
                                                                ...rows[rowIndex],
                                                                [column.dataIndex]: value,
                                                            };

                                                            onUpdate(
                                                                selectedComponent.id,
                                                                {
                                                                    data: {
                                                                        ...selectedComponent.data,
                                                                        rows,
                                                                    },
                                                                }
                                                            );
                                                        }}
                                                    />
                                                ) : (
                                                    <Input
                                                        value={
                                                            row[column.dataIndex] || ''
                                                        }
                                                        onChange={(e) => {

                                                            const rows = [
                                                                ...(selectedComponent.data?.rows || [])
                                                            ];

                                                            rows[rowIndex] = {
                                                                ...rows[rowIndex],
                                                                [column.dataIndex]:
                                                                    e.target.value,
                                                            };

                                                            onUpdate(
                                                                selectedComponent.id,
                                                                {
                                                                    data: {
                                                                        ...selectedComponent.data,
                                                                        rows,
                                                                    },
                                                                }
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )
                                    )}

                                    <Button
                                        danger
                                        block
                                        onClick={() => {

                                            const rows =
                                                (selectedComponent.data?.rows || [])
                                                    .filter(
                                                        (_, i) =>
                                                            i !== rowIndex
                                                    );

                                            onUpdate(
                                                selectedComponent.id,
                                                {
                                                    data: {
                                                        ...selectedComponent.data,
                                                        rows,
                                                    },
                                                }
                                            );
                                        }}
                                    >
                                        Удалить строку
                                    </Button>

                                </Card>
                            )
                        )}

                        <div className="mt-4">
                            <div className="mb-1">
                                Пагинация
                            </div>

                            <Switch
                                checked={
                                    selectedComponent.data?.settings?.pagination
                                }
                                onChange={(checked) =>
                                    onUpdate(selectedComponent.id, {
                                        data: {
                                            ...selectedComponent.data,
                                            settings: {
                                                ...selectedComponent.data?.settings,
                                                pagination: checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </div>

                        <div className="mt-4">
                            <div className="mb-1">
                                Размер страницы
                            </div>

                            <InputNumber
                                min={1}
                                max={100}
                                className="w-full"
                                value={
                                    selectedComponent.data?.settings?.pageSize || 5
                                }
                                onChange={(value) =>
                                    onUpdate(selectedComponent.id, {
                                        data: {
                                            ...selectedComponent.data,
                                            settings: {
                                                ...selectedComponent.data?.settings,
                                                pageSize: value,
                                            },
                                        },
                                    })
                                }
                            />
                        </div>

                        <div className="mt-4">
                            <div className="mb-1">
                                Сортировка
                            </div>

                            <Switch
                                checked={
                                    selectedComponent.data?.settings?.sortable
                                }
                                onChange={(checked) =>
                                    onUpdate(selectedComponent.id, {
                                        data: {
                                            ...selectedComponent.data,
                                            settings: {
                                                ...selectedComponent.data?.settings,
                                                sortable: checked,
                                            },
                                        },
                                    })
                                }
                            />
                        </div>
                    </>
                )}

                <Divider />

                <Popconfirm
                    title="Удалить компонент?"
                    description="Это действие можно отменить (Ctrl+Z)."
                    okText="Удалить"
                    okType="danger"
                    cancelText="Отмена"
                    onConfirm={() =>
                        onDelete?.(selectedComponent.id)
                    }
                >
                    <Button
                        danger
                        block
                        icon={<Trash2 size={16} />}
                    >
                        Удалить компонент
                    </Button>
                </Popconfirm>

            </Card>
        </div>
    );
};

export default PropertiesPanel;