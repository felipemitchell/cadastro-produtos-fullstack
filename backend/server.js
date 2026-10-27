import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express();
app.use(express.json());
const origins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(x => x.trim());
app.use(cors({ origin: origins }));

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  descricao: { type: String, default: '' },
  preco: { type: Number, required: true, min: 0 },
  quantidade: { type: Number, required: true, min: 0 }
}, { timestamps: true });
const Produto = mongoose.model('Produto', produtoSchema);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/produtos', async (_req, res, next) => { try { res.json(await Produto.find().sort({ createdAt: -1 })); } catch(e) { next(e); } });
app.post('/api/produtos', async (req, res, next) => { try { res.status(201).json(await Produto.create(req.body)); } catch(e) { next(e); } });
app.put('/api/produtos/:id', async (req, res, next) => { try {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, overwrite: true });
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
} catch(e) { next(e); } });
app.delete('/api/produtos/:id', async (req, res, next) => { try {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  const produto = await Produto.findByIdAndDelete(req.params.id);
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.status(204).end();
} catch(e) { next(e); } });
app.use((err, _req, res, _next) => res.status(err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500).json({ erro: err.name === 'ValidationError' ? err.message : 'Erro ao processar solicitação' }));

if (!process.env.MONGODB_URI) { console.error('Configure MONGODB_URI no .env'); process.exit(1); }
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('API iniciada'));
}).catch(err => { console.error('Falha na conexão MongoDB:', err.message); process.exit(1); });
