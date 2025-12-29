import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, FileText, Upload, 
  Image as ImageIcon, Film, X, Ban, Calculator, Calendar as CalendarIcon, Beaker 
} from 'lucide-react';
import { 
  analyzeCreativeWithZynt, 
  analyzeRejectedPattern, 
  generateCreativeVariation, 
  MediaInput 
} from '../services/geminiService';
import { ZYNT_COLORS } from '../constants';

export const CreativeAnalyzer: React.FC = () => {
  const [script, setScript] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMode, setCurrentMode] = useState<'upload' | 'review' | 'metrics' | 'calendar'>('upload');
  
  // Metrics State
  const [metrics, setMetrics] = useState({ cpa: '', cpc: '', cpm: '', roi: '' });
  const [variationResult, setVariationResult] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Arquivo muito grande. Limite de 20MB.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getMediaInput = async (): Promise<MediaInput | undefined> => {
    if (!selectedFile) return undefined;
    const base64 = await convertFileToBase64(selectedFile);
    return { data: base64, mimeType: selectedFile.type };
  };

  // --- ACTIONS ---

  const runPreAnalysis = async () => {
    if (!script.trim() && !selectedFile) return;
    setIsAnalyzing(true);
    setCurrentMode('review');
    setAnalysisResult(null);
    setVariationResult(null);

    try {
      const media = await getMediaInput();
      const response = await analyzeCreativeWithZynt(script, media);
      setAnalysisResult(response);
    } catch (e) { console.error(e); } 
    finally { setIsAnalyzing(false); }
  };

  const handleReject = async () => {
    if (!selectedFile && !script) return;
    setIsAnalyzing(true);
    setCurrentMode('review');
    setAnalysisResult(null);
    setVariationResult(null);

    try {
      const media = await getMediaInput();
      const response = await analyzeRejectedPattern(media, script);
      setAnalysisResult(`🔴 **PADRÃO DE REJEIÇÃO DETECTADO**\n\n${response}`);
    } catch (e) { console.error(e); } 
    finally { setIsAnalyzing(false); }
  };

  const handleApproveAndGenerate = async () => {
    setIsAnalyzing(true);
    setVariationResult(null);
    
    const roi = parseFloat(metrics.roi);
    const isWinner = !isNaN(roi) && roi > 2;
    const metricsStr = `CPA: ${metrics.cpa}, CPC: ${metrics.cpc}, CPM: ${metrics.cpm}, ROI: ${metrics.roi}`;

    try {
      const media = await getMediaInput();
      let response = `🟢 **CRIATIVO APROVADO**\n\nMétricas registradas. ${isWinner ? "Este é um criativo WINNER!" : "Monitorando performance."}`;
      
      if (isWinner) {
        const variation = await generateCreativeVariation(media, metricsStr);
        setVariationResult(variation);
      } else {
        setVariationResult("ROI abaixo de 2.0. Continue otimizando antes de escalar variações.");
      }
      setAnalysisResult(response);
    } catch (e) { console.error(e); } 
    finally { setIsAnalyzing(false); }
  };

  const isVideo = selectedFile?.type.startsWith('video/');

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center border-b border-[#1F1F1F] pb-4">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Beaker className="text-[#A1E432]" /> Zynt Creative Lab
           </h2>
           <p className="text-[#8A8A8A] text-sm">O laboratório de testes e escala da Zynt IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
        
        {/* LEFT COLUMN: UPLOAD & INPUT */}
        <div className="lg:col-span-5 flex flex-col space-y-4 overflow-y-auto">
          {/* Upload Card */}
          <div 
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-6 transition-all bg-[#080808]
              ${selectedFile ? 'border-[#A1E432] bg-[#A1E432]/5' : 'border-[#A1E432] hover:bg-[#121212] cursor-pointer'}
            `}
          >
             {!selectedFile ? (
               <div className="flex flex-col items-center justify-center py-8">
                 <Upload className="w-10 h-10 text-[#A1E432] mb-3" />
                 <p className="text-white font-bold">Arraste ou clique para enviar</p>
                 <p className="text-xs text-[#8A8A8A] mt-1">MP4, PNG, JPG (Máx 20MB)</p>
               </div>
             ) : (
               <div className="flex flex-col items-center">
                 <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                  className="absolute top-2 right-2 p-1 bg-black/80 text-white rounded-full hover:bg-[#FF0050] transition-colors z-10"
                 >
                   <X className="w-4 h-4" />
                 </button>
                 <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#1F1F1F] mb-3 flex items-center justify-center">
                    {isVideo ? (
                      <video src={previewUrl!} controls className="max-h-[180px]" />
                    ) : (
                      <img src={previewUrl!} alt="Preview" className="max-h-[180px] object-contain" />
                    )}
                 </div>
                 <div className="flex items-center gap-2 text-[#A1E432] text-xs font-mono">
                    {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {selectedFile.name}
                 </div>
               </div>
             )}
             <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />
          </div>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Contexto adicional (Script, Copy, ou motivo da rejeição)..."
            className="w-full bg-[#121212] border border-[#1F1F1F] text-white p-4 rounded-xl resize-none focus:outline-none focus:border-[#A1E432] text-sm h-32"
          />

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3">
             <button
               onClick={runPreAnalysis}
               disabled={isAnalyzing || (!script && !selectedFile)}
               className="col-span-2 bg-[#121212] border border-[#1F1F1F] text-white hover:border-[#A1E432] py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
             >
               <ShieldAlert className="w-4 h-4 text-[#A1E432]" />
               Pré-Análise (Compliance)
             </button>

             <button
               onClick={handleReject}
               disabled={isAnalyzing || (!script && !selectedFile)}
               className="bg-[#121212] border border-[#FF0050]/30 text-[#FF0050] hover:bg-[#FF0050]/10 py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
             >
               <Ban className="w-4 h-4" />
               Rejeitado
             </button>

             <button
                onClick={() => setCurrentMode('metrics')}
                disabled={isAnalyzing || (!script && !selectedFile)}
                className="bg-[#1A2414] border border-[#A1E432]/30 text-[#A1E432] hover:bg-[#A1E432]/10 py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
             >
               <CheckCircle2 className="w-4 h-4" />
               Aprovado
             </button>
             
             <button
               onClick={() => setCurrentMode('calendar')}
               className="col-span-2 bg-[#121212] border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/10 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
             >
               <CalendarIcon className="w-4 h-4" />
               Agendar no Calendar
             </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS & TOOLS */}
        <div className="lg:col-span-7 bg-[#121212] border border-[#1F1F1F] rounded-xl p-6 overflow-y-auto relative min-h-[500px]">
          
          {/* Mode: Review/Analysis Results */}
          {(currentMode === 'review' || currentMode === 'upload') && (
            <>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 Relatório Zynt Lab
              </h3>
              
              {!analysisResult && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full text-[#333]">
                   <Beaker className="w-16 h-16 mb-4 opacity-10" />
                   <p className="text-sm">Selecione uma ação para iniciar o laboratório.</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-12 h-12 border-4 border-[#A1E432] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#A1E432] font-mono animate-pulse">Processando dados visuais...</p>
                </div>
              )}

              {analysisResult && (
                <div className="animate-fade-in space-y-4">
                  <div className="bg-[#080808] p-6 rounded-lg border border-[#1F1F1F] whitespace-pre-wrap text-sm text-[#E0E0E0] leading-relaxed">
                    {analysisResult}
                  </div>
                  {variationResult && (
                    <div className="bg-[#1A2414] p-6 rounded-lg border border-[#A1E432]/50 whitespace-pre-wrap text-sm text-white leading-relaxed">
                      <h4 className="text-[#A1E432] font-bold mb-2 flex items-center gap-2">
                         <Calculator className="w-4 h-4" /> VARIAÇÃO SUGERIDA (WINNER)
                      </h4>
                      {variationResult}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Mode: Metrics Input */}
          {currentMode === 'metrics' && (
             <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-[#A1E432]">Consolidação de Métricas</h3>
                   <button onClick={() => setCurrentMode('review')} className="text-xs text-[#8A8A8A] hover:text-white">Cancelar</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs text-[#8A8A8A]">CPA (R$)</label>
                      <input 
                        type="number" 
                        value={metrics.cpa}
                        onChange={e => setMetrics({...metrics, cpa: e.target.value})}
                        className="w-full bg-[#080808] border border-[#1F1F1F] text-white p-3 rounded focus:border-[#A1E432] outline-none"
                        placeholder="0.00"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-[#8A8A8A]">ROI (ROAS)</label>
                      <input 
                        type="number" 
                        value={metrics.roi}
                        onChange={e => setMetrics({...metrics, roi: e.target.value})}
                        className="w-full bg-[#080808] border border-[#1F1F1F] text-white p-3 rounded focus:border-[#A1E432] outline-none"
                        placeholder="Ex: 2.5"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-[#8A8A8A]">CPC (R$)</label>
                      <input 
                        type="number" 
                        value={metrics.cpc}
                        onChange={e => setMetrics({...metrics, cpc: e.target.value})}
                        className="w-full bg-[#080808] border border-[#1F1F1F] text-white p-3 rounded focus:border-[#A1E432] outline-none"
                        placeholder="0.00"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-[#8A8A8A]">CPM (R$)</label>
                      <input 
                        type="number" 
                        value={metrics.cpm}
                        onChange={e => setMetrics({...metrics, cpm: e.target.value})}
                        className="w-full bg-[#080808] border border-[#1F1F1F] text-white p-3 rounded focus:border-[#A1E432] outline-none"
                        placeholder="0.00"
                      />
                   </div>
                </div>
                
                <button
                  onClick={() => { setCurrentMode('review'); handleApproveAndGenerate(); }}
                  className="w-full bg-[#A1E432] text-black font-bold py-3 rounded-lg hover:bg-[#8ec92a] transition-all flex items-center justify-center gap-2"
                >
                  Confirmar Performance & Gerar Variação
                </button>
             </div>
          )}

          {/* Mode: Calendar */}
          {currentMode === 'calendar' && (
            <div className="animate-fade-in flex flex-col h-full">
              <div className="bg-[#1A2414] border border-[#A1E432]/20 p-4 rounded-lg mb-6">
                <p className="text-[#A1E432] text-center font-medium italic">
                  "Não esqueça que testar o seu criativo pode ser um desses que pode mudar seu GAME para sempre."
                </p>
              </div>

              <div className="flex-1 grid grid-cols-7 gap-2">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
                  <div key={day} className="text-center text-xs text-[#8A8A8A] py-2">{day}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`
                      aspect-square border border-[#1F1F1F] rounded bg-[#080808] hover:bg-[#121212] 
                      flex flex-col p-2 cursor-pointer transition-colors relative
                      ${i === 14 ? 'border-[#F59E0B]/50' : ''}
                    `}
                  >
                     <span className="text-xs text-[#444]">{i + 1}</span>
                     {i === 14 && (
                       <div className="mt-1 w-full bg-[#F59E0B] h-1.5 rounded-full"></div>
                     )}
                  </div>
                ))}
              </div>
              
              <button onClick={() => setCurrentMode('upload')} className="mt-4 text-sm text-[#8A8A8A] hover:text-white underline text-center">
                Voltar ao Lab
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};