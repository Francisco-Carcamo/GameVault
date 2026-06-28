/**
 * ==========================================================================
 * GAMEVAULT — COMPONENTE TARJETA DE VIDEOJUEGO (GAME CARD)
 * ==========================================================================
 */

import { createElementHelper } from '../dom.js';
import { formatDate, isOverdue } from '../utils.js';

// Iconos SVG estáticos para botones
const ICONS = {
  edit: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  `,
  delete: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  `,
  calendar: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  `
};

/**
 * Crea el nodo DOM completo para representar una tarjeta de tarea de forma segura.
 * 
 * @param {Object} task - Objeto de datos de la tarea.
 * @param {Function} onToggleStatus - Callback al cambiar checkbox de completado.
 * @param {Function} onEdit - Callback al presionar el botón de editar.
 * @param {Function} onDelete - Callback al presionar el botón de eliminar.
 * @returns {HTMLElement} Nodo de la tarjeta.
 */
export function createTaskCard(task, onToggleStatus, onEdit, onDelete) {
  const isTaskOverdue = isOverdue(task.dueDate, task.status);
  
  // Clases CSS dinámicas para la tarjeta
  const cardClasses = [
    'task-card',
    `priority-${task.priority}`,
    `status-${task.status}`,
    isTaskOverdue ? 'is-overdue' : ''
  ].filter(Boolean).join(' ');

  // 1. Cabecera de la tarjeta (Categoría y botones de acción)
  const categoryBadge = createElementHelper('span', { class: 'card-category' }, task.category || 'General');

  // Botón Editar
  const editBtnWrapper = createElementHelper('div');
  editBtnWrapper.innerHTML = ICONS.edit; // Seguro, es un SVG local
  const editBtn = createElementHelper('button', {
    class: 'btn-action edit',
    'aria-label': `Editar juego: ${task.title}`,
    title: 'Editar Juego',
    onclick: () => onEdit(task)
  }, editBtnWrapper.firstElementChild);

  // Botón Eliminar
  const deleteBtnWrapper = createElementHelper('div');
  deleteBtnWrapper.innerHTML = ICONS.delete; // Seguro, es un SVG local
  const deleteBtn = createElementHelper('button', {
    class: 'btn-action delete',
    'aria-label': `Eliminar juego: ${task.title}`,
    title: 'Eliminar Juego',
    onclick: () => onDelete(task.id, task.title)
  }, deleteBtnWrapper.firstElementChild);

  const actionsWrapper = createElementHelper('div', { class: 'card-actions-wrapper' }, editBtn, deleteBtn);
  const cardHeader = createElementHelper('header', { class: 'card-header' }, categoryBadge, actionsWrapper);

  // 2. Cuerpo de la tarjeta (Título y descripción)
  const cardTitle = createElementHelper('h3', { class: 'card-title' }, task.title);
  
  // Agregar descripción solo si existe
  const cardDesc = task.description 
    ? createElementHelper('p', { class: 'card-desc' }, task.description)
    : null;
    
  const cardBody = createElementHelper('div', { class: 'card-body' }, cardTitle, cardDesc);

  // 3. Pie de la tarjeta (Fecha límite y checkbox)
  const calendarIconWrapper = createElementHelper('div');
  calendarIconWrapper.innerHTML = ICONS.calendar;
  const cardDueDate = createElementHelper(
    'div',
    { class: 'card-due-date' },
    calendarIconWrapper.firstElementChild,
    formatDate(task.dueDate)
  );

  // Checkbox de estado
  const checkboxInput = createElementHelper('input', {
    type: 'checkbox',
    class: 'status-checkbox',
    'aria-label': `Marcar como completado: ${task.title}`,
    checked: task.status === 'completada',
    onchange: () => onToggleStatus(task.id)
  });

  const checkboxWrapper = createElementHelper('div', { class: 'status-checkbox-wrapper' }, checkboxInput);
  
  const cardFooter = createElementHelper('footer', { class: 'card-footer' }, cardDueDate, checkboxWrapper);

  // 4. Armar la tarjeta final
  const taskArticle = createElementHelper(
    'article',
    { 
      class: cardClasses,
      id: `task-${task.id}`,
      'aria-label': `Videojuego: ${task.title}`
    },
    cardHeader,
    cardBody,
    cardFooter
  );

  return taskArticle;
}
