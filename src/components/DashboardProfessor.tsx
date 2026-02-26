import React from 'react';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  Filter,
  CheckCircle2,
  Clock,
  Edit2,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Course, User } from '../types';

interface DashboardProfessorProps {
  courses: Course[];
  evaluations: any[];
  students: User[];
  onCreateEvaluation: () => void;
  onEditCourse: (courseId: string) => void;
  onCreateCourse: () => void;
  currentView: string;
}

export default function DashboardProfessor({ 
  courses, 
  evaluations, 
  students,
  onCreateEvaluation, 
  onEditCourse, 
  onCreateCourse,
  currentView 
}: DashboardProfessorProps) {
  const isEvaluationsView = currentView === 'evaluations';
  const isCoursesView = currentView === 'courses';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEvaluationsView ? 'Gestão de Avaliações' : isCoursesView ? 'Gestão de Cursos' : 'Gestão de Turmas e Avaliações'}
          </h1>
          <p className="text-slate-500">
            {isEvaluationsView 
              ? 'Gerencie suas provas, banco de questões e níveis de segurança.' 
              : 'Acompanhe o progresso dos seus alunos e gerencie o conteúdo.'}
          </p>
        </div>
        <div className="flex gap-3">
          {!isEvaluationsView && (
            <button 
              onClick={onCreateCourse}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Plus size={18} />
              Novo Curso
            </button>
          )}
          <button 
            onClick={onCreateEvaluation}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Criar Avaliação
          </button>
        </div>
      </div>

      {/* Métricas do Professor */}
      {!isEvaluationsView && !isCoursesView && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Total de Alunos" value={students.length.toString()} trend="+12%" />
          <StatCard icon={BookOpen} label="Cursos Ativos" value={courses.length.toString()} />
          <StatCard icon={CheckCircle} label="Aprovações" value="94%" trend="+2%" />
          <StatCard icon={AlertCircle} label="Pendências" value="15" color="text-amber-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Lista de Cursos ou Avaliações */}
          {isEvaluationsView ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Avaliações Publicadas</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Filtrar avaliações..." className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs w-48" />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{evaluation.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {evaluation.questions?.length || 0} Questões • {evaluation.style === 'multiple_choice' ? 'Múltipla Escolha' : 'Mista'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {evaluation.security?.facialConfirmation && <div className="p-1 bg-emerald-50 text-emerald-600 rounded" title="Biometria"><CheckCircle size={14} /></div>}
                        {evaluation.security?.screenLock && <div className="p-1 bg-blue-50 text-blue-600 rounded" title="Trava de Tela"><AlertCircle size={14} /></div>}
                      </div>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {evaluations.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    Nenhuma avaliação criada ainda.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Meus Cursos</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Filtrar cursos..." className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs w-48" />
                  </div>
                  <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"><Filter size={16}/></button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{course.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{course.modules.length} Módulos • 450 alunos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conclusão</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-slate-700">88%</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => onEditCourse(course.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Banco de Questões Recentes</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { text: 'Qual a definição de Insider Trading?', category: 'Compliance', difficulty: 'Média' },
                { text: 'Quais os pilares da ISO 27001?', category: 'Segurança', difficulty: 'Difícil' },
                { text: 'O que é o princípio da transparência na LGPD?', category: 'LGPD', difficulty: 'Fácil' },
              ].map((q, i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{q.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">{q.category}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">Dificuldade: {q.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Editar</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Status de Alunos</h3>
            <div className="space-y-4">
              <StatusItem label="Aprovados" value="124" icon={CheckCircle2} color="text-emerald-500" />
              <StatusItem label="Em Avaliação" value="18" icon={Clock} color="text-blue-500" />
              <StatusItem label="Reprovados" value="5" icon={AlertTriangleIcon} color="text-red-500" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Suporte ao Professor</h3>
              <p className="text-slate-400 text-sm mb-4">Precisa de ajuda para parametrizar uma prova segura?</p>
              <button className="w-full py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                Consultar Guia
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <ShieldCheckIcon size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color = "text-indigo-600" }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

function StatusItem({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-3">
        <Icon size={18} className={color} />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}

function AlertTriangleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
