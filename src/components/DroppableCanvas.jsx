import { useDroppable } from '@dnd-kit/react';
import React from 'react';

const DroppableCanvas = ({ children }) => {
    const { ref, isOver } = useDroppable({
        id: 'main-canvas',
        data: {
            type: 'canvas', // FIX
        }
    });

    const isEmpty = React.Children.count(children) === 0;

    return (
        <div
            ref={ref}
            className={`min-h-[400px] p-5 rounded-xl transition-all duration-200 ease-in-out
        ${
                isOver
                    ? 'bg-blue-50 border-blue-500 border-2 border-dashed'
                    : 'bg-white border-2 border-transparent'
            }`}
        >
            {children.length === 0 && !isOver && (
                <div className="text-center text-gray-300 mt-24">
                    Перетащите компоненты сюда
                </div>
            )}

            {children}
        </div>
    );
};

export default DroppableCanvas;