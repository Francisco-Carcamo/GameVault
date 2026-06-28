/**
 * ==========================================================================
 * TASKFLOW — UTILIDADES DE MANIPULACIÓN SEGURA DEL DOM (XSS-FREE)
 * ==========================================================================
 */

/**
 * Crea un elemento HTML de forma segura con atributos, eventos e hijos.
 * Esta función es la piedra angular para evitar el uso de innerHTML con datos dinámicos.
 * 
 * @param {string} tag - Nombre de la etiqueta HTML (ej: 'div', 'span', 'h2').
 * @param {Object} [attributes] - Atributos a asignar al elemento. Admite eventos (prefijo 'on') y dataset.
 * @param {...(HTMLElement|string|null|undefined|Array)} children - Elementos hijos o textos.
 * @returns {HTMLElement} El elemento HTML creado.
 */
export function createElementHelper(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  // Asignar atributos y eventos
  if (attributes && typeof attributes === 'object') {
    for (const [key, value] of Object.entries(attributes)) {
      if (value === undefined || value === null) continue;

      // Soporte para Event Listeners (ej: onclick: () => {})
      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
      }
      // Soporte para Clases CSS
      else if (key === 'class' || key === 'className') {
        // Soporta múltiples clases separadas por espacios
        const classes = String(value).split(' ').filter(Boolean);
        if (classes.length > 0) {
          element.classList.add(...classes);
        }
      }
      // Soporte para atributos dataset
      else if (key === 'dataset' && typeof value === 'object') {
        for (const [dataKey, dataVal] of Object.entries(value)) {
          element.dataset[dataKey] = dataVal;
        }
      }
      // Atributos booleanos (ej: disabled, required, readOnly)
      else if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(key, '');
          // Para propiedades booleanas que el DOM necesita reflejar directamente
          if (key in element) {
            element[key] = true;
          }
        } else {
          element.removeAttribute(key);
          if (key in element) {
            element[key] = false;
          }
        }
      }
      // Atributos generales
      else {
        element.setAttribute(key, String(value));
      }
    }
  }

  // Agregar elementos hijos de forma recursiva y segura
  const appendChildSafe = (child) => {
    if (child === null || child === undefined || child === false) {
      return;
    }

    if (Array.isArray(child)) {
      child.forEach(appendChildSafe);
    } else if (child instanceof Node) {
      element.appendChild(child);
    } else {
      // Si es un texto o número, se agrega como nodo de texto seguro (escapado automáticamente por el navegador)
      element.appendChild(document.createTextNode(String(child)));
    }
  };

  children.forEach(appendChildSafe);
  return element;
}

/**
 * Limpia todo el contenido de un contenedor y añade nuevos elementos hijos de forma atómica.
 * Reemplaza el uso inseguro y lento de `container.innerHTML = ''` por `replaceChildren()`.
 * 
 * @param {HTMLElement} container - El elemento contenedor.
 * @param {...(HTMLElement|Node|string)} elements - Los nuevos elementos hijos.
 */
export function renderContainer(container, ...elements) {
  if (!container) return;
  // replaceChildren limpia y añade en un solo paso de alta performance
  container.replaceChildren(...elements.filter(Boolean));
}

/**
 * Encuentra un elemento en el DOM y lanza un error descriptivo si no lo encuentra.
 * Facilita el desarrollo libre de errores silenciosos tipo "cannot read properties of null".
 * 
 * @param {string} selector - Selector CSS para buscar en el DOM.
 * @param {HTMLElement|Document} [context=document] - Contexto donde buscar.
 * @returns {HTMLElement} El elemento encontrado.
 * @throws {Error} Si el elemento no existe en el DOM.
 */
export function querySafe(selector, context = document) {
  const element = context.querySelector(selector);
  if (!element) {
    throw new Error(`[DOM Error] Elemento con el selector "${selector}" no fue encontrado en el DOM.`);
  }
  return element;
}
