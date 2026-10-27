import React from 'react';
import { Home, Settings, List, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ active, onClick, icon, label }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-full py-2 transition-all duration-300",
      active ? "text-primary" : "text-text-secondary hover:text-text-main"
    )}
  >
    <div className={cn(
      "p-1 rounded-xl transition-all duration-300",
      active ? "bg-primary/10 scale-110" : "bg-transparent"
    )}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
    </div>
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export const AppShell = ({ children, activeTab, setActiveTab }: {
  children: React.ReactNode,
  activeTab: string,
  setActiveTab: (tab: string) => void
}) => {
  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col safe-top safe-bottom">
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-border px-6 pb-safe pt-2 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <NavItem
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
            icon={<Home />}
            label="Inicio"
          />
          <NavItem
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            icon={<List />}
            label="Todos"
          />
          <NavItem
            active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
            icon={<CheckCircle />}
            label="Hecho"
          />
          <NavItem
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={<Settings />}
            label="Ajustes"
          />
        </div >
      </nav>
    </div>
  );
};
