# OrionTek - Gestión de Clientes

Prueba técnica para la posición de Frontend Senior en OrionTek.

## El reto

> Se desea tener el control de todos los clientes pertenecientes a la empresa OrionTek donde cada cliente puede tener N cantidad de direcciones. Con sus conocimientos de desarrollo se solicita crear una solución informática para este problema.

La prueba pedía una solución frontend en ReactJS con repo público y tiempo límite de 24 a 48 horas.

## Requerimientos solicitados

Stack mencionado en la descripción de la vacante:

- React 18 con TypeScript 5
- Redux Toolkit + React Redux
- React Router DOM v6
- Material UI (MUI) v5 + Emotion
- SCSS / Tailwind CSS
- Webpack 5 y Axios
- ESLint con plug-ins
- Arquitectura por pages

## Stack utilizado

- **React 18 + TypeScript 5** (modo strict)
- **Webpack 5** con configuración manual
- **Redux Toolkit** con async thunks para el manejo de estado y llamadas HTTP
- **React Router DOM v6** con lazy loading en las páginas principales
- **Material UI v5** con tema custom
- **SCSS Modules** para los componentes con estilos custom
- **Axios** como cliente HTTP, con interceptor para normalizar errores
- **JSON Server** como backend mock (corre en paralelo con `concurrently`)
- **react-hook-form + Zod** para formularios y validación tipada
- **ESLint** con plugins para TypeScript, React, hooks, jsx-a11y e import/order

## Cómo correr el proyecto

```bash
npm install
npm start
```

Esto levanta dos procesos en paralelo:
- **API mock** en `http://localhost:3001` (json-server con `db.json`)
- **Frontend** en `http://localhost:3000`

El frontend hace peticiones a `/api/*` que webpack-dev-server proxya a json-server.

### Otros scripts

```bash
npm run dev          # solo el frontend
npm run server       # solo el backend mock
npm run build        # build de producción
npm run type-check   # verifica tipos sin compilar
npm run lint         # corre ESLint
```

## Estructura

src/
├── api/             Cliente Axios con interceptor de errores
├── components/      Componentes compartidos (Layout, EmptyState, ConfirmDialog...)
├── hooks/           Hooks reutilizables
├── pages/
│   ├── Clients/         Listado con búsqueda, paginación y CRUD
│   ├── ClientDetail/    Detalle del cliente con CRUD de direcciones
│   └── NotFound/
├── routes/          Configuración de rutas con lazy loading
├── services/        Capa que abstrae las llamadas a la API
├── store/           Redux: slice, selectors, hooks tipados
├── styles/          Variables y mixins SCSS globales
├── theme/           Theme custom de MUI
├── types/           Tipos del dominio (Client, Address)
└── utils/           Validators con Zod, helpers


## Notas

- El dataset inicial son 3 clientes en `db.json`. Uno con 2 direcciones, uno con 1, y uno sin direcciones — para cubrir los distintos estados de la UI.
- Los datos se persisten en `db.json`, así que sobreviven a refreshes y reinicios.
- La paginación es del lado del cliente. Para datasets reales debería moverse al backend.