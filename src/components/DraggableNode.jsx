const DraggableNode = ({ node }) => {
  const handleDragStart = (event) => {
    const payload = {
      componentType: node.key,
      label: node.title,
    };

    event.dataTransfer.setData(
      'application/json',
      JSON.stringify(payload)
    );
    event.dataTransfer.setData(
      'text/plain',
      JSON.stringify(payload)
    );
    event.dataTransfer.effectAllowed = 'copy';
  };

  if (!node.isLeaf) return <span className="font-bold">{node.title}</span>;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-1 cursor-grab active:cursor-grabbing rounded-md transition-colors block w-full hover:bg-blue-50 hover:text-blue-700 text-gray-700"
      title={node.title}
    >
      <span className="truncate block">{node.title}</span>
    </div>
  );
};

export default DraggableNode;