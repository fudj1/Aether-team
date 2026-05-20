import { Tabs, Input, Tree } from 'antd';
const { Search } = Input;
import DraggableNode from './DraggableNode';
import { useState } from 'react';
import SectionsTab from './SectionsTab';

const TREE_GALLERY_DATA = [
  {
    title: 'Данные',
    key: 'data',
    selectable: false,
    children: [
      { title: 'KPI карточки', key: 'kpi-card', isLeaf: true },
      { title: 'Таблица', key: 'table', isLeaf: true },
      { title: 'Сетка данных', key: 'data-grid', isLeaf: true },
      { title: 'Дерево данных', key: 'data-tree', isLeaf: true },
    ],
  },
  {
    title: 'Графики',
    key: 'charts',
    selectable: false,
    children: [
      { title: 'Гистограмма', key: 'histogram', isLeaf: true },
      { title: 'Линейный', key: 'line-chart', isLeaf: true },
      { title: 'Круговая', key: 'pie-chart', isLeaf: true },
    ],
  }
];


const Sidebar = () => {
  return (
      <Tabs
        centered
        defaultActiveKey="gallery"
        className=""
        indicator={{ size: (origin) => origin + 20 }}
        items={[
          { label: 'Разделы', key: 'sections', children: <SectionsTab /> },
          { label: 'Галерея', key: 'gallery', children: <GalleryContent /> },
        ]}
      />
  );
};

export default Sidebar;

const GalleryContent = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = newExpandedKeys => {
    console.log('onExpand', newExpandedKeys);
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  return (
    <div className="flex flex-col h-full px-4">
      <Search placeholder="Поиск" className="mb-4"/>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        defaultExpandAll={true}
        treeData={TREE_GALLERY_DATA}
        selectable={false}
        titleRender={(nodeData) => <DraggableNode node={nodeData} />}
      />
    </div>
  );
}
