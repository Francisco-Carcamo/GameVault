# 🤖 USO_IA.md — Uso de Inteligencia Artificial en GameVault

## Herramientas Utilizadas

| Herramienta | Propósito principal |
|---|---|
| **Claude (Anthropic)** | Arquitectura, revisión de código, documentación |
| **ChatGPT (OpenAI)** | Consultas puntuales sobre CSS y accesibilidad |

---

## ¿Para qué se utilizó la IA?

### 1. 🏗️ Arquitectura Modular del Proyecto
Se consultó a la IA para definir cómo dividir la aplicación en módulos ES6 independientes y reutilizables. El resultado fue la separación entre `state.js`, `dom.js`, `utils.js` y los componentes en `/components/`.

### 2. 🛡️ Prevención de XSS (Cross-Site Scripting)
La IA explicó por qué `innerHTML` es vulnerable y cómo reemplazarlo con `document.createElement` y `createTextNode`. Esto derivó en la creación de la función `createElementHelper()` en `dom.js`, que construye el DOM de forma completamente segura.

**Ejemplo concreto aprendido:**
```javascript
// ❌ INSEGURO — permite inyección XSS
element.innerHTML = userInput;

// ✅ SEGURO — el navegador escapa automáticamente
element.appendChild(document.createTextNode(userInput));
```

### 3. 🔁 Sanitización de Inputs
La función `sanitizeInput()` en `utils.js` fue diseñada con ayuda de la IA para reemplazar caracteres peligrosos (`<`, `>`, `"`, `'`, `/`) por sus entidades HTML seguras, previniendo XSS incluso si algún dato llegara al DOM por otro camino.

### 4. 🧩 Componentes Reutilizables
La IA sugirió el patrón de funciones creadoras de nodos DOM (`createTaskCard`, `createKPICard`, etc.) en lugar de plantillas de strings HTML, logrando componentes modulares, seguros y fáciles de mantener.

### 5. ♿ Accesibilidad WCAG
Con la IA se identificaron los atributos ARIA necesarios:
- `aria-label` en botones de acción
- `aria-live="polite"` en mensajes de error y badge contador
- `aria-modal="true"` y `aria-labelledby` en los modales `<dialog>`
- Clases `.sr-only` para labels ocultos visualmente pero presentes para lectores de pantalla

### 6. 📊 Gráfico SVG Circular Animado
Se utilizó la IA para entender la técnica de `stroke-dasharray` y `stroke-dashoffset` en SVG para crear el anillo de progreso de la colección sin depender de librerías externas.

### 7. 🔄 Refactorización y Optimización
La IA revisó funciones para:
- Reemplazar `innerHTML = ''` por `replaceChildren()` (más rápido y atómico)
- Optimizar el renderizado de listas evitando re-renders innecesarios
- Mejorar el manejo de errores en localStorage con bloques `try/catch`

### 8. 📝 Documentación JSDoc
Los comentarios `@param`, `@returns` y las descripciones de cada función fueron escritos con asistencia de la IA para mantener un estándar profesional de documentación.

---

## ¿Qué NO hizo la IA?

- La IA **no escribió el código final** — actuó como consultor y revisor
- Las decisiones de diseño visual (paleta neón, glassmorphism, tipografía Orbitron) fueron propias
- La lógica de negocio (filtros combinados, cálculo de estadísticas, detección de juegos atrasados) fue implementada de forma independiente
- Las pruebas funcionales y de accesibilidad se realizaron manualmente en el navegador

---

## Reflexión Final

El uso de IA en este proyecto permitió aprender mejores prácticas de seguridad web (XSS), accesibilidad (WCAG) y arquitectura de software (modularización) que de otro modo habrían tomado mucho más tiempo de investigación. La IA funcionó como un tutor técnico que explica el "por qué" detrás de cada decisión, no solo el "cómo".

---

*Proyecto desarrollado para evaluación INACAP 2026 — Desarrollo Web con JavaScript Vanilla*
