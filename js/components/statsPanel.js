/**
 * ==========================================================================
 * TASKFLOW — COMPONENTE DE ESTADÍSTICAS Y PANEL DE MÉTRICAS (SVG)
 * ==========================================================================
 */

import { createElementHelper, renderContainer, querySafe } from '../dom.js';

// Iconos SVG estáticos para las tarjetas KPI
const ICONS = {
  total: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
    </svg>
  `,
  completadas: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  `,
  pendientes: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  `,
  atrasadas: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `
};

/**
 * Renderiza el panel de estadísticas y gráficos en el contenedor correspondiente.
 * 
 * @param {Object} stats - Estadísticas calculadas en state.js (total, completadas, pendientes, atrasadas, percentage, etc).
 */
export function renderStatsPanel(stats) {
  const container = querySafe('#metrics-container');

  // 1. Crear el Gráfico Circular SVG de Productividad
  const chartCard = createProductivityChartCard(stats.percentage, stats.completadas, stats.total);

  // 2. Crear las tarjetas KPI
  const totalCard = createKPICard('total', 'Total Videojuegos', stats.total, 'En tu colección');
  const completedCard = createKPICard('completadas', 'Completados', stats.completadas, `${stats.percentage}% beaten`, 'success');
  const pendingCard = createKPICard('pendientes', 'Jugando / Backlog', stats.pendientes + stats.enProgreso, `${stats.enProgreso} en progreso`, 'info');
  const overdueCard = createKPICard('atrasadas', 'Atrasados / Postpuestos', stats.atrasadas, 'Requieren jugar', stats.atrasadas > 0 ? 'danger' : '');

  // 3. Renderizar todo el conjunto en el contenedor principal
  renderContainer(container, chartCard, totalCard, completedCard, pendingCard, overdueCard);
}

/**
 * Crea la tarjeta visual del gráfico de progreso circular SVG.
 * 
 * @param {number} percentage - Porcentaje de completación (0 a 100).
 * @param {number} completed - Tareas completadas.
 * @param {number} total - Total de tareas.
 * @returns {HTMLElement} Tarjeta del gráfico.
 */
function createProductivityChartCard(percentage, completed, total) {
  // Encabezado del gráfico
  const chartTitle = createElementHelper('h3', { class: 'chart-title' }, 'Progreso de Bóveda');
  const chartSubtitle = createElementHelper(
    'p', 
    { class: 'chart-subtitle' }, 
    total > 0 ? `${completed} de ${total} juegos completados` : 'Sin juegos en la colección'
  );
  const chartHeader = createElementHelper('div', { class: 'chart-header' }, chartTitle, chartSubtitle);

  // Construcción del SVG Anillo de Progreso
  const svgNS = 'http://www.w3.org/2000/svg';
  
  const svgElement = document.createElementNS(svgNS, 'svg');
  svgElement.setAttribute('viewBox', '0 0 36 36');
  svgElement.setAttribute('class', 'svg-ring');
  svgElement.setAttribute('aria-hidden', 'true');

  // Inyección dinámica de degradados lineales SVG
  const defs = document.createElementNS(svgNS, 'defs');
  const linearGradient = document.createElementNS(svgNS, 'linearGradient');
  linearGradient.setAttribute('id', 'chart-gradient');
  linearGradient.setAttribute('x1', '0%');
  linearGradient.setAttribute('y1', '100%');
  linearGradient.setAttribute('x2', '100%');
  linearGradient.setAttribute('y2', '0%');
  
  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'var(--color-primary)'); // Violeta
  
  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', 'var(--color-accent)'); // Cian
  
  linearGradient.appendChild(stop1);
  linearGradient.appendChild(stop2);
  defs.appendChild(linearGradient);
  svgElement.appendChild(defs);

  const bgCircle = document.createElementNS(svgNS, 'circle');
  bgCircle.setAttribute('class', 'ring-bg');
  bgCircle.setAttribute('cx', '18');
  bgCircle.setAttribute('cy', '18');
  bgCircle.setAttribute('r', '15.9155');
  bgCircle.setAttribute('stroke-width', '3');

  const fillCircle = document.createElementNS(svgNS, 'circle');
  fillCircle.setAttribute('class', 'ring-fill');
  fillCircle.setAttribute('cx', '18');
  fillCircle.setAttribute('cy', '18');
  fillCircle.setAttribute('r', '15.9155');
  fillCircle.setAttribute('stroke-width', '3');
  fillCircle.setAttribute('stroke-dasharray', '100, 100');
  
  // Calcular desfase
  const strokeOffset = 100 - percentage;
  fillCircle.setAttribute('stroke-dashoffset', String(strokeOffset));

  svgElement.appendChild(bgCircle);
  svgElement.appendChild(fillCircle);

  // Texto del porcentaje en el centro
  const pctText = createElementHelper('span', { class: 'chart-percentage-text' }, `${percentage}%`);
  const chartVisual = createElementHelper('div', { class: 'chart-visual' }, svgElement, pctText);

  // Leyenda descriptiva del gráfico
  const completedDot = createElementHelper('span', { class: 'legend-dot', style: 'background-color: var(--color-primary);' });
  const completedText = createElementHelper('span', {}, 'Completados');
  const completedLegend = createElementHelper('div', { class: 'legend-item' }, completedDot, completedText);

  const pendingDot = createElementHelper('span', { class: 'legend-dot', style: 'background-color: var(--border-color-glow);' });
  const pendingText = createElementHelper('span', {}, 'Backlog');
  const pendingLegend = createElementHelper('div', { class: 'legend-item' }, pendingDot, pendingText);

  const chartLegend = createElementHelper('div', { class: 'chart-legend' }, completedLegend, pendingLegend);

  // Armar la tarjeta contenedora
  const chartCard = createElementHelper(
    'div', 
    { 
      class: 'chart-card',
      'aria-label': `Progreso de la colección: ${percentage} por ciento.`
    }, 
    chartHeader, 
    chartVisual, 
    chartLegend
  );

  return chartCard;
}

/**
 * Crea una tarjeta métrica individual (KPI Card) de forma segura.
 * 
 * @param {string} type - Tipo de métrica para clases CSS ('total', 'completadas', 'pendientes', 'atrasadas').
 * @param {string} label - Título explicativo de la métrica (ej: "Completadas").
 * @param {number} value - El número contador principal.
 * @param {string} subtitle - Texto de apoyo inferior.
 * @param {string} [badgeColorClass=''] - Clase de color opcional para la insignia ('success', 'info', 'danger').
 * @returns {HTMLElement} El nodo de la tarjeta métrica.
 */
function createKPICard(type, label, value, subtitle, badgeColorClass = '') {
  // Crear información de texto
  const cardLabel = createElementHelper('span', { class: 'metric-label' }, label);
  const cardValue = createElementHelper('span', { class: 'metric-val' }, String(value));
  
  const badgeClasses = `metric-badge ${badgeColorClass}`.trim();
  const cardBadge = subtitle 
    ? createElementHelper('span', { class: badgeClasses }, subtitle) 
    : null;

  const infoWrapper = createElementHelper('div', { class: 'metric-info' }, cardLabel, cardValue, cardBadge);

  // Crear contenedor del icono SVG
  const iconWrapper = createElementHelper('div', { class: 'metric-icon-wrapper' });
  iconWrapper.innerHTML = ICONS[type] || ''; // Seguro, es un SVG local
  const iconSvg = iconWrapper.firstElementChild;

  // Armar la tarjeta
  const card = createElementHelper(
    'div', 
    { 
      class: `metric-card ${type}`,
      'aria-label': `${label}: ${value}. ${subtitle}`
    }, 
    infoWrapper, 
    iconSvg
  );

  return card;
}
