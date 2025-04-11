import React, { useState } from 'react';
import './App.css';

const etapas = {
  tipo: 0,
  dados: 1,
  servico: 2,
  testemunhas: 3,
  final: 4,
};

export default function App() {
  const [step, setStep] = useState(etapas.tipo);
  const [data, setData] = useState({
    tipo_contratante: '',
    contratante_nome: '',
    contratante_cnpj: '',
    contratante_endereco: '',
    contratada_nome: 'MYLENA SIMOES',
    contratada_cnpj: '30.328.562/0001-20',
    contratada_endereco: 'Avenida São Bento, n° 140, apto 94, Guarulhos - SP – CEP 07070-000',
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
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    const res = await fetch('https://contratos-mydia.onrender.com/gerar-contrato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setStep(etapas.final);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <div className="max-w-xl mx-auto bg-zinc-900 rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-pink-500">Gerador de Contrato</h1>

        {step === etapas.tipo && (
          <div>
            <p>Olá! Vamos começar. A contratante é pessoa física ou jurídica?</p>
            <select name="tipo_contratante" onChange={handleChange} className="mt-2 w-full p-2 rounded bg-zinc-800 text-white">
              <option value="">Selecione...</option>
              <option value="juridica">Jurídica</option>
              <option value="fisica">Física</option>
            </select>
            <button onClick={() => setStep(etapas.dados)} className="mt-4 bg-pink-600 px-4 py-2 rounded">Avançar</button>
          </div>
        )}

        {step === etapas.dados && (
          <div className="space-y-3">
            <p>Nome da contratante:</p>
            <input name="contratante_nome" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <p>{data.tipo_contratante === 'fisica' ? 'CPF' : 'CNPJ'} da contratante:</p>
            <input name="contratante_cnpj" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <p>Endereço da contratante:</p>
            <input name="contratante_endereco" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <button onClick={() => setStep(etapas.servico)} className="mt-4 bg-pink-600 px-4 py-2 rounded">Próximo</button>
          </div>
        )}

        {step === etapas.servico && (
          <div className="space-y-3">
            <p>Descreva o serviço:</p>
            <textarea name="descricao_servico" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" rows="2" />

            <p>Detalhamento do serviço:</p>
            <textarea name="servico_detalhado" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" rows="2" />

            <p>Detalhes das entregas:</p>
            <textarea name="entregas_detalhadas" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" rows="2" />

            <p>Equipe envolvida:</p>
            <textarea name="equipe_detalhada" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" rows="2" />

            <p>Detalhes de captação:</p>
            <textarea name="captacao_detalhada" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" rows="2" />

            <p>Valor do serviço (ex: 6500,00):</p>
            <input name="valor_servico" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <label className="block mt-2">
              <input type="checkbox" name="tem_gastos_extras" onChange={handleChange} /> Há gastos adicionais?
            </label>
            {data.tem_gastos_extras && (
              <textarea name="gastos_detalhados" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" placeholder="Descreva os gastos extras..." />
            )}

            <p>Valor total final (serviço + extras):</p>
            <input name="valor_total" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <p>Data do contrato (ex: Guarulhos, 11 de Abril de 2025):</p>
            <input name="data_contrato" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <button onClick={() => setStep(etapas.testemunhas)} className="mt-4 bg-pink-600 px-4 py-2 rounded">Próximo</button>
          </div>
        )}

        {step === etapas.testemunhas && (
          <div className="space-y-3">
            <p>Nome da testemunha da contratante:</p>
            <input name="nome_testemunha_contratante" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <p>RG da testemunha da contratante:</p>
            <input name="rg_testemunha_contratante" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <p>RG da testemunha da contratada (Mylena):</p>
            <input name="rg_testemunha_contratada" onChange={handleChange} className="w-full p-2 rounded bg-zinc-800" />

            <button onClick={handleSubmit} className="mt-4 bg-pink-600 px-4 py-2 rounded">Gerar Contrato</button>
          </div>
        )}

        {step === etapas.final && pdfUrl && (
          <div>
            <p className="text-green-400">Contrato gerado com sucesso!</p>
            <a href={pdfUrl} target="_blank" className="text-pink-500 underline">Clique aqui para baixar o PDF</a>
          </div>
        )}
      </div>
    </div>
  );
}
