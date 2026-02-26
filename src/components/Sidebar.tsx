import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  Settings, 
  Bell, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  FileText
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  currentView: string;
  onViewChange: (view: string) => void;
  primaryColor: string;
}

export default function Sidebar({ role, currentView, onViewChange, primaryColor }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['DIRECTOR', 'PROFESSOR', 'STUDENT'] },
    { id: 'courses', label: 'Cursos', icon: BookOpen, roles: ['DIRECTOR', 'PROFESSOR', 'STUDENT'] },
    { id: 'users', label: 'Gestão de Alunos', icon: Users, roles: ['DIRECTOR', 'PROFESSOR'] },
    { id: 'evaluations', label: 'Avaliações', icon: FileText, roles: ['PROFESSOR', 'STUDENT'] },
    { id: 'certificates', label: 'Certificações', icon: Award, roles: ['DIRECTOR', 'STUDENT'] },
    { id: 'biometrics', label: 'Validação Biométrica', icon: ShieldCheck, roles: ['DIRECTOR', 'STUDENT'] },
    { id: 'notifications', label: 'Notificações', icon: Bell, roles: ['DIRECTOR'] },
    { id: 'settings', label: 'Configurações', icon: Settings, roles: ['DIRECTOR'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <ShieldCheck size={20} />
        </div>
        <span className="font-bold text-slate-800 tracking-tight">CertiTrust</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-slate-50 text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon 
                size={20} 
                className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} 
                style={isActive ? { color: primaryColor } : {}}
              />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto opacity-50" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => onViewChange('login')}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
