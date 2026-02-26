import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Pause, 
  Play, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  BookOpen,
  Lock,
  Unlock
} from 'lucide-react';
import { User, Course, Module, ContentItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StudentManagementProps {
  students: User[];
  courses: Course[];
  onAddStudent: (student: Partial<User>) => void;
  onUpdateStudent: (student: User) => void;
  onDeleteStudent: (studentId: string) => void;
}

export default function StudentManagement({ 
  students, 
  courses, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent 
}: StudentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    status: 'ACTIVE' as const,
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
      ...newStudent,
      role: 'STUDENT',
      allowedLessons: [], // Initially no specific restrictions or all? Let's say empty means all by default or none? 
      // User request says "Escolher qual aula cada aluno tem acesso", so maybe default is none or all.
      // Let's assume empty means ALL for simplicity unless restricted.
    });
    setNewStudent({ name: '', email: '', status: 'ACTIVE' });
    setIsAddModalOpen(false);
  };

  const toggleStatus = (student: User) => {
    onUpdateStudent({
      ...student,
      status: student.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    });
  };

  const toggleLessonAccess = (student: User, lessonId: string) => {
    const currentAllowed = student.allowedLessons || [];
    const isAllowed = currentAllowed.includes(lessonId);
    
    let nextAllowed;
    if (isAllowed) {
      nextAllowed = currentAllowed.filter(id => id !== lessonId);
    } else {
      nextAllowed = [...currentAllowed, lessonId];
    }

    onUpdateStudent({
      ...student,
      allowedLessons: nextAllowed
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Alunos</h1>
          <p className="text-slate-500">Cadastre novos alunos e gerencie permissões de acesso.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Cadastrar Aluno
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acesso</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      student.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {student.status === 'ACTIVE' ? <CheckCircle2 size={12} /> : <Pause size={12} />}
                      {student.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsAccessModalOpen(true);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Lock size={14} />
                      Gerenciar Aulas
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(student)}
                        className={`p-2 rounded-lg transition-colors ${
                          student.status === 'ACTIVE' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={student.status === 'ACTIVE' ? 'Pausar Aluno' : 'Reativar Aluno'}
                      >
                        {student.status === 'ACTIVE' ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button 
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir Aluno"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Cadastrar Novo Aluno</h2>
                <p className="text-slate-500 text-sm">Preencha os dados para liberar o acesso à plataforma.</p>
              </div>
              <form onSubmit={handleAddStudent} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="Ex: Carlos Eduardo Silva"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Institucional</label>
                  <input 
                    required
                    type="email" 
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all"
                    placeholder="carlos@exemplo.com"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Confirmar Cadastro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Acesso às Aulas */}
      <AnimatePresence>
        {isAccessModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gerenciar Acesso</h2>
                    <p className="text-slate-500 text-sm">Defina quais aulas <strong>{selectedStudent.name}</strong> pode visualizar.</p>
                  </div>
                  <button 
                    onClick={() => setIsAccessModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <XCircle size={24} className="text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {courses.map(course => (
                  <div key={course.id} className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                      <BookOpen size={20} className="text-indigo-600" />
                      <h3 className="font-bold text-slate-900">{course.title}</h3>
                    </div>
                    <div className="space-y-6 pl-4">
                      {course.modules.map(module => (
                        <div key={module.id} className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{module.title}</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {module.content.map(lesson => {
                              const isAllowed = (selectedStudent.allowedLessons || []).includes(lesson.id) || (selectedStudent.allowedLessons?.length === 0);
                              // If allowedLessons is empty, let's assume ALL are allowed by default for this UI
                              // Actually, let's make it explicit. If it's in the list, it's allowed.
                              // If the list is empty, maybe none are allowed? 
                              // User said "Escolher qual aula cada aluno tem acesso".
                              
                              const isExplicitlyAllowed = (selectedStudent.allowedLessons || []).includes(lesson.id);

                              return (
                                <div 
                                  key={lesson.id}
                                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                    isExplicitlyAllowed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isExplicitlyAllowed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                      {isExplicitlyAllowed ? <Unlock size={16} /> : <Lock size={16} />}
                                    </div>
                                    <span className={`text-sm font-medium ${isExplicitlyAllowed ? 'text-emerald-900' : 'text-slate-600'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => toggleLessonAccess(selectedStudent, lesson.id)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                      isExplicitlyAllowed 
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    }`}
                                  >
                                    {isExplicitlyAllowed ? 'Revogar' : 'Liberar'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => setIsAccessModalOpen(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  Concluir Configuração
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
