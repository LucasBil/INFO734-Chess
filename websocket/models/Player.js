export class Player {
    constructor(id, ws, profile = null) {
        this.id = id;
        this.ws = ws;
        this.profile = profile;
    }

    send(payload) {
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            this.ws.send(JSON.stringify(payload));
        }
    }
}