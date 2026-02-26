import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Play, 
  Lock,
  ArrowRight,
  Download,
  Send,
  Radio,
  Users,
  Unlock,
  Trash2
} from 'lucide-react';
import { Course, Module, ChatMessage, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CourseViewProps {
  course: Course;
  user: User;
  onBack: () => void;
  onStartExam: (courseId: string) => void;
  onUpdateCourse: (course: Course) => void;
}

export default function CourseView({ course, user, onBack, onStartExam, onUpdateCourse }: CourseViewProps) {
  // Filter course content based on user's allowedLessons
  const filteredModules = course.modules.map(module => ({
    ...module,
    content: module.content.filter(item => 
      !user.allowedLessons || user.allowedLessons.length === 0 || user.allowedLessons.includes(item.id)
    )
  })).filter(module => module.content.length > 0);

  const [activeModule, setActiveModule] = useState<Module>(filteredModules[0] || course.modules[0]);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatLocked, setIsChatLocked] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentContent = activeModule?.content[activeContentIndex];

  useEffect(() => {
    if (filteredModules.length > 0 && !filteredModules.find(m => m.id === activeModule.id)) {
      setActiveModule(filteredModules[0]);
      setActiveContentIndex(0);
    }
  }, [user.allowedLessons]);

  useEffect(() => {
    // Mock initial messages
    setChatMessages([
      { id: '1', userName: 'Maria Silva', text: 'Boa tarde a todos!', timestamp: '14:00', role: 'STUDENT' },
      { id: '2', userName: 'João Pereira', text: 'Aula muito importante para o compliance.', timestamp: '14:02', role: 'STUDENT' },
      { id: '3', userName: 'Profa. Helena Costa', text: 'Sejam bem-vindos! Podem tirar dúvidas aqui.', timestamp: '14:05', role: 'PROFESSOR' },
    ]);
  }, [currentContent]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      userName: user.name,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: user.role
    };

    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
  };

  const handleDeleteMessage = (id: string) => {
    setChatMessages(chatMessages.map(m => m.id === id ? { ...m, isDeleted: true, text: 'Esta mensagem foi removida por um moderador.' } : m));
  };

  const handleCompleteLesson = () => {
    const updatedModules = course.modules.map(m => {
      if (m.id === activeModule.id) {
        // Simple logic: if all lessons in module are done, mark module as done
        // For now just update progress
        return m;
      }
      return m;
    });

    const newProgress = Math.min(100, course.progress + 5);
    onUpdateCourse({ ...course, progress: newProgress, modules: updatedModules });
    alert('Aula concluída!');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden animate-in slide-in-from-right duration-500">
      {/* Sidebar de Conteúdo */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-slate-100">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Voltar aos cursos</span>
          </button>
          <h2 className="font-bold text-slate-900 leading-tight">{course.title}</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Progresso</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredModules.map((module, mIdx) => (
            <div key={module.id} className="border-b border-slate-50">
              <div className="p-4 bg-slate-50/50 flex items-center gap-3">
                {module.completed ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <Circle size={18} className="text-slate-300" />
                )}
                <span className="text-sm font-bold text-slate-700">{module.title}</span>
              </div>
              <div className="bg-white">
                {module.content.map((content, cIdx) => {
                  const isActive = activeModule.id === module.id && activeContentIndex === cIdx;
                  return (
                    <button
                      key={content.id}
                      onClick={() => {
                        setActiveModule(module);
                        setActiveContentIndex(cIdx);
                      }}
                      className={`w-full text-left px-10 py-3 text-sm transition-colors flex items-center gap-3 ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {content.type === 'pdf' ? <Download size={14} /> : content.type === 'live' ? <Radio size={14} /> : <Play size={14} />}
                      <span className="truncate">{content.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="p-6">
            <button 
              onClick={() => onStartExam(course.id)}
              disabled={course.progress < 100}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                course.progress >= 100 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {course.progress < 100 && <Lock size={16} />}
              Iniciar Avaliação Final
            </button>
          </div>
        </div>
      </div>

      {/* Área do Conteúdo Principal */}
      <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
        <div className="p-8 flex-1 overflow-y-auto flex gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{currentContent?.title || 'Conteúdo'}</h3>
                  <p className="text-sm text-slate-500 mt-1">{activeModule?.title}</p>
                </div>
                {currentContent?.type === 'live' && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
                    <Radio size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ao Vivo</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                {!currentContent ? (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                      <Lock size={40} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Acesso Restrito</h4>
                    <p className="text-slate-500 mt-2 max-w-xs">
                      Você não possui permissão para visualizar este conteúdo. Entre em contato com seu professor.
                    </p>
                  </div>
                ) : currentContent.type === 'html' ? (
                  <div className="p-12 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: currentContent.body || '' }}></div>
                ) : currentContent.type === 'video' || currentContent.type === 'live' ? (
                  <div className="aspect-video bg-black relative">
                    {currentContent.isNativeLive ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900">
                        <Radio size={64} className="text-red-500 mb-4 animate-pulse" />
                        <h4 className="text-xl font-bold">Transmissão Nativa CertiTrust</h4>
                        <p className="text-slate-400 mt-2">Conectando ao servidor de streaming seguro...</p>
                      </div>
                    ) : currentContent.videoUrl ? (
                      <video 
                        src={currentContent.videoUrl} 
                        controls 
                        className="w-full h-full"
                        poster={course.thumbnail}
                      />
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentContent.youtubeId || 'dQw4w9WgXcQ'}?autoplay=0&rel=0&modestbranding=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                      <FileText size={40} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Documento PDF</h4>
                    <button className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                      <Download size={18} />
                      Visualizar Documento
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CertiTrust Content Engine</span>
                <button 
                  onClick={handleCompleteLesson}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Marcar como concluído
                </button>
              </div>
            </div>

            {currentContent?.materialUrl && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Material Didático Obrigatório</h4>
                    <p className="text-xs text-slate-500">Acompanhe a aula com o material de apoio oficial.</p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                  Visualizar Material
                </button>
              </div>
            )}

            {(currentContent?.type === 'video' || currentContent?.type === 'live') && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Sobre esta aula</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Nesta aula abordaremos os fundamentos teóricos e práticos necessários para a compreensão plena do módulo. 
                  Utilize o chat ao lado para interagir com outros alunos e com o professor em tempo real.
                </p>
              </div>
            )}
          </div>

          {/* Chat Integrado */}
          {(currentContent?.type === 'video' || currentContent?.type === 'live') && (
            <div className="w-80 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden shrink-0">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Chat da Turma</span>
                </div>
                <div className="flex items-center gap-2">
                  {user.role === 'PROFESSOR' && (
                    <button 
                      onClick={() => setIsChatLocked(!isChatLocked)}
                      className={`p-1.5 rounded-lg transition-colors ${isChatLocked ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-100'}`}
                      title={isChatLocked ? 'Desbloquear Chat' : 'Bloquear Chat'}
                    >
                      {isChatLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-400">12 online</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="group relative space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${msg.role === 'PROFESSOR' ? 'text-indigo-600' : 'text-slate-900'}`}>
                        {msg.userName}
                      </span>
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                      {user.role === 'PROFESSOR' && !msg.isDeleted && (
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isDeleted ? 'bg-slate-50 text-slate-400 italic' :
                      msg.userName === user.name 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100">
                <div className="relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isChatLocked && user.role !== 'PROFESSOR'}
                    placeholder={isChatLocked ? "Chat bloqueado pelo professor" : "Digite sua mensagem..."}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-xs focus:ring-2 focus:ring-indigo-200 transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={isChatLocked && user.role !== 'PROFESSOR'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
