/**
 * Cais OS — Sistema Operacional de Ordens de Serviço & Portal Náutico
 * Cliente-Exemplo: Marina Imperial (Caraguatatuba - SP)
 * Versão: 2.0.0 — Alta Fidelidade Enterprise
 */

const STORAGE_KEY = 'cais_proto_state_v2';

// Banco de Dados Sintético de Alta Fidelidade
const INITIAL_DATA = {
  marina: {
    name: 'Marina Imperial',
    tradeName: 'Marina Imperial Garagem Náutica & Serviços Técnicos Ltda',
    cnpj: '18.492.102/0001-84',
    location: 'Av. José Herculano, 7311 — Porto Novo, Caraguatatuba - SP (Rio Juqueriquerê)',
    coords: '23°41′.842 S, 045°26′.312 W',
    phone: '(12) 98256-8943',
    chiefMechanic: 'Wanderley dos Santos (Certificado Mercury Marine Master Tech #8491)',
    warrantyTerms: '90 dias em serviços e 12 meses em peças genuínas Quicksilver com NF.'
  },
  activeOrder: {
    id: 'OS-2026-089',
    publicToken: 'cais_tok_live_7a8f9b2c',
    version: 1,
    assetName: 'Lancha Schaefer Phantom 303',
    boatYear: '2021',
    hullSize: '30,3 pés / Proa Aberta',
    registrationNumber: 'Capitania SP: 381-098273-1',
    berthLocation: 'Galpão Seco 02 — Vaga G-14 (Elevador 12t)',
    engineModel: 'Mercury MerCruiser 350 MAG MPI 5.7L V8 (300 HP)',
    driveModel: 'Rabeta Bravo Three DuoProp (Hélices em Inox)',
    hoursMeter: '342,4 horas',
    fuelLevel: '65% (Gasolina Náutica Podium)',
    clientName: 'Roberto de Albuquerque Silveira',
    clientCpf: '148.***.***-20',
    clientPhone: '(11) 98144-3210',
    clientEmail: 'roberto.albuquerque@example.com',
    reportedIssue: 'Proprietário relatou alarme sonoro de alta temperatura de água ao ultrapassar 3.200 RPM durante travessia Ilhabela -> Caraguatatuba.',
    createdAt: '11/11/2026 às 08:45',
    status: 'PENDING', // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    approvalStatus: 'AWAITING', // AWAITING, APPROVED, REJECTED
    paymentStatus: 'PENDING', // PENDING, SIGNAL_PAID, FULLY_PAID
    approvedAt: null,
    approvedIp: null,
    totalCents: 415000, // R$ 4.150,00
    signalCents: 124500, // R$ 1.245,00 (30%)
    
    // Checklist de entrada da embarcação (12 pontos no pier)
    checklist: [
      { item: 'Nível e Viscosidade do Óleo do Cárter', status: 'OK', note: '25W-40 Synthetic Blend, nível correto' },
      { item: 'Óleo da Rabeta Bravo Three', status: 'ALERTA', note: 'High Performance 90W, leve turvação com micro-sal' },
      { item: 'Rotor da Bomba de Água Salgada', status: 'CRITICO', note: '3 pás partidas e ressecamento severo' },
      { item: 'Válvula Termostática e Carcaça', status: 'ALERTA', note: 'Incrustação salina impedindo abertura total a 160°F' },
      { item: 'Anodos de Sacrifício da Rabeta', status: 'OK', note: 'Zinco marítimo em 35% de desgaste (aceitável)' },
      { item: 'Foles de Exaustão e Cardan', status: 'OK', note: 'Sem rasgos ou ressecamento visível' },
      { item: 'Bomba de Porão e Automático', status: 'OK', note: 'Rule 1100 acionando em 1.5s' },
      { item: 'Baterias de Partida e Serviço', status: 'OK', note: '2x 105Ah Moura Boat com 12.7V em repouso' },
      { item: 'Tensão da Correia do Alternador', status: 'OK', note: 'Deflexão correta de 8mm sob carga' },
      { item: 'Filtros Racor e Combustível', status: 'OK', note: 'Copo decantador limpo sem presença de água' },
      { item: 'Sistema de Exaustão e Muflas', status: 'ALERTA', note: 'Temperatura de superfície normal, inspeção visual limpa' },
      { item: 'Direção Hidráulica e Cilindro', status: 'OK', note: 'Sem vazamentos nos retentores da barra' }
    ],

    // Evidências Fotográficas do Laudo Pericial
    evidences: [
      {
        id: 'ev-1',
        title: 'Rotor Danificado (Bomba D’água)',
        category: 'Avaria Crítica',
        partNumber: 'Quicksilver #47-862232A02',
        diagnostic: 'Pás de borracha rompidas impedindo fluxo volumétrico de água salgada a partir de 3.000 RPM, gerando superaquecimento no bloco.',
        beforeVisual: '⚠️ ROTOR RESSECADO / PÁS QUEBRADAS',
        afterVisual: '✨ NOVO ROTOR ORIGINAL QUICKSILVER',
        isComparison: true
      },
      {
        id: 'ev-2',
        title: 'Óleo da Rabeta Bravo Three',
        category: 'Contaminação Preventiva',
        partNumber: 'Mercury High Performance #92-858064K01',
        diagnostic: 'Presença inicial de microgotículas de água na drenagem do bujão inferior. Necessária troca de óleo e kit de anéis o-ring de vedação.',
        beforeVisual: '💧 ÓLEO TURVO / COM MICRO-SAL',
        afterVisual: '🟢 ÓLEO VERDE CRISTALINO NOVO',
        isComparison: true
      },
      {
        id: 'ev-3',
        title: 'Carcaça e Espelho da Bomba',
        category: 'Inspeção de Estanqueidade',
        partNumber: 'Housing Kit #46-807151A9',
        diagnostic: 'Desgaste no espelho de inox devido à sucção de areia em bancos do canal. Substituição preventiva para manter pressão nominal de 15 PSI.',
        beforeVisual: '🔍 RISCOS POR AREIA NO ESPELHO',
        afterVisual: '🛡️ ESPELHO INOX 316L RETIFICADO',
        isComparison: false
      }
    ],

    // Detalhamento de Serviços e Peças Genuínas
    items: [
      {
        id: 'it-1',
        category: 'Mão de Obra Especializada',
        code: 'MO-SRV-08',
        desc: 'Desmontagem da rabeta Bravo Three, extração da bomba d’água e desobstrução das galerias de arrefecimento',
        qty: '4,0 horas',
        priceCents: 160000
      },
      {
        id: 'it-2',
        category: 'Peça Genuína Quicksilver',
        code: 'PART-47-862232A02',
        desc: 'Kit completo de rotor e anéis de vedação da bomba d’água (Mercury Original)',
        qty: '1 un',
        priceCents: 125000
      },
      {
        id: 'it-3',
        category: 'Insumo Náutico Certificado',
        code: 'OIL-92-858064K01',
        desc: 'Óleo sintético de engrenagens de rabeta Mercury High Performance Gear Lube (2,8 litros) + anéis magnéticos de bujão',
        qty: '3 qts',
        priceCents: 68000
      },
      {
        id: 'it-4',
        category: 'Teste & Homologação em Água',
        code: 'TEST-RIO-01',
        desc: 'Teste hidrostático de pressão, verificação de telemetria térmica em bancada e teste de rodagem monitorado no Rio Juqueriquerê',
        qty: '1 serviço',
        priceCents: 62000
      }
    ],

    // Linha do Tempo da Ordem de Serviço
    timeline: [
      { step: 'Check-in & Içamento', date: '11/11 08:30', done: true, desc: 'Lancha içada no elevador 12t e posicionada no box de manutenção.' },
      { step: 'Vistoria & Laudo Técnico', date: '11/11 09:15', done: true, desc: 'Mecânico Wanderley concluiu desmontagem e diagnóstico fotográfico.' },
      { step: 'Aprovação & Sinal Pix', date: 'Aguardando Cliente', done: false, current: true, desc: 'Aguardando validação do proprietário para compra de peças.' },
      { step: 'Montagem & Torque de Fábrica', date: 'Previsto: D+1', done: false, desc: 'Substituição das peças com torquímetro calibrado conforme manual de serviço.' },
      { step: 'Teste no Rio & Entrega na Vaga', date: 'Previsto: D+2', done: false, desc: 'Adoçamento em água doce, teste de temperatura em 4.000 RPM e liberação.' }
    ]
  },

  allOrders: [
    { id: 'OS-2026-089', boat: 'Schaefer Phantom 303', client: 'Roberto Albuquerque', phone: '(11) 98144-3210', total: 'R$ 4.150,00', signal: 'R$ 1.245,00', status: 'PENDING', approval: 'AWAITING', bay: 'Box 02' },
    { id: 'OS-2026-088', boat: 'Cimitarra 360 Fly', client: 'Marcio Toledo', phone: '(11) 97233-1100', total: 'R$ 8.900,00', signal: 'R$ 2.670,00', status: 'IN_PROGRESS', approval: 'APPROVED', bay: 'Box 04' },
    { id: 'OS-2026-087', boat: 'Focker 242 GTO', client: 'Carlos Eduardo Mendes', phone: '(12) 99120-4499', total: 'R$ 2.450,00', signal: 'R$ 2.450,00', status: 'COMPLETED', approval: 'APPROVED', bay: 'Vaga Seca' },
    { id: 'OS-2026-086', boat: 'Real 330 Special Edition', client: 'Fernanda Lacerda', phone: '(11) 98877-5522', total: 'R$ 6.300,00', signal: 'R$ 0,00', status: 'CANCELLED', approval: 'REJECTED', bay: 'Pátio' }
  ],

  // Trilha de Auditoria Imutável (Audit Trail)
  auditLogs: [
    { id: 'log-1', timestamp: '11/11/2026 08:45:10', actor: 'Wanderley (Mecânico)', action: 'CREATE_ORDER', desc: 'Abertura da OS-2026-089 e upload de 3 fotos de diagnóstico' },
    { id: 'log-2', timestamp: '11/11/2026 08:50:22', actor: 'Carlos (Gerente)', action: 'GENERATE_PUBLIC_LINK', desc: 'Emissão de token criptográfico v1 para Roberto Albuquerque' }
  ]
};

// Funções de Persistência
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { console.warn(e); }
  }
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = JSON.parse(JSON.stringify(INITIAL_DATA));
  saveState();
  renderApp();
}

function formatMoney(cents) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getPixPayload(order) {
  const val = (order.signalCents / 100).toFixed(2);
  return `00020126580014br.gov.bcb.pix0136marina-imperial-pix-key-sample-uuid520400005303986540${val.length}${val}5802BR5915MARINA IMPERIAL6014CARAGUATATUBA62070503***6304E8A2`;
}

// Estados de Visualização
// Estados de Visualização (4 Perfis Canônicos)
let currentScreen = 'whatsapp'; // 'whatsapp' | 'client' | 'mechanic' | 'admin'
let currentViewport = 'mobile'; // 'mobile' | 'tablet' | 'desktop'
let currentTheme = 'light';
let activeModalEvidence = null;

function setScreen(screen) {
  currentScreen = screen;
  if (screen === 'whatsapp' || screen === 'client') {
    currentViewport = 'mobile';
  } else if (screen === 'mechanic') {
    currentViewport = 'tablet';
  } else if (screen === 'admin') {
    currentViewport = 'desktop';
  }
  setViewport(currentViewport);
  renderApp();
}

function togglePureMode() {
  document.body.classList.toggle('pure-view');
  const isPure = document.body.classList.contains('pure-view');
  showToast(isPure ? '👁️ Modo Limpo ativado (barra oculta)' : 'Modo Protótipo restaurado');
}

function setViewport(vp) {
  currentViewport = vp;
  const wrapper = document.getElementById('deviceWrapper');
  if (wrapper) wrapper.className = `device-wrapper mode-${vp}`;
  document.querySelectorAll('.btn-vp').forEach(b => {
    b.classList.toggle('active', b.dataset.vp === vp);
  });
}

function toggleTheme() {
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = (currentTheme === 'light') ? '🌙 Modo Escuro' : '☀️ Modo Claro';
}

// Ações do Fluxo do Cliente
function approveOrder() {
  state.activeOrder.approvalStatus = 'APPROVED';
  state.activeOrder.versionLock = 'v1-approved';
  state.activeOrder.approvedAt = new Date().toLocaleString('pt-BR');
  state.activeOrder.approvedIp = '189.120.44.12 (Conexão 5G Claro / Caraguatatuba)';
  state.activeOrder.status = 'IN_PROGRESS';
  
  // Atualizar timeline
  state.activeOrder.timeline[2].done = true;
  state.activeOrder.timeline[2].date = new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  state.activeOrder.timeline[3].current = true;

  // Registrar auditoria
  state.auditLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('pt-BR'),
    actor: 'Roberto Albuquerque (Cliente)',
    action: 'APPROVE_ORDER_V1',
    desc: `Aprovação da versão 1 do orçamento via link público autenticado (R$ 4.150,00). IP: ${state.activeOrder.approvedIp}`
  });

  saveState();
  openPixModal();
  renderApp();
}

function simulatePixPayment() {
  state.activeOrder.paymentStatus = 'SIGNAL_PAID';
  
  state.auditLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('pt-BR'),
    actor: 'Gateway Asaas / Banco Central',
    action: 'WEBHOOK_PIX_SETTLED',
    desc: 'Sinal de R$ 1.245,00 liquidado instantaneamente via Pix. Transação: pix_tx_894129841'
  });

  saveState();
  closeModal();
  renderApp();
  showToast('✓ Pagamento Confirmado! O mecânico Wanderley já foi notificado para liberar as peças Quicksilver.');
}

function copyPixCode() {
  const code = getPixPayload(state.activeOrder);
  const handleSuccess = () => {
    const btn = document.getElementById('btnCopyPix');
    if (btn) {
      btn.textContent = '✓ Código Copiado!';
      setTimeout(() => { btn.textContent = 'Copiar Código Pix'; }, 2500);
    }
    showToast('✓ Código Pix copiado para a área de transferência!');
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(handleSuccess).catch(() => {
      fallbackCopyText(code);
      handleSuccess();
    });
  } else {
    fallbackCopyText(code);
    handleSuccess();
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Falha ao copiar texto:', err);
  }
  document.body.removeChild(ta);
}

function openPixModal() {
  const modal = document.getElementById('pixModal');
  if (modal) modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('pixModal');
  if (modal) modal.style.display = 'none';
  const evModal = document.getElementById('evidenceModal');
  if (evModal) evModal.style.display = 'none';
}

// Estados e Controles de Interação da Visão 2 (Design Spells)
let currentChecklistFilter = 'all'; // 'all' | 'attention' | 'ok'
let evidenceTabState = {
  'ev-1': 'before',
  'ev-2': 'before',
  'ev-3': 'before'
};
let activeHotspot = 'rotor'; // 'rotor' | 'rabeta' | 'eletrica'

const HOTSPOT_DATA = {
  rotor: {
    badge: 'PONTO #01 • FALHA CRÍTICA',
    part: 'Quicksilver #47-862232A02',
    title: 'Rotor da Bomba de Água Salgada (Impeller)',
    desc: '3 pás de neoprene rompidas por ressecamento severo. Perda de 68% de vazão no trocador de calor acima de 3.200 RPM, disparando o alarme de 98°C relatado.',
    metric: '32% (Crítico)',
    barWidth: '32%',
    price: 'R$ 1.890,00',
    statusClass: 'cat-critico',
    evidenceId: 'ev-1'
  },
  rabeta: {
    badge: 'PONTO #02 • ALERTA DE CONTAMINAÇÃO',
    part: 'Mercury High Performance #92-858064K01',
    title: 'Conjunto Rabeta Bravo Three & Retentor de Hélice',
    desc: 'Óleo sintético 90W com emulsão inicial de microgotículas salinas. Troca preventiva imediata dos anéis de vedação para proteger a engrenagem cônica.',
    metric: '54% (Atenção)',
    barWidth: '54%',
    price: 'R$ 1.480,00',
    statusClass: 'cat-alerta',
    evidenceId: 'ev-2'
  },
  eletrica: {
    badge: 'PONTO #08 • INSPECIONADO E CONFORME',
    part: 'Baterias Moura Boat 105Ah',
    title: 'Banco de Baterias de Partida, Serviço & Alternador',
    desc: 'Tensão de repouso em 12.78V e carga estável em 14.2V sob regime de cruzeiro. Terminais estanhados sem sulfatação ou corrosão galvânica.',
    metric: '99% (Padrão)',
    barWidth: '99%',
    price: 'R$ 0,00 (Conforme)',
    statusClass: 'done',
    evidenceId: null
  }
};

function selectHotspot(key) {
  activeHotspot = key;
  renderApp();
}

function setChecklistFilter(filter) {
  currentChecklistFilter = filter;
  renderApp();
}

function toggleEvidenceView(evId, mode) {
  evidenceTabState[evId] = mode;
  renderApp();
}

function copyPartNumber(pn, btnId) {
  const handleSuccess = () => {
    const btn = document.getElementById(btnId);
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copiado';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }
    showToast(`✓ Part Number ${pn} copiado!`);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(pn).then(handleSuccess).catch(() => {
      fallbackCopyText(pn);
      handleSuccess();
    });
  } else {
    fallbackCopyText(pn);
    handleSuccess();
  }
}

function getEvidenceVisualSvg(evId, mode) {
  if (evId === 'ev-1') {
    if (mode === 'before') {
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="var(--cais-surface-sunken)" rx="6"/>
          <circle cx="100" cy="50" r="38" fill="var(--cais-surface)" stroke="var(--cais-negative)" stroke-width="2" stroke-dasharray="4 2"/>
          <circle cx="100" cy="50" r="14" fill="var(--cais-surface-sunken)" stroke="var(--cais-border-strong)" stroke-width="2"/>
          <line x1="100" y1="36" x2="100" y2="16" stroke="var(--cais-negative)" stroke-width="5" stroke-linecap="round"/>
          <line x1="112" y1="43" x2="132" y2="32" stroke="var(--cais-negative)" stroke-width="5" stroke-linecap="round"/>
          <line x1="112" y1="57" x2="122" y2="64" stroke="var(--cais-negative)" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 4"/>
          <line x1="100" y1="64" x2="100" y2="84" stroke="var(--cais-negative)" stroke-width="5" stroke-linecap="round"/>
          <line x1="88" y1="57" x2="74" y2="66" stroke="var(--cais-negative)" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 4"/>
          <line x1="88" y1="43" x2="68" y2="32" stroke="var(--cais-negative)" stroke-width="5" stroke-linecap="round"/>
          <rect x="20" y="96" width="160" height="18" rx="9" fill="var(--cais-negative-bg)"/>
          <text x="100" y="108" text-anchor="middle" fill="var(--cais-negative)" font-family="var(--cais-font-sans)" font-size="9" font-weight="700">⚠️ 3 PÁS QUEBRADAS • BLOQUEIO TÉRMICO</text>
        </svg>
      `;
    } else {
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="var(--cais-surface-sunken)" rx="6"/>
          <circle cx="100" cy="50" r="38" fill="var(--cais-surface)" stroke="var(--cais-positive)" stroke-width="2"/>
          <circle cx="100" cy="50" r="14" fill="var(--cais-accent-subtle)" stroke="var(--cais-accent)" stroke-width="2"/>
          <line x1="100" y1="36" x2="100" y2="15" stroke="var(--cais-text)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="112" y1="43" x2="131" y2="32" stroke="var(--cais-text)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="112" y1="57" x2="131" y2="68" stroke="var(--cais-text)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="100" y1="64" x2="100" y2="85" stroke="var(--cais-text)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="88" y1="57" x2="69" y2="68" stroke="var(--cais-text)" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="88" y1="43" x2="69" y2="32" stroke="var(--cais-text)" stroke-width="5.5" stroke-linecap="round"/>
          <circle cx="100" cy="50" r="5" fill="var(--cais-warning)"/>
          <rect x="20" y="96" width="160" height="18" rx="9" fill="var(--cais-positive-bg)"/>
          <text x="100" y="108" text-anchor="middle" fill="var(--cais-positive)" font-family="var(--cais-font-sans)" font-size="9" font-weight="700">✨ QUICKSILVER GENUÍNO • 100% FLUXO</text>
        </svg>
      `;
    }
  } else if (evId === 'ev-2') {
    if (mode === 'before') {
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="var(--cais-surface-sunken)" rx="6"/>
          <rect x="80" y="15" width="40" height="70" rx="8" fill="var(--cais-surface)" stroke="var(--cais-warning)" stroke-width="2"/>
          <path d="M81 40 Q90 38 100 40 T119 40 L119 78 Q119 84 100 84 Q81 84 81 78 Z" fill="var(--cais-warning-bg)"/>
          <circle cx="90" cy="55" r="2.5" fill="var(--cais-border-strong)"/>
          <circle cx="108" cy="50" r="2" fill="var(--cais-border-strong)"/>
          <circle cx="98" cy="65" r="3" fill="var(--cais-border-strong)"/>
          <circle cx="112" cy="70" r="2" fill="var(--cais-border-strong)"/>
          <rect x="18" y="96" width="164" height="18" rx="9" fill="var(--cais-warning-bg)"/>
          <text x="100" y="108" text-anchor="middle" fill="var(--cais-warning)" font-family="var(--cais-font-sans)" font-size="9" font-weight="700">💧 ÓLEO TURVO • MICRO-SAL DETECTADO</text>
        </svg>
      `;
    } else {
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="var(--cais-surface-sunken)" rx="6"/>
          <rect x="80" y="15" width="40" height="70" rx="8" fill="var(--cais-surface)" stroke="var(--cais-positive)" stroke-width="2"/>
          <path d="M81 35 Q90 33 100 35 T119 35 L119 78 Q119 84 100 84 Q81 84 81 78 Z" fill="var(--cais-positive-bg)"/>
          <circle cx="92" cy="48" r="1.5" fill="var(--cais-positive)"/>
          <circle cx="108" cy="58" r="1.5" fill="var(--cais-positive)"/>
          <rect x="18" y="96" width="164" height="18" rx="9" fill="var(--cais-positive-bg)"/>
          <text x="100" y="108" text-anchor="middle" fill="var(--cais-positive)" font-family="var(--cais-font-sans)" font-size="9" font-weight="700">🟢 MERCURY HIGH PERFORMANCE 90W</text>
        </svg>
      `;
    }
  } else {
    // ev-3
    if (mode === 'before') {
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="var(--cais-surface-sunken)" rx="6"/>
          <circle cx="100" cy="50" r="36" fill="var(--cais-surface)" stroke="var(--cais-border-strong)" stroke-width="2"/>
          <circle cx="100" cy="50" r="20" fill="none" stroke="var(--cais-warning)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <circle cx="100" cy="50" r="28" fill="none" stroke="var(--cais-warning)" stroke-width="1.5" stroke-dasharray="3 4"/>
          <circle cx="100" cy="50" r="7" fill="var(--cais-surface-sunken)" stroke="var(--cais-border-strong)" stroke-width="2"/>
          <rect x="22" y="96" width="156" height="18" rx="9" fill="var(--cais-warning-bg)"/>
          <text x="100" y="108" text-anchor="middle" fill="var(--cais-warning)" font-family="var(--cais-font-sans)" font-size="9" font-weight="700">🔍 RANHURAS POR SUCÇÃO DE AREIA</text>
        </svg>
      `;
    } else {
      return `
        <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="var(--cais-surface-sunken)" rx="6"/>
          <circle cx="100" cy="50" r="36" fill="var(--cais-surface)" stroke="var(--cais-positive)" stroke-width="2"/>
          <circle cx="100" cy="50" r="7" fill="var(--cais-surface-sunken)" stroke="var(--cais-border)" stroke-width="2"/>
          <line x1="78" y1="32" x2="122" y2="68" stroke="var(--cais-accent-subtle)" stroke-width="4" stroke-linecap="round"/>
          <line x1="86" y1="32" x2="130" y2="68" stroke="var(--cais-surface)" stroke-width="2" stroke-linecap="round"/>
          <rect x="22" y="96" width="156" height="18" rx="9" fill="var(--cais-positive-bg)"/>
          <text x="100" y="108" text-anchor="middle" fill="var(--cais-positive)" font-family="var(--cais-font-sans)" font-size="9" font-weight="700">🛡️ ESPELHO INOX 316L RETIFICADO</text>
        </svg>
      `;
    }
  }
}

function openEvidenceModal(evidenceId) {
  const ev = state.activeOrder.evidences.find(e => e.id === evidenceId);
  if (!ev) return;
  activeModalEvidence = ev;
  const modal = document.getElementById('evidenceModal');
  const body = document.getElementById('evidenceModalBody');
  if (modal && body) {
    const badgeClass = ev.category.includes('Crítica') ? 'cat-critico' : (ev.category.includes('Preventiva') ? 'cat-alerta' : 'cat-preventivo');
    body.innerHTML = `
      <div style="margin-bottom: var(--cais-space-3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-1);">
          <span class="evidence-cat-badge ${badgeClass}">${ev.category}</span>
          <span style="font-size: 11px; font-weight: 600; color: var(--cais-text-secondary);">Laudo Pericial Oficial</span>
        </div>
        <h2 style="font-size: var(--cais-fs-lg); margin-top: var(--cais-space-1);">${ev.title}</h2>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
          <div class="evidence-pn-badge">
            Part Number: <strong>${ev.partNumber}</strong>
          </div>
          <button id="modalBtnCopyPn" class="btn-mini-copy" onclick="copyPartNumber('${ev.partNumber}', 'modalBtnCopyPn')">
            📋 Copiar Part Number
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--cais-space-3); margin-bottom: var(--cais-space-3);">
        <div style="border: 1px solid var(--cais-negative); border-radius: var(--cais-radius-md); padding: var(--cais-space-2); background-color: var(--cais-negative-bg);">
          <div style="font-size: 10px; font-weight: 700; color: var(--cais-negative); margin-bottom: var(--cais-space-1); text-align: center;">PEÇA ATUAL DANIFICADA</div>
          <div style="height: 120px; border-radius: var(--cais-radius-sm); overflow: hidden;">
            ${getEvidenceVisualSvg(ev.id, 'before')}
          </div>
        </div>
        <div style="border: 1px solid var(--cais-positive); border-radius: var(--cais-radius-md); padding: var(--cais-space-2); background-color: var(--cais-positive-bg);">
          <div style="font-size: 10px; font-weight: 700; color: var(--cais-positive); margin-bottom: var(--cais-space-1); text-align: center;">SUBSTITUTO GENUÍNO</div>
          <div style="height: 120px; border-radius: var(--cais-radius-sm); overflow: hidden;">
            ${getEvidenceVisualSvg(ev.id, 'after')}
          </div>
        </div>
      </div>

      <div style="background-color: var(--cais-surface-sunken); padding: var(--cais-space-3); border-radius: var(--cais-radius-md); font-size: var(--cais-fs-sm); line-height: 1.6; margin-bottom: var(--cais-space-3); border-left: 3px solid var(--cais-accent);">
        <strong>Parecer Pericial do Chefe de Oficina (Wanderley):</strong><br>
        ${ev.diagnostic}
      </div>
    `;
    modal.style.display = 'flex';
  }
}

function showToast(msg) {
  let toast = document.getElementById('caisToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'caisToast';
    toast.className = 'cais-toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 4000);
}

// Renderizador da Visão 2: App Mobile do Cliente (Alta Fidelidade Enterprise)
function renderClientView() {
  const o = state.activeOrder;
  const isApproved = o.approvalStatus === 'APPROVED';
  const isPaid = o.paymentStatus === 'SIGNAL_PAID';

  // Filtragem de Checklist Reativa
  let filteredChecklist = o.checklist;
  if (currentChecklistFilter === 'attention') {
    filteredChecklist = o.checklist.filter(c => c.status === 'CRITICO' || c.status === 'ALERTA');
  } else if (currentChecklistFilter === 'ok') {
    filteredChecklist = o.checklist.filter(c => c.status === 'OK');
  }

  const okCount = o.checklist.filter(c => c.status === 'OK').length;
  const alertCount = o.checklist.filter(c => c.status === 'ALERTA').length;
  const critCount = o.checklist.filter(c => c.status === 'CRITICO').length;
  const attentionCount = alertCount + critCount;

  return `
    <div class="portal-view">
      <!-- Topo Náutico & Hero Card da Embarcação (Supahero + Deck.gallery) -->
      <header class="portal-hero-container">
        <div class="portal-marina-navbar">
          <div class="portal-brand-wrap">
            <div class="portal-brand-symbol">⚓</div>
            <div>
              <div class="portal-brand-title">${state.marina.name}</div>
              <div class="portal-brand-sub">Caraguatatuba • Rio Juqueriquerê</div>
            </div>
          </div>
          <div class="portal-os-chip">
            <span class="os-chip-label">OS</span>
            <span class="os-chip-val">#${o.id}</span>
            <span class="os-chip-ver">v${o.version}</span>
          </div>
        </div>

        <!-- Vessel Hero Bento Card -->
        <div class="vessel-hero-card">
          <div class="vessel-badge-row">
            <span class="vessel-type-pill">🛥️ Embarcação Homologada</span>
            <div class="vessel-status-live ${isApproved ? (isPaid ? 'status-paid' : 'status-approved') : 'status-waiting'}">
              <span class="pulse-dot"></span>
              <span>${isApproved ? (isPaid ? 'Sinal Liquidado' : 'Aguardando Sinal') : 'Aguardando Aprovação'}</span>
            </div>
          </div>

          <h1 class="vessel-name">${o.assetName}</h1>
          <div class="vessel-meta-sub">${o.hullSize} • Ano ${o.boatYear} • ${o.registrationNumber}</div>

          <!-- Bento Grid de Telemetria -->
          <div class="vessel-bento-grid">
            <div class="vessel-bento-item">
              <span class="bento-lbl">⏱️ Horímetro</span>
              <span class="bento-val">${o.hoursMeter}</span>
            </div>
            <div class="vessel-bento-item">
              <span class="bento-lbl">⚡ Motor</span>
              <span class="bento-val">MerCruiser 350 MAG</span>
            </div>
            <div class="vessel-bento-item">
              <span class="bento-lbl">⚙️ Rabeta</span>
              <span class="bento-val">Bravo Three Inox</span>
            </div>
            <div class="vessel-bento-item">
              <span class="bento-lbl">⛽ Tanque</span>
              <span class="bento-val">${o.fuelLevel.split(' ')[0]} Podium</span>
            </div>
            <div class="vessel-bento-item">
              <span class="bento-lbl">📍 Vaga Seca</span>
              <span class="bento-val">Box G-14 (Elev. 12t)</span>
            </div>
            <div class="vessel-bento-item">
              <span class="bento-lbl">👨‍🔧 Técnico</span>
              <span class="bento-val">Wanderley (Master)</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Faixa de Alerta e Status Transacional -->
      <div class="portal-status-strip ${isApproved ? 'status-approved' : 'status-pending'}">
        <div style="display: flex; align-items: center; gap: var(--cais-space-2);">
          <span style="font-size: var(--cais-fs-md);">${isApproved ? (isPaid ? '🛡️' : '⏳') : '⚠️'}</span>
          <div>
            <div>${isApproved 
              ? (isPaid ? 'Orçamento Aprovado & Sinal Liquidado' : 'Aprovado! Aguardando Sinal Pix de 30%') 
              : 'Laudo Concluído — Aguardando Aprovação'}</div>
            <div style="font-size: var(--cais-fs-xs); opacity: 0.85; font-weight: normal;">
              ${isApproved 
                ? `Confirmado em ${o.approvedAt}` 
                : 'Revise os itens e libere o início do serviço no box.'}
            </div>
          </div>
        </div>
        ${!isApproved ? `
          <button class="proto-btn-action" style="font-weight: 700; border-color: var(--cais-warning);" onclick="approveOrder()">
            Aprovar Já
          </button>
        ` : ''}
      </div>

      <div class="portal-content">
        <!-- Seção 1: Motivo do Chamado e Sintoma -->
        <section class="cais-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--cais-space-2);">
            <h2 class="card-title" style="margin-bottom: 0;">🧭 Relato de Entrada & Sintoma</h2>
            <span class="proto-badge-sample" style="background-color: var(--cais-accent-subtle); color: var(--cais-accent);">Marina Imperial</span>
          </div>
          <p class="quote-callout">
            "${o.reportedIssue}"
          </p>
          <div style="margin-top: var(--cais-space-3); font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--cais-space-1);">
            <span>Responsável Técnico: <strong>${state.marina.chiefMechanic}</strong></span>
            <span>Entrada: ${o.createdAt}</span>
          </div>
        <!-- Seção 1.5: Gêmeo Digital Técnico da Embarcação (Digital Twin Blueprint) -->
        <section class="cais-card blueprint-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-2);">
            <div>
              <h2 class="card-title" style="margin-bottom: 0;">📐 Mapa Ilustrativo de Inspeção Náutica</h2>
              <p style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); margin-top: 2px;">
                Schaefer Phantom 303 • Calado: 0.92m • Selecione um sensor para laudo detalhado:
              </p>
            </div>
            <span style="font-size: 10px; font-family: var(--cais-font-mono); background-color: var(--cais-accent-subtle); color: var(--cais-accent); padding: 2px 6px; border-radius: var(--cais-radius-sm); font-weight: 700;">
              12/12 PONTOS
            </span>
          </div>

          <!-- Silhueta Vetorial SVG da Lancha Schaefer Phantom 303 com Hotspots -->
          <div class="blueprint-svg-wrap">
            <svg viewBox="0 0 700 220" class="blueprint-svg" aria-label="Silhueta técnica da lancha com sensores de diagnóstico">
              <defs>
                <linearGradient id="caisHullGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="var(--cais-accent)" stop-opacity="0.15"/>
                  <stop offset="70%" stop-color="var(--cais-accent)" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="var(--cais-accent)" stop-opacity="0.1"/>
                </linearGradient>
              </defs>
              <!-- Linha d'água -->
              <line x1="20" y1="155" x2="680" y2="155" stroke="var(--cais-accent)" stroke-dasharray="6 4" stroke-width="1" opacity="0.4"/>
              <text x="30" y="172" fill="var(--cais-text-secondary)" font-size="10" font-family="var(--cais-font-mono)">LINHA D'ÁGUA • CALADO 0.92m</text>

              <!-- Casco da Schaefer Phantom 303 -->
              <path d="M80,120 L210,75 L390,70 L520,105 L650,110 L595,155 L125,160 L95,145 Z" fill="url(#caisHullGrad)" stroke="var(--cais-accent)" stroke-width="1.8"/>
              <!-- Cabine e Pára-brisa -->
              <path d="M235,75 L315,42 L435,55 L485,103 Z" fill="var(--cais-accent-subtle)" stroke="var(--cais-accent)" stroke-width="1.2" opacity="0.7"/>
              <!-- Compartimento do Motor V8 -->
              <rect x="115" y="108" width="95" height="42" rx="6" fill="var(--cais-negative-bg)" stroke="var(--cais-negative)" stroke-width="1.2" stroke-dasharray="3 2"/>
              <!-- Rabeta Bravo Three (Duoprop) -->
              <path d="M82,128 L55,145 L48,182 L78,182 L95,148 Z" fill="var(--cais-warning-bg)" stroke="var(--cais-warning)" stroke-width="1.5"/>
            </svg>

            <!-- Hotspot 1: Bomba D'água (Crítico) -->
            <button class="blueprint-hotspot-btn hs-1 ${activeHotspot === 'rotor' ? 'active' : ''}" onclick="selectHotspot('rotor')" aria-label="Sensor 1: Rotor da Bomba D'água Salgada (Crítico)">
              <span class="hs-ping ping-critical"></span>
              <span class="hs-circle circle-critical">1</span>
            </button>

            <!-- Hotspot 2: Rabeta Bravo Three (Alerta) -->
            <button class="blueprint-hotspot-btn hs-2 ${activeHotspot === 'rabeta' ? 'active' : ''}" onclick="selectHotspot('rabeta')" aria-label="Sensor 2: Rabeta Bravo Three (Alerta de Contaminação)">
              <span class="hs-ping ping-warning"></span>
              <span class="hs-circle circle-warning">2</span>
            </button>

            <!-- Hotspot 3: Baterias e Elétrica (OK) -->
            <button class="blueprint-hotspot-btn hs-3 ${activeHotspot === 'eletrica' ? 'active' : ''}" onclick="selectHotspot('eletrica')" aria-label="Sensor 3: Baterias e Alternador (Conforme)">
              <span class="hs-circle circle-ok">✓</span>
            </button>
          </div>

          <!-- Painel Forense do Sensor Ativo -->
          ${(() => {
            const hs = HOTSPOT_DATA[activeHotspot];
            return `
              <div class="hotspot-forensic-panel">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="evidence-cat-badge ${hs.statusClass}">${hs.badge}</span>
                  <span style="font-family: var(--cais-font-mono); font-size: 11px; color: var(--cais-text-secondary);">${hs.part}</span>
                </div>
                <h3 style="font-size: var(--cais-fs-sm); font-weight: 700; color: var(--cais-text); margin: 2px 0;">${hs.title}</h3>
                <p style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); line-height: 1.5; margin: 4px 0 8px 0;">${hs.desc}</p>
                
                <div class="hs-metric-box">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--cais-font-mono); margin-bottom: 4px;">
                    <span style="color: var(--cais-text-secondary);">Capacidade Operacional Residual</span>
                    <span style="font-weight: 700; color: ${activeHotspot === 'rotor' ? 'var(--cais-negative)' : (activeHotspot === 'rabeta' ? 'var(--cais-warning)' : 'var(--cais-positive)')};">${hs.metric}</span>
                  </div>
                  <div class="hs-metric-track">
                    <div class="hs-metric-bar" style="width: ${hs.barWidth}; background-color: ${activeHotspot === 'rotor' ? 'var(--cais-negative)' : (activeHotspot === 'rabeta' ? 'var(--cais-warning)' : 'var(--cais-positive)')};"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 10px; font-family: var(--cais-font-mono); color: var(--cais-text-secondary); margin-top: 4px;">
                    <span>Temperatura Máx: 98.4°C</span>
                    <span>Faixa Nominal: 79°C - 85°C</span>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--cais-space-2); padding-top: var(--cais-space-2); border-top: 1px dashed var(--cais-border);">
                  <div style="font-size: var(--cais-fs-xs);">
                    <span style="color: var(--cais-text-secondary); display: block; font-size: 10px;">Estimativa Peça + Mão de Obra:</span>
                    <strong style="font-family: var(--cais-font-mono); font-size: var(--cais-fs-sm);">${hs.price}</strong>
                  </div>
                  ${hs.evidenceId ? `
                    <button class="proto-btn-action" style="min-height: 36px; padding: 0 var(--cais-space-2); font-size: 11px;" onclick="openEvidenceModal('${hs.evidenceId}')">
                      🔍 Ver Laudo Fotográfico
                    </button>
                  ` : `
                    <span style="font-size: 11px; color: var(--cais-positive); font-family: var(--cais-font-mono);">● Sem intervenção requerida</span>
                  `}
                </div>
              </div>
            `;
          })()}
        </section>

        <!-- Seção 2: Laudo Pericial Fotográfico com Comparador Antes/Depois (Design Spells) -->
        <section class="cais-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-1);">
            <h2 class="card-title" style="margin-bottom: 0;">📸 Laudo Pericial Fotográfico (Antes vs Depois)</h2>
          </div>
          <p style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); margin-bottom: var(--cais-space-2);">
            Alterne entre a peça danificada e o componente genuíno, ou abra o exame pericial ampliado:
          </p>

          <div class="evidence-grid">
            ${o.evidences.map((ev, idx) => {
              const currentTab = evidenceTabState[ev.id] || 'before';
              const badgeClass = ev.category.includes('Crítica') ? 'cat-critico' : (ev.category.includes('Preventiva') ? 'cat-alerta' : 'cat-preventivo');
              return `
                <div class="evidence-card-enhanced">
                  <div class="evidence-header-row">
                    <span class="evidence-cat-badge ${badgeClass}">${ev.category}</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <span class="evidence-pn-badge">${ev.partNumber}</span>
                      <button id="copyPnBtn_${idx}" class="btn-mini-copy" onclick="copyPartNumber('${ev.partNumber}', 'copyPnBtn_${idx}')" title="Copiar Part Number">
                        📋 Copiar
                      </button>
                    </div>
                  </div>

                  <h3 style="font-size: var(--cais-fs-sm); font-weight: 700; color: var(--cais-text); margin: 2px 0;">
                    ${ev.title}
                  </h3>

                  <!-- Toggle Interativo Tátil Antes/Depois -->
                  <div class="evidence-toggle-bar">
                    <button class="evidence-toggle-btn ${currentTab === 'before' ? 'active' : ''}" onclick="toggleEvidenceView('${ev.id}', 'before')">
                      ⚠️ Peça Danificada
                    </button>
                    <button class="evidence-toggle-btn ${currentTab === 'after' ? 'active' : ''}" onclick="toggleEvidenceView('${ev.id}', 'after')">
                      ✨ Substituto Genuíno
                    </button>
                  </div>

                  <!-- Visualizador Vetorial de Alta Precisão -->
                  <div class="evidence-view-container">
                    ${getEvidenceVisualSvg(ev.id, currentTab)}
                  </div>

                  <p style="font-size: 11px; color: var(--cais-text-secondary); line-height: 1.4; margin-top: 2px;">
                    ${ev.diagnostic}
                  </p>

                  <button class="evidence-zoom-trigger" onclick="openEvidenceModal('${ev.id}')">
                    🔍 Abrir Exame Pericial em Alta Definição
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Seção 3: Checklist Pré-Navegação Filtrável (12 Pontos) -->
        <section class="cais-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-2);">
            <h2 class="card-title" style="margin-bottom: 0;">🔎 Checklist Pré-Navegação no Pier</h2>
            <span style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); font-family: var(--cais-font-mono);">12 itens</span>
          </div>

          <!-- Resumo de Contadores -->
          <div class="checklist-summary-row">
            <span class="checklist-summary-badge badge-ok">✓ ${okCount} Conformes</span>
            <span class="checklist-summary-badge badge-alerta">⚠️ ${alertCount} Em Alerta</span>
            <span class="checklist-summary-badge badge-critico">✕ ${critCount} Crítico</span>
          </div>

          <!-- Filtro Tátil de 1 Toque (Mobbin) -->
          <div class="checklist-filter-bar">
            <button class="checklist-filter-pill ${currentChecklistFilter === 'all' ? 'active' : ''}" onclick="setChecklistFilter('all')">
              Todos (12)
            </button>
            <button class="checklist-filter-pill ${currentChecklistFilter === 'attention' ? 'active' : ''}" onclick="setChecklistFilter('attention')">
              Atenção (${attentionCount})
            </button>
            <button class="checklist-filter-pill ${currentChecklistFilter === 'ok' ? 'active' : ''}" onclick="setChecklistFilter('ok')">
              Conformes (${okCount})
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--cais-space-2);">
            ${filteredChecklist.map(chk => {
              const badgeClass = chk.status === 'OK' ? 'done' : (chk.status === 'CRITICO' ? 'cancelled' : 'pending');
              const icon = chk.status === 'OK' ? '✓' : (chk.status === 'CRITICO' ? '✕' : '⚠️');
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--cais-fs-xs); padding: var(--cais-space-2) 0; border-bottom: 1px dashed var(--cais-border);">
                  <div style="display: flex; flex-direction: column; padding-right: var(--cais-space-2);">
                    <span style="font-weight: 600; color: var(--cais-text);">${chk.item}</span>
                    <span style="color: var(--cais-text-secondary); font-size: 11px; margin-top: 1px;">${chk.note}</span>
                  </div>
                  <span class="os-tag ${badgeClass}" style="flex-shrink: 0;">${icon} ${chk.status}</span>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Seção 4: Linha do Tempo e Telemetria da Ordem -->
        <section class="cais-card">
          <h2 class="card-title">⏱️ Linha do Tempo da Manutenção (Pit-Stop)</h2>
          <div style="display: flex; flex-direction: column; gap: var(--cais-space-3); margin-top: var(--cais-space-2);">
            ${o.timeline.map((step, idx) => `
              <div style="display: flex; gap: var(--cais-space-3); position: relative;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${step.done ? 'var(--cais-positive)' : (step.current ? 'var(--cais-warning)' : 'var(--cais-surface-sunken)')}; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">
                    ${step.done ? '✓' : (idx + 1)}
                  </div>
                  ${idx < o.timeline.length - 1 ? '<div style="width: 2px; flex: 1; background-color: var(--cais-border); margin: 4px 0;"></div>' : ''}
                </div>
                <div style="flex: 1; padding-bottom: var(--cais-space-2);">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <span style="font-size: var(--cais-fs-sm); font-weight: 700; color: ${step.current ? 'var(--cais-accent)' : 'var(--cais-text)'};">${step.step}</span>
                    <span style="font-size: 11px; font-family: var(--cais-font-mono); color: var(--cais-text-secondary);">${step.date}</span>
                  </div>
                  <p style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); margin-top: 2px;">${step.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Seção 5: Tabela de Itens e Discriminação Financeira -->
        <section class="cais-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-2);">
            <h2 class="card-title" style="margin-bottom: 0;">📋 Itens, Peças Genuínas & Mão de Obra</h2>
            <span style="font-size: 11px; font-family: var(--cais-font-mono); color: var(--cais-accent); font-weight: 700;">4 Lançamentos</span>
          </div>

          <div class="items-list">
            ${o.items.map(it => `
              <div class="item-row">
                <div style="flex: 1; padding-right: var(--cais-space-2);">
                  <div class="item-desc">${it.desc}</div>
                  <div class="item-cat">
                    <span>${it.category}</span> • <span style="font-family: var(--cais-font-mono); font-weight: 600;">${it.code}</span> • <span>Qtd: ${it.qty}</span>
                  </div>
                </div>
                <div class="item-price">${formatMoney(it.priceCents)}</div>
              </div>
            `).join('')}
          </div>

          <div class="totals-box">
            <div class="total-line">
              <span>Subtotal Peças & Mão de Obra</span>
              <span style="font-family: var(--cais-font-mono); font-weight: 600;">${formatMoney(o.totalCents)}</span>
            </div>
            <div class="total-line signal-highlight">
              <div>
                <span>Sinal Requerido (30% p/ Peças Quicksilver)</span>
                <div style="font-size: 10px; opacity: 0.85; font-weight: normal;">Reserva e faturamento imediato no distribuidor</div>
              </div>
              <span style="font-family: var(--cais-font-mono); font-size: var(--cais-fs-lg); font-weight: 700;">${formatMoney(o.signalCents)}</span>
            </div>
            <div class="total-line grand-total">
              <span>Valor Total Fechado (Versão 1)</span>
              <span style="font-family: var(--cais-font-mono);">${formatMoney(o.totalCents)}</span>
            </div>
            <div style="font-size: 11px; color: var(--cais-text-secondary); text-align: right; margin-top: 4px;">
              Saldo restante de ${formatMoney(o.totalCents - o.signalCents)} pago após teste de rio no Pier da Marina.
            </div>
          </div>
        </section>

        <!-- Seção 6: Garantias Oficiais & Selo Digital Imutável (Audit Trail) -->
        <section class="cais-card" style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary); line-height: 1.6;">
          <h3 style="font-size: var(--cais-fs-sm); color: var(--cais-text); margin-bottom: var(--cais-space-2);">🛡️ Garantias Oficiais Marina Imperial</h3>
          <p>• <strong>Garantia de Mão de Obra:</strong> 90 dias com socorro náutico prioritário no litoral norte de SP.</p>
          <p>• <strong>Peças Genuínas:</strong> 12 meses de garantia de fábrica Mercury Marine do Brasil com nota fiscal.</p>
          <p>• <strong>Homologação no Rio Juqueriquerê:</strong> Nenhuma embarcação é liberada para a vaga seca sem medição de temperatura do motor em tanque de adoçamento ou teste navegando.</p>

          ${isApproved ? `
            <div class="audit-digital-seal">
              <div class="seal-icon-wrap">🛡️</div>
              <div>
                <div style="font-weight: 700; color: var(--cais-positive); font-size: var(--cais-fs-sm);">
                  Ordem de Serviço Assinada & Bloqueada Digitalmente (v1)
                </div>
                <div style="font-size: 11px; margin-top: 2px;">
                  Aprovada por <strong>${o.clientName}</strong> em ${o.approvedAt}.
                </div>
                <div style="font-family: var(--cais-font-mono); font-size: 10px; opacity: 0.8; margin-top: 2px;">
                  Conexão Autenticada: ${o.approvedIp || '189.120.44.12'} • Integridade SHA-256 Lock
                </div>
              </div>
            </div>
          ` : ''}
        </section>
      </div>

      <!-- Barra de Ação Flutuante Inferior (Sticky Mobile) -->
      <footer class="sticky-action-bar">
        <div class="action-bar-info">
          <span class="action-bar-label">Total c/ Peças & Teste</span>
          <span class="action-bar-val">${formatMoney(o.totalCents)}</span>
        </div>
        <div>
          ${isApproved 
            ? (isPaid 
                ? `<button class="btn-primary-cais" style="background-color: var(--cais-positive);" disabled>✓ Sinal Quitado</button>`
                : `<button class="btn-primary-cais" onclick="openPixModal()">🔑 Pagar Sinal Pix (${formatMoney(o.signalCents)})</button>`)
            : `<button class="btn-primary-cais" onclick="approveOrder()">Aprovar e Liberar Peças</button>`
          }
        </div>
      </footer>
    </div>
  `;
}

// Renderizador da Vista Administrativa de Balcão (Desktop 1440px)
function renderAdminView() {
  const o = state.activeOrder;
  const waMessage = encodeURIComponent(
    `Olá, ${o.clientName}! Segue o laudo técnico e orçamento da sua ${o.assetName} na Marina Imperial: https://marinaimperial.com.br/p/${o.publicToken} . Você pode conferir as fotos da vistoria da rabeta e autorizar o serviço pelo celular.`
  );

  return `
    <div class="admin-view">
      <header class="admin-header">
        <div class="admin-title-group">
          <h1>⚓ Marina Imperial — Balcão & Pátio de Serviços Náuticos</h1>
          <p>${state.marina.location} • Gerente Técnico no Plantão: <strong>Carlos Mendonça</strong></p>
        </div>
        <div style="display: flex; gap: var(--cais-space-2);">
          <button class="proto-btn-action" onclick="showToast('📋 Painel de cadastro rápido: Schaefer 303, Phantom 290, Intermarine 420...')">
            + Cadastrar Nova Embarcação
          </button>
          <button class="btn-primary-cais" onclick="window.open('https://api.whatsapp.com/send?phone=5511981443210&text=${waMessage}', '_blank')">
            💬 Disparar Orçamento no WhatsApp do Cliente
          </button>
        </div>
      </header>

      <!-- Barra de Telemetria de Presença Náutica e Pátio ao Vivo (Fase 5) -->
      <section class="cais-card" style="padding: var(--cais-space-3); background-color: var(--cais-surface-sunken);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--cais-space-2); font-size: var(--cais-fs-xs);">
          <div style="display: flex; items-center; gap: var(--cais-space-3); flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="pulse-dot" style="background-color: var(--cais-positive);"></span>
              <strong style="color: var(--cais-text);">Telemetria do Canal:</strong>
              <span style="font-family: var(--cais-font-mono); color: var(--cais-text-secondary);">Maré 1.4m Enchente • Vento 16 nós NE (Próprio p/ testes)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong style="color: var(--cais-text);">Elevador 12t:</strong>
              <span style="font-family: var(--cais-font-mono); color: var(--cais-warning);">Ocupado (Vaga G-14)</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: var(--cais-space-2);">
            <div style="text-align: right;">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px; color: var(--cais-positive); font-weight: 700; font-size: 11px;">
                <span class="pulse-dot" style="background-color: var(--cais-positive); width: 6px; height: 6px;"></span>
                <span>Sessão do Cliente Ativa</span>
              </div>
              <span style="font-family: var(--cais-font-mono); font-size: 10px; color: var(--cais-text-secondary);">Dr. Roberto visualizou o laudo há 42s • 5G Claro</span>
            </div>
            <button class="proto-btn-action" style="min-height: 32px; padding: 0 var(--cais-space-2); font-size: 11px;" onclick="showToast('💬 Lembrete de cortesia reenviado via WhatsApp Business com chave segura!')">
              🔔 Reenviar Link Seguro
            </button>
          </div>
        </div>
      </section>

      <!-- Bento Grid de Telemetria Operacional da Marina -->
      <section class="bento-grid">
        <div class="bento-stat-card">
          <span class="stat-label">Barcos Aguardando Aprovação</span>
          <span class="stat-value" style="color: var(--cais-warning);">1 Barco</span>
          <span style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">R$ 4.150,00 parados na vaga de serviço</span>
        </div>
        <div class="bento-stat-card">
          <span class="stat-label">Sinais Pix Confirmados Hoje</span>
          <span class="stat-value" style="color: var(--cais-positive);">${formatMoney(o.paymentStatus === 'SIGNAL_PAID' ? 391500 : 267000)}</span>
          <span style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Peças originais faturadas no distribuidor</span>
        </div>
        <div class="bento-stat-card">
          <span class="stat-label">Boxes Ocupados / Elevador</span>
          <span class="stat-value" style="color: var(--cais-accent);">2 Embarcações</span>
          <span style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Mecânico chefe: Wanderley dos Santos</span>
        </div>
        <div class="bento-stat-card">
          <span class="stat-label">Prontos p/ Teste de Rio</span>
          <span class="stat-value">1 Barco</span>
          <span style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Focker 242 GTO liberada p/ rampa</span>
        </div>
      </section>

      <!-- Tabela Central de Ordens com Ações Rápidas -->
      <section class="table-card">
        <div class="table-toolbar">
          <div style="display: flex; align-items: center; gap: var(--cais-space-3);">
            <span style="font-weight: 700; font-size: var(--cais-fs-md);">Quadro Operacional de Manutenções</span>
            <span class="proto-badge-sample">4 Ordens no Pátio</span>
          </div>
          <input type="text" class="search-input" placeholder="🔍 Filtrar por barco, cliente, motor ou capitania..." />
        </div>
        <table class="cais-table">
          <thead>
            <tr>
              <th>OS / Data</th>
              <th>Embarcação & Motor</th>
              <th>Proprietário</th>
              <th>Total (R$)</th>
              <th>Sinal Pix</th>
              <th>Status do Box</th>
              <th>Aprovação Cliente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: var(--cais-surface-sunken);">
              <td style="font-family: var(--cais-font-mono); font-weight: 700;">
                ${o.id}<br><small style="color: var(--cais-text-secondary); font-weight: normal;">${o.createdAt.split(' ')[0]}</small>
              </td>
              <td>
                <strong>${o.assetName}</strong><br>
                <small style="color: var(--cais-accent); font-family: var(--cais-font-mono);">${o.engineModel.split('(')[0]}</small>
              </td>
              <td>
                ${o.clientName}<br>
                <small style="color: var(--cais-text-secondary); font-family: var(--cais-font-mono);">${o.clientPhone}</small>
              </td>
              <td style="font-family: var(--cais-font-mono); font-weight: 700;">${formatMoney(o.totalCents)}</td>
              <td style="font-family: var(--cais-font-mono); color: ${o.paymentStatus === 'SIGNAL_PAID' ? 'var(--cais-positive)' : 'var(--cais-warning)'}; font-weight: 600;">
                ${o.paymentStatus === 'SIGNAL_PAID' ? '✓ Pago' : formatMoney(o.signalCents)}
              </td>
              <td><span class="os-tag ${o.status.toLowerCase()}">${o.status}</span></td>
              <td>
                <span class="os-tag ${o.approvalStatus === 'APPROVED' ? 'done' : 'pending'}">
                  ${o.approvalStatus === 'APPROVED' ? '✓ Aprovado v1' : '⏳ Aguardando'}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 4px;">
                  <button class="btn-icon-action" onclick="setScreen('client')" title="Abrir link mobile exatamente como o cliente vê">
                    📱 Ver Mobile
                  </button>
                  <button class="btn-icon-action" onclick="copyPixCode()" title="Copiar chave Pix da OS">
                    🔑 Pix
                  </button>
                </div>
              </td>
            </tr>
            ${state.allOrders.slice(1).map(item => `
              <tr>
                <td style="font-family: var(--cais-font-mono);">${item.id}</td>
                <td><strong>${item.boat}</strong><br><small style="color: var(--cais-text-secondary);">${item.bay}</small></td>
                <td>${item.client}<br><small style="color: var(--cais-text-secondary);">${item.phone}</small></td>
                <td style="font-family: var(--cais-font-mono); font-weight: 600;">${item.total}</td>
                <td style="font-family: var(--cais-font-mono); color: var(--cais-positive); font-weight: 600;">${item.signal}</td>
                <td><span class="os-tag ${item.status.toLowerCase()}">${item.status}</span></td>
                <td><span class="os-tag done">${item.approval}</span></td>
                <td>
                  <button class="btn-icon-action" onclick="showToast('📋 Registro oficial da ordem ${item.id} (${item.boat}) em visualização.')">📄 Detalhes</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <!-- Trilha de Auditoria Imutável (Audit Trail) -->
      <section class="cais-card" style="margin-top: var(--cais-space-2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-2);">
          <h3 style="font-size: var(--cais-fs-md); font-weight: 700;">🛡️ Trilha de Auditoria Imutável (Audit Trail — LGPD & Governança)</h3>
          <span style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Hash encadeado SHA-256</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--cais-space-2); font-family: var(--cais-font-mono); font-size: var(--cais-fs-xs);">
          ${state.auditLogs.map(log => `
            <div style="display: flex; gap: var(--cais-space-3); padding: var(--cais-space-2); background-color: var(--cais-surface-sunken); border-radius: var(--cais-radius-sm); border-left: 2px solid var(--cais-accent);">
              <span style="color: var(--cais-text-secondary);">${log.timestamp}</span>
              <strong style="color: var(--cais-accent);">${log.actor}</strong>
              <span style="color: var(--cais-warning);">${log.action}</span>
              <span style="color: var(--cais-text); flex: 1;">${log.desc}</span>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

// Visão 1: Cliente no WhatsApp (Mobile 390px)
function renderWhatsAppView() {
  const o = state.activeOrder;
  const isApproved = o.approvalStatus === 'APPROVED';
  const isPaid = o.paymentStatus === 'SIGNAL_PAID';

  return `
    <div class="whatsapp-container">
      <!-- WhatsApp Mobile Header -->
      <header class="whatsapp-header">
        <div style="display: flex; align-items: center; gap: var(--cais-space-2);">
          <button class="wa-btn-icon" onclick="setScreen('client')" title="Ver Web App" aria-label="Abrir Web App">←</button>
          <div class="wa-avatar">⚓</div>
          <div class="wa-contact-info">
            <div class="wa-contact-name">Marina Imperial ⚓ <span class="wa-verified-badge" title="Canal Oficial Verificado">✓</span></div>
            <div class="wa-contact-status">online • oficina e garagem náutica</div>
          </div>
        </div>
        <div class="wa-header-actions">
          <span class="wa-action-icon" title="Chamada de Vídeo">📹</span>
          <span class="wa-action-icon" title="Chamada de Voz">📞</span>
          <span class="wa-action-icon" title="Mais Opções">⋮</span>
        </div>
      </header>

      <!-- Chat Canvas -->
      <div class="whatsapp-chat-canvas">
        <div class="wa-date-pill">HOJE</div>

        <!-- Mensagem Oficial da Marina com Card da OS -->
        <div class="wa-message-bubble incoming">
          <div class="wa-sender-label">Marina Imperial — Serviços Técnicos</div>
          <p class="wa-msg-text">
            Olá, <strong>Sr. Roberto</strong>! A vistoria pericial da sua <strong>${o.assetName}</strong> foi concluída pelo mecânico-chefe <em>${state.marina.chiefMechanic}</em> no box do galpão seco.
          </p>
          <p class="wa-msg-text" style="margin-top: var(--cais-space-1);">
            ⚠️ <strong>Diagnóstico:</strong> Identificado desgaste severo no rotor da bomba d’água (3 pás rompidas), gerando alarme sonoro aos 3.200 RPM na travessia.
          </p>

          <!-- Card Interativo da OS -->
          <div class="wa-interactive-card" onclick="setScreen('client')" role="button" tabindex="0">
            <div class="wa-card-badge">LAUDO TÉCNICO & ORÇAMENTO COM PIX</div>
            <div class="wa-card-hero">
              <div class="wa-card-hero-icon">🚤</div>
              <div>
                <div class="wa-card-title">${o.assetName}</div>
                <div class="wa-card-subtitle">${o.engineModel} • ${o.hoursMeter}</div>
              </div>
            </div>
            
            <div class="wa-card-details">
              <div class="wa-card-detail-row">
                <span>Ordem de Serviço:</span>
                <strong style="font-family: var(--cais-font-mono);">#${o.id} (v${o.version})</strong>
              </div>
              <div class="wa-card-detail-row">
                <span>Peças Genuínas + Mão de Obra:</span>
                <strong style="font-family: var(--cais-font-mono); color: var(--cais-accent);">${formatMoney(o.totalCents)}</strong>
              </div>
              <div class="wa-card-detail-row">
                <span>Sinal de 30% para faturamento:</span>
                <strong style="font-family: var(--cais-font-mono); color: var(--cais-positive);">${formatMoney(o.signalCents)} via Pix</strong>
              </div>
            </div>

            <div class="wa-card-footer">
              <span class="wa-link-text">cais.app/p/${o.publicToken}</span>
              <button class="wa-card-btn" onclick="setScreen('client'); event.stopPropagation();">
                Abrir Laudo e Aprovar ➔
              </button>
            </div>
          </div>

          <div class="wa-msg-meta">
            <span>08:48</span>
            <span class="wa-checkmarks">✓✓</span>
          </div>
        </div>

        ${isApproved ? `
          <!-- Mensagem do Cliente Aprovando -->
          <div class="wa-message-bubble outgoing">
            <p class="wa-msg-text">
              Autorizei a troca do rotor e o óleo da rabeta pelo link! Podem seguir com as peças genuínas Quicksilver. 👍
            </p>
            <div class="wa-msg-meta">
              <span>08:52</span>
              <span class="wa-checkmarks wa-read">✓✓</span>
            </div>
          </div>

          <!-- Confirmação da Marina com Webhook Pix -->
          <div class="wa-message-bubble incoming">
            <p class="wa-msg-text">
              ${isPaid 
                ? `🛡️ <strong>Sinal Pix Confirmado!</strong> Recebemos o sinal de <strong>${formatMoney(o.signalCents)}</strong> instantaneamente. Peças reservadas na autorizada Mercury. Previsão de entrega no píer: sexta-feira às 16h.`
                : `Aprovação registrada com sucesso! Assim que realizar a transferência do sinal Pix de ${formatMoney(o.signalCents)} pelo link, a bancada emitirá o pedido de peças.`
              }
            </p>
            <div class="wa-msg-meta">
              <span>08:53</span>
              <span class="wa-checkmarks">✓✓</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Barra Inferior de Entrada do WhatsApp -->
      <footer class="whatsapp-footer">
        <span class="wa-input-icon">😊</span>
        <div class="wa-input-mock">Mensagem para Marina Imperial...</div>
        <span class="wa-input-icon">📎</span>
        <span class="wa-input-icon">📷</span>
        <div class="wa-mic-btn">🎙️</div>
      </footer>
    </div>
  `;
}

// Visão 3: Mecânico de Campo no Pier / Galpão (Tablet 768px)
function renderMechanicView() {
  const o = state.activeOrder;
  return `
    <div class="mechanic-tablet-view">
      <!-- Header do Tablet de Campo -->
      <header class="mechanic-header">
        <div class="mechanic-brand">
          <span style="font-size: var(--cais-fs-xl);">⚓</span>
          <div>
            <div style="font-weight: 700; font-size: var(--cais-fs-lg); color: var(--cais-accent);">Cais OS • Módulo Técnico de Campo</div>
            <div style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Vistoria de Pier, Box & Doca Seca • Marina Imperial</div>
          </div>
        </div>
        <div class="mechanic-badge-profile">
          <span>🛠️ ${state.marina.chiefMechanic}</span>
        </div>
      </header>

      <!-- Ficha de Entrada da Embarcação -->
      <div class="mechanic-boat-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--cais-space-2);">
          <div>
            <span class="os-tag in-progress" style="margin-bottom: var(--cais-space-1); display: inline-block;">EM VISTORIA NO PIER</span>
            <h2 style="font-size: var(--cais-fs-xl); font-weight: 700; color: var(--cais-text);">${o.assetName}</h2>
            <div style="font-size: var(--cais-fs-sm); color: var(--cais-text-secondary); margin-top: 2px;">
              ${o.engineModel} • ${o.driveModel}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">LOCALIZAÇÃO NO PÁTIO</div>
            <div style="font-weight: 700; font-size: var(--cais-fs-md); color: var(--cais-accent);">${o.berthLocation}</div>
          </div>
        </div>

        <!-- Telemetria Rápida Coletada no Painel -->
        <div class="mechanic-telemetry-grid">
          <div class="mechanic-telemetry-item">
            <span class="telemetry-label">Horímetro</span>
            <span class="telemetry-val">${o.hoursMeter}</span>
          </div>
          <div class="mechanic-telemetry-item">
            <span class="telemetry-label">Combustível</span>
            <span class="telemetry-val">${o.fuelLevel}</span>
          </div>
          <div class="mechanic-telemetry-item">
            <span class="telemetry-label">Baterias Náuticas</span>
            <span class="telemetry-val">12.7V (Repouso)</span>
          </div>
          <div class="mechanic-telemetry-item">
            <span class="telemetry-label">Capitania dos Portos</span>
            <span class="telemetry-val">${o.registrationNumber}</span>
          </div>
        </div>
      </div>

      <!-- Checklist de 12 Pontos de Vistoria de Pier -->
      <div class="mechanic-checklist-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-3);">
          <div>
            <h3 style="font-size: var(--cais-fs-md); font-weight: 700;">Checklist Técnico de Entrada (12 Pontos)</h3>
            <p style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Inspeção obrigatória antes da descida ao mar ou desmontagem da rabeta</p>
          </div>
          <span style="font-size: var(--cais-fs-xs); font-family: var(--cais-font-mono); background-color: var(--cais-surface-sunken); padding: 4px 8px; border-radius: var(--cais-radius-sm);">
            12/12 CONFERIDOS
          </span>
        </div>

        <div class="mechanic-checklist-grid">
          ${o.checklist.map((item, idx) => `
            <div class="mechanic-check-row">
              <div style="display: flex; align-items: center; gap: var(--cais-space-2);">
                <span class="check-index">${idx + 1}</span>
                <div>
                  <div style="font-weight: 600; font-size: var(--cais-fs-sm);">${item.item}</div>
                  <div style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">${item.note}</div>
                </div>
              </div>
              <span class="badge-status-pill status-${item.status.toLowerCase()}">${item.status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Evidências Fotográficas do Laudo -->
      <div class="mechanic-evidences-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-3);">
          <div>
            <h3 style="font-size: var(--cais-fs-md); font-weight: 700;">Evidências e Fotos Periciais da Avaria</h3>
            <p style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Fotos capturadas na câmera do tablet vinculadas à OS #${o.id}</p>
          </div>
          <button class="proto-btn-action" onclick="showToast('📸 Câmera ativada: foto anexada!')">
            + Nova Foto no Píer
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--cais-space-3);">
          ${o.evidences.map(ev => `
            <div style="background-color: var(--cais-surface-sunken); border: 1px solid var(--cais-border); border-radius: var(--cais-radius-md); padding: var(--cais-space-3);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--cais-space-2);">
                <span style="font-size: var(--cais-fs-xs); font-weight: 700; color: var(--cais-accent);">${ev.category}</span>
                <span style="font-size: 10px; font-family: var(--cais-font-mono);">${ev.partNumber}</span>
              </div>
              <div style="height: 80px; background-color: var(--cais-surface); border-radius: var(--cais-radius-sm); display: flex; align-items: center; justify-content: center; font-size: var(--cais-fs-xs); font-weight: 700; text-align: center; padding: 4px; border: 1px dashed var(--cais-border);">
                ${ev.beforeVisual}
              </div>
              <div style="font-size: var(--cais-fs-xs); margin-top: var(--cais-space-2); color: var(--cais-text); font-weight: 600;">
                ${ev.title}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Barra de Ação de Campo -->
      <div class="mechanic-action-bar">
        <div>
          <div style="font-weight: 700; font-size: var(--cais-fs-sm);">Vistoria Técnica Pronta</div>
          <div style="font-size: var(--cais-fs-xs); color: var(--cais-text-secondary);">Disparar notificação segura para aprovação do proprietário</div>
        </div>
        <button class="btn-primary-cais" style="width: auto; padding: var(--cais-space-2) var(--cais-space-5);" onclick="setScreen('whatsapp')">
          📱 Emitir e Enviar no WhatsApp do Cliente ➔
        </button>
      </div>
    </div>
  `;
}

// Renderizador Central
function renderApp() {
  const container = document.getElementById('viewRoot');
  if (!container) return;

  if (currentScreen === 'whatsapp') {
    container.innerHTML = renderWhatsAppView();
  } else if (currentScreen === 'client') {
    container.innerHTML = renderClientView();
  } else if (currentScreen === 'mechanic') {
    container.innerHTML = renderMechanicView();
  } else {
    container.innerHTML = renderAdminView();
  }

  document.querySelectorAll('.proto-tab-btn[data-screen]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === currentScreen);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('screen')) {
    const s = urlParams.get('screen');
    if (s === 'whatsapp' || s === 'client' || s === 'mechanic' || s === 'admin') {
      currentScreen = s;
      if (s === 'whatsapp' || s === 'client') currentViewport = 'mobile';
      if (s === 'mechanic') currentViewport = 'tablet';
      if (s === 'admin') currentViewport = 'desktop';
    }
  }
  if (urlParams.get('viewport')) {
    currentViewport = urlParams.get('viewport');
  }
  if (urlParams.get('theme') === 'dark') {
    currentTheme = 'dark';
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  if (urlParams.get('pure') === '1' || urlParams.get('pure') === 'true') {
    document.body.classList.add('pure-view');
  }

  renderApp();
  setViewport(currentViewport);

  if (urlParams.get('modal') === 'pix') {
    openPixModal();
  } else if (urlParams.get('evidence')) {
    openEvidenceModal(urlParams.get('evidence'));
  }
});

