// Arquivo: src/hooks/usePagSeguroScript.ts (VERSÃO FINAL PARA O TESTE)

// Bloco para corrigir o aviso do ESLint
declare global {
  interface Window {
    PagSeguroDirectPayment?: object;
  }
}

import { useState, useEffect } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

// ATENÇÃO: Esta é a URL de PRODUÇÃO que estamos usando para o teste de diagnóstico.
const SCRIPT_URL = 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';

const usePagSeguroScript = (): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>('idle');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      // Correção do TypeScript: removido o "(window as any)"
      if (window.PagSeguroDirectPayment) {
        setStatus('ready');
      }
      return;
    }

    setStatus('loading');
    
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;

    const onReady = () => setStatus('ready');
    const onError = () => setStatus('error');

    script.addEventListener('load', onReady);
    script.addEventListener('error', onError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onReady);
      script.removeEventListener('error', onError);
    };
  }, []);

  return status;
};

export default usePagSeguroScript;