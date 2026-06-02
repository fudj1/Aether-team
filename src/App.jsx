import { DragDropProvider, DragOverlay, PointerSensor } from '@dnd-kit/react';
import DroppableCanvas from './components/DroppableCanvas';
import { useRef, useState } from 'react';
import { Layout, Button, Breadcrumb } from 'antd';
import { Save, Settings, Import, Undo, Redo, Hand, PenLine } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { SectionsProvider, useSections } from './contexts/SectionsContext';
import SectionsRail from './components/SectionsRail';
import CanvasRenderer from './components/CanvasRenderer';

const { Header, Content, Sider } = Layout;

function App() {
    const [schema, setSchema] = useState({
        components: [],
    });

    const handleDeleteSection = (sectionId) => {
        setSchema((prev) => ({
            ...prev,
            components: prev.components.filter(
                (comp) => comp.sectionId !== sectionId
            ),
        }));
    };

    return (
        <SectionsProvider onDeleteSection={handleDeleteSection}>
            <AppLayout
                schema={schema}
                setSchema={setSchema}
            />
        </SectionsProvider>
    );
}

const AppLayout = ({ schema, setSchema }) => {
    const pointerSensor = PointerSensor;

    const {
        currentSectionId,
        addSection,
        sections,
        crmName,
        loadProjectData,
    } = useSections();

    const [overlayData, setOverlayData] = useState(null);

    const fileInputRef = useRef(null);

    const visibleComponents = schema.components.filter(
        (comp) => comp.sectionId === currentSectionId
    );

    const handleDragStart = (event) => {
        try {
            const { operation } = event;
            const { source } = operation || {};

            setOverlayData(source?.data ?? null);
        } catch {
            setOverlayData(null);
        }
    };

    const handleDragEnd = (event) => {
        const { operation } = event;
        const { source, target } = operation;

        if (target?.id === 'main-canvas') {
            const { componentType, label } = source?.data || {};

            if (componentType && label) {
                let sectionId = currentSectionId;

                if (!sectionId) {
                    sectionId = addSection('Новый раздел');
                }

                if (!sectionId) {
                    return;
                }

                const newComponent = {
                    id: crypto.randomUUID(),
                    type: componentType,
                    sectionId,

                    layout: {
                        span: 12,
                    },

                    props: {
                        title: label,
                    },

                    data: {},
                };

                setSchema((prev) => ({
                    ...prev,
                    components: [
                        ...prev.components,
                        newComponent,
                    ],
                }));
            }
        }

        setOverlayData(null);
    };

    const exportProject = () => {
        const project = {
            version: '1.0',
            crmName,
            sections,
            currentSectionId,
            components: schema.components,
        };

        const json = JSON.stringify(
            project,
            null,
            2
        );

        const blob = new Blob(
            [json],
            {
                type: 'application/json',
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = `${crmName || 'crm-project'}.json`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const importProject = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const project = JSON.parse(
                    e.target.result
                );

                loadProjectData(project);

                setSchema({
                    components:
                        project.components || [],
                });

                console.log(
                    'PROJECT IMPORTED',
                    project
                );
            } catch (error) {
                console.error(error);

            }
        };

        reader.readAsText(file);

        event.target.value = '';
    };

    const currentSectionName = sections.find(
        (section) =>
            section.id === currentSectionId
    )?.name;

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importProject}
                style={{ display: 'none' }}
            />

            <DragDropProvider
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={[pointerSensor]}
            >
                <Layout>
                    <Sider
                        width={260}
                        theme="light"
                        className="h-screen"
                    >
                        <Header className="bg-white! px-4!">
                            <Button
                                color="default"
                                variant="solid"
                                shape="round"
                                className="font-medium!"
                            >
                                crm builder
                            </Button>
                        </Header>

                        <Content>
                            <Sidebar />
                        </Content>
                    </Sider>

                    <Layout>
                        <Header className="bg-white! w-full flex px-4! items-center">
                            <Breadcrumb
                                items={[
                                    {
                                        title:
                                            crmName ||
                                            'Новый CRM',
                                    },
                                    {
                                        title:
                                            currentSectionName ||
                                            'Без раздела',
                                    },
                                ]}
                            />

                            <div className="ml-auto flex gap-2">
                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={
                                        <span>
                                            <PenLine size={18} />
                                        </span>
                                    }
                                />

                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={
                                        <span>
                                            <Hand size={18} />
                                        </span>
                                    }
                                />

                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={
                                        <span>
                                            <Undo size={18} />
                                        </span>
                                    }
                                />

                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={
                                        <span>
                                            <Redo size={18} />
                                        </span>
                                    }
                                />

                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={
                                        <span>
                                            <Import size={18 } />
                                        </span>
                                    }
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Импорт
                                </Button>

                                {/*<Button*/}
                                {/*    type="primary"*/}
                                {/*    shape="round"*/}
                                {/*    icon={*/}
                                {/*        <span>*/}
                                {/*            <Settings size={16} />*/}
                                {/*        </span>*/}
                                {/*    }*/}
                                {/*>*/}
                                {/*    Администратор*/}
                                {/*</Button>*/}

                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={
                                        <span>
                                            <Save size={16} />
                                        </span>
                                    }
                                    onClick={exportProject}
                                >
                                    Сохранить
                                </Button>
                            </div>
                        </Header>

                        <Layout className="m-4 bg-gray-100">
                            <Sider
                                width={220}
                                theme="light"
                                className="border-r border-gray-200"
                            >
                                <SectionsRail />
                            </Sider>

                            <Content className="h-full">
                                <DroppableCanvas className="w-full h-full p-5">
                                    <CanvasRenderer
                                        components={
                                            visibleComponents
                                        }
                                    />
                                </DroppableCanvas>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>

                <DragOverlay dropAnimation={null}>
                    {overlayData ? (
                        <div className="bg-white border-2 border-dashed border-blue-600 text-sm p-3 rounded inline-block whitespace-nowrap text-center">
                            {overlayData.label ||
                                overlayData.componentType ||
                                'null'}
                        </div>
                    ) : null}
                </DragOverlay>
            </DragDropProvider>
        </>
    );
};

export default App;