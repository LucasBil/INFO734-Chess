import { WebSocketServer } from 'ws';
import { RoomManager } from './managers/RoomManager.js';
import { PlayerManager } from './managers/PlayerManager.js';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const roomManager = new RoomManager();
const playerManager = new PlayerManager();

console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  let player = null;

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'LOGIN') {
      player = playerManager.addPlayer(ws, message.data);
      return;
    }

    if (!player) return; // Not logged

    handleMessage(player, message);
  });

  ws.on('close', () => {
    if (!player) { return; }
    roomManager.handleDisconnect(player);
    playerManager.removePlayer(player.id);
  });
});

function handleMessage(player, message) {
  switch (message.type) {
    case 'FIND_GAME':
      roomManager.matchmake(player);
      break;

    case 'MOVE':
      roomManager.broadcastMove(player, message.data);
      break;

    case 'CHAT':
      roomManager.broadcastChat(player, message.data);
      break;

    case 'MATE':
      roomManager.broadcastMate(player);
      break;

    case 'STALEMATE':
      roomManager.broadcastStalemate(player);
      break;

    case 'DRAW':
      roomManager.broadcastDraw(player);
      break;

    case 'RESIGN':
      roomManager.broadcastResign(player);
      break;

    default:
      console.log(`❓ Unknown message type: ${message.type}`);
  }
}
