// src/pages/Planos.tsx

import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

// Dados dos planos
const plans = [
  {
    name: 'Semanal',
    price: '8,90',
    billing: '/semana',
    features: [
      'Ver perfis completos',
      'Enviar 3 mensagens por dia',
      'Acesso a galerias públicas',
      'Suporte via e-mail',
    ],
    isRecommended: false,
  },
  {
    name: 'Mensal',
    price: '28,90',
    billing: '/mês',
    features: [
      'Todos os benefícios do Bronze',
      'Mensagens ilimitadas',
      'Selo de membro Vip',
      'Ver quem visitou seu perfil',
      'Participar de lives exclusivas',
    ],
    isRecommended: false,
  },
  {
    name: 'Anual',
    price: '298,90',
    billing: '/ano',
    features: [
      'Todos os benefícios do Prata',
      'Destaque nas buscas',
      'Selo de membro Premium',
      'Acesso antecipado a eventos',
      'Suporte prioritário 24/7',
    ],
    isRecommended: true,
  },
];

const Planos = () => {
  return (
    <Layout>
      <div className="bg-background text-white min-h-screen">
        <div className="container mx-auto px-4 py-10">
          {/* Título e Subtítulo */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Escolha o plano ideal para você
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tenha acesso ilimitado à nossa comunidade e a benefícios exclusivos para apimentar suas experiências.
            </p>
          </div>

          {/* Grid de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative border-2 rounded-lg p-8 flex flex-col text-center transition-transform duration-300 hover:scale-105 ${
                  plan.isRecommended ? 'border-pink-500 bg-zinc-900' : 'border-gray-700'
                }`}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Recomendado
                  </div>
                )}
                
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                
                <p className="text-4xl font-bold mb-2">
                  R$ {plan.price}
                  <span className="text-lg font-normal text-gray-400">{plan.billing}</span>
                </p>
                
                <ul className="text-left my-8 space-y-3 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-pink-500 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/cadastrar">
                  <button
                    className={`w-full font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                      plan.isRecommended
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    Escolher Plano
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Planos;
