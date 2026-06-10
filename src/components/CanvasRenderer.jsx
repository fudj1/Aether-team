import React, { useMemo } from 'react';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { componentRegistry } from './renderers/componentRegistry';

const GridLayout = WidthProvider(ReactGridLayout);

const DEFAULT_ITEM = {
    w: 2,
    h: 6,
    minW: 1,
    maxW: 4,
    minH: 5,
    maxH: 6,
};

const ALLOWED_WIDTHS = [1, 2, 3, 4];

const snapWidth = (width) =>
    ALLOWED_WIDTHS.reduce((closest, current) =>
        Math.abs(current - width) < Math.abs(closest - width)
            ? current
            : closest
    );

const getLayoutItem = (component, index) => {
    const l = component.layout || {};

    const isKpi =
        component.type === 'kpi-card';

    return {
        i: String(component.id),

        x: Number.isFinite(l.x)
            ? l.x
            : index % 4,

        y: Number.isFinite(l.y)
            ? l.y
            : Math.floor(index / 4) * 6,

        w: l.w ?? (isKpi ? 1 : 2),
        h: l.h ?? (isKpi ? 2 : 6),

        minW: 1,
        maxW: 4,

        minH: isKpi ? 2 : 5,
        maxH: isKpi ? 3 : 6,
    };
};

const parseDropPayload = (event) => {
    if (!event?.dataTransfer) return null;

    const json =
        event.dataTransfer.getData('application/json') ||
        event.dataTransfer.getData('text/plain');

    if (!json) return null;

    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
};

const CanvasRenderer = ({
    components,
    onLayoutChange,
    onDrop,
    selectedComponentId,
    onSelectComponent,
}) => {
    const renderableComponents = useMemo(
        () =>
            components.filter(
                (component) =>
                    componentRegistry[component.type]
            ),
        [components]
    );

    const layout = useMemo(
        () =>
            renderableComponents.map(
                getLayoutItem
            ),
        [renderableComponents]
    );

    const handleDrop = (
        _layout,
        layoutItem,
        event
    ) => {
        const payload =
            parseDropPayload(event);

        if (!payload) return;

        onDrop?.({
            ...payload,
            layout: {
                x: layoutItem.x,
                y: layoutItem.y,
                w: snapWidth(layoutItem.w),
                h: layoutItem.h,
            },
        });
    };

    return (
        <GridLayout
            className="layout min-h-full"
            layout={layout}
            cols={4}
            rowHeight={50}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            compactType="vertical"
            preventCollision={false}
            isDraggable
            isResizable
            isDroppable
            resizeHandles={['se']}
            droppingItem={{
                i: '__dropping__',
                w: 2,
                h: 6,
            }}
            onDrop={handleDrop}
            onLayoutChange={onLayoutChange}
        >
            {renderableComponents.map(
                (component) => {
                    const Renderer =
                        componentRegistry[
                        component.type
                        ];

                    return (
                        <div
                            key={component.id}
                            onClick={() =>
                                onSelectComponent?.(
                                    component.id
                                )
                            }
                            className={`
                                h-full
                                w-full
                                overflow-hidden
                                rounded
                                cursor-pointer
                                ${selectedComponentId ===
                                    component.id
                                    ? 'ring-2 ring-blue-500'
                                    : ''
                                }
                            `}
                        >
                            <Renderer
                                component={component}
                            />
                        </div>
                    );
                }
            )}
        </GridLayout>
    );
};

export default CanvasRenderer;