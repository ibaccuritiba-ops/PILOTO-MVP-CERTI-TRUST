import React from 'react';
import { User } from '../types';
import { Bell, Search, User as UserIcon } from 'lucide-react';

interface TopbarProps {
  user: User;
  institutionName: string;
}

export default function Topbar({ user, institutionName }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{institutionName}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar no sistema..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-slate-200 transition-all"
          />
        </div>

        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user.role === 'DIRECTOR' ? 'Diretor Institucional' : user.role === 'PROFESSOR' ? 'Professor / Gestor' : 'Aluno'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <UserIcon size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
