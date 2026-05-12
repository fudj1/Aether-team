import { useDraggable } from '@dnd-kit/react';

const DraggableNode = ({ node }) => {
  const { ref, listeners, attributes } = useDraggable({
    id: `sidebar-${node.key}`,
    data: {
      type: 'component',
      componentType: node.key,
      label: node.title,
    },
  });

  if (!node.isLeaf) return <span className="font-bold">{node.title}</span>;

  return (
      <div
          ref={ref}
          {...listeners}
          {...attributes}
          className="p-1 cursor-grab active:cursor-grabbing rounded-full transition-colors"
      >
        {node.title}
      </div>
  );
};

export default DraggableNode;