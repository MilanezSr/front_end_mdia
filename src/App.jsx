import React, { useState, useEffect, useReducer } from 'react';
import { motion } from 'framer-motion';
import './App.css';  // Se precisar de algum estilo extra
import OpeningAnimation from './components/OpeningAnimation'; // Sua animação inicial

const initialState = {
  dadosContrato: {
    tipo_contratante: '',
    contratante_nome: '',
    contratante_cnpj: '',
    contratante_endereco: '',
    contratada_nome: 'MYLENA SIMOES',
    contratada_cnpj: '30.328.562/0001-20',
    contratada_endereco: 'Avenida São Bento, 140, Guarulhos - SP',
    descricao_servico: '',
    servico_detalhado: '',
    entregas_detalhadas: '',
    equipe_detalhada: '',
    captacao_detalhada: '',
    valor_servico: '',
    tem_gastos_extras: false,
    gastos_detalhados: '',
    valor_total: '',
    data_contrato: '',
    nome_testemunha_contratante: '',
    rg_testemunha_contratante: '',
    nome_testemunha_contratada: 'MYLENA SIMOES',
    rg_testemunha_contratada: '',
  },
  etapaAtual: 0,
  mensagens: [],
  resposta: '',
  pdfUrl: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_DADOS':
      return { ...state, dadosContrato: { ...state.dadosContrato, ...action.payload } };
    case 'SET_ETAPA':
      return { ...state, etapaAtual: action.payload };
    case 'ADD_MENSAGEM':
      return { ...state, mensagens: [...state.mensagens, action.payload] };
    case 'SET_RESPOSTA':
      return { ...state, resposta: action.payload };
    case 'SET_PDF_URL':
      return { ...state, pdfUrl: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { etapaAtual, mensagens, resposta, pdfUrl, dadosContrato } = state;

  const etapas = [
    { campo: 'tipo_contratante', pergunta: 'A contratante é pessoa física ou jurídica?' },
    { campo: 'contratante_nome', pergunta: 'Qual o nome da contratante?' },
    { campo: 'contratante_cnpj', pergunta: 'Qual o CNPJ ou CPF da contratante?' },
    { campo: 'contratante_endereco', pergunta: 'Qual o endereço da contratante?' },
    { campo: 'descricao_servico', pergunta: 'Descreva brevemente o serviço contratado.' },
    { campo: 'servico_detalhado', pergunta: 'Detalhe o serviço que será realizado.' },
    { campo: 'entregas_detalhadas', pergunta: 'Quais as entregas previstas?' },
    { campo: 'equipe_detalhada', pergunta: 'Qual será a equipe envolvida com você?' },
    { campo: 'captacao_detalhada', pergunta: 'Detalhes sobre a captação (ex: interna, áudio, iluminação).' },
    { campo: 'valor_servico', pergunta: 'Qual o valor do serviço?' },
    { campo: 'tem_gastos_extras', pergunta: 'Existem gastos extras (como estacionamento)? (sim/não)' },
    { campo: 'gastos_detalhados', pergunta: 'Descreva os gastos extras.' },
    { campo: 'valor_total', pergunta: 'Qual o valor total (serviço + extras)?' },
    { campo: 'data_contrato', pergunta: 'Informe data e local do contrato.' },
    { campo: 'nome_testemunha_contratante', pergunta: 'Nome da testemunha da contratante:' },
    { campo: 'rg_testemunha_contratante', pergunta: 'RG da testemunha da contratante:' },
    { campo: 'rg_testemunha_contratada', pergunta: 'RG da sua testemunha:' },
  ];

  const enviarResposta = () => {
    const etapa = etapas[etapaAtual];
    const valor = resposta.trim();
    if (!valor) return;

    dispatch({ type: 'UPDATE_DADOS', payload: { [etapa.campo]: valor } });
    dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
    dispatch({ type: 'SET_RESPOSTA', payload: '' });

    if (etapaAtual === etapas.length - 1) {
      // Logic to handle PDF generation goes here
    } else {
      dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 1 });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[etapaAtual + 1].pergunta } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-8">
      <OpeningAnimation />
      <div className="chat-container w-full max-w-lg bg-gray-800 rounded-xl p-4 space-y-4 shadow-lg">
        <h1 className="text-pink-500 text-3xl font-bold text-center mb-6">Mydia AI - Contrato</h1>

        <div className="messages-container space-y-4">
          {mensagens.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.autor === 'mydia' ? 'justify-start' : 'justify-end'}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  msg.autor === 'mydia' ? 'bg-gray-700 text-pink-400' : 'bg-pink-600 text-white'
                }`}
              >
                {msg.texto}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="input-container flex gap-2 mt-4">
          <input
            type="text"
            className="flex-1 bg-gray-800 p-2 rounded text-white border border-pink-500 focus:outline-none"
            value={resposta}
            onChange={(e) => dispatch({ type: 'SET_RESPOSTA', payload: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && enviarResposta()}
            placeholder="Digite sua resposta..."
          />
          <button
            onClick={enviarResposta}
            className="bg-pink-600 px-4 rounded text-white hover:bg-pink-700 transition"
          >
            Enviar
          </button>
        </div>

        {pdfUrl && (
          <div className="text-center mt-6">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 px-6 py-3 rounded-full text-white hover:bg-pink-700 transition"
            >
              📄 Baixar Contrato PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
