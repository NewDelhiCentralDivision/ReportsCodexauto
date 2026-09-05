const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 });
const digitalFields = ['DQR Scan', 'SBIPOS-CARD', 'SBIPOS BHARATQR', 'SBIEPAY BHARATQR', 'SBIEPAY UPI', 'SBIEPAY Debit Card'];
const state = { query: '', headOffice: '', page: 1, pageSize: 10, sort: { key: 'revenue', direction: 'desc' } };
let offices = [];
let products = [];
let headOffices = [];

const $ = selector => document.querySelector(selector);
const clean = value => String(value ?? '').trim();
const asNumber = value => Number(String(value ?? '').replace(/,/g, '')) || 0;
const percent = (part, total) => total ? (part / total) * 100 : 0;
const create = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
const addCell = (row, tag, text, className) => { const cell = create(tag, className, text); row.append(cell); return cell; };

function parseCsv(input) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]; const next = input[index + 1];
    if (character === '"' && quoted && next === '"') { cell += character; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) { if (character === '\r' && next === '\n') index += 1; row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; }
    else cell += character;
  }
  if (row.length || cell) rows.push([...row, cell]);
  const [headers = [], ...records] = rows;
  return records.map(values => Object.fromEntries(headers.map((header, index) => [clean(header).replace(/^\uFEFF/, ''), clean(values[index])] )));
}

function paymentMetrics(row) {
  const componentCounts = Object.fromEntries(digitalFields.map(name => [name, asNumber(row[`${name} (Cnt)`])]));
  const digitalCount = Object.values(componentCounts).reduce((total, value) => total + value, 0);
  const cashCount = asNumber(row['Cash (Cnt)']);
  return { componentCounts, digitalCount, cashCount, digitalTxnPct: percent(digitalCount, digitalCount + cashCount) };
}

function createSparkline(values, target) {
  const width = 114; const height = 30; const max = Math.max(...values, 1); const step = values.length > 1 ? width / (values.length - 1) : width;
  const path = values.map((value, index) => `${index ? 'L' : 'M'}${(index * step).toFixed(1)},${(height - 4 - (value / max) * (height - 9)).toFixed(1)}`).join(' ');
  target.setAttribute('d', path);
}

function animateNumber(element, target, formatter) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { element.textContent = formatter(target); return; }
  const started = performance.now(); const duration = 880;
  const frame = now => { const progress = Math.min(1, (now - started) / duration); const eased = 1 - Math.pow(1 - progress, 3); element.textContent = formatter(target * eased); if (progress < 1) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}

function showTooltip(event, message) {
  const tooltip = $('#data-tooltip'); tooltip.textContent = message; tooltip.hidden = false; tooltip.style.left = `${Math.min(event.clientX + 13, window.innerWidth - 235)}px`; tooltip.style.top = `${Math.max(event.clientY - 38, 12)}px`;
}

function hideTooltip() { $('#data-tooltip').hidden = true; }

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.headOffice) params.set('hpo', state.headOffice);
  if (state.sort.key !== 'revenue' || state.sort.direction !== 'desc') params.set('sort', `${state.sort.key}:${state.sort.direction}`);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.pageSize !== 10) params.set('rows', String(state.pageSize));
  history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
}

function restoreState() {
  const params = new URLSearchParams(location.search); const sort = clean(params.get('sort')).split(':');
  state.query = clean(params.get('q')); state.headOffice = clean(params.get('hpo')); state.page = Math.max(1, asNumber(params.get('page')) || 1); state.pageSize = [10, 20, 55].includes(asNumber(params.get('rows'))) ? asNumber(params.get('rows')) : 10;
  if (['office', 'headOffice', 'articles', 'revenue', 'digitalCount', 'digitalTxnPct'].includes(sort[0]) && ['asc', 'desc'].includes(sort[1])) state.sort = { key: sort[0], direction: sort[1] };
}

function renderOverview() {
  const articleCount = offices.reduce((total, office) => total + office.articles, 0);
  const revenue = offices.reduce((total, office) => total + office.revenue, 0);
  const digital = offices.reduce((total, office) => total + office.digitalCount, 0);
  const cash = offices.reduce((total, office) => total + office.cashCount, 0);
  const bookedOffices = offices.filter(office => office.bookingArticles > 0).length;
  animateNumber(document.querySelector('[data-count="articles"]'), articleCount, value => integer.format(Math.round(value)));
  animateNumber(document.querySelector('[data-count="revenue"]'), revenue, value => money.format(value));
  animateNumber(document.querySelector('[data-count="digital"]'), digital, value => integer.format(Math.round(value)));
  animateNumber(document.querySelector('[data-count="offices"]'), bookedOffices, value => `${integer.format(Math.round(value))} / 55`);
  $('#articles-support').textContent = `${integer.format(products.length)} reported services`;
  $('#revenue-support').textContent = 'Reconciled service revenue';
  $('#digital-support').textContent = `${percent(digital, digital + cash).toFixed(1)}% of cash + digital`;
  $('#offices-support').textContent = 'Booking participation';
  $('#office-progress').style.width = `${Math.min(100, (bookedOffices / 55) * 100)}%`;
  const productValues = [...products].sort((a, b) => b.revenue - a.revenue);
  createSparkline(productValues.map(product => product.articles), $('#articles-spark'));
  createSparkline(productValues.map(product => product.revenue), $('#revenue-spark'));
  createSparkline([...headOffices].map(group => group.digitalCount), $('#digital-spark'));
  renderRevenueChart(revenue);
  renderDigitalCard(digital, cash);
  renderHeadOfficeMiniChart(revenue);
}

function renderRevenueChart(totalRevenue) {
  const chart = $('#revenue-chart'); chart.textContent = '';
  [...products].sort((a, b) => b.revenue - a.revenue).forEach(product => {
    const row = create('div', 'metric-row'); row.tabIndex = 0;
    const label = create('span', 'metric-label', product.name); const track = create('span', 'metric-track'); const fill = create('i'); const value = create('span', 'metric-value', money.format(product.revenue));
    fill.style.width = `${percent(product.revenue, totalRevenue)}%`; track.append(fill); row.append(label, track, value);
    const message = `${product.name}: ${money.format(product.revenue)} (${percent(product.revenue, totalRevenue).toFixed(1)}% of revenue)`;
    row.addEventListener('pointermove', event => showTooltip(event, message)); row.addEventListener('pointerleave', hideTooltip); row.addEventListener('focus', () => showTooltip({ clientX: row.getBoundingClientRect().right, clientY: row.getBoundingClientRect().top }, message)); row.addEventListener('blur', hideTooltip);
    chart.append(row);
  });
}

function renderDigitalCard(digital, cash) {
  const share = percent(digital, digital + cash); $('#digital-radial').style.setProperty('--progress', `${share}%`); $('#digital-percent').textContent = `${share.toFixed(1)}%`;
  $('#digital-detail').textContent = integer.format(digital); $('#digital-key').textContent = integer.format(digital); $('#cash-key').textContent = integer.format(cash);
}

function renderHeadOfficeMiniChart(totalRevenue) {
  const chart = $('#hpo-mini-chart'); chart.textContent = '';
  const maximum = Math.max(...headOffices.map(group => group.revenue), 1);
  headOffices.forEach(group => { const item = create('div', 'hpo-mini'); const bar = create('i'); bar.style.height = `${Math.max(8, (group.revenue / maximum) * 100)}%`; item.append(bar, create('strong', '', group.name), create('span', '', `${percent(group.revenue, totalRevenue).toFixed(0)}%`)); chart.append(item); });
}

function renderProducts() {
  const body = $('#product-body'); body.textContent = ''; const totalArticles = products.reduce((total, product) => total + product.articles, 0); const totalRevenue = products.reduce((total, product) => total + product.revenue, 0);
  [...products].sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name)).forEach(product => {
    const row = document.createElement('tr'); addCell(row, 'th', product.name); addCell(row, 'td', integer.format(product.articles), 'numeric'); addCell(row, 'td', money.format(product.revenue), 'numeric');
    const share = addCell(row, 'td', '', 'share-cell'); const display = create('div', 'share-display'); const track = create('span', 'share-track'); const fill = create('i'); fill.style.width = `${percent(product.revenue, totalRevenue)}%`; track.append(fill); display.append(track, create('b', '', `${percent(product.revenue, totalRevenue).toFixed(1)}%`)); share.append(display); body.append(row);
  });
  $('#product-total-articles').textContent = integer.format(totalArticles); $('#product-total-revenue').textContent = money.format(totalRevenue); $('#product-total-share').textContent = '100%';
}

function renderHeadOffices() {
  const target = $('#hpo-cards'); target.textContent = ''; const totalRevenue = headOffices.reduce((total, group) => total + group.revenue, 0);
  headOffices.forEach((group, index) => {
    const card = create('article', 'hpo-card'); const top = create('div', 'hpo-card-top'); top.append(create('strong', '', group.name), create('span', 'rank-badge', `#${index + 1}`));
    const stats = create('div', 'hpo-stats'); const articles = create('div'); articles.append(create('span', '', 'Articles'), create('b', '', integer.format(group.articles))); const digital = create('div'); digital.append(create('span', '', 'Digital share'), create('b', '', `${group.digitalTxnPct.toFixed(1)}%`)); stats.append(articles, digital);
    const progress = create('div', 'hpo-progress'); const fill = create('i'); fill.style.width = `${percent(group.revenue, totalRevenue)}%`; progress.append(fill);
    card.append(top, create('p', 'hpo-revenue', money.format(group.revenue)), create('span', 'hpo-label', `${percent(group.revenue, totalRevenue).toFixed(1)}% of division revenue`), stats, progress); target.append(card);
  });
}

function filteredOffices() {
  const query = state.query.toLocaleLowerCase('en-IN');
  return offices.filter(office => (!state.headOffice || office.headOffice === state.headOffice) && (!query || `${office.office} ${office.id}`.toLocaleLowerCase('en-IN').includes(query))).sort((left, right) => {
    const a = left[state.sort.key]; const b = right[state.sort.key]; const comparison = typeof a === 'string' ? a.localeCompare(b, 'en-IN') : a - b; return state.sort.direction === 'asc' ? comparison : -comparison;
  });
}

function renderOffices() {
  const visible = filteredOffices(); const totalPages = Math.max(1, Math.ceil(visible.length / state.pageSize)); state.page = Math.min(state.page, totalPages); const start = (state.page - 1) * state.pageSize; const pageRows = visible.slice(start, start + state.pageSize); const body = $('#office-body'); body.textContent = '';
  if (!pageRows.length) { const row = document.createElement('tr'); const cell = addCell(row, 'td', 'No offices match the active search or Head Office filter. Clear a filter to see the full report.'); cell.colSpan = 12; cell.className = 'empty-row'; body.append(row); }
  pageRows.forEach(office => { const row = document.createElement('tr'); const officeName = addCell(row, 'th', office.office); officeName.scope = 'row'; officeName.append(create('small', '', office.id || '')); addCell(row, 'td', office.headOffice); addCell(row, 'td', integer.format(office.articles), 'numeric'); addCell(row, 'td', money.format(office.revenue), 'numeric'); addCell(row, 'td', integer.format(office.digitalCount), 'numeric');
    const digital = addCell(row, 'td', '', 'numeric'); const meter = create('span', 'performance-meter'); const track = create('i'); track.style.setProperty('--meter', `${office.digitalTxnPct}%`); track.append(create('b')); meter.append(track, create('span', '', `${office.digitalTxnPct.toFixed(1)}%`)); digital.append(meter);
    digitalFields.forEach(field => addCell(row, 'td', integer.format(office.componentCounts[field]), 'numeric')); body.append(row);
  });
  $('#range-status').textContent = visible.length ? `Showing ${start + 1}–${Math.min(start + state.pageSize, visible.length)} of ${integer.format(visible.length)} offices` : 'No offices found'; $('#page-status').textContent = `Page ${state.page} / ${totalPages}`; $('#previous-page').disabled = state.page === 1; $('#next-page').disabled = state.page === totalPages;
  $('#office-status').textContent = `${integer.format(visible.length)} office records · sorted by ${state.sort.key === 'digitalTxnPct' ? 'digital transaction %' : state.sort.key}`;
  document.querySelectorAll('[data-sort]').forEach(button => { const active = button.dataset.sort === state.sort.key; button.closest('th').setAttribute('aria-sort', active ? (state.sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'); button.querySelector('i').textContent = active ? (state.sort.direction === 'asc' ? '↑' : '↓') : '↕'; });
}

function initialiseControls() {
  const hpoFilter = $('#hpo-filter'); headOffices.forEach(group => { const option = create('option', '', group.name); option.value = group.name; hpoFilter.append(option); });
  $('#office-search').value = state.query; hpoFilter.value = state.headOffice; $('#page-size').value = String(state.pageSize); $('#clear-search').hidden = !state.query;
  $('#office-search').addEventListener('input', event => { state.query = event.target.value; state.page = 1; $('#clear-search').hidden = !state.query; updateUrl(); renderOffices(); });
  $('#clear-search').addEventListener('click', () => { state.query = ''; $('#office-search').value = ''; $('#clear-search').hidden = true; state.page = 1; updateUrl(); renderOffices(); $('#office-search').focus(); });
  hpoFilter.addEventListener('change', event => { state.headOffice = event.target.value; state.page = 1; updateUrl(); renderOffices(); });
  $('#page-size').addEventListener('change', event => { state.pageSize = asNumber(event.target.value); state.page = 1; updateUrl(); renderOffices(); });
  document.querySelectorAll('[data-sort]').forEach(button => button.addEventListener('click', () => { const key = button.dataset.sort; state.sort = { key, direction: state.sort.key === key && state.sort.direction === 'desc' ? 'asc' : 'desc' }; state.page = 1; updateUrl(); renderOffices(); }));
  $('#previous-page').addEventListener('click', () => { if (state.page > 1) { state.page -= 1; updateUrl(); renderOffices(); } }); $('#next-page').addEventListener('click', () => { const pages = Math.max(1, Math.ceil(filteredOffices().length / state.pageSize)); if (state.page < pages) { state.page += 1; updateUrl(); renderOffices(); } });
}

async function renderDate() {
  let label = '03 September 2026';
  try { const response = await fetch('/api/report-meta', { cache: 'no-store' }); const meta = response.ok ? await response.json() : null; if (meta?.report_date) label = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${meta.report_date}T00:00:00`)); } catch { /* bundled report fallback */ }
  $('#report-date').textContent = `Report date: ${label}`; $('#header-date').textContent = label; $('#footer-date').textContent = `Date: ${label}`;
}

function enableReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(section => section.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 }); document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
}

async function loadReport() {
  try {
    restoreState();
    const asset = async path => { const response = await fetch(path, { cache: 'no-store' }); if (!response.ok) throw new Error(`Could not load ${path}`); return response; };
    const [productFile, paymentFile, emoFile, mapFile] = await Promise.all([asset('data/Booking_Productwise_Report.csv').then(response => response.text()), asset('data/Booking_Paymentwise_Report.csv').then(response => response.text()), asset('data/EMO.csv').then(response => response.text()), asset('data/office_head_office_map.json').then(response => response.json())]);
    const booking = parseCsv(productFile).filter(row => row['office-name'] && !/^summary/i.test(row['office-name'])).map(row => ({ office: row['office-name'], id: row['office-id'], product: row['product-name'], articles: asNumber(row['article-count']), revenue: asNumber(row.total_amount), bookingArticles: asNumber(row['article-count']) }));
    const emo = parseCsv(emoFile).filter(row => row['Office Name'] && !/^summary/i.test(row['Office Name'])).map(row => ({ office: row['Office Name'], id: row['Office Id'], product: 'EMO', articles: asNumber(row['MO Count']), revenue: asNumber(row['MO Commision']), bookingArticles: 0 }));
    const paymentByOffice = new Map(parseCsv(paymentFile).filter(row => row['Office Name'] && !/^summary/i.test(row['Office Name'])).map(row => [row['Office Name'], paymentMetrics(row)]));
    const aggregate = new Map();
    [...booking, ...emo].forEach(item => { const office = aggregate.get(item.office) || { office: item.office, id: item.id, headOffice: mapFile[item.office] || 'Unmapped', articles: 0, bookingArticles: 0, revenue: 0, products: new Map() }; office.articles += item.articles; office.bookingArticles += item.bookingArticles; office.revenue += item.revenue; const product = office.products.get(item.product) || { articles: 0, revenue: 0 }; product.articles += item.articles; product.revenue += item.revenue; office.products.set(item.product, product); aggregate.set(item.office, office); });
    const zeroPayment = () => ({ componentCounts: Object.fromEntries(digitalFields.map(field => [field, 0])), digitalCount: 0, cashCount: 0, digitalTxnPct: 0 });
    offices = [...aggregate.values()].map(office => ({ ...office, ...(paymentByOffice.get(office.office) || zeroPayment()) }));
    products = [...aggregate.values()].flatMap(office => [...office.products].map(([name, values]) => ({ name, ...values }))).reduce((all, product) => { const current = all.get(product.name) || { name: product.name, articles: 0, revenue: 0 }; current.articles += product.articles; current.revenue += product.revenue; all.set(product.name, current); return all; }, new Map()); products = [...products.values()];
    headOffices = [...new Set(offices.map(office => office.headOffice))].map(name => { const group = offices.filter(office => office.headOffice === name); const articles = group.reduce((total, office) => total + office.articles, 0); const revenue = group.reduce((total, office) => total + office.revenue, 0); const digitalCount = group.reduce((total, office) => total + office.digitalCount, 0); const cashCount = group.reduce((total, office) => total + office.cashCount, 0); return { name, articles, revenue, digitalCount, cashCount, digitalTxnPct: percent(digitalCount, digitalCount + cashCount) }; }).sort((a, b) => b.revenue - a.revenue);
    renderOverview(); renderProducts(); renderHeadOffices(); initialiseControls(); renderOffices(); renderDate(); enableReveals();
  } catch (error) { $('#load-error').hidden = false; document.querySelectorAll('.reveal').forEach(section => section.classList.add('visible')); }
}

loadReport();
