INSERT IGNORE INTO especie (id, codigo, nome, peso_min_kg, peso_max_kg, constante_k) VALUES
 (1,'CAO','Cão',0.500,90.000,10.1),(2,'GATO','Gato',0.300,12.000,10.0),
 (3,'EQUINO','Equino',50.000,1000.000,NULL),(4,'SILVESTRE','Silvestre',0.005,500.000,NULL);

INSERT IGNORE INTO raca (id, especie_id, nome, mutacao_mdr1) VALUES
 (1,1,'Collie',1),(2,1,'Pastor de Shetland',1),(3,1,'Pastor Australiano',1),
 (4,1,'Old English Sheepdog',1),(5,1,'Labrador Retriever',0),(6,2,'Siamês',0);

INSERT IGNORE INTO classe_terapeutica (id, nome) VALUES
 (1,'AINE'),(2,'Opioide'),(3,'Antineoplásico'),(4,'Antiparasitário'),(5,'Antidiarreico'),(6,'Analgésico');

INSERT IGNORE INTO farmaco (id, principio_ativo, classe_id, mecanismo, indicacoes, fonte, ativo) VALUES
 (1,'Meloxicam',1,'Inibidor preferencial da COX-2.','Dor e inflamação musculoesquelética.','Plumb''s Veterinary Drug Handbook',1),
 (2,'Fentanil',2,'Agonista opioide μ.','Analgesia intraoperatória e controle de dor intensa (CRI).','Plumb''s Veterinary Drug Handbook',1),
 (3,'Doxorrubicina',3,'Intercalação no DNA e inibição da topoisomerase II.','Linfoma e sarcomas.','Plumb''s Veterinary Drug Handbook',1),
 (4,'Paracetamol',6,'Inibição central da COX; analgésico e antipirético.','Analgesia em cães sob supervisão. Tóxico para gatos.','Plumb''s Veterinary Drug Handbook',1),
 (5,'Ivermectina',4,'Agonista de canais de cloreto em invertebrados.','Prevenção de dirofilariose e ectoparasitas.','Plumb''s Veterinary Drug Handbook',1),
 (6,'Loperamida',5,'Agonista opioide periférico; reduz a motilidade intestinal.','Diarreia não infecciosa.','Plumb''s Veterinary Drug Handbook',1);

INSERT IGNORE INTO apresentacao (id, farmaco_id, forma, mg_por_ml, mg_por_comprimido, fracao_minima) VALUES
 (1,1,'Solução oral 1,5 mg/ml',1.5,NULL,NULL),(2,1,'Comprimido 7,5 mg',NULL,7.5,0.25),
 (3,2,'Solução injetável 50 mcg/ml',0.05,NULL,NULL),(4,3,'Solução injetável 2 mg/ml',2,NULL,NULL),
 (5,4,'Comprimido 500 mg',NULL,500,0.5),(6,5,'Comprimido 0,068 mg',NULL,0.068,1),
 (7,6,'Comprimido 2 mg',NULL,2,0.5);

INSERT IGNORE INTO posologia (id, farmaco_id, especie_id, tipo, dose_min, dose_max, unidade, via, frequencia, fonte) VALUES
 (1,1,1,'MG_KG',0.1,0.1,'mg/kg','VO','a cada 24 h','Plumb''s'),
 (2,1,2,'MG_KG',0.05,0.05,'mg/kg','VO','a cada 24 h','Plumb''s'),
 (3,2,1,'CRI',2,5,'mcg/kg/h','IV','infusão contínua','Plumb''s'),
 (4,3,1,'MG_M2',30,30,'mg/m2','IV','a cada 21 dias','Plumb''s'),
 (5,3,2,'MG_M2',25,25,'mg/m2','IV','a cada 21 dias','Plumb''s'),
 (6,4,1,'MG_KG',10,15,'mg/kg','VO','a cada 8-12 h','Plumb''s'),
 (7,5,1,'MG_KG',0.006,0.006,'mg/kg','VO','a cada 30 dias (profilática)','Plumb''s'),
 (8,6,1,'MG_KG',0.1,0.2,'mg/kg','VO','a cada 8-12 h','Plumb''s');

INSERT IGNORE INTO contraindicacao (id, farmaco_id, especie_id, raca_id, gravidade, justificativa) VALUES
 (1,4,2,NULL,'BLOQUEIO','Deficiência de glicuronidação; risco de metemoglobinemia e lesão hepática.'),
 (2,5,1,1,'CONTRAINDICADO','Mutação MDR1: risco de neurotoxicidade acima da dose profilática.'),
 (3,5,1,2,'CONTRAINDICADO','Mutação MDR1: risco de neurotoxicidade acima da dose profilática.'),
 (4,5,1,3,'CONTRAINDICADO','Mutação MDR1: risco de neurotoxicidade acima da dose profilática.'),
 (5,5,1,4,'CONTRAINDICADO','Mutação MDR1: risco de neurotoxicidade acima da dose profilática.'),
 (6,6,1,1,'CONTRAINDICADO','Mutação MDR1: risco aumentado de neurotoxicidade.'),
 (7,6,1,2,'CONTRAINDICADO','Mutação MDR1: risco aumentado de neurotoxicidade.'),
 (8,6,1,3,'CONTRAINDICADO','Mutação MDR1: risco aumentado de neurotoxicidade.'),
 (9,6,1,4,'CONTRAINDICADO','Mutação MDR1: risco aumentado de neurotoxicidade.'),
 (10,1,2,NULL,'CAUTELA','Uso crônico em gatos: risco renal; usar a menor dose eficaz.');
