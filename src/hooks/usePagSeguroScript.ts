import { useEffect, useState } from 'react';

type Status = 'idle' | 'loading' | 'ready' | 'error';

export default function usePagSeguroScript(): Status {
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    // Já carregado?
    if (window.PagSeguro && typeof window.PagSeguro.encryptCard === 'function') {
      setStatus('ready');
      return;
    }

    setStatus('loading');

    // Evita duplicar o <script>
    const existing = document.querySelector<HTMLScriptElement>('script[data-pagbank-encryption="true"]');
    const src =
      'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js';

    // Linhas antigas comentadas para referência
    // (import.meta as any).env?.VITE_PAGBANK_JS_URL ||
    // 'https://assets.pagseguro.com.br/checkout-sdk/encryption.js';

    const onLoad = () => {
      if (window.PagSeguro && typeof window.PagSeguro.encryptCard === 'function') {
        setStatus('ready');
      } else {
        setStatus('error');
      }
    };

    const onError = () => setStatus('error');

    if (existing) {
      existing.addEventListener('load', onLoad);
      existing.addEventListener('error', onError);
    } else {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.defer = true;
      //s.crossOrigin = 'anonymous';
      s.dataset.pagbankEncryption = 'true';
      s.addEventListener('load', onLoad);
      s.addEventListener('error', onError);
      document.head.appendChild(s);
    }

    // “seguro” contra ficar preso no loading
    const t = window.setTimeout(() => {
      if (window.PagSeguro && typeof window.PagSeguro.encryptCard === 'function') {
        setStatus('ready');
      } else if (status === 'loading') {
        setStatus('error');
      }
    }, 8000);

    return () => window.clearTimeout(t);
  }, []);

  return status;
}
