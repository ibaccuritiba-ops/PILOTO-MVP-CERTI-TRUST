import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Shield, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2,
  Eye,
  Camera
} from 'lucide-react';
import { Exam, Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ExamViewProps {
  exam: Exam;
  onFinish: (score: number) => void;
}

export default function ExamView({ exam, onFinish }: ExamViewProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [evasionAttempts, setEvasionAttempts] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setEvasionAttempts(prev => prev + 1);
        setShowWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleFinish = () => {
    let score = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    const finalScore = (score / exam.questions.length) * 100;
    setIsFinished(true);
    setTimeout(() => onFinish(finalScore), 3000);
  };

  const currentQuestion = exam.questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / exam.questions.length) * 100;

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Avaliação Concluída</h2>
        <p className="text-slate-500 max-w-md mb-8">Suas respostas foram enviadas com sucesso. O sistema está processando sua nota e gerando o relatório de conformidade.</p>
        <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5 }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col overflow-hidden font-sans">
      {/* Header de Prova */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Shield className="text-indigo-600" size={24} />
            <span>MODO PROVA ATIVO</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">{exam.title}</h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Ambiente Monitorado</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-sm">
            <Clock size={20} className="text-slate-400" />
            <span className="font-mono text-lg font-bold tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <Eye size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Monitoramento Facial Ativo</span>
          </div>
        </div>
      </header>

      {/* Barra de Progresso */}
      <div className="w-full h-1 bg-slate-100 shrink-0">
        <motion.div 
          className="h-full bg-indigo-600" 
          animate={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestion.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Questão {currentQuestionIdx + 1} de {exam.questions.length}</span>
                {evasionAttempts > 0 && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                    {evasionAttempts} Alerta(s) de Evasão
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-10 leading-relaxed">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(currentQuestion.id, idx)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 group ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-base font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
              Questão Anterior
            </button>
            
            {currentQuestionIdx === exam.questions.length - 1 ? (
              <button 
                onClick={handleFinish}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
              >
                Finalizar Avaliação
                <CheckCircle2 size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
              >
                Próxima Questão
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Alerta de Evasão */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Alerta de Segurança</h3>
              <p className="text-slate-500 mb-8">
                Detectamos que você saiu da aba da prova. Esta ação foi registrada no seu relatório de conformidade. Tentativas repetidas podem invalidar sua avaliação.
              </p>
              <button 
                onClick={() => setShowWarning(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Compreendo e desejo continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="h-12 bg-slate-100 px-8 flex items-center justify-center border-t border-slate-200 shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Plataforma CertiTrust &copy; 2024 - Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
