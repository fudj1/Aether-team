import { useDraggable } from '@dnd-kit/react';

const DraggableNode = ({ node }) => {
  const { ref } = useDraggable({
    id: `sidebar-${node.key}`,
    data: {
      type: 'component',
      componentType: node.key,
      label: node.title
    }
  });

  if (!node.isLeaf) return <span>{node.title}</span>;

  return (
    <div
      ref={ref}
      className="select-none transition-colors"
    >
      {node.title}
    </div>
  );
};

export default DraggableNode;