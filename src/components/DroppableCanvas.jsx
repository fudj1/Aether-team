import React from 'react';

const DroppableCanvas = ({ children, className, isEmpty }) => {
    const emptyState =
        typeof isEmpty === 'boolean'
            ? isEmpty
            : React.Children.count(children) === 0;

    return (
        <div
            className={`${className || ''} bg-white border-2 border-transparent transition-all transition-duration-200 min-h-[60vh]`}
        >
            {/* {emptyState && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none z-10">
                    Перетащите компоненты сюда
                </div>
            )} */}

            {children}
        </div>
    );
};

export default DroppableCanvas;