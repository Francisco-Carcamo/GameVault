/**
 * ==========================================================================
 * TASKFLOW — COMPONENTE TOAST (NOTIFICACIONES DINÁMICAS)
 * ==========================================================================
 */

import { createElementHelper, querySafe } from '../dom.js';

// SVG Icons para cada tipo de Toast
const ICONS = {
  success: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `,
  error: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  `,
  info: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `
};

/**
 * Muestra una notificación flotante temporizada de forma segura.
 * 
 * @param {string} message - El texto de la notificación.
 * @param {('success'|'error'|'info')} [type='info'] - El tipo de notificación.
 */
export function showToast(message, type = 'info') {
  const container = querySafe('#toast-container');
  
  // Para insertar el SVG del icono de forma segura, creamos un contenedor temporal
  const iconWrapper = createElementHelper('span', { class: 'toast-icon-wrapper' });
  iconWrapper.innerHTML = ICONS[type] || ICONS.info; // Es seguro porque el SVG es local y estático
  const iconSvg = iconWrapper.firstElementChild;

  // Botón de Cerrar
  const closeBtn = createElementHelper('button', {
    class: 'toast-close',
    'aria-label': 'Cerrar notificación',
    onclick: () => dismissToast(toastElement)
  }, '×');

  // Mensaje
  const messageSpan = createElementHelper('span', { class: 'toast-message' }, message);

  // Elemento Toast Principal
  const toastElement = createElementHelper(
    'div',
    { class: `toast ${type}` },
    iconSvg,
    messageSpan,
    closeBtn
  );

  // Añadir al contenedor
  container.appendChild(toastElement);

  // Retraso minúsculo para activar la animación de entrada
  setTimeout(() => {
    toastElement.classList.add('show');
  }, 10);

  // Auto-destrucción tras 3 segundos (sincronizada con la animación CSS de la barra de progreso)
  const autoDismissTimer = setTimeout(() => {
    dismissToast(toastElement);
  }, 3000);

  // Almacenar el temporizador en el elemento para poder cancelarlo si el usuario lo cierra antes
  toastElement.dataset.timerId = String(autoDismissTimer);
}

/**
 * Cierra y elimina un Toast con animación.
 * 
 * @param {HTMLElement} toastElement - El nodo DOM del toast a eliminar.
 */
function dismissToast(toastElement) {
  if (!toastElement) return;

  // Cancelar el auto-descarte si existe
  if (toastElement.dataset.timerId) {
    clearTimeout(Number(toastElement.dataset.timerId));
  }

  // Quitar clase show para activar animación de salida
  toastElement.classList.remove('show');
  toastElement.style.transform = 'translateY(-20px) scale(0.9)';
  toastElement.style.opacity = '0';

  // Esperar a que termine la transición CSS y remover del DOM
  toastElement.addEventListener('transitionend', () => {
    toastElement.remove();
  }, { once: true });
}
