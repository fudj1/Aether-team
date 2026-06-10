import { Card, Input, Select, Button } from 'antd';

const PropertiesPanel = ({
    selectedComponent,
    onUpdate,
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
                        <div className="mt-4">
                            <div className="mb-1">
                                Название первого столбца
                            </div>

                            <Input
                                value={
                                    selectedComponent.data?.columns?.[0]?.title || ''
                                }
                                onChange={(e) => {
                                    const columns = [
                                        ...(selectedComponent.data?.columns || [])
                                    ];

                                    if (!columns[0]) {
                                        columns[0] = {
                                            title: '',
                                            dataIndex: 'col1',
                                            key: 'col1',
                                        };
                                    }

                                    columns[0].title = e.target.value;

                                    onUpdate(selectedComponent.id, {
                                        data: {
                                            ...selectedComponent.data,
                                            columns,
                                        },
                                    });
                                }}
                            />
                        </div>

                        <div className="mt-4">
                            <div className="mb-1">
                                Название второго столбца
                            </div>

                            <Input
                                value={
                                    selectedComponent.data?.columns?.[1]?.title || ''
                                }
                                onChange={(e) => {
                                    const columns = [
                                        ...(selectedComponent.data?.columns || [])
                                    ];

                                    if (!columns[1]) {
                                        columns[1] = {
                                            title: '',
                                            dataIndex: 'col2',
                                            key: 'col2',
                                        };
                                    }

                                    columns[1].title = e.target.value;

                                    onUpdate(selectedComponent.id, {
                                        data: {
                                            ...selectedComponent.data,
                                            columns,
                                        },
                                    });
                                }}
                            />
                        </div>

                        <div className="mt-4">
                            <Button
                                block
                                onClick={() => {
                                    const rows = [
                                        ...(selectedComponent.data?.rows || [])
                                    ];

                                    rows.push({
                                        key: crypto.randomUUID(),
                                        col1: 'Иван',
                                        col2: 'Иванов',
                                    });

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
                        </div>
                    </>
                )}

            </Card>
        </div>
    );
};

export default PropertiesPanel;