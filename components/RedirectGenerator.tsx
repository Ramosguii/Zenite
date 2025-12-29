import React, { useState } from 'react';
import { Link, Lock, Copy, Eye, Globe, Shield, Activity, Zap, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';

export const RedirectGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [safePage, setSafePage] = useState('');
  const [pixel, setPixel] = useState('');
  const [utmifyId, setUtmifyId] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [previewMode, setPreviewMode] = useState<'money' | 'safe'>('money');
  const [iframeKey, setIframeKey] = useState(0);

  const handleGenerate = () => {
    if (!url || !safePage) return;
    const hash = Math.random().toString(36).substring(7);
    setGeneratedLink(`https://z.ynt.link/${hash}?u=${utmifyId || 'default'}`);
  };

  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
  };

  const currentPreviewUrl = previewMode === 'money' ? url : safePage;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          Zynt <span className="text-[#A1E432]">Cloaker & Redirect</span>
        </h2>
        <p className="text-[#8A8A8A]">
          Sistema de camuflagem de links com prévia em tempo real e filtro de bots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: CONFIGURAÇÕES (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Destinos */}
          <div className="bg-[#121212] border border-[#1F1F1F] rounded-xl p-6 space-y-6 relative overflow-hidden">
            <h3 className="text-white font-bold flex items-center gap-2 border-b border-[#1F1F1F] pb-4">
              <Link className="w-5 h-5 text-[#A1E432]" /> Configuração de Destino
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A1E432] shadow-[0_0_5px_#A1E432]"></span>
                  Money Page (Oferta Principal)
                </label>
                <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://seucheckout.com/oferta-black"
                      className="w-full bg-[#080808] border border-[#1F1F1F] text-white pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:border-[#A1E432] placeholder-[#444] text-sm"
                    />
                    <Globe className="absolute right-3 top-3 w-4 h-4 text-[#444]" />
                </div>
                <p className="text-[10px] text-[#8A8A8A]">Destino dos compradores reais (Humanos).</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#8A8A8A]" />
                  Safe Page (Página White)
                </label>
                <div className="relative">
                    <input
                      type="url"
                      value={safePage}
                      onChange={(e) => setSafePage(e.target.value)}
                      placeholder="https://seusite.com/artigo-seguro"
                      className="w-full bg-[#080808] border border-[#1F1F1F] text-white pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:border-[#A1E432] placeholder-[#444] text-sm"
                    />
                    <Lock className="absolute right-3 top-3 w-4 h-4 text-[#444]" />
                </div>
                <p className="text-[10px] text-[#8A8A8A]">Destino para bots e análise do TikTok.</p>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-[#121212] border border-[#1F1F1F] rounded-xl p-6 space-y-6 relative overflow-hidden">
            <h3 className="text-white font-bold flex items-center gap-2 border-b border-[#1F1F1F] pb-4">
              <Eye className="w-5 h-5 text-[#A1E432]" /> Inteligência de Tracking
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Pixel ID (TikTok)</label>
                <input
                  type="text"
                  value={pixel}
                  onChange={(e) => setPixel(e.target.value)}
                  placeholder="Ex: C892J1K9..."
                  className="w-full bg-[#080808] border border-[#1F1F1F] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#A1E432] placeholder-[#444] text-sm font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  Integração UTMify
                </label>
                <input
                  type="text"
                  value={utmifyId}
                  onChange={(e) => setUtmifyId(e.target.value)}
                  placeholder="Ex: 64f8a..."
                  className="w-full bg-[#080808] border border-[#1F1F1F] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#F59E0B] placeholder-[#444] text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <button
            onClick={handleGenerate}
            disabled={!url || !safePage}
            className="w-full bg-[#A1E432] text-black font-bold py-4 rounded-lg hover:bg-[#8ec92a] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(161,228,50,0.2)]"
          >
            <Lock className="w-5 h-5" />
            Gerar Link Blindado Zynt
          </button>

          {/* Resultado */}
          {generatedLink && (
            <div className="bg-[#1A2414] border border-[#A1E432]/30 rounded-xl p-6 flex items-center justify-between animate-fade-in shadow-lg">
              <div>
                <p className="text-[#A1E432] text-xs font-bold uppercase mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A1E432] animate-pulse"></span>
                  Link Ativo & Protegido
                </p>
                <p className="text-white font-mono text-sm md:text-base">{generatedLink}</p>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                className="p-3 bg-[#121212] rounded-lg text-white hover:text-[#A1E432] border border-[#1F1F1F] transition-colors group"
              >
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: SIMULADOR MOBILE (Span 1) */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="bg-[#121212] border border-[#1F1F1F] rounded-xl p-4 w-full mb-4">
             <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
               <Smartphone className="w-4 h-4 text-[#A1E432]" /> Prévia do Dispositivo
             </h3>
             <div className="flex bg-[#080808] p-1 rounded-lg border border-[#1F1F1F]">
                <button 
                  onClick={() => setPreviewMode('money')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${previewMode === 'money' ? 'bg-[#A1E432] text-black' : 'text-[#8A8A8A] hover:text-white'}`}
                >
                  Money Page
                </button>
                <button 
                  onClick={() => setPreviewMode('safe')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${previewMode === 'safe' ? 'bg-[#1F1F1F] text-white border border-[#333]' : 'text-[#8A8A8A] hover:text-white'}`}
                >
                  Safe Page
                </button>
             </div>
             
             <div className="mt-3 flex items-start gap-2 p-2 bg-[#1A2414]/50 rounded text-[10px] text-[#8A8A8A]">
                <AlertCircle className="w-3 h-3 text-[#F59E0B] shrink-0 mt-0.5" />
                <p>Se a tela ficar branca, o site possui proteção contra iframe (X-Frame-Options). O link funcionará normalmente.</p>
             </div>
          </div>

          {/* Device Frame */}
          <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-[#1F1F1F] shadow-2xl overflow-hidden">
             {/* Notch */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1F1F1F] rounded-b-xl z-20"></div>
             
             {/* Screen Area */}
             <div className="w-full h-full bg-white relative">
                {currentPreviewUrl ? (
                   <iframe 
                     key={iframeKey}
                     src={currentPreviewUrl} 
                     title="Mobile Preview"
                     className="w-full h-full border-none"
                     sandbox="allow-scripts allow-same-origin"
                   />
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-[#0c0c0c] text-center p-6 space-y-4">
                      <Globe className="w-12 h-12 text-[#333]" />
                      <p className="text-[#444] text-xs">Insira uma URL para visualizar a prévia mobile.</p>
                   </div>
                )}

                {/* Refresh Overlay Button */}
                {currentPreviewUrl && (
                  <button 
                    onClick={refreshPreview}
                    className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all z-10"
                    title="Recarregar Preview"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
             </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-t border-[#1F1F1F] pt-6">
        <div className="p-4 bg-[#121212] border border-[#1F1F1F] rounded-lg">
          <p className="text-[#A1E432] font-bold text-lg">100%</p>
          <p className="text-xs text-[#8A8A8A]">Proteção User-Agent</p>
        </div>
        <div className="p-4 bg-[#121212] border border-[#1F1F1F] rounded-lg">
          <p className="text-[#A1E432] font-bold text-lg">Server-Side</p>
          <p className="text-xs text-[#8A8A8A]">Disparo de Pixel</p>
        </div>
        <div className="p-4 bg-[#121212] border border-[#1F1F1F] rounded-lg">
          <p className="text-[#F59E0B] font-bold text-lg">UTMify</p>
          <p className="text-xs text-[#8A8A8A]">Integração Nativa</p>
        </div>
      </div>
    </div>
  );
};
