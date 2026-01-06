// stores/api.js
import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', {
    state: () => ({
        apiUrl: `http://${window.location.hostname}:3000/`,
        token: null,
        expiresIn: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        loadStorage() {
            const auth = localStorage.getItem('auth');
            if (auth) {
                const json = JSON.parse(auth);
                this.token = json.token
                this.expiresIn = json.expiresIn
            }
        },
        setAuthentification(token, expiresIn) {
            localStorage.setItem('auth', JSON.stringify({ "token": token, "expiresIn": expiresIn }));
            this.token = token;
            this.expiresIn = expiresIn;
        },
        removeAuthentification() {
            localStorage.removeItem('auth');
            this.token = null;
            this.expiresIn = null;
        },
        //#region AUTH Route
        async register(username, email, password) {
            try {
                const response = await fetch(this.apiUrl + 'auth/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching items:', err)
            }
        },
        async login(identifier, password) {
            try {
                const response = await fetch(this.apiUrl + 'auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ identifier, password })
                })
                const json = await response.json()
                this.setAuthentification(json.accessToken, json.expiresIn);
                return json
            } catch (err) {
                console.error('Error logging in:', err)
            }
        },
        async refreshToken() {
            try {
                const response = await fetch(this.apiUrl + 'auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const json = await response.json()
                this.setAuthentification(json.accessToken, json.expiresIn);
                return json
            } catch (err) {
                this.error = err.message
                console.error('Error refreshing token:', err)
            }
        },
        async logout() {
            try {
                const response = await fetch(this.apiUrl + 'auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                this.removeAuthentification();
                return await response.json();
            } catch (err) {
                this.error = err.message
                console.error('Error logging out:', err)
            }
        },
        //#endregion

        //#region GAMES Route
        async fetchAllGames() {
            try {
                const response = await fetch(this.apiUrl + 'games', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching games:', err)
            }
        },
        async createGame(sessionId, white, black) {
            try {
                const response = await fetch(this.apiUrl + 'games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId, white, black })
                })
                return await response.json();
            } catch (err) {
                console.error('Error creating game:', err)
            }
        },
        async fetchUserGames(userId) {
            try {
                const response = await fetch(this.apiUrl + `games/player/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching user games:', err)
            }
        },
        async fetchUserWhiteGames(userId) {
            try {
                const response = await fetch(this.apiUrl + `games/white/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching user games:', err)
            }
        },
        async fetchUserBlackGames(userId) {
            try {
                const response = await fetch(this.apiUrl + `games/black/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching user games:', err)
            }
        },
        async fetchGameById(gameId) {
            try {
                const response = await fetch(this.apiUrl + `games/${gameId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching game by id:', err)
            }
        },
        async updateGame(gameId, updateData) {
            try {
                const response = await fetch(this.apiUrl + `games/${gameId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify(updateData)
                })
                return await response.json();
            } catch (err) {
                console.error('Error updating game:', err)
            }
        },
        async deleteGame(gameId) {
            try {
                const response = await fetch(this.apiUrl + `games/${gameId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error deleting game:', err)
            }
        },
        async addMoveToGame(gameId, moveData) {
            try {
                const response = await fetch(this.apiUrl + `games/${gameId}/move`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify(moveData)
                })
                return await response.json();
            } catch (err) {
                console.error('Error adding move to game:', err)
            }
        },
        //#endregion

        //#region USERS Route
        async getAllUsers() {
            try {
                const response = await fetch(this.apiUrl + 'users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching all users:', err)
            }
        },
        async getUserByUsername(username) {
            try {
                const response = await fetch(this.apiUrl + `users/username/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching user by username:', err)
            }
        },
        async getUserByEmail(email) {
            try {
                const response = await fetch(this.apiUrl + `users/email/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching user by email:', err)
            }
        },
        async getUserById(userId) {
            try {
                const response = await fetch(this.apiUrl + `users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                })
                return await response.json();
            } catch (err) {
                console.error('Error fetching user by id:', err)
            }
        },
        async updateUser(userId, updateData) {
            try {
                const response = await fetch(this.apiUrl + `users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify(updateData)
                })
                return await response.json();
            } catch (err) {
                console.error('Error updating user:', err)
            }
        },
        async deleteUser(userId) {
            try {
                const response = await fetch(this.apiUrl + `users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                return await response.json();
            } catch (err) {
                console.error('Error deleting user:', err)
            }
        },
        //#endregion
    }
});