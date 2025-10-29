import { Player } from '../models/Player.js';

export class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  addPlayer(ws, profile = null) {
    const id = crypto.randomUUID();
    const player = new Player(id, ws, profile);
    this.players.set(id, player);

    player.send({ type: 'CONNECTED', id, profile });
    console.log(`👤 Player connected: ${id} (${profile?.profilename ?? 'Guest'})`);
    return player;
  }

  removePlayer(id) {
    if (this.players.has(id)) {
      this.players.delete(id);
      console.log(`❌ Player disconnected: ${id}`);
    }
  }

  getPlayerByWS(ws) {
    for (const player of this.players.values()) {
      if (player.ws === ws) return player;
    }
    return null;
  }

  getPlayerById(id) {
    return this.players.get(id) || null;
  }
}
