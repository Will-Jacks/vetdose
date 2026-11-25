import { pool } from './db.js';
import { ESPECIES, NaoEncontradoError, RegraNegocioError } from './domain.js';
import * as motor from './calculadora.js';

const q = async (sql, params = []) => (await pool.query(sql, params))[0];
const ORDEM_GRAV = "FIELD(c.gravidade,'BLOQUEIO','CONTRAINDICADO','CAUTELA')";

/** UC06 / RN12 – a collation utf8mb4_0900_ai_ci ignora acento e caixa no LIKE. */
export async function buscar({ q: termo = '', classeId = null, especieId = null }) {
  const rows = await q(
    `SELECT f.id, f.principio_ativo AS principioAtivo, c.nome AS classe,
            (SELECT GROUP_CONCAT(DISTINCT e.nome ORDER BY e.nome SEPARATOR ',')
               FROM posologia p JOIN especie e ON e.id = p.especie_id WHERE p.farmaco_id = f.id) AS especies
       FROM farmaco f JOIN classe_terapeutica c ON c.id = f.classe_id
      WHERE f.ativo = 1 AND f.principio_ativo LIKE ?
        AND (? IS NULL OR f.classe_id = ?)
        AND (? IS NULL OR EXISTS (SELECT 1 FROM posologia p WHERE p.farmaco_id = f.id AND p.especie_id = ?))
      ORDER BY f.principio_ativo`,
    [`%${termo.trim()}%`, classeId, classeId, especieId, especieId]);
  return rows.map((r) => ({ ...r, especies: r.especies ? r.especies.split(',') : [] }));
}

/** UC02 – ficha completa (contraindicações mais graves primeiro). */
export async function ficha(id) {
  const [f] = await q(
    `SELECT f.id, f.principio_ativo AS principioAtivo, c.nome AS classe, f.mecanismo, f.indicacoes, f.fonte
       FROM farmaco f JOIN classe_terapeutica c ON c.id = f.classe_id WHERE f.id = ? AND f.ativo = 1`, [id]);
  if (!f) throw new NaoEncontradoError('Fármaco não disponível.');
  f.posologias = await q(
    `SELECT e.nome AS especie, p.tipo, p.dose_min AS doseMin, p.dose_max AS doseMax, p.unidade, p.via, p.frequencia, p.fonte
       FROM posologia p JOIN especie e ON e.id = p.especie_id WHERE p.farmaco_id = ?`, [id]);
  f.contraindicacoes = await q(
    `SELECT e.nome AS especie, r.nome AS raca, c.gravidade, c.justificativa
       FROM contraindicacao c JOIN especie e ON e.id = c.especie_id LEFT JOIN raca r ON r.id = c.raca_id
      WHERE c.farmaco_id = ? ORDER BY ${ORDEM_GRAV}`, [id]);
  f.apresentacoes = await q(
    `SELECT id, forma, mg_por_ml AS mgPorMl, mg_por_comprimido AS mgPorComprimido, fracao_minima AS fracaoMinima
       FROM apresentacao WHERE farmaco_id = ?`, [id]);
  return f;
}

export const classes = () => q('SELECT id, nome FROM classe_terapeutica ORDER BY nome');

export async function especies() {
  const es = await q('SELECT id, codigo, nome FROM especie ORDER BY id');
  const racas = await q('SELECT id, especie_id AS especieId, nome, mutacao_mdr1 AS mutacaoMdr1 FROM raca ORDER BY nome');
  return es.map((e) => ({ ...e, racas: racas.filter((r) => r.especieId === e.id) }));
}

/** UC05 – Verificar Toxicidade e Contraindicações. */
export async function verificarContraindicacoes(farmacoId, especieId, racaId) {
  const rows = await q(
    `SELECT c.gravidade, c.justificativa AS mensagem FROM contraindicacao c
      WHERE c.farmaco_id = ? AND c.especie_id = ? AND (c.raca_id IS NULL OR c.raca_id = ?)
      ORDER BY ${ORDEM_GRAV}`, [farmacoId, especieId, racaId]);
  if (racaId == null)   // UC05 A2
    rows.push({ gravidade: 'CAUTELA', mensagem: 'Raça não informada: restrições raciais não foram verificadas.' });
  return rows;
}

async function contexto(farmacoId, codEsp, tipo) {
  const esp = ESPECIES[codEsp];
  const [e] = esp ? await q('SELECT id FROM especie WHERE codigo = ?', [codEsp]) : [];
  if (!e) throw new RegraNegocioError('RN06', 'Espécie inválida ou não cadastrada.');
  const [pos] = await q('SELECT * FROM posologia WHERE farmaco_id = ? AND especie_id = ? AND tipo = ? LIMIT 1',
    [farmacoId, e.id, tipo]);
  if (!pos)                                                                          // RN06
    throw new RegraNegocioError('RN06', `Sem posologia ${tipo} cadastrada para ${esp.nome}` +
      (codEsp === 'SILVESTRE' ? '; apenas a estimativa alométrica (A5) é permitida.' : '.'));
  return { especieId: e.id, pos };
}

/** UC01 / UC03 – dose por peso (MG_KG) ou superfície corporal (MG_M2). */
export async function calcularDose({ farmacoId, especie, racaId = null, peso, apresentacaoId, tipo }) {
  if (!['MG_KG', 'MG_M2'].includes(tipo))
    throw new RegraNegocioError('REQ', "tipo deve ser 'MG_KG' ou 'MG_M2' (para infusão use /cri).");
  const { especieId, pos } = await contexto(farmacoId, especie, tipo);
  const [a] = await q('SELECT mg_por_ml AS mgPorMl, mg_por_comprimido AS mgPorComprimido, fracao_minima AS fracaoMinima ' +
    'FROM apresentacao WHERE id = ? AND farmaco_id = ?', [apresentacaoId, farmacoId]);
  if (!a) throw new RegraNegocioError('RN01', 'Apresentação inválida para este fármaco.');
  const alertas = await verificarContraindicacoes(farmacoId, especieId, racaId);
  const resultado = motor.calcular({ especie, peso, doseMin: pos.dose_min, doseMax: pos.dose_max,
    porSuperficie: tipo === 'MG_M2', apresentacao: a, alertas });
  return { resultado, posologia: `${Number(pos.dose_min)} ${pos.unidade}`, via: pos.via, frequencia: pos.frequencia, fonte: pos.fonte };
}

/** UC04 – CRI. */
export async function calcularCri({ farmacoId, especie, racaId = null, peso, doseMcgKgH, concentracaoMcgMl, volumeBolsaMl, fluidoMlH }) {
  const { especieId, pos } = await contexto(farmacoId, especie, 'CRI');
  const alertas = await verificarContraindicacoes(farmacoId, especieId, racaId);
  if (Number(doseMcgKgH) < Number(pos.dose_min) || Number(doseMcgKgH) > Number(pos.dose_max))   // RN05
    alertas.push({ gravidade: 'CAUTELA',
      mensagem: `Dose fora da faixa de referência (${Number(pos.dose_min)} a ${Number(pos.dose_max)} ${pos.unidade}).` });
  return motor.calcularCri({ especie, peso, doseMcgKgH, concMcgMl: concentracaoMcgMl, volumeBolsaMl, fluidoMlH, alertas });
}
