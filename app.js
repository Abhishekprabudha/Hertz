const state = {
  config: null,
  scenarios: null,
  activeTab: null,
  activeScenario: null,
  cache: {}
};

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function applyScenario(baseData, scenario) {
  const data = clone(baseData);

  if (scenario === 'disrupt') {
    data.mapBadges = ["Disruption detected", ...data.mapBadges];
    data.recommendations = [
      { tag: "Detect/Freeze", text: "Pause non-essential moves in congestion zones.", why: "Buys time to stabilise critical routes." },
      ...data.recommendations
    ];
    if (data.kpis.length) {
      data.kpis[0].tone = 'warn';
    }
  } else if (scenario === 'correct') {
    data.mapBadges = ["Correction in progress", ...data.mapBadges];
    data.recommendations = [
      { tag: "Correct/Optimize", text: "Re-sequence work orders to accelerate recovery.", why: "Redirects capacity to the biggest impact tasks first." },
      ...data.recommendations
    ];
    if (data.kpis.length) {
      data.kpis[0].tone = 'good';
    }
  }

  return data;
}

function renderTabs() {
  const bar = document.getElementById('tabBar');
  bar.innerHTML = '';
  state.config.tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.label;
    btn.dataset.tab = tab.id;
    btn.className = state.activeTab === tab.id ? 'active' : '';
    btn.addEventListener('click', () => setActiveTab(tab.id));
    bar.appendChild(btn);
  });
}

function renderScenarioControls() {
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scenario === state.activeScenario);
    btn.onclick = () => setScenario(btn.dataset.scenario);
  });
}

function renderNarration() {
  const scenario = state.scenarios[state.activeScenario];
  document.getElementById('narrationText').textContent = scenario.narration;
  const signalList = document.getElementById('signalList');
  signalList.innerHTML = '';
  scenario.signals.forEach(sig => {
    const li = document.createElement('li');
    li.textContent = sig;
    signalList.appendChild(li);
  });
}

function renderCenter(data) {
  document.getElementById('tabTitle').textContent = state.config.tabs.find(t => t.id === state.activeTab).label;
  document.getElementById('scenarioPill').textContent = state.activeScenario.charAt(0).toUpperCase() + state.activeScenario.slice(1);
  document.getElementById('chartText').textContent = data.chartText;
  document.getElementById('explainText').textContent = data.explain;

  const badges = document.getElementById('mapBadges');
  badges.innerHTML = '';
  data.mapBadges.forEach(text => {
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = text;
    badges.appendChild(b);
  });
}

function renderKPIs(data) {
  const grid = document.getElementById('kpiGrid');
  grid.innerHTML = '';
  data.kpis.forEach(kpi => {
    const card = document.createElement('div');
    card.className = `kpi ${kpi.tone}`;
    card.innerHTML = `
      <div class="label">${kpi.label}</div>
      <div class="value">${kpi.value}</div>
      <div class="delta">${kpi.delta}</div>
    `;
    grid.appendChild(card);
  });
}

function renderRecommendations(data) {
  const wrap = document.getElementById('recList');
  wrap.innerHTML = '';
  data.recommendations.forEach(rec => {
    const item = document.createElement('div');
    item.className = 'rec-item';
    item.innerHTML = `
      <div class="rec-tag">${rec.tag}</div>
      <p class="rec-text">${rec.text}</p>
      <p class="rec-why">${rec.why}</p>
    `;
    wrap.appendChild(item);
  });
}

function renderAll(data) {
  renderNarration();
  renderCenter(data);
  renderKPIs(data);
  renderRecommendations(data);
}

async function setActiveTab(tabId) {
  if (state.activeTab === tabId) return;
  state.activeTab = tabId;
  renderTabs();
  await loadAndRender();
}

async function setScenario(scenario) {
  if (state.activeScenario === scenario) return;
  state.activeScenario = scenario;
  renderScenarioControls();
  renderNarration();
  await loadAndRender();
}

async function loadAndRender() {
  const baseData = await getTabData(state.activeTab);
  const adjusted = applyScenario(baseData, state.activeScenario);
  renderAll(adjusted);
}

async function getTabData(tabId) {
  if (state.cache[tabId]) return state.cache[tabId];
  const data = await loadJSON(`data/${tabId}.json`);
  state.cache[tabId] = data;
  return data;
}

async function init() {
  [state.config, state.scenarios] = await Promise.all([
    loadJSON('data/config.json'),
    loadJSON('data/scenarios.json')
  ]);

  state.activeTab = state.config.defaultTab;
  state.activeScenario = state.config.defaultScenario;

  renderTabs();
  renderScenarioControls();
  await loadAndRender();
}

document.addEventListener('DOMContentLoaded', init);
