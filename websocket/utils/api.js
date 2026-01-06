export class ApiStore {
    constructor() {
        // Use 'backend' as hostname because we are running inside Docker and need to reach the backend container.
        // Use process.env.API_URL if available for flexibility.
        this.apiUrl = process.env.API_URL || 'http://backend:3000/';
        this.token = null;
    }

    async login(identifier, password) {
        try {
            const response = await fetch(this.apiUrl + 'auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password })
            });
            const json = await response.json();
            if (json.accessToken) {
                this.token = json.accessToken;
            }
            return json;
        } catch (err) {
            console.error('Error logging in:', err);
            return null;
        }
    }

    async createGame(sessionId, whiteId, blackId, moves = [], result = null) {
        try {
            const body = {
                sessionId: sessionId,
                white: whiteId,
                black: blackId,
                moves: moves,
                result: result
            };

            console.log(body);
            console.log(this.token);

            const response = await fetch(this.apiUrl + 'games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization might be needed if the endpoint is protected
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(body)
            });

            const json = await response.json();
            console.log(json);
            return json;
        } catch (err) {
            console.error('Error creating game:', err);
        }
    }
}
