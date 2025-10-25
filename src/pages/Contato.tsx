// src/pages/Contato.tsx
// --- VERSÃO ATUALIZADA (com emails adicionados) ---

import React from 'react';
import Layout from '@/components/Layout';

const Contato = () => {
  return (
    <Layout>
      <div className="bg-background text-foreground min-h-screen"> {/* Adiciona background e cor padrão */}
        <div className="container mx-auto px-4 py-16 pt-24 text-center"> {/* Aumentado padding-top */}
          <h1 className="text-4xl font-extrabold text-white mb-4">Fale Conosco</h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"> {/* Adicionado mb e max-width */}
            Tem alguma dúvida, sugestão ou precisa de ajuda? Entre em contato conosco através dos e-mails abaixo. Teremos prazer em ajudar!
          </p>

          {/* Seção de Emails */}
          <div className="mt-10 space-y-4 text-lg">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Diretoria</h2>
              <a
                href="mailto:diretoria.vj@myextasyclub.com"
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                diretoria.vj@myextasyclub.com
              </a>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Suporte Técnico</h2>
              <a
                href="mailto:suporte@myextasyclub.com"
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                suporte@myextasyclub.com
              </a>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Financeiro</h2>
              {/* Corrigido .bom para .com - se for .bom mesmo, avise para corrigir */}
              <a
                href="mailto:financeiro.fp@myextasyclub.com"
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                financeiro.fp@myextasyclub.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Contato;