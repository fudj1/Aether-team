import { createContext, useContext } from 'react';

const SectionsContext = createContext(null);

/**
 * Провайдер стал «управляемым»: всё состояние разделов теперь
 * живёт в App (внутри общего стека истории undo/redo) и передаётся
 * сюда через value. Публичный API useSections остался прежним,
 * поэтому дочерние компоненты менять не нужно.
 */
export const SectionsProvider = ({ children, value }) => {
    return (
        <SectionsContext.Provider value={value}>
            {children}
        </SectionsContext.Provider>
    );
};

export const useSections = () => {
    const context = useContext(SectionsContext);

    if (!context) {
        throw new Error(
            'useSections must be used within SectionsProvider'
        );
    }

    return context;
};
