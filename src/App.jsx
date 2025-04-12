import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import OpeningAnimation from './components/OpeningAnimation'; // certifique-se de que esse componente existe

export default function App() {
  const [etapa, setEtapa] = useState(0);
  const [mensagens, setMensagens] = useState([]);
  const [digitando, setDigitando] = useState(false);
  const [resposta, setResposta] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  const [dados, setDados] = useState({
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
    { campo: 'tipo_contratante', pergunta: 'Olá! A contratante é pessoa física ou jurídica?' },
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
    { campo: 'rg_testemunha_contratada', pergunta: 'RG da testemunha da contratada (Mylena):' },
  ];

  useEffect(() => {
    if (etapa < etapas.length) {
      const { pergunta } = etapas[etapa];
      setDigitando(true);
      setTimeout(() => {
        setMensagens((msgs) => [...msgs, { autor: 'mydia', texto: pergunta }]);
        setDigitando(false);
      }, 800);
    }
  }, [etapa]);

  const handleSubmit = async () => {
    const res = await fetch('https://contratos-mydia.onrender.com/gerar-contrato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setMensagens((msgs) => [...msgs, { autor: 'mydia', texto: 'Contrato gerado com sucesso! 🎉 Clique abaixo para baixar.' }]);
  };

  const enviarResposta = () => {
    const campo = etapas[etapa].campo;
    const valor = resposta.trim();
    if (!valor) return;

    const novoValor = campo === 'tem_gastos_extras' ? valor.toLowerCase() === 'sim' : valor;
    setDados((prev) => ({ ...prev, [campo]: novoValor }));
    setMensagens((msgs) => [...msgs, { autor: 'user', texto: valor }]);
    setResposta('');

    if (campo === 'tem_gastos_extras' && !novoValor) {
      setEtapa(etapa + 2); // pula gastos_detalhados se não tiver
    } else if (etapa === etapas.length - 1) {
      handleSubmit();
    } else {
      setEtapa(etapa + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <OpeningAnimation />
      <h1 className="text-pink-500 font-bold text-3xl mb-6">Mydia Documentos</h1>
      <div className="w-full max-w-xl bg-zinc-900 rounded-xl p-4 space-y-4">
        {mensagens.map((msg, i) => (
          <div key={i} className={`flex ${msg.autor === 'mydia' ? 'justify-start' : 'justify-end'}`}>
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
            <div className="px-3 py-2 rounded-lg bg-zinc-800 text-pink-400 animate-pulse">Digitando...</div>
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
            <button onClick={enviarResposta} className="bg-pink-600 px-4 rounded">Enviar</button>
          </div>
        )}

        {pdfUrl && (
          <div className="text-center mt-6">
            <a href={pdfUrl} target="_blank" className="bg-pink-600 px-6 py-3 rounded-full text-white hover:bg-pink-700 transition">
              📄 Baixar Contrato PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
