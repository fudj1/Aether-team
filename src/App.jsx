import { DragDropProvider, PointerSensor } from '@dnd-kit/react';
import DroppableCanvas from './components/DroppableCanvas';
import { useState } from 'react';
import { Layout, Button } from 'antd';
import { Save, Settings, Undo, Redo, Hand, PenLine } from 'lucide-react';
import Sidebar from './components/Sidebar';

const { Header, Content, Sider } = Layout;

function App() {
  const pointerSensor = PointerSensor;
  const [schema, setSchema] = useState({ components: [] });

  const handleDragEnd = (event) => {
    const { operation } = event;
    const { source, target } = operation;

    console.log('drag end', { source, target });

    if (target?.id === 'main-canvas') {
      const { componentType, label } = source.data || {};

      if (componentType && label) {
        const newComponent = {
          id: `comp-${Date.now()}`,
          type: componentType,
          title: label,
          layout: { span: 24 },
        };

        setSchema((prev) => ({
          ...prev,
          components: [...prev.components, newComponent],
        }));
      }
    }
  };

  return (
      <DragDropProvider onDragEnd={handleDragEnd} sensors={[pointerSensor]}>
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
              <div>Новый CRM / Дашборд</div>
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
            <Content className="p-6 bg-gray-100">
              <DroppableCanvas>
                {schema.components.map(comp => (
                    <div key={comp.id} className="p-4 mb-2 bg-blue-50 border border-blue-200 rounded">
                      Заглушка: {comp.title} ({comp.type})
                    </div>
                ))}
              </DroppableCanvas>
            </Content>
          </Layout>
        </Layout>
      </DragDropProvider>
  );
}

export default App;