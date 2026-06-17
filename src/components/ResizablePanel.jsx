import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

const MIN_WIDTH = 240;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 300;
const ANIM_MS = 250;

const ResizablePanel = ({ children, onResizeEnd }) => {
    const [width, setWidth] = useState(DEFAULT_WIDTH);
    const [collapsed, setCollapsed] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const startXRef = useRef(0);
    const startWidthRef = useRef(width);

    const pumpResizeDuringAnimation = useCallback(() => {
        const start = performance.now();
        let rafId;

        const tick = (now) => {
            window.dispatchEvent(new Event('resize'));
            if (now - start < ANIM_MS + 50) {
                rafId = requestAnimationFrame(tick);
            } else {
                onResizeEnd?.();
            }
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [onResizeEnd]);

    const handleMouseDown = useCallback(
        (event) => {
            event.preventDefault();
            startXRef.current = event.clientX;
            startWidthRef.current = width;
            setIsResizing(true);
        },
        [width]
    );

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (event) => {
            const delta = startXRef.current - event.clientX;
            const next = Math.min(
                MAX_WIDTH,
                Math.max(MIN_WIDTH, startWidthRef.current + delta)
            );
            setWidth(next);
            window.dispatchEvent(new Event('resize'));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            requestAnimationFrame(() => {
                window.dispatchEvent(new Event('resize'));
                onResizeEnd?.();
            });
        };

        const prevUserSelect = document.body.style.userSelect;
        const prevCursor = document.body.style.cursor;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = prevUserSelect;
            document.body.style.cursor = prevCursor;
        };
    }, [isResizing, onResizeEnd]);

    const collapse = useCallback(() => {
        setCollapsed(true);
        pumpResizeDuringAnimation();
    }, [pumpResizeDuringAnimation]);

    const expand = useCallback(() => {
        setCollapsed(false);
        pumpResizeDuringAnimation();
    }, [pumpResizeDuringAnimation]);

    const currentWidth = collapsed ? 0 : width;
    const transition = isResizing
        ? 'none'
        : `width ${ANIM_MS}ms ease`;

    return (
        <>
            <div
                className="relative h-full shrink-0 overflow-hidden border-l border-gray-200 bg-white"
                style={{
                    width: currentWidth,
                    borderLeftWidth: collapsed ? 0 : 1,
                    transition,
                }}
            >

                {!collapsed && (
                    <div
                        onMouseDown={handleMouseDown}
                        role="separator"
                        aria-orientation="vertical"
                        aria-label="Изменить ширину панели"
                        title="Потяните, чтобы изменить ширину"
                        className={`absolute left-0 top-0 z-10 h-full w-1.5 -translate-x-1/2 cursor-col-resize transition-colors ${
                            isResizing
                                ? 'bg-blue-400'
                                : 'bg-transparent hover:bg-blue-200'
                        }`}
                    />
                )}

                <button
                    type="button"
                    onClick={collapse}
                    title="Скрыть панель"
                    aria-label="Скрыть панель свойств"
                    className="absolute right-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700"
                >
                    <ChevronsRight size={18} />
                </button>

                <div
                    className="h-full overflow-y-auto transition-opacity"
                    style={{
                        width,
                        opacity: collapsed ? 0 : 1,
                        transitionDuration: `${ANIM_MS}ms`,
                    }}
                >
                    {children}
                </div>
            </div>
            <button
                type="button"
                onClick={expand}
                title="Показать панель свойств"
                aria-label="Показать панель свойств"
                className={`absolute right-2 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition-opacity duration-200 hover:bg-gray-50 hover:text-gray-700 ${
                    collapsed
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
            >
                <ChevronsLeft size={18} />
            </button>
        </>
    );
};

export default ResizablePanel;
