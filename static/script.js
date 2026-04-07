// ============================================================
// script.js
// Grimório do Jogador
// ------------------------------------------------------------
// Front-end principal do site:
// - navegação entre páginas
// - dashboard de personagens salvos
// - editor de personagem
// - rolagem 4d6
// - cálculo automático de PV, CA e proficiência
// - sistema de magias com limites por classe e nível
// ============================================================

// ------------------------------------------------------------
// Referências principais
// ------------------------------------------------------------
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const feedbackEl = document.getElementById('feedback');
const dashboardFeedbackEl = document.getElementById('dashboard-feedback');

const form = document.getElementById('character-form');

const fields = {
  id: document.getElementById('character-id'),
  nome: document.getElementById('nome'),
  nome_jogador: document.getElementById('nome_jogador'),
  classe: document.getElementById('classe'),
  nivel: document.getElementById('nivel'),
  raca: document.getElementById('raca'),
  subraca: document.getElementById('subraca'),
  alinhamento: document.getElementById('alinhamento'),
  antecedente: document.getElementById('antecedente'),
  xp: document.getElementById('xp'),

  forca: document.getElementById('forca'),
  destreza: document.getElementById('destreza'),
  constituicao: document.getElementById('constituicao'),
  inteligencia: document.getElementById('inteligencia'),
  sabedoria: document.getElementById('sabedoria'),
  carisma: document.getElementById('carisma'),

  vida_max: document.getElementById('vida_max'),
  vida_atual: document.getElementById('vida_atual'),
  vida_temp: document.getElementById('vida_temp'),
  ca: document.getElementById('ca'),
  iniciativa: document.getElementById('iniciativa'),
  deslocamento: document.getElementById('deslocamento'),
  proficiencia: document.getElementById('proficiencia'),
  dados_vida: document.getElementById('dados_vida'),
  sabedoria_passiva: document.getElementById('sabedoria_passiva'),

  tracos_personalidade: document.getElementById('tracos_personalidade'),
  ideais: document.getElementById('ideais'),
  ligacoes: document.getElementById('ligacoes'),
  defeitos: document.getElementById('defeitos'),
  testes_resistencia: document.getElementById('testes_resistencia'),
  pericias: document.getElementById('pericias'),
  ataques: document.getElementById('ataques'),
  equipamentos: document.getElementById('equipamentos'),
  caracteristicas_habilidades: document.getElementById('caracteristicas_habilidades'),
  idiomas_proficiencias: document.getElementById('idiomas_proficiencias'),
  historia: document.getElementById('historia'),

  selected_spells_text: document.getElementById('selected_spells_text')
};

const homeTotalEl = document.getElementById('home-total');
const homeAverageEl = document.getElementById('home-average');
const homeTopClassEl = document.getElementById('home-top-class');
const homeTopRaceEl = document.getElementById('home-top-race');

const dashTotalEl = document.getElementById('dash-total');
const dashAverageEl = document.getElementById('dash-average');
const dashTopClassEl = document.getElementById('dash-top-class');
const dashTopRaceEl = document.getElementById('dash-top-race');
const dashboardListEl = document.getElementById('dashboard-list');
const dashboardSummaryEl = document.getElementById('dashboard-summary');
const dashboardSearchEl = document.getElementById('dashboard-search');
const dashboardClassFilterEl = document.getElementById('dashboard-class-filter');
const dashboardRaceFilterEl = document.getElementById('dashboard-race-filter');

const previewVidaEl = document.getElementById('preview-vida');
const previewCaEl = document.getElementById('preview-ca');
const previewProfEl = document.getElementById('preview-proficiencia');
const previewPassivaEl = document.getElementById('preview-passiva');
const diceLogEl = document.getElementById('dice-log');
const raceBonusLogEl = document.getElementById('race-bonus-log');

const spellRulesInfoEl = document.getElementById('spell-rules-info');
const spellSelectionInfoEl = document.getElementById('spell-selection-info');
const spellSlotsInfoEl = document.getElementById('spell-slots-info');
const spellSelectorEl = document.getElementById('spell-selector');

const sheetNameEl = document.getElementById('sheet-name');
const sheetSubtitleEl = document.getElementById('sheet-subtitle');
const sheetMeta1El = document.getElementById('sheet-meta-1');
const sheetMeta2El = document.getElementById('sheet-meta-2');
const sheetMeta3El = document.getElementById('sheet-meta-3');
const sheetMeta4El = document.getElementById('sheet-meta-4');
const sheetMeta5El = document.getElementById('sheet-meta-5');
const sheetMeta6El = document.getElementById('sheet-meta-6');
const sheetAttributesGridEl = document.getElementById('sheet-attributes-grid');
const sheetSpellsEl = document.getElementById('sheet-spells');
const sheetHistoryEl = document.getElementById('sheet-history');

// ------------------------------------------------------------
// Estado simples da aplicação
// ------------------------------------------------------------
let allCharacters = [];
let currentSpellSelection = [];

// ------------------------------------------------------------
// Catálogos de dados
// ------------------------------------------------------------
const ALIGNMENTS = [
  'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
  'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
  'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
];

const CLASS_OPTIONS = ['Bárbaro','Bardo','Bruxo','Clérigo','Druida','Feiticeiro','Guerreiro','Ladino','Mago','Monge','Paladino','Patrulheiro'];
const RACE_OPTIONS = ['Humano','Anão','Elfo','Halfling','Draconato','Gnomo','Meio-Elfo','Meio-Orc','Tiefling'];

const SUBRACE_OPTIONS = {
  'Humano': [],
  'Anão': ['Anão da Colina','Anão da Montanha'],
  'Elfo': ['Alto Elfo','Elfo da Floresta','Drow'],
  'Halfling': ['Pés Leves','Robusto'],
  'Draconato': [],
  'Gnomo': ['Gnomo da Floresta','Gnomo das Rochas'],
  'Meio-Elfo': [],
  'Meio-Orc': [],
  'Tiefling': ['Legado Infernal']
};

const ATTR_LABELS = {
  forca: 'Força',
  destreza: 'Destreza',
  constituicao: 'Constituição',
  inteligencia: 'Inteligência',
  sabedoria: 'Sabedoria',
  carisma: 'Carisma'
};

const CLASS_HIT_DICE = { 'Bárbaro':12, 'Bardo':8, 'Bruxo':8, 'Clérigo':8, 'Druida':8, 'Feiticeiro':6, 'Guerreiro':10, 'Ladino':8, 'Mago':6, 'Monge':8, 'Paladino':10, 'Patrulheiro':10 };

const RACE_BASE_BONUSES = {
  'Humano': { forca:1, destreza:1, constituicao:1, inteligencia:1, sabedoria:1, carisma:1 },
  'Anão': { constituicao:2 }, 'Elfo': { destreza:2 }, 'Halfling': { destreza:2 },
  'Draconato': { forca:2, carisma:1 }, 'Gnomo': { inteligencia:2 }, 'Meio-Elfo': { carisma:2 },
  'Meio-Orc': { forca:2, constituicao:1 }, 'Tiefling': { inteligencia:1, carisma:2 }
};

const SUBRACE_BONUSES = {
  'Anão da Colina': { sabedoria:1 }, 'Anão da Montanha': { forca:2 }, 'Alto Elfo': { inteligencia:1 },
  'Elfo da Floresta': { sabedoria:1 }, 'Drow': { carisma:1 }, 'Pés Leves': { carisma:1 },
  'Robusto': { constituicao:1 }, 'Gnomo da Floresta': { destreza:1 }, 'Gnomo das Rochas': { constituicao:1 },
  'Legado Infernal': {}
};

const SPELL_DAMAGE_DETAILS = {
  'Raio de Fogo': '1d10 fogo',
  'Raio de Gelo': '1d8 frio',
  'Toque Chocante': '1d8 elétrico',
  'Rajada de Veneno': '1d12 veneno',
  'Chama Sagrada': '1d8 radiante',
  'Chicote de Espinhos': '1d6 perfurante',
  'Produzir Chamas': '1d8 fogo',
  'Rajada Mística': '1d10 energia',
  'Mísseis Mágicos': '3×(1d4+1) energia',
  'Mãos Flamejantes': '3d6 fogo',
  'Raio Adoecente': '2d8 veneno',
  'Orbe Cromática': '3d8 elemental',
  'Raio Ardente': '3×2d6 fogo',
  'Despedaçar': '3d8 trovejante',
  'Onda Trovejante': '2d8 trovejante',
  'Esfera Flamejante': '2d6 fogo',
  'Lâmina Flamejante': '3d6 fogo',
  'Raio Lunar': '2d10 radiante',
  'Bola de Fogo': '8d6 fogo',
  'Relâmpago': '8d6 elétrico',
  'Tempestade de Gelo': '2d8 concussão + 4d6 frio',
  'Muralha de Fogo': '5d8 fogo',
  'Cone de Frio': '8d8 frio',
  'Golpe Flamejante': '4d6 fogo + 4d6 radiante',
  'Praga': '8d8 necrótico',
  'Corrente de Relâmpagos': '10d8 elétrico',
  'Desintegrar': '10d6 + 40 força',
  'Dedo da Morte': '7d8 + 30 necrótico',
  'Explosão Solar': '12d6 radiante',
  'Repreensão Infernal': '2d10 fogo',
  'Marca do Caçador': '+1d6 por ataque',
  'Golpe Trovejante': '2d6 trovejante',
  'Cordão de Flechas': '1d6 perfurante',
  'Golpe do Vento': '6d10 força'
};

// Observação honesta:
// Este banco de magias foi montado a partir dos dados que você já tinha no código
// e dos trechos do Livro do Jogador enviados na conversa. Ele cobre um catálogo grande
// e funcional para o site, com níveis, limites e vários danos famosos, mas não é uma
// transcrição completa de todas as descrições do livro.
const SPELL_SLOTS_BY_CLASS = {
  full: {1:[2],2:[3],3:[4,2],4:[4,3],5:[4,3,2],6:[4,3,3],7:[4,3,3,1],8:[4,3,3,2],9:[4,3,3,3,1],10:[4,3,3,3,2],11:[4,3,3,3,2,1],12:[4,3,3,3,2,1],13:[4,3,3,3,2,1,1],14:[4,3,3,3,2,1,1],15:[4,3,3,3,2,1,1,1],16:[4,3,3,3,2,1,1,1],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1]},
  half: {1:[],2:[2],3:[3],4:[3],5:[4,2],6:[4,2],7:[4,3],8:[4,3],9:[4,3,2],10:[4,3,2],11:[4,3,3],12:[4,3,3],13:[4,3,3,1],14:[4,3,3,1],15:[4,3,3,2],16:[4,3,3,2],17:[4,3,3,3,1],18:[4,3,3,3,1],19:[4,3,3,3,2],20:[4,3,3,3,2]},
  warlock: {1:{level:1,slots:1},2:{level:1,slots:2},3:{level:2,slots:2},4:{level:2,slots:2},5:{level:3,slots:2},6:{level:3,slots:2},7:{level:4,slots:2},8:{level:4,slots:2},9:{level:5,slots:2},10:{level:5,slots:2},11:{level:5,slots:3},12:{level:5,slots:3},13:{level:5,slots:3},14:{level:5,slots:3},15:{level:5,slots:3},16:{level:5,slots:3},17:{level:5,slots:4},18:{level:5,slots:4},19:{level:5,slots:4},20:{level:5,slots:4}}
};

const SPELL_DATA = {
  Mago: { ability: 'inteligencia', mode: 'prepared', cantripsByLevel: {1:3,4:4,10:5}, maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9}, spells: { 0:['Luz','Mãos Mágicas','Prestidigitação','Raio de Gelo','Ilusão Menor','Toque Chocante','Raio de Fogo','Mensagem','Consertar'], 1:['Armadura Arcana','Mísseis Mágicos','Escudo','Sono','Identificar','Detectar Magia','Compreender Idiomas','Disfarçar-se','Queda Suave','Enfeitiçar Pessoa','Névoa Obscurecente','Servo Invisível','Encontrar Familiar','Raio Adoecente','Mãos Flamejantes'], 2:['Passo Nebuloso','Imagem Espelhada','Invisibilidade','Raio Ardente','Tranca Arcana','Levitação','Visão no Escuro','Nublar','Despedaçar','Sugestão','Teia','Imobilizar Pessoa','Alterar-se'], 3:['Bola de Fogo','Contra Mágica','Voo','Relâmpago','Velocidade','Imagem Maior','Respirar na Água','Forma Gasosa','Padrão Hipnótico','Lentidão'], 4:['Muralha de Fogo','Invisibilidade Maior','Tempestade de Gelo','Polimorfia','Porta Dimensional','Olho Arcano','Banimento'], 5:['Cone de Frio','Telecinese','Muralha de Força','Dominar Pessoa','Círculo de Teleporte','Imobilizar Monstro'], 6:['Desintegrar','Globo de Invulnerabilidade','Corrente de Relâmpagos'], 7:['Simulacro','Dedo da Morte','Teletransporte'], 8:['Palavra de Poder Atordoar','Dominar Monstro'], 9:['Parar o Tempo','Desejo'] } },
  'Clérigo': { ability: 'sabedoria', mode: 'prepared', cantripsByLevel: {1:3,4:4,10:5}, maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9}, spells: { 0:['Luz','Chama Sagrada','Taumaturgia','Orientação','Resistência','Poupar os Moribundos'], 1:['Curar Ferimentos','Bênção','Escudo da Fé','Detectar Magia','Palavra Curativa','Comando','Proteção contra o Bem e o Mal','Santuário'], 2:['Arma Espiritual','Silêncio','Restauração Menor','Auxílio','Imobilizar Pessoa','Oração Curativa','Zona da Verdade'], 3:['Revivificar','Palavra Curativa em Massa','Remover Maldição','Luz do Dia','Proteção contra Energia','Enviar Mensagem'], 4:['Guardião da Fé','Liberdade de Movimento','Proteção contra a Morte','Banimento'], 5:['Restauração Maior','Golpe Flamejante','Curar Ferimentos em Massa','Praga'], 6:['Cura Completa','Barreira de Lâminas'], 7:['Ressurreição','Tempestade de Fogo'], 8:['Aura Sagrada'], 9:['Cura Completa em Massa','Ressurreição Verdadeira'] } },
  Druida: { ability: 'sabedoria', mode: 'prepared', cantripsByLevel: {1:2,4:3,10:4}, maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9}, spells: { 0:['Orientação','Chicote de Espinhos','Produzir Chamas','Consertar','Rajada de Veneno'], 1:['Enfeitiçar Animal','Falar com Animais','Curar Ferimentos','Onda Trovejante','Bom Fruto','Névoa Obscurecente','Detectar Magia'], 2:['Esfera Flamejante','Passos sem Pegadas','Pele de Árvore','Lâmina Flamejante','Raio Lunar','Imobilizar Pessoa'], 3:['Conjurar Animais','Relâmpago','Respirar na Água','Crescimento de Plantas','Andar na Água'], 4:['Tempestade de Gelo','Muralha de Fogo','Polimorfia','Pele Rochosa','Dominar Fera'], 5:['Praga de Insetos','Restauração Maior','Comunhão com a Natureza','Muralha de Pedra'], 6:['Mover Terra','Cura Completa'], 7:['Tempestade de Fogo','Deslocamento Planar'], 8:['Explosão Solar'], 9:['Metamorfose Verdadeira','Precognição'] } },
  Bardo: { ability: 'carisma', mode: 'known', cantripsByLevel: {1:2,4:3,10:4}, maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9}, knownByLevel: {1:4,2:5,3:6,4:7,5:8,6:9,7:10,8:11,9:12,10:14,11:15,12:15,13:16,14:18,15:19,16:19,17:20,18:22,19:22,20:22}, spells: { 0:['Zombaria Viciosa','Luz','Mãos Mágicas','Ilusão Menor','Mensagem','Prestidigitação'], 1:['Sussurros Dissonantes','Palavra Curativa','Sono','Compreender Idiomas','Enfeitiçar Pessoa','Curar Ferimentos','Fogo Feérico'], 2:['Invisibilidade','Despedaçar','Imobilizar Pessoa','Nublar','Detectar Pensamentos','Silêncio','Sugestão'], 3:['Padrão Hipnótico','Falar com Mortos','Medo','Enviar Mensagem','Crescimento de Plantas','Dispersar Magia'], 4:['Porta Dimensional','Invisibilidade Maior','Confusão','Polimorfia'], 5:['Restauração Maior','Dominar Pessoa','Imobilizar Monstro','Ressurreição Menor'], 6:['Dança Irresistível de Otto','Visão Verdadeira'], 7:['Palavra de Poder Dor','Teletransporte'], 8:['Palavra de Poder Atordoar'], 9:['Palavra de Poder Matar'] } },
  Feiticeiro: { ability: 'carisma', mode: 'known', cantripsByLevel: {1:4,4:5,10:6}, maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9}, knownByLevel: {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,19:15,20:15}, spells: { 0:['Raio de Fogo','Luz','Prestidigitação','Toque Chocante','Rajada de Veneno','Raio de Gelo','Mensagem'], 1:['Mísseis Mágicos','Escudo','Sono','Mãos Flamejantes','Raio Adoecente','Orbe Cromática','Disfarçar-se'], 2:['Raio Ardente','Invisibilidade','Imagem Espelhada','Passo Nebuloso','Sugestão','Despedaçar'], 3:['Bola de Fogo','Relâmpago','Velocidade','Voo','Contra Mágica'], 4:['Muralha de Fogo','Tempestade de Gelo','Porta Dimensional','Banimento'], 5:['Cone de Frio','Imobilizar Monstro','Telecinese','Dominar Pessoa'], 6:['Desintegrar','Corrente de Relâmpagos'], 7:['Dedo da Morte','Teletransporte'], 8:['Palavra de Poder Atordoar'], 9:['Desejo','Parar o Tempo'] } },
  Bruxo: { ability: 'carisma', mode: 'known', cantripsByLevel: {1:2,4:3,10:4}, maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:5,12:5,13:5,14:5,15:5,16:5,17:5,18:5,19:5,20:5}, knownByLevel: {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:10,11:11,12:11,13:12,14:12,15:13,16:13,17:14,18:14,19:15,20:15}, spells: { 0:['Rajada Mística','Ilusão Menor','Mãos Mágicas','Prestidigitação','Toque Chocante'], 1:['Armadura de Agathys','Enfeitiçar Pessoa','Compreender Idiomas','Repreensão Infernal','Proteção contra o Bem e o Mal'], 2:['Raio Ardente','Invisibilidade','Despedaçar','Sugestão','Imagem Espelhada'], 3:['Padrão Hipnótico','Medo','Voo','Contra Mágica','Dispersar Magia'], 4:['Muralha de Fogo','Porta Dimensional','Banimento','Invisibilidade Maior'], 5:['Segurar Monstro','Dominar Pessoa','Sonho','Telecinese'], 6:['Círculo da Morte','Visão Verdadeira'], 7:['Deslocamento Planar','Dedo da Morte'], 8:['Dominar Monstro'], 9:['Palavra de Poder Matar'] } },
  Paladino: { ability: 'carisma', mode: 'preparedHalf', maxSpellLevelByLevel: {1:0,2:1,3:1,4:1,5:2,6:2,7:2,8:2,9:3,10:3,11:3,12:3,13:4,14:4,15:4,16:4,17:5,18:5,19:5,20:5}, spells: { 1:['Bênção','Comando','Curar Ferimentos','Escudo da Fé','Proteção contra o Bem e o Mal','Golpe Trovejante'], 2:['Restauração Menor','Arma Mágica','Encontrar Montaria','Zona da Verdade','Auxílio'], 3:['Remover Maldição','Luz do Dia','Revivificar','Aura de Vitalidade'], 4:['Banimento','Aura de Vida','Proteção contra a Morte'], 5:['Destruir o Mal','Restauração Maior','Círculo de Poder'] } },
  Patrulheiro: { ability: 'sabedoria', mode: 'known', maxSpellLevelByLevel: {1:0,2:1,3:1,4:1,5:2,6:2,7:2,8:2,9:3,10:3,11:3,12:3,13:4,14:4,15:4,16:4,17:5,18:5,19:5,20:5}, knownByLevel: {1:0,2:2,3:3,4:3,5:4,6:4,7:5,8:5,9:6,10:6,11:7,12:7,13:8,14:8,15:9,16:9,17:10,18:10,19:11,20:11}, spells: { 1:['Marca do Caçador','Falar com Animais','Curar Ferimentos','Passos Longos','Detectar Magia'], 2:['Passos sem Pegadas','Restauração Menor','Silêncio','Cordão de Flechas','Visão no Escuro'], 3:['Conjurar Animais','Luz do Dia','Proteção contra Energia','Andar na Água'], 4:['Liberdade de Movimento','Localizar Criatura','Pele Rochosa'], 5:['Golpe do Vento','Comunhão com a Natureza','Muralha de Pedra'] } }
};

// ------------------------------------------------------------
// Utilidades gerais
// ------------------------------------------------------------
function setFeedback(message, isError = false) {
  feedbackEl.textContent = message;
  feedbackEl.style.color = isError ? '#fca5a5' : '#cbbca8';
}

function setDashboardFeedback(message, isError = false) {
  dashboardFeedbackEl.textContent = message;
  dashboardFeedbackEl.style.color = isError ? '#fca5a5' : '#cbbca8';
}

function safeValue(value, fallback = '—') {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function goToPage(pageName) {
  pages.forEach((page) => page.classList.toggle('active', page.id === `page-${pageName}`));
  navButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.page === pageName));
}

function calculateModifier(value) {
  return Math.floor((Number(value) - 10) / 2);
}

function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function calculateProficiency(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

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

function getBaseAttributes() {
  return {
    forca: Number(fields.forca.value || 10),
    destreza: Number(fields.destreza.value || 10),
    constituicao: Number(fields.constituicao.value || 10),
    inteligencia: Number(fields.inteligencia.value || 10),
    sabedoria: Number(fields.sabedoria.value || 10),
    carisma: Number(fields.carisma.value || 10)
  };
}

function getRaceBonuses() {
  const race = fields.raca.value;
  const subrace = fields.subraca.value;
  const total = { ...(RACE_BASE_BONUSES[race] || {}) };
  const sub = SUBRACE_BONUSES[subrace] || {};
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

function calculateHitPoints() {
  const level = Number(fields.nivel.value || 1);
  const className = fields.classe.value;
  const hitDie = CLASS_HIT_DICE[className] || 8;
  const conMod = calculateModifier(getFinalAttributes().constituicao);
  const averagePerLevel = Math.floor(hitDie / 2) + 1;
  let total = hitDie + conMod;
  if (level > 1) total += (averagePerLevel + conMod) * (level - 1);
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
  return `${level}d${CLASS_HIT_DICE[className] || 8}`;
}

function updateAttributeModifiers() {
  const finalValues = getFinalAttributes();
  Object.keys(ATTR_LABELS).forEach((key) => {
    const modEl = document.getElementById(`mod-${key}`);
    if (modEl) modEl.textContent = formatModifier(calculateModifier(finalValues[key]));
  });
}

function updateRaceBonusLog() {
  const race = fields.raca.value;
  const subrace = fields.subraca.value;
  const bonuses = getRaceBonuses();
  const entries = Object.entries(bonuses);
  if (!entries.length) {
    raceBonusLogEl.textContent = 'Bônus raciais aplicados: nenhum.';
    return;
  }
  const raceLabel = subrace ? `${race} / ${subrace}` : race;
  const text = entries.map(([key, value]) => `${ATTR_LABELS[key]} +${value}`).join(', ');
  raceBonusLogEl.textContent = `Bônus raciais aplicados (${raceLabel}): ${text}.`;
}

function updateAutomaticFields() {
  const level = Number(fields.nivel.value || 1);
  fields.proficiencia.value = calculateProficiency(level);
  fields.vida_max.value = calculateHitPoints();
  if (!fields.vida_atual.value || Number(fields.vida_atual.value) <= 0) fields.vida_atual.value = fields.vida_max.value;
  fields.ca.value = calculateArmorClass();
  fields.iniciativa.value = calculateInitiative();
  fields.dados_vida.value = calculateHitDiceText();
  fields.sabedoria_passiva.value = calculatePassivePerception();
}

// ------------------------------------------------------------
// Sistema de magias
// ------------------------------------------------------------
function getSpellcastingConfig(className) {
  return SPELL_DATA[className] || null;
}

function getCantripsAllowed(className, level) {
  const config = getSpellcastingConfig(className);
  if (!config?.cantripsByLevel) return 0;
  let amount = 0;
  Object.entries(config.cantripsByLevel).forEach(([min, value]) => {
    if (level >= Number(min)) amount = value;
  });
  return amount;
}

function getMaxSpellLevel(className, level) {
  return getSpellcastingConfig(className)?.maxSpellLevelByLevel?.[level] || 0;
}

function getSpellSelectionLimit(className, level) {
  const config = getSpellcastingConfig(className);
  if (!config) return 0;
  const abilityMod = calculateModifier(getFinalAttributes()[config.ability] || 10);
  if (config.mode === 'prepared') return Math.max(level + abilityMod, 1);
  if (config.mode === 'preparedHalf') return Math.max(Math.floor(level / 2) + abilityMod, 1);
  if (config.mode === 'known') return config.knownByLevel?.[level] || 0;
  return 0;
}

function getSpellSlotsData(className, level) {
  const config = getSpellcastingConfig(className);
  if (!config) return [];
  if (className === 'Bruxo') {
    const pact = SPELL_SLOTS_BY_CLASS.warlock[level];
    return pact ? [{ label: `${pact.level}º pacto`, total: pact.slots }] : [];
  }
  if (config.mode === 'preparedHalf' || className === 'Paladino' || className === 'Patrulheiro') {
    return (SPELL_SLOTS_BY_CLASS.half[level] || []).map((total, index) => ({ label: `${index + 1}º círculo`, total }));
  }
  return (SPELL_SLOTS_BY_CLASS.full[level] || []).map((total, index) => ({ label: `${index + 1}º círculo`, total }));
}

function getSelectedSpells() {
  return Array.from(document.querySelectorAll('.spell-checkbox:checked')).map((checkbox) => ({
    name: checkbox.value,
    level: Number(checkbox.dataset.spellLevel),
    source: checkbox.dataset.source || 'class'
  }));
}

function enforceSpellRules() {
  const className = fields.classe.value;
  const level = Number(fields.nivel.value || 1);
  const config = getSpellcastingConfig(className);

  if (!config) {
    fields.selected_spells_text.value = '';
    currentSpellSelection = [];
    return;
  }

  const cantripLimit = getCantripsAllowed(className, level);
  const spellLimit = getSpellSelectionLimit(className, level);
  const selected = getSelectedSpells();
  const selectedCantrips = selected.filter((item) => item.level === 0).length;
  const selectedLeveled = selected.filter((item) => item.level > 0).length;

  document.querySelectorAll('.spell-checkbox').forEach((checkbox) => {
    const spellLevel = Number(checkbox.dataset.spellLevel);
    if (checkbox.checked) {
      checkbox.disabled = false;
      return;
    }
    if (spellLevel === 0) checkbox.disabled = selectedCantrips >= cantripLimit;
    else checkbox.disabled = selectedLeveled >= spellLimit;
  });

  currentSpellSelection = selected;
  const selectedNames = selected.map((item) => item.name);
  fields.selected_spells_text.value = selectedNames.join(', ');

  const modeLabel = config.mode === 'known' ? 'Magias conhecidas' : 'Magias preparadas';
  spellSelectionInfoEl.textContent = selectedNames.length
    ? `Selecionadas (${selectedNames.length}): ${selectedNames.join(', ')}`
    : 'Nenhuma magia selecionada.';

  spellRulesInfoEl.textContent = `Classe: ${className} • Truques: ${selectedCantrips}/${cantripLimit} • ${modeLabel}: ${selectedLeveled}/${spellLimit} • Maior círculo: ${getMaxSpellLevel(className, level) || 0}`;
}

function createSpellGroup(title, spells, spellLevel) {
  const wrapper = document.createElement('div');
  wrapper.className = 'spell-group';

  const heading = document.createElement('h5');
  heading.textContent = title;
  wrapper.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'spell-list';

  spells.forEach((spellName) => {
    const item = document.createElement('label');
    item.className = 'spell-item';
    const damageInfo = SPELL_DAMAGE_DETAILS[spellName] ? `Dano: ${SPELL_DAMAGE_DETAILS[spellName]}` : 'Sem dado de dano direto cadastrado';
    item.innerHTML = `
      <input type="checkbox" class="spell-checkbox" data-source="class" data-spell-level="${spellLevel}" value="${spellName}" />
      <div>
        <strong>${spellName}</strong>
        <small>${damageInfo}</small>
      </div>
    `;
    list.appendChild(item);
  });

  wrapper.appendChild(list);
  return wrapper;
}

function renderSpellSelector(savedNames = []) {
  const className = fields.classe.value;
  const level = Number(fields.nivel.value || 1);
  const config = getSpellcastingConfig(className);

  spellSelectorEl.innerHTML = '';

  if (!config) {
    spellRulesInfoEl.textContent = 'Esta classe não possui seleção de magias no editor.';
    spellSelectionInfoEl.textContent = 'Nenhuma magia selecionada.';
    spellSlotsInfoEl.textContent = 'Sem espaços de magia.';
    fields.selected_spells_text.value = '';
    currentSpellSelection = [];
    return;
  }

  const slots = getSpellSlotsData(className, level);
  spellSlotsInfoEl.textContent = slots.length ? slots.map((slot) => `${slot.label}: ${slot.total}`).join(' | ') : 'Sem espaços de magia para este nível.';

  const maxLevel = getMaxSpellLevel(className, level);
  Object.entries(config.spells)
    .filter(([spellLevel]) => Number(spellLevel) === 0 || Number(spellLevel) <= maxLevel)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([spellLevel, spells]) => {
      const title = Number(spellLevel) === 0 ? 'Truques' : `${spellLevel}º círculo`;
      spellSelectorEl.appendChild(createSpellGroup(title, spells, Number(spellLevel)));
    });

  spellSelectorEl.querySelectorAll('.spell-checkbox').forEach((checkbox) => {
    checkbox.checked = savedNames.includes(checkbox.value);
    checkbox.addEventListener('change', () => {
      enforceSpellRules();
      updateSheetPreview();
    });
  });

  enforceSpellRules();
}

// ------------------------------------------------------------
// Preview da ficha à direita
// ------------------------------------------------------------
function updateSheetPreview() {
  const finalAttrs = getFinalAttributes();
  const level = Number(fields.nivel.value || 1);

  sheetNameEl.textContent = safeValue(fields.nome.value, 'Personagem sem nome');
  sheetSubtitleEl.textContent = `${safeValue(fields.classe.value)} • ${safeValue(fields.raca.value)} • Nível ${level}`;
  sheetMeta1El.textContent = `Antecedente: ${safeValue(fields.antecedente.value)}`;
  sheetMeta2El.textContent = `Tendência: ${safeValue(fields.alinhamento.value)}`;
  sheetMeta3El.textContent = `PV Máx.: ${fields.vida_max.value || 10}`;
  sheetMeta4El.textContent = `CA: ${fields.ca.value || 10}`;
  sheetMeta5El.textContent = `Iniciativa: ${formatModifier(Number(fields.iniciativa.value || 0))}`;
  sheetMeta6El.textContent = `Passiva: ${fields.sabedoria_passiva.value || 10}`;

  sheetAttributesGridEl.innerHTML = '';
  Object.entries(ATTR_LABELS).forEach(([key, label]) => {
    const value = finalAttrs[key];
    const mod = calculateModifier(value);
    const card = document.createElement('div');
    card.className = 'sheet-box';
    card.innerHTML = `<div>${label}: ${value} (${formatModifier(mod)})</div>`;
    sheetAttributesGridEl.appendChild(card);
  });

  const spellSummary = currentSpellSelection.length
    ? currentSpellSelection.map((item) => {
        const dmg = SPELL_DAMAGE_DETAILS[item.name] ? ` — ${SPELL_DAMAGE_DETAILS[item.name]}` : '';
        return `${item.name}${dmg}`;
      }).join('\n')
    : 'Nenhuma magia selecionada.';
  sheetSpellsEl.textContent = spellSummary;
  sheetHistoryEl.textContent = safeValue(fields.historia.value, 'Nenhuma história adicionada ainda.');

  previewVidaEl.textContent = fields.vida_max.value || '10';
  previewCaEl.textContent = fields.ca.value || '10';
  previewProfEl.textContent = `+${fields.proficiencia.value || '2'}`;
  previewPassivaEl.textContent = fields.sabedoria_passiva.value || '10';
}

// ------------------------------------------------------------
// Dashboard e estatísticas
// ------------------------------------------------------------
function calculateSummary(characters) {
  const total = characters.length;
  const average = total ? (characters.reduce((sum, item) => sum + Number(item.nivel || 0), 0) / total).toFixed(1) : '0';
  const classCount = {};
  const raceCount = {};

  characters.forEach((item) => {
    classCount[item.classe] = (classCount[item.classe] || 0) + 1;
    raceCount[item.raca] = (raceCount[item.raca] || 0) + 1;
  });

  const topClass = Object.entries(classCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const topRace = Object.entries(raceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  return { total, average, topClass, topRace, classCount, raceCount };
}

function updateStats() {
  const summary = calculateSummary(allCharacters);
  homeTotalEl.textContent = summary.total;
  homeAverageEl.textContent = summary.average;
  homeTopClassEl.textContent = summary.topClass;
  homeTopRaceEl.textContent = summary.topRace;
  dashTotalEl.textContent = summary.total;
  dashAverageEl.textContent = summary.average;
  dashTopClassEl.textContent = summary.topClass;
  dashTopRaceEl.textContent = summary.topRace;

  dashboardSummaryEl.innerHTML = '';
  if (!allCharacters.length) {
    dashboardSummaryEl.innerHTML = '<div class="empty">As estatísticas aparecerão aqui quando você salvar personagens.</div>';
    return;
  }

  Object.entries(summary.classCount).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([name, count]) => {
    const row = document.createElement('div');
    row.className = 'list-row';
    row.innerHTML = `<strong>Classe: ${name}</strong><div class="muted">${count} personagem(ns)</div>`;
    dashboardSummaryEl.appendChild(row);
  });
}

function renderDashboardCharacters() {
  const search = dashboardSearchEl.value.trim().toLowerCase();
  const classFilter = dashboardClassFilterEl.value;
  const raceFilter = dashboardRaceFilterEl.value;

  const filtered = allCharacters.filter((item) => {
    const matchesName = !search || (item.nome || '').toLowerCase().includes(search);
    const matchesClass = !classFilter || item.classe === classFilter;
    const matchesRace = !raceFilter || item.raca === raceFilter;
    return matchesName && matchesClass && matchesRace;
  });

  dashboardListEl.innerHTML = '';
  if (!filtered.length) {
    dashboardListEl.innerHTML = '<div class="empty">Nenhum personagem encontrado com os filtros atuais.</div>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <h3>${safeValue(item.nome, 'Sem nome')}</h3>
      <p>${safeValue(item.classe)} • ${safeValue(item.raca)} • Nível ${item.nivel || 1}</p>
      <p>PV ${item.vida_max || 10} • CA ${item.ca || 10} • Proficiência +${item.proficiencia || 2}</p>
      <div class="card-actions">
        <button class="btn-secondary btn-load" type="button">Abrir no editor</button>
        <button class="btn-danger btn-delete" type="button">Excluir</button>
      </div>
    `;

    card.querySelector('.btn-load').addEventListener('click', async () => {
      try {
        const payload = await fetchJSON(`/api/characters/${item.id}`);
        fillForm(payload);
        goToPage('editor');
        setFeedback(`Personagem carregado: ${payload.nome}`);
      } catch (error) {
        setDashboardFeedback(error.message, true);
      }
    });

    card.querySelector('.btn-delete').addEventListener('click', async () => {
      const ok = window.confirm(`Deseja excluir o personagem "${item.nome}"?`);
      if (!ok) return;
      try {
        await fetchJSON(`/api/characters/${item.id}`, { method: 'DELETE' });
        await loadCharacters();
        setDashboardFeedback(`Personagem excluído: ${item.nome}`);
      } catch (error) {
        setDashboardFeedback(error.message, true);
      }
    });

    dashboardListEl.appendChild(card);
  });
}

function populateDashboardFilters() {
  dashboardClassFilterEl.innerHTML = '<option value="">Todas as classes</option>' + CLASS_OPTIONS.map((item) => `<option value="${item}">${item}</option>`).join('');
  dashboardRaceFilterEl.innerHTML = '<option value="">Todas as raças</option>' + RACE_OPTIONS.map((item) => `<option value="${item}">${item}</option>`).join('');
}

// ------------------------------------------------------------
// Formulário
// ------------------------------------------------------------
function updatePreview() {
  updateAttributeModifiers();
  updateRaceBonusLog();
  updateAutomaticFields();
  renderSpellSelector(currentSpellSelection.map((item) => item.name));
  updateSheetPreview();
}

function rollSingleAttribute(attrKey) {
  const result = roll4d6DropLowest();
  fields[attrKey].value = result.total;
  diceLogEl.textContent = `${ATTR_LABELS[attrKey]}: [${result.rolls.join(', ')}] → maiores [${result.used.join(', ')}] → total ${result.total}`;
  updatePreview();
}

function rollAllAttributes() {
  const logs = [];
  Object.keys(ATTR_LABELS).forEach((key) => {
    const result = roll4d6DropLowest();
    fields[key].value = result.total;
    logs.push(`${ATTR_LABELS[key]}: [${result.rolls.join(', ')}] → [${result.used.join(', ')}] = ${result.total}`);
  });
  diceLogEl.textContent = logs.join('\n');
  updatePreview();
}

function collectFormData() {
  const finalAttrs = getFinalAttributes();
  return {
    id: fields.id.value || null,
    nome: fields.nome.value.trim(),
    nome_jogador: fields.nome_jogador.value.trim(),
    classe: fields.classe.value,
    nivel: Number(fields.nivel.value || 1),
    raca: fields.raca.value,
    subraca: fields.subraca.value,
    alinhamento: fields.alinhamento.value,
    antecedente: fields.antecedente.value.trim(),
    xp: Number(fields.xp.value || 0),

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

    tracos_personalidade: fields.tracos_personalidade.value.trim(),
    ideais: fields.ideais.value.trim(),
    ligacoes: fields.ligacoes.value.trim(),
    defeitos: fields.defeitos.value.trim(),
    testes_resistencia: fields.testes_resistencia.value.trim(),
    pericias: fields.pericias.value.trim(),
    ataques: fields.ataques.value.trim(),
    equipamentos: fields.equipamentos.value.trim(),
    caracteristicas_habilidades: fields.caracteristicas_habilidades.value.trim(),
    idiomas_proficiencias: fields.idiomas_proficiencias.value.trim(),
    historia: fields.historia.value.trim(),

    selected_spells: currentSpellSelection,
    selected_spells_text: fields.selected_spells_text.value.trim()
  };
}

function clearForm() {
  fields.id.value = '';
  fields.nome.value = '';
  fields.nome_jogador.value = '';
  fields.classe.value = 'Guerreiro';
  fields.nivel.value = 1;
  fields.raca.value = 'Humano';
  populateSubraces();
  fields.subraca.value = '';
  fields.alinhamento.value = 'Neutro';
  fields.antecedente.value = '';
  fields.xp.value = 0;

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
  fields.deslocamento.value = '9 m';
  fields.proficiencia.value = 2;
  fields.dados_vida.value = '';
  fields.sabedoria_passiva.value = 10;

  fields.tracos_personalidade.value = '';
  fields.ideais.value = '';
  fields.ligacoes.value = '';
  fields.defeitos.value = '';
  fields.testes_resistencia.value = '';
  fields.pericias.value = '';
  fields.ataques.value = '';
  fields.equipamentos.value = '';
  fields.caracteristicas_habilidades.value = '';
  fields.idiomas_proficiencias.value = '';
  fields.historia.value = '';
  fields.selected_spells_text.value = '';

  currentSpellSelection = [];
  diceLogEl.textContent = 'As rolagens dos atributos aparecerão aqui.';
  updatePreview();
}

function fillForm(payload) {
  fields.id.value = payload.id || '';
  fields.nome.value = payload.nome || '';
  fields.nome_jogador.value = payload.nome_jogador || '';
  fields.classe.value = payload.classe || 'Guerreiro';
  fields.nivel.value = payload.nivel || 1;
  fields.raca.value = payload.raca || 'Humano';
  populateSubraces();
  fields.subraca.value = payload.subraca || '';
  fields.alinhamento.value = payload.alinhamento || 'Neutro';
  fields.antecedente.value = payload.antecedente || '';
  fields.xp.value = payload.xp || 0;

  fields.forca.value = payload.forca || 10;
  fields.destreza.value = payload.destreza || 10;
  fields.constituicao.value = payload.constituicao || 10;
  fields.inteligencia.value = payload.inteligencia || 10;
  fields.sabedoria.value = payload.sabedoria || 10;
  fields.carisma.value = payload.carisma || 10;

  fields.vida_max.value = payload.vida_max || 10;
  fields.vida_atual.value = payload.vida_atual || 10;
  fields.vida_temp.value = payload.vida_temp || 0;
  fields.ca.value = payload.ca || 10;
  fields.iniciativa.value = payload.iniciativa || 0;
  fields.deslocamento.value = payload.deslocamento || '9 m';
  fields.proficiencia.value = payload.proficiencia || 2;
  fields.dados_vida.value = payload.dados_vida || '';
  fields.sabedoria_passiva.value = payload.sabedoria_passiva || 10;

  fields.tracos_personalidade.value = payload.tracos_personalidade || '';
  fields.ideais.value = payload.ideais || '';
  fields.ligacoes.value = payload.ligacoes || '';
  fields.defeitos.value = payload.defeitos || '';
  fields.testes_resistencia.value = payload.testes_resistencia || '';
  fields.pericias.value = payload.pericias || '';
  fields.ataques.value = payload.ataques || '';
  fields.equipamentos.value = payload.equipamentos || '';
  fields.caracteristicas_habilidades.value = payload.caracteristicas_habilidades || '';
  fields.idiomas_proficiencias.value = payload.idiomas_proficiencias || '';
  fields.historia.value = payload.historia || '';

  currentSpellSelection = Array.isArray(payload.selected_spells) ? payload.selected_spells : [];
  fields.selected_spells_text.value = payload.selected_spells_text || currentSpellSelection.map((item) => item.name).join(', ');
  updatePreview();
}

// ------------------------------------------------------------
// API
// ------------------------------------------------------------
async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }
  if (!response.ok) throw new Error(data.msg || 'Erro na requisição.');
  return data;
}

async function loadCharacters() {
  try {
    const characters = await fetchJSON('/api/characters');
    allCharacters = characters;
    updateStats();
    renderDashboardCharacters();
    setDashboardFeedback(characters.length ? 'Lista carregada com sucesso.' : 'Nenhum personagem salvo ainda.');
  } catch (error) {
    setDashboardFeedback(error.message, true);
  }
}

// ------------------------------------------------------------
// Inicialização de selects e páginas
// ------------------------------------------------------------
function populateClasses() {
  fields.classe.innerHTML = CLASS_OPTIONS.map((item) => `<option value="${item}">${item}</option>`).join('');
}

function populateRaces() {
  fields.raca.innerHTML = RACE_OPTIONS.map((item) => `<option value="${item}">${item}</option>`).join('');
}

function populateSubraces() {
  const race = fields.raca.value;
  const current = fields.subraca.value;
  const options = SUBRACE_OPTIONS[race] || [];
  fields.subraca.innerHTML = '<option value="">Nenhuma</option>' + options.map((item) => `<option value="${item}">${item}</option>`).join('');
  if (options.includes(current)) fields.subraca.value = current;
}

function populateAlignments() {
  fields.alinhamento.innerHTML = ALIGNMENTS.map((item) => `<option value="${item}">${item}</option>`).join('');
}

// ------------------------------------------------------------
// Eventos
// ------------------------------------------------------------
navButtons.forEach((btn) => {
  btn.addEventListener('click', () => goToPage(btn.dataset.page));
});

document.querySelectorAll('[data-go-page]').forEach((btn) => {
  btn.addEventListener('click', () => goToPage(btn.dataset.goPage));
});

document.getElementById('dashboard-refresh').addEventListener('click', loadCharacters);
document.getElementById('btn-reset').addEventListener('click', () => { clearForm(); setFeedback('Nova ficha pronta.'); });
document.getElementById('btn-load-dashboard').addEventListener('click', () => goToPage('dashboard'));
document.getElementById('btn-print').addEventListener('click', () => window.print());
document.getElementById('btn-roll-all').addEventListener('click', () => { rollAllAttributes(); setFeedback('Todos os atributos foram rolados.'); });

document.querySelectorAll('.roll-attr').forEach((button) => {
  button.addEventListener('click', () => {
    rollSingleAttribute(button.dataset.attr);
    setFeedback(`Atributo rolado: ${ATTR_LABELS[button.dataset.attr]}.`);
  });
});

fields.raca.addEventListener('change', () => { populateSubraces(); updatePreview(); });
fields.subraca.addEventListener('change', updatePreview);
fields.classe.addEventListener('change', updatePreview);
fields.nivel.addEventListener('input', updatePreview);
Object.values(fields).forEach((field) => {
  if (!field) return;
  field.addEventListener('input', updatePreview);
});

dashboardSearchEl.addEventListener('input', renderDashboardCharacters);
dashboardClassFilterEl.addEventListener('change', renderDashboardCharacters);
dashboardRaceFilterEl.addEventListener('change', renderDashboardCharacters);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = collectFormData();

  if (!payload.nome) {
    setFeedback('Preencha o nome do personagem.', true);
    return;
  }

  try {
    if (payload.id) {
      await fetchJSON(`/api/characters/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setFeedback('Personagem atualizado com sucesso.');
    } else {
      await fetchJSON('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setFeedback('Personagem salvo com sucesso.');
    }

    clearForm();
    await loadCharacters();
    goToPage('dashboard');
  } catch (error) {
    setFeedback(error.message, true);
  }
});

// ------------------------------------------------------------
// Bootstrap da aplicação
// ------------------------------------------------------------
populateClasses();
populateRaces();
populateSubraces();
populateAlignments();
populateDashboardFilters();
clearForm();
loadCharacters();
