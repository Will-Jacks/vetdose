import Decimal from 'decimal.js';
import { ESPECIES, RegraNegocioError, ordenar, AVISO } from './domain.js';

// Decimal.js faz o papel do BigDecimal: sem erro de ponto flutuante nas doses.
Decimal.set({ precision: 12, rounding: Decimal.ROUND_HALF_UP });
const D = (v) => new Decimal(v);
const r2 = (v) => v.toFixed(2);

/** RN04 – peso numérico e dentro da faixa da espécie. */
export function validarPeso(peso, codEsp) {
  const esp = ESPECIES[codEsp];
  if (!esp) throw new RegraNegocioError('RN06', 'Espécie inválida.');
  let p = null;
  try { p = D(peso); } catch { /* peso não numérico */ }
  if (!p || p.isNaN() || p.lte(0) || p.lt(esp.min) || p.gt(esp.max))
    throw new RegraNegocioError('RN04', `Peso fora da faixa de ${esp.nome}: ${esp.min} a ${esp.max} kg.`);
  return p;
}

/** A1 – Dose (mg) = peso × posologia (mg/kg) */
export const dosePorPeso = (peso, mgKg) => D(peso).mul(mgKg);

/** A3 / RN07 – SC (m²) = K × peso^(2/3) ÷ 100 */
export function superficieCorporal(peso, codEsp) {
  const k = ESPECIES[codEsp].k;
  if (!k) throw new RegraNegocioError('RN07', 'Superfície corporal só está disponível para cães e gatos.');
  return D(k).mul(D(peso).pow(D(2).div(3))).div(100);
}
export const doseSuperficie = (peso, codEsp, mgM2) => superficieCorporal(peso, codEsp).mul(mgM2);

/** A5 / RN06 – Dose alvo = dose ref × (peso alvo ÷ peso ref)^0,75 (ESTIMATIVA) */
export const estimativaAlometrica = (doseRefMg, pesoRef, pesoAlvo) =>
  D(doseRefMg).mul(D(pesoAlvo).div(pesoRef).pow('0.75'));

/** RN05 – superdosagem */
export const superdosagem = (doseMg, doseMaxMg) => D(doseMg).gt(doseMaxMg);

/** RN01 – líquidos: 0,05 ml se < 1 ml; 0,1 ml nos demais casos. */
export function arredondarLiquido(ml) {
  const passo = ml.lt(1) ? D('0.05') : D('0.1');
  return ml.div(passo).toDecimalPlaces(0).mul(passo);
}
/** RN01 – comprimidos: menor fração cadastrada (¼, ½, inteiro). */
export const arredondarComprimido = (comp, fracao) => comp.div(fracao).toDecimalPlaces(0).mul(fracao);

/** Fluxo de UC01/UC03. `alertas` vem do UC05. */
export function calcular({ especie, peso, doseMin, doseMax, porSuperficie = false, apresentacao, alertas = [] }) {
  const p = validarPeso(peso, especie);                                            // RN04
  const lista = ordenar(alertas);
  if (lista.some((a) => a.gravidade === 'BLOQUEIO'))                               // RN02
    return { doseMg: null, doseMgMax: null, quantidadeExata: null, quantidadeArredondada: null,
             unidadeQuantidade: null, desvioArredondamentoAcima10: false, alertas: lista, aviso: AVISO };

  const f = porSuperficie ? (m) => doseSuperficie(p, especie, m) : (m) => dosePorPeso(p, m);
  const dMin = f(doseMin), dMax = f(doseMax);

  let exata, arred, unidade;                                                       // A2
  if (apresentacao.mgPorComprimido) {
    unidade = 'comprimido(s)';
    exata = dMin.div(apresentacao.mgPorComprimido);
    arred = arredondarComprimido(exata, D(apresentacao.fracaoMinima));
  } else {
    unidade = 'ml';
    exata = dMin.div(apresentacao.mgPorMl);
    arred = arredondarLiquido(exata);
  }
  const desvio = exata.gt(0) && arred.minus(exata).abs().div(exata).gt('0.1');     // RN01

  return { doseMg: r2(dMin), doseMgMax: r2(dMax), quantidadeExata: exata.toFixed(3),
           quantidadeArredondada: arred.toFixed(2), unidadeQuantidade: unidade,
           desvioArredondamentoAcima10: desvio, alertas: lista, aviso: AVISO };
}

/** A4 / RN08 – CRI. Dose em mcg/kg/h; concentração em mcg/ml. */
export function calcularCri({ especie, peso, doseMcgKgH, concMcgMl, volumeBolsaMl, fluidoMlH, alertas = [] }) {
  const p = validarPeso(peso, especie);
  if (D(volumeBolsaMl).lte(0) || D(fluidoMlH).lte(0))
    throw new RegraNegocioError('RN08', 'Volume da bolsa e taxa de fluido devem ser maiores que zero.');
  const lista = ordenar(alertas);
  if (lista.some((a) => a.gravidade === 'BLOQUEIO'))
    return { taxaFarmacoMlH: null, taxaFarmacoMcgH: null, adicionarBolsaMl: null, adicionarBolsaMcg: null,
             duracaoBolsaH: null, alertas: lista, aviso: AVISO };

  const mcgH = D(doseMcgKgH).mul(p);
  const mlH = mcgH.div(concMcgMl);
  const duracao = D(volumeBolsaMl).div(fluidoMlH);
  const mcgBolsa = mcgH.mul(duracao);
  const mlBolsa = mcgBolsa.div(concMcgMl);
  if (mlBolsa.gte(volumeBolsaMl))
    throw new RegraNegocioError('RN08', 'A quantidade a adicionar é maior ou igual ao volume da bolsa; use bolsa maior ou fármaco mais concentrado.');
  return { taxaFarmacoMlH: r2(mlH), taxaFarmacoMcgH: r2(mcgH), adicionarBolsaMl: r2(mlBolsa),
           adicionarBolsaMcg: r2(mcgBolsa), duracaoBolsaH: r2(duracao), alertas: lista, aviso: AVISO };
}

/** RN13 – conversão automática mcg ↔ mg. */
export const mcgParaMg = (mcg) => D(mcg).div(1000);
export const mgParaMcg = (mg) => D(mg).mul(1000);
