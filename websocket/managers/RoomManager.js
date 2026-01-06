import { v4 as uuidv4 } from 'uuid';
import { sendMessage, broadcastRoom } from '../utils/messages.js';
import { ApiStore } from '../utils/api.js';

const apiStore = new ApiStore();
// We can log in the "system" user once the server starts or when needed.
// Ideally, we shouldn't hardcode credentials here, but for this context:
// Assuming 'dark' user exists as admin/system
apiStore.login("dark", "dark").then(() => console.log("System logged into API"));

export class RoomManager {
  constructor() {
    this.rooms = new Map(); // Map<roomId, { players: [], game: null }>
    this.waitingPlayers = []; // Queue of players waiting
  }

  matchmake(player) {
    // If someone is waiting, pair them
    if (this.waitingPlayers.length > 0) {
      const opponent = this.waitingPlayers.shift();
      const roomId = uuidv4();

      this.createRoom(roomId, player, opponent);
    } else {
      this.waitingPlayers.push(player);
      sendMessage(player, { type: 'WAITING', data: 'Waiting for an opponent...' });
    }
  }

  createRoom(roomId, player1, player2) {
    // Assign room
    player1.roomId = roomId;
    player2.roomId = roomId;

    const p1Color = Math.random() < 0.5 ? 'white' : 'black';
    const p2Color = p1Color === 'white' ? 'black' : 'white';

    // Store localized game state
    this.rooms.set(roomId, {
      id: roomId,
      players: [player1, player2],
      white: p1Color === 'white' ? player1 : player2,
      black: p2Color === 'white' ? player1 : player2,
      moves: [], // Store moves locally
      saved: false
    });

    console.log(`Player1 : ${player1?.ws?.readyState}`);
    sendMessage(player1, {
      type: 'MATCH_FOUND',
      data: {
        color: p1Color,
        opponent: player2.profile,
        roomId
      }
    });

    console.log(`Player2 : ${player2?.ws?.readyState}`);
    sendMessage(player2, {
      type: 'MATCH_FOUND',
      data: {
        color: p2Color,
        opponent: player1.profile,
        roomId
      }
    });

    console.log(`⚔️ Game started: ${player1.profile.username} vs ${player2.profile.username} (Room: ${roomId})`);
  }

  broadcastMove(player, move) {
    const room = this.rooms.get(player.roomId);
    if (!room) return;

    console.log(move);

    // Add move to history
    // Current move format from frontend usually contains { from, to, fen, ... }
    // Schema expects { fen, date }
    room.moves.push({
      fen: move.fen,
      from: move.from,
      to: move.to,
      promotion: move.promotion,
      date: new Date()
    });

    // Broadcast to OTHER players (not the sender)
    broadcastRoom(room, { type: 'MOVE', data: move }, player.id);
  }

  broadcastChat(player, message) {
    const room = this.rooms.get(player.roomId);
    if (!room) return;
    broadcastRoom(room, { type: 'CHAT', data: { sender: player.profile.pseudo, text: message } });
  }

  handleDisconnect(player) {
    if (player.roomId) {
      const room = this.rooms.get(player.roomId);
      if (room) {
        broadcastRoom(room, { type: 'OPPONENT_LEFT', data: null });

        // If not saved, maybe save as generic end or win for other?
        // Usually opponent left means other wins.
        if (!room.saved) {
          const winner = room.players.find(p => p.id !== player.id);
          // Assume winner color wins? Or just abort? 
          // Let's mark it as 'aborted' or similar if supported, or just 'opponent_left'
          // If we want a strict result:
          const result = room.white.id === winner.id ? 'white' : 'black';
          this.saveGame(room, result);
        }

        this.rooms.delete(player.roomId);
      }
    } else {
      this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== player.id);
    }
  }

  broadcastMate(player) { // Player who SENT mate (made the move) WINS
    const room = this.rooms.get(player.roomId);
    if (!room) return;

    broadcastRoom(room, { type: 'MATE', data: player });

    // Player who sent 'MATE' typically just made the move that delivered mate.
    // So if 'white' sent MATE, white wins.
    // However, the `player` arg is the one sending the message.
    // Let's assume sender is winner.
    if (room.players.includes(player)) {
      const result = room.white.id === player.id ? 'white' : 'black';
      this.saveGame(room, result);
    }
  }

  broadcastStalemate(player) {
    const room = this.rooms.get(player.roomId);
    if (!room) return;
    broadcastRoom(room, { type: 'STALEMATE', data: player });
    this.saveGame(room, 'draw');
  }

  broadcastDraw(player) {
    const room = this.rooms.get(player.roomId);
    if (!room) return;
    broadcastRoom(room, { type: 'DRAW', data: player });
    this.saveGame(room, 'draw');
  }

  broadcastResign(player) { // Player who resigns LOSES
    const room = this.rooms.get(player.roomId);
    if (!room) return;
    broadcastRoom(room, { type: 'RESIGN', data: player });

    const winner = room.players.find(p => p.id !== player.id);
    const result = room.white.id === winner.id ? 'white' : 'black';
    this.saveGame(room, result);
  }

  async saveGame(room, result) {
    if (room.saved) return;
    room.saved = true;

    const whiteId = room.white.profile?.id || room.white.profile?._id || room.white.id;
    const blackId = room.black.profile?.id || room.black.profile?._id || room.black.id;

    console.log(`Saving game ${room.id}: White(${whiteId}) vs Black(${blackId}) - Result: ${result}`);

    await apiStore.createGame(room.id, whiteId, blackId, room.moves, result);
  }
}
