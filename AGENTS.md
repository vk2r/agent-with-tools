# Herramientas del Proyecto

Este proyecto utiliza las siguientes herramientas principales para desarrollo de agentes de IA con interfaz web:

## Framework y Lenguaje

- **Next.js**: Framework React para aplicaciones web full-stack.
- **TypeScript**: Superset de JavaScript con tipado estático.
- **React**: Biblioteca de interfaces de usuario.

## Estilos y UI

- **Tailwind CSS**: Framework CSS utilitario para diseño rápido.
- **@tailwindcss/postcss**: Integración PostCSS para Tailwind CSS.
- **@tailwindcss/typography**: Plugin de tipografía para Tailwind.
- **shadcn-ui**: Componentes UI accesibles basados en Radix UI.
- **Lucide React**: Biblioteca de iconos SVG.
- **@radix-ui/react-dropdown-menu**: Menú contextual accesible.
- **@radix-ui/react-tooltip**: Tooltips accesibles.
- **@radix-ui/react-separator**: Separadores accesibles.
- **@radix-ui/react-slot**: Utilidad de slotting para componer componentes.
- **class-variance-authority**: Variantes de clases para componentes.
- **clsx**: Concatenación condicional de clases.
- **tailwind-merge**: Unificación de clases de Tailwind.
- **PostCSS**: Procesador de CSS.

## IA y Agentes

- **Mastra Core**: Framework para construir agentes de IA.
- **Mastra MCP**: Integración de herramientas vía MCP.
- **Mastra Memory**: Gestión de memoria para agentes.
- **Zod**: Validación de esquemas para datos.
- **AI SDK Ollama**: Integración con modelos locales vía Ollama.
- **Ollama Provider v2**: Proveedor para AI SDK compatible con Ollama.

## Base de Datos y Logging

- **Mastra LibSQL**: Base de datos SQL embebida.
- **Mastra Loggers**: Sistema de logging para agentes.

## Formularios

- **react-hook-form**: Manejo de formularios y validación.
- **@hookform/resolvers**: Integración de resolvers (Zod, etc.).

## Fechas y Zonas Horarias

- **date-fns**: Utilidades para manejo de fechas.
- **date-fns-tz**: Soporte de zonas horarias para date-fns.

## Markdown

- **react-markdown**: Renderizado de Markdown en React.
- **react-syntax-highlighter**: Resaltado de sintaxis en código.
- **remark-emoji**: Soporte de emojis en Markdown.
- **remark-gfm**: GitHub Flavored Markdown (tablas, checklists, etc.).
- **remark-math**: Soporte para fórmulas matemáticas.

## Desarrollo y Calidad

- **Biome**: Linter y formateador de código rápido.
- **Turbopack**: Acelerador de builds para Next.js.

## Instalar requirimientos con Proto

Proto es un gestor de versiones multi‑lenguaje que permite instalar y usar versiones específicas de herramientas sin tocar la configuración del sistema. Siga las instrucciones de instalacion [Aqui](https://moonrepo.dev/docs/proto/install).

```bash
proto i
```

## Comandos Útiles

- `pnpm dev`: Inicia el servidor de desarrollo con Turbopack.
- `pnpm build`: Construye la aplicación para producción con Turbopack.
- `pnpm start`: Inicia el servidor en modo producción con Next.js.
- `pnpm lint`: Ejecuta linting con Biome.
- `pnpm format`: Formatea código con Biome.
- `pnpm updates`: Ejecuta una búsqueda interactiva de actualizaciones de dependencias.
