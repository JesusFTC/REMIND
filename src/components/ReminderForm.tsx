import React, { useState } from 'react';
import { BottomSheet } from './ui/BottomSheet';
import { Button } from './ui/Button';
import type { Reminder, Priority, RepeatInterval } from '../types';
import { cn } from '../utils/cn';
import { localDateInput } from '../utils/date';
import { Tag } from 'lucide-react';

export const ReminderForm = ({ isOpen, onClose, onSave, initialData }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Reminder>) => Promise<void>;
  initialData?: Partial<Reminder>;
}) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || new Date(),
    priority: (initialData?.priority as Priority) || 'medium',
    category: initialData?.category || 'General',
    repeat: (initialData?.repeat as RepeatInterval) || 'none',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !formData.title.trim()) return;
    setSaving(true);
    try { await onSave(formData); } finally { setSaving(false); }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Recordatorio" : "Nuevo Recordatorio"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary ml-1">Título</label>
          <input
            autoFocus
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-card border border-border rounded-premium p-4 text-text-main focus:border-primary outline-none transition-all"
            placeholder="¿Qué necesitas recordar?"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary ml-1">Descripción</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-card border border-border rounded-premium p-4 text-text-main focus:border-primary outline-none transition-all h-24 resize-none"
            placeholder="Detalles adicionales..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary ml-1">Fecha</label>
            <input
              type="date"
              value={localDateInput(formData.dueDate)}
              onChange={e => {
                if (!e.target.value) return;
                const [year, month, day] = e.target.value.split('-').map(Number);
                const date = new Date(formData.dueDate);
                date.setFullYear(year, month - 1, day);
                setFormData({ ...formData, dueDate: date });
              }}
              required
              className="w-full bg-card border border-border rounded-premium p-3 text-text-main focus:border-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary ml-1">Hora</label>
            <input
              type="time"
              value={formData.dueDate.toTimeString().slice(0, 5)}
              onChange={e => {
                if (!e.target.value) return;
                const [h, m] = e.target.value.split(':');
                const newDate = new Date(formData.dueDate);
                newDate.setHours(parseInt(h), parseInt(m));
                setFormData({ ...formData, dueDate: newDate });
              }}
              className="w-full bg-card border border-border rounded-premium p-3 text-text-main focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-text-secondary ml-1">Prioridad</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({ ...formData, priority: p })}
                className={cn(
                  "flex-1 py-2 rounded-full text-xs font-medium capitalize transition-all border",
                  formData.priority === p
                    ? "bg-primary border-primary text-white"
                    : "bg-surface border-border text-text-secondary"
                )}
              >
                {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary ml-1">Categoría</label>
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-text-secondary ml-2" />
            <input
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="flex-1 bg-card border border-border rounded-premium p-3 text-text-main focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        <Button disabled={saving} type="submit" className="w-full py-4 rounded-full text-base font-semibold shadow-lg shadow-primary/30">
          Guardar Recordatorio
        </Button>
      </form>
    </BottomSheet>
  );
};
