## Finantier

Agente financiero con almacenamiento de chats y uso de memoria, junto con el uso de las siguientes herramientas:

- Generacion de graficos e informes
- Uso de formulas financieras
- Precios en tiempo real
- Busqueda en internet
- Noticias financieras
- Recomendaciones de acciones

## Requisitos

- Node.js LTS (recomendado; 22+ mínimo)
- Cuenta y clave de API de OpenAI si usas el proveedor `openai`.
- Cuenta y clave de API de xAI si usas el proveedor `xai`.
- Para ejecucion local, el cliente Ollama debe estar instalado y se requiere una GPU con 16GB de VRAM como minimo (recomendado para ejecutar Finantier en local establemente).

### Instalación de Node.js (LTS)

Descarga el instalador LTS desde https://nodejs.org/ y sigue el asistente.

### Instalación de Ollama

Sigue la guía oficial: https://ollama.com/download

Una vez instalado, asegúrate de que el servicio esté activo en http://localhost:11434 y descarga modelos necesarios:

```bash
# Modelo de chat (recomendado)
ollama pull hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_XL
```

### Configuración de xAI

Crea una cuenta en https://console.x.ai y genera una API Key. Consulta la documentación: https://x.ai/api

### Variables de entorno (`.env`)

Ejemplo mínimo:

```
# Timezone (cambiar de acuerdo al pais de origen)
TZ="America/Santiago"

# OpenAI (requerido si usas OpenAI)
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5-nano"
OPENAI_MEMORY_LIMIT=20

# xAI (requerido si usas xAI)
XAI_API_KEY="xai-..."
XAI_MODEL="grok-4-1-fast-reasoning"
XAI_MEMORY_LIMIT=10

# Ollama (requerido si usas ollama)
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_CHAT_MODEL="hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_XL"
OLLAMA_MEMORY_LIMIT=5
OLLAMA_CONTEXT_WINDOW=81920 # Ventana de contexto (requerido para Ollama)
```

El proveedor por defecto es OpenAI. También puedes usar xAI u Ollama.

### Ejecutar

```bash
npm install
npm run dev
```

> Abre `http://localhost:3000`.

### Herramientas

Se tiene acceso a la siguiente lista de herramientas en formato MCP:
- **Yahoo Finance**
  - get_quote: Obtiene la cotización actual de una acción.  
  - get_historical_data: Obtiene los datos históricos de precios de una acción.  
  - search_symbols: Busca símbolos bursátiles por nombre, empresa o palabra clave.  
  - get_company_info: Obtiene información general y estadísticas de una empresa.  
  - get_recommendations: Obtiene las recomendaciones de analistas sobre una acción.  
  - get_trending_symbols: Obtiene los símbolos más populares o en tendencia en Yahoo Finance.  
  - get_market_summary: Obtiene un resumen general del mercado con los principales índices bursátiles.  
  - get_news: Busca y obtiene artículos de noticias relacionados con una consulta o símbolo.  
  - get_options: Obtiene los datos de opciones (calls y puts) de una acción.  
  - get_insights: Obtiene análisis e información adicional sobre una acción.  
  - get_daily_gainers: Obtiene las acciones con mayores ganancias del día.  
  - get_daily_losers: Obtiene las acciones con mayores pérdidas del día.  
  - get_chart: Obtiene los datos necesarios para generar un gráfico de una acción.  
  - get_quote_summary: Obtiene un resumen detallado de la cotización con distintos módulos de información.  
  - get_fundamentals_time_series: Obtiene los estados financieros detallados de una empresa a lo largo del tiempo (ingresos, balance y flujo de caja).

- **AntV Charts**
  - antvCharts_generate_area_chart: Genera un gráfico de área para visualizar tendencias y áreas bajo la curva.  
  - antvCharts_generate_column_chart: Genera un gráfico de columnas para comparar categorías.  
  - antvCharts_generate_line_chart: Genera un gráfico de líneas para visualizar tendencias en el tiempo.  
  - antvCharts_generate_organization_chart: Genera un diagrama de organigrama para representar estructuras jerárquicas.  
  - antvCharts_generate_word_cloud_chart: Genera un gráfico de nube de palabras para visualizar frecuencias y pesos.  

- **DuckDuckGo**
  - duckduckGo_web-search: Búsqueda en Internet usando DuckDuckGo y devuelve resultados con títulos, URLs y fragmentos.  
  - duckduckGo_fetch-url: Obtén y extrae el contenido principal de una URL específica (con opciones para longitud, filtros y extracción de enlaces/imágenes).  
  - duckduckGo_url-metadata: Extrae metadatos de una URL (título, descripción, Open Graph, favicon, etc.).  
  - duckduckGo_felo-search: Búsqueda avanzada impulsada por IA para información técnica (releases, guías de migración, benchmarks, documentación, insights comunitarios).

- **Mastra**
  - multi_tool_use.parallel: Wrapper para ejecutar múltiples herramientas en paralelo cuando sea posible. (Permite orquestar varias herramientas a la vez.)

### Almacenamiento

Los mensajes seran almacenados en los siguientes archivos:
- `src/store/threads.json`: Almacena los hilos de chat
- `mastra.db*`: Almacena la configuracion del agente, mensajes de chats y su memoria. Esta será generada automaticamente la 1era vez que se inicie el agente.

Esto facilita respaldos y depuración. No se usa ninguna base de datos externa por defecto.

### Modelos locales

Se han probado los siguientes modelos locales:
- "hf.co/unsloth/Qwen3-4B-Instruct-2507-GGUF:Q4_K_XL" (recomendado): Buena ejecucion de respuestas y uso de herramientas. Baja alucinacion. Alto costo en VRAM de GPU (15GB aprox).
- "hf.co/unsloth/granite-4.0-h-tiny-GGUF:Q8_K_XL": Buena ejecucion de respuestas y uso de herramientas. Alucinacion media. Costo medio en VRAM de GPU (11GB aprox).

### Problemas comunes
- Si usas Ollama y notas un uso muy alto en GPU es porque la respuesta generada es muy grande. Puedes reducir el limite de memoria de mensajes para reducir el uso de la ventana de contexto.
- Si usas Ollama, verifica que el servidor esté activo en `OLLAMA_BASE_URL` y que los modelos configurados estén disponibles localmente.
- Si usas Ollama, no se recomienda bajar la ventana de contexto. Se hicieron pruebas con 65536 tokens y el uso continuo con multiples mensajes bloqueaba el agente y generaba alucinaciones masivas.
- Si posee una GPU con mas de 16GB de VRAM (por ejemplo 24GB VRAM), puede aumentar la ventana de contexto hasta 128000 sin problemas.
- Si posee una GPU con menos de 16GB de VRAM, se recomienda usar OpenAI.


#### Nota:
> - Las respuestas del agente pueden variar entre ejecuciones, versiones de modelos o parámetros.
> - Las respuestas de cualquier modelo (Cloud o Local) no son 100% precisas. Se recomienda verificar la informacion.

## Licencia
Este proyecto está licenciado bajo [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).  
© 2025 Go Studios®. Todos los derechos reservados.  
Consulta el archivo [LICENSE](./LICENSE) para más detalles.
