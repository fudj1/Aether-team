import DroppableCanvas from './components/DroppableCanvas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Button, Breadcrumb, Tooltip } from 'antd';
import { Save, Import, Undo, Redo, Hand, PenLine } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ResizablePanel from './components/ResizablePanel';
import { SectionsProvider } from './contexts/SectionsContext';
import {
  DEFAULT_SECTION_NAMES,
  DEFAULT_CRM_NAME,
  createId,
  createSection,
} from './contexts/sectionsUtils';
import useHistory from './hooks/useHistory';
import SectionsRail from './components/SectionsRail';
import CanvasRenderer from './components/CanvasRenderer';
import PropertiesPanel from './components/PropertiesPanel';

const { Header, Content, Sider } = Layout;

const COMPONENT_DEFAULTS = {
  table: { w: 4, h: 10 },
  histogram: { w: 2, h: 6 },
  'line-chart': { w: 2, h: 6 },
  'pie-chart': { w: 2, h: 6 },
  'kpi-card': { w: 1, h: 2 },
};

const createInitialState = () => {
  const sections = DEFAULT_SECTION_NAMES.map(createSection);

  return {
    crmName: DEFAULT_CRM_NAME,
    sections,
    currentSectionId: sections[0]?.id ?? null,
    components: [],
  };
};

function App() {

  const {
    state,
    presentRef,
    commit,
    setPresentSilent,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useHistory(createInitialState());

  const fileInputRef = useRef(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const { crmName, sections, currentSectionId, components } = state;

  const selectedComponent =
    components.find((c) => c.id === selectedComponentId) || null;

  const visibleComponents = useMemo(
    () => components.filter((comp) => comp.sectionId === currentSectionId),
    [components, currentSectionId]
  );

  

  const setCurrentSectionId = useCallback(
    (idOrUpdater) => {
      setPresentSilent((prev) => {
        const nextId =
          typeof idOrUpdater === 'function'
            ? idOrUpdater(prev.currentSectionId)
            : idOrUpdater;

        if (nextId === prev.currentSectionId) return prev;

        return { ...prev, currentSectionId: nextId };
      });
    },
    [setPresentSilent]
  );

  const updateCrmName = useCallback(
    (name) => {
      const trimmed = name.trim();
      if (!trimmed) return false;

      commit((prev) =>
        prev.crmName === trimmed ? prev : { ...prev, crmName: trimmed }
      );
      return true;
    },
    [commit]
  );

  const addSection = useCallback(
    (name) => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const newSection = createSection(trimmed);

      commit((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
        currentSectionId: newSection.id,
      }));

      return newSection.id;
    },
    [commit]
  );

  const renameSection = useCallback(
    (id, name) => {
      const trimmed = name.trim();
      if (!trimmed) return false;

      commit((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === id ? { ...section, name: trimmed } : section
        ),
      }));

      return true;
    },
    [commit]
  );

  const deleteSection = useCallback(
    (id) => {
      commit((prev) => {
        const nextSections = prev.sections.filter(
          (section) => section.id !== id
        );

        if (nextSections.length === prev.sections.length) {
          return prev;
        }

        const nextCurrentId =
          prev.currentSectionId === id
            ? nextSections[0]?.id ?? null
            : prev.currentSectionId;

        return {
          ...prev,
          sections: nextSections,
          currentSectionId: nextCurrentId,
          components: prev.components.filter(
            (comp) => comp.sectionId !== id
          ),
        };
      });
    },
    [commit]
  );

  const loadProjectData = useCallback(
    (project) => {
      if (!project) return;

      reset({
        crmName: project.crmName || DEFAULT_CRM_NAME,
        sections: Array.isArray(project.sections) ? project.sections : [],
        currentSectionId:
          project.currentSectionId ??
          (Array.isArray(project.sections)
            ? project.sections[0]?.id ?? null
            : null),
        components: Array.isArray(project.components)
          ? project.components
          : [],
      });
    },
    [reset]
  );

  const handleCanvasDrop = useCallback(
    ({ componentType, label, layout }) => {
      if (!componentType || !label) return;

      let sectionId = currentSectionId;

      if (!sectionId) {
        addSection('Новый раздел');
        return;
      }

      const defaults = COMPONENT_DEFAULTS[componentType];

      const normalizedLayout = {
        x: Number.isFinite(layout?.x) ? layout.x : 0,
        y: Number.isFinite(layout?.y) ? layout.y : 0,
        w: defaults?.w || 2,
        h: defaults?.h || 6,
      };

      const newComponent = {
        id: createId(),
        type: componentType,
        sectionId,
        layout: normalizedLayout,
        props: { title: label },
        data: {},
      };

      if (componentType === 'kpi-card') {
        newComponent.data = { value: 100, suffix: '%' };
      }

      if (componentType === 'table') {
        newComponent.data = {
          columns: [
            {
              title: 'Имя',
              dataIndex: 'name',
              key: 'name',
              type: 'text',
            },
            {
              title: 'Статус',
              dataIndex: 'status',
              key: 'status',
              type: 'status',
            },
          ],
          rows: [
            {
              key: createId(),
              name: 'Иван',
              status: 'В работе',
            },
          ],
          settings: {
            pagination: true,
            pageSize: 5,
            sortable: true,
          },
        };
      }

      commit((prev) => ({
        ...prev,
        components: [...prev.components, newComponent],
      }));
    },
    [commit, currentSectionId, addSection]
  );

  const handleLayoutChange = useCallback(
    (nextLayout) => {
      const activeSectionId = presentRef.current.currentSectionId;
      if (!activeSectionId) return;

      commit((prev) => {
        let changed = false;

        const nextComponents = prev.components.map((component) => {
          if (component.sectionId !== activeSectionId) return component;

          const layoutItem = nextLayout.find(
            (item) => item.i === component.id
          );

          if (!layoutItem) return component;

          const sameLayout =
            component.layout?.x === layoutItem.x &&
            component.layout?.y === layoutItem.y &&
            component.layout?.w === layoutItem.w &&
            component.layout?.h === layoutItem.h;

          if (sameLayout) return component;

          changed = true;

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

        if (!changed) return prev;


        return { ...prev, components: nextComponents };
      });
    },
    [commit, presentRef]
  );

  const updateComponent = useCallback(
    (id, changes) => {
      commit((prev) => ({
        ...prev,
        components: prev.components.map((component) =>
          component.id === id ? { ...component, ...changes } : component
        ),
      }));
    },
    [commit]
  );

  const deleteComponent = useCallback(
    (id) => {
      if (!id) return;

      commit((prev) => {
        const nextComponents = prev.components.filter(
          (component) => component.id !== id
        );

        if (nextComponents.length === prev.components.length) {
          return prev;
        }

        return { ...prev, components: nextComponents };
      });

      setSelectedComponentId((current) => (current === id ? null : current));
    },
    [commit]
  );


  const exportProject = useCallback(() => {
    const project = {
      version: '1.0',
      crmName,
      sections,
      currentSectionId,
      components,
    };

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${crmName || 'crm-project'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [crmName, sections, currentSectionId, components]);

  const importProject = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target.result);
          loadProjectData(project);
          setSelectedComponentId(null);
        } catch (error) {
          console.error(error);
        }
      };

      reader.readAsText(file);
      event.target.value = '';
    },
    [loadProjectData]
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
    return () => cancelAnimationFrame(raf);
  }, [components, currentSectionId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const tag = target?.tagName;
      const isEditable =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        target?.isContentEditable;

      const isMod = event.metaKey || event.ctrlKey;

      if (isMod && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (isMod && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }

      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        !isEditable &&
        selectedComponentId
      ) {
        event.preventDefault();
        deleteComponent(selectedComponentId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteComponent, selectedComponentId]);


  const sectionsValue = useMemo(
    () => ({
      sections,
      currentSectionId,
      setCurrentSectionId,
      crmName,
      updateCrmName,
      addSection,
      renameSection,
      deleteSection,
      loadProjectData,
    }),
    [
      sections,
      currentSectionId,
      setCurrentSectionId,
      crmName,
      updateCrmName,
      addSection,
      renameSection,
      deleteSection,
      loadProjectData,
    ]
  );

  const currentSectionName = sections.find(
    (section) => section.id === currentSectionId
  )?.name;

  return (
    <SectionsProvider value={sectionsValue}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importProject}
        style={{ display: 'none' }}
      />

      <Layout>
        <Sider width={260} theme="light" className="h-screen">
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
              <Tooltip title="Отменить (Ctrl+Z)">
                <Button
                  type="text"
                  shape="circle"
                  disabled={!canUndo}
                  onClick={undo}
                  icon={
                    <span>
                      <Undo size={18} />
                    </span>
                  }
                />
              </Tooltip>
              <Tooltip title="Повторить (Ctrl+Shift+Z)">
                <Button
                  type="text"
                  shape="circle"
                  disabled={!canRedo}
                  onClick={redo}
                  icon={
                    <span>
                      <Redo size={18} />
                    </span>
                  }
                />
              </Tooltip>
              <Button
                type="primary"
                shape="round"
                icon={
                  <span>
                    <Import size={18} />
                  </span>
                }
                onClick={() => fileInputRef.current?.click()}
              >
                Импорт
              </Button>
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

          <Layout
            className="relative m-4 bg-gray-100"
            style={{ height: 'calc(100vh - 64px - 32px)' }}
          >
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
                  onDeleteComponent={deleteComponent}
                />
              </DroppableCanvas>
            </Content>
            <ResizablePanel>
              <PropertiesPanel
                selectedComponent={selectedComponent}
                onUpdate={updateComponent}
                onDelete={deleteComponent}
              />
            </ResizablePanel>
          </Layout>
        </Layout>
      </Layout>
    </SectionsProvider>
  );
}

export default App;
