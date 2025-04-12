import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import OpeningAnimation from './components/OpeningAnimation';

export default function App() {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [mensagens, setMensagens] = useState([]);
  const [digitando, setDigitando] = useState(false);
  const [resposta, setResposta] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [dadosContrato, setDadosContrato] = useState({
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
  });

  const etapas = [
    { campo: 'tipo_contratante', pergunta: 'Olá, Mylena! A contratante é pessoa física ou jurídica?' },
    { campo: 'contratante_nome', pergunta: 'Qual o nome da contratante?' },
    { campo: 'contratante_cnpj', pergunta: 'Qual o CNPJ ou CPF da contratante?' },
    { campo: 'contratante_endereco', pergunta: 'Qual o endereço da contratante?' },
    { campo: 'descricao_servico', pergunta: 'Descreva brevemente o serviço contratado.' },
    { campo: 'servico_detalhado', pergunta: 'Detalhe o serviço que será realizado.' },
    { campo: 'entregas_detalhadas', pergunta: 'Quais as entregas previstas?' },
    { campo: 'equipe_detalhada', pergunta: 'Qual será a equipe envolvida?' },
    { campo: 'captacao_detalhada', pergunta: 'Detalhes sobre a captação (ex: interna, áudio, iluminação).' },
    { campo: 'valor_servico', pergunta: 'Qual o valor do serviço (ex: 6500,00)?' },
    { campo: 'tem_gastos_extras', pergunta: 'Existem gastos extras (como estacionamento)? (sim/não)' },
    { campo: 'gastos_detalhados', pergunta: 'Descreva os gastos extras.' },
    { campo: 'valor_total', pergunta: 'Qual o valor total final (serviço + extras)?' },
    { campo: 'data_contrato', pergunta: 'Informe a data e local do contrato (ex: Guarulhos, 11 de Abril de 2025).' },
    { campo: 'nome_testemunha_contratante', pergunta: 'Nome da testemunha da contratante:' },
    { campo: 'rg_testemunha_contratante', pergunta: 'RG da testemunha da contratante:' },
    { campo: 'rg_testemunha_contratada', pergunta: 'RG da testemunha da Mylena:' },
  ];

  // Exibe a pergunta da etapa atual
  useEffect(() => {
    if (etapaAtual < etapas.length) {
      const { pergunta } = etapas[etapaAtual];
      setDigitando(true);
      setTimeout(() => {
        setMensagens((msgs) => [...msgs, { autor: 'mydia', texto: pergunta }]);
        setDigitando(false);
      }, 800);
    }
  }, [etapaAtual]);

  // Envia os dados e gera o PDF
  const handleSubmit = async () => {
    const res = await fetch('https://contratos-mydia.onrender.com/gerar-contrato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosContrato),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
    setMensagens((msgs) => [
      ...msgs,
      { autor: 'mydia', texto: 'Contrato gerado com sucesso, My! Clique abaixo para baixar o seu arquivo.' },
    ]);
  };

  // Lógica de envio de resposta
  const enviarResposta = () => {
    const campoAtual = etapas[etapaAtual].campo;
    const valorDigitado = resposta.trim();

    if (!valorDigitado) return;

    const valorFormatado =
      campoAtual === 'tem_gastos_extras'
        ? valorDigitado.toLowerCase() === 'sim'
        : valorDigitado;

    setDadosContrato((prev) => ({ ...prev, [campoAtual]: valorFormatado }));
    setMensagens((msgs) => [...msgs, { autor: 'user', texto: valorDigitado }]);
    setResposta('');

    if (campoAtual === 'tem_gastos_extras' && !valorFormatado) {
      setEtapaAtual(etapaAtual + 2); // pula a etapa de descrição dos gastos
    } else if (etapaAtual === etapas.length - 1) {
      handleSubmit();
    } else {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  // Lógica de alteração de campo (para checkbox)
  const handleChange = (e) => {
    const { name: campo, value, type, checked } = e.target;
    const novoValor = type === 'checkbox' ? checked : value;

    setDadosContrato((prev) => ({ ...prev, [campo]: novoValor }));

    // Lógica especial para pular "gastos_detalhados" se "tem_gastos_extras" for falso
    if (campo === 'tem_gastos_extras') {
      if (!novoValor || novoValor === 'não' || novoValor === 'nao' || novoValor === 'false') {
        setDadosContrato((prev) => ({ ...prev, gastos_detalhados: '' }));
        setEtapaAtual(etapaAtual + 2); // Pula a etapa de gastos_detalhados
        return;
      }
    }

    setEtapaAtual(etapaAtual + 1);
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

        {digitando && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg bg-zinc-800 text-pink-400 animate-pulse">Paciência, My...</div>
          </div>
        )}

        {!pdfUrl && !digitando && (
          <div className="flex gap-2">
            <input
              className="flex-1 bg-zinc-800 p-2 rounded text-white border border-pink-500 focus:outline-none"
              placeholder="Sua resposta..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarResposta()}
            />
            <button onClick={enviarResposta} className="bg-pink-600 px-4 rounded">Envie, My</button>
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
