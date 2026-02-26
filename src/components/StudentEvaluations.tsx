import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, Play } from 'lucide-react';
import { Exam } from '../types';

interface StudentEvaluationsProps {
  availableExams: Exam[];
  completedExams: any[]; // In a real app, this would be a separate type with scores
  onTakeExam: (exam: Exam) => void;
}

export default function StudentEvaluations({ availableExams, completedExams, onTakeExam }: StudentEvaluationsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Minhas Avaliações</h1>
        <p className="text-slate-500">Realize suas provas e acompanhe seu desempenho acadêmico.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avaliações Disponíveis */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} />
            Provas Disponíveis
          </h3>
          <div className="space-y-4">
            {availableExams.map(exam => (
              <div key={exam.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{exam.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{exam.durationMinutes} minutos • {exam.questions.length} questões</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onTakeExam(exam)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                  >
                    <Play size={16} />
                    Iniciar
                  </button>
                </div>
              </div>
            ))}
            {availableExams.length === 0 && (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
                Nenhuma avaliação disponível no momento.
              </div>
            )}
          </div>
        </div>

        {/* Resultados Anteriores */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={16} />
            Resultados e Histórico
          </h3>
          <div className="space-y-4">
            {completedExams.map((result, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${result.score >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{result.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Finalizada em {result.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${result.score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {result.score}%
                  </span>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {result.score >= 70 ? 'Aprovado' : 'Reprovado'}
                  </p>
                </div>
              </div>
            ))}
            {completedExams.length === 0 && (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
                Você ainda não realizou nenhuma avaliação.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
