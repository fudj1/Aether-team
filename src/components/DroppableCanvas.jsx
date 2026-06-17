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
            {children}
        </div>
    );
};

export default DroppableCanvas;