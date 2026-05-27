import { useDraggable } from '@dnd-kit/react';

const DraggableNode = ({ node }) => {
  const { ref, listeners, attributes } = useDraggable({
    id: `sidebar-${node.key}`,
      data: {
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
      className="p-1 cursor-grab active:cursor-grabbing rounded-md transition-colors block w-full hover:bg-blue-50 hover:text-blue-700 text-gray-700"
      title={node.title}
    >
      <span className="truncate block">{node.title}</span>
    </div>
  );
};

export default DraggableNode;