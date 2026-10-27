import { motion } from 'framer-motion';
import { Bell, Globe, Layout, Info, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold text-text-main">Ajustes</h1>
        <p className="text-text-secondary text-sm">Configura tu experiencia de REMIND</p>
      </header>

      {/* Notificaciones Section */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Notificaciones</h2>
        <div className="bg-surface border border-border rounded-premium divide-y divide-border overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-main">Activar Notificaciones</p>
                <p className="text-[11px] text-text-secondary">Recibir avisos en tu iPhone</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-border rounded-full relative cursor-not-allowed">
              <div className="absolute left-1 top-1 w-3 h-3 bg-text-secondary rounded-full" />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-main">Diagnóstico Push</p>
                <p className="text-[11px] text-text-secondary">Estado: <span className="text-error">No configurado</span></p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">Probar</Button>
          </div>
        </div>
      </section>

      {/* Preferencias Section */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Preferencias</h2>
        <div className="bg-surface border border-border rounded-premium divide-y divide-border overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-main">Zona Horaria</p>
                <p className="text-[11px] text-text-secondary">UTC-05:00 (Local)</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layout size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-main">Apariencia</p>
                <p className="text-[11px] text-text-secondary">Modo Oscuro Premium</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-main">Instalación PWA</p>
                <p className="text-[11px] text-text-secondary">Instala desde Safari para notificaciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Info */}
      <footer className="text-center py-8">
        <p className="text-text-secondary text-xs">REMIND v0.1.0 Alpha</p>
        <p className="text-text-secondary text-[10px] mt-1">Diseñado para iOS 16.4+</p>
      </footer>
    </motion.div>
  );
};
