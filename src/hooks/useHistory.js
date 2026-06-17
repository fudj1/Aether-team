import { useCallback, useEffect, useRef, useState } from 'react';


const useHistory = (initialPresent, { limit = 100 } = {}) => {
    const [state, setState] = useState({
        past: [],
        present: initialPresent,
        future: [],
    });

    const presentRef = useRef(initialPresent);

    useEffect(() => {
        presentRef.current = state.present;
    }, [state.present]);

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const commit = useCallback(
        (updater) => {
            setState((prev) => {
                const next =
                    typeof updater === 'function'
                        ? updater(prev.present)
                        : updater;

                if (next === prev.present) {
                    return prev;
                }

                const past = [...prev.past, prev.present];

                if (past.length > limit) {
                    past.shift();
                }

                return {
                    past,
                    present: next,
                    future: [],
                };
            });
        },
        [limit]
    );

    const undo = useCallback(() => {
        setState((prev) => {
            if (prev.past.length === 0) {
                return prev;
            }

            const previous = prev.past[prev.past.length - 1];
            const newPast = prev.past.slice(0, -1);

            return {
                past: newPast,
                present: previous,
                future: [prev.present, ...prev.future],
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState((prev) => {
            if (prev.future.length === 0) {
                return prev;
            }

            const next = prev.future[0];
            const newFuture = prev.future.slice(1);

            return {
                past: [...prev.past, prev.present],
                present: next,
                future: newFuture,
            };
        });
    }, []);

    const reset = useCallback((next) => {
        setState({
            past: [],
            present: next,
            future: [],
        });
    }, []);

    const setPresentSilent = useCallback((updater) => {
        setState((prev) => {
            const next =
                typeof updater === 'function'
                    ? updater(prev.present)
                    : updater;

            if (next === prev.present) {
                return prev;
            }

            return { ...prev, present: next };
        });
    }, []);

    return {
        state: state.present,
        presentRef,
        commit,
        setPresentSilent,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
    };
};

export default useHistory;
