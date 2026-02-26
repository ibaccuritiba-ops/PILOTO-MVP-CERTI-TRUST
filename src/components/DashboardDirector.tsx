import React from 'react';
import { 
  Users, 
  Award, 
  FileCheck, 
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: 'Jan', certificados: 40, avaliacoes: 24 },
  { name: 'Fev', certificados: 30, avaliacoes: 13 },
  { name: 'Mar', certificados: 20, avaliacoes: 98 },
  { name: 'Abr', certificados: 27, avaliacoes: 39 },
  { name: 'Mai', certificados: 18, avaliacoes: 48 },
  { name: 'Jun', certificados: 23, avaliacoes: 38 },
];

export default function DashboardDirector() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Institucional</h1>
        <p className="text-slate-500">Visão geral da conformidade e certificações da instituição.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Alunos" 
          value="1,284" 
          change="+12%" 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Certificados Emitidos" 
          value="856" 
          change="+5.4%" 
          icon={Award} 
          color="emerald" 
        />
        <StatCard 
          title="Avaliações Realizadas" 
          value="3,420" 
          change="+18%" 
          icon={FileCheck} 
          color="indigo" 
        />
        <StatCard 
          title="Alertas de Conformidade" 
          value="12" 
          change="-2" 
          icon={AlertTriangle} 
          color="amber" 
          isWarning
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Crescimento de Certificações</h3>
            <select className="text-xs border-slate-200 rounded-lg bg-slate-50 px-2 py-1">
              <option value="6">Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="certificados" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Atividade de Avaliações</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12}/> Tempo Real</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="avaliacoes" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Relatórios de Não Conformidade Recentes</h3>
          <button className="text-sm text-indigo-600 font-medium hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Aluno</th>
                <th className="px-6 py-4 font-semibold">Curso</th>
                <th className="px-6 py-4 font-semibold">Tipo de Alerta</th>
                <th className="px-6 py-4 font-semibold">Data/Hora</th>
                <th className="px-6 py-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Marcos Oliveira', course: 'Compliance Financeiro', type: 'Troca de Aba Detectada', date: 'Hoje, 14:20', severity: 'medium' },
                { name: 'Ana Paula Santos', course: 'Segurança ISO 27001', type: 'Falha na Biometria', date: 'Hoje, 11:05', severity: 'high' },
                { name: 'Julio Cesar', course: 'LGPD Avançado', type: 'Tentativa de Evasão', date: 'Ontem, 16:45', severity: 'high' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{row.course}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <TrendingUp size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color, isWarning = false }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
          isWarning ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {change}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
