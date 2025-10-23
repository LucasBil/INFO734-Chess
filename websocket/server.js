import { WebSocketServer } from "ws";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    console.log("✅ New client connected");

    ws.on("message", (message) => {
        console.log(`📩 Received message: ${message}`);
        ws.send(`Echo: ${message}`);
    });

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);