import React from 'react';
import { 
  BookOpen, 
  Award, 
  Clock, 
  ChevronRight, 
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Course, User } from '../types';

interface DashboardStudentProps {
  user: User;
  courses: Course[];
  onStartCourse: (courseId: string) => void;
  onViewCertificate: (certId: string) => void;
}

export default function DashboardStudent({ user, courses, onStartCourse, onViewCertificate }: DashboardStudentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo de volta, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-400 text-lg mb-6">Você tem 1 curso em andamento e 2 certificações disponíveis para renovação este mês.</p>
          <button 
            onClick={() => onStartCourse('c1')}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            Continuar Compliance 2024
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Meus Cursos</h3>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Ver catálogo completo</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="h-40 relative overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded tracking-wider border border-white/30">
                      Institucional
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h4>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-wider">Progresso</span>
                      <span className="text-slate-900">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <button 
                      onClick={() => onStartCourse(course.id)}
                      className="w-full py-2.5 bg-slate-50 text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      {course.progress > 0 ? 'Continuar' : 'Iniciar Curso'}
                      <Play size={14} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Minhas Certificações</h3>
            <div className="space-y-4">
              {[
                { title: 'Ética Corporativa', date: '15 Jan 2024', id: 'cert1' },
                { title: 'Segurança Digital', date: '10 Dez 2023', id: 'cert2' },
              ].map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group" onClick={() => onViewCertificate(cert.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{cert.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Emitido em {cert.date}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-bold text-indigo-600 hover:underline">Ver histórico completo</button>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Atenção Necessária</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Sua certificação de <strong>Prevenção à Lavagem de Dinheiro</strong> expira em 12 dias. Inicie a reciclagem agora para manter sua conformidade.
                </p>
                <button className="mt-3 text-xs font-bold text-amber-900 underline">Iniciar Reciclagem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
