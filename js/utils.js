/**
 * ==========================================================================
 * TASKFLOW — FUNCIONES DE UTILIDAD PURAS
 * ==========================================================================
 */

/**
 * Sanitiza una cadena de texto para prevenir ataques de Cross-Site Scripting (XSS).
 * Reemplaza los caracteres de marcado HTML por sus entidades seguras correspondientes.
 * 
 * @param {string} str - Texto de entrada sucio.
 * @returns {string} Texto sanitizado.
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&grave;'
  };
  const reg = /[&<>"'`/]/g;
  return str.replace(reg, (match) => map[match]).trim();
}

/**
 * Genera un identificador único seguro (UUID v4 simplificado) para las tareas.
 * Utiliza crypto.randomUUID si está disponible, de lo contrario un fallback aleatorio.
 * 
 * @returns {string} UUID generado.
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback para navegadores antiguos
  return 'tf-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Formatea una fecha en formato YYYY-MM-DD a una representación localizada en español.
 * Ejemplo: "2026-06-27" -> "27 de Jun, 2026".
 * 
 * @param {string} dateStr - Fecha en formato 'YYYY-MM-DD'.
 * @returns {string} Fecha formateada amigable.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Sin fecha';
  
  // Dividir fecha manualmente para evitar problemas de desfase de zona horaria local
  const [year, month, day] = dateStr.split('-').map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return 'Fecha inválida';

  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  return `${day} de ${months[month - 1]}, ${year}`;
}

/**
 * Verifica si una tarea está vencida en comparación con la fecha actual del sistema.
 * Solo se considera vencida si no está completada y la fecha de vencimiento es anterior a la fecha de hoy.
 * 
 * @param {string} dueDateStr - Fecha de vencimiento 'YYYY-MM-DD'.
 * @param {string} status - Estado de la tarea ('pendiente', 'en-progreso', 'completada').
 * @returns {boolean} True si la tarea está atrasada.
 */
export function isOverdue(dueDateStr, status) {
  if (status === 'completada' || !dueDateStr) return false;

  // Obtener fecha actual sin hora (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parsear fecha límite
  const [year, month, day] = dueDateStr.split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

/**
 * Valida si el título de la tarea es correcto.
 * 
 * @param {string} title - Título de la tarea.
 * @returns {Object} { isValid: boolean, errorMsg: string }
 */
export function validateTitle(title) {
  const clean = title ? title.trim() : '';
  if (!clean) {
    return { isValid: false, errorMsg: 'El título es requerido.' };
  }
  if (clean.length < 3) {
    return { isValid: false, errorMsg: 'Debe contener al menos 3 caracteres.' };
  }
  if (clean.length > 80) {
    return { isValid: false, errorMsg: 'No puede exceder los 80 caracteres.' };
  }
  return { isValid: true, errorMsg: '' };
}

/**
 * Valida si la categoría de la tarea es correcta.
 * 
 * @param {string} category - Categoría.
 * @returns {Object} { isValid: boolean, errorMsg: string }
 */
export function validateCategory(category) {
  const clean = category ? category.trim() : '';
  if (!clean) {
    return { isValid: false, errorMsg: 'La categoría es requerida.' };
  }
  if (clean.length > 20) {
    return { isValid: false, errorMsg: 'No puede exceder los 20 caracteres.' };
  }
  return { isValid: true, errorMsg: '' };
}

/**
 * Valida que la fecha de vencimiento sea correcta.
 * 
 * @param {string} dateStr - Fecha 'YYYY-MM-DD'.
 * @returns {Object} { isValid: boolean, errorMsg: string }
 */
export function validateDueDate(dateStr) {
  if (!dateStr) {
    return { isValid: false, errorMsg: 'La fecha límite es requerida.' };
  }
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);
  
  if (isNaN(parsedDate.getTime())) {
    return { isValid: false, errorMsg: 'Formato de fecha inválido.' };
  }

  return { isValid: true, errorMsg: '' };
}

/**
 * Asigna un peso numérico a la prioridad para operaciones de ordenación.
 * 
 * @param {string} priority - 'alta', 'media' o 'baja'.
 * @returns {number} Peso numérico (3 para alta, 2 para media, 1 para baja).
 */
export function getPriorityWeight(priority) {
  const weights = {
    alta: 3,
    media: 2,
    baja: 1
  };
  return weights[priority] || 0;
}
