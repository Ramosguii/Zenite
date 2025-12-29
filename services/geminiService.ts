import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

let aiInstance: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const initChat = (): Chat => {
  const ai = getAI();
  // Using gemini-3-flash-preview for fast, responsive text interactions
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToZynt = async (message: string): Promise<string> => {
  if (!chatSession) {
    initChat();
  }
  
  try {
    const response = await chatSession!.sendMessage({ message });
    return response.text || "Erro ao processar resposta da Zynt IA.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Conexão instável com o servidor Zynt. Verifique sua API Key ou tente novamente.";
  }
};

export interface MediaInput {
  data: string;
  mimeType: string;
}

export const analyzeCreativeWithZynt = async (textInput: string, mediaFile?: MediaInput): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview'; 
  
  const parts: any[] = [];

  if (mediaFile) {
    parts.push({
      inlineData: {
        data: mediaFile.data,
        mimeType: mediaFile.mimeType
      }
    });
  }

  parts.push({
    text: `Analise este criativo (texto, imagem ou vídeo) com base no framework Zynt de TikTok Ads.
    
    Contexto adicional/Script: ${textInput}
    
    Retorne APENAS o framework preenchido:
    Veredito de Risco: (Baixo | Médio | Alto | Fatal)
    Análise do Hook: (Analise o impacto visual se houver imagem/vídeo, ou o texto)
    Pontos de Fricção: (Elementos visuais ou textuais que geram ban)
    Sugestão Zynt:`
  });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_PROMPT
      }
    });
    return response.text || "Não foi possível analisar o criativo.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Erro ao analisar criativo. Verifique o formato do arquivo ou tente novamente.";
  }
};

export const analyzeRejectedPattern = async (mediaFile?: MediaInput, reason?: string): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const parts: any[] = [];
  if (mediaFile) {
    parts.push({
      inlineData: {
        data: mediaFile.data,
        mimeType: mediaFile.mimeType
      }
    });
  }
  
  parts.push({
    text: `ESTE CRIATIVO FOI REJEITADO/BANIDO NO TIKTOK ADS.
    Motivo (se houver): ${reason || "Desconhecido"}
    
    Execute a Análise de Padrão Negativo (Pattern Recognition):
    1. Identifique o Fingerprint visual/textual que causou o ban.
    2. Explique qual regra da Ad Policy foi violada (ex: promessa, nudez, money claims).
    3. Armazene mentalmente este padrão para alertas futuros.
    
    Retorne uma análise técnica e curta.`
  });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: { systemInstruction: SYSTEM_PROMPT }
    });
    return response.text || "Erro na análise de padrão.";
  } catch (error) {
    console.error("Rejection Analysis Error:", error);
    return "Não foi possível processar a rejeição.";
  }
};

export const generateCreativeVariation = async (mediaFile: MediaInput | undefined, metrics: string): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const parts: any[] = [];
  if (mediaFile) {
    parts.push({
      inlineData: {
        data: mediaFile.data,
        mimeType: mediaFile.mimeType
      }
    });
  }

  parts.push({
    text: `Este criativo é um WINNER (Vencedor).
    Métricas de Sucesso: ${metrics}
    
    Desconstrua o sucesso dele e gere um ROTEIRO DE VARIAÇÃO de 15 segundos.
    - Mantenha o Hook (que funcionou).
    - Altere apenas o Corpo ou CTA para teste A/B.
    - Foco em escala horizontal.
    `
  });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: { systemInstruction: SYSTEM_PROMPT }
    });
    return response.text || "Erro ao gerar variação.";
  } catch (error) {
    console.error("Variation Generation Error:", error);
    return "Não foi possível gerar variações.";
  }
};
