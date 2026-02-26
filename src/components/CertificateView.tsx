import React from 'react';
import { Award, Download, Share2, ShieldCheck, QrCode, Printer } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateViewProps {
  certificate: Certificate;
  onBack: () => void;
}

export default function CertificateView({ certificate, onBack }: CertificateViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificado de Conclusão</h1>
          <p className="text-slate-500">Documento oficial de certificação profissional.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Share2 size={18} />
            Compartilhar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Certificado Físico Mock */}
      <div className="bg-white p-12 rounded-[2rem] border-8 border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Border Accent */}
        <div className="absolute inset-4 border border-slate-200 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-slate-50 rounded-br-full -translate-x-10 -translate-y-10 border-r border-b border-slate-200"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <img src={certificate.logoUrl} alt="Logo" className="h-20 mb-10 grayscale opacity-80" />
          
          <div className="space-y-2 mb-12">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">Certificado de Conclusão</h2>
            <p className="text-slate-500 italic font-serif">A {certificate.institutionName} confere a:</p>
          </div>

          <h3 className="text-5xl font-bold text-slate-900 mb-8 font-serif tracking-tight">
            {certificate.studentName}
          </h3>

          <div className="max-w-2xl mx-auto mb-16">
            <p className="text-lg text-slate-600 leading-relaxed">
              O presente certificado, atestando a conclusão com êxito do programa de treinamento e avaliação em 
              <strong className="text-slate-900"> {certificate.courseTitle}</strong>, realizado em conformidade com as normas institucionais e regulatórias vigentes.
            </p>
          </div>

          <div className="grid grid-cols-3 w-full gap-8 mb-16">
            <div className="flex flex-col items-center">
              <div className="w-32 h-px bg-slate-300 mb-4"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Diretoria Acadêmica</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-200 mb-2">
                <ShieldCheck size={32} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Selo de Autenticidade</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-px bg-slate-300 mb-4"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Coordenação de Curso</p>
            </div>
          </div>

          <div className="w-full pt-12 border-t border-slate-100 flex items-end justify-between">
            <div className="text-left space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data de Emissão</p>
              <p className="text-sm font-bold text-slate-900">{certificate.issueDate}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-4">Código de Validação</p>
              <p className="text-sm font-mono font-bold text-slate-900">{certificate.validationCode}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Validar Documento</p>
                <p className="text-[10px] text-slate-500 max-w-[150px]">Aponte a câmera para o QR Code para verificar a autenticidade deste certificado em nosso portal.</p>
              </div>
              <div className="p-2 bg-white border border-slate-200 rounded-xl">
                <QrCode size={80} className="text-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-50 rounded-tl-full translate-x-32 translate-y-32 border-l border-t border-slate-200 opacity-50"></div>
      </div>

      <div className="flex justify-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors">
          <Printer size={20} />
          Imprimir Certificado
        </button>
      </div>
    </div>
  );
}
