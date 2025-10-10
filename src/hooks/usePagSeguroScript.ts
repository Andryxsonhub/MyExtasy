// Declaração para informar ao TypeScript sobre o objeto global do PagBank
declare global {
  interface Window {
    PagSeguroDirectPayment?: any;
  }
}

import { useState, useEffect } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

// Esta é a URL correta e funcional para o nosso código
const SCRIPT_URL = 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';

const usePagSeguroScript = (): ScriptStatus => {
  const [status, setStatus] = useState<ScriptStatus>('idle');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
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