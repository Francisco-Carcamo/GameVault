/**
 * ==========================================================================
 * TASKFLOW — COMPONENTE MODAL (CUADROS DE DIÁLOGO NATIVOS <dialog>)
 * ==========================================================================
 */

import { querySafe } from '../dom.js';

// Referencias a los elementos del DOM de los diálogos
let taskDialog;
let confirmDialog;
let taskForm;

// Callback de confirmación almacenado en memoria
let activeConfirmCallback = null;

/**
 * Inicializa y enlaza los eventos de los diálogos nativos.
 */
export function initModals() {
  taskDialog = querySafe('#task-dialog');
  confirmDialog = querySafe('#confirm-dialog');
  taskForm = querySafe('#task-form');

  // Enlazar botones de cancelar / cerrar de forma nativa
  querySafe('#dialog-close-btn', taskDialog).addEventListener('click', closeTaskModal);
  querySafe('#form-cancel-btn', taskDialog).addEventListener('click', closeTaskModal);
  
  querySafe('#confirm-close-btn', confirmDialog).addEventListener('click', closeConfirmModal);
  querySafe('#confirm-cancel-btn', confirmDialog).addEventListener('click', closeConfirmModal);

  // Botón OK de confirmación
  querySafe('#confirm-ok-btn', confirmDialog).addEventListener('click', () => {
    if (typeof activeConfirmCallback === 'function') {
      activeConfirmCallback();
    }
    closeConfirmModal();
  });

  // Soporte nativo para cerrar diálogos con la tecla Escape
  taskDialog.addEventListener('cancel', () => {
    clearFormErrors();
  });
}

/**
 * Abre el diálogo de formulario para crear una tarea nueva o editar una existente.
 * 
 * @param {Object} [task=null] - La tarea a editar. Si es null, el modal se prepara para crear una tarea.
 */
export function openTaskModal(task = null) {
  if (!taskDialog || !taskForm) {
    initModals();
  }

  // Limpiar errores visuales previos
  clearFormErrors();
  taskForm.reset();

  const dialogTitle = querySafe('#dialog-title', taskDialog);
  const statusFieldContainer = querySafe('#status-field-container', taskForm);
  const taskIdInput = querySafe('#task-id', taskForm);

  if (task) {
    // Modo Edición
    dialogTitle.textContent = 'Editar Juego';
    statusFieldContainer.style.display = 'block';
    
    // Rellenar campos
    taskIdInput.value = task.id;
    querySafe('#task-title-input', taskForm).value = task.title;
    querySafe('#task-desc-input', taskForm).value = task.description || '';
    querySafe('#task-category-input', taskForm).value = task.category;
    querySafe('#task-priority-input', taskForm).value = task.priority;
    querySafe('#task-due-date-input', taskForm).value = task.dueDate;
    querySafe('#task-status-input', taskForm).value = task.status;
  } else {
    // Modo Creación
    dialogTitle.textContent = 'Añadir Juego';
    statusFieldContainer.style.display = 'none';
    taskIdInput.value = '';
    
    // Autocompletar la fecha límite con el día de mañana por usabilidad (UX)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    querySafe('#task-due-date-input', taskForm).value = tomorrow.toISOString().slice(0, 10);
  }

  // Abrir diálogo de forma nativa e inclusiva
  taskDialog.showModal();
}

/**
 * Cierra el diálogo del formulario de tarea.
 */
export function closeTaskModal() {
  if (taskDialog) {
    taskDialog.close();
    clearFormErrors();
  }
}

/**
 * Abre el diálogo de confirmación para eliminaciones.
 * 
 * @param {string} taskTitle - Título de la tarea que se va a borrar.
 * @param {Function} onConfirm - Función callback a ejecutar si el usuario presiona "Eliminar".
 */
export function openConfirmModal(taskTitle, onConfirm) {
  if (!confirmDialog) {
    initModals();
  }

  const titlePlaceholder = querySafe('#confirm-task-title-text', confirmDialog);
  titlePlaceholder.textContent = taskTitle;
  
  // Guardar callback de eliminación
  activeConfirmCallback = onConfirm;

  // Abrir diálogo nativo
  confirmDialog.showModal();
}

/**
 * Cierra el diálogo de confirmación.
 */
export function closeConfirmModal() {
  if (confirmDialog) {
    confirmDialog.close();
    activeConfirmCallback = null;
  }
}

/**
 * Limpia todos los mensajes y clases de error del formulario de tareas.
 */
function clearFormErrors() {
  if (!taskForm) return;
  
  const fields = taskForm.querySelectorAll('.form-field');
  fields.forEach(field => {
    field.classList.remove('invalid');
    const errMsg = field.querySelector('.error-message');
    if (errMsg) {
      errMsg.textContent = '';
    }
  });
}
