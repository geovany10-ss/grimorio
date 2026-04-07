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
  skill_proficiencies_input: document.getElementById('skill_proficiencies_input'),
  skill_auto_info: document.getElementById('skill-auto-info'),
  skill_selector: document.getElementById('skill-selector'),
  racial_traits_auto: document.getElementById('racial_traits_auto'),
  special_resistances_auto: document.getElementById('special_resistances_auto'),
  idiomas_auto: document.getElementById('idiomas_auto'),
  armor_select: document.getElementById('armor_select'),
  shield_equipped: document.getElementById('shield_equipped'),
  armor_notes: document.getElementById('armor_notes'),
  weapon_select: document.getElementById('weapon_select'),
  weapon_attack_preview: document.getElementById('weapon_attack_preview'),
  weapon_damage_preview: document.getElementById('weapon_damage_preview'),

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

// Referências da página de impressão
const printNomeEl = document.getElementById('print-nome');
const printClasseNivelEl = document.getElementById('print-classe-nivel');
const printAntecedenteEl = document.getElementById('print-antecedente');
const printJogadorEl = document.getElementById('print-jogador');
const printRacaEl = document.getElementById('print-raca');
const printTendenciaEl = document.getElementById('print-tendencia');
const printXpEl = document.getElementById('print-xp');
const printAttrGridEl = document.getElementById('print-attr-grid');
const printInspiracaoEl = document.getElementById('print-inspiracao');
const printProficienciaEl = document.getElementById('print-proficiencia');
const printSavesEl = document.getElementById('print-saves');
const printSkillsEl = document.getElementById('print-skills');
const printPassivaEl = document.getElementById('print-passiva');
const printCaEl = document.getElementById('print-ca');
const printIniciativaEl = document.getElementById('print-iniciativa');
const printDeslocamentoEl = document.getElementById('print-deslocamento');
const printPvTotalEl = document.getElementById('print-pv-total');
const printPvAtualEl = document.getElementById('print-pv-atual');
const printPvTempEl = document.getElementById('print-pv-temp');
const printHitDiceEl = document.getElementById('print-hit-dice');
const printDeathSuccessEl = document.getElementById('print-death-success');
const printDeathFailEl = document.getElementById('print-death-fail');
const printAttacksEl = document.getElementById('print-attacks');
const printEquipmentEl = document.getElementById('print-equipment');
const printTraitsEl = document.getElementById('print-traits');
const printIdealsEl = document.getElementById('print-ideals');
const printBondsEl = document.getElementById('print-bonds');
const printFlawsEl = document.getElementById('print-flaws');
const printFeaturesEl = document.getElementById('print-features');
const printLanguagesEl = document.getElementById('print-languages');
const printHistoryEl = document.getElementById('print-history');
const printSpellClassEl = document.getElementById('print-spell-class');
const printSpellAbilityEl = document.getElementById('print-spell-ability');
const printSpellDcEl = document.getElementById('print-spell-dc');
const printSpellAttackEl = document.getElementById('print-spell-attack');
const printCantripsEl = document.getElementById('print-cantrips');
const printSpell1El = document.getElementById('print-spell-1');
const printSpell2El = document.getElementById('print-spell-2');
const printSpell3El = document.getElementById('print-spell-3');
const printSpell4El = document.getElementById('print-spell-4');
const printSpell5El = document.getElementById('print-spell-5');

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
  'Draconato': ['Draconato Vermelho','Draconato Azul','Draconato Branco','Draconato Preto','Draconato Verde','Draconato Dourado','Draconato Prateado','Draconato Bronze','Draconato Cobre','Draconato Latão'],
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


const SKILL_TO_ATTR = {
  'Acrobacia': 'destreza',
  'Arcanismo': 'inteligencia',
  'Atletismo': 'forca',
  'Atuação': 'carisma',
  'Blefar': 'carisma',
  'Furtividade': 'destreza',
  'História': 'inteligencia',
  'Intimidação': 'carisma',
  'Intuição': 'sabedoria',
  'Investigação': 'inteligencia',
  'Lidar com Animais': 'sabedoria',
  'Medicina': 'sabedoria',
  'Natureza': 'inteligencia',
  'Percepção': 'sabedoria',
  'Persuasão': 'carisma',
  'Prestidigitação': 'destreza',
  'Religião': 'inteligencia',
  'Sobrevivência': 'sabedoria'
};

const CLASS_SAVE_PROFICIENCIES = {
  'Bárbaro': ['forca', 'constituicao'],
  'Bardo': ['destreza', 'carisma'],
  'Bruxo': ['sabedoria', 'carisma'],
  'Clérigo': ['sabedoria', 'carisma'],
  'Druida': ['inteligencia', 'sabedoria'],
  'Feiticeiro': ['constituicao', 'carisma'],
  'Guerreiro': ['forca', 'constituicao'],
  'Ladino': ['destreza', 'inteligencia'],
  'Mago': ['inteligencia', 'sabedoria'],
  'Monge': ['forca', 'destreza'],
  'Paladino': ['sabedoria', 'carisma'],
  'Patrulheiro': ['forca', 'destreza']
};

const CLASS_SKILL_RULES = {
  'Bárbaro': { limit: 2, suggestions: ['Atletismo', 'Intimidação'] },
  'Bardo': { limit: 3, suggestions: ['Atuação', 'Persuasão', 'Intuição'] },
  'Bruxo': { limit: 2, suggestions: ['Arcanismo', 'Intimidação'] },
  'Clérigo': { limit: 2, suggestions: ['Religião', 'Intuição'] },
  'Druida': { limit: 2, suggestions: ['Natureza', 'Lidar com Animais'] },
  'Feiticeiro': { limit: 2, suggestions: ['Arcanismo', 'Persuasão'] },
  'Guerreiro': { limit: 2, suggestions: ['Atletismo', 'Intimidação'] },
  'Ladino': { limit: 4, suggestions: ['Furtividade', 'Acrobacia', 'Investigação', 'Prestidigitação'] },
  'Mago': { limit: 2, suggestions: ['Arcanismo', 'História'] },
  'Monge': { limit: 2, suggestions: ['Acrobacia', 'Furtividade'] },
  'Paladino': { limit: 2, suggestions: ['Persuasão', 'Intuição'] },
  'Patrulheiro': { limit: 3, suggestions: ['Sobrevivência', 'Percepção', 'Lidar com Animais'] }
};

const FIXED_RACIAL_SKILLS = {
  'Elfo': ['Percepção'],
  'Alto Elfo': ['Percepção'],
  'Elfo da Floresta': ['Percepção'],
  'Drow': ['Percepção'],
  'Meio-Orc': ['Intimidação']
};

const RACE_LANGUAGES = {
  'Humano': 'Comum + 1 idioma extra à escolha',
  'Anão': 'Comum, Anão',
  'Elfo': 'Comum, Élfico',
  'Halfling': 'Comum, Halfling',
  'Draconato': 'Comum, Dracônico',
  'Gnomo': 'Comum, Gnômico',
  'Meio-Elfo': 'Comum, Élfico + 1 idioma extra à escolha',
  'Meio-Orc': 'Comum, Orc',
  'Tiefling': 'Comum, Infernal'
};

const RACIAL_FEATURES = {
  'Humano': ['Versatilidade humana: +1 em todos os atributos.'],
  'Anão': ['Visão no escuro.', 'Resiliência anã: vantagem contra veneno e resistência a dano de veneno.'],
  'Elfo': ['Visão no escuro.', 'Ancestral feérico: vantagem contra ser enfeitiçado e magia não pode colocá-lo para dormir.', 'Transe.'],
  'Halfling': ['Sortudo.', 'Bravura.', 'Agilidade halfling.'],
  'Draconato': ['Ancestral dracônico e arma de sopro.'],
  'Gnomo': ['Visão no escuro.', 'Esperteza gnômica: vantagem em testes de resistência de Int, Sab e Car contra magia.'],
  'Meio-Elfo': ['Ancestral feérico.', 'Versatilidade de perícias.'],
  'Meio-Orc': ['Visão no escuro.', 'Resistência implacável.', 'Ataques selvagens.'],
  'Tiefling': ['Visão no escuro.', 'Resistência infernal: resistência a fogo.']
};

const SUBRACE_FEATURES = {
  'Anão da Colina': ['Tenacidade anã: +1 PV por nível.'],
  'Anão da Montanha': ['Treinamento anão em armaduras leves e médias.'],
  'Alto Elfo': ['Truque extra de mago e treinamento com espada longa, espada curta, arco curto e arco longo.'],
  'Elfo da Floresta': ['Deslocamento aumentado.', 'Máscara da Natureza.'],
  'Drow': ['Sensibilidade à luz solar.', 'Magia drow.', 'Visão no escuro superior.'],
  'Pés Leves': ['Furtividade natural.'],
  'Robusto': ['Resiliência robusta contra veneno.'],
  'Gnomo da Floresta': ['Ilusão menor.', 'Falar com pequenas bestas.'],
  'Gnomo das Rochas': ['Conhecimento do artífice.', 'Engenhoca.'],
  'Legado Infernal': ['Taumaturgia e magias infernais por nível.'],
  'Draconato Vermelho': ['Resistência a fogo.'],
  'Draconato Azul': ['Resistência a elétrico.'],
  'Draconato Branco': ['Resistência a frio.'],
  'Draconato Preto': ['Resistência a ácido.'],
  'Draconato Verde': ['Resistência a veneno.'],
  'Draconato Dourado': ['Resistência a fogo.'],
  'Draconato Prateado': ['Resistência a frio.'],
  'Draconato Bronze': ['Resistência a elétrico.'],
  'Draconato Cobre': ['Resistência a ácido.'],
  'Draconato Latão': ['Resistência a fogo.']
};

const SUBRACE_SPECIALS = {
  'Drow': ['Visão no escuro 36 m.', 'Sensibilidade à luz solar.'],
  'Elfo da Floresta': ['Máscara da Natureza.', 'Deslocamento 10,5 m.'],
  'Tiefling': ['Resistência a fogo.']
};

const CLASS_STARTING_EQUIPMENT = {
  'Bárbaro': 'Machado grande ou arma marcial corpo a corpo, duas machadinhas, mochila do explorador e quatro azagaias.',
  'Bardo': 'Rapieira ou espada longa simples, pacote de artista, instrumento musical e armadura leve.',
  'Bruxo': 'Besta leve, foco arcano, mochila do estudioso ou do explorador e armadura leve.',
  'Clérigo': 'Símbolo sagrado, escudo, arma simples e armadura média ou leve conforme o domínio.',
  'Druida': 'Escudo de madeira, foco druídico, arma simples e armadura não metálica.',
  'Feiticeiro': 'Besta leve ou arma simples, foco arcano e mochila do explorador ou do estudioso.',
  'Guerreiro': 'Armadura, escudo ou arma marcial, arma secundária e mochila do aventureiro.',
  'Ladino': 'Rapieira ou espada curta, arco curto e aljava, ferramentas de ladrão e armadura leve.',
  'Mago': 'Bordão ou adaga, foco arcano ou bolsa de componentes e grimório.',
  'Monge': 'Espada curta ou arma simples, pacote do aventureiro e 10 dardos.',
  'Paladino': 'Arma marcial, escudo, cinco azagaias e símbolo sagrado.',
  'Patrulheiro': 'Armadura leve ou média, duas espadas curtas ou duas armas simples, arco longo e aljava.'
};

const ARMOR_CATALOG = {
  'Túnica / tecido': { type: 'roupa', base: 10, dexMode: 'full', note: 'Sem armadura, visual de tecido ou pano.' },
  'Armadura acolchoada': { type: 'leve', base: 11, dexMode: 'full', note: 'Leve, discreta e simples.' },
  'Armadura de couro': { type: 'leve', base: 11, dexMode: 'full', note: 'Leve e flexível.' },
  'Couro batido': { type: 'leve', base: 12, dexMode: 'full', note: 'Leve reforçada.' },
  'Gibão de peles': { type: 'media', base: 12, dexMode: 'max2', note: 'Média, comum para bárbaros e patrulheiros.' },
  'Cota de escamas': { type: 'media', base: 14, dexMode: 'max2', note: 'Média de escamas metálicas.' },
  'Peitoral': { type: 'media', base: 14, dexMode: 'max2', note: 'Média e versátil.' },
  'Meia-armadura': { type: 'media', base: 15, dexMode: 'max2', note: 'Média pesada.' },
  'Cota de anéis': { type: 'pesada', base: 14, dexMode: 'none', note: 'Pesada simples.' },
  'Cota de malha': { type: 'pesada', base: 16, dexMode: 'none', note: 'Pesada clássica.' },
  'Brunea': { type: 'pesada', base: 17, dexMode: 'none', note: 'Pesada robusta.' },
  'Armadura de placas': { type: 'pesada', base: 18, dexMode: 'none', note: 'Pesada máxima.' }
};

const CLASS_ARMOR_PROFICIENCIES = {
  'Bárbaro': ['roupa', 'leve', 'media', 'escudo'],
  'Bardo': ['roupa', 'leve'],
  'Bruxo': ['roupa', 'leve'],
  'Clérigo': ['roupa', 'leve', 'media', 'escudo'],
  'Druida': ['roupa', 'leve', 'media', 'escudo'],
  'Feiticeiro': ['roupa'],
  'Guerreiro': ['roupa', 'leve', 'media', 'pesada', 'escudo'],
  'Ladino': ['roupa', 'leve'],
  'Mago': ['roupa'],
  'Monge': ['roupa'],
  'Paladino': ['roupa', 'leve', 'media', 'pesada', 'escudo'],
  'Patrulheiro': ['roupa', 'leve', 'media', 'escudo']
};

const WEAPON_CATALOG = {
  'Adaga': { damage: '1d4 perfurante', category: 'simples', mode: 'finesse', notes: 'Acuidade, arremesso, leve' },
  'Bordão': { damage: '1d6 concussão', altDamage: '1d8 concussão', category: 'simples', mode: 'strength', notes: 'Versátil' },
  'Clava': { damage: '1d4 concussão', category: 'simples', mode: 'strength', notes: 'Leve' },
  'Maça': { damage: '1d6 concussão', category: 'simples', mode: 'strength', notes: 'Simples' },
  'Lança': { damage: '1d6 perfurante', altDamage: '1d8 perfurante', category: 'simples', mode: 'strength', notes: 'Arremesso, versátil' },
  'Machadinha': { damage: '1d6 cortante', category: 'simples', mode: 'strength', notes: 'Leve, arremesso' },
  'Arco curto': { damage: '1d6 perfurante', category: 'simples', mode: 'dexterity', notes: 'Munição, duas mãos' },
  'Besta leve': { damage: '1d8 perfurante', category: 'simples', mode: 'dexterity', notes: 'Munição, recarga, duas mãos' },
  'Espada curta': { damage: '1d6 perfurante', category: 'marcial', mode: 'finesse', notes: 'Acuidade, leve' },
  'Espada longa': { damage: '1d8 cortante', altDamage: '1d10 cortante', category: 'marcial', mode: 'strength', notes: 'Versátil' },
  'Espada grande': { damage: '2d6 cortante', category: 'marcial', mode: 'strength', notes: 'Pesada, duas mãos' },
  'Machado de batalha': { damage: '1d8 cortante', altDamage: '1d10 cortante', category: 'marcial', mode: 'strength', notes: 'Versátil' },
  'Machado grande': { damage: '1d12 cortante', category: 'marcial', mode: 'strength', notes: 'Pesada, duas mãos' },
  'Martelo de guerra': { damage: '1d8 concussão', altDamage: '1d10 concussão', category: 'marcial', mode: 'strength', notes: 'Versátil' },
  'Rapieira': { damage: '1d8 perfurante', category: 'marcial', mode: 'finesse', notes: 'Acuidade' },
  'Arco longo': { damage: '1d8 perfurante', category: 'marcial', mode: 'dexterity', notes: 'Pesada, munição, duas mãos' },
  'Besta pesada': { damage: '1d10 perfurante', category: 'marcial', mode: 'dexterity', notes: 'Pesada, munição, recarga, duas mãos' }
};

const CLASS_WEAPON_PROFICIENCIES = {
  'Bárbaro': ['simples', 'marcial'],
  'Bardo': ['simples', 'Adaga', 'Espada curta', 'Rapieira', 'Arco curto'],
  'Bruxo': ['simples'],
  'Clérigo': ['simples'],
  'Druida': ['simples'],
  'Feiticeiro': ['Adaga', 'Dardo', 'Funda', 'Bordão', 'Besta leve'],
  'Guerreiro': ['simples', 'marcial'],
  'Ladino': ['simples', 'Espada curta', 'Rapieira', 'Arco curto', 'Besta leve'],
  'Mago': ['Adaga', 'Dardo', 'Funda', 'Bordão', 'Besta leve'],
  'Monge': ['simples', 'Espada curta'],
  'Paladino': ['simples', 'marcial'],
  'Patrulheiro': ['simples', 'marcial']
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
  'Legado Infernal': {},
  'Draconato Vermelho': {}, 'Draconato Azul': {}, 'Draconato Branco': {}, 'Draconato Preto': {}, 'Draconato Verde': {},
  'Draconato Dourado': {}, 'Draconato Prateado': {}, 'Draconato Bronze': {}, 'Draconato Cobre': {}, 'Draconato Latão': {}
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
  'Lâmina Trovejante': 'arma + 1d8 trovejante',
  'Lâmina Ardente': 'arma + 1d8 fogo',
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
  'Nuvem de Adagas': '4d4 cortante',
  'Seta Ácida de Melf': '4d4 ácido + 2d4 ácido',
  'Mãos de Hadar': '2d6 necrótico',
  'Bola de Fogo': '8d6 fogo',
  'Relâmpago': '8d6 elétrico',
  'Tempestade de Gelo': '2d8 concussão + 4d6 frio',
  'Muralha de Fogo': '5d8 fogo',
  'Blight': '8d8 necrótico',
  'Cone de Frio': '8d8 frio',
  'Golpe Flamejante': '4d6 fogo + 4d6 radiante',
  'Praga': '8d8 necrótico',
  'Coluna de Chamas': '4d6 fogo + 4d6 radiante',
  'Corrente de Relâmpagos': '10d8 elétrico',
  'Desintegrar': '10d6 + 40 força',
  'Círculo da Morte': '8d6 necrótico',
  'Dedo da Morte': '7d8 + 30 necrótico',
  'Explosão Solar': '12d6 radiante',
  'Repreensão Infernal': '2d10 fogo',
  'Marca do Caçador': '+1d6 por ataque',
  'Golpe Trovejante': '2d6 trovejante',
  'Cordão de Flechas': '1d6 perfurante',
  'Golpe do Vento': '6d10 força',
  'Arma Espiritual': '1d8 + modificador',
  'Guardião da Fé': '20 radiante',
  'Nuvem Fétida': 'sem dano direto',
  'Fogo Feérico': 'sem dano direto',
  'Palavra Curativa': '1d4 + modificador',
  'Curar Ferimentos': '1d8 + modificador',
  'Palavra Curativa em Massa': '1d4 + modificador',
  'Curar Ferimentos em Massa': '3d8 + modificador',
  'Cura Completa': '70 cura',
  'Cura Completa em Massa': '700 cura divididos'
};

// Banco principal de magias usado pelo seletor do editor.
// Nesta expansão, o catálogo ficou bem mais amplo para as classes conjuradoras
// principais, incluindo mais opções por círculo e mais anotações de dano quando cabem.
const SPELL_SLOTS_BY_CLASS = {
  full: {1:[2],2:[3],3:[4,2],4:[4,3],5:[4,3,2],6:[4,3,3],7:[4,3,3,1],8:[4,3,3,2],9:[4,3,3,3,1],10:[4,3,3,3,2],11:[4,3,3,3,2,1],12:[4,3,3,3,2,1],13:[4,3,3,3,2,1,1],14:[4,3,3,3,2,1,1],15:[4,3,3,3,2,1,1,1],16:[4,3,3,3,2,1,1,1],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1]},
  half: {1:[],2:[2],3:[3],4:[3],5:[4,2],6:[4,2],7:[4,3],8:[4,3],9:[4,3,2],10:[4,3,2],11:[4,3,3],12:[4,3,3],13:[4,3,3,1],14:[4,3,3,1],15:[4,3,3,2],16:[4,3,3,2],17:[4,3,3,3,1],18:[4,3,3,3,1],19:[4,3,3,3,2],20:[4,3,3,3,2]},
  warlock: {1:{level:1,slots:1},2:{level:1,slots:2},3:{level:2,slots:2},4:{level:2,slots:2},5:{level:3,slots:2},6:{level:3,slots:2},7:{level:4,slots:2},8:{level:4,slots:2},9:{level:5,slots:2},10:{level:5,slots:2},11:{level:5,slots:3},12:{level:5,slots:3},13:{level:5,slots:3},14:{level:5,slots:3},15:{level:5,slots:3},16:{level:5,slots:3},17:{level:5,slots:4},18:{level:5,slots:4},19:{level:5,slots:4},20:{level:5,slots:4}}
};

const SPELL_DATA = {
  Mago: {
    ability: 'inteligencia',
    mode: 'prepared',
    cantripsByLevel: {1:3,4:4,10:5},
    maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9},
    spells: {
      0:['Luz','Mãos Mágicas','Prestidigitação','Raio de Gelo','Ilusão Menor','Toque Chocante','Raio de Fogo','Mensagem','Consertar','Lâmina Trovejante','Lâmina Ardente'],
      1:['Armadura Arcana','Mísseis Mágicos','Escudo','Sono','Identificar','Detectar Magia','Compreender Idiomas','Disfarçar-se','Queda Suave','Enfeitiçar Pessoa','Névoa Obscurecente','Servo Invisível','Encontrar Familiar','Raio Adoecente','Mãos Flamejantes','Orbe Cromática','Salto','Ataque Certeiro','Escrita Ilusória'],
      2:['Passo Nebuloso','Imagem Espelhada','Invisibilidade','Raio Ardente','Tranca Arcana','Levitação','Visão no Escuro','Nublar','Despedaçar','Sugestão','Teia','Imobilizar Pessoa','Alterar-se','Seta Ácida de Melf','Nuvem de Adagas','Detectar Pensamentos','Boca Mágica'],
      3:['Bola de Fogo','Contra Mágica','Voo','Relâmpago','Velocidade','Imagem Maior','Respirar na Água','Forma Gasosa','Padrão Hipnótico','Lentidão','Dispersar Magia','Proteção contra Energia','Clarevidência'],
      4:['Muralha de Fogo','Invisibilidade Maior','Tempestade de Gelo','Polimorfia','Porta Dimensional','Olho Arcano','Banimento','Metamorfose Rochosa','Assassino Fantasmagórico'],
      5:['Cone de Frio','Telecinese','Muralha de Força','Dominar Pessoa','Círculo de Teleporte','Imobilizar Monstro','Contato com Outros Planos','Símbolo de Sonho'],
      6:['Desintegrar','Globo de Invulnerabilidade','Corrente de Relâmpagos','Visão Verdadeira','Carne para Pedra'],
      7:['Simulacro','Dedo da Morte','Teletransporte','Deslocamento Planar','Bola de Fogo Retardada'],
      8:['Palavra de Poder Atordoar','Dominar Monstro','Explosão Solar','Labirinto'],
      9:['Parar o Tempo','Desejo','Palavra de Poder Matar','Metamorfose Verdadeira']
    }
  },
  'Clérigo': {
    ability: 'sabedoria',
    mode: 'prepared',
    cantripsByLevel: {1:3,4:4,10:5},
    maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9},
    spells: {
      0:['Luz','Chama Sagrada','Taumaturgia','Orientação','Resistência','Poupar os Moribundos'],
      1:['Curar Ferimentos','Bênção','Escudo da Fé','Detectar Magia','Palavra Curativa','Comando','Proteção contra o Bem e o Mal','Santuário','Criar ou Destruir Água','Purificar Alimentos e Bebidas'],
      2:['Arma Espiritual','Silêncio','Restauração Menor','Auxílio','Imobilizar Pessoa','Oração Curativa','Zona da Verdade','Proteção contra Veneno','Augúrio','Vínculo Protetor'],
      3:['Revivificar','Palavra Curativa em Massa','Remover Maldição','Luz do Dia','Proteção contra Energia','Enviar Mensagem','Animar Mortos','Falar com Mortos','Criar Alimentos e Água'],
      4:['Guardião da Fé','Liberdade de Movimento','Proteção contra a Morte','Banimento','Adivinhação','Localizar Criatura'],
      5:['Restauração Maior','Golpe Flamejante','Curar Ferimentos em Massa','Praga','Coluna de Chamas','Comunhão','Santuário de Pedra'],
      6:['Cura Completa','Barreira de Lâminas','Encontrar o Caminho','Aliado Planar'],
      7:['Ressurreição','Tempestade de Fogo','Deslocamento Planar','Símbolo'],
      8:['Aura Sagrada','Terremoto'],
      9:['Cura Completa em Massa','Ressurreição Verdadeira','Portal']
    }
  },
  Druida: {
    ability: 'sabedoria',
    mode: 'prepared',
    cantripsByLevel: {1:2,4:3,10:4},
    maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9},
    spells: {
      0:['Orientação','Chicote de Espinhos','Produzir Chamas','Consertar','Rajada de Veneno','Resistência'],
      1:['Enfeitiçar Animal','Falar com Animais','Curar Ferimentos','Onda Trovejante','Bom Fruto','Névoa Obscurecente','Detectar Magia','Fogo Feérico','Salto','Passos Longos'],
      2:['Esfera Flamejante','Passos sem Pegadas','Pele de Árvore','Lâmina Flamejante','Raio Lunar','Imobilizar Pessoa','Localizar Animais ou Plantas','Restauração Menor'],
      3:['Conjurar Animais','Relâmpago','Respirar na Água','Crescimento de Plantas','Andar na Água','Chamar Relâmpago','Mesclar-se à Pedra'],
      4:['Tempestade de Gelo','Muralha de Fogo','Polimorfia','Pele Rochosa','Dominar Fera','Liberdade de Movimento','Localizar Criatura'],
      5:['Praga de Insetos','Restauração Maior','Comunhão com a Natureza','Muralha de Pedra','Passagem pelas Árvores','Reencarnar'],
      6:['Mover Terra','Cura Completa','Muralha de Espinhos','Transporte via Plantas'],
      7:['Tempestade de Fogo','Deslocamento Planar','Forma Etérea'],
      8:['Explosão Solar','Terremoto'],
      9:['Metamorfose Verdadeira','Precognição','Mudança de Forma']
    }
  },
  Bardo: {
    ability: 'carisma',
    mode: 'known',
    cantripsByLevel: {1:2,4:3,10:4},
    maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9},
    knownByLevel: {1:4,2:5,3:6,4:7,5:8,6:9,7:10,8:11,9:12,10:14,11:15,12:15,13:16,14:18,15:19,16:19,17:20,18:22,19:22,20:22},
    spells: {
      0:['Zombaria Viciosa','Luz','Mãos Mágicas','Ilusão Menor','Mensagem','Prestidigitação'],
      1:['Sussurros Dissonantes','Palavra Curativa','Sono','Compreender Idiomas','Enfeitiçar Pessoa','Curar Ferimentos','Fogo Feérico','Identificar','Heroísmo'],
      2:['Invisibilidade','Despedaçar','Imobilizar Pessoa','Nublar','Detectar Pensamentos','Silêncio','Sugestão','Aprimorar Habilidade','Arma Mágica'],
      3:['Padrão Hipnótico','Falar com Mortos','Medo','Enviar Mensagem','Crescimento de Plantas','Dispersar Magia','Clarevidência','Glifo de Vigilância'],
      4:['Porta Dimensional','Invisibilidade Maior','Confusão','Polimorfia','Liberdade de Movimento'],
      5:['Restauração Maior','Dominar Pessoa','Imobilizar Monstro','Ressurreição Menor','Malogro','Animar Objetos'],
      6:['Dança Irresistível de Otto','Visão Verdadeira','Sugestão em Massa'],
      7:['Palavra de Poder Dor','Teletransporte','Forma Etérea'],
      8:['Palavra de Poder Atordoar','Dominar Monstro'],
      9:['Palavra de Poder Matar','Previsão']
    }
  },
  Feiticeiro: {
    ability: 'carisma',
    mode: 'known',
    cantripsByLevel: {1:4,4:5,10:6},
    maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6,12:6,13:7,14:7,15:8,16:8,17:9,18:9,19:9,20:9},
    knownByLevel: {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,19:15,20:15},
    spells: {
      0:['Raio de Fogo','Luz','Prestidigitação','Toque Chocante','Rajada de Veneno','Raio de Gelo','Mensagem','Mãos Mágicas'],
      1:['Mísseis Mágicos','Escudo','Sono','Mãos Flamejantes','Raio Adoecente','Orbe Cromática','Disfarçar-se','Queda Suave','Névoa Obscurecente'],
      2:['Raio Ardente','Invisibilidade','Imagem Espelhada','Passo Nebuloso','Sugestão','Despedaçar','Detectar Pensamentos','Nublar'],
      3:['Bola de Fogo','Relâmpago','Velocidade','Voo','Contra Mágica','Padrão Hipnótico','Forma Gasosa'],
      4:['Muralha de Fogo','Tempestade de Gelo','Porta Dimensional','Banimento','Invisibilidade Maior','Polimorfia'],
      5:['Cone de Frio','Imobilizar Monstro','Telecinese','Dominar Pessoa','Névoa Mortal'],
      6:['Desintegrar','Corrente de Relâmpagos','Globo de Invulnerabilidade'],
      7:['Dedo da Morte','Teletransporte','Deslocamento Planar'],
      8:['Palavra de Poder Atordoar','Dominar Monstro','Explosão Solar'],
      9:['Desejo','Parar o Tempo','Palavra de Poder Matar']
    }
  },
  Bruxo: {
    ability: 'carisma',
    mode: 'known',
    cantripsByLevel: {1:2,4:3,10:4},
    maxSpellLevelByLevel: {1:1,2:1,3:2,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:5,12:5,13:5,14:5,15:5,16:5,17:5,18:5,19:5,20:5},
    knownByLevel: {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:10,11:11,12:11,13:12,14:12,15:13,16:13,17:14,18:14,19:15,20:15},
    spells: {
      0:['Rajada Mística','Ilusão Menor','Mãos Mágicas','Prestidigitação','Toque Chocante','Raio de Gelo'],
      1:['Armadura de Agathys','Enfeitiçar Pessoa','Compreender Idiomas','Repreensão Infernal','Proteção contra o Bem e o Mal','Braços de Hadar','Hex'],
      2:['Raio Ardente','Invisibilidade','Despedaçar','Sugestão','Imagem Espelhada','Passo Nebuloso','Escuridão'],
      3:['Padrão Hipnótico','Medo','Voo','Contra Mágica','Dispersar Magia','Fome de Hadar'],
      4:['Muralha de Fogo','Porta Dimensional','Banimento','Invisibilidade Maior','Blight'],
      5:['Segurar Monstro','Dominar Pessoa','Sonho','Telecinese','Névoa Mortal'],
      6:['Círculo da Morte','Visão Verdadeira','Carne para Pedra'],
      7:['Deslocamento Planar','Dedo da Morte','Forma Etérea'],
      8:['Dominar Monstro','Palavra de Poder Atordoar'],
      9:['Palavra de Poder Matar','Aprisionamento']
    }
  },
  Paladino: {
    ability: 'carisma',
    mode: 'preparedHalf',
    maxSpellLevelByLevel: {1:0,2:1,3:1,4:1,5:2,6:2,7:2,8:2,9:3,10:3,11:3,12:3,13:4,14:4,15:4,16:4,17:5,18:5,19:5,20:5},
    spells: {
      1:['Bênção','Comando','Curar Ferimentos','Escudo da Fé','Proteção contra o Bem e o Mal','Golpe Trovejante','Heroísmo'],
      2:['Restauração Menor','Arma Mágica','Encontrar Montaria','Zona da Verdade','Auxílio','Proteção contra Veneno'],
      3:['Remover Maldição','Luz do Dia','Revivificar','Aura de Vitalidade','Proteção contra Energia'],
      4:['Banimento','Aura de Vida','Proteção contra a Morte','Localizar Criatura'],
      5:['Destruir o Mal','Restauração Maior','Círculo de Poder','Golpe Flamejante']
    }
  },
  Patrulheiro: {
    ability: 'sabedoria',
    mode: 'known',
    maxSpellLevelByLevel: {1:0,2:1,3:1,4:1,5:2,6:2,7:2,8:2,9:3,10:3,11:3,12:3,13:4,14:4,15:4,16:4,17:5,18:5,19:5,20:5},
    knownByLevel: {1:0,2:2,3:3,4:3,5:4,6:4,7:5,8:5,9:6,10:6,11:7,12:7,13:8,14:8,15:9,16:9,17:10,18:10,19:11,20:11},
    spells: {
      1:['Marca do Caçador','Falar com Animais','Curar Ferimentos','Passos Longos','Detectar Magia','Golpe Constritor'],
      2:['Passos sem Pegadas','Restauração Menor','Silêncio','Cordão de Flechas','Visão no Escuro','Localizar Animais ou Plantas'],
      3:['Conjurar Animais','Luz do Dia','Proteção contra Energia','Andar na Água','Flecha Relampejante'],
      4:['Liberdade de Movimento','Localizar Criatura','Pele Rochosa','Conjurar Seres da Floresta'],
      5:['Golpe do Vento','Comunhão com a Natureza','Muralha de Pedra','Aljava Veloz']
    }
  }
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


function normalizeName(value) {
  return String(value || '').trim().toLowerCase();
}

function parseCommaList(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function getAutoSkillNames() {
  return uniqueList([
    ...(FIXED_RACIAL_SKILLS[fields.raca.value] || []),
    ...(FIXED_RACIAL_SKILLS[fields.subraca.value] || [])
  ]);
}

function getClassSkillRule(className) {
  return CLASS_SKILL_RULES[className] || { limit: 0, suggestions: [] };
}

function isWeaponProficient(className, weaponName) {
  const rules = CLASS_WEAPON_PROFICIENCIES[className] || [];
  const weapon = WEAPON_CATALOG[weaponName];
  if (!weapon) return false;
  return rules.includes(weaponName) || rules.includes(weapon.category);
}

function getWeaponAbilityMod(weaponName) {
  const weapon = WEAPON_CATALOG[weaponName];
  const attrs = getFinalAttributes();
  if (!weapon) return 0;
  if (weapon.mode === 'dexterity') return calculateModifier(attrs.destreza);
  if (weapon.mode === 'finesse') return Math.max(calculateModifier(attrs.forca), calculateModifier(attrs.destreza));
  return calculateModifier(attrs.forca);
}

function calculateArmorClassFromSelection() {
  const armorName = fields.armor_select?.value || 'Túnica / tecido';
  const armor = ARMOR_CATALOG[armorName] || ARMOR_CATALOG['Túnica / tecido'];
  const dexMod = calculateModifier(getFinalAttributes().destreza);
  let ac = armor.base;
  if (armor.dexMode === 'full') ac += dexMod;
  else if (armor.dexMode === 'max2') ac += Math.min(dexMod, 2);
  if ((fields.shield_equipped?.value || 'Não') === 'Sim') ac += 2;
  return ac;
}

function updateArmorOptions() {
  const className = fields.classe.value;
  const profs = CLASS_ARMOR_PROFICIENCIES[className] || ['roupa'];
  const current = fields.armor_select?.value;
  const options = Object.entries(ARMOR_CATALOG).filter(([name, armor]) => {
    if (armor.type === 'roupa') return true;
    return profs.includes(armor.type);
  });
  fields.armor_select.innerHTML = options.map(([name]) => `<option value="${name}">${name}</option>`).join('');
  if (current && options.some(([name]) => name === current)) fields.armor_select.value = current;
  else fields.armor_select.value = options[0]?.[0] || 'Túnica / tecido';
  const armor = ARMOR_CATALOG[fields.armor_select.value] || ARMOR_CATALOG['Túnica / tecido'];
  const shieldAllowed = profs.includes('escudo');
  if (!shieldAllowed) fields.shield_equipped.value = 'Não';
  fields.shield_equipped.disabled = !shieldAllowed;
  fields.armor_notes.value = `${armor.type.toUpperCase()} • ${armor.note}` + (shieldAllowed ? '' : ' • Esta classe não usa escudo.');
}

function updateWeaponOptions() {
  const className = fields.classe.value;
  const rules = CLASS_WEAPON_PROFICIENCIES[className] || [];
  const current = fields.weapon_select?.value;
  const options = Object.entries(WEAPON_CATALOG).filter(([name, weapon]) => rules.includes(name) || rules.includes(weapon.category));
  fields.weapon_select.innerHTML = '<option value="">Selecione</option>' + options.map(([name]) => `<option value="${name}">${name}</option>`).join('');
  if (current && options.some(([name]) => name === current)) fields.weapon_select.value = current;
  updateWeaponPreview();
}

function updateWeaponPreview() {
  const weaponName = fields.weapon_select?.value;
  if (!weaponName || !WEAPON_CATALOG[weaponName]) {
    fields.weapon_attack_preview.value = '—';
    fields.weapon_damage_preview.value = '—';
    return;
  }
  const weapon = WEAPON_CATALOG[weaponName];
  const mod = getWeaponAbilityMod(weaponName);
  const prof = isWeaponProficient(fields.classe.value, weaponName) ? Number(fields.proficiencia.value || 2) : 0;
  fields.weapon_attack_preview.value = `${formatModifier(mod + prof)} para acertar`;
  fields.weapon_damage_preview.value = `${weapon.damage} ${mod >=0 ? '+'+mod : mod}${weapon.altDamage ? ` • Versátil: ${weapon.altDamage} ${mod >=0 ? '+'+mod : mod}` : ''}`;
}

function appendSelectedWeaponToAttacks() {
  const weaponName = fields.weapon_select?.value;
  if (!weaponName || !WEAPON_CATALOG[weaponName]) return;
  const weapon = WEAPON_CATALOG[weaponName];
  const mod = getWeaponAbilityMod(weaponName);
  const prof = isWeaponProficient(fields.classe.value, weaponName) ? Number(fields.proficiencia.value || 2) : 0;
  const attack = `${weaponName} ${formatModifier(mod + prof)} — ${weapon.damage} ${mod >=0 ? '+'+mod : mod}${weapon.altDamage ? ` | versátil ${weapon.altDamage} ${mod >=0 ? '+'+mod : mod}` : ''}${weapon.notes ? ` (${weapon.notes})` : ''}`;
  fields.ataques.value = fields.ataques.value.trim() ? `${fields.ataques.value}\n${attack}` : attack;
  updateSheetPreview();
}

function renderSkillSelector(savedNames = null) {
  const autoNames = new Set(getAutoSkillNames());
  const rule = getClassSkillRule(fields.classe.value);
  const currentSaved = savedNames && savedNames.length ? savedNames : parseCommaList(fields.skill_proficiencies_input?.value);
  const selectedSet = new Set(currentSaved.length ? currentSaved : [...autoNames, ...rule.suggestions]);

  fields.skill_selector.innerHTML = '';
  fields.skill_auto_info.textContent = `Classe ${fields.classe.value} • selecione até ${rule.limit} perícias de classe. Traços raciais automáticos ficam bloqueados.`;

  Object.entries(SKILL_TO_ATTR).forEach(([skill, attrKey]) => {
    const isAuto = autoNames.has(skill);
    const checked = selectedSet.has(skill) || isAuto;
    const wrapper = document.createElement('label');
    wrapper.className = `skill-item${isAuto ? ' auto' : ''}`;
    wrapper.innerHTML = `<input type="checkbox" class="skill-checkbox" value="${skill}" ${checked ? 'checked' : ''} ${isAuto ? 'disabled' : ''} />
      <div><strong>${skill}</strong><small>${ATTR_LABELS[attrKey]}</small></div>`;
    fields.skill_selector.appendChild(wrapper);
  });

  const sync = (changed = null) => {
    const selected = Array.from(fields.skill_selector.querySelectorAll('.skill-checkbox:checked')).map((cb) => cb.value);
    const manualSelected = selected.filter((name) => !autoNames.has(name));
    if (rule.limit && manualSelected.length > rule.limit && changed) {
      changed.checked = false;
      setFeedback(`Você pode selecionar até ${rule.limit} perícias de classe para ${fields.classe.value}.`, true);
    }
    const finalSelected = Array.from(fields.skill_selector.querySelectorAll('.skill-checkbox:checked')).map((cb) => cb.value);
    fields.skill_proficiencies_input.value = finalSelected.join(', ');
    updateAutomaticSavesAndSkills();
  };

  fields.skill_selector.querySelectorAll('.skill-checkbox').forEach((cb) => cb.addEventListener('change', () => sync(cb)));
  sync();
}

function getAutoLanguagesText() {
  return RACE_LANGUAGES[fields.raca.value] || 'Comum';
}

function getAutoTraitsText() {
  return uniqueList([...(RACIAL_FEATURES[fields.raca.value] || []), ...(SUBRACE_FEATURES[fields.subraca.value] || [])]).join('\n');
}

function getAutoSpecialResistancesText() {
  return uniqueList([
    ...(SUBRACE_SPECIALS[fields.raca.value] || []),
    ...(SUBRACE_SPECIALS[fields.subraca.value] || []),
    ...(fields.raca.value === 'Tiefling' ? ['Resistência a fogo.'] : []),
    ...(fields.raca.value === 'Anão' ? ['Resistência a dano de veneno.'] : [])
  ]).join('\n');
}

function updateAutomaticSavesAndSkills() {
  const attrs = getFinalAttributes();
  const prof = Number(fields.proficiencia.value || 2);
  const saveProfs = new Set(CLASS_SAVE_PROFICIENCIES[fields.classe.value] || []);
  const saveText = Object.entries(ATTR_LABELS).map(([key, label]) => {
    const total = calculateModifier(attrs[key]) + (saveProfs.has(key) ? prof : 0);
    return `${label}: ${formatModifier(total)}${saveProfs.has(key) ? ' (prof.)' : ''}`;
  }).join('\n');
  fields.testes_resistencia.value = saveText;

  const selectedSkills = new Set(parseCommaList(fields.skill_proficiencies_input?.value).map(normalizeName));
  const skillsText = Object.entries(SKILL_TO_ATTR).map(([skill, attrKey]) => {
    const proficient = selectedSkills.has(normalizeName(skill));
    const total = calculateModifier(attrs[attrKey]) + (proficient ? prof : 0);
    return `${skill} (${ATTR_LABELS[attrKey]}): ${formatModifier(total)}${proficient ? ' (prof.)' : ''}`;
  }).join('\n');
  fields.pericias.value = skillsText;

  fields.racial_traits_auto.value = getAutoTraitsText();
  fields.special_resistances_auto.value = getAutoSpecialResistancesText();
  fields.idiomas_auto.value = getAutoLanguagesText();

  if (!fields.equipamentos.value.trim() || fields.equipamentos.value.startsWith('Equipamento sugerido:')) {
    fields.equipamentos.value = `Equipamento sugerido: ${CLASS_STARTING_EQUIPMENT[fields.classe.value] || 'Defina o equipamento inicial com o mestre.'}`;
  }
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
  fields.ca.value = calculateArmorClassFromSelection();
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

function getSpellConfig(className) {
  return getSpellcastingConfig(className);
}

function getSpellcastingStats() {
  const config = getSpellcastingConfig(fields.classe.value);
  if (!config) return null;
  const prof = Number(fields.proficiencia.value || 2);
  const abilityMod = calculateModifier(getFinalAttributes()[config.ability] || 10);
  return { saveDC: 8 + prof + abilityMod, attackBonus: prof + abilityMod };
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
  const armorLabel = fields.armor_select?.value ? `Armadura: ${fields.armor_select.value}${fields.shield_equipped.value === 'Sim' ? ' + Escudo' : ''}` : 'Armadura: —';

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
  sheetHistoryEl.textContent = `${armorLabel}
Arma selecionada: ${fields.weapon_select.value || '—'}${fields.weapon_damage_preview.value ? ` • ${fields.weapon_damage_preview.value}` : ''}

Traços raciais:
${safeValue(fields.racial_traits_auto.value, '—')}

${safeValue(fields.historia.value, 'Nenhuma história adicionada ainda.')}`;

  previewVidaEl.textContent = fields.vida_max.value || '10';
  previewCaEl.textContent = fields.ca.value || '10';
  previewProfEl.textContent = `+${fields.proficiencia.value || '2'}`;
  previewPassivaEl.textContent = fields.sabedoria_passiva.value || '10';
  updatePrintSheet();
}

function setPrintBoxState(element, value, emptyFallback = '—') {
  if (!element) return;
  const normalized = (value ?? '').toString().trim();
  const finalValue = normalized || emptyFallback;
  if ('textContent' in element) element.textContent = finalValue;
  const box = element.closest('.print-box');
  if (box) {
    box.dataset.empty = finalValue === emptyFallback ? 'true' : 'false';
    if (finalValue === emptyFallback && box.classList.contains('optional-print-box')) {
      box.style.display = 'none';
    } else {
      box.style.display = '';
    }
  }
}

function updatePrintSheet() {
  if (!printNomeEl) return;

  const finalAttrs = getFinalAttributes();
  const level = Number(fields.nivel.value || 1);
  const armorLabel = fields.armor_select?.value ? `${fields.armor_select.value}${fields.shield_equipped.value === 'Sim' ? ' + Escudo' : ''}` : '—';

  setPrintBoxState(printNomeEl, safeValue(fields.nome.value));
  setPrintBoxState(printClasseNivelEl, `${safeValue(fields.classe.value)} ${level}`);
  setPrintBoxState(printAntecedenteEl, safeValue(fields.antecedente.value));
  setPrintBoxState(printJogadorEl, safeValue(fields.nome_jogador.value));
  setPrintBoxState(printRacaEl, fields.subraca.value ? `${safeValue(fields.raca.value)} / ${fields.subraca.value}` : safeValue(fields.raca.value));
  setPrintBoxState(printTendenciaEl, safeValue(fields.alinhamento.value));
  setPrintBoxState(printXpEl, safeValue(fields.xp.value || '0'));

  printAttrGridEl.innerHTML = '';
  Object.entries(ATTR_LABELS).forEach(([key, label]) => {
    const box = document.createElement('div');
    box.className = 'print-box';
    box.innerHTML = `<small>${label}</small><strong>${finalAttrs[key]} (${formatModifier(calculateModifier(finalAttrs[key]))})</strong>`;
    printAttrGridEl.appendChild(box);
  });

  setPrintBoxState(printInspiracaoEl, '');
  setPrintBoxState(printProficienciaEl, `+${fields.proficiencia.value || 2}`);
  setPrintBoxState(printSavesEl, safeValue(fields.testes_resistencia.value));
  setPrintBoxState(printSkillsEl, safeValue(fields.pericias.value));
  setPrintBoxState(printPassivaEl, fields.sabedoria_passiva.value || '10');
  setPrintBoxState(printCaEl, fields.ca.value || '10');
  setPrintBoxState(printIniciativaEl, formatModifier(Number(fields.iniciativa.value || 0)));
  setPrintBoxState(printDeslocamentoEl, safeValue(fields.deslocamento.value, '9 m'));
  setPrintBoxState(printPvTotalEl, fields.vida_max.value || '10');
  setPrintBoxState(printPvAtualEl, fields.vida_atual.value || '10');
  setPrintBoxState(printPvTempEl, fields.vida_temp.value || '0');
  setPrintBoxState(printHitDiceEl, safeValue(fields.dados_vida.value));
  setPrintBoxState(printDeathSuccessEl, '0');
  setPrintBoxState(printDeathFailEl, '0');
  setPrintBoxState(printAttacksEl, safeValue(fields.ataques.value));
  setPrintBoxState(printEquipmentEl, `${armorLabel}\n${safeValue(fields.equipamentos.value)}`);
  setPrintBoxState(printTraitsEl, safeValue(fields.tracos_personalidade.value));
  setPrintBoxState(printIdealsEl, safeValue(fields.ideais.value));
  setPrintBoxState(printBondsEl, safeValue(fields.ligacoes.value));
  setPrintBoxState(printFlawsEl, safeValue(fields.defeitos.value));
  setPrintBoxState(printFeaturesEl, [safeValue(fields.racial_traits_auto.value,''), safeValue(fields.special_resistances_auto.value,''), safeValue(fields.caracteristicas_habilidades.value,'')].filter(Boolean).join('\n\n'));
  setPrintBoxState(printLanguagesEl, [safeValue(fields.idiomas_auto.value,''), safeValue(fields.idiomas_proficiencias.value,'')].filter(Boolean).join('\n\n'));
  setPrintBoxState(printHistoryEl, safeValue(fields.historia.value, 'Nenhuma história registrada.'));
  setPrintBoxState(printSpellClassEl, getSpellConfig(fields.classe.value) ? safeValue(fields.classe.value) : '');
  setPrintBoxState(printSpellAbilityEl, getSpellConfig(fields.classe.value)?.ability ? ATTR_LABELS[getSpellConfig(fields.classe.value).ability] : '');
  setPrintBoxState(printSpellDcEl, getSpellcastingStats() ? String(getSpellcastingStats().saveDC) : '');
  setPrintBoxState(printSpellAttackEl, getSpellcastingStats() ? formatModifier(getSpellcastingStats().attackBonus) : '');

  const byLevel = {0: [], 1: [], 2: [], 3: [], 4: [], 5: []};
  currentSpellSelection.forEach((item) => {
    if (byLevel[item.level]) byLevel[item.level].push(item.name);
  });
  setPrintBoxState(printCantripsEl, byLevel[0].length ? byLevel[0].join(', ') : '');
  setPrintBoxState(printSpell1El, byLevel[1].length ? byLevel[1].join(', ') : '');
  setPrintBoxState(printSpell2El, byLevel[2].length ? byLevel[2].join(', ') : '');
  setPrintBoxState(printSpell3El, byLevel[3].length ? byLevel[3].join(', ') : '');
  setPrintBoxState(printSpell4El, byLevel[4].length ? byLevel[4].join(', ') : '');
  setPrintBoxState(printSpell5El, byLevel[5].length ? byLevel[5].join(', ') : '');
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
  updateArmorOptions();
  updateWeaponOptions();
  updateAttributeModifiers();
  updateRaceBonusLog();
  renderSkillSelector(parseCommaList(fields.skill_proficiencies_input.value));
  updateAutomaticFields();
  updateAutomaticSavesAndSkills();
  renderSpellSelector(currentSpellSelection.map((item) => item.name));
  updateWeaponPreview();
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
    racial_traits_auto: fields.racial_traits_auto.value.trim(),
    special_resistances_auto: fields.special_resistances_auto.value.trim(),
    idiomas_auto: fields.idiomas_auto.value.trim(),
    skill_proficiencies_input: fields.skill_proficiencies_input.value.trim(),
    armor_select: fields.armor_select.value,
    shield_equipped: fields.shield_equipped.value,
    armor_notes: fields.armor_notes.value,
    weapon_select: fields.weapon_select.value,
    weapon_attack_preview: fields.weapon_attack_preview.value,
    weapon_damage_preview: fields.weapon_damage_preview.value,

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
  fields.racial_traits_auto.value = '';
  fields.special_resistances_auto.value = '';
  fields.idiomas_auto.value = '';
  fields.skill_proficiencies_input.value = '';
  fields.armor_select.value = '';
  fields.shield_equipped.value = 'Não';
  fields.armor_notes.value = '';
  fields.weapon_select.value = '';
  fields.weapon_attack_preview.value = '';
  fields.weapon_damage_preview.value = '';
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
  fields.racial_traits_auto.value = payload.racial_traits_auto || '';
  fields.special_resistances_auto.value = payload.special_resistances_auto || '';
  fields.idiomas_auto.value = payload.idiomas_auto || '';
  fields.skill_proficiencies_input.value = payload.skill_proficiencies_input || '';
  updateArmorOptions();
  fields.armor_select.value = payload.armor_select || fields.armor_select.value;
  fields.shield_equipped.value = payload.shield_equipped || 'Não';
  fields.armor_notes.value = payload.armor_notes || fields.armor_notes.value;
  updateWeaponOptions();
  fields.weapon_select.value = payload.weapon_select || '';
  fields.weapon_attack_preview.value = payload.weapon_attack_preview || '';
  fields.weapon_damage_preview.value = payload.weapon_damage_preview || '';

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

function populateArmors() {
  updateArmorOptions();
}

function populateWeapons() {
  updateWeaponOptions();
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
document.getElementById('btn-print').addEventListener('click', () => { updatePrintSheet(); goToPage('print'); });
document.getElementById('btn-print-now')?.addEventListener('click', () => { updatePrintSheet(); setTimeout(() => window.print(), 120); });
document.getElementById('btn-back-editor')?.addEventListener('click', () => goToPage('editor'));
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
fields.armor_select.addEventListener('change', updatePreview);
fields.shield_equipped.addEventListener('change', updatePreview);
fields.weapon_select.addEventListener('change', () => { updateWeaponPreview(); updateSheetPreview(); });
// skill_proficiencies_input é sincronizado pelo seletor visual de perícias.
document.getElementById('btn-add-weapon').addEventListener('click', () => { appendSelectedWeaponToAttacks(); setFeedback('Arma adicionada em Ataques e Magias.'); });
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
