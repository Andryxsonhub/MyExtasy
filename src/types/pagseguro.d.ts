// src/types/pagseguro.d.ts

// Mantém o arquivo como módulo (evita conflito com outros .d.ts)
export {};

declare global {
  interface Window {
    PagSeguro?: {
      encryptCard: (params: {
        publicKey: string;
        holder: string;
        number: string;
        expMonth: string;
        expYear: string;
        securityCode: string;
      }) => {
        hasErrors: boolean;
        errors?: Array<{ code: string }>;
        encryptedCard?: string;
      };
    };
  }
}
