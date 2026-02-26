import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Upload, 
  Sparkles, 
  Shield, 
  Settings, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  FileType,
  Send,
  Eye,
  Lock,
  Camera,
  Monitor
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

interface EvaluationCreatorProps {
  onBack: () => void;
  onSave: (evaluation: any) => void;
}

type Step = 'source' | 'config' | 'preview';

export default function EvaluationCreator({ onBack, onSave }: EvaluationCreatorProps) {
  const [step, setStep] = useState<Step>('source');
  const [sourceType, setSourceType] = useState<'upload' | 'ai'>('upload');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
  // Configurações da Prova
  const [config, setConfig] = useState({
    title: '',
    style: 'multiple_choice', // multiple_choice, discursive, essay, mixed
    security: {
      facialConfirmation: true,
      screenLock: true,
    },
    resultDelivery: 'immediate', // immediate, manual
  });

  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere 5 questões de múltipla escolha sobre o seguinte tema: ${aiPrompt}. 
        Retorne em formato JSON como um array de objetos com as propriedades: 
        text (string), options (array de strings), correctAnswer (number - índice da opção correta).`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '[]');
      setGeneratedQuestions(data);
      setStep('config');
    } catch (error) {
      console.error("Erro ao gerar questões:", error);
      alert("Falha ao gerar questões com IA. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulação de processamento de arquivo
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedQuestions([
        { text: 'Questão extraída do documento 1...', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
        { text: 'Questão extraída do documento 2...', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      ]);
      setStep('config');
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Criar Nova Avaliação</h1>
            <p className="text-slate-500">Defina a fonte das questões e parametrize o nível de segurança.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
          <Sparkles size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">AI Assisted Creation</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <StepIndicator active={step === 'source'} completed={step !== 'source'} label="Fonte" />
        <div className="w-12 h-px bg-slate-200"></div>
        <StepIndicator active={step === 'config'} completed={step === 'preview'} label="Configuração" />
        <div className="w-12 h-px bg-slate-200"></div>
        <StepIndicator active={step === 'preview'} completed={false} label="Revisão" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'source' && (
          <motion.div 
            key="source"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Opção Upload */}
            <div 
              onClick={() => setSourceType('upload')}
              className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center group ${
                sourceType === 'upload' ? 'border-indigo-600 bg-white shadow-xl' : 'border-slate-100 bg-white/50 hover:border-slate-200'
              }`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-colors ${
                sourceType === 'upload' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload de Arquivos</h3>
              <p className="text-slate-500 text-sm mb-8">Importe questões de documentos Word, PDF ou HTML existentes.</p>
              
              <div className="flex gap-4 mb-8">
                <FileTypeIcon icon={FileType} label="DOCX" />
                <FileTypeIcon icon={FileText} label="PDF" />
                <FileTypeIcon icon={FileCode} label="HTML" />
              </div>

              {sourceType === 'upload' && (
                <label className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Upload size={20} />
                  Selecionar Arquivo
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.html" />
                </label>
              )}
            </div>

            {/* Opção IA */}
            <div 
              onClick={() => setSourceType('ai')}
              className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center group ${
                sourceType === 'ai' ? 'border-indigo-600 bg-white shadow-xl' : 'border-slate-100 bg-white/50 hover:border-slate-200'
              }`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-colors ${
                sourceType === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Gerar com IA</h3>
              <p className="text-slate-500 text-sm mb-8">Crie questões inéditas a partir de um tema ou prompt estruturado.</p>
              
              <div className="w-full space-y-4">
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Gere 10 questões sobre LGPD para nível pleno..."
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all h-32 resize-none"
                />
                {sourceType === 'ai' && (
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !aiPrompt}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    Gerar Questões agora
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'config' && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10"
          >
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings size={20} className="text-slate-400" />
                Parâmetros da Avaliação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título da Prova</label>
                  <input 
                    type="text" 
                    value={config.title}
                    onChange={(e) => setConfig({...config, title: e.target.value})}
                    placeholder="Ex: Avaliação Trimestral de Compliance"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estilo de Avaliação</label>
                  <select 
                    value={config.style}
                    onChange={(e) => setConfig({...config, style: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 transition-all"
                  >
                    <option value="multiple_choice">Múltipla Escolha</option>
                    <option value="discursive">Discursiva</option>
                    <option value="essay">Dissertativa</option>
                    <option value="mixed">Mista (Múltipla + Discursiva)</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield size={20} className="text-slate-400" />
                Nível de Segurança e Integridade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SecurityToggle 
                  icon={Camera}
                  title="Confirmação Facial"
                  description="Exige validação biométrica antes e durante a prova."
                  active={config.security.facialConfirmation}
                  onToggle={() => setConfig({
                    ...config, 
                    security: { ...config.security, facialConfirmation: !config.security.facialConfirmation }
                  })}
                />
                <SecurityToggle 
                  icon={Monitor}
                  title="Trava de Tela (Anti-Evasão)"
                  description="Bloqueia a troca de abas e registra tentativas de saída."
                  active={config.security.screenLock}
                  onToggle={() => setConfig({
                    ...config, 
                    security: { ...config.security, screenLock: !config.security.screenLock }
                  })}
                />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send size={20} className="text-slate-400" />
                Entrega de Resultados
              </h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfig({...config, resultDelivery: 'immediate'})}
                  className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left ${
                    config.resultDelivery === 'immediate' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">Imediata</span>
                    {config.resultDelivery === 'immediate' && <CheckCircle2 size={20} className="text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500">O aluno visualiza a nota e o feedback logo após finalizar.</p>
                </button>
                <button 
                  onClick={() => setConfig({...config, resultDelivery: 'manual'})}
                  className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left ${
                    config.resultDelivery === 'manual' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">Manual (Professor)</span>
                    {config.resultDelivery === 'manual' && <CheckCircle2 size={20} className="text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500">O professor revisa e libera o resultado individualmente.</p>
                </button>
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <button 
                onClick={() => setStep('preview')}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
              >
                Revisar Avaliação
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{config.title || 'Avaliação sem título'}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {config.style === 'multiple_choice' ? 'Múltipla Escolha' : config.style === 'discursive' ? 'Discursiva' : config.style === 'essay' ? 'Dissertativa' : 'Mista'}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-500 text-xs">{generatedQuestions.length} Questões</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {config.security.facialConfirmation && <SecurityBadge icon={Camera} label="Biometria" />}
                  {config.security.screenLock && <SecurityBadge icon={Lock} label="Trava" />}
                </div>
              </div>

              <div className="space-y-6">
                {generatedQuestions.map((q, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-4">{i + 1}. {q.text}</p>
                    {q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className={`p-3 rounded-xl text-sm ${optIdx === q.correctAnswer ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-white text-slate-500 border border-slate-100'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button 
                onClick={() => setStep('config')}
                className="px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors"
              >
                Voltar para Configuração
              </button>
              <button 
                onClick={() => onSave({...config, questions: generatedQuestions})}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl flex items-center gap-2"
              >
                Publicar Avaliação
                <CheckCircle2 size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepIndicator({ active, completed, label }: { active: boolean, completed: boolean, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 
        completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
      }`}>
        {completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function FileTypeIcon({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-slate-400">{label}</span>
    </div>
  );
}

function SecurityToggle({ icon: Icon, title, description, active, onToggle }: any) {
  return (
    <div 
      onClick={onToggle}
      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
        active ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className={`p-3 rounded-xl ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-900">{title}</span>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SecurityBadge({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
      <Icon size={14} />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function Loader2(props: any) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
