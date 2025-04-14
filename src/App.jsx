import React, { useReducer, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import OpeningAnimation from './components/OpeningAnimation';
import axios from 'axios';

const initialState = {
  dadosContrato: {
    tipo_contratante: '', contratante_nome: '', contratante_cnpj: '', contratante_endereco: '',
    contratada_nome: 'MYLENA SIMOES', contratada_cnpj: '30.328.562/0001-20',
    contratada_endereco: 'Avenida São Bento, 140, Guarulhos - SP', descricao_servico: '',
    servico_detalhado: '', entregas_detalhadas: '', equipe_detalhada: '', captacao_detalhada: '',
    valor_servico: '', tem_gastos_extras: false, gastos_detalhados: '', valor_total: '',
    data_contrato: '', nome_testemunha_contratante: '', rg_testemunha_contratante: '',
    nome_testemunha_contratada: 'MYLENA SIMOES', rg_testemunha_contratada: '',
  },
  etapaAtual: 0, mensagens: [], resposta: '', contratoConfirmado: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_DADOS': return { ...state, dadosContrato: { ...state.dadosContrato, ...action.payload } };
    case 'SET_ETAPA': return { ...state, etapaAtual: action.payload };
    case 'ADD_MENSAGEM': return { ...state, mensagens: [...state.mensagens, action.payload] };
    case 'SET_RESPOSTA': return { ...state, resposta: action.payload };
    case 'CONFIRMAR_CONTRATO': return { ...state, contratoConfirmado: true };
    default: return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { etapaAtual, mensagens, resposta, dadosContrato, contratoConfirmado } = state;

  const etapas = [
    { campo: 'tipo_contratante', pergunta: '👥 A contratante é pessoa física ou jurídica?' },
    { campo: 'contratante_nome', pergunta: '📝 Qual o nome da contratante?' },
    { campo: 'contratante_cnpj', pergunta: '🏢 Qual o CPF/CNPJ da contratante?' },
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
    axios.post('https://api-mydia.onrender.com', dadosContrato, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contrato.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Erro ao gerar o PDF:', error);
      });
  };

  const enviarResposta = () => {
    const etapa = etapas[etapaAtual];
    const valor = resposta.trim();
    if (!valor) return;

    if (etapa.campo === 'tem_gastos_extras') {
      const temGastos = valor.toLowerCase() === 'sim';
      dispatch({ type: 'UPDATE_DADOS', payload: { tem_gastos_extras: temGastos } });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
      dispatch({ type: 'SET_RESPOSTA', payload: '' });

      if (!temGastos) {
        dispatch({ type: 'UPDATE_DADOS', payload: { gastos_detalhados: 'Sem gastos extras' } });
        dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 2 });
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[etapaAtual + 2]?.pergunta } });
        return;
      }
    } else {
      dispatch({ type: 'UPDATE_DADOS', payload: { [etapa.campo]: valor } });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
      dispatch({ type: 'SET_RESPOSTA', payload: '' });
    }

    const proxima = etapas[etapaAtual + 1];
    if (proxima) dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: proxima.pergunta } });
    dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 1 });
  };

  useEffect(() => {
    if (etapaAtual === 0) dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapas[0].pergunta } });
  }, [etapaAtual]);

  return (
    <div className="App">
      {!contratoConfirmado ? (
        <>
          <OpeningAnimation />
          <div className="chat">
            <div className="messages">
              {mensagens.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className={msg.autor === 'user' ? 'message user' : 'message mydia'}>{msg.texto}</div>
                </motion.div>
              ))}
            </div>
            {etapaAtual < etapas.length ? (
              <div>
                <input type="text" value={resposta} onChange={(e) => dispatch({ type: 'SET_RESPOSTA', payload: e.target.value })} placeholder="Digite sua resposta" />
                <button onClick={enviarResposta}>Enviar</button>
              </div>
            ) : (
              <div>
                <button onClick={gerarPDF}>Gerar Contrato em PDF</button>
                <button onClick={() => dispatch({ type: 'CONFIRMAR_CONTRATO' })}>Confirmar Contrato</button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <h2>Contrato Confirmado!</h2>
        </div>
      )}
    </div>
  );
}
