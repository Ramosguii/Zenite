import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, TrendingUp, DollarSign, Activity } from 'lucide-react';

const data = [
  { name: '00h', spend: 400, rev: 600 },
  { name: '04h', spend: 300, rev: 750 },
  { name: '08h', spend: 1200, rev: 1800 },
  { name: '12h', spend: 2400, rev: 3800 },
  { name: '16h', spend: 3100, rev: 5200 },
  { name: '20h', spend: 4500, rev: 7400 },
  { name: '23h', spend: 5200, rev: 8900 },
];

const MetricCard: React.FC<{ title: string; value: string; sub: string; icon: React.ElementType }> = ({ title, value, sub, icon: Icon }) => (
  <div className="bg-[#121212] border border-[#1F1F1F] p-6 rounded-xl hover:border-[#A1E432]/30 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[#8A8A8A] text-xs uppercase tracking-wider font-semibold">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-[#1A2414] rounded-lg">
        <Icon className="w-5 h-5 text-[#A1E432]" />
      </div>
    </div>
    <div className="flex items-center gap-1 text-xs">
      <span className="text-[#A1E432] font-semibold flex items-center">
        <ArrowUpRight className="w-3 h-3" /> {sub}
      </span>
      <span className="text-[#8A8A8A]">vs. ontem</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Visão Geral</h2>
          <p className="text-[#8A8A8A]">Monitoramento em tempo real de suas campanhas</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-[#1A2414] border border-[#A1E432]/30 rounded text-[#A1E432] text-xs font-mono">
             STATUS: ONLINE
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gasto Hoje" value="R$ 15.240,00" sub="+12%" icon={Activity} />
        <MetricCard title="Receita Aprovada" value="R$ 32.180,00" sub="+24%" icon={DollarSign} />
        <MetricCard title="ROI Total" value="2.11" sub="+5%" icon={TrendingUp} />
        <MetricCard title="CPA Médio" value="R$ 42,50" sub="-8%" icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 bg-[#121212] border border-[#1F1F1F] p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-6">Curva de Escala (Hourly)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A1E432" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#A1E432" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
              <XAxis dataKey="name" stroke="#8A8A8A" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8A8A8A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `k${value/1000}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#1F1F1F', color: '#fff' }}
                itemStyle={{ color: '#A1E432' }}
              />
              <Area type="monotone" dataKey="rev" stroke="#A1E432" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="spend" stroke="#8A8A8A" strokeWidth={2} fillOpacity={0.1} fill="#8A8A8A" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#121212] border border-[#1F1F1F] p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-6">Criativos Ativos</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#080808] rounded border border-[#1F1F1F]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1F1F1F] rounded flex items-center justify-center text-[#8A8A8A] text-xs">
                    V{i}
                  </div>
                  <div>
                    <p className="text-sm text-white">UGC_Test_{i}</p>
                    <p className="text-xs text-[#8A8A8A]">CTR: {(1.5 + Math.random()).toFixed(2)}%</p>
                  </div>
                </div>
                <span className="text-[#A1E432] text-xs font-bold">R$ {(Math.random() * 50).toFixed(2)}</span>
              </div>
            ))}
             <button className="w-full mt-2 py-2 text-xs text-[#A1E432] border border-[#A1E432]/30 rounded hover:bg-[#A1E432]/10">
               Ver todos os anúncios
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
