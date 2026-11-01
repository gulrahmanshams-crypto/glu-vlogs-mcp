import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GLU VLOGS MCP Server is running!");
});

app.post("/mcp", async (req, res) => {
  const server = new McpServer({
    name: "glu-vlogs-manager",
    version: "1.0.0"
  });

  server.registerTool(
    "channel_server_status",
    {
      description: "Check the GLU VLOGS server status",
      inputSchema: {}
    },
    async () => ({
      content: [{
        type: "text",
        text: "GLU VLOGS server is running successfully."
      }]
    })
  );

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Server error");
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`GLU VLOGS server running on port ${PORT}`);
});
