import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Video, 
  Radio, 
  FileText, 
  FileCode, 
  Trash2, 
  GripVertical, 
  Save,
  CheckCircle2,
  Layout,
  Upload,
  Youtube
} from 'lucide-react';
import { Course, Module, ContentItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CourseEditorProps {
  course?: Course;
  onBack: () => void;
  onSave: (course: Course) => void;
}

export default function CourseEditor({ course, onBack, onSave }: CourseEditorProps) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [modules, setModules] = useState<Module[]>(course?.modules || []);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addModule = () => {
    const newModule: Module = {
      id: `m-${Date.now()}`,
      title: `Novo Módulo ${modules.length + 1}`,
      completed: false,
      content: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string, type: ContentItem['type']) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        const newLesson: ContentItem = {
          id: `l-${Date.now()}`,
          type,
          title: type === 'live' ? 'Nova Transmissão ao Vivo' : 'Nova Aula Gravada',
          youtubeId: ''
        };
        return { ...m, content: [...m.content, newLesson] };
      }
      return m;
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<ContentItem>) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          content: m.content.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    }));
  };

  const handleFileUpload = (moduleId: string, lessonId: string, file: File) => {
    if (!file.type.includes('video/mp4')) {
      alert('Por favor, selecione um arquivo MP4.');
      return;
    }

    setUploadingId(lessonId);
    
    // Mock upload delay
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      updateLesson(moduleId, lessonId, { 
        videoUrl: mockUrl, 
        youtubeId: undefined,
        title: file.name.split('.')[0] 
      });
      setUploadingId(null);
    }, 1500);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, content: m.content.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configurar Curso</h1>
            <p className="text-slate-500">Gerencie módulos, aulas gravadas e transmissões ao vivo.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            // Validation: check if all lessons have material
            const allHaveMaterial = modules.every(m => m.content.every(l => l.materialUrl));
            if (!allHaveMaterial) {
              alert('Erro: Todas as aulas devem obrigatoriamente possuir um material didático (PDF) anexado.');
              return;
            }
            onSave({ id: course?.id || 'new', title, description, modules, progress: 0, thumbnail: course?.thumbnail || 'https://picsum.photos/seed/course/800/400' });
          }}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
        >
          <Save size={18} />
          Salvar Curso
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título do Curso</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Curso de Sociologia Avançada"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-lg font-bold focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do curso..."
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all h-24 resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Estrutura de Aulas</h3>
              <button 
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
              >
                <Plus size={18} />
                Adicionar Módulo
              </button>
            </div>

            <AnimatePresence>
              {modules.map((module, mIdx) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="text-slate-300 cursor-grab" size={20} />
                      <input 
                        type="text" 
                        value={module.title}
                        onChange={(e) => {
                          const newModules = [...modules];
                          newModules[mIdx].title = e.target.value;
                          setModules(newModules);
                        }}
                        className="bg-transparent border-none font-bold text-slate-800 p-0 focus:ring-0"
                      />
                    </div>
                    <button onClick={() => removeModule(module.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {module.content.map((lesson) => (
                      <div key={lesson.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 group hover:border-slate-200 transition-all">
                        <div className={`p-2 rounded-lg ${lesson.type === 'live' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {lesson.type === 'live' ? <Radio size={18} /> : <Video size={18} />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" 
                            value={lesson.title}
                            onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                            placeholder="Título da Aula"
                            className="w-full bg-transparent border-none font-medium text-slate-900 p-0 text-sm focus:ring-0"
                          />
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">YouTube ID:</span>
                              <input 
                                type="text" 
                                value={lesson.youtubeId || ''}
                                onChange={(e) => updateLesson(module.id, lesson.id, { youtubeId: e.target.value, isNativeLive: false })}
                                placeholder="ex: dQw4w9WgXcQ"
                                className="flex-1 bg-slate-50 border-none rounded px-2 py-0.5 text-xs font-mono focus:ring-1 focus:ring-indigo-200"
                              />
                            </div>
                            
                            {lesson.type === 'live' && (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id={`native-${lesson.id}`}
                                  checked={lesson.isNativeLive}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { isNativeLive: e.target.checked, youtubeId: e.target.checked ? '' : lesson.youtubeId })}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`native-${lesson.id}`} className="text-[10px] font-bold text-slate-600 uppercase cursor-pointer">Usar Transmissão Nativa CertiTrust</label>
                              </div>
                            )}

                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                              <FileText size={14} className="text-slate-400" />
                              <div className="flex-1">
                                {lesson.materialUrl ? (
                                  <span className="text-[10px] text-emerald-600 font-bold">Material Carregado ✓</span>
                                ) : (
                                  <span className="text-[10px] text-amber-600 font-bold">Material Obrigatório Pendente *</span>
                                )}
                              </div>
                              <label className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                                {lesson.materialUrl ? 'Alterar' : 'Subir PDF'}
                                <input 
                                  type="file" 
                                  accept=".pdf" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      updateLesson(module.id, lesson.id, { materialUrl: URL.createObjectURL(file) });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeLesson(module.id, lesson.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => addLesson(module.id, 'video')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:border-slate-200 hover:text-slate-600 transition-all"
                      >
                        <Video size={14} />
                        Aula Gravada
                      </button>
                      <button 
                        onClick={() => addLesson(module.id, 'live')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:border-slate-200 hover:text-slate-600 transition-all"
                      >
                        <Radio size={14} />
                        Transmissão ao Vivo
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {modules.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Layout size={32} />
                </div>
                <h4 className="font-bold text-slate-900">Nenhum módulo criado</h4>
                <p className="text-sm text-slate-500 mt-1">Comece adicionando o primeiro módulo do curso.</p>
                <button 
                  onClick={addModule}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  Criar Primeiro Módulo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4">Dicas de Configuração</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                <p className="text-xs text-slate-400 leading-relaxed">Use IDs do YouTube para indexar vídeos. O chat será integrado automaticamente.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                <p className="text-xs text-slate-400 leading-relaxed">Para transmissões ao vivo, certifique-se de que o vídeo está configurado como "Público" ou "Não Listado".</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                <p className="text-xs text-slate-400 leading-relaxed">Você pode alternar entre aulas gravadas e lives dentro do mesmo módulo.</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Preview do Curso</h4>
            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400">
              <Video size={40} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
              <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
