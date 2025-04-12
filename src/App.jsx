import React, { useReducer } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import OpeningAnimation from './components/OpeningAnimation';

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
  digitando: false,
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
    case 'SET_DIGITANDO':
      return { ...state, digitando: action.payload };
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

  const validarCampos = () => {
    const { valor_servico, valor_total } = dadosContrato;
    if (isNaN(valor_servico) || isNaN(valor_total)) {
      alert("Valores de serviço e total devem ser numéricos.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    try {
      const res = await fetch('https://contratos-mydia.onrender.com/gerar-contrato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosContrato),
      });

      if (!res.ok) throw new Error('Erro ao gerar contrato.');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      dispatch({ type: 'SET_PDF_URL', payload: url });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: 'Contrato gerado! Clique abaixo para baixar.' } });
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar contrato.');
    }
  };

  const enviarResposta = () => {
    const etapa = etapas[etapaAtual];
    const valor = resposta.trim();
    if (!valor) return;

    const respostaConvertida = etapa.campo === 'tem_gastos_extras' ? valor.toLowerCase() === 'sim' : valor;

    dispatch({ type: 'UPDATE_DADOS', payload: { [etapa.campo]: respostaConvertida } });
    dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
    dispatch({ type: 'SET_RESPOSTA', payload: '' });

    if (etapa.campo === 'tem_gastos_extras' && valor.toLowerCase() !== 'sim') {
      dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 2 });
    } else if (etapaAtual === etapas.length - 1) {
      handleSubmit();
    } else {
      const proximaEtapa = etapaAtual + 1;
      dispatch({ type: 'SET_ETAPA', payload: proximaEtapa });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[proximaEtapa].pergunta } });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <OpeningAnimation />
      <h1 className="text-pink-500 font-bold text-3xl mb-6">Mydia AI</h1>
      <div className="w-full max-w-xl bg-zinc-900 rounded-xl p-4 space-y-4">
        {mensagens.map((msg, index) => (
          <div key={index} className={`flex ${msg.autor === 'mydia' ? 'justify-start' : 'justify-end'}`}>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.autor === 'mydia' ? 'bg-zinc-800 text-pink-400' : 'bg-pink-500 text-black'}`}
            >
              {msg.texto}
            </motion.div>
          </div>
        ))}

        {!pdfUrl && (
          <div className="flex gap-2">
            <input
              className="flex-1 bg-zinc-800 p-2 rounded text-white border border-pink-500 focus:outline-none"
              placeholder="Sua resposta..."
              value={resposta}
              onChange={(e) => dispatch({ type: 'SET_RESPOSTA', payload: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && enviarResposta()}
            />
            <button onClick={enviarResposta} className="bg-pink-600 px-4 rounded">Enviar</button>
          </div>
        )}

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
