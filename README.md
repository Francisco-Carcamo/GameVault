# 🎮 GameVault — Colección y Estadísticas de Videojuegos

> Administra tu colección de videojuegos, filtra, organiza y realiza seguimiento de tu progreso como gamer.

![GameVault Banner](https://img.shields.io/badge/GameVault-v1.0.0-7c3aed?style=for-the-badge&logo=gamepad&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6%20Modules-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![WCAG](https://img.shields.io/badge/WCAG-Accesible-10b981?style=for-the-badge)
![XSS Free](https://img.shields.io/badge/XSS-Protegido-06b6d4?style=for-the-badge)

---

# 📋 Descripción

GameVault es una aplicación web de gestión de colecciones de videojuegos desarrollada con JavaScript Vanilla puro (sin frameworks). Permite agregar, editar, eliminar y filtrar juegos de tu colección personal, con estadísticas en tiempo real, tema oscuro/claro, exportación e importación de datos y una interfaz visual moderna.

---

# ✨ Características

## 🗂️ Gestión de Juegos

- ✅ Agregar juegos con título, género, hype, fecha y notas.
- ✅ Editar cualquier juego de la colección.
- ✅ Eliminar con modal de confirmación.
- ✅ Marcar como completado con un solo clic.

## 🔍 Búsqueda y Filtros

- ✅ Búsqueda en tiempo real por título, género y descripción.
- ✅ Filtro por estado.
- ✅ Filtro por hype.
- ✅ Filtro por género.
- ✅ Ordenamiento por nombre, fecha e importancia.
- ✅ Combinación de múltiples filtros simultáneamente.

## 📊 Estadísticas

- 🎯 Total de videojuegos.
- ✔️ Juegos completados.
- 🕹️ Juegos en progreso.
- ⚠️ Juegos pendientes.
- 🔵 Indicador gráfico de progreso.

## 🎨 UI / UX

- 🌑 Tema oscuro / claro.
- 📱 Diseño completamente responsive.
- 💫 Animaciones suaves.
- 🔔 Notificaciones visuales.
- ♿ Accesibilidad mediante atributos ARIA.

## 🔒 Seguridad

- 🛡️ Prevención de ataques XSS utilizando createElement(), createTextNode() y textContent.
- 🔐 Sanitización de todas las entradas del usuario.
- ✅ Validación completa de formularios.

## 💾 Persistencia

- 📦 LocalStorage.
- 📤 Exportación de colección en JSON.
- 📥 Importación de colección desde JSON.

---

# 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript ES6 Modules
- LocalStorage API
- SVG
- GitHub Pages

---

# 📁 Estructura del Proyecto

```
GameVault/
│
├── index.html
├── package.json
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── dom.js
│   ├── state.js
│   ├── util.js
│   │
│   └── components/
│       ├── modals.js
│       ├── statsPanel.js
│       ├── taskCard.js
│       └── toast.js
│
├── README.md
└── USO_IA.md
```

---

# 🚀 Uso

## Clonar el repositorio

```bash
git clone https://github.com/francisco-carcamo/GameVault.git
```

Entrar al proyecto

```bash
cd GameVault
```

Ejecutar servidor local

```bash
npm start
```

o

```bash
npx http-server -p 3000 -c-1
```

---

# 🌐 Demo

## GitHub Pages

https://francisco-carcamo.github.io/GameVault/

---

# 🕹️ Cómo usar

- Agregar videojuegos.
- Editarlos.
- Eliminarlos.
- Buscar por nombre.
- Filtrar por género.
- Filtrar por estado.
- Filtrar por hype.
- Ordenar la colección.
- Exportar e importar la colección.
- Consultar estadísticas en tiempo real.

---

# 👨‍💻 Autor

Francisco Cárcamo

GitHub

https://github.com/francisco-carcamo

Proyecto desarrollado para la Evaluación Sumativa N°2 de Front-End — INACAP.

---

# 🤖 Uso de IA

Ver archivo USO_IA.md para el detalle completo del uso de IA en este proyecto.

---

# 📄 Licencia

MIT — Uso educativo.
