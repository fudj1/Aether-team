import { Button, Input, Modal, message } from 'antd';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useSections } from '../contexts/SectionsContext';

const normalizeName = (value) => value.trim().toLowerCase();

const SectionsTab = () => {
  const {
    sections,
    currentSectionId,
    setCurrentSectionId,
    addSection,
    renameSection,
    deleteSection,
  } = useSections();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const isDuplicateName = (name, excludeId = null) => {
    const normalized = normalizeName(name);
    return sections.some(
      (section) => section.id !== excludeId && normalizeName(section.name) === normalized
    );
  };

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      message.warning('Введите имя раздела');
      return;
    }
    if (isDuplicateName(trimmed)) {
      message.warning('Раздел с таким именем уже существует');
      return;
    }

    addSection(trimmed);
    setNewName('');
  };

  const startEditing = (section) => {
    setEditingId(section.id);
    setEditingName(section.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const commitEditing = () => {
    if (!editingId) return;

    const trimmed = editingName.trim();
    if (!trimmed) {
      message.warning('Имя раздела не может быть пустым');
      return;
    }
    if (isDuplicateName(trimmed, editingId)) {
      message.warning('Раздел с таким именем уже существует');
      return;
    }

    renameSection(editingId, trimmed);
    cancelEditing();
  };

  const confirmDelete = (section) => {
    Modal.confirm({
      title: 'Удалить раздел?',
      content: 'Все компоненты этого раздела будут удалены.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => deleteSection(section.id),
    });
  };

  return (
    <div className="flex flex-col h-full px-4 gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="Новый раздел"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onPressEnter={handleAdd}
        />
        <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd} />
      </div>

      <div className="flex flex-col gap-2">
        {sections.length === 0 ? (
          <div className="text-gray-400 text-sm">Разделов пока нет.</div>
        ) : (
          sections.map((section) => {
            const isActive = section.id === currentSectionId;
            const isEditing = section.id === editingId;

            return (
              <div
                key={section.id}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                {isEditing ? (
                  <Input
                    autoFocus
                    size="small"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    onPressEnter={commitEditing}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        cancelEditing();
                      }
                    }}
                    className="flex-1"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentSectionId(section.id)}
                    className="flex-1 text-left truncate"
                  >
                    {section.name}
                  </button>
                )}

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Button type="text" size="small" icon={<Check size={16} />} onClick={commitEditing} />
                    <Button type="text" size="small" icon={<X size={16} />} onClick={cancelEditing} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button type="text" size="small" icon={<Pencil size={16} />} onClick={() => startEditing(section)} />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<Trash2 size={16} />}
                      onClick={() => confirmDelete(section)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SectionsTab;
