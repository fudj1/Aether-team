import { DragDropProvider, DragOverlay, PointerSensor } from '@dnd-kit/react';
import DroppableCanvas from './components/DroppableCanvas';
import { useState } from 'react';
import { Layout, Button, Breadcrumb } from 'antd';
import { Save, Settings, Undo, Redo, Hand, PenLine } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { SectionsProvider, useSections } from './contexts/SectionsContext';
import SectionsRail from './components/SectionsRail';

const { Header, Content, Sider } = Layout;

function App() {
  const [schema, setSchema] = useState({ components: [] });

  const handleDeleteSection = (sectionId) => {
    setSchema((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.sectionId !== sectionId),
    }));
  };

  return (
      <SectionsProvider onDeleteSection={handleDeleteSection}>
        <AppLayout schema={schema} setSchema={setSchema} />
      </SectionsProvider>
  );
}

const AppLayout = ({ schema, setSchema }) => {
  const pointerSensor = PointerSensor;
  const { currentSectionId, addSection, sections, crmName } = useSections();
  const [overlayData, setOverlayData] = useState(null);

  const handleDragStart = (event) => {
    try {
      const { operation } = event;
      const { source } = operation || {};
      const data = source?.data ?? null;
      setOverlayData(data);
    } catch (e) {
      setOverlayData(null);
    }
  };

  const handleDragEnd = (event) => {
    const { operation } = event;
    const { source, target } = operation;

    console.log('drag end', { source, target });

    if (target?.id === 'main-canvas') {
      const { componentType, label } = source.data || {};

      if (componentType && label) {
        let sectionId = currentSectionId;
        if (!sectionId) {
          sectionId = addSection('Новый раздел');
        }
        if (!sectionId) return;

        const newComponent = {
          id: `comp-${Date.now()}`,
          type: componentType,
          title: label,
          layout: { span: 24 },
          sectionId,
        };

        setSchema((prev) => ({
          ...prev,
          components: [...prev.components, newComponent],
        }));
      }
    }

    setOverlayData(null);
  };

  const visibleComponents = currentSectionId
    ? schema.components.filter((comp) => comp.sectionId === currentSectionId)
    : [];

  const currentSectionName = sections.find((section) => section.id === currentSectionId)?.name;

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={[pointerSensor]}>
      <Layout>
        <Sider width={260} theme="light" className="h-screen">
          <Header className="bg-white! px-4! ">
            <Button color="default" variant="solid" shape="round" className="font-medium!">
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
                { title: crmName || 'Новый CRM' },
                { title: currentSectionName || 'Без раздела' },
              ]}
            />
            <div className="ml-auto flex gap-2">
              <Button type="text" shape="circle" icon={<span><PenLine size={18} /></span>} />
              <Button type="text" shape="circle" icon={<span><Hand size={18} /></span>} />
              <Button type="text" shape="circle" icon={<span><Undo size={18} /></span>} />
              <Button type="text" shape="circle" icon={<span><Redo size={18}/></span>} />

              <Button type="primary" shape="round" icon={<span><Settings size={16} /></span>}>
                Администратор
              </Button>
              <Button type="primary" shape="round" icon={<span><Save size={16} /></span>}>
                Сохранить
              </Button>
            </div>
          </Header>

          <Layout className="m-4 bg-gray-100">
            <Sider width={220} theme="light" className="border-r border-gray-200">
              <SectionsRail />
            </Sider>

            <Content className="h-full">
              <DroppableCanvas className="w-full h-full p-5">
                {visibleComponents.map(comp => (
                    <div key={comp.id} className="p-4 mb-2 bg-blue-50 border border-blue-200 rounded">
                      Заглушка: {comp.title} ({comp.type})
                    </div>
                ))}
              </DroppableCanvas>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <DragOverlay dropAnimation={null}>
        {overlayData ? (
          <div className="bg-white border-2 border-dashed border-blue-600 text-sm p-3 rounded inline-block whitespace-nowrap text-center">
            {overlayData.label || overlayData.componentType || 'null'}
          </div>
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
};

export default App;