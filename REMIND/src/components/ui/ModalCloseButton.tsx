import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const ModalCloseButton = ({ onClick, className }: { onClick: () => void, className?: string }) => (
  <Button variant="ghost" size="sm" onClick={onClick} className={cn('rounded-full p-2', className)}>
    <X size={20} />
  </Button>
);
