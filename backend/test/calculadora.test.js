import test from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../src/calculadora.js';
import { RegraNegocioError } from '../src/domain.js';

test('A1+A2+RN01: meloxicam, cão 15 kg, 0,1 mg/kg, 1,5 mg/ml', () => {
  const r = c.calcular({ especie: 'CAO', peso: '15', doseMin: '0.1', doseMax: '0.1', apresentacao: { mgPorMl: '1.5' } });
  assert.equal(r.doseMg, '1.50');
  assert.equal(r.quantidadeArredondada, '1.00');
});

test('A3: superfície corporal, cão 20 kg', () => {
  assert.equal(c.superficieCorporal('20', 'CAO').toFixed(3), '0.744');
  assert.equal(c.doseSuperficie('20', 'CAO', '30').toFixed(2), '22.33');
});

test('RN07: equino sem superfície corporal', () => {
  assert.throws(() => c.superficieCorporal('400', 'EQUINO'), RegraNegocioError);
});

test('A4: CRI de fentanil', () => {
  const r = c.calcularCri({ especie: 'CAO', peso: '20', doseMcgKgH: '3', concMcgMl: '50', volumeBolsaMl: '500', fluidoMlH: '40' });
  assert.equal(r.taxaFarmacoMlH, '1.20');
  assert.equal(r.adicionarBolsaMl, '15.00');
  assert.equal(r.duracaoBolsaH, '12.50');
});

test('RN04: peso fora da faixa e não numérico', () => {
  assert.throws(() => c.validarPeso('15', 'GATO'), RegraNegocioError);
  assert.throws(() => c.validarPeso('abc', 'CAO'), RegraNegocioError);
});

test('RN02: paracetamol em gato bloqueia e não mostra dose', () => {
  const r = c.calcular({ especie: 'GATO', peso: '4', doseMin: '10', doseMax: '15', apresentacao: { mgPorMl: '32' },
    alertas: [{ gravidade: 'BLOQUEIO', mensagem: 'Tóxico para gatos.' }] });
  assert.equal(r.doseMg, null);
});

test('RN01: comprimido com desvio acima de 10%', () => {
  const r = c.calcular({ especie: 'GATO', peso: '3', doseMin: '1', doseMax: '1',
    apresentacao: { mgPorComprimido: '10', fracaoMinima: '0.5' } });
  assert.equal(r.desvioArredondamentoAcima10, true);
});

test('RN08: fármaco a adicionar maior que a bolsa', () => {
  assert.throws(() => c.calcularCri({ especie: 'CAO', peso: '20', doseMcgKgH: '3', concMcgMl: '1',
    volumeBolsaMl: '500', fluidoMlH: '40' }), RegraNegocioError);
});
