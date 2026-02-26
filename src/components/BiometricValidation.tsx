import React, { useState, useEffect } from 'react';
import { ShieldCheck, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BiometricValidationProps {
  onValidated: () => void;
}

export default function BiometricValidation({ onValidated }: BiometricValidationProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setStatus('scanning');
    setProgress(0);
  };

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('success');
            setTimeout(onValidated, 2000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Validação de Identidade</h1>
        <p className="text-slate-500">Para garantir a integridade da certificação, realize a verificação biométrica.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-8 group">
          {/* Mock Camera Feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://picsum.photos/seed/face/800/450" 
              alt="Camera Feed Mock" 
              className={`w-full h-full object-cover opacity-60 transition-all duration-1000 ${status === 'scanning' ? 'blur-[2px] scale-105' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Scanning Overlay */}
          <AnimatePresence>
            {status === 'scanning' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-indigo-400/50 rounded-full">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-indigo-400 rounded-full"
                  />
                </div>
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] z-10"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Indicators */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status === 'scanning' ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                {status === 'scanning' ? 'Verificando...' : 'Câmera Pronta'}
              </span>
            </div>
            {status === 'scanning' && (
              <span className="text-white font-mono text-sm font-bold">{progress}%</span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {status === 'idle' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Camera size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Enquadramento</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Autenticidade</span>
                </div>
              </div>
              <button 
                onClick={startScan}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Iniciar Captura Facial
                <Camera size={20} />
              </button>
            </div>
          )}

          {status === 'scanning' && (
            <div className="space-y-4">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-100" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-center text-sm text-slate-500 font-medium">Mantenha o rosto centralizado e evite movimentos bruscos.</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Identidade Confirmada</h4>
                <p className="text-sm text-emerald-700">Validação realizada com sucesso. Redirecionando...</p>
              </div>
              <Loader2 className="ml-auto text-emerald-600 animate-spin" size={20} />
            </motion.div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-red-900">Falha na Verificação</h4>
                <p className="text-sm text-red-700">Não foi possível confirmar sua identidade. Tente novamente em um ambiente mais iluminado.</p>
              </div>
              <button 
                onClick={startScan}
                className="ml-auto text-sm font-bold text-red-600 hover:underline"
              >
                Tentar Novamente
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-100 p-6 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Por que isso é necessário?</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Como esta é uma certificação para ambientes regulados, a validação biométrica garante que o aluno certificado é de fato a pessoa que realizou o treinamento e as avaliações, cumprindo requisitos de auditoria e compliance institucional.
        </p>
      </div>
    </div>
  );
}
