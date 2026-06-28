# 🎮 GameVault — Colección y Estadísticas de Videojuegos

> Administra tu colección de videojuegos, filtra, organiza y realiza seguimiento de tu progreso como gamer.

![GameVault Banner](https://img.shields.io/badge/GameVault-v1.0.0-7c3aed?style=for-the-badge&logo=gamepad&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6%20Modules-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![WCAG](https://img.shields.io/badge/WCAG-Accesible-10b981?style=for-the-badge)
![XSS Free](https://img.shields.io/badge/XSS-Protegido-06b6d4?style=for-the-badge)

---

## 📋 Descripción

**GameVault** es una aplicación web de gestión de colecciones de videojuegos desarrollada con **JavaScript Vanilla puro** (sin frameworks). Permite agregar, editar, eliminar y filtrar juegos de tu colección personal, con estadísticas en tiempo real, tema oscuro/claro, exportación e importación de datos y una interfaz visual de estética AAA.

---

## ✨ Características

### 🗂️ Gestión de Juegos
- ✅ **Agregar** juegos con título, género, hype, fecha y notas
- ✅ **Editar** cualquier juego de la colección
- ✅ **Eliminar** con modal de confirmación y animación de salida
- ✅ **Marcar como completado** con un solo clic (checkbox rápido)

### 🔍 Búsqueda y Filtros
- ✅ **Búsqueda en tiempo real** por título, género y descripción
- ✅ **Filtro por estado**: Pendiente / Jugando / Completado / Atrasado
- ✅ **Filtro por hype**: Crítico / Moderado / Casual
- ✅ **Filtro por género** (generado dinámicamente desde los datos)
- ✅ **Ordenamiento**: fecha, hype, nombre, fecha de registro
- ✅ **Combinación de múltiples filtros** simultáneos

### 📊 Estadísticas en Tiempo Real
- 🎯 Total de juegos en la colección
- ✔️ Juegos completados con porcentaje beaten
- 🕹️ Juegos en progreso y backlog
- ⚠️ Juegos atrasados con alerta visual
- 🔵 Gráfico circular SVG de progreso animado

### 🎨 UI/UX
- 🌑 **Tema oscuro / claro** persistente (detecta preferencia del SO)
- 📱 **100% Responsive**: PC, Tablet y Celular
- 💫 **Glassmorphism** con efectos de blur y neón
- 🔔 **Toasts** de notificación animados con barra de progreso
- ♿ **Accesible**: atributos ARIA, navegación por teclado, `<dialog>` nativo

### 🔒 Seguridad
- 🛡️ **Prevención XSS**: uso de `createTextNode` / `createElementHelper` — nunca `innerHTML` con datos dinámicos
- 🔐 **Sanitización** de todos los inputs antes de guardar
- ✅ **Validaciones** de formulario en tiempo real (título, categoría, fecha)

### 💾 Persistencia de Datos
- 📦 **LocalStorage** automático — los datos persisten entre sesiones
- 📤 **Exportar** colección a JSON
- 📥 **Importar** colección desde JSON con validación de estructura

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura y accesibilidad (`<dialog>`, `<article>`, ARIA) |
| CSS3 + Custom Properties | Sistema de diseño con tokens, glassmorphism, animaciones |
| JavaScript ES6 Modules | Arquitectura modular sin frameworks |
| LocalStorage API | Persistencia de datos en el navegador |
| SVG inline | Gráfico de progreso circular animado |
| `crypto.randomUUID()` | Generación segura de IDs únicos |

---

## 📁 Estructura del Proyecto

```
GameVault/
├── index.html              # Estructura HTML semántica + modales nativos
├── css/
│   └── styles.css          # Sistema de diseño completo (tokens, temas, responsive)
├── js/
│   ├── app.js              # Controlador principal (bootstrap + eventos)
│   ├── state.js            # Gestor de estado global + CRUD + LocalStorage
│   ├── dom.js              # Utilidades DOM seguras (XSS-free)
│   ├── utils.js            # Funciones puras (UUID, sanitize, formatDate, validaciones)
│   └── components/
│       ├── modal.js        # Componente <dialog> nativo
│       ├── taskCard.js     # Componente tarjeta de videojuego
│       ├── statsPanel.js   # Panel KPI + Gráfico SVG
│       └── toast.js        # Notificaciones dinámicas
├── README.md
└── USO_IA.md
```

---

## 🚀 Instalación y Uso

### Opción 1 — Abrir directo (recomendado para evaluación)
```bash
# Clonar el repositorio
git clone https://github.com/Francisco-Carcamo/GameVault.git
cd GameVault

# Iniciar servidor local
npx http-server -p 3000 -c-1

# Abrir en el navegador
# → http://localhost:3000
```

### Opción 2 — GitHub Pages
Visita la demo en vivo: **[Francisco-Carcamo.github.io/GameVault](https://Francisco-Carcamo.github.io/Gamevault)**

### Opción 3 — Sin servidor
Abrir `index.html` directamente en el navegador (algunas funciones de módulos ES6 requieren servidor local o GitHub Pages).

---

## 🖼️ Capturas de Pantalla

### Modo Oscuro — Vista Principal
*Dashboard con estadísticas, filtros y colección de juegos*

### Modo Claro — Formulario de Juego
*Modal con validaciones en tiempo real y campos de juego*

### Vista Móvil
*Diseño responsive optimizado para dispositivos pequeños*

---

## 🕹️ Cómo usar GameVault

1. **Añadir un juego**: Clic en el botón **"Añadir Juego"** → Completa el formulario → Guardar
2. **Marcar completado**: Clic en el checkbox en la esquina de la tarjeta
3. **Editar**: Clic en el ícono ✏️ de la tarjeta
4. **Eliminar**: Clic en el ícono 🗑️ → Confirmar en el modal
5. **Buscar**: Escribe en la barra de búsqueda (filtra en tiempo real)
6. **Filtrar**: Usa los selectores de Estado, Hype y Género
7. **Exportar**: Botón **"Exportar Vault"** → descarga JSON
8. **Importar**: Botón **"Importar Vault"** → selecciona tu archivo JSON

---

## 👤 Autor

Francisco Cárcamo
- GitHub: **[@Francisco-Carcamo](https://github.com/Francisco-Carcamo)**
- Proyecto desarrollado para evaluación **INACAP 2026**

---

## 🤖 Uso de Inteligencia Artificial

Ver archivo [`USO_IA.md`](./USO_IA.md) para el detalle completo del uso de IA en este proyecto.

---

## 📄 Licencia

MIT — Libre para uso educativo.
