import { Input } from 'antd';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSections } from '../contexts/SectionsContext';

const SectionsRail = () => {
  const {
    sections,
    currentSectionId,
    setCurrentSectionId,
    crmName,
    updateCrmName,
  } = useSections();
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(crmName);

  useEffect(() => {
    setDraftName(crmName);
  }, [crmName]);

  const handleSelect = (id) => {
    setCurrentSectionId(id);
  };

  const startEditing = () => {
    setDraftName(crmName);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftName(crmName);
    setIsEditing(false);
  };

  const commitEditing = () => {
    const ok = updateCrmName(draftName);
    if (!ok) {
      setDraftName(crmName);
    }
    setIsEditing(false);
  };

  return (
    <div className="h-full bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        {isEditing ? (
          <Input
            autoFocus
            size="small"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            onPressEnter={commitEditing}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                cancelEditing();
              }
            }}
            onBlur={commitEditing}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            className="text-sm font-semibold text-gray-700 truncate"
            title="Изменить имя CRM"
          >
            {crmName}
          </button>
        )}

        {!isEditing ? (
          <button
            type="button"
            onClick={startEditing}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Редактировать имя CRM"
          >
            <Pencil size={14} />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        {sections.length === 0 ? (
          <div className="text-sm text-gray-400">Разделов пока нет.</div>
        ) : (
          sections.map((section) => {
            const isActive = section.id === currentSectionId;

            return (
              <div
                key={section.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => handleSelect(section.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(section.id);
                  }
                }}
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm cursor-pointer transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className="truncate">{section.name}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SectionsRail;
