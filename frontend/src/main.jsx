import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000' });
const vazio = { nome: '', descricao: '', preco: '', quantidade: '' };
function App() {
  const [produtos, setProdutos] = React.useState([]);
  const [form, setForm] = React.useState(vazio);
  const [editando, setEditando] = React.useState(null);
  const [erro, setErro] = React.useState('');
  const [carregando, setCarregando] = React.useState(false);
  async function carregar() { try { setProdutos((await api.get('/api/produtos')).data); setErro(''); } catch { setErro('Não foi possível carregar os produtos. Verifique a API.'); } }
  React.useEffect(() => { carregar(); }, []);
  async function salvar(e) {
    e.preventDefault(); setErro(''); setCarregando(true);
    const dados = { ...form, preco: Number(form.preco), quantidade: Number(form.quantidade) };
    try {
      if (editando) await api.put(`/api/produtos/${editando}`, dados);
      else await api.post('/api/produtos', dados);
      setForm(vazio); setEditando(null); await carregar();
    } catch(err) { setErro(err.response?.data?.erro || 'Erro ao salvar produto.'); }
    finally { setCarregando(false); }
  }
  function editar(p) { setEditando(p._id); setForm({ nome: p.nome, descricao: p.descricao, preco: String(p.preco), quantidade: String(p.quantidade) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function excluir(p) { if (!window.confirm(`Excluir ${p.nome}?`)) return; try { await api.delete(`/api/produtos/${p._id}`); await carregar(); } catch { setErro('Erro ao excluir produto.'); } }
  return <main><header><span className="eyebrow">GERENCIAMENTO DE ESTOQUE</span><h1>Cadastro de Produtos</h1><p>Cadastre, consulte e gerencie seus produtos em um só lugar.</p></header>
    <section className="card"><h2>{editando ? 'Editar produto' : 'Novo produto'}</h2><form onSubmit={salvar}>
      <label>Nome<input required maxLength="120" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Ex.: Teclado mecânico"/></label>
      <label>Descrição<input value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} placeholder="Descrição do produto"/></label>
      <div className="duas"><label>Preço (R$)<input type="number" required min="0" step="0.01" value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})}/></label><label>Quantidade<input type="number" required min="0" step="1" value={form.quantidade} onChange={e=>setForm({...form,quantidade:e.target.value})}/></label></div>
      <div className="acoes"><button disabled={carregando} type="submit">{carregando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar produto'}</button>{editando && <button type="button" className="secundario" onClick={()=>{setEditando(null);setForm(vazio);}}>Cancelar</button>}</div>
    </form></section>
    {erro && <p className="erro" role="alert">{erro}</p>}
    <section className="card"><div className="titulo-lista"><h2>Produtos cadastrados</h2><span>{produtos.length} produto(s)</span></div>
    {produtos.length === 0 ? <p className="vazio">Nenhum produto cadastrado ainda.</p> : <div className="tabela"><table><thead><tr><th>Produto</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead><tbody>{produtos.map(p=><tr key={p._id}><td><strong>{p.nome}</strong><small>{p.descricao}</small></td><td>{Number(p.preco).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td>{p.quantidade}</td><td><div className="acoes"><button className="secundario" onClick={()=>editar(p)}>Editar</button><button className="perigo" onClick={()=>excluir(p)}>Excluir</button></div></td></tr>)}</tbody></table></div>}</section>
    <footer>Projeto Full Stack • React + Express + MongoDB</footer></main>;
}
createRoot(document.getElementById('root')).render(<App/>);
