import { v4 as uuidv4 } from 'uuid';
import { sendMessage, broadcastRoom } from '../utils/messages.js';

export class RoomManager {
  constructor() {
    this.waitingPlayers = [];
    this.rooms = new Map(); // roomId → { players, chat, boardState }
  }

  matchmake(player) {
    if (this.waitingPlayers.length > 0) {
      const opponent = this.waitingPlayers.pop();
      const roomId = uuidv4();

      const room = {
        id: roomId,
        players: [player, opponent],
        chat: [],
        boardState: null,
      };

      this.rooms.set(roomId, room);
      player.roomId = roomId;
      opponent.roomId = roomId;

      console.log(`♟️ Room created: ${roomId}`);

      sendMessage(player, {
        type: 'MATCH_FOUND',
        data: { roomId, color: 'white', opponent: opponent },
      });
      sendMessage(opponent, {
        type: 'MATCH_FOUND',
        data: { roomId, color: 'black', opponent: player },
      });
    } else {
      this.waitingPlayers.push(player);
      sendMessage(player, { type: 'WAITING', data: 'Waiting for opponent...' });
    }
  }

  broadcastMove(player, move) {
    const room = this.rooms.get(player.roomId);
    if (!room) return;
    broadcastRoom(room, { type: 'MOVE', data: move });
  }

  broadcastChat(player, text) {
    const room = this.rooms.get(player.roomId);
    if (!room) return;

    const message = { sender: player.id, text, time: Date.now() };
    room.chat.push(message);

    broadcastRoom(room, { type: 'CHAT', data: message });
  }

  handleDisconnect(player) {
    if (player.roomId && this.rooms.has(player.roomId)) {
      const room = this.rooms.get(player.roomId);
      const opponent = room.players.find(p => p.id !== player.id);
      if (opponent) {
        sendMessage(opponent, { type: 'OPPONENT_LEFT' });
      }
      this.rooms.delete(player.roomId);
    } else {
      this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== player.id);
    }
  }
}
