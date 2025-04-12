import React, { useState, useEffect, useReducer } from 'react';
import { motion } from 'framer-motion';
import './App.css'; // Se precisar de algum estilo extra
import OpeningAnimation from './components/OpeningAnimation'; // Sua animação inicial
import jsPDF from 'jspdf'; // Importando a biblioteca jsPDF para gerar o PDF

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
  contratoConfirmado: false,
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
    case 'CANCELAR_CONTRATO':
      return { ...state, contratoConfirmado: false, mensagens: [...state.mensagens, { autor: 'mydia', texto: 'Que pena, My... gostaria de te ajudar!' }] };
    case 'CONFIRMAR_CONTRATO':
      return { ...state, contratoConfirmado: true };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { etapaAtual, mensagens, resposta, pdfUrl, dadosContrato, contratoConfirmado } = state;

  const etapas = [
    { campo: 'tipo_contratante', pergunta: '👥 A contratante é pessoa física ou jurídica?' },
    { campo: 'contratante_nome', pergunta: '📝 Qual o nome da contratante?' },
    { campo: 'contratante_cnpj', pergunta: '🏢 Qual o CNPJ ou CPF da contratante?' },
    { campo: 'contratante_endereco', pergunta: '📍 Qual o endereço da contratante?' },
    { campo: 'descricao_servico', pergunta: '🔧 Descreva brevemente o serviço contratado.' },
    { campo: 'servico_detalhado', pergunta: '⚙️ Detalhe o serviço que será realizado.' },
    { campo: 'entregas_detalhadas', pergunta: '📦 Quais as entregas previstas?' },
    { campo: 'equipe_detalhada', pergunta: '👨‍💻 Qual será a equipe envolvida com você?' },
    { campo: 'captacao_detalhada', pergunta: '🎥 Detalhes sobre a captação (ex: interna, áudio, iluminação).' },
    { campo: 'valor_servico', pergunta: '💰 Qual o valor do serviço?' },
    { campo: 'tem_gastos_extras', pergunta: '💡 Existem gastos extras (como estacionamento)? (sim/não)' },
    { campo: 'gastos_detalhados', pergunta: '💵 Descreva os gastos extras.' },
    { campo: 'valor_total', pergunta: '💸 Qual o valor total (serviço + extras)?' },
    { campo: 'data_contrato', pergunta: '📅 Informe data e local do contrato.' },
    { campo: 'nome_testemunha_contratante', pergunta: '👥 Nome da testemunha da contratante:' },
    { campo: 'rg_testemunha_contratante', pergunta: '🆔 RG da testemunha da contratante:' },
    { campo: 'rg_testemunha_contratada', pergunta: '🆔 RG da sua testemunha:' },
  ];

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");

    doc.text(`Contrato de Prestação de Serviços`, 20, 20);
    doc.text(`-------------------------------------------------`, 20, 30);
    
    doc.text(`Contrato firmado entre ${dadosContrato.contratante_nome} (contratante) e ${dadosContrato.contratada_nome} (contratada)`, 20, 40);
    doc.text(`CNPJ/CPF: ${dadosContrato.contratante_cnpj} / ${dadosContrato.contratada_cnpj}`, 20, 50);
    doc.text(`Endereço: ${dadosContrato.contratante_endereco} / ${dadosContrato.contratada_endereco}`, 20, 60);

    doc.text(`Serviço Contratado: ${dadosContrato.descricao_servico}`, 20, 70);
    doc.text(`Detalhamento do Serviço: ${dadosContrato.servico_detalhado}`, 20, 80);
    doc.text(`Entregas: ${dadosContrato.entregas_detalhadas}`, 20, 90);
    doc.text(`Equipe: ${dadosContrato.equipe_detalhada}`, 20, 100);
    doc.text(`Valor do Serviço: ${dadosContrato.valor_servico}`, 20, 110);
    
    if (dadosContrato.tem_gastos_extras) {
      doc.text(`Gastos Extras: ${dadosContrato.gastos_detalhados}`, 20, 120);
    }
    
    doc.text(`Valor Total: ${dadosContrato.valor_total}`, 20, 130);
    doc.text(`Data do Contrato: ${dadosContrato.data_contrato}`, 20, 140);
    doc.text(`Testemunha Contratante: ${dadosContrato.nome_testemunha_contratante}`, 20, 150);
    doc.text(`RG Testemunha Contratante: ${dadosContrato.rg_testemunha_contratante}`, 20, 160);
    doc.text(`Testemunha Contratada: ${dadosContrato.nome_testemunha_contratada}`, 20, 170);
    doc.text(`RG Testemunha Contratada: ${dadosContrato.rg_testemunha_contratada}`, 20, 180);
    
    const pdfUrl = doc.output('bloburl'); // Cria a URL do PDF
    dispatch({ type: 'SET_PDF_URL', payload: pdfUrl });
  };

  const enviarResposta = () => {
    const etapa = etapas[etapaAtual];
    const valor = resposta.trim();
    if (!valor) return;

    const campoAtual = etapa.campo;

    if (campoAtual === 'tem_gastos_extras') {
      const temGastos = valor.toLowerCase() === 'sim';
      dispatch({ type: 'UPDATE_DADOS', payload: { tem_gastos_extras: temGastos } });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
      dispatch({ type: 'SET_RESPOSTA', payload: '' });

      if (!temGastos) {
        dispatch({ type: 'UPDATE_DADOS', payload: { gastos_detalhados: 'Sem gastos extras' } });
        dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 2 });
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[etapaAtual + 2].pergunta } });
      } else {
        dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 1 });
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[etapaAtual + 1].pergunta } });
      }
    } else {
      dispatch({ type: 'UPDATE_DADOS', payload: { [campoAtual]: valor } });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
      dispatch({ type: 'SET_RESPOSTA', payload: '' });

      if (etapaAtual === etapas.length - 1) {
        gerarPDF(); // Gera o PDF quando a última etapa for concluída
      } else {
        dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 1 });
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[etapaAtual + 1].pergunta } });
      }
    }
  };

  const responderContrato = (valor) => {
    if (valor.toLowerCase() === 'não') {
      dispatch({ type: 'CANCELAR_CONTRATO' });
    } else {
      dispatch({ type: 'CONFIRMAR_CONTRATO' });
      dispatch({ type: 'SET_ETAPA', payload: 0 });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[0].pergunta } });
    }
    dispatch({ type: 'SET_RESPOSTA', payload: '' });
  };

  useEffect(() => {
    dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: 'Seja bem-vinda, My! Aproveite a sua ferramenta.' } });
    dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: 'Quer realizar um contrato comigo? (sim/não)' } });
  }, []);

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
            placeholder="Digite sua resposta..."
          />
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700"
            onClick={enviarResposta}
          >
            Enviar
          </button>
        </div>

        {contratoConfirmado && pdfUrl && (
          <div className="mt-6">
            <a href={pdfUrl} download="contrato.pdf">
              <button className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-700">
                Baixar Contrato
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}