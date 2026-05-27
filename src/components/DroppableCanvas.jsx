import { useDroppable } from '@dnd-kit/react';
import React from 'react';

const DroppableCanvas = ({ children, className }) => {
    const { ref, isDropTarget } = useDroppable({
        id: 'main-canvas',
        data: {
            type: 'canvas', // FIX
        }
    });

    const isEmpty = React.Children.count(children) === 0;

    return (
        <div
            ref={ref}
            className={`${className || ''} ${
                isDropTarget
                    ? 'bg-blue-50 border-blue-500 border-2'
                    : 'bg-white border-2 border-transparent'
            } transition-all transition-duration-200`}
        >
            {isEmpty && !isDropTarget && (
                <div className="text-center text-gray-300 mt-24">
                    Перетащите компоненты сюда
                </div>
            )}

            {children}
        </div>
    );
};

export default DroppableCanvas;