export function sendMessage(player, msg) {
  if (player && player.ws.readyState === 1) {
    player.ws.send(JSON.stringify(msg));
  }
}

export function broadcastRoom(room, msg) {
  room.players.forEach(p => sendMessage(p, msg));
}