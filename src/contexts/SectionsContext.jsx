import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const DEFAULT_SECTION_NAMES = ['Дашборд', 'Задачи'];
const DEFAULT_CRM_NAME = 'Новый CRM';

const createId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const createSection = (name) => ({
    id: createId(),
    name,
});

const SectionsContext = createContext(null);

export const SectionsProvider = ({ children, onDeleteSection }) => {
    const initialSectionsRef = useRef(null);

    if (!initialSectionsRef.current) {
        initialSectionsRef.current = DEFAULT_SECTION_NAMES.map(createSection);
    }

    const [sections, setSections] = useState(initialSectionsRef.current);

    const [currentSectionId, setCurrentSectionId] = useState(
        initialSectionsRef.current[0]?.id ?? null
    );

    const [crmName, setCrmName] = useState(DEFAULT_CRM_NAME);

    const updateCrmName = useCallback((name) => {
        const trimmed = name.trim();

        if (!trimmed) {
            return false;
        }

        setCrmName(trimmed);

        return true;
    }, []);

    const addSection = useCallback((name) => {
        const trimmed = name.trim();

        if (!trimmed) {
            return null;
        }

        const newSection = createSection(trimmed);

        setSections((prev) => [...prev, newSection]);
        setCurrentSectionId(newSection.id);

        return newSection.id;
    }, []);

    const renameSection = useCallback((id, name) => {
        const trimmed = name.trim();

        if (!trimmed) {
            return false;
        }

        setSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, name: trimmed }
                    : section
            )
        );

        return true;
    }, []);

    const deleteSection = useCallback(
        (id) => {
            setSections((prev) => {
                const nextSections = prev.filter(
                    (section) => section.id !== id
                );

                if (nextSections.length === prev.length) {
                    return prev;
                }

                setCurrentSectionId((currentId) =>
                    currentId === id
                        ? nextSections[0]?.id ?? null
                        : currentId
                );

                if (onDeleteSection) {
                    onDeleteSection(id);
                }

                return nextSections;
            });
        },
        [onDeleteSection]
    );

    const loadProjectData = useCallback((project) => {
        if (!project) {
            return;
        }

        if (project.crmName) {
            setCrmName(project.crmName);
        }

        if (Array.isArray(project.sections)) {
            setSections(project.sections);
        }

        if (project.currentSectionId) {
            setCurrentSectionId(project.currentSectionId);
        }
    }, []);

    const value = useMemo(
        () => ({
            sections,
            currentSectionId,
            setCurrentSectionId,
            crmName,
            updateCrmName,
            addSection,
            renameSection,
            deleteSection,
            loadProjectData,
        }),
        [
            sections,
            currentSectionId,
            crmName,
            updateCrmName,
            addSection,
            renameSection,
            deleteSection,
            loadProjectData,
        ]
    );

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