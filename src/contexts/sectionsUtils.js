export const DEFAULT_SECTION_NAMES = ['Дашборд', 'Задачи'];
export const DEFAULT_CRM_NAME = 'Новый CRM';

export const createId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `section-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const createSection = (name) => ({
    id: createId(),
    name,
});
