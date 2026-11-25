import express from 'express';
import cors from 'cors';
import * as svc from './farmacos.js';
import { RegraNegocioError, NaoEncontradoError } from './domain.js';

const app = express();
app.use(cors());
app.use(express.json());

const wrap = (fn) => (req, res, next) => fn(req, res).then((r) => res.json(r)).catch(next);
const exigir = (body, campos) => {
  const falta = campos.filter((c) => body?.[c] == null);
  if (falta.length) throw new RegraNegocioError('REQ', `Campos obrigatórios ausentes: ${falta.join(', ')}.`);
  return body;
};
const num = (v) => (v == null || v === '' ? null : Number(v));

app.get('/api/farmacos', wrap(async (req) =>                      // UC06
  svc.buscar({ q: req.query.q ?? '', classeId: num(req.query.classeId), especieId: num(req.query.especieId) })));
app.get('/api/farmacos/:id', wrap(async (req) => svc.ficha(Number(req.params.id))));   // UC02
app.get('/api/classes', wrap(async () => svc.classes()));
app.get('/api/especies', wrap(async () => svc.especies()));

app.post('/api/calculos/farmaco/dose', wrap(async (req) =>        // UC01 / UC03
  svc.calcularDose(exigir(req.body, ['farmacoId', 'especie', 'peso', 'apresentacaoId', 'tipo']))));
app.post('/api/calculos/farmaco/cri', wrap(async (req) =>         // UC04
  svc.calcularCri(exigir(req.body, ['farmacoId', 'especie', 'peso', 'doseMcgKgH', 'concentracaoMcgMl', 'volumeBolsaMl', 'fluidoMlH']))));

app.use((err, req, res, next) => {
  if (err instanceof RegraNegocioError)
    return res.status(err.regra === 'REQ' ? 400 : 422).json({ regra: err.regra, mensagem: err.message });
  if (err instanceof NaoEncontradoError) return res.status(404).json({ mensagem: err.message });
  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

export default app;
