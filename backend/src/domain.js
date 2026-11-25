export const AVISO = 'Ferramenta de apoio; a decisão e a responsabilidade pela prescrição são do médico veterinário.'; // RN09

/** Faixas de peso (RN04) e constante K da superfície corporal (RN07). */
export const ESPECIES = {
  CAO:       { nome: 'Cão',       min: '0.5',   max: '90',   k: '10.1' },
  GATO:      { nome: 'Gato',      min: '0.3',   max: '12',   k: '10.0' },
  EQUINO:    { nome: 'Equino',    min: '50',    max: '1000', k: null },
  SILVESTRE: { nome: 'Silvestre', min: '0.005', max: '500',  k: null },
};

const ORDEM = { BLOQUEIO: 0, CONTRAINDICADO: 1, CAUTELA: 2 };
export const ordenar = (alertas) => [...alertas].sort((a, b) => ORDEM[a.gravidade] - ORDEM[b.gravidade]);

/** Violação de regra de negócio (vira HTTP 422; 'REQ' vira 400). */
export class RegraNegocioError extends Error {
  constructor(regra, mensagem) { super(mensagem); this.regra = regra; }
}
export class NaoEncontradoError extends Error { }
