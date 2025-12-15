import { type MastraMCPServerDefinition, MCPClient } from "@mastra/mcp";

const os = process.env.OS;

type Tools = {
  [key: string]: MastraMCPServerDefinition;
};

const getToolsFromOS = (tool: string) => {
  if (os?.toLowerCase().includes("windows")) {
    const tools: Tools = {
      yahoo: {
        command: "cmd",
        args: ["/c", "pnpm", "dlx", "yahoo-finance-mcp"],
      },
      antvCharts: {
        command: "cmd",
        args: ["/c", "pnpm", "dlx", "@antv/mcp-server-chart"],
        env: {
          DISABLED_TOOLS: `generate_district_map,generate_dual_axes_chart,generate_fishbone_diagram,
          generate_funnel_chart,generate_histogram_chart,generate_liquid_chart,generate_mind_map,generate_network_graph,
          generate_organization_chart,generate_path_map,generate_pie_chart,generate_pin_map,
          generate_sankey_chart,generate_treemap_chart,generate_venn_chart,generate_violin_chart,
          generate_word_cloud_chart,generate_district_map,generate_network_graph,generate_sankey_chart,
          generate_word_cloud_chart,generate_funnel_chart`,
        },
      },
      duckduckGo: {
        command: "ddg-search-mcp",
      },
    };
    return tools[tool];
  } else {
    const tools: Tools = {
      yahoo: {
        command: "pnpm",
        args: ["dlx", "yahoo-finance-mcp"],
      },
      antvCharts: {
        command: "pnpm",
        args: ["dlx", "@antv/mcp-server-chart"],
        env: {
          DISABLED_TOOLS: `generate_district_map,generate_dual_axes_chart,generate_fishbone_diagram,
          generate_funnel_chart,generate_histogram_chart,generate_liquid_chart,generate_mind_map,generate_network_graph,
          generate_organization_chart,generate_path_map,generate_pie_chart,generate_pin_map,
          generate_sankey_chart,generate_treemap_chart,generate_venn_chart,generate_violin_chart,
          generate_word_cloud_chart,generate_district_map,generate_network_graph,generate_sankey_chart,
          generate_word_cloud_chart,generate_funnel_chart`,
        },
      },
      duckduckGo: {
        command: "ddg-search-mcp",
      },
    };
    return tools[tool];
  }
};

export const financeTools = new MCPClient({
  id: "finance-tools",
  servers: {
    yahooFinance: {
      ...getToolsFromOS("yahoo"),
    },
    antvCharts: {
      ...getToolsFromOS("antvCharts"),
    },
    duckduckGo: {
      ...getToolsFromOS("duckduckGo"),
    },
  },
});
