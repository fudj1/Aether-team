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
  maxH: 6
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

  return {
    i: String(component.id),

    x: Number.isFinite(l.x) ? l.x : (index % 4),
    y: Number.isFinite(l.y) ? l.y : Math.floor(index / 4) * DEFAULT_ITEM.h,
    w: snapWidth(Number.isFinite(l.w) ? l.w : DEFAULT_ITEM.w),
    h: Number.isFinite(l.h) ? l.h : DEFAULT_ITEM.h,

    minW: DEFAULT_ITEM.minW,
    maxW: DEFAULT_ITEM.maxW,

    minH: DEFAULT_ITEM.minH,
    maxH: DEFAULT_ITEM.maxH,
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

  const handleLayoutChange = (nextLayout) => {
    onLayoutChange?.(nextLayout);
  };

  const handleResizeStop = (layout, oldItem, newItem) => {

    onLayoutChange?.(layout);

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  const handleDrop = (_layout, layoutItem, event) => {
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
      isDraggable={true}
      isResizable={true}
      isDroppable={true}
      resizeHandles={[
        'se',
      ]}
      useCSSTransforms={true}
      droppingItem={{
        i: '__dropping__',
        w: 2,
        h: 6,
      }}
      onDrop={handleDrop}
      onLayoutChange={
        handleLayoutChange
      }
      onResizeStop={
        handleResizeStop
      }
    >
      {renderableComponents.map(
        (component) => {
          const Renderer =
            componentRegistry[
              component.type
            ];

          if (!Renderer) {
            return null;
          }

          return (
            <div
              key={component.id}
              className="h-full w-full overflow-hidden"
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