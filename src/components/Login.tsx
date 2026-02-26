import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Credenciais específicas solicitadas pelo usuário
      if (password === '123456789') {
        if (email === 'diretor@teste.com') {
          onLogin('DIRECTOR');
        } else if (email === 'professor@teste.com') {
          onLogin('PROFESSOR');
        } else if (email === 'aluno@teste.com') {
          onLogin('STUDENT');
        } else {
          // Fallback para o papel selecionado se o email não for um dos específicos mas a senha estiver correta
          onLogin(selectedRole);
        }
      } else {
        setError('Credenciais inválidas. Verifique seu e-mail e senha.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        {/* Lado Esquerdo - Branding */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden hidden lg:flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">CertiTrust B2B</span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Certificação Digital para Ambientes Regulados.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Plataforma institucional de alta segurança com validação biométrica e monitoramento de integridade.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Ambiente Criptografado</p>
                <p className="text-xs text-slate-500">Conformidade total com LGPD e ISO 27001</p>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Acesso Restrito</h2>
            <p className="text-slate-500">Entre com suas credenciais institucionais.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com.br"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Perfil de Acesso (Demo)</label>
              <div className="grid grid-cols-3 gap-3">
                {(['STUDENT', 'PROFESSOR', 'DIRECTOR'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      // Preencher automaticamente para facilitar a demo
                      if (role === 'DIRECTOR') setEmail('diretor@teste.com');
                      else if (role === 'PROFESSOR') setEmail('professor@teste.com');
                      else setEmail('aluno@teste.com');
                      setPassword('123456789');
                    }}
                    className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      selectedRole === role 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {role === 'STUDENT' ? 'Aluno' : role === 'PROFESSOR' ? 'Professor' : 'Diretor'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Lembrar acesso</span>
              </label>
              <button type="button" className="text-sm font-bold text-indigo-600 hover:underline">Esqueceu a senha?</button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Problemas com o acesso? Entre em contato com o <br />
              <strong className="text-slate-500">Suporte de TI Institucional</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
