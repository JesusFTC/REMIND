import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, Tag, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Reminder } from '../../types';
import { Button } from './Button';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export const ReminderCard = ({ reminder, onToggle, onDelete, onEdit }: ReminderCardProps) => {
  const priorityColors = {
    low: 'text-success bg-success/10',
    medium: 'text-primary bg-primary/10',
    high: 'text-error bg-error/10',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative p-4 mb-3 bg-card border border-border rounded-premium transition-all duration-200",
        reminder.status === 'completed' && "opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(reminder.id)}
          className={cn(
            "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            reminder.status === 'completed'
              ? "bg-success border-success text-white"
              : "border-border hover:border-primary"
          )}
        >
          {reminder.status === 'completed' && <CheckCircle2 size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={cn(
              "text-text-main font-medium truncate transition-all",
              reminder.status === 'completed' && "line-through text-text-secondary"
            )}>
              {reminder.title}
            </h3>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
              priorityColors[reminder.priority]
            )}>
              {reminder.priority}
            </span>
          </div>

          {reminder.description && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">
              {reminder.description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-text-secondary">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {reminder.dueDate.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {reminder.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-1">
              <Tag size={12} />
              {reminder.category}
            </div>
          </div>
        </div>
      </div>

      <button type="button" onClick={onEdit} className="text-xs text-primary mt-2">Editar</button>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(reminder.id)}
          className="p-2 h-8 w-8 rounded-full"
        >
          <X size={14} />
        </Button>
      </div>
    </motion.div>
  );
};
