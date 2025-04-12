import React, { useState, useReducer, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import OpeningAnimation from './components/OpeningAnimation'; // Sua animação inicial
import pdfMake from 'pdfmake/build/pdfmake'; // Importando o pdfmake
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Importando as fontes do pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs; // Configura as fontes para o pdfmake

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
    case 'CONFIRMAR_CONTRATO':
      return { ...state, contratoConfirmado: true };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { etapaAtual, mensagens, resposta, dadosContrato, contratoConfirmado } = state;

  const etapasPessoaFisica = [
    { campo: 'tipo_contratante', pergunta: '👥 A contratante é pessoa física ou jurídica?' },
    { campo: 'contratante_nome', pergunta: '📝 Qual o nome da contratante?' },
    { campo: 'contratante_cnpj', pergunta: '🏢 Qual o CPF da contratante?' },
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
    const documentDefinition = {
      content: [
        { text: 'Contrato de Prestação de Serviços', style: 'header' },
        { text: `Contrato firmado entre ${dadosContrato.contratante_nome} (contratante) e ${dadosContrato.contratada_nome} (contratada)`, style: 'subheader' },
        { text: `CNPJ/CPF: ${dadosContrato.contratante_cnpj} / ${dadosContrato.contratada_cnpj}`, style: 'subheader' },
        { text: `Endereço: ${dadosContrato.contratante_endereco} / ${dadosContrato.contratada_endereco}`, style: 'subheader' },
        { text: `Serviço Contratado: ${dadosContrato.descricao_servico}`, style: 'text' },
        { text: `Detalhamento do Serviço: ${dadosContrato.servico_detalhado}`, style: 'text' },
        { text: `Entregas: ${dadosContrato.entregas_detalhadas}`, style: 'text' },
        { text: `Equipe: ${dadosContrato.equipe_detalhada}`, style: 'text' },
        { text: `Valor do Serviço: ${dadosContrato.valor_servico}`, style: 'text' },
        dadosContrato.tem_gastos_extras && { text: `Gastos Extras: ${dadosContrato.gastos_detalhados}`, style: 'text' },
        { text: `Valor Total: ${dadosContrato.valor_total}`, style: 'text' },
        { text: `Data do Contrato: ${dadosContrato.data_contrato}`, style: 'text' },
        { text: `Testemunha Contratante: ${dadosContrato.nome_testemunha_contratante}`, style: 'text' },
        { text: `RG Testemunha Contratante: ${dadosContrato.rg_testemunha_contratante}`, style: 'text' },
        { text: `Testemunha Contratada: ${dadosContrato.nome_testemunha_contratada}`, style: 'text' },
        { text: `RG Testemunha Contratada: ${dadosContrato.rg_testemunha_contratada}`, style: 'text' },
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 16, margin: [0, 10, 0, 10] },
        text: { fontSize: 12, margin: [0, 0, 0, 5] },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  };

  const enviarResposta = () => {
    const etapa = (dadosContrato.tipo_contratante === 'juridica' ? etapasPessoaFisica : etapasPessoaJuridica)[etapaAtual];
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
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: (etapasPessoaFisica[etapaAtual + 2] || etapasPessoaJuridica[etapaAtual + 2]).pergunta } });
      } else {
        dispatch({ type: 'SET_ETAPA', payload: etapaAtual + 1 });
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: (etapasPessoaFisica[etapaAtual + 1] || etapasPessoaJuridica[etapaAtual + 1]).pergunta } });
      }
    } else {
      const updateData = { [campoAtual]: valor };
      dispatch({ type: 'UPDATE_DADOS', payload: updateData });
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'user', texto: valor } });
      dispatch({ type: 'SET_RESPOSTA', payload: '' });

      const proximaEtapa = (dadosContrato.tipo_contratante === 'juridica' ? etapasPessoaFisica : etapasPessoaJuridica)[etapaAtual + 1];
      if (proximaEtapa) {
        dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: proximaEtapa.pergunta } });
      }
    }
  };

  useEffect(() => {
    if (etapaAtual === 0) {
      dispatch({ type: 'ADD_MENSAGEM', payload: { autor: 'mydia', texto: etapasPessoaFisica[etapaAtual].pergunta } });
    }
  }, [etapaAtual]);

  return (
    <div className="App">
      {!contratoConfirmado ? (
        <>
          <OpeningAnimation />
          <div className="chat">
            <div className="messages">
              {mensagens.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className={msg.autor === 'user' ? 'message user' : 'message mydia'}>
                    {msg.texto}
                  </div>
                </motion.div>
              ))}
            </div>

            {etapaAtual < etapasPessoaFisica.length || etapaAtual < etapasPessoaJuridica.length ? (
              <div>
                <input
                  type="text"
                  value={resposta}
                  onChange={(e) => dispatch({ type: 'SET_RESPOSTA', payload: e.target.value })}
                  placeholder="Digite sua resposta"
                />
                <button onClick={enviarResposta}>Enviar</button>
              </div>
            ) : (
              <div>
                <button onClick={gerarPDF}>Gerar Contrato em PDF</button>
                {pdfUrl && <a href={pdfUrl} download="contrato.pdf">Baixar Contrato</a>}
                <button onClick={() => dispatch({ type: 'CONFIRMAR_CONTRATO' })}>Confirmar Contrato</button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <h2>Contrato Confirmado</h2>
          <button onClick={() => dispatch({ type: 'CANCELAR_CONTRATO' })}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
