// ============================================================
// script.js
// Projeto: Grimório do Jogador
// Função:
// - Controla a interface
// - Faz rolagens de atributos
// - Calcula modificadores, PV, CA, proficiência etc.
// - Salva e carrega personagens pela API Flask
// ============================================================


// ============================================================
// Referências principais
// ============================================================
const form = document.getElementById("character-form");
const feedback = document.getElementById("feedback");
const listEl = document.getElementById("character-list");

const fields = {
  id: document.getElementById("character-id"),

  nome: document.getElementById("nome"),
  nome_jogador: document.getElementById("nome_jogador"),
  classe: document.getElementById("classe"),
  nivel: document.getElementById("nivel"),
  raca: document.getElementById("raca"),
  subraca: document.getElementById("subraca"),
  antecedente: document.getElementById("antecedente"),
  tendencia: document.getElementById("tendencia"),
  xp: document.getElementById("xp"),
  inspiracao: document.getElementById("inspiracao"),

  idade: document.getElementById("idade"),
  altura: document.getElementById("altura"),
  peso: document.getElementById("peso"),
  olhos: document.getElementById("olhos"),
  pele: document.getElementById("pele"),
  cabelos: document.getElementById("cabelos"),

  forca: document.getElementById("forca"),
  destreza: document.getElementById("destreza"),
  constituicao: document.getElementById("constituicao"),
  inteligencia: document.getElementById("inteligencia"),
  sabedoria: document.getElementById("sabedoria"),
  carisma: document.getElementById("carisma"),

  vida_max: document.getElementById("vida_max"),
  vida_atual: document.getElementById("vida_atual"),
  vida_temp: document.getElementById("vida_temp"),
  ca: document.getElementById("ca"),
  iniciativa: document.getElementById("iniciativa"),
  deslocamento: document.getElementById("deslocamento"),
  proficiencia: document.getElementById("proficiencia"),
  dados_vida: document.getElementById("dados_vida"),
  sabedoria_passiva: document.getElementById("sabedoria_passiva"),

  testes_resistencia: document.getElementById("testes_resistencia"),
  pericias: document.getElementById("pericias"),

  ataques: document.getElementById("ataques"),
  equipamentos: document.getElementById("equipamentos"),
  caracteristicas_habilidades: document.getElementById("caracteristicas_habilidades"),
  idiomas_proficiencias: document.getElementById("idiomas_proficiencias"),

  tracos_personalidade: document.getElementById("tracos_personalidade"),
  ideais: document.getElementById("ideais"),
  ligacoes: document.getElementById("ligacoes"),
  defeitos: document.getElementById("defeitos"),

  historia: document.getElementById("historia"),
  aparencia: document.getElementById("aparencia"),
  aliados_organizacoes: document.getElementById("aliados_organizacoes"),
  tesouro: document.getElementById("tesouro"),

  classe_conjuradora: document.getElementById("classe_conjuradora"),
  habilidade_chave_magia: document.getElementById("habilidade_chave_magia"),
  cd_magia: document.getElementById("cd_magia"),
  bonus_ataque_magia: document.getElementById("bonus_ataque_magia"),

  truques: document.getElementById("truques"),
  magias_nivel_1: document.getElementById("magias_nivel_1"),
  magias_nivel_2: document.getElementById("magias_nivel_2"),
  magias_nivel_3: document.getElementById("magias_nivel_3"),
  magias_nivel_4: document.getElementById("magias_nivel_4"),
  magias_nivel_5: document.getElementById("magias_nivel_5"),

  espacos_nivel_1_total: document.getElementById("espacos_nivel_1_total"),
  espacos_nivel_1_usados: document.getElementById("espacos_nivel_1_usados"),
  espacos_nivel_2_total: document.getElementById("espacos_nivel_2_total"),
  espacos_nivel_2_usados: document.getElementById("espacos_nivel_2_usados"),
  espacos_nivel_3_total: document.getElementById("espacos_nivel_3_total"),
  espacos_nivel_3_usados: document.getElementById("espacos_nivel_3_usados"),
};

// Preview
const previewVida = document.getElementById("preview-vida");
const previewCA = document.getElementById("preview-ca");
const previewProficiencia = document.getElementById("preview-proficiencia");
const previewIniciativa = document.getElementById("preview-iniciativa");
const previewPassiva = document.getElementById("preview-passiva");

const diceLog = document.getElementById("dice-log");
const raceBonusLog = document.getElementById("race-bonus-log");

// Ficha final
const sheetIdentificacao = document.getElementById("sheet-identificacao");
const sheetCombate = document.getElementById("sheet-combate");
const sheetAtributos = document.getElementById("sheet-atributos");
const sheetPericias = document.getElementById("sheet-pericias");
const sheetAtaques = document.getElementById("sheet-ataques");
const sheetEquipamentos = document.getElementById("sheet-equipamentos");
const sheetCaracteristicas = document.getElementById("sheet-caracteristicas");
const sheetTracos = document.getElementById("sheet-tracos");
const sheetMagias = document.getElementById("sheet-magias");
const sheetHistoria = document.getElementById("sheet-historia");


// ============================================================
// Dados base
// ============================================================
const classOptions = [
  "Bárbaro",
  "Bardo",
  "Bruxo",
  "Clérigo",
  "Druida",
  "Feiticeiro",
  "Guerreiro",
  "Ladino",
  "Mago",
  "Monge",
  "Paladino",
  "Patrulheiro"
];

const raceOptions = [
  "Humano",
  "Anão",
  "Elfo",
  "Halfling",
  "Draconato",
  "Gnomo",
  "Meio-Elfo",
  "Meio-Orc",
  "Tiefling"
];

const subraceOptions = {
  "Humano": [],
  "Anão": ["Anão da Colina", "Anão da Montanha"],
  "Elfo": ["Alto Elfo", "Elfo da Floresta", "Drow"],
  "Halfling": ["Pés Leves", "Robusto"],
  "Draconato": [],
  "Gnomo": ["Gnomo da Floresta", "Gnomo das Rochas"],
  "Meio-Elfo": [],
  "Meio-Orc": [],
  "Tiefling": ["Legado Infernal"]
};

const raceBaseBonuses = {
  "Humano": { forca: 1, destreza: 1, constituicao: 1, inteligencia: 1, sabedoria: 1, carisma: 1 },
  "Anão": { constituicao: 2 },
  "Elfo": { destreza: 2 },
  "Halfling": { destreza: 2 },
  "Draconato": { forca: 2, carisma: 1 },
  "Gnomo": { inteligencia: 2 },
  "Meio-Elfo": { carisma: 2 },
  "Meio-Orc": { forca: 2, constituicao: 1 },
  "Tiefling": { inteligencia: 1, carisma: 2 }
};

const subraceBonuses = {
  "Anão da Colina": { sabedoria: 1 },
  "Anão da Montanha": { forca: 2 },
  "Alto Elfo": { inteligencia: 1 },
  "Elfo da Floresta": { sabedoria: 1 },
  "Drow": { carisma: 1 },
  "Pés Leves": { carisma: 1 },
  "Robusto": { constituicao: 1 },
  "Gnomo da Floresta": { destreza: 1 },
  "Gnomo das Rochas": { constituicao: 1 },
  "Legado Infernal": {}
};

const attrLabels = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma"
};

// Dado de vida por classe
const classHitDice = {
  "Bárbaro": 12,
  "Bardo": 8,
  "Bruxo": 8,
  "Clérigo": 8,
  "Druida": 8,
  "Feiticeiro": 6,
  "Guerreiro": 10,
  "Ladino": 8,
  "Mago": 6,
  "Monge": 8,
  "Paladino": 10,
  "Patrulheiro": 10
};

// Habilidade-chave de magia por classe
const spellcastingAbility = {
  "Bardo": "carisma",
  "Bruxo": "carisma",
  "Clérigo": "sabedoria",
  "Druida": "sabedoria",
  "Feiticeiro": "carisma",
  "Mago": "inteligencia",
  "Paladino": "carisma",
  "Patrulheiro": "sabedoria"
};


// ============================================================
// Utilidades visuais
// ============================================================
function setFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.style.color = isError ? "#fca5a5" : "#cbbca8";
}

function calculateModifier(value) {
  return Math.floor((Number(value) - 10) / 2);
}

function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}


// ============================================================
// Selects de classe e raça
// ============================================================
function populateClassOptions() {
  fields.classe.innerHTML = classOptions
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");
}

function populateRaceOptions() {
  fields.raca.innerHTML = raceOptions
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");
}

function populateSubraceOptions() {
  const race = fields.raca.value;
  const options = subraceOptions[race] || [];
  const current = fields.subraca.value;

  fields.subraca.innerHTML =
    '<option value="">Nenhuma</option>' +
    options.map((item) => `<option value="${item}">${item}</option>`).join("");

  if (options.includes(current)) {
    fields.subraca.value = current;
  } else {
    fields.subraca.value = "";
  }
}


// ============================================================
// Atributos base e finais
// ============================================================
function getBaseAttributes() {
  return {
    forca: Number(fields.forca.value || 10),
    destreza: Number(fields.destreza.value || 10),
    constituicao: Number(fields.constituicao.value || 10),
    inteligencia: Number(fields.inteligencia.value || 10),
    sabedoria: Number(fields.sabedoria.value || 10),
    carisma: Number(fields.carisma.value || 10),
  };
}

function getRaceBonuses() {
  const race = fields.raca.value;
  const subrace = fields.subraca.value;

  const total = { ...(raceBaseBonuses[race] || {}) };
  const sub = subraceBonuses[subrace] || {};

  Object.keys(sub).forEach((key) => {
    total[key] = (total[key] || 0) + sub[key];
  });

  return total;
}

function getFinalAttributes() {
  const base = getBaseAttributes();
  const bonuses = getRaceBonuses();
  const finalValues = { ...base };

  Object.keys(bonuses).forEach((key) => {
    finalValues[key] = (finalValues[key] || 0) + bonuses[key];
  });

  return finalValues;
}

function updateRaceBonusLog() {
  const race = fields.raca.value;
  const subrace = fields.subraca.value;
  const bonuses = getRaceBonuses();
  const entries = Object.entries(bonuses);

  if (!entries.length) {
    raceBonusLog.textContent = "Bônus raciais aplicados: nenhum.";
    return;
  }

  const raceLabel = subrace ? `${race} / ${subrace}` : race;
  const text = entries.map(([key, value]) => `${attrLabels[key]} +${value}`).join(", ");
  raceBonusLog.textContent = `Bônus raciais aplicados (${raceLabel}): ${text}.`;
}

function updateAttributeModifiers() {
  const finalValues = getFinalAttributes();

  Object.keys(attrLabels).forEach((key) => {
    const modEl = document.getElementById(`mod-${key}`) || document.getElementById(`mod_${key}`);
    if (!modEl) return;
    modEl.textContent = formatModifier(calculateModifier(finalValues[key]));
  });
}


// ============================================================
// Regras automáticas
// ============================================================
function calculateProficiency(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function calculateHitPoints() {
  const level = Number(fields.nivel.value || 1);
  const className = fields.classe.value;
  const hitDie = classHitDice[className] || 8;
  const conMod = calculateModifier(getFinalAttributes().constituicao);

  const averagePerLevel = Math.floor(hitDie / 2) + 1;
  let total = hitDie + conMod;

  if (level > 1) {
    total += (averagePerLevel + conMod) * (level - 1);
  }

  return Math.max(total, 1);
}

function calculateArmorClass() {
  return 10 + calculateModifier(getFinalAttributes().destreza);
}

function calculateInitiative() {
  return calculateModifier(getFinalAttributes().destreza);
}

function calculatePassivePerception() {
  return 10 + calculateModifier(getFinalAttributes().sabedoria);
}

function calculateHitDiceText() {
  const level = Number(fields.nivel.value || 1);
  const className = fields.classe.value;
  const die = classHitDice[className] || 8;
  return `${level}d${die}`;
}

function updateAutomaticCombatFields() {
  const level = Number(fields.nivel.value || 1);
  const proficiency = calculateProficiency(level);
  const hp = calculateHitPoints();
  const ac = calculateArmorClass();
  const initiative = calculateInitiative();
  const passive = calculatePassivePerception();

  fields.proficiencia.value = proficiency;
  fields.vida_max.value = hp;

  // Só atualiza vida atual automaticamente quando estiver vazia
  if (!fields.vida_atual.value || Number(fields.vida_atual.value) <= 0) {
    fields.vida_atual.value = hp;
  }

  fields.ca.value = ac;
  fields.iniciativa.value = initiative;
  fields.dados_vida.value = calculateHitDiceText();
  fields.sabedoria_passiva.value = passive;
}


// ============================================================
// Magia automática básica
// ============================================================
function updateSpellFieldsAutomatically() {
  const className = fields.classe.value;
  const level = Number(fields.nivel.value || 1);
  const abilityKey = spellcastingAbility[className];

  if (!abilityKey) {
    fields.classe_conjuradora.value = "";
    fields.habilidade_chave_magia.value = "";
    fields.cd_magia.value = "";
    fields.bonus_ataque_magia.value = "";
    return;
  }

  const proficiency = calculateProficiency(level);
  const abilityMod = calculateModifier(getFinalAttributes()[abilityKey]);

  fields.classe_conjuradora.value = className;
  fields.habilidade_chave_magia.value = attrLabels[abilityKey];
  fields.cd_magia.value = 8 + proficiency + abilityMod;
  fields.bonus_ataque_magia.value = proficiency + abilityMod;
}


// ============================================================
// Preview principal
// ============================================================
function updatePreview() {
  updateAttributeModifiers();
  updateRaceBonusLog();
  updateAutomaticCombatFields();
  updateSpellFieldsAutomatically();

  previewVida.textContent = fields.vida_max.value || "10";
  previewCA.textContent = fields.ca.value || "10";
  previewProficiencia.textContent = `+${fields.proficiencia.value || "2"}`;
  previewIniciativa.textContent = formatModifier(Number(fields.iniciativa.value || 0));
  previewPassiva.textContent = fields.sabedoria_passiva.value || "10";

  updateSheetPreview();
}


// ============================================================
// Rolagens 4d6
// ============================================================
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function roll4d6DropLowest() {
  const rolls = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
  const sorted = [...rolls].sort((a, b) => b - a);
  const used = sorted.slice(0, 3);
  const total = used.reduce((sum, value) => sum + value, 0);
  return { rolls, used, total };
}

function rollSingleAttribute(attrKey) {
  const result = roll4d6DropLowest();
  fields[attrKey].value = result.total;
  diceLog.textContent = `${attrLabels[attrKey]}: [${result.rolls.join(", ")}] → maiores [${result.used.join(", ")}] → total ${result.total}`;
  updatePreview();
}

function rollAllAttributes() {
  const logs = [];

  Object.keys(attrLabels).forEach((key) => {
    const result = roll4d6DropLowest();
    fields[key].value = result.total;
    logs.push(`${attrLabels[key]}: [${result.rolls.join(", ")}] → [${result.used.join(", ")}] = ${result.total}`);
  });

  diceLog.textContent = logs.join("\n");
  updatePreview();
}


// ============================================================
// Ficha final à direita
// ============================================================
function updateSheetPreview() {
  const finalAttrs = getFinalAttributes();

  sheetIdentificacao.textContent =
    `Nome: ${fields.nome.value || "—"}\n` +
    `Jogador: ${fields.nome_jogador.value || "—"}\n` +
    `Classe/Nível: ${fields.classe.value || "—"} ${fields.nivel.value || "—"}\n` +
    `Raça: ${fields.raca.value || "—"}${fields.subraca.value ? " / " + fields.subraca.value : ""}\n` +
    `Antecedente: ${fields.antecedente.value || "—"}\n` +
    `Tendência: ${fields.tendencia.value || "—"}\n` +
    `XP: ${fields.xp.value || "0"}`;

  sheetCombate.textContent =
    `PV Máx.: ${fields.vida_max.value || "—"}\n` +
    `PV Atuais: ${fields.vida_atual.value || "—"}\n` +
    `PV Temp.: ${fields.vida_temp.value || "—"}\n` +
    `CA: ${fields.ca.value || "—"}\n` +
    `Iniciativa: ${formatModifier(Number(fields.iniciativa.value || 0))}\n` +
    `Deslocamento: ${fields.deslocamento.value || "—"}\n` +
    `Proficiência: +${fields.proficiencia.value || "—"}\n` +
    `Dados de Vida: ${fields.dados_vida.value || "—"}\n` +
    `Passiva: ${fields.sabedoria_passiva.value || "—"}`;

  sheetAtributos.textContent =
    `Força: ${finalAttrs.forca} (${formatModifier(calculateModifier(finalAttrs.forca))})\n` +
    `Destreza: ${finalAttrs.destreza} (${formatModifier(calculateModifier(finalAttrs.destreza))})\n` +
    `Constituição: ${finalAttrs.constituicao} (${formatModifier(calculateModifier(finalAttrs.constituicao))})\n` +
    `Inteligência: ${finalAttrs.inteligencia} (${formatModifier(calculateModifier(finalAttrs.inteligencia))})\n` +
    `Sabedoria: ${finalAttrs.sabedoria} (${formatModifier(calculateModifier(finalAttrs.sabedoria))})\n` +
    `Carisma: ${finalAttrs.carisma} (${formatModifier(calculateModifier(finalAttrs.carisma))})`;

  sheetPericias.textContent =
    `Testes de Resistência:\n${fields.testes_resistencia.value || "—"}\n\n` +
    `Perícias:\n${fields.pericias.value || "—"}`;

  sheetAtaques.textContent = fields.ataques.value || "—";

  sheetEquipamentos.textContent =
    `Equipamentos:\n${fields.equipamentos.value || "—"}\n\n` +
    `Idiomas e Proficiências:\n${fields.idiomas_proficiencias.value || "—"}`;

  sheetCaracteristicas.textContent = fields.caracteristicas_habilidades.value || "—";

  sheetTracos.textContent =
    `Traços:\n${fields.tracos_personalidade.value || "—"}\n\n` +
    `Ideais:\n${fields.ideais.value || "—"}\n\n` +
    `Ligações:\n${fields.ligacoes.value || "—"}\n\n` +
    `Defeitos:\n${fields.defeitos.value || "—"}`;

  sheetMagias.textContent =
    `Classe Conjuradora: ${fields.classe_conjuradora.value || "—"}\n` +
    `Habilidade-chave: ${fields.habilidade_chave_magia.value || "—"}\n` +
    `CD: ${fields.cd_magia.value || "—"}\n` +
    `Ataque mágico: ${fields.bonus_ataque_magia.value !== "" ? formatModifier(Number(fields.bonus_ataque_magia.value)) : "—"}\n\n` +
    `Truques:\n${fields.truques.value || "—"}\n\n` +
    `1º nível:\n${fields.magias_nivel_1.value || "—"}\n\n` +
    `2º nível:\n${fields.magias_nivel_2.value || "—"}\n\n` +
    `3º nível:\n${fields.magias_nivel_3.value || "—"}\n\n` +
    `4º nível:\n${fields.magias_nivel_4.value || "—"}\n\n` +
    `5º nível:\n${fields.magias_nivel_5.value || "—"}\n\n` +
    `Espaços: 1º ${fields.espacos_nivel_1_usados.value || 0}/${fields.espacos_nivel_1_total.value || 0} | ` +
    `2º ${fields.espacos_nivel_2_usados.value || 0}/${fields.espacos_nivel_2_total.value || 0} | ` +
    `3º ${fields.espacos_nivel_3_usados.value || 0}/${fields.espacos_nivel_3_total.value || 0}`;

  sheetHistoria.textContent =
    `História:\n${fields.historia.value || "—"}\n\n` +
    `Aparência:\n${fields.aparencia.value || "—"}\n\n` +
    `Aliados/Organizações:\n${fields.aliados_organizacoes.value || "—"}\n\n` +
    `Tesouro:\n${fields.tesouro.value || "—"}`;
}

function printSheet() {
  updateSheetPreview();
  window.print();
}


// ============================================================
// Formulário
// ============================================================
function clearForm() {
  fields.id.value = "";

  fields.nome.value = "";
  fields.nome_jogador.value = "";
  fields.classe.value = "Guerreiro";
  fields.nivel.value = 1;
  fields.raca.value = "Humano";
  populateSubraceOptions();
  fields.subraca.value = "";
  fields.antecedente.value = "";
  fields.tendencia.value = "";
  fields.xp.value = 0;
  fields.inspiracao.value = "Não";

  fields.idade.value = "";
  fields.altura.value = "";
  fields.peso.value = "";
  fields.olhos.value = "";
  fields.pele.value = "";
  fields.cabelos.value = "";

  fields.forca.value = 10;
  fields.destreza.value = 10;
  fields.constituicao.value = 10;
  fields.inteligencia.value = 10;
  fields.sabedoria.value = 10;
  fields.carisma.value = 10;

  fields.vida_max.value = 10;
  fields.vida_atual.value = 10;
  fields.vida_temp.value = 0;
  fields.ca.value = 10;
  fields.iniciativa.value = 0;
  fields.deslocamento.value = "9 m";
  fields.proficiencia.value = 2;
  fields.dados_vida.value = "";
  fields.sabedoria_passiva.value = 10;

  fields.testes_resistencia.value = "";
  fields.pericias.value = "";

  fields.ataques.value = "";
  fields.equipamentos.value = "";
  fields.caracteristicas_habilidades.value = "";
  fields.idiomas_proficiencias.value = "";

  fields.tracos_personalidade.value = "";
  fields.ideais.value = "";
  fields.ligacoes.value = "";
  fields.defeitos.value = "";

  fields.historia.value = "";
  fields.aparencia.value = "";
  fields.aliados_organizacoes.value = "";
  fields.tesouro.value = "";

  fields.classe_conjuradora.value = "";
  fields.habilidade_chave_magia.value = "";
  fields.cd_magia.value = "";
  fields.bonus_ataque_magia.value = "";
  fields.truques.value = "";
  fields.magias_nivel_1.value = "";
  fields.magias_nivel_2.value = "";
  fields.magias_nivel_3.value = "";
  fields.magias_nivel_4.value = "";
  fields.magias_nivel_5.value = "";

  fields.espacos_nivel_1_total.value = 0;
  fields.espacos_nivel_1_usados.value = 0;
  fields.espacos_nivel_2_total.value = 0;
  fields.espacos_nivel_2_usados.value = 0;
  fields.espacos_nivel_3_total.value = 0;
  fields.espacos_nivel_3_usados.value = 0;

  diceLog.textContent = "As rolagens dos atributos aparecerão aqui.";
  updatePreview();
}

function fillForm(character) {
  fields.id.value = character.id ?? "";

  fields.nome.value = character.nome ?? "";
  fields.nome_jogador.value = character.nome_jogador ?? "";
  fields.classe.value = character.classe ?? "Guerreiro";
  fields.nivel.value = character.nivel ?? 1;
  fields.raca.value = character.raca ?? "Humano";
  populateSubraceOptions();
  fields.subraca.value = character.subraca ?? "";
  fields.antecedente.value = character.antecedente ?? "";
  fields.tendencia.value = character.tendencia ?? "";
  fields.xp.value = character.xp ?? 0;
  fields.inspiracao.value = character.inspiracao ?? "Não";

  fields.idade.value = character.idade ?? "";
  fields.altura.value = character.altura ?? "";
  fields.peso.value = character.peso ?? "";
  fields.olhos.value = character.olhos ?? "";
  fields.pele.value = character.pele ?? "";
  fields.cabelos.value = character.cabelos ?? "";

  fields.forca.value = character.forca ?? 10;
  fields.destreza.value = character.destreza ?? 10;
  fields.constituicao.value = character.constituicao ?? 10;
  fields.inteligencia.value = character.inteligencia ?? 10;
  fields.sabedoria.value = character.sabedoria ?? 10;
  fields.carisma.value = character.carisma ?? 10;

  fields.vida_max.value = character.vida_max ?? 10;
  fields.vida_atual.value = character.vida_atual ?? 10;
  fields.vida_temp.value = character.vida_temp ?? 0;
  fields.ca.value = character.ca ?? 10;
  fields.iniciativa.value = character.iniciativa ?? 0;
  fields.deslocamento.value = character.deslocamento ?? "9 m";
  fields.proficiencia.value = character.proficiencia ?? 2;
  fields.dados_vida.value = character.dados_vida ?? "";
  fields.sabedoria_passiva.value = character.sabedoria_passiva ?? 10;

  fields.testes_resistencia.value = character.testes_resistencia ?? "";
  fields.pericias.value = character.pericias ?? "";

  fields.ataques.value = character.ataques ?? "";
  fields.equipamentos.value = character.equipamentos ?? "";
  fields.caracteristicas_habilidades.value = character.caracteristicas_habilidades ?? "";
  fields.idiomas_proficiencias.value = character.idiomas_proficiencias ?? "";

  fields.tracos_personalidade.value = character.tracos_personalidade ?? "";
  fields.ideais.value = character.ideais ?? "";
  fields.ligacoes.value = character.ligacoes ?? "";
  fields.defeitos.value = character.defeitos ?? "";

  fields.historia.value = character.historia ?? "";
  fields.aparencia.value = character.aparencia ?? "";
  fields.aliados_organizacoes.value = character.aliados_organizacoes ?? "";
  fields.tesouro.value = character.tesouro ?? "";

  fields.classe_conjuradora.value = character.classe_conjuradora ?? "";
  fields.habilidade_chave_magia.value = character.habilidade_chave_magia ?? "";
  fields.cd_magia.value = character.cd_magia ?? "";
  fields.bonus_ataque_magia.value = character.bonus_ataque_magia ?? "";
  fields.truques.value = character.truques ?? "";
  fields.magias_nivel_1.value = character.magias_nivel_1 ?? "";
  fields.magias_nivel_2.value = character.magias_nivel_2 ?? "";
  fields.magias_nivel_3.value = character.magias_nivel_3 ?? "";
  fields.magias_nivel_4.value = character.magias_nivel_4 ?? "";
  fields.magias_nivel_5.value = character.magias_nivel_5 ?? "";

  fields.espacos_nivel_1_total.value = character.espacos_nivel_1_total ?? 0;
  fields.espacos_nivel_1_usados.value = character.espacos_nivel_1_usados ?? 0;
  fields.espacos_nivel_2_total.value = character.espacos_nivel_2_total ?? 0;
  fields.espacos_nivel_2_usados.value = character.espacos_nivel_2_usados ?? 0;
  fields.espacos_nivel_3_total.value = character.espacos_nivel_3_total ?? 0;
  fields.espacos_nivel_3_usados.value = character.espacos_nivel_3_usados ?? 0;

  updatePreview();
}

function collectFormData() {
  const finalAttrs = getFinalAttributes();

  return {
    nome: fields.nome.value.trim(),
    nome_jogador: fields.nome_jogador.value.trim(),
    classe: fields.classe.value.trim(),
    nivel: Number(fields.nivel.value || 1),
    raca: fields.raca.value.trim(),
    subraca: fields.subraca.value.trim(),
    antecedente: fields.antecedente.value.trim(),
    tendencia: fields.tendencia.value.trim(),
    xp: Number(fields.xp.value || 0),
    inspiracao: fields.inspiracao.value,

    idade: fields.idade.value.trim(),
    altura: fields.altura.value.trim(),
    peso: fields.peso.value.trim(),
    olhos: fields.olhos.value.trim(),
    pele: fields.pele.value.trim(),
    cabelos: fields.cabelos.value.trim(),

    forca: Number(fields.forca.value || 10),
    destreza: Number(fields.destreza.value || 10),
    constituicao: Number(fields.constituicao.value || 10),
    inteligencia: Number(fields.inteligencia.value || 10),
    sabedoria: Number(fields.sabedoria.value || 10),
    carisma: Number(fields.carisma.value || 10),

    forca_final: finalAttrs.forca,
    destreza_final: finalAttrs.destreza,
    constituicao_final: finalAttrs.constituicao,
    inteligencia_final: finalAttrs.inteligencia,
    sabedoria_final: finalAttrs.sabedoria,
    carisma_final: finalAttrs.carisma,

    vida_max: Number(fields.vida_max.value || 10),
    vida_atual: Number(fields.vida_atual.value || 10),
    vida_temp: Number(fields.vida_temp.value || 0),
    ca: Number(fields.ca.value || 10),
    iniciativa: Number(fields.iniciativa.value || 0),
    deslocamento: fields.deslocamento.value.trim(),
    proficiencia: Number(fields.proficiencia.value || 2),
    dados_vida: fields.dados_vida.value.trim(),
    sabedoria_passiva: Number(fields.sabedoria_passiva.value || 10),

    testes_resistencia: fields.testes_resistencia.value.trim(),
    pericias: fields.pericias.value.trim(),

    ataques: fields.ataques.value.trim(),
    equipamentos: fields.equipamentos.value.trim(),
    caracteristicas_habilidades: fields.caracteristicas_habilidades.value.trim(),
    idiomas_proficiencias: fields.idiomas_proficiencias.value.trim(),

    tracos_personalidade: fields.tracos_personalidade.value.trim(),
    ideais: fields.ideais.value.trim(),
    ligacoes: fields.ligacoes.value.trim(),
    defeitos: fields.defeitos.value.trim(),

    historia: fields.historia.value.trim(),
    aparencia: fields.aparencia.value.trim(),
    aliados_organizacoes: fields.aliados_organizacoes.value.trim(),
    tesouro: fields.tesouro.value.trim(),

    classe_conjuradora: fields.classe_conjuradora.value.trim(),
    habilidade_chave_magia: fields.habilidade_chave_magia.value.trim(),
    cd_magia: fields.cd_magia.value === "" ? null : Number(fields.cd_magia.value),
    bonus_ataque_magia: fields.bonus_ataque_magia.value === "" ? null : Number(fields.bonus_ataque_magia.value),

    truques: fields.truques.value.trim(),
    magias_nivel_1: fields.magias_nivel_1.value.trim(),
    magias_nivel_2: fields.magias_nivel_2.value.trim(),
    magias_nivel_3: fields.magias_nivel_3.value.trim(),
    magias_nivel_4: fields.magias_nivel_4.value.trim(),
    magias_nivel_5: fields.magias_nivel_5.value.trim(),

    espacos_nivel_1_total: Number(fields.espacos_nivel_1_total.value || 0),
    espacos_nivel_1_usados: Number(fields.espacos_nivel_1_usados.value || 0),
    espacos_nivel_2_total: Number(fields.espacos_nivel_2_total.value || 0),
    espacos_nivel_2_usados: Number(fields.espacos_nivel_2_usados.value || 0),
    espacos_nivel_3_total: Number(fields.espacos_nivel_3_total.value || 0),
    espacos_nivel_3_usados: Number(fields.espacos_nivel_3_usados.value || 0),
  };
}


// ============================================================
// Comunicação com backend
// ============================================================
async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Resposta inválida do servidor.");
  }

  if (!response.ok) {
    throw new Error(data.msg || "Erro na requisição.");
  }

  return data;
}

async function loadCharacters() {
  setFeedback("Carregando personagens...");

  try {
    const characters = await fetchJSON("/personagens");
    renderCharacters(characters);

    if (characters.length === 0) {
      setFeedback("Nenhum personagem salvo ainda.");
    } else {
      setFeedback("Lista carregada com sucesso.");
    }
  } catch (error) {
    setFeedback(error.message, true);
  }
}

function renderCharacters(characters) {
  listEl.innerHTML = "";

  if (!characters.length) {
    listEl.innerHTML = `<div class="empty">Nenhum personagem salvo ainda.</div>`;
    return;
  }

  characters.forEach((character) => {
    const card = document.createElement("div");
    card.className = "character-card";

    card.innerHTML = `
      <h3>${character.nome || "Sem nome"}</h3>
      <p><strong>Classe:</strong> ${character.classe || "—"} ${character.nivel || "—"}</p>
      <p><strong>Raça:</strong> ${character.raca || "—"}${character.subraca ? " / " + character.subraca : ""}</p>
      <p><strong>PV:</strong> ${character.vida_max || "—"} | <strong>CA:</strong> ${character.ca || "—"} | <strong>Proficiência:</strong> +${character.proficiencia || 2}</p>

      <div class="card-actions">
        <button type="button" class="btn-secondary btn-load">Carregar</button>
        <button type="button" class="btn-danger btn-delete">Excluir</button>
      </div>
    `;

    const loadBtn = card.querySelector(".btn-load");
    const deleteBtn = card.querySelector(".btn-delete");

    loadBtn.addEventListener("click", () => {
      fillForm(character);
      setFeedback(`Personagem carregado: ${character.nome}`);
    });

    deleteBtn.addEventListener("click", async () => {
      const confirmed = window.confirm(`Deseja excluir o personagem "${character.nome}"?`);
      if (!confirmed) return;

      try {
        await fetchJSON(`/personagens/${character.id}`, { method: "DELETE" });

        if (String(fields.id.value) === String(character.id)) {
          clearForm();
        }

        await loadCharacters();
        setFeedback(`Personagem excluído: ${character.nome}`);
      } catch (error) {
        setFeedback(error.message, true);
      }
    });

    listEl.appendChild(card);
  });
}


// ============================================================
// Eventos
// ============================================================
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = collectFormData();

  if (!payload.nome || !payload.classe || !payload.raca) {
    setFeedback("Preencha nome, classe e raça.", true);
    return;
  }

  const editingId = fields.id.value;

  try {
    if (editingId) {
      await fetchJSON(`/personagens/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setFeedback("Personagem atualizado com sucesso.");
    } else {
      await fetchJSON("/personagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setFeedback("Personagem salvo com sucesso.");
    }

    clearForm();
    await loadCharacters();
  } catch (error) {
    setFeedback(error.message, true);
  }
});

document.getElementById("btn-refresh").addEventListener("click", loadCharacters);

document.getElementById("btn-reset").addEventListener("click", () => {
  clearForm();
  setFeedback("Formulário limpo.");
});

document.getElementById("btn-reset-top").addEventListener("click", () => {
  clearForm();
  setFeedback("Formulário limpo.");
});

document.getElementById("btn-roll-all").addEventListener("click", () => {
  rollAllAttributes();
  setFeedback("Todos os atributos foram rolados.");
});

document.getElementById("btn-load-sheet").addEventListener("click", () => {
  updateSheetPreview();
  setFeedback("Ficha final atualizada.");
});

document.getElementById("btn-print").addEventListener("click", () => {
  printSheet();
});

document.querySelectorAll(".roll-attr").forEach((button) => {
  button.addEventListener("click", () => {
    rollSingleAttribute(button.dataset.attr);
    setFeedback(`Atributo rolado: ${attrLabels[button.dataset.attr]}.`);
  });
});

fields.raca.addEventListener("change", () => {
  populateSubraceOptions();
  updatePreview();
});

fields.subraca.addEventListener("change", updatePreview);
fields.classe.addEventListener("change", updatePreview);
fields.nivel.addEventListener("input", updatePreview);

// Atualiza preview quando qualquer campo mudar
Object.values(fields).forEach((field) => {
  if (!field) return;
  field.addEventListener("input", updatePreview);
});


// ============================================================
// Inicialização
// ============================================================
populateClassOptions();
populateRaceOptions();
populateSubraceOptions();
clearForm();
loadCharacters();