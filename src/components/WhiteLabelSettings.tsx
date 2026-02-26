import React, { useState } from 'react';
import { 
  Palette, 
  Upload, 
  Globe, 
  Mail, 
  Bell, 
  Check,
  RefreshCw,
  Eye
} from 'lucide-react';
import { WhiteLabelConfig, NotificationTemplate } from '../types';

interface WhiteLabelSettingsProps {
  config: WhiteLabelConfig;
  onUpdate: (newConfig: WhiteLabelConfig) => void;
}

export default function WhiteLabelSettings({ config, onUpdate }: WhiteLabelSettingsProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const [activeTab, setActiveTab] = useState<'visual' | 'notifications'>('visual');

  const handleSave = () => {
    onUpdate(localConfig);
  };

  const colorPresets = [
    { primary: '#0f172a', secondary: '#334155', name: 'Slate (Padrão)' },
    { primary: '#166534', secondary: '#14532d', name: 'Verde Institucional' },
    { primary: '#1e40af', secondary: '#1e3a8a', name: 'Azul Corporativo' },
    { primary: '#7c2d12', secondary: '#431407', name: 'Terra Cotta' },
    { primary: '#4c1d95', secondary: '#2e1065', name: 'Roxo Moderno' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações White-Label</h1>
          <p className="text-slate-500">Personalize a identidade visual e as comunicações da sua plataforma.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
        >
          <Check size={18} />
          Salvar Alterações
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('visual')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'visual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Identidade Visual
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Comunicações Automáticas
        </button>
      </div>

      {activeTab === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Globe size={20} className="text-slate-400" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Instituição</label>
                    <input 
                      type="text" 
                      value={localConfig.institutionName}
                      onChange={(e) => setLocalConfig({...localConfig, institutionName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Favicon URL</label>
                    <input 
                      type="text" 
                      value={localConfig.faviconUrl}
                      onChange={(e) => setLocalConfig({...localConfig, faviconUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 transition-all"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Palette size={20} className="text-slate-400" />
                  Paleta de Cores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cor Primária</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={localConfig.primaryColor}
                        onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={localConfig.primaryColor}
                        onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cor Secundária</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={localConfig.secondaryColor}
                        onChange={(e) => setLocalConfig({...localConfig, secondaryColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={localConfig.secondaryColor}
                        onChange={(e) => setLocalConfig({...localConfig, secondaryColor: e.target.value})}
                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Presets Recomendados</p>
                  <div className="flex flex-wrap gap-3">
                    {colorPresets.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => setLocalConfig({...localConfig, primaryColor: preset.primary, secondaryColor: preset.secondary})}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all group"
                      >
                        <div className="flex -space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload size={20} className="text-slate-400" />
                  Logotipo Institucional
                </h3>
                <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-24 h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={localConfig.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain p-2" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-700">Arraste seu logo ou clique para upload</p>
                    <p className="text-xs text-slate-400">PNG, SVG ou JPG. Recomendado: 400x400px.</p>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                      Selecionar Arquivo
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Eye size={20} className="text-slate-400" />
                Preview em Tempo Real
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: localConfig.primaryColor }}>
                      <Check size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-bold">{localConfig.institutionName}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                    <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                  </div>
                </div>

                <button 
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg"
                  style={{ backgroundColor: localConfig.primaryColor }}
                >
                  Botão Primário
                </button>

                <div className="flex justify-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Interface Profissional</p>
                </div>
              </div>

              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: localConfig.primaryColor }}></div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Dica de Design</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Para manter o aspecto profissional em ambientes regulados, prefira cores com alto contraste e evite tons excessivamente vibrantes ou saturados.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {[
            { type: 'APPROVAL', title: 'Modelo: Aprovação em Curso', subject: 'Parabéns! Você foi aprovado no curso {{curso_nome}}' },
            { type: 'REJECTION', title: 'Modelo: Reprovação / Reciclagem', subject: 'Resultado da Avaliação: {{curso_nome}}' },
            { type: 'CERTIFICATE', title: 'Modelo: Emissão de Certificado', subject: 'Seu certificado de {{curso_nome}} está disponível' },
          ].map((template, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{template.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Enviado automaticamente pelo sistema</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                  Editar Template
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assunto do E-mail</label>
                  <div className="px-4 py-2 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100">
                    {template.subject}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corpo da Mensagem (Preview)</label>
                  <div className="px-4 py-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100 leading-relaxed italic">
                    Olá {"{{aluno_nome}}"}, informamos que sua avaliação para o curso {"{{curso_nome}}"} foi processada...
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
