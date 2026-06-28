# 🤖 USO_IA.md — Uso de Inteligencia Artificial en GameVault

## Herramientas Utilizadas

| Herramienta | Propósito principal |
|---|---|
| **ChatGPT (OpenAI)** | Generación del prompt base y definición de requisitos del proyecto |
| **Google Antigravity** | Desarrollo completo de la aplicación: código, diseño, seguridad y arquitectura |
| **Claude (Anthropic)** | Revisión final de archivos, correcciones, documentación y ajustes de entrega |

---

## Flujo de Trabajo con IA

El proceso de desarrollo siguió tres etapas secuenciales con distintas herramientas:

```
ChatGPT  →  Google Antigravity  →  Claude
(Prompt)       (Desarrollo)        (Revisión)
```

---

## ¿Para qué se utilizó cada herramienta?

### 1. 💬 ChatGPT — Generación del Prompt Base
Antes de comenzar a desarrollar, se utilizó ChatGPT para estructurar y redactar un prompt detallado que describiera todos los requisitos del proyecto: funcionalidades esperadas, criterios de seguridad, accesibilidad, diseño visual y estructura modular. Este prompt fue el punto de partida para trabajar con Google Antigravity.

### 2. 🏗️ Google Antigravity — Desarrollo de la Aplicación
Con el prompt generado en la etapa anterior, se utilizó Google Antigravity para construir toda la aplicación. Esto incluyó:

**Arquitectura Modular**
La herramienta propuso dividir la aplicación en módulos ES6 independientes, separando responsabilidades entre `state.js`, `dom.js`, `utils.js` y los componentes en `/components/`.

**Diseño Visual AAA**
Se generó el sistema de diseño completo: paleta neón, glassmorphism, tipografía Orbitron, efectos glow según prioridad, scrollbar personalizada y soporte de tema oscuro/claro.

**Prevención de XSS**
Se implementó el uso de `createElement` y `createTextNode` en lugar de `innerHTML` con datos dinámicos, derivando en la función `createElementHelper()` en `dom.js`.

**Ejemplo concreto implementado:**
```javascript
// ❌ INSEGURO — permite inyección XSS
element.innerHTML = userInput;

// ✅ SEGURO — el navegador escapa automáticamente
element.appendChild(document.createTextNode(userInput));
```

**Sanitización de Inputs**
Se creó la función `sanitizeInput()` en `utils.js` que reemplaza caracteres peligrosos (`<`, `>`, `"`, `'`, `/`) por sus entidades HTML seguras.

**Accesibilidad WCAG**
Se incorporaron atributos ARIA en toda la aplicación:
- `aria-label` en botones de acción
- `aria-live="polite"` en mensajes de error y badge contador
- `aria-modal="true"` y `aria-labelledby` en los modales `<dialog>`
- Clases `.sr-only` para labels ocultos para lectores de pantalla

**Gráfico SVG Circular Animado**
Se implementó el anillo de progreso usando `stroke-dasharray` y `stroke-dashoffset` sin depender de librerías externas.

**Validaciones en Tiempo Real**
Se desarrollaron las funciones `validateTitle()`, `validateCategory()` y `validateDueDate()` con feedback visual inmediato en el formulario.

### 3. 🔍 Claude (Anthropic) — Revisión Final y Entrega
Una vez desarrollada la aplicación, se utilizó Claude para revisar todos los archivos del proyecto. Las tareas realizadas en esta etapa fueron:

- Detectar y corregir inconsistencias de texto (ej: el modal decía "Nueva Tarea" en lugar de "Añadir Juego")
- Agregar el subtítulo descriptivo al header de la aplicación
- Organizar y verificar la estructura de carpetas para GitHub Pages
- Redactar el `README.md` y este archivo `USO_IA.md`
- Resolver dudas sobre el proceso de publicación en GitHub Pages

---

## ¿Qué NO hizo la IA?

- Las pruebas funcionales (XSS, filtros, exportar/importar, responsive) se realizaron **manualmente en el navegador**
- La decisión de usar cada herramienta en cada etapa fue **propia**
- La integración del prompt con los requisitos reales de la evaluación fue **definida de forma independiente**
- La verificación final de que todo funcionara correctamente antes de la entrega fue **manual**

---

## Reflexión Final

El flujo de trabajo con múltiples herramientas de IA permitió aprovechar las fortalezas de cada una: ChatGPT para estructurar ideas, Google Antigravity para generar una aplicación completa y funcional, y Claude para revisar, corregir y documentar antes de la entrega. Este enfoque refleja cómo se usa la IA en el mundo profesional real: no como reemplazo del desarrollador, sino como conjunto de herramientas especializadas para distintas etapas del proyecto.

---

*Proyecto desarrollado para la Evaluación Sumativa N°2 de Front-End — INACAP 2026*
