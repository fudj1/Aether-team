import DroppableCanvas from './components/DroppableCanvas';
import { useRef, useState } from 'react';
import { Layout, Button, Breadcrumb } from 'antd';
import { Save, Settings, Import, Undo, Redo, Hand, PenLine } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { SectionsProvider, useSections } from './contexts/SectionsContext';
import SectionsRail from './components/SectionsRail';
import CanvasRenderer from './components/CanvasRenderer';
import PropertiesPanel from './components/PropertiesPanel';

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
  const {
    currentSectionId,
    addSection,
    sections,
    crmName,
    loadProjectData,
  } = useSections();

    const COMPONENT_DEFAULTS = {
        table: {
            w: 4,
            h: 6,
        },

        histogram: {
            w: 2,
            h: 6,
        },

        'line-chart': {
            w: 2,
            h: 6,
        },

        'pie-chart': {
            w: 2,
            h: 6,
        },

        'kpi-card': {
            w: 1,
            h: 2,
        },
    };

    const fileInputRef = useRef(null);

    const [selectedComponentId, setSelectedComponentId] =
        useState(null);

    const selectedComponent =
        schema.components.find(
            (c) => c.id === selectedComponentId
        ) || null;

  const visibleComponents = schema.components.filter(
    (comp) => comp.sectionId === currentSectionId
  );

  const handleCanvasDrop = ({ componentType, label, layout }) => {
    if (!componentType || !label) {
      return;
    }

    let sectionId = currentSectionId;

    if (!sectionId) {
      sectionId = addSection('Новый раздел');
      return;
    }

      const defaults =
          COMPONENT_DEFAULTS[componentType];

      const normalizedLayout = {
          x: Number.isFinite(layout?.x) ? layout.x : 0,
          y: Number.isFinite(layout?.y) ? layout.y : 0,
          w: defaults?.w || 2,
          h: defaults?.h || 6,
      };

    const newComponent = {
      id: crypto.randomUUID(),
      type: componentType,
      sectionId,
      layout: normalizedLayout,
      props: {
        title: label,
      },
      data: {},
    };

    if (componentType === 'kpi-card') {
        newComponent.data = {
            value: 100,
            suffix: '%',
        };
    }

    setSchema((prev) => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));
      console.log(newComponent);
  };

  const handleLayoutChange = (nextLayout) => {
    if (!currentSectionId) {
      return;
      }

    setSchema((prev) => {
      const nextComponents = prev.components.map((component) => {
        if (component.sectionId !== currentSectionId) return component;

        const layoutItem = nextLayout.find((item) => item.i === component.id);

        if (!layoutItem) return component;

        return {
          ...component,
          layout: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        };
      });

      return {
        ...prev,
        components: nextComponents,
      };
    });
  };

    const updateComponent = (id, changes) => {
        setSchema((prev) => ({
            ...prev,
            components: prev.components.map(
                (component) =>
                    component.id === id
                        ? {
                            ...component,
                            ...changes,
                        }
                        : component
            ),
        }));
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

    if (!file) return;

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
                { title: crmName || 'Новый CRM' },
                { title: currentSectionName || 'Без раздела' },
              ]}
            />

            <div className="ml-auto flex gap-2">
              <Button type="text" shape="circle" icon={ <span><PenLine size={18} /></span> }/>
              <Button type="text" shape="circle" icon={ <span><Hand size={18} /></span> }/>
              <Button type="text" shape="circle" icon={ <span><Undo size={18} /></span> }/>
              <Button type="text" shape="circle" icon={ <span><Redo size={18} /></span> }/>
              <Button type="primary" shape="round" icon={ <span><Import size={18} /></span> }
                onClick={() => fileInputRef.current?.click()}>
                Импорт
              </Button>
              {/* <Button type="primary" shape="round" icon={ <span><Settings size={16} /></span> }>Администратор</Button> */}
              <Button type="primary" shape="round" icon={ <span><Save size={16} /></span> } onClick={exportProject}>
                Сохранить
              </Button>
            </div>
          </Header>

          <Layout className="m-4 bg-gray-100" style={{height: 'calc(100vh - 64px - 32px)'}}>
            <Sider
              width={220}
              theme="light"
              className="border-r border-gray-200"
            >
              <SectionsRail />
            </Sider>

            <Content className="h-full overflow-hidden">
              <DroppableCanvas
                className="w-full h-full p-5 overflow-y-auto overflow-x-hidden"
                isEmpty={visibleComponents.length === 0}
              >
              <CanvasRenderer
                  components={visibleComponents}
                  onLayoutChange={handleLayoutChange}
                  onDrop={handleCanvasDrop}
                  selectedComponentId={selectedComponentId}
                  onSelectComponent={setSelectedComponentId}
              />
              </DroppableCanvas>
            </Content>
            <Sider
                width={300}
                theme="light"
                className="border-l border-gray-200"
            >
                <PropertiesPanel
                    selectedComponent={selectedComponent}
                    onUpdate={updateComponent}
                />
            </Sider>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default App;