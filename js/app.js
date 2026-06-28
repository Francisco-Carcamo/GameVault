/**
 * ==========================================================================
 * GAMEVAULT — CONTROLADOR PRINCIPAL (BOOTSTRAP Y DELEGACIÓN DE EVENTOS)
 * ==========================================================================
 */

import { querySafe, createElementHelper, renderContainer } from './dom.js';
import { 
  initStore, 
  getTheme, 
  saveThemePreference, 
  getStats, 
  getCategories, 
  getFilteredTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleTaskCompleted,
  setFilters,
  setSortBy,
  exportTasksToJSON,
  importTasksFromJSON
} from './state.js';

import { showToast } from './components/toast.js';
import { initModals, openTaskModal, closeTaskModal, openConfirmModal } from './components/modal.js';
import { createTaskCard } from './components/taskCard.js';
import { renderStatsPanel } from './components/statsPanel.js';
import { validateTitle, validateCategory, validateDueDate } from './utils.js';

// ELEMENTOS PRINCIPALES DEL DOM
let themeToggleBtn;
let searchInput;
let filterStatus;
let filterPriority;
let filterCategory;
let sortBySelect;
let exportBtn;
let importInput;
let newTaskBtn;
let taskForm;
let tasksContainer;
let tasksCountBadge;

/**
 * Arranca la aplicación cuando el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar el Store (Carga localStorage y datos mock si es la primera vez)
  initStore();
  
  // 2. Vincular elementos del DOM
  bindDOMElements();

  // 3. Configurar e inicializar componentes modulares
  initModals();
  setupTheme();

  // 4. Registrar Event Listeners globales y de control
  setupEventListeners();

  // 5. Primer Renderizado Completo de la UI
  renderApp();

  showToast('¡Bienvenido a GameVault! Colecciona y organiza tus videojuegos.', 'info');
});

/**
 * Vincula las variables a sus respectivos elementos HTML.
 */
function bindDOMElements() {
  themeToggleBtn = querySafe('#theme-toggle');
  searchInput = querySafe('#search-input');
  filterStatus = querySafe('#filter-status');
  filterPriority = querySafe('#filter-priority');
  filterCategory = querySafe('#filter-category');
  sortBySelect = querySafe('#sort-by');
  exportBtn = querySafe('#export-btn');
  importInput = querySafe('#import-input');
  newTaskBtn = querySafe('#new-task-btn');
  taskForm = querySafe('#task-form');
  tasksContainer = querySafe('#tasks-container');
  tasksCountBadge = querySafe('#tasks-count-badge');
}

/**
 * Configura la preferencia de color (claro/oscuro) inicial.
 */
function setupTheme() {
  const currentTheme = getTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    saveThemePreference(newTheme);
    showToast(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
  });
}

/**
 * Registra todos los oyentes de eventos interactivos de la aplicación.
 */
function setupEventListeners() {
  // Abrir Modal de Tarea Nueva
  newTaskBtn.addEventListener('click', () => openTaskModal(null));

  // Búsqueda en tiempo real (Barra de búsqueda instantánea con micro-retraso simulado o directo)
  searchInput.addEventListener('input', (e) => {
    setFilters({ search: e.target.value });
    renderTaskList(); // Solo repintamos el listado para mejor rendimiento
  });

  // Filtros de selección
  filterStatus.addEventListener('change', (e) => {
    setFilters({ status: e.target.value });
    renderTaskList();
  });

  filterPriority.addEventListener('change', (e) => {
    setFilters({ priority: e.target.value });
    renderTaskList();
  });

  filterCategory.addEventListener('change', (e) => {
    setFilters({ category: e.target.value });
    renderTaskList();
  });

  // Ordenamiento
  sortBySelect.addEventListener('change', (e) => {
    setSortBy(e.target.value);
    renderTaskList();
  });

  // Exportar datos JSON
  exportBtn.addEventListener('click', () => {
    exportTasksToJSON();
    showToast('Datos exportados correctamente.', 'success');
  });

  // Importar datos JSON
  importInput.addEventListener('change', handleImportJSON);

  // Envío del Formulario (Creación o Edición)
  taskForm.addEventListener('submit', handleFormSubmit);

  // Validaciones en tiempo real sobre los campos del formulario (Interacciones fluidas)
  setupRealtimeFormValidations();
}

/**
 * Escucha las interacciones de entrada para validar campos instantáneamente en el formulario.
 */
function setupRealtimeFormValidations() {
  const titleInput = querySafe('#task-title-input', taskForm);
  const categoryInput = querySafe('#task-category-input', taskForm);
  const dateInput = querySafe('#task-due-date-input', taskForm);

  titleInput.addEventListener('input', () => {
    validateField(titleInput, validateTitle(titleInput.value));
  });

  categoryInput.addEventListener('input', () => {
    validateField(categoryInput, validateCategory(categoryInput.value));
  });

  dateInput.addEventListener('change', () => {
    validateField(dateInput, validateDueDate(dateInput.value));
  });
}

/**
 * Procesa la validación visual de un input de formulario individual.
 * 
 * @param {HTMLElement} inputEl - El campo de formulario.
 * @param {Object} validation - El objeto de validación { isValid, errorMsg }.
 */
function validateField(inputEl, validation) {
  const fieldContainer = inputEl.closest('.form-field');
  const errorContainer = fieldContainer.querySelector('.error-message');

  if (validation.isValid) {
    fieldContainer.classList.remove('invalid');
    if (errorContainer) errorContainer.textContent = '';
  } else {
    fieldContainer.classList.add('invalid');
    if (errorContainer) errorContainer.textContent = validation.errorMsg;
  }
  return validation.isValid;
}

/**
 * Renderiza todos los elementos dinámicos de la interfaz a partir del estado.
 */
function renderApp() {
  renderStats();
  renderCategoryFilter();
  renderTaskList();
}

/**
 * Obtiene las estadísticas agregadas y redibuja el panel KPI superior y el gráfico SVG.
 */
function renderStats() {
  const stats = getStats();
  renderStatsPanel(stats);
}

/**
 * Repuebla dinámicamente las opciones del selector de filtro por categorías.
 * Mantiene la selección actual si aún existe.
 */
function renderCategoryFilter() {
  const currentSelection = filterCategory.value;
  const categories = getCategories();

  // Limpiar opciones manteniendo la opción por defecto
  filterCategory.replaceChildren();
  
  const defaultOption = createElementHelper('option', { value: 'todos' }, 'Todas las Categorías');
  filterCategory.appendChild(defaultOption);

  categories.forEach(cat => {
    const opt = createElementHelper('option', { value: cat }, cat);
    filterCategory.appendChild(opt);
  });

  // Re-seleccionar opción anterior si sigue existiendo
  if (categories.includes(currentSelection)) {
    filterCategory.value = currentSelection;
  } else {
    filterCategory.value = 'todos';
    setFilters({ category: 'todos' });
  }
}

/**
 * Filtra las tareas, calcula el contador de la lista y pinta los nodos de tarjeta DOM correspondientes.
 */
function renderTaskList() {
  const filtered = getFilteredTasks();
  
  // Actualizar indicador de cantidad de tareas en cabecera
  tasksCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'juego' : 'juegos'}`;

  if (filtered.length === 0) {
    // Si no hay tareas coincidentes, pintar estado vacío amigable
    const emptyState = createEmptyStateNode();
    renderContainer(tasksContainer, emptyState);
    return;
  }

  // Generar las tarjetas dinámicas
  const cardNodes = filtered.map(task => {
    return createTaskCard(
      task,
      handleToggleTaskStatus,
      handleEditTaskClick,
      handleDeleteTaskClick
    );
  });

  // Renderizar de manera atómica (evita parpadeos y es ultra rápido)
  renderContainer(tasksContainer, ...cardNodes);
}

/**
 * Genera un nodo de DOM seguro de estado vacío cuando no se encuentran tareas.
 */
function createEmptyStateNode() {
  const iconWrapper = createElementHelper('div');
  // SVG de gamepad / archivador vacío
  iconWrapper.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-state-icon" width="64" height="64">
      <path d="M6 12h4m-2-2v4m8-2h.01M15 12h.01M21 7.75c0-1.84-2.83-3.25-6.5-3.25S8 5.91 8 7.75c0 .35.1.68.27.97L5.8 17.5c-.5 1.5 1 2.5 2 2l4-2.5h.4c3.67 0 6.5-1.41 6.5-3.25v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  
  const title = createElementHelper('h3', { class: 'empty-state-title' }, 'No hay juegos encontrados');
  const descText = searchInput.value.trim() 
    ? 'Intenta cambiar los filtros o ajustar el término de búsqueda.' 
    : 'Haz clic en "Añadir Juego" para comenzar a expandir tu colección.';
  const desc = createElementHelper('p', { class: 'empty-state-desc' }, descText);

  return createElementHelper(
    'div', 
    { class: 'empty-state' }, 
    iconWrapper.firstElementChild, 
    title, 
    desc
  );
}

/**
 * CALLBACK: Alternar estado de completación desde el checkbox rápido de la tarjeta.
 */
function handleToggleTaskStatus(taskId) {
  const updated = toggleTaskCompleted(taskId);
  if (updated) {
    // Éxito: Re-renderizar métricas y lista
    renderStats();
    renderTaskList();
    
    const message = updated.status === 'completada' 
      ? '¡Excelente! Juego marcado como completado.' 
      : 'Juego devuelto al backlog.';
    showToast(message, 'success');
  }
}

/**
 * CALLBACK: Presionar editar en una tarjeta. Carga y abre el modal de formulario.
 */
function handleEditTaskClick(task) {
  openTaskModal(task);
}

/**
 * CALLBACK: Presionar eliminar en una tarjeta. Pide confirmación al usuario.
 */
function handleDeleteTaskClick(taskId, taskTitle) {
  openConfirmModal(taskTitle, () => {
    // Al confirmar, realizar animación de salida elegante antes de eliminar del DOM
    const cardElement = document.getElementById(`task-${taskId}`);
    if (cardElement) {
      cardElement.classList.add('slide-out');
      // Esperar que termine la animación
      cardElement.addEventListener('transitionend', () => {
        deleteTask(taskId);
        renderApp();
        showToast('Juego eliminado de la colección.', 'success');
      }, { once: true });
    } else {
      deleteTask(taskId);
      renderApp();
      showToast('Juego eliminado de la colección.', 'success');
    }
  });
}

/**
 * EVENT: Envío del formulario de guardado (Crear/Editar).
 * Realiza validaciones finales de integridad y actualiza el store.
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const titleInput = querySafe('#task-title-input', taskForm);
  const categoryInput = querySafe('#task-category-input', taskForm);
  const dateInput = querySafe('#task-due-date-input', taskForm);

  // Ejecutar validaciones completas
  const isTitleValid = validateField(titleInput, validateTitle(titleInput.value));
  const isCatValid = validateField(categoryInput, validateCategory(categoryInput.value));
  const isDateValid = validateField(dateInput, validateDueDate(dateInput.value));

  if (!isTitleValid || !isCatValid || !isDateValid) {
    showToast('Por favor, corrige los campos del formulario.', 'error');
    return;
  }

  // Recoger valores
  const taskId = querySafe('#task-id', taskForm).value;
  const title = titleInput.value;
  const description = querySafe('#task-desc-input', taskForm).value;
  const category = categoryInput.value;
  const priority = querySafe('#task-priority-input', taskForm).value;
  const dueDate = dateInput.value;

  if (taskId) {
    // Actualizar tarea existente
    const status = querySafe('#task-status-input', taskForm).value;
    updateTask(taskId, { title, description, category, priority, dueDate, status });
    showToast('Juego actualizado correctamente.', 'success');
  } else {
    // Crear nueva tarea
    addTask({ title, description, category, priority, dueDate });
    showToast('Nuevo juego agregado a la colección.', 'success');
  }

  // Cerrar y repintar todo
  closeTaskModal();
  renderApp();
}

/**
 * EVENT: Procesamiento del archivo JSON cargado para importación.
 */
function handleImportJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const text = event.target.result;
      const count = await importTasksFromJSON(text);
      
      // Limpiar input file
      importInput.value = '';
      
      // Actualizar UI
      renderApp();
      showToast(`Importación exitosa: ${count} videojuegos cargados.`, 'success');
    } catch (error) {
      importInput.value = '';
      showToast(`Error al importar: ${error.message}`, 'error');
    }
  };
  
  reader.readAsText(file);
}
